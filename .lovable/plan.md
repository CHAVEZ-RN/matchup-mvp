

## Improve Public Booking Chatbot

Three changes to make the booking chatbot faster, smoother, and smarter.

---

### 1. Streaming responses (faster + smoother)

Currently the bot waits for the entire AI response before showing it. We will switch to SSE streaming so tokens appear as they are typed, making the experience feel instant.

**File: `supabase/functions/booking-assistant/index.ts`**
- For regular conversation messages (non-READY_TO_BOOK), enable `stream: true` in the AI gateway call
- Return the raw SSE stream to the client with `Content-Type: text/event-stream`
- For booking-creation logic (when READY_TO_BOOK is detected), keep the non-streaming path so we can parse the JSON and create the booking server-side. To handle this: always stream, but also accumulate the full response on a secondary non-streaming call only when needed, OR use non-streaming for all messages but switch the model to `google/gemini-2.5-flash-lite` for faster responses
- **Simpler approach chosen**: Switch the model to `google/gemini-2.5-flash-lite` (fastest model) and enable streaming. The edge function will stream responses back. For READY_TO_BOOK detection, we accumulate the full streamed response server-side, then process booking creation and return a final JSON event.

**File: `supabase/config.toml`**
- Add the booking-assistant function config with `verify_jwt = false`

**File: `src/pages/PublicBooking.tsx`**
- Replace `supabase.functions.invoke()` with a direct `fetch()` call to the edge function URL for SSE streaming
- Parse the SSE stream token-by-token and update the last assistant message progressively
- Add a typing animation CSS class for the streaming message bubble
- Add smooth fade-in animation on new message bubbles using CSS transitions

### 2. Text wrap on input (textarea instead of input)

**File: `src/pages/PublicBooking.tsx`**
- Replace the `<Input>` element with a `<textarea>` that auto-grows as the user types
- Use a ref to dynamically adjust the textarea height based on `scrollHeight`
- Cap max height at ~120px (about 5 lines) with overflow scroll beyond that
- Style it to match the current input design (border-2, rounded corners, etc.)

### 3. Skip sport question for single-sport coaches

**File: `supabase/functions/booking-assistant/index.ts`**
- In the system prompt, add a conditional: if `coachProfile.sports_offered.length === 1`, modify the conversation flow to say "Sport: [the single sport] (auto-selected)" and instruct the AI to skip asking about sport selection
- The AI will auto-fill the sport field in the final JSON with the single available sport
- Update step 5 in the prompt to: "If only one sport is available, tell the client which sport is auto-selected and skip to the next question"

---

### Technical Summary

| Change | File(s) | What |
|--------|---------|------|
| Streaming | Edge function + PublicBooking.tsx + config.toml | SSE streaming for token-by-token display |
| Text wrap | PublicBooking.tsx | Replace Input with auto-growing textarea |
| Skip sport | Edge function | Conditional prompt logic for single-sport coaches |

