

## Plan: Add Change Password and Fitness Sport Option

### 1. Add "Fitness" to Sports Options

Update the `SPORTS_OPTIONS` array in `src/pages/CoachProfileSetup.tsx` to include "Fitness":

```
const SPORTS_OPTIONS = ["Basketball", "Tennis", "Volleyball", "Badminton", "Football", "Swimming", "Golf", "Fitness"];
```

This is a one-line change with no backend impact since `sports_offered` is stored as a text array.

### 2. Add Change Password Section

Add a new Card section at the bottom of the Coach Profile Setup page (before the Submit button) with:
- A "Change Password" heading
- Current password field (for verification)
- New password field
- Confirm new password field
- A dedicated "Update Password" button (separate from the profile save button)

The password change will use the built-in `supabase.auth.updateUser({ password })` method, which handles updating the authentication credentials directly. No database migration is needed.

Validation rules:
- New password must be at least 6 characters
- New password and confirm password must match
- Show success/error toast notifications

### Technical Details

**File modified:** `src/pages/CoachProfileSetup.tsx`

Changes:
1. Line 14: Add "Fitness" to `SPORTS_OPTIONS`
2. Add three new state variables: `currentPassword`, `newPassword`, `confirmPassword`, and `isChangingPassword`
3. Add a `handleChangePassword` async function that calls `supabase.auth.updateUser({ password: newPassword })`
4. Add a new Card component with the password form fields and its own submit button, placed after the "Booking Policies" card
5. Import `Lock` icon from lucide-react for the section header

