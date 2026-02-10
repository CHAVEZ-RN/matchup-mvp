

## Add Back Button to Coach Profile Setup Page

Add a back-to-dashboard button on the profile setup page, positioned to the left of the "Update Your Profile" heading.

### Changes

**File: `src/pages/CoachProfileSetup.tsx`**
- Import the `ArrowLeft` icon from `lucide-react`
- In the heading section (around line 253), add a back button to the left of the title text
- The button navigates to `/dashboard` using the existing `useNavigate` hook
- Style it as a subtle icon button consistent with the app's design

