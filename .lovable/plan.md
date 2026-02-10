
## Remove Chat Icon from Dashboard Header

Remove the orange/secondary chat icon button (with the pulsing dot) next to the notifications bell in the top header bar of the dashboard. The "Chat Now" button in the left sidebar already provides this functionality.

### Changes

**File: `src/pages/Dashboard.tsx`**
- Remove the `MessageSquare` icon button at lines 226-234 (the one with `onClick={() => setShowAI(!showAI)}` in the top header area)
- Keep the notifications bell, settings, and logout buttons as they are
- Keep the "Chat Now" button in the sidebar and the "Chat with AI" button in the bookings section -- those remain the entry points for the AI assistant
