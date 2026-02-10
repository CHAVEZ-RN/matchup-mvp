

## Update Booking Link Card Text and Remove Icon

**File: `src/pages/Dashboard.tsx`** (lines ~270-280)

1. Remove the Plus icon circle entirely (the `div` with the orange background and `Plus` icon)
2. Change the heading from "Share Your Booking Link" to "Your Booking Link"
3. Add a subheading below it: "Share this link with your clients so they can book a lesson!"
4. Clean up the `Plus` import from lucide-react if it's no longer used elsewhere in the file

### Technical Details

**`src/pages/Dashboard.tsx`**:
- Remove lines 272-274 (the icon wrapper div)
- Line 275: Change heading text to "Your Booking Link"
- Insert a new `<p>` element after the heading with muted styling for the subheading
- Check if `Plus` is used elsewhere; if not, remove it from the lucide-react import

