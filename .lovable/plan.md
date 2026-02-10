

## Add Light/Dark Mode Toggle to Dashboard Header

Add a theme toggle button between the notification bell and settings icon in the dashboard header.

### What Changes

**File: `src/pages/Dashboard.tsx`**

1. Import `Sun` and `Moon` icons from `lucide-react`
2. Add a `theme` state (`useState`) initialized by reading `document.documentElement.classList` (check if `dark` class is present)
3. Add a toggle function that:
   - Toggles the `dark` class on `document.documentElement`
   - Saves preference to `localStorage`
   - Updates state
4. Insert a new icon button between the Bell button (line 231) and the Settings button (line 232), showing `Sun` in dark mode and `Moon` in light mode, styled consistently with the existing buttons

**File: `src/main.tsx`**

5. Add a small script at the top to read `localStorage` for the saved theme preference and apply the `dark` class on initial load, so the preference persists across sessions

**File: `src/index.css`**

6. The CSS already has a `.dark` variant defined, so the existing dark mode styles will activate automatically when the class is toggled. The default (no `dark` class) will show the light theme -- but the current `:root` variables are also dark-themed. Update the `:root` (light mode) CSS variables to use actual light colors (white/light gray backgrounds, dark text) so toggling actually produces a visible light theme.

### Technical Details

- `:root` variables updated to light values: `--background: 0 0% 98%`, `--foreground: 0 0% 10%`, `--card: 0 0% 100%`, etc.
- `.dark` variables remain as they currently are (the existing dark palette)
- The `dark` class is applied to `<html>` element (already configured in `tailwind.config.ts` as `darkMode: ["class"]`)
- On first visit with no saved preference, default to dark mode to preserve the current experience
- Button style: `variant="ghost" size="icon"` with `hover:bg-primary/20 border border-border` matching adjacent buttons

