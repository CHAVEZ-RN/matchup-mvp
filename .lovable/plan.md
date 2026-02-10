

## Streamline Booking Chatbot Fields

Simplify the information the chatbot collects by removing Email and Duration as separate fields, and updating the Location field behavior.

---

### Changes

**File: `supabase/functions/booking-assistant/index.ts`** (lines 117-170)

Update the system prompt's conversation flow and rules:

**Fields to ask (updated list):**
- Full name
- Phone number (Philippine format)
- Sport (only if multiple sports -- skip if single sport, same as now)
- Location (free-text, but remind the client that sessions must be within the coach's area: [coach locations])
- Preferred date and time, including duration (e.g., "Jan 15, 2-4pm" implies 2 hours)
- Payment method (GCash, Maya, or Cash)
- Special requests/notes (optional)

**Fields removed:**
- Email (remove from the list and from the confirmation summary)
- Duration as a separate question (merged into date/time -- the bot infers duration from the time range given)

**Location behavior change:**
- Instead of restricting to exact coach location options, allow any location but remind the client that sessions should be within the coach's designated area

**Confirmation summary updated to match:**
- Remove Email line
- Remove separate Duration line (show it as part of date/time, e.g., "Jan 15, 2:00 PM - 4:00 PM (2 hours)")
- Keep Total amount (calculated from inferred duration x hourly rate)

**JSON output:** Keep `duration_hours` in the READY_TO_BOOK JSON (derived from the time range). Set `athlete_email` to null since it's no longer collected.

---

### Technical Details

**`supabase/functions/booking-assistant/index.ts`**

Lines 119-170: Replace the conversation flow, confirmation summary, and rules sections of the system prompt to reflect the reduced field set. Key changes:

- Step 2 list: remove email and duration, update location instruction, merge duration into date/time
- Step 4 confirmation summary: remove email row, show date/time with duration inline
- READY_TO_BOOK JSON instruction: note that `athlete_email` should be null, `duration_hours` is inferred from time range
- Location validation rule: change from "must match available options" to "remind client sessions should be in coach's area"

