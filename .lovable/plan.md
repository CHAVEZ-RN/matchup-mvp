

## Payment System Overhaul

### Problem
1. The `handleRecordPayment` function sums ALL payment records (including the initial pending one) when deciding if the booking is fully paid, causing it to mark as "completed" prematurely.
2. The "Record Payment" form disappears when status becomes "completed", even if there's still a balance.
3. The Transactions page only shows bookings with status `completed` or `cancelled`, so partial payments on `approved` bookings never appear there.

### Changes

#### File: `src/pages/BookingDetail.tsx`

**1. Fix `handleRecordPayment` totalPaid calculation (line 183)**
- Filter to only sum payments with `payment_status === 'paid'` before adding the new amount, consistent with the display logic on line 255.

**2. Only mark as "completed" when remaining balance reaches 0 (lines 185-190)**
- Keep the existing logic but with the corrected `totalPaid` so it only triggers when the full amount is truly covered.

**3. Keep "Record Payment" visible when there's a remaining balance (line 492)**
- Change the condition from `booking.status === "approved" || booking.status === "pending"` to also include `booking.status === "completed"` -- but actually, the real fix is: since we only set "completed" when fully paid, and we check `remainingBalance > 0`, this will naturally work once the totalPaid bug is fixed. No change needed here beyond the bug fix.

#### File: `src/pages/Transactions.tsx`

**4. Show all bookings with paid payment records in Transactions (line 91)**
- Change the filter from `.in('status', ['completed', 'cancelled'])` to `.in('status', ['completed', 'cancelled', 'approved', 'pending'])` so that partial payments on active bookings also appear.
- Alternatively, a cleaner approach: show bookings that have at least one `paid` payment record. Since we fetch payments with the booking, we can filter client-side to only show bookings that have at least one payment with `payment_status === 'paid'`.

### Technical Summary

| File | Line(s) | Change |
|------|---------|--------|
| `BookingDetail.tsx` | 183 | Filter `booking.payments` to only `paid` status before summing |
| `Transactions.tsx` | 91 | Include `approved` and `pending` statuses so partial-payment bookings appear |
| `Transactions.tsx` | 109-121 | Add client-side filter: only show bookings with at least one `paid` payment |

No database or backend changes needed.

