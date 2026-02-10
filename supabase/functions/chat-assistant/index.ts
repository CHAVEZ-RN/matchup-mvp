import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.3');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch all data in parallel
    const [
      { data: coachProfile },
      { data: profile },
      { data: bookings },
      { data: blockings },
      { data: pendingPayments },
      { data: recentChats },
    ] = await Promise.all([
      supabase.from('coach_profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('bookings').select('*').eq('coach_id', user.id).gte('session_date', today).order('session_date', { ascending: true }),
      supabase.from('coach_blockings').select('*').eq('coach_id', user.id).gte('blocked_date', today).order('blocked_date', { ascending: true }),
      supabase.from('payments').select(`*, bookings!inner(*, coach_id)`).eq('bookings.coach_id', user.id).eq('payment_status', 'pending').not('payment_receipt_url', 'is', null),
      supabase.from('booking_chats').select('*').eq('coach_id', user.id).order('created_at', { ascending: false }).limit(10),
    ]);

    // Format coach profile
    const profileSection = coachProfile ? `
YOUR PROFILE:
- Name: ${profile?.full_name || 'Not set'}
- Business: ${coachProfile.business_name || 'Not set'}
- Sports: ${coachProfile.sports_offered?.join(', ') || 'None'}
- Locations: ${coachProfile.locations?.join(', ') || 'None'}
- Hourly Rate: ₱${coachProfile.hourly_rate}
- Experience: ${coachProfile.years_of_experience || 'Not set'} years
- Bio: ${coachProfile.bio || 'Not set'}
- Cancellation Policy: ${coachProfile.cancellation_policy || 'Not set'}
` : 'YOUR PROFILE: Not set up yet';

    // Format bookings by status
    const formatBooking = (b: any) => `  - ${b.booking_reference || 'N/A'} | ${b.athlete_name} | ${b.sport} | ${b.session_date} ${b.session_time} | ${b.duration_hours}hr | ₱${b.total_amount} | ${b.location}`;
    
    const pending = bookings?.filter((b: any) => b.status === 'pending') || [];
    const approved = bookings?.filter((b: any) => b.status === 'approved') || [];
    const completed = bookings?.filter((b: any) => b.status === 'completed') || [];
    const cancelled = bookings?.filter((b: any) => b.status === 'cancelled') || [];

    const bookingsSection = `
UPCOMING BOOKINGS:
Pending (${pending.length}):
${pending.length ? pending.map(formatBooking).join('\n') : '  None'}
Approved (${approved.length}):
${approved.length ? approved.map(formatBooking).join('\n') : '  None'}
Completed (${completed.length}):
${completed.length ? completed.map(formatBooking).join('\n') : '  None'}
Cancelled (${cancelled.length}):
${cancelled.length ? cancelled.map(formatBooking).join('\n') : '  None'}`;

    // Format blocked times
    const blockingsSection = `
BLOCKED TIME SLOTS:
${blockings && blockings.length > 0 ? blockings.map((b: any) => `  - ${b.blocked_date} | ${b.start_time}-${b.end_time}${b.reason ? ` | Reason: ${b.reason}` : ''}`).join('\n') : '  No blocked times'}`;

    // Format pending payments
    const paymentsSection = `
PENDING PAYMENT VERIFICATIONS:
${pendingPayments && pendingPayments.length > 0 ? pendingPayments.map((p: any) => `  - Ref: ${p.bookings.booking_reference} | ${p.bookings.athlete_name} | ₱${p.amount} | ${p.payment_method.toUpperCase()} | Receipt: ${p.payment_receipt_url}`).join('\n') : '  No pending payments'}`;

    // Format recent chats
    const chatsSection = `
RECENT ATHLETE INQUIRIES (last 10):
${recentChats && recentChats.length > 0 ? recentChats.map((c: any) => {
      const msgs = Array.isArray(c.messages) ? c.messages : [];
      const lastUserMsg = [...msgs].reverse().find((m: any) => m.role === 'user');
      return `  - Session ${c.session_id.slice(0, 8)} | ${new Date(c.created_at).toLocaleDateString()} | Last question: "${lastUserMsg?.content?.slice(0, 80) || 'N/A'}"`;
    }).join('\n') : '  No recent inquiries'}`;

    const systemPrompt = `You are the MatchUp AI Assistant for Coach. You help coaches with booking management, payment verification, schedule management, and platform features.

${profileSection}
${bookingsSection}
${blockingsSection}
${paymentsSection}
${chatsSection}

PAYMENT VERIFICATION WORKFLOW:
When a coach wants to verify a payment:
1. Show them the receipt information
2. Ask them to check their payment app
3. Ask for the LAST 4 DIGITS of the transaction reference number to confirm
4. When they provide correct digits, respond with "CONFIRM_PAYMENT:{payment_id}"
5. If they want to dispute, respond with "DISPUTE_PAYMENT:{payment_id}:{reason}"

IMPORTANT:
- Always be helpful and guide coaches through verification
- Security: Only confirm with last 4 digits
- Disputes are allowed within 12 hours for bank processing issues
- Keep responses concise and actionable
- Use the data above to answer questions about bookings, schedules, profile, and payments accurately
- Today's date is ${today}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Check for payment confirmation or dispute commands
    if (reply.includes('CONFIRM_PAYMENT:')) {
      const paymentId = reply.split('CONFIRM_PAYMENT:')[1].split('\n')[0].trim();
      
      const { error: confirmError } = await supabase
        .from('payments')
        .update({ payment_status: 'paid', payment_date: new Date().toISOString() })
        .eq('id', paymentId);

      if (confirmError) console.error('Payment confirmation error:', confirmError);

      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('id', paymentId)
        .maybeSingle();

      if (payment) {
        await supabase.from('bookings').update({ status: 'completed' }).eq('id', payment.booking_id);
      }

      return new Response(
        JSON.stringify({ reply: 'Payment confirmed successfully! The booking is now marked as completed.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (reply.includes('DISPUTE_PAYMENT:')) {
      const parts = reply.split('DISPUTE_PAYMENT:')[1].split(':');
      const paymentId = parts[0].trim();
      const reason = parts.slice(1).join(':').trim();
      
      const { error: disputeError } = await supabase
        .from('payments')
        .update({ dispute_initiated_at: new Date().toISOString(), dispute_reason: reason })
        .eq('id', paymentId);

      if (disputeError) console.error('Dispute error:', disputeError);

      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('id', paymentId)
        .maybeSingle();

      if (payment) {
        await supabase.from('bookings').update({ status: 'pending' }).eq('id', payment.booking_id);
      }

      return new Response(
        JSON.stringify({ reply: 'Payment disputed. The booking status has been updated to pending for resolution.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
