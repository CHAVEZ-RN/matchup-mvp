

## Make Calendar Icon a "Return to Dashboard" Button

The calendar icon appears in the header of four pages. On every page **except Coach Settings**, clicking it will navigate to the dashboard.

### Changes

**Files to modify:** 3 files

1. **`src/pages/BookingDetail.tsx`** (line ~331)
   - Wrap the calendar icon `div` in a clickable button/link that navigates to `/dashboard`
   - Add a cursor-pointer style for visual feedback

2. **`src/pages/Transactions.tsx`** (line ~153)
   - Same change: wrap the calendar icon `div` so it navigates to `/dashboard` on click

3. **`src/pages/Dashboard.tsx`** (line ~180)
   - The coach is already on the dashboard, but for consistency, make the icon clickable (it will just scroll to top or act as a no-op refresh)
   - Alternatively, skip this since they're already on the dashboard

**No change to:** `src/pages/CoachProfileSetup.tsx` -- the calendar icon there remains static (non-clickable), as requested.

### Technical Detail

Each calendar icon div will be wrapped with an `onClick={() => navigate("/dashboard")}` handler and given `cursor-pointer` styling. The existing back-arrow buttons on those pages remain untouched -- this is an additional quick-access shortcut via the logo/icon.
