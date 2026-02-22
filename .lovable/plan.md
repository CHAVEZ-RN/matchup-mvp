

## Plan: Universal Blockings, Coaching Hours, and AI Integration

This plan implements three interconnected features with specific UI placement as requested.

---

### 1. Database Migration

**Add `coaching_hours` column to `coach_profiles`:**
- Type: `jsonb`, nullable, default `null` (null = 24/7 available)
- Stores: `{"start": "08:00", "end": "17:00"}`

**Create `coach_recurring_blockings` table:**
- `id` (uuid, PK), `coach_id` (uuid), `day_of_week` (integer 0-6), `start_time` (time), `end_time` (time), `reason` (text, nullable), `created_at` (timestamptz)
- RLS: coaches manage own rows, public can SELECT

---

### 2. Coaching Hours in Coach Profile Setup

**File:** `src/pages/CoachProfileSetup.tsx`

Place a new "Coaching Hours" card **right below the Profile Photo card** (line ~429, before "Basic Information").

- Toggle switch: "Set specific coaching hours" (off = available 24/7)
- When enabled: Start Time and End Time inputs appear
- State: `coachingHoursEnabled` boolean, `coachingStart` string, `coachingEnd` string
- Loads from `coach_profiles.coaching_hours` on page load (line ~98)
- Saves as `coaching_hours: { start, end }` or `null` in the `handleSubmit` profileData (line ~292)

---

### 3. Universal Blocking in BlockingsDialog

**File:** `src/components/BlockingsDialog.tsx`

Add a "Universal Blocking" checkbox **inside the existing "Add Blocked Time" form card**, right above the date picker.

When the checkbox is ticked:
- **Hide** the date picker
- **Show** day-of-week buttons in a row: `M`, `T`, `W`, `Th`, `F`, `Sat`, `Sun`
- Buttons are small, toggleable (multi-select), highlighted when selected
- Keep the existing Start Time, End Time, and Reason fields
- "Block Time" button inserts one row per selected day into `coach_recurring_blockings`

When the checkbox is unticked (default):
- Show the existing specific-date flow (unchanged)

**Below the form**, in the "Upcoming Blocked Times" section:
- Fetch and display recurring blockings from `coach_recurring_blockings`
- Show them with a "Recurring" badge, e.g. "Every Mon, 1:00 PM - 2:00 PM"
- Each has a delete button

New state variables: `isUniversal` (boolean), `selectedDays` (number[]), `recurringBlockings` (array)

---

### 4. Calendar Display Updates

**File:** `src/components/BookingsCalendar.tsx`
- Accept new `recurringBlockings` prop
- For the selected date, check if any recurring blockings match that day of the week
- Display them in the detail panel with a "Recurring" label alongside specific-date blockings
- Highlight days on the calendar that have recurring blockings

**File:** `src/pages/Dashboard.tsx`
- Fetch recurring blockings from `coach_recurring_blockings`
- Pass as `recurringBlockings` prop to `BookingsCalendar`

---

### 5. Booking Assistant (Client AI)

**File:** `supabase/functions/booking-assistant/index.ts`

- Fetch `coaching_hours` from `coach_profiles` (already in the query)
- Fetch `coach_recurring_blockings` for this coach
- Update AVAILABILITY RULES:
  - If `coaching_hours` is set: "The coach is only available from [start] to [end]"
  - If null: "The coach is available 24/7"
  - Add RECURRING BLOCKED TIMES section listing day + time ranges
- Add server-side validation: reject bookings outside coaching hours

---

### 6. Coach AI Assistant (Machi)

**File:** `supabase/functions/chat-assistant/index.ts`

- Fetch `coach_recurring_blockings` in the parallel data fetch
- Include coaching hours in the profile section
- Add RECURRING BLOCKED TIMES section to the system prompt

---

### Summary of Files Changed

| File | Change |
|------|--------|
| Migration SQL | New table + new column |
| `src/pages/CoachProfileSetup.tsx` | Coaching hours card below profile photo |
| `src/components/BlockingsDialog.tsx` | Universal blocking checkbox with day buttons |
| `src/components/BookingsCalendar.tsx` | Show recurring blockings on calendar |
| `src/pages/Dashboard.tsx` | Fetch and pass recurring blockings |
| `supabase/functions/booking-assistant/index.ts` | Coaching hours + recurring blockings in AI prompt |
| `supabase/functions/chat-assistant/index.ts` | Coaching hours + recurring blockings in AI prompt |

