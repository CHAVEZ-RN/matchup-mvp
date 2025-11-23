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

    // Find next available slot
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextSlot = { date: tomorrow.toISOString().split('T')[0], time: '09:00' };

    const systemPrompt = `You are a friendly and professional booking assistant for Coach ${coachProfile.profiles.full_name}.

COACH DETAILS:
- Business Name: ${coachProfile.business_name || 'Not specified'}
- Sports Offered: ${coachProfile.sports_offered.join(', ')}
- Locations Available: ${coachProfile.locations.join(', ')}
- Hourly Rate: ₱${coachProfile.hourly_rate}/hour
- Years of Experience: ${coachProfile.years_of_experience || 'Not specified'}
- Next Available Slot: ${nextSlot.date} at ${nextSlot.time}

YOUR ROLE:
Help athletes book training sessions by collecting information step-by-step:
1. Full Name
2. Phone Number
3. Email (optional)
4. Sport (must be one of: ${coachProfile.sports_offered.join(', ')})
5. Location (must be one of: ${coachProfile.locations.join(', ')})
6. Preferred Date and Time
7. Duration (in hours)
8. Any special notes

GUIDELINES:
- Be conversational and friendly
- Guide users step-by-step
- Validate that sport and location match coach's offerings
- When you have ALL required information, respond with exactly: "READY_TO_BOOK" followed by a JSON object with: athlete_name, athlete_phone, athlete_email, sport, location, session_date, session_time, duration_hours, notes
- Calculate total: ₱${coachProfile.hourly_rate} × duration = total amount
- Before confirming, check if the requested time conflicts with existing bookings

EXISTING BOOKINGS:
${existingBookings.length > 0 ? existingBookings.map(b => `- ${b.session_date} at ${b.session_time} for ${b.duration_hours} hours (${b.status})`).join('\n') : 'No existing bookings'}`;

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
              !bookingData.duration_hours) {
            throw new Error('Missing required booking information');
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

          // Create booking
          const total_amount = bookingData.duration_hours * Number(coachProfile.hourly_rate);

          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
              coach_id: coachId,
              athlete_name: bookingData.athlete_name,
              athlete_phone: bookingData.athlete_phone,
              athlete_email: bookingData.athlete_email || null,
              sport: bookingData.sport,
              location: bookingData.location,
              session_date: bookingData.session_date,
              session_time: bookingData.session_time,
              duration_hours: bookingData.duration_hours,
              total_amount: total_amount,
              notes: bookingData.notes || null,
              status: 'pending'
            })
            .select()
            .single();

          if (bookingError) {
            console.error('Booking creation error:', bookingError);
            throw new Error('Failed to create booking');
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

          return new Response(
            JSON.stringify({ 
              reply: `Perfect! Your booking has been submitted successfully.\n\n📋 Booking Reference: ${booking.booking_reference}\n💰 Total Amount: ₱${total_amount}\n\nCoach ${coachProfile.profiles.full_name} will review and confirm your booking soon!`,
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
