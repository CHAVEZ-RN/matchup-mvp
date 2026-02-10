

## Make "Create Profile" Button Bigger and More Prominent

Increase the size and visual prominence of the "Create Profile" / "Update Profile" button at the bottom of the Coach Profile Setup page so it's unmissable when coaches finish filling out the form.

### Changes

**File: `src/pages/CoachProfileSetup.tsx`**
- Make the button full-width (`w-full`)
- Increase the height (from `h-12` to `h-14`)
- Bump up the font size (`text-lg`) and make it bold (`font-semibold`)
- These changes ensure the button stands out as the clear primary action at the bottom of the form

