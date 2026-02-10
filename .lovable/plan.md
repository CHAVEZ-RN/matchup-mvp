

## Booking Detail Payment Adjustments

### 1. Remove Payment History section
Delete the entire "Payment History" card block (lines 491-524). This section is redundant since the Payment Summary already shows the same information (total price, amount paid, remaining balance).

### 2. Sync remaining balance in partial payment checkbox
Update the remaining balance shown when "This is a partial payment" is checked (line 595) to use the same `remainingBalance` variable used in the Payment Summary card, minus the amount being entered.

Current code already does this correctly:
```
₱{(remainingBalance - (parseFloat(paymentAmount) || 0)).toLocaleString()}
```

This already references `remainingBalance` from the Payment Summary. No change needed here -- the values are already synced.

### Technical Details

**File: `src/pages/BookingDetail.tsx`**
- Remove lines 491-524 (the Payment History card)
- No other changes needed since the remaining balance calculation already references the same `remainingBalance` variable used in Payment Summary
