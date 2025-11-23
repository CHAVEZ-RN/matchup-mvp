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

    // Get authorization header to identify coach
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Import Supabase client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.3');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get user from JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Fetch pending payments for this coach
    const { data: pendingPayments } = await supabase
      .from('payments')
      .select(`
        *,
        bookings!inner(
          *,
          coach_id
        )
      `)
      .eq('bookings.coach_id', user.id)
      .eq('payment_status', 'pending')
      .not('payment_receipt_url', 'is', null);

    let systemPrompt = `You are the MatchUp AI Assistant for Coach. You help coaches with:

1. Booking management (approvals, schedules)
2. Payment verification (GCash, Maya receipts)
3. Schedule conflicts
4. Platform features

PENDING PAYMENT VERIFICATIONS:
${pendingPayments && pendingPayments.length > 0 ? pendingPayments.map(p => `
- Booking Ref: ${p.bookings.booking_reference}
- Athlete: ${p.bookings.athlete_name}
- Amount: ₱${p.amount}
- Payment Method: ${p.payment_method.toUpperCase()}
- Receipt URL: ${p.payment_receipt_url}
`).join('\n') : 'No pending payments'}

PAYMENT VERIFICATION WORKFLOW:
When a coach wants to verify a payment:
1. Show them the receipt information
2. Ask them to check their ${pendingPayments?.[0]?.payment_method.toUpperCase()} account
3. Ask for the LAST 4 DIGITS of the transaction reference number to confirm
4. When they provide correct digits, respond with "CONFIRM_PAYMENT:{payment_id}"
5. If they want to dispute, respond with "DISPUTE_PAYMENT:{payment_id}:{reason}"

IMPORTANT:
- Always be helpful and guide coaches through verification
- Security: Only confirm with last 4 digits
- Disputes are allowed within 12 hours for bank processing issues
- Keep responses concise and actionable

Answer the user's question helpfully.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
        .update({ 
          payment_status: 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
      }

      // Update booking status to completed
      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('id', paymentId)
        .single();

      if (payment) {
        await supabase
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', payment.booking_id);
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
        .update({ 
          dispute_initiated_at: new Date().toISOString(),
          dispute_reason: reason
        })
        .eq('id', paymentId);

      if (disputeError) {
        console.error('Dispute error:', disputeError);
      }

      // Update booking status back to pending
      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('id', paymentId)
        .single();

      if (payment) {
        await supabase
          .from('bookings')
          .update({ status: 'pending' })
          .eq('id', payment.booking_id);
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
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
