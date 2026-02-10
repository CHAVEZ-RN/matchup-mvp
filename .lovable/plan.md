

## Replace All Blue Shades with #008ECC

Update the primary color (currently Cobalt Blue) across the design system to use #008ECC (HSL: 197 100% 40%) and its variants.

### Changes

**File: `src/index.css`**

Update the primary-related CSS variables in both light and dark modes:

**Light mode (`:root`)**
- `--primary`: `210 100% 27%` -> `197 100% 40%` (#008ECC)
- `--primary-dark`: `210 100% 22%` -> `197 100% 33%` (darker shade)
- `--primary-hover`: `211 91% 35%` -> `197 100% 47%` (lighter hover)
- `--ring`: `210 100% 27%` -> `197 100% 40%`
- `--sidebar-ring`: `217.2 91.2% 59.8%` -> `197 100% 40%`

**Dark mode (`.dark`)**
- `--primary`: `211 91% 35%` -> `197 100% 40%` (#008ECC)
- `--primary-dark`: `210 100% 27%` -> `197 100% 33%`
- `--primary-hover`: `211 91% 42%` -> `197 100% 50%`
- `--ring`: `211 91% 35%` -> `197 100% 40%`
- `--sidebar-primary`: `224.3 76.3% 48%` -> `197 100% 40%`
- `--sidebar-ring`: `217.2 91.2% 59.8%` -> `197 100% 40%`

This single file change will propagate the new blue (#008ECC) everywhere the primary color is used throughout the app -- buttons, links, rings, focus states, calendar selections, sidebar highlights, etc.

