

## Fix: Payment Status Showing as "Paid" When Still Pending

**Problem**: The booking detail page counts ALL payment records toward the "total paid" amount, regardless of whether those payments are actually completed. Since a payment record with `payment_status: 'pending'` is created when the booking is made, the system incorrectly considers the full amount as "paid."

**Root Cause**: Line 255 in `src/pages/BookingDetail.tsx`:
```
const totalPaid = booking.payments?.reduce((sum, p) => sum + parseFloat(p.amount), 0) || 0;
```
This sums every payment record's amount without filtering by `payment_status`.

**Fix**: Filter to only include payments with `payment_status === 'paid'` before summing:

```typescript
const totalPaid = booking.payments
  ?.filter((p: any) => p.payment_status === 'paid')
  .reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;
```

This single-line change ensures:
- The status badge correctly shows "Awaiting Payment" for approved bookings with pending payments
- The payment summary shows the correct paid vs. remaining amounts
- The "paid" status only appears when payments are actually confirmed

### File Changed
- **`src/pages/BookingDetail.tsx`** -- line 255: add `.filter()` to exclude non-paid payment records
