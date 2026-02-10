

## Add Coach "Blockings" (Time Blocking) Feature

This feature allows coaches to block specific dates/times so athletes cannot book during those periods. The blocked times will also be fed into the booking chatbot to inform clients.

### What You'll Get

1. A "Blockings" button in the Bookings tab header
2. A dialog to add/remove blocked time slots (date, start time, end time, optional reason)
3. Blocked times shown on the calendar with a distinct visual indicator
4. The booking chatbot will check blocked times and tell clients those slots are unavailable

### Implementation Steps

**1. Database: Create `coach_blockings` table**

A new table to store blocked time slots per coach:
- `id` (uuid, primary key)
- `coach_id` (uuid, references coach who created it)
- `blocked_date` (date)
- `start_time` (time)
- `end_time` (time)
- `reason` (text, optional -- e.g. "Personal", "Holiday")
- `created_at` (timestamp)

RLS policies:
- Coaches can INSERT/UPDATE/DELETE/SELECT their own blockings
- Public can SELECT blockings (needed for the chatbot to check availability)

**2. Frontend: Dashboard Bookings Tab -- Add "Blockings" Button + Dialog**

In `src/pages/Dashboard.tsx`:
- Add a "Blockings" button (with a Shield/Ban icon) next to the "Bookings" heading
- Clicking it opens a dialog/sheet showing existing blocked slots with delete option
- An "Add Blocking" form inside the dialog: date picker, start time, end time, optional reason
- Blocked dates get a red indicator on the BookingsCalendar

**3. New Component: `BlockingsDialog.tsx`**

A dialog component that:
- Lists all current blockings for the coach in a clean list
- Has a form to add new blockings (date, start time, end time, reason)
- Allows deleting existing blockings
- Fetches and mutates via Supabase

**4. Calendar Integration**

Update `BookingsCalendar.tsx`:
- Accept a `blockings` prop
- Show blocked dates with a distinct red/gray indicator on the calendar
- When a blocked date is selected, show the blocked time ranges alongside any bookings

**5. Chatbot Integration**

Update `supabase/functions/booking-assistant/index.ts`:
- Fetch `coach_blockings` table for the coach (future dates)
- Include blocked times in the system prompt so the AI tells clients those slots are unavailable and suggests alternatives

### Technical Details

```text
+------------------+       +-------------------+
| coach_blockings  |       | booking-assistant |
|------------------|       | (edge function)   |
| id               |       |-------------------|
| coach_id         | ----> | Fetches blockings |
| blocked_date     |       | Includes in prompt|
| start_time       |       +-------------------+
| end_time         |
| reason           |
+------------------+
        |
        v
+------------------+
| Dashboard.tsx    |
| BlockingsDialog  |
| BookingsCalendar |
+------------------+
```

**Files to create:**
- `src/components/BlockingsDialog.tsx`

**Files to modify:**
- `src/pages/Dashboard.tsx` -- add Blockings button, fetch blockings, pass to calendar
- `src/components/BookingsCalendar.tsx` -- display blocked date indicators
- `supabase/functions/booking-assistant/index.ts` -- fetch and include blockings in prompt

**Database migration:**
- Create `coach_blockings` table with RLS policies

