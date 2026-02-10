

## Fix Booking Detail Payment Issues

### 1. Payment History: Show correct status and date for pending payments

**File: `src/pages/BookingDetail.tsx`** (lines 496-514)

Currently, every payment record displays a green "Paid" badge and formats the `payment_date`. For pending payments, this is incorrect.

Changes:
- Show "Unpaid" badge (muted/warning style) when `payment_status !== 'paid'`
- Show "--/--/----" instead of a date when `payment_status !== 'paid'`
- Keep "Deposit" badge logic, but rename it to "Partial" to match item 2

### 2. Change "deposit" to "partial payment" with remaining balance

**File: `src/pages/BookingDetail.tsx`** (lines 571-582)

- Change label from "This is a deposit payment" to "This is a partial payment"
- When checked, display the remaining balance below the checkbox (e.g., "Remaining balance: [amount]")
- The `isDeposit` state variable stays the same internally since it maps to the `is_deposit` DB column

### 3. Reference number: only last 4 digits, hidden for cash

**File: `src/pages/BookingDetail.tsx`** (lines 558-568)

- Change label from "Reference # (optional)" to "Last 4 digits of Ref #"
- Change placeholder from "GC12345678" to "1234"
- Add `maxLength={4}` to the input
- Conditionally hide the entire reference number field when `paymentMethod === "cash"`

### 4. Remove icon from Record Payment button

**File: `src/pages/BookingDetail.tsx`** (lines 584-591)

- Remove the `<DollarSign>` icon from the "Record Payment" button

### Technical Details

All changes are in a single file: `src/pages/BookingDetail.tsx`. No database or backend changes needed.

