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
      throw new Error('Failed to fetch bookings');
    }

    // Find next available slot (basic implementation - next day at 9 AM if no bookings)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextSlot = existingBookings.length === 0 
      ? { date: tomorrow.toISOString().split('T')[0], time: '09:00' }
      : { date: tomorrow.toISOString().split('T')[0], time: '09:00' };

    const systemPrompt = `You are a friendly and professional booking assistant for Coach ${coachProfile.profiles.full_name}.

COACH DETAILS:
- Business Name: ${coachProfile.business_name || 'Not specified'}
- Sports Offered: ${coachProfile.sports_offered.join(', ')}
- Locations Available: ${coachProfile.locations.join(', ')}
- Hourly Rate: ₱${coachProfile.hourly_rate}/hour
- Years of Experience: ${coachProfile.years_of_experience || 'Not specified'}
- Certifications: ${coachProfile.certifications?.join(', ') || 'None listed'}
- Next Available Slot: ${nextSlot.date} at ${nextSlot.time}

YOUR ROLE:
Help athletes book training sessions by collecting the following information:
1. Full Name
2. Phone Number
3. Email Address
4. Sport (must be one of: ${coachProfile.sports_offered.join(', ')})
5. Location (must be one of: ${coachProfile.locations.join(', ')})
6. Preferred Date and Time
7. Duration (in hours)
8. Optional Notes

IMPORTANT GUIDELINES:
- Start with a friendly introduction mentioning the coach's name and sports offered
- Mention the next available slot upfront
- Validate that the sport and location match what the coach offers
- When discussing pricing, calculate: Hourly Rate × Duration = Total Amount
- Always check availability using the check_availability tool before confirming
- If a slot is unavailable, inform the athlete and suggest alternative times
- Be conversational and guide the athlete step-by-step
- Once all information is collected and validated, use the create_booking tool
- After creating the booking, inform the athlete that their request is pending coach approval

CURRENT BOOKINGS (to avoid conflicts):
${existingBookings.map(b => `- ${b.session_date} at ${b.session_time} for ${b.duration_hours} hours (${b.status})`).join('\n') || 'No existing bookings'}`;

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
        tools: [
          {
            type: 'function',
            name: 'check_availability',
            description: 'Check if a specific date and time slot is available for booking',
            parameters: {
              type: 'object',
              properties: {
                date: { type: 'string', description: 'Date in YYYY-MM-DD format' },
                time: { type: 'string', description: 'Time in HH:MM format' },
                duration: { type: 'number', description: 'Duration in hours' }
              },
              required: ['date', 'time', 'duration']
            }
          },
          {
            type: 'function',
            name: 'create_booking',
            description: 'Create a new booking request once all information is collected and validated',
            parameters: {
              type: 'object',
              properties: {
                athlete_name: { type: 'string' },
                athlete_phone: { type: 'string' },
                athlete_email: { type: 'string' },
                sport: { type: 'string' },
                location: { type: 'string' },
                session_date: { type: 'string', description: 'YYYY-MM-DD format' },
                session_time: { type: 'string', description: 'HH:MM format' },
                duration_hours: { type: 'number' },
                notes: { type: 'string' }
              },
              required: ['athlete_name', 'athlete_phone', 'sport', 'location', 'session_date', 'session_time', 'duration_hours']
            }
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    // Handle tool calls if present
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      const toolCall = aiMessage.tool_calls[0];
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === 'check_availability') {
        const { date, time, duration } = functionArgs;
        const endTime = new Date(`${date}T${time}`);
        endTime.setHours(endTime.getHours() + duration);

        const conflicts = existingBookings.filter(booking => {
          const bookingStart = new Date(`${booking.session_date}T${booking.session_time}`);
          const bookingEnd = new Date(bookingStart);
          bookingEnd.setHours(bookingEnd.getHours() + Number(booking.duration_hours));

          const requestStart = new Date(`${date}T${time}`);
          const requestEnd = endTime;

          return bookingStart < requestEnd && bookingEnd > requestStart;
        });

        const isAvailable = conflicts.length === 0;
        const toolResult = {
          available: isAvailable,
          conflicts: conflicts.map(c => `${c.session_date} at ${c.session_time}`),
          message: isAvailable 
            ? `The slot is available!` 
            : `This time slot conflicts with existing bookings. Please choose a different time.`
        };

        return new Response(
          JSON.stringify({ 
            reply: toolResult.message,
            toolResult,
            requiresFollowup: !isAvailable
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (functionName === 'create_booking') {
        const total_amount = functionArgs.duration_hours * Number(coachProfile.hourly_rate);

        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            coach_id: coachId,
            athlete_name: functionArgs.athlete_name,
            athlete_phone: functionArgs.athlete_phone,
            athlete_email: functionArgs.athlete_email || null,
            sport: functionArgs.sport,
            location: functionArgs.location,
            session_date: functionArgs.session_date,
            session_time: functionArgs.session_time,
            duration_hours: functionArgs.duration_hours,
            total_amount: total_amount,
            notes: functionArgs.notes || null,
            status: 'pending'
          })
          .select()
          .single();

        if (bookingError) {
          throw new Error('Failed to create booking');
        }

        // Store chat conversation with booking
        await supabase
          .from('booking_chats')
          .insert({
            coach_id: coachId,
            session_id: sessionId,
            messages: messages,
            booking_id: booking.id
          });

        return new Response(
          JSON.stringify({ 
            reply: `Perfect! Your booking request has been submitted successfully. Booking Reference: ${booking.booking_reference}\n\nYou'll receive a confirmation once Coach ${coachProfile.profiles.full_name} approves your request. Total amount: ₱${total_amount}`,
            bookingCreated: true,
            bookingReference: booking.booking_reference
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Store chat conversation
    await supabase
      .from('booking_chats')
      .upsert({
        coach_id: coachId,
        session_id: sessionId,
        messages: [...messages, { role: 'assistant', content: aiMessage.content }]
      }, {
        onConflict: 'session_id'
      });

    return new Response(
      JSON.stringify({ reply: aiMessage.content }),
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
