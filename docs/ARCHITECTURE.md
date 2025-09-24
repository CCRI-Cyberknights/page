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
- Documents: `#/document/filename.html` routes load standalone HTML files into the SPA shell with clean display (no template headers). Documents display with their native headers only. Supports dual-mode operation (SPA integration and standalone access). Linux documents (`linux-cheatsheet-1.html`, `linux-day-1-setup-tips.html`) use DRY CSS classes with official Cyberknights color palette, consistent dark theme, and reusable styling components. **QR Code Integration**: Educational documents feature embedded base64 QR codes for instant access to related video content, using table-based layouts with green background QR codes and black modules for optimal scanning.
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
- `document/linux-cheatsheet-1.html` — standalone Linux cheat sheet page with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `document/linux-cheatsheet-2.html` — standalone Linux cheat sheet page focusing on file operations with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `document/linux-day-1-setup-tips.html` — Linux day 1 setup guide with consistent styling and DRY implementation (dual-mode)
- `document/README.md` — comprehensive documentation for QR code integration in educational documents
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

Conventions
- No build step; all assets static
- Prefer hash links (`#/page`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
- DRY principles: Reusable functions for button text, category labels, CSS classes, and SVG icons
- Enhanced readability: 12px font for card summaries, modal enlargement for detailed content
