# Architecture Overview

Single-file site hosted on GitHub Pages with Tailwind (CDN) and small JS modules.

- Router: hash-based `#/page` swaps `<template>` content into `#app` with async document loading capability.
- Pages: Home (merged Club content with strategic banner placement), Linux, Calendar, Resources, Campus Maps, Documents, Blog.
- Branding: Interactive Cyber Knight icons with full-screen modal expansion, canonical color palette with CSS variables, enhanced QR code landing banner. Hero uses `images/branding/cyberknight-welder.webp` with toggle functionality. Home page features "Excitement • Opportunity • Belonging" banner for QR code users. Generalized image toggle system with CSS custom properties for consistent 96% screen width expansion.
- Navigation: Button-style navigation links with clear visual hierarchy, mobile-optimized search with fixed positioning, external link indicators.
- Content Architecture: Strategic content reorganization with career-focused messaging, standardized text hierarchy, and logical grouping of related content in "Our Members Get Hired!" section.
- Interactive Images: Unified toggle system for navigation icons, welder image, and VBox summary screenshot with consistent sizing and behavior.
- Calendar: Google embed (default) with optional ICS-powered features (toggle via `ENABLE_CUSTOM_CALENDAR`). Features color-coded meeting types and clickable room numbers.
- QR Codes: Per-page footer generator renders to canvas using vendored encoder. Controls allow changing ECL (L/M/Q/H). PNG export uses the current ECL.
- Resources: `#/resources` route renders from a single in-page data array with comprehensive card-based display. Features organized categories, detailed resource descriptions with bullet-point formatting, modal system for enhanced readability with click-anywhere-to-close behavior, dynamic button text, and defaults to "Cyberknights" filter. Supports deep-linking via `#/resources/<filter>` and syncs chip clicks back to the hash. All major resources include comprehensive summaries and detailed descriptions covering technical aspects, practical applications, and user benefits. Cards use 12px font for summaries with modal enlargement for detailed reading. Modal content uses consistent bullet-point formatting via `formatDetailedSummary()` function with proper HTML structure (`<ul>` tags) and Tailwind styling. Footer positioning uses sticky layout with flexbox (`flex flex-col` on body, `flex-grow` on main, `mt-auto` on footer) to ensure consistent bottom positioning regardless of content amount.
- Guides: `#/guides/filename.html` routes load standalone HTML files into the SPA shell with clean display (no template headers). Guides display with their native headers only. Supports dual-mode operation (SPA integration and standalone access). **Legacy Support**: `#/document/filename.html` routes continue to work with deprecation warnings. Linux guides (`linux-cheatsheet-1.html`, `linux-day-1-setup-tips.html`) use DRY CSS classes with official Cyberknights color palette, consistent dark theme, and reusable styling components. **QR Code Integration**: Educational guides feature embedded base64 QR codes for instant access to related video content, using table-based layouts with green background QR codes and black modules for optimal scanning.
- Maps: Campus-specific map pages (e.g., `/map-warwick-4080`) with optimized images and meeting location details.
- Interactive Elements: DRY implementation for image toggle functionality, CSS-based modal overlays, responsive design with viewport constraints.
- Testing: Comprehensive Selenium WebDriver test suite covering client-side routing, QR code functionality, cross-page navigation, and interactive element behavior. Tests run in headless Chrome with isolated virtual environment.
- Versioning: Intelligent automated versioning system with conventional commits, file change analysis, and pre-commit hooks. Version displayed in footer with commit information tooltip.
- SEO: Open Graph meta tags for social media sharing and search engine optimization.

Key files
- `index.html` — UI, routing, calendar logic, footer QR generator, map pages, document loading
- `package.json` — version tracking and npm scripts for automated versioning
- `scripts/bump-version.sh` — intelligent version bumping script with commit and file analysis
- `.husky/pre-commit` — Git hook for automatic version management
- `js/qrcode.min.js` — local QR encoder (no CDN)
- `js/qr-code-manager.js` — shared QR Code functionality
- `guides/linux-cheatsheet-1.html` — standalone Linux cheat sheet page with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `guides/linux-cheatsheet-2.html` — standalone Linux cheat sheet page focusing on file operations with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `guides/linux-day-1-setup-tips.html` — Linux day 1 setup guide with consistent styling and DRY implementation (dual-mode)
- `guides/README.md` — comprehensive documentation for QR code integration in educational guides
- `scripts/generate_qr_codes.py` — Python script for generating base64 QR codes with custom styling
- `scripts/README.md` — documentation for QR code generation system
- `favicon.ico` — site favicon
- `images/branding/cybersmith.webp` — hero image and social sharing image
- `images/maps/map-rm4080-optimized.webp` — optimized campus map image
- `tests/` — automated test suite using Selenium WebDriver
- `docs/CALENDAR-UPDATING.md` — maintainer guide for calendar
- `docs/DOCUMENT-LOADING.md` — comprehensive document loading system guide
- `docs/TESTING.md` — comprehensive testing strategy and implementation
- `docs/VERSION-MANAGEMENT.md` — comprehensive versioning system documentation
- `docs/LAYOUT-TROUBLESHOOTING.md` — CSS debugging methodology
- `docs/SELENIUM-DEBUGGING-INNOVATION.md` — debugging innovation documentation
- `docs/color-palettes/COLOR-PALETTE.md` — comprehensive color palette documentation
- `README.md` — project guide and developer spec

## Linux Guide Implementation Notes

### Boot Menu Keys
- Emphasize repeatedly tapping the boot key as soon as the logo appears
- If you miss the window, restart and try again

Common keys:
- Dell: F12
- HP: Esc, F9
- Lenovo: F12, Novo Button
- Acer: F12
- ASUS: Esc, F8, F12
- MSI: F11
- Toshiba: F12
- Samsung: Esc, F12

### Authoring Guidelines
- Keep instructions concise and brand-agnostic
- Add new manufacturers as students report them

## Site Operations

### GitHub Pages Deployment
- Source: Deploy from a branch → `main` → `/ (root)`
- `.nojekyll` present at repo root
- Public URL after rename: `https://ccri-cyberknights.github.io/page/`

### Repository Management
- Repo renamed to `page` (from `qr-code-landing-pages`)
- GitHub provides redirects for the repo URL; update docs/links proactively

### Local Development
- Open `index.html` directly in a browser, or
- Serve statically with `python -m http.server` to test hash routes

### Maintenance Checklist
- After moving/renaming a doc, update links in:
  - `index.html` constants
  - README and docs indices
- Prefer hash routes; avoid `?page=` style links
- Keep assets as WebP; remove older PNGs

## Image Assets and Optimization

### Policy
- Prefer WebP for raster images
- Strip metadata and target visually lossless quality (≈85)
- Keep filenames lowercase with hyphens

### Commands (ImageMagick)
```
convert source.png -strip -quality 85 -define webp:method=6 output.webp
```
- Update references in `index.html` after converting
- Remove old PNGs once WebP is working

### Current Assets

#### Branding Images
- `images/branding/cybersmith.webp` — header and home hero, social sharing image
- `images/branding/cyberknight-welder.webp` — club page hero

#### Map Images
- `images/maps/map-rm4080-optimized.webp` — Warwick campus Room 4080 map (optimized)
- `images/maps/map-rm4080-original.png` — Warwick campus Room 4080 map (original)
- `images/maps/map-warwick-4080-edit.png` — Warwick campus Room 4080 map (edited version)

#### Screenshots
- `images/screenshots/VBoxSummary-optimized.webp` — VirtualBox configuration screenshot

#### Other Assets
- `favicon.ico` — site favicon

### Map Image Optimization
Campus map images follow this optimization process:

```bash
convert images/maps/map-{campus}-{room}-original.png -quality 85 -strip -resize 1200x800 images/maps/map-{campus}-{room}-optimized.webp
```

- **Format**: WebP for better compression
- **Quality**: 85% for optimal size/quality balance
- **Size**: 1200x800px maximum
- **Metadata**: Stripped to reduce file size

## Calendar Integration (Admin Guide)

This project pulls events from the public Google Calendar for the club.

- Google account: `ccricyberknightclub@gmail.com`
- Public ICS: set in `index.html` as `CALENDAR_ICS_URL`
- Optional Google embed: set in `index.html` as `CALENDAR_EMBED_URL`

### Update the Calendar Contents

1. Open Google Calendar as the club account
2. Add or edit events as needed
   - Include Zoom link in the event URL field or in the description
   - For recurring meetings, use weekly recurrence (choose days and interval)
3. Save the event(s)
4. Wait up to ~3–4 hours for the public ICS feed to refresh
   - Tip: You can sometimes force a quicker refresh by adjusting event details, but Google controls the cadence

### Change Which Calendar Is Used by the Website

1. In Google Calendar → Settings → Integrate calendar
   - Copy the "Public address in iCal format" (ends with `/public/basic.ics`)
   - Optional: copy the "Embed code" URL
2. In this repo, open `index.html` and update the constants:

```
const CALENDAR_ICS_URL = "https://calendar.google.com/calendar/ical/<CALENDAR_ID>/public/basic.ics";
const CALENDAR_EMBED_URL = "https://calendar.google.com/calendar/embed?src=<CALENDAR_ID>&ctz=America/New_York"; // optional
```

3. Commit and push
4. Visit `#/calendar` to verify the list, FullCalendar grid, and (optionally) the Google embed

### Calendar Troubleshooting

- Nothing appears in the list/grid
  - Ensure `CALENDAR_ICS_URL` is correct and publicly accessible
  - Wait for ICS refresh (3–4 hours typical)
  - The page attempts a read-only proxy fallback for CORS. If it still fails, check browser console
- Embed shows but list/grid is empty
  - Likely `CALENDAR_ICS_URL` is missing or blocked; verify constants
- Times look wrong
  - Confirm your calendar's timezone and the `ctz` parameter in the embed URL
- Recurring meetings missing
  - Ensure recurrence is weekly; site expands weekly `RRULE` into the next ~90 days

### Security Notes

- Public ICS exposes event metadata. Avoid sensitive content in descriptions
- Prefer Zoom passcodes/waiting rooms when sharing public links

Conventions
- No build step; all assets static
- Prefer hash links (`#/page`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
- DRY principles: Reusable functions for button text, category labels, CSS classes, and SVG icons
- Enhanced readability: 12px font for card summaries, modal enlargement for detailed content
