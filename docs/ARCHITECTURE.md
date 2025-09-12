# Architecture Overview

Single-file site hosted on GitHub Pages with Tailwind (CDN) and small JS modules.

- Router: hash-based `#/page` swaps `<template>` content into `#app`.
- Pages: Home, Club, Linux, Calendar, Resources, Campus Maps.
- Branding: Banner and CCRI green accents; hero uses `cybersmith.webp`. Consistent emerald-500 color palette throughout.
- Navigation: Simplified direct navigation (no hamburger menu) with clean header design featuring logo only.
- Calendar: Google embed (default) with optional ICS-powered features (toggle via `ENABLE_CUSTOM_CALENDAR`). Features color-coded meeting types and clickable room numbers.
- QR Codes: Per-page footer generator renders to canvas using vendored encoder. Controls allow changing ECL (L/M/Q/H). PNG export uses the current ECL.
- Resources: `#/resources` route renders from a single in-page data array with card-based display. Features organized categories, beginner guidance, and defaults to "Cyberknights" filter. Supports deep-linking via `#/resources/<filter>` and syncs chip clicks back to the hash.
- Maps: Campus-specific map pages (e.g., `/map-warwick-4080`) with optimized images and meeting location details.
- SEO: Open Graph meta tags for social media sharing and search engine optimization.

Key files
- `index.html` — UI, routing, calendar logic, footer QR generator, map pages
- `qrcode.min.js` — local QR encoder (no CDN)
- `favicon.ico` — site favicon
- `cybersmith.webp` — hero image and social sharing image
- `map-rm4080-optimized.webp` — optimized campus map image
- `docs/CALENDAR-UPDATING.md` — maintainer guide for calendar
- `README.md` — project guide and developer spec

Conventions
- No build step; all assets static
- Prefer hash links (`#/page`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
