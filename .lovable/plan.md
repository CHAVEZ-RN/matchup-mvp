

## Fix: Change Coach Availability to 24/7

### Problem

The previous plan defined coach working hours as 6:00 AM - 9:00 PM. However, coaches should be available 24/7 by default, with availability only restricted by their manually created blocked times and existing bookings.

### Change

**File:** `supabase/functions/booking-assistant/index.ts`

Update the `AVAILABILITY RULES` section in the system prompt to:

- State that the coach is available **24 hours a day, 7 days a week** by default
- Clarify that only existing bookings and manually blocked times restrict availability
- Remove references to fixed working hours (6 AM - 9 PM)
- Keep the instruction that a single booking only blocks its specific time range, not the whole day

The updated prompt section will read something like:

```
AVAILABILITY RULES:
- The coach is available 24/7 by default. There are no fixed working hours.
- Availability is ONLY restricted by existing bookings and blocked times listed below.
- A booking ONLY blocks its specific time range. The rest of the day remains open.
- Example: If there is a booking from 2:00 PM to 4:00 PM, the coach is still available before 2:00 PM and after 4:00 PM.
- Only reject a requested time if it actually OVERLAPS with an existing booking or blocked time.
- If the requested time overlaps, suggest alternative times on the SAME day that are still free.
- A day is only fully unavailable if bookings and blockings cover the entire 24-hour window.
```

The edge function will be redeployed automatically after the edit.

