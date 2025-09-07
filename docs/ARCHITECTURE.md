# Architecture Overview

Single-file site hosted on GitHub Pages with Tailwind (CDN) and small JS modules.

- Router: query-param `?page=` swaps `<template>` content into `#app`.
- Pages: Home, Club, Linux, Calendar, QR Codes.
- Branding: Banner and CCRI green accents; hero uses `cybersmith.png`.
- Calendar: Google embed (default) with optional ICS-powered features (toggle via `ENABLE_CUSTOM_CALENDAR`).
- QR Codes: YAML registry loaded at runtime; renders cards with links and SVG downloads.

Key files
- `index.html` — UI, routing, calendar logic, YAML loading
- `qr-codes/qr-codes.yaml` — QR registry data
- `CALENDAR-UPDATING.md` — maintainer guide for calendar
- `README.md` — project guide and developer spec

Conventions
- No build step; all assets static
- Prefer relative links (`?page=`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
