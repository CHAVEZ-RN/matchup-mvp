import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, coachId, sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch coach profile and details
    const { data: coachProfile, error: coachError } = await supabase
      .from('coach_profiles')
      .select(`
        *,
        profiles!inner(full_name, phone)
      `)
      .eq('id', coachId)
      .single();

    if (coachError || !coachProfile) {
      console.error('Coach fetch error:', coachError);
      throw new Error('Coach not found');
    }

    // Fetch coach's existing bookings
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('session_date, session_time, duration_hours, status')
      .eq('coach_id', coachId)
      .in('status', ['approved', 'pending'])
      .gte('session_date', new Date().toISOString().split('T')[0]);

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError);
      throw new Error('Failed to fetch bookings');
    }

    // Fetch coach's blocked times
    const { data: blockedTimes } = await supabase
      .from('coach_blockings')
      .select('blocked_date, start_time, end_time, reason')
      .eq('coach_id', coachId)
      .gte('blocked_date', new Date().toISOString().split('T')[0])
      .order('blocked_date', { ascending: true });

    // Find next available slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextSlot = { date: tomorrow.toISOString().split('T')[0], time: '09:00' };

    // Check if user has an approved booking awaiting payment
    const { data: approvedBooking } = await supabase
      .from('bookings')
      .select(`
        *,
        payments (*)
      `)
      .eq('athlete_phone', messages[messages.length - 1]?.content || '')
      .eq('status', 'approved')
      .is('payments.payment_status', 'pending')
      .single();

    let systemPrompt = '';
    
    if (approvedBooking && (approvedBooking.payment_method === 'gcash' || approvedBooking.payment_method === 'maya')) {
      // Payment receipt upload flow
      systemPrompt = `You are a payment collection assistant for Coach ${coachProfile.profiles.full_name}.

BOOKING DETAILS:
- Booking Reference: ${approvedBooking.booking_reference}
- Date: ${approvedBooking.session_date} at ${approvedBooking.session_time}
- Payment Method: ${approvedBooking.payment_method?.toUpperCase()}
- Amount: ₱${approvedBooking.total_amount}

TASK:
Your booking has been APPROVED by the coach! Now you need to send payment via ${approvedBooking.payment_method?.toUpperCase()}.

Ask the user to upload a screenshot of their payment receipt. Once they mention they've sent it or describe the transaction, respond with "RECEIPT_READY" to indicate they should upload the file.

Be friendly and guide them through the payment process.`;
    } else {
      // Regular booking flow
      systemPrompt = `You are a friendly and professional booking assistant for Coach ${coachProfile.profiles.full_name}.

COACH DETAILS:
- Business Name: ${coachProfile.business_name || 'Not specified'}
- Sports Offered: ${coachProfile.sports_offered.join(', ')}
- Locations Available: ${coachProfile.locations.join(', ')}
- Hourly Rate: ₱${coachProfile.hourly_rate}/hour
- Years of Experience: ${coachProfile.years_of_experience || 'Not specified'}
- Next Available Slot: ${nextSlot.date} at ${nextSlot.time}

CONVERSATION FLOW - ASK ONE QUESTION AT A TIME:

1. First, confirm they want to book with this coach (if this is the first message)
2. Ask for their full name
3. Ask for their phone number
4. Ask for their email (mention it's optional)
5. Ask which sport they want to train (show available options: ${coachProfile.sports_offered.join(', ')})
6. Ask for their preferred location (show available options: ${coachProfile.locations.join(', ')})
7. Ask for their preferred date and time
8. Ask for duration in hours (suggest common options like 1, 1.5, 2 hours)
9. Ask for payment method (GCash, Maya, or Cash)
10. Ask if they have any special requests or notes (optional)
11. Summarize all details and calculate total cost, then respond with "READY_TO_BOOK" followed by the JSON

IMPORTANT RULES:
- Ask ONLY ONE question per message
- Wait for the user's answer before moving to the next question
- Be warm and conversational
- Validate answers (e.g., sport and location must match available options)
- When you have ALL required information (name, phone, sport, location, date, time, duration, payment_method), summarize everything and respond with "READY_TO_BOOK" followed by JSON: {athlete_name, athlete_phone, athlete_email, sport, location, session_date, session_time, duration_hours, payment_method, notes}

EXISTING BOOKINGS TO AVOID CONFLICTS:
${existingBookings.length > 0 ? existingBookings.map(b => `- ${b.session_date} at ${b.session_time} for ${b.duration_hours} hours (${b.status})`).join('\n') : 'No existing bookings'}

BLOCKED TIMES (Coach is unavailable during these times - DO NOT allow bookings during these slots):
${blockedTimes && blockedTimes.length > 0 ? blockedTimes.map(b => `- ${b.blocked_date} from ${b.start_time} to ${b.end_time}${b.reason ? ` (${b.reason})` : ''}`).join('\n') : 'No blocked times'}`;
    }

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
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
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
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    console.log('AI Reply:', aiReply);

    // Check if the AI has collected all information and is ready to book
    if (aiReply.includes('READY_TO_BOOK')) {
      const jsonMatch = aiReply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const bookingData = JSON.parse(jsonMatch[0]);
          
          // Validate required fields
          if (!bookingData.athlete_name || !bookingData.athlete_phone || !bookingData.sport || 
              !bookingData.location || !bookingData.session_date || !bookingData.session_time || 
              !bookingData.duration_hours || !bookingData.payment_method) {
            throw new Error('Missing required booking information');
          }

          // Validate payment method
          if (!['gcash', 'maya', 'cash'].includes(bookingData.payment_method.toLowerCase())) {
            return new Response(
              JSON.stringify({ 
                reply: `Invalid payment method. Please choose GCash, Maya, or Cash.`
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Check for conflicts
          const requestStart = new Date(`${bookingData.session_date}T${bookingData.session_time}`);
          const requestEnd = new Date(requestStart);
          requestEnd.setHours(requestEnd.getHours() + Number(bookingData.duration_hours));

          const conflicts = existingBookings.filter(booking => {
            const bookingStart = new Date(`${booking.session_date}T${booking.session_time}`);
            const bookingEnd = new Date(bookingStart);
            bookingEnd.setHours(bookingEnd.getHours() + Number(booking.duration_hours));
            return bookingStart < requestEnd && bookingEnd > requestStart;
          });

          if (conflicts.length > 0) {
            return new Response(
              JSON.stringify({ 
                reply: `Sorry, this time slot conflicts with an existing booking on ${conflicts[0].session_date} at ${conflicts[0].session_time}. Please choose a different time.`
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Validate and format Philippine phone number
          const phoneFormatted = bookingData.athlete_phone.replace(/[\s\-\(\)]/g, '');
          let formattedPhone = phoneFormatted;
          
          if (phoneFormatted.startsWith('0')) {
            formattedPhone = '+63' + phoneFormatted.substring(1);
          } else if (!phoneFormatted.startsWith('+63')) {
            formattedPhone = '+63' + phoneFormatted;
          }
          
          // Validate phone format
          if (!/^\+63[0-9]{10}$/.test(formattedPhone)) {
            return new Response(
              JSON.stringify({ 
                reply: `Invalid phone number format. Please provide a valid Philippine phone number (e.g., +639171234567 or 09171234567).`
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          // Create booking
          const total_amount = bookingData.duration_hours * Number(coachProfile.hourly_rate);

          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
              coach_id: coachId,
              athlete_name: bookingData.athlete_name,
              athlete_phone: formattedPhone,
              athlete_email: bookingData.athlete_email || null,
              sport: bookingData.sport,
              location: bookingData.location,
              session_date: bookingData.session_date,
              session_time: bookingData.session_time,
              duration_hours: bookingData.duration_hours,
              total_amount: total_amount,
              payment_method: bookingData.payment_method.toLowerCase(),
              notes: bookingData.notes || null,
              status: 'pending'
            })
            .select()
            .single();

          if (bookingError) {
            console.error('Booking creation error:', bookingError);
            throw new Error('Failed to create booking');
          }

          // Send email notification to coach
          try {
            await fetch(`${SUPABASE_URL}/functions/v1/send-booking-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
              },
              body: JSON.stringify({
                to: coachProfile.profiles.email || '',
                type: 'booking_created',
                bookingDetails: {
                  athleteName: bookingData.athlete_name,
                  coachName: coachProfile.profiles.full_name,
                  sport: bookingData.sport,
                  location: bookingData.location,
                  sessionDate: bookingData.session_date,
                  sessionTime: bookingData.session_time,
                  duration: bookingData.duration_hours,
                  totalAmount: total_amount,
                  bookingReference: booking.booking_reference
                }
              })
            });
          } catch (emailError) {
            console.error('Failed to send booking email:', emailError);
          }

          // Create payment record
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              booking_id: booking.id,
              amount: total_amount,
              payment_method: bookingData.payment_method.toLowerCase(),
              payment_status: 'pending'
            });

          if (paymentError) {
            console.error('Payment creation error:', paymentError);
          }

          // Store chat with booking
          await supabase
            .from('booking_chats')
            .insert({
              coach_id: coachId,
              session_id: sessionId,
              messages: [...messages, { role: 'assistant', content: aiReply }],
              booking_id: booking.id
            });

          const paymentInfo = bookingData.payment_method.toLowerCase() === 'cash' 
            ? '\n\n💵 Payment Method: Cash (pay upon session)'
            : `\n\n💳 Payment Method: ${bookingData.payment_method.toUpperCase()}\n📱 You will receive payment instructions once the coach approves your booking.`;

          return new Response(
            JSON.stringify({ 
              reply: `Perfect! Your booking has been submitted successfully.\n\n📋 Booking Reference: ${booking.booking_reference}\n💰 Total Amount: ₱${total_amount}${paymentInfo}\n\nCoach ${coachProfile.profiles.full_name} will review and confirm your booking soon!`,
              bookingCreated: true,
              bookingReference: booking.booking_reference
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        } catch (parseError) {
          console.error('Parse error:', parseError);
          return new Response(
            JSON.stringify({ 
              reply: aiReply.replace('READY_TO_BOOK', '').trim()
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Store chat conversation
    await supabase
      .from('booking_chats')
      .upsert({
        coach_id: coachId,
        session_id: sessionId,
        messages: [...messages, { role: 'assistant', content: aiReply }]
      }, {
        onConflict: 'session_id'
      });

    return new Response(
      JSON.stringify({ reply: aiReply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in booking-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
