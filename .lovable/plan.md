

## Center the Booking Link Card

**File: `src/pages/Dashboard.tsx`** (lines 270-291)

Adjust the booking link card to be centered and visually cleaner:

1. **Center the card content**: Change the inner layout from `flex items-start gap-4` (side-by-side icon + text) to a centered column layout using `flex flex-col items-center text-center`.

2. **Center the icon**: Keep the orange icon but center it above the text.

3. **Center the heading**: The "Share Your Booking Link" heading will be centered.

4. **Center the input + button row**: Keep the input and copy button in a horizontal row, but center the group. Add `justify-center` and constrain the width with `max-w-lg w-full` so it doesn't stretch edge-to-edge.

5. **Remove the gradient background**: Replace `bg-gradient-to-r from-secondary/10 to-primary/10` with a simpler `bg-card` to keep it clean and consistent with the rest of the dashboard.

### Technical Details

**`src/pages/Dashboard.tsx`** lines 270-291:
- Line 271: Change `flex items-start gap-4` to `flex flex-col items-center text-center gap-3`
- Line 275: Remove `flex-1` wrapper div, move its children up
- Line 277: Add `w-full max-w-lg` to the input+button row
- Line 270: Simplify card classes -- remove gradient, keep border styling

