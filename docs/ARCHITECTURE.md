# Architecture Overview

Single-file site hosted on GitHub Pages with Tailwind (CDN) and small JS modules.

- Router: hash-based `#/page` swaps `<template>` content into `#app` with async document loading capability.
- Pages: Home, Club, Linux, Calendar, Resources, Campus Maps, Documents.
- Branding: Banner and CCRI green accents; hero uses `images/branding/cybersmith.webp`. Hybrid forge color palette with `#04703C` primary green and industrial accents.
- Navigation: Simplified direct navigation (no hamburger menu) with clean header design featuring logo only.
- Calendar: Google embed (default) with optional ICS-powered features (toggle via `ENABLE_CUSTOM_CALENDAR`). Features color-coded meeting types and clickable room numbers.
- QR Codes: Per-page footer generator renders to canvas using vendored encoder. Controls allow changing ECL (L/M/Q/H). PNG export uses the current ECL.
- Resources: `#/resources` route renders from a single in-page data array with comprehensive card-based display. Features organized categories, detailed resource descriptions, modal system for enhanced readability, dynamic button text, and defaults to "Cyberknights" filter. Supports deep-linking via `#/resources/<filter>` and syncs chip clicks back to the hash. All major resources include comprehensive summaries and detailed descriptions covering technical aspects, practical applications, and user benefits. Cards use 12px font for summaries with modal enlargement for detailed reading.
- Documents: `#/document/filename.html` routes load standalone HTML files into the SPA shell with clean display (no template headers). Documents display with their native headers only. Supports dual-mode operation (SPA integration and standalone access).
- Maps: Campus-specific map pages (e.g., `/map-warwick-4080`) with optimized images and meeting location details.
- Testing: Comprehensive Selenium WebDriver test suite covering client-side routing, QR code functionality, and cross-page navigation. Tests run in headless Chrome with isolated virtual environment.
- Versioning: Intelligent automated versioning system with conventional commits, file change analysis, and pre-commit hooks. Version displayed in footer with commit information tooltip.
- SEO: Open Graph meta tags for social media sharing and search engine optimization.

Key files
- `index.html` — UI, routing, calendar logic, footer QR generator, map pages, document loading
- `package.json` — version tracking and npm scripts for automated versioning
- `scripts/bump-version.sh` — intelligent version bumping script with commit and file analysis
- `.husky/pre-commit` — Git hook for automatic version management
- `js/qrcode.min.js` — local QR encoder (no CDN)
- `js/qr-code-manager.js` — shared QR Code functionality
- `resources/linux-cheatsheet-1.html` — standalone Linux cheat sheet page (dual-mode)
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

Conventions
- No build step; all assets static
- Prefer hash links (`#/page`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
- DRY principles: Reusable functions for button text, category labels, CSS classes, and SVG icons
- Enhanced readability: 12px font for card summaries, modal enlargement for detailed content
