

## Align Heading and Subheading on Coach Profile Setup

Move the back button and heading row so that the "Update Your Profile" text and the "Athletes will see..." subheading are left-aligned.

### Change

**File: `src/pages/CoachProfileSetup.tsx`**

Move the back button outside/above the heading block, or use a negative margin/absolute positioning so the arrow sits to the left without pushing the heading text rightward. The simplest approach: give the back button a negative left margin so it sits outside the content flow, keeping both the heading and subheading aligned at the same left edge.

- On the flex container (line 346), add a negative left margin: `className="flex items-center gap-3 -ml-12"`
- This pulls the back arrow into the left margin area while keeping the heading text aligned with the subheading below it

