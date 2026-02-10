

## Changes: Client-Side Machi Scrollbar + Booking Flow Improvements

### 1. Hide scrollbar in client chat (PublicBooking.tsx)

Add `scrollbar-hide` class and inline styles to the messages container and the textarea input, matching the same approach used on the coach side.

**File: `src/pages/PublicBooking.tsx`**
- Messages container (the `overflow-y-auto` div): add `scrollbar-hide` class and `style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}`
- Textarea input: add `scrollbar-hide` class and the same inline styles

### 2. Skip initial confirmation question (booking-assistant edge function)

**File: `supabase/functions/booking-assistant/index.ts`**

Update the system prompt (line 119) to remove step 1 that says "First, confirm they want to book with this coach." Instead, Machi should greet them warmly and immediately present the list of required information.

Change:
```
1. First, confirm they want to book with this coach (if this is the first message).
2. Once they confirm, present ALL required information at once...
```

To:
```
1. Greet them warmly and immediately present ALL required information at once...
```

Also update the initial greeting in `PublicBooking.tsx` (line ~72) from:
```
"Would you like to book a training session?"
```
To something like:
```
"Let's get your session booked! Here's what I'll need from you:"
```
followed by the list of required fields, so the very first message already asks for the info.

### 3. Remove double confirmation (booking-assistant edge function)

**File: `supabase/functions/booking-assistant/index.ts`**

The system prompt currently has:
- Step 4 (line 139-151): A confirmation step with emoji summary, asking "Does everything look correct?"
- Step 5 (line 153): "ONLY after the client explicitly confirms, respond with READY_TO_BOOK"

The issue is the AI sometimes asks for confirmation twice -- once as a plain text summary and once with the emoji summary. Consolidate to a single confirmation step that uses the emoji-formatted summary, then immediately proceeds to READY_TO_BOOK upon confirmation. Make the instructions clearer that there should be exactly ONE confirmation prompt with the emoji format.

### Technical Summary

| File | Change |
|------|--------|
| `src/pages/PublicBooking.tsx` | Hide scrollbars on messages area and textarea |
| `supabase/functions/booking-assistant/index.ts` | Remove initial "want to book?" step; consolidate to single emoji confirmation |

