

## Plan: Universal Blockings, Coaching Hours, and AI Integration

This plan adds three major features: recurring (universal) blocked times, configurable coaching hours, and feeding all of this into both AI assistants.

---

### 1. Database Changes (Migration)

**Add `coaching_hours` column to `coach_profiles`:**
- Type: `jsonb`, nullable, default `null` (null = 24/7)
- Stores: `{"start": "08:00", "end": "17:00"}`

**Create new table `coach_recurring_blockings`:**

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| coach_id | uuid | References coach |
| day_of_week | integer | 0=Sunday, 1=Monday ... 6=Saturday |
| start_time | time | Block start |
| end_time | time | Block end |
| reason | text | Optional |
| created_at | timestamptz | Default now() |

RLS policies:
- Coaches can SELECT, INSERT, DELETE their own rows
- Public can SELECT (needed for booking assistant)

---

### 2. Coach Profile Setup - Coaching Hours Setting

**File:** `src/pages/CoachProfileSetup.tsx`

Add a new Card section titled "Coaching Hours" between "Booking Policies" and "Change Password":
- Toggle switch: "Set specific coaching hours" (off = 24/7 available)
- When enabled, show Start Time and End Time inputs
- Saves to `coach_profiles.coaching_hours` as JSON
- Loads existing value on page load

---

### 3. BlockingsDialog - Universal/Recurring Blockings Tab

**File:** `src/components/BlockingsDialog.tsx`

Redesign the dialog with two tabs:
- **Specific Date** tab (existing functionality, unchanged)
- **Recurring** tab (new):
  - Day-of-week multi-select checkboxes (Monday through Sunday)
  - Start Time and End Time inputs
  - Optional reason
  - "Add Recurring Block" button
  - List of existing recurring blockings with delete buttons
  - Each row shows e.g. "Every Monday, 1:00 PM - 2:00 PM"

Fetch/insert/delete from the new `coach_recurring_blockings` table.

---

### 4. Booking Assistant (Client-Facing AI)

**File:** `supabase/functions/booking-assistant/index.ts`

Changes:
- Fetch `coach_profiles.coaching_hours` (already fetched with coach profile)
- Fetch from `coach_recurring_blockings` table for this coach
- Update the AVAILABILITY RULES in the system prompt:
  - If `coaching_hours` is set, state the coach is only available during those hours
  - If null, keep "24/7 available"
  - Add section for RECURRING BLOCKED TIMES listing day + time ranges
- Add server-side validation: reject bookings outside coaching hours

---

### 5. Coach AI Assistant (Machi - Coach Side)

**File:** `supabase/functions/chat-assistant/index.ts`

Changes:
- Fetch `coach_recurring_blockings` in the parallel data fetch
- Include coaching hours from `coachProfile.coaching_hours` in the profile section
- Add RECURRING BLOCKED TIMES section to the system prompt
- Update the BLOCKED TIME SLOTS section header to distinguish specific vs recurring

---

### 6. Calendar Display Updates

**File:** `src/components/BookingsCalendar.tsx`

- Accept new prop `recurringBlockings` 
- For the selected date, check if any recurring blockings match that day of the week
- Display them alongside specific-date blockings in the date detail panel

**File:** `src/pages/Dashboard.tsx`

- Fetch recurring blockings from `coach_recurring_blockings` table
- Pass them to `BookingsCalendar` component

---

### Summary of Files Changed

| File | Change |
|------|--------|
| Migration SQL | New table + new column |
| `src/pages/CoachProfileSetup.tsx` | Coaching hours UI |
| `src/components/BlockingsDialog.tsx` | Recurring blockings tab |
| `src/components/BookingsCalendar.tsx` | Show recurring blockings on calendar |
| `src/pages/Dashboard.tsx` | Fetch & pass recurring blockings |
| `supabase/functions/booking-assistant/index.ts` | Feed coaching hours + recurring blockings to AI |
| `supabase/functions/chat-assistant/index.ts` | Feed coaching hours + recurring blockings to AI |

