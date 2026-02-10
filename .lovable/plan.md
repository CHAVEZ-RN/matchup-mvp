

## Remove "Share on WhatsApp" and "Share via SMS" Buttons

Remove the two sharing buttons from the dashboard's booking link section, keeping only the booking link with its copy functionality.

### Changes

**File: `src/pages/Dashboard.tsx`**
- Locate the "Share on WhatsApp" and "Share via SMS" buttons in the booking link section (near the top of the dashboard)
- Remove both button elements and any associated click handler functions (e.g., WhatsApp URL generation, SMS URL generation)
- Keep the booking link display and copy button intact

This is a straightforward removal of two UI elements with no impact on other functionality.

