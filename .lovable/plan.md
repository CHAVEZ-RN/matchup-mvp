

## Fix: Text wrapping in AI Assistant chat bubbles

The current code uses `overflow-wrap-anywhere` as a Tailwind class, but this is **not a valid Tailwind utility**. It gets ignored by the browser, so long text still overflows the bubble.

### Changes

**File: `src/components/AIAssistant.tsx`**

1. On the message `<p>` tag (line 124), remove the non-existent `overflow-wrap-anywhere` class and instead apply it as an inline style:
   - Add `style={{ overflowWrap: 'anywhere' }}` to the `<p>` element
   - Also add `word-break: break-word` as a fallback for older browsers

2. On the bubble container `<div>` (line 118), add `min-w-0` to ensure the flex child can shrink below its content size, which is a common cause of overflow in flex layouts.

### Technical Detail

```tsx
// Bubble container (line 118)
className={`max-w-[80%] min-w-0 rounded-2xl px-4 py-3 break-words overflow-hidden ${...}`}

// Message text (line 124)
<p className="text-sm whitespace-pre-wrap break-words" 
   style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
  {message.content}
</p>
```

This ensures all text — including long URLs or unbroken strings — wraps correctly within the chat bubbles for both user and assistant messages.

