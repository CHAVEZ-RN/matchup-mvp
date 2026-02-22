

## Remove Blocked-Date Highlighting from Calendar

Since universal/recurring blockings will cause most days to show as blocked (e.g. lunch breaks every day), the red highlighting on the calendar becomes meaningless clutter. This change removes only the **calendar dot/highlight** for blocked dates while keeping the blocking details visible in the right-hand panel when a date is selected.

### Changes in `src/components/BookingsCalendar.tsx`

1. **Remove the `blockedDates` variable** (line 57) -- no longer needed for calendar modifiers
2. **Remove the `blocked` modifier** from the Calendar's `modifiers` and `modifiersStyles` props (lines 122, 130-134) -- only keep `booked`
3. **Remove the "Blocked times" legend item** below the calendar (lines 142-147) -- only keep the "Days with bookings" legend

Everything else stays: the right-hand panel still shows specific-date blockings and recurring blockings for the selected date.

### Technical Details

- Lines 57: Delete `const blockedDates = ...`
- Lines 120-135: Remove `blocked: blockedDates` from modifiers and remove the `blocked` entry from `modifiersStyles`
- Lines 142-147: Remove the conditional legend for blocked times
