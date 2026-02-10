

## Booking Chatbot Adjustments

Four changes to the client-facing booking chatbot UI and conversation flow.

---

### 1. Remove scroll bar from textarea

**File: `src/pages/PublicBooking.tsx`** (line 329)

Remove `overflow-y-auto` from the textarea class and replace with `overflow-hidden` so no scrollbar appears. The textarea already auto-grows up to 120px, so content will remain visible without a scrollbar.

---

### 2. Update initial greeting message

**File: `src/pages/PublicBooking.tsx`** (lines 69-72)

Change the initial assistant message from:
> "Hello! I'm the booking assistant for Coach ____. Would you like to book a training session?"

To:
> "Hello, I am Coach ____'s AI Assistant! Would you like to book a training session?"

---

### 3. Change conversation flow to ask all info upfront

**File: `supabase/functions/booking-assistant/index.ts`** (lines 106-144)

Rewrite the system prompt's conversation flow. Instead of asking one question at a time, the bot's first reply (after the client confirms they want to book) will list all required information at once:

- Full name
- Phone number
- Email (optional)
- Sport (only if multiple sports offered -- skip if single sport)
- Preferred location (show options)
- Preferred date and time
- Duration (suggest 1, 1.5, 2 hours)
- Payment method (GCash, Maya, or Cash)
- Special requests/notes (optional)

The bot should accept answers in bulk (all at once in a single message) OR one by one across multiple messages. It must track which fields have been provided and which are still missing, and ask follow-up only for missing fields.

---

### 4. Confirm/reiterate details before booking

The system prompt will instruct the bot that once ALL required fields are collected, it must present a clear summary of the booking details and ask the client to confirm (e.g., "Does everything look correct?"). Only after the client confirms should the bot respond with `READY_TO_BOOK` and the JSON payload.

This adds one extra confirmation step before the booking is actually created.

---

### Technical Details

**`src/pages/PublicBooking.tsx`**
- Line 329: change `overflow-y-auto` to `overflow-hidden`
- Lines 69-72: update initial message text

**`supabase/functions/booking-assistant/index.ts`**
- Lines 106-144: Replace the conversation flow section of the system prompt with the new flexible flow that presents all required fields upfront, accepts bulk or incremental answers, tracks missing fields, and requires explicit confirmation before outputting READY_TO_BOOK

