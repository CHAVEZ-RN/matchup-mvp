

## Remove Email Field from Client Contacts

Remove all references to `athlete_email` from the UI across the app, since email is no longer collected from clients.

Note: The database column `athlete_email` will remain (it's nullable and already set to null for new bookings), so no migration is needed. We're only removing it from the display and type definitions in the frontend.

---

### Changes

**1. `src/pages/BookingDetail.tsx`** (lines 401-406)
- Remove the conditional block that displays the athlete's email with the Mail icon

**2. `src/pages/BookingDetail.tsx`** (lines 143-144)
- The `sendBookingEmail` call on rejection uses `booking.athlete_email` as the recipient — since there's no email to send to, remove this email notification call (or keep it but it will gracefully do nothing since email is empty)

**3. `src/components/CancelBookingDialog.tsx`** (line 51)
- Same situation — `sendBookingEmail` uses `booking.athlete_email` which will always be empty. Remove the email notification call for cancellations

**4. `src/pages/Dashboard.tsx`** (line 24)
- Remove `athlete_email` from the Booking interface type

**5. `src/pages/Transactions.tsx`** (line 38)
- Remove `athlete_email` from the Transaction interface type

**6. `src/lib/emailService.ts`**
- No changes needed — this service is used for coach emails too, not just athlete emails

---

### Technical Details

| File | Change |
|------|--------|
| `BookingDetail.tsx` | Remove email display block (lines 401-406), remove email icon import if unused |
| `BookingDetail.tsx` | Remove athlete email notification on rejection (lines 142-160) since no email exists |
| `CancelBookingDialog.tsx` | Remove athlete email notification on cancellation (lines 48-69) |
| `Dashboard.tsx` | Remove `athlete_email` from interface (line 24) |
| `Transactions.tsx` | Remove `athlete_email` from interface (line 38) |

The database column stays as-is (nullable, defaults to null). No migration needed.
