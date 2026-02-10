
## Sync Coach AI Assistant with Full Booking Data

Currently, the coach's AI assistant (`chat-assistant`) only has access to pending payments. It cannot answer questions about bookings, schedules, blocked times, or coach profile details. This plan enriches it with the same data the booking chatbot already uses.

### What Changes

**File: `supabase/functions/chat-assistant/index.ts`**

Add database queries to fetch and inject into the system prompt:

1. **All bookings** (upcoming approved, pending, completed, cancelled) -- so the coach can ask "What bookings do I have this week?" or "Who cancelled?"
2. **Coach profile** (sports, locations, hourly rate, business name) -- so it can answer "What's my rate?" or "What sports do I offer?"
3. **Blocked times** (from `coach_blockings`) -- so the coach can ask "What times have I blocked?" or "Am I free on Friday?"
4. **Recent booking chats** (from `booking_chats`) -- so the coach can ask "What did the last athlete request?"

### Updated System Prompt Structure

The system prompt will be expanded to include sections for:
- Coach profile summary
- Upcoming bookings (next 30 days, grouped by status)
- Blocked time slots
- Pending payment verifications (already exists)
- Recent booking chat summaries

### Technical Details

All changes are in one file: `supabase/functions/chat-assistant/index.ts`

- Add query for `coach_profiles` joined with `profiles` using `user.id`
- Add query for `bookings` where `coach_id = user.id` and `session_date >= today`, ordered by date
- Add query for `coach_blockings` where `coach_id = user.id` and `blocked_date >= today`
- Add query for `booking_chats` where `coach_id = user.id`, limited to recent 10
- Format all this data into the system prompt so the AI can reference it when answering coach questions
- Update model to `google/gemini-3-flash-preview` (the recommended default)

No database changes or new files needed.
