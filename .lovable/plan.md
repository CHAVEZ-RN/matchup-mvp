

## Fix: Text wrapping in the AI Assistant input field

The current input field uses a single-line `<Input>` component, which does not support text wrapping -- text just scrolls horizontally when it gets long.

### Solution

Replace the `<Input>` component with a `<Textarea>` in `src/components/AIAssistant.tsx` so that text wraps and the field can grow as the coach types longer questions.

### Changes

**File: `src/components/AIAssistant.tsx`**

1. Replace the `Input` import with `Textarea` (from `@/components/ui/textarea`)
2. Swap the `<Input>` element (around line 137) for a `<Textarea>` with:
   - `rows={1}` to start compact (same height as the current input)
   - `resize-none` class to prevent manual resizing
   - Auto-growing height via CSS (`max-h-[120px]` and `overflow-y-auto`) so it expands as the user types but caps at ~5 lines
   - Same styling, placeholder, and event handlers as before
   - Update `onKeyPress` to only send on Enter without Shift (already implemented), so Shift+Enter adds a new line

