# Architecture Overview

Single-file site hosted on GitHub Pages with Tailwind (CDN) and small JS modules.

- Router: query-param `?page=` swaps `<template>` content into `#app`.
- Pages: Home, Club, Linux, Calendar.
- Branding: Banner and CCRI green accents; hero uses `cybersmith.png`.
- Calendar: Google embed (default) with optional ICS-powered features (toggle via `ENABLE_CUSTOM_CALENDAR`).
- QR Codes: Per-page footer generator renders to canvas using vendored encoder; optional image fallback.

Key files
- `index.html` — UI, routing, calendar logic, footer QR generator
- `js/vendor/qrcode.min.js` — local QR encoder (no CDN)
- `CALENDAR-UPDATING.md` — maintainer guide for calendar
- `README.md` — project guide and developer spec

Conventions
- No build step; all assets static
- Prefer relative links (`?page=`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
