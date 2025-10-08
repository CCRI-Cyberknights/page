# Architecture Overview

Single-file site hosted on GitHub Pages with Tailwind (CDN) and small JS modules.

- Router: hash-based `#/page` swaps `<template>` content into `#app` with async document loading capability.
- Pages: Home (merged Club content with strategic banner placement), Linux, Calendar, Resources, Campus Maps, Documents, Blog.
- Unified Content Management: Both guides and blogs use JSON metadata files (`guides/guides.json`, `blogs/blog-posts.json`) with identical schema for seamless SPA integration.
- Branding: Interactive Cyber Knight icons with full-screen modal expansion, canonical color palette (see COLOR-PALETTE.md), enhanced QR code landing banner. Hero uses `images/branding/cyberknight-welder.webp` with toggle functionality. Home page features "Excitement • Opportunity • Belonging" banner for QR code users. Generalized image toggle system for consistent 96% screen width expansion.
- Styling: Main SPA (`index.html`) uses CSS variables; standalone files (guides, blogs) use idiomatic Tailwind CSS with JIT configuration and `@layer` directives. See TAILWIND-IDIOMS.md for migration strategy.
- Navigation: Button-style navigation links with clear visual hierarchy, mobile-optimized search with fixed positioning, external link indicators.
- Content Architecture: Strategic content reorganization with career-focused messaging, standardized text hierarchy, and logical grouping of related content in "Our Members Get Hired!" section.
- Interactive Images: Unified toggle system for navigation icons, welder image, and VBox summary screenshot with consistent sizing and behavior.
- Calendar: Google embed (default) with optional ICS-powered features (toggle via `ENABLE_CUSTOM_CALENDAR`). Features color-coded meeting types and clickable room numbers.
- QR Codes: Per-page footer generator renders as SVG using npm package encoder. 64x64px footer QR code with custom colors (dark blue-green `#001011`, light cream `#f4e4c1`) for print compatibility. Controls allow changing ECL (L/M/Q/H). Modal integration for enhanced viewing with comprehensive layout improvements (v1.7.36). **Modal Layout**: Top-aligned QR code with structured flow (QR → URL input → Controls), universal CSS Grid layout for all screen sizes, compact spacing, and vertical download buttons (PNG above SVG). QR panel auto-closes on navigation.
- Resources: `#/resources` route renders from unified content management system with comprehensive card-based display. Features organized categories, detailed resource descriptions with bullet-point formatting, modal system for enhanced readability with click-anywhere-to-close behavior, dynamic button text, and defaults to "Cyberknights" filter. Supports deep-linking via `#/resources/<filter>` and syncs chip clicks back to the hash. **Search Functionality**: Enhanced search system with `#/search?q=term` endpoint that renders resources page with pre-populated search query. Search logic includes resource names, URLs, category labels, descriptions, and summaries for comprehensive results. **Template Rendering**: `renderResourcesPage()` function properly renders resources page template (`app.innerHTML = routes['resources']`) before loading dynamic content, ensuring search functionality works correctly. All major resources include comprehensive summaries and detailed descriptions covering technical aspects, practical applications, and user benefits. Cards use 12px font for summaries with modal enlargement for detailed reading. Modal content uses consistent bullet-point formatting via `formatDetailedSummary()` function with proper HTML structure (`<ul>` tags) and Tailwind styling. Footer positioning uses sticky layout with flexbox (`flex flex-col` on body, `flex-grow` on main, `mt-auto` on footer) to ensure consistent bottom positioning regardless of content amount. **Unified Content Management**: Both guides and blogs use JSON metadata files (`guides/guides.json`, `blogs/blog-posts.json`) with identical schema for seamless SPA integration. Dynamically loads guides from `guides/guides.json` and blogs from `blogs/blog-posts.json` using `loadContent()` function for seamless integration. **Data-Driven Configuration Pattern**: Unified `categoryConfig` object with complete schema (`label`, `description`, `icon`, `color`) for all categories, runtime validation system preventing configuration bugs, factory pattern helper functions with graceful fallbacks, and comprehensive test coverage (11 tests) ensuring configuration completeness and preventing missing description bugs. **Visual Differentiation**: Blog posts feature warm amber hover accents (`hover:border-amber-500`) while guides feature cool blue hover accents (`hover:border-blue-500`) in the resources grid for subtle content type identification, with configuration-driven color assignment based on category settings.
- Guides: `#/guides/filename.html` routes load standalone HTML files into the SPA shell using the `page-guides` template. **Template System**: Uses dedicated `#guides-content` area for content injection and `#guides-navigation` for consistent "← Back to Linux Learner's Guide" navigation. Supports dual-mode operation (SPA integration and standalone access). **Legacy Support**: `#/document/filename.html` routes continue to work with deprecation warnings. Linux guides (`linux-cheatsheet-1.html`, `linux-day-1-setup-tips.html`) use DRY CSS classes with official Cyberknights color palette, consistent dark theme, and reusable styling components. **QR Code Integration**: Educational guides feature embedded base64 QR codes for instant access to related video content, using table-based layouts with green background QR codes and black modules for optimal scanning. **Unified Metadata**: Guide metadata stored in `guides/guides.json` with standardized schema including slug, title, date, category, author, summary, description, detailedSummary, file, and tags.
- Blog: `#/blog` and `#/blogs/filename.html` routes use unified loading pattern with `page-blogs` template for consistent navigation and loading states. **Unified Loading Pattern**: Both URL formats (`#/blog/slug` and `#/blogs/filename.html`) use the same `renderBlogPost()` function, eliminating code duplication and ensuring consistent behavior across all blog access methods. **Direct Navigation**: Blog posts use direct navigation to individual URLs (e.g., `#/blogs/microsoft-aws-ai-opportunities.html`) matching the guides system pattern (`#/guides/filename.html`). **Template System**: Uses dedicated `#blogs-content` area for content injection and `#blogs-navigation` for consistent "← Back to Blog" navigation. **Balanced Home Page Integration**: Clean "Updates & Blog" section with amber styling, positioned after main content sections for balanced prominence and clean user experience. **Unified Metadata**: Blog metadata stored in `blogs/blog-posts.json` with identical schema to guides for consistent management. **Style Unification**: Blog posts use consistent Cyberknights styling with official color palette (`--neon-surge`, `--ember-spark`, `--arc-weld-blue`), DRY CSS classes (`.section-container`, `.section-title`, `.emphasis-text`), and unified visual hierarchy matching Linux guides for seamless brand consistency. **Clickable Hashtags**: Blog post hashtags (e.g., `#career`, `#microsoft`, `#aws`) are automatically converted from static spans to clickable links that trigger resource search via new `#/search?q=term` endpoint. **Search Integration**: Hashtag clicks navigate to search endpoint which renders resources page with search query pre-populated, providing seamless navigation from blog content to related resources. **DRY Navigation**: Template-provided navigation eliminates duplicate "Back to Blog" links in individual HTML files. **Optimized Design**: Blog feature positioned strategically to maintain visual hierarchy while ensuring accessibility and clean user experience.
- Maps: Campus-specific map pages (e.g., `/map-warwick-4080`) with optimized images and meeting location details. See **Campus Maps** section below for detailed implementation.
- Interactive Elements: DRY implementation for image toggle functionality, CSS-based modal overlays, responsive design with viewport constraints.
- **DRY Navigation Pattern**: Unified "Back to [Section]" navigation system with factory pattern helper functions (`createBackNavigation()`, `createErrorNavigation()`), configurable styling options (emerald, neon-surge, simple), and comprehensive test coverage. **Template Integration**: Navigation provided by content templates (`page-guides`, `page-blogs`) rather than individual HTML files, ensuring consistency and maintainability. **Styling Options**: Emerald styling for most navigation (`text-emerald-400 hover:text-emerald-300`), neon-surge styling for home navigation (`neon-surge-link transition-opacity`), with configurable arrows and additional links support. **Error Handling**: Consistent error state navigation with SVG icons and graceful fallbacks. **Test Coverage**: Comprehensive test suite (`dry-navigation.spec.ts`) with 7 tests covering all navigation patterns, styling variants, and error states.
- Testing: Modern Playwright test suite with cross-browser support (Chrome, Firefox, Safari) covering client-side routing, QR code functionality, cross-page navigation, interactive element behavior, blog functionality, and guides functionality. Features ephemeral results, performance monitoring, and fail-fast approach. **Timeout Protection**: All tests use `timeout 30s` command to prevent hanging and ensure reliable execution. NPM scripts include timeout-enabled variants (`test:timeout`, `test:timeout:single`, `test:hashtags`) for development workflow. **Blog Testing**: Comprehensive test suite covering blog loading, direct navigation, search integration, responsive design, and error handling. **Hashtag Testing**: Comprehensive test suite (5 tests) covering hashtag conversion, click behavior, search integration, and cross-component support. **Guides Testing**: Core test suite covering guide loading, content display, navigation, search integration, responsive design, and error handling. **Category Configuration Testing**: Comprehensive test suite (11 tests) covering configuration validation, visual differentiation, error handling, configuration completeness, and runtime validation system testing to prevent configuration-related bugs.
- Versioning: **CURRENT** Modern version management using `version.json` as single source of truth, dynamic runtime fetching via `version-display.js`, and `standard-version` for automated releases. Eliminates off-by-one version display issues and provides cache-bustable version updates. Version displayed in footer with commit information tooltip. **Commit Convention**: Uses [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) for automatic version bumping - see [CONTRIBUTING.md](../CONTRIBUTING.md#commit-message-conventions).
- CI/CD Pipeline Drift Prevention: **NEW** Automated validation system that prevents GitHub Actions workflows from referencing non-existent npm scripts. Eliminates deployment failures caused by incomplete refactoring through pre-commit hooks and comprehensive workflow validation. Features include automated script reference checking, clear error reporting, and integration with existing testing infrastructure.
- SEO: Open Graph meta tags for social media sharing and search engine optimization.

Key files
- `index.html` — UI, routing, calendar logic, footer QR generator, map pages, document loading
- `package.json` — version tracking and npm scripts for automated versioning
- `version.json` — Single source of truth for version information
- `scripts/update-version-json.js` — Modern version management script for standard-version
- `js/qr-code-manager.js` — QR code generation and management functionality
- `js/version-display.js` — Dynamic version fetching and display system
- `.husky/pre-commit` — Git hook for automatic version management
- `js/qrcode.min.js` — local QR encoder (no CDN)
- `guides/linux-cheatsheet-1.html` — standalone Linux cheat sheet page with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `guides/linux-cheatsheet-2.html` — standalone Linux cheat sheet page focusing on file operations with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `guides/linux-cheatsheet-3.html` — standalone Linux cheat sheet page focusing on files, deleting, history & redirects with DRY CSS classes, official color palette, and embedded QR codes for video content (dual-mode)
- `guides/linux-day-1-setup-tips.html` — Linux day 1 setup guide with consistent styling and DRY implementation (dual-mode)
- `guides/README.md` — comprehensive documentation for QR code integration in educational guides
- `scripts/generate_qr_codes.py` — Python script for generating base64 QR codes with custom styling
- `scripts/README.md` — documentation for QR code generation system
- `favicon.ico` — site favicon
- `images/branding/cybersmith.webp` — hero image and social sharing image
- `images/maps/map-rm4080-optimized.webp` — optimized campus map image
- `tests/` — automated test suite using Playwright
- `tests/ci-validation/` — CI/CD pipeline drift prevention system
- `tests/ci-validation/validate-workflow-scripts.js` — main validation tool for workflow script references
- `tests/ci-validation/pre-commit-validation.sh` — pre-commit hook for automated workflow validation
- `tests/ci-validation/README.md` — comprehensive CI/CD validation system documentation
- Calendar updating information is now documented in this ARCHITECTURE.md file
- `docs/UI.md` — comprehensive UI documentation including document loading system
- `docs/TESTING.md` — comprehensive testing strategy and implementation
- `docs/VERSIONING.md` — **CURRENT** Tag-based deployment and versioning system documentation
- `docs/TROUBLESHOOTING.md` — CSS debugging methodology and layout troubleshooting
- `docs/COLOR-PALETTE.md` — comprehensive color palette documentation
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
- Repo renamed to `page` (from `qr-code-landing-pages`) - All references updated
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
- **Testing**: Use Playwright for all automated testing

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

## Campus Maps

### Overview

The site includes campus-specific map pages to help students find meeting locations. Maps are designed to be easily expandable for multiple campuses and rooms.

### Current Maps

#### Warwick Campus - Room 4080
- **URL**: `#/map-warwick-4080`
- **Image**: `images/maps/map-rm4080-optimized.webp`
- **Location**: Auditorium (Room 4080)
- **Meeting Times**: Mondays 5-6pm, Wednesdays 5-6pm, Saturdays 10am-1pm

### Map Page Structure

Each map page follows this template structure:

```html
<template id="page-map-{campus}-{room}">
  <section class="space-y-6">
    <h2 class="text-3xl sm:text-4xl font-bold">Campus Map - Room {room}</h2>
    <p class="text-slate-300">Find our meeting location in the {room name}.</p>
    
    <div class="rounded-lg overflow-hidden border border-slate-800 bg-slate-900/40">
      <img src="images/maps/map-{campus}-{room}-optimized.webp" alt="Campus Map showing Room {room} location" class="w-full h-auto" />
    </div>
    
    <div class="p-6 rounded-lg border border-slate-800 bg-slate-900/40">
      <h3 class="text-lg font-semibold mb-4">Meeting Location Details</h3>
      <!-- Meeting details with icons -->
    </div>
  </section>
</template>
```

### Adding New Maps

#### 1. Prepare the Image
- Create or obtain the campus map image
- Optimize using ImageMagick:
  ```bash
  convert images/maps/map-{campus}-{room}-original.png -quality 85 -strip -resize 1200x800 images/maps/map-{campus}-{room}-optimized.webp
  ```

#### 2. Add Template to index.html
- Add the map template before the `<script>` section
- Use the naming convention: `page-map-{campus}-{room}`
- Update the image source to match the optimized file

#### 3. Add Route
- Add the route to the `routes` object:
  ```javascript
  'map-{campus}-{room}': document.getElementById('page-map-{campus}-{room}').innerHTML
  ```

#### 4. Update Links
- Make room numbers clickable in relevant pages
- Link to the specific map: `#/map-{campus}-{room}`

### Image Optimization

All map images should be optimized for web:
- Format: WebP for better compression
- Quality: 85% for good balance of size/quality
- Size: 1200x800px maximum
- Strip metadata to reduce file size

### Naming Conventions

- **Template ID**: `page-map-{campus}-{room}`
- **Route**: `map-{campus}-{room}`
- **Image**: `images/maps/map-{campus}-{room}-optimized.webp`
- **Original**: `images/maps/map-{campus}-{room}-original.png`

Examples:
- Warwick Room 4080: `page-map-warwick-4080`, `#/map-warwick-4080`
- Newport Room 1234: `page-map-newport-1234`, `#/map-newport-1234`
- Lincoln Room 5678: `page-map-lincoln-5678`, `#/map-lincoln-5678`

### Integration Points

#### Calendar Page
- Room numbers in meeting descriptions link to specific maps
- No generic "View Map" button (context-specific links only)

#### Hero Section
- Main call-to-action can link to primary meeting location map
- Should be updated when primary location changes

#### Navigation
- Maps are accessible via direct URL only
- No main navigation menu entry (contextual access)

## Version Management System

### Overview
The project uses a modern version management system that eliminates common deployment issues like version lag and off-by-one errors. The system provides a single source of truth for version information and ensures deployed sites always display the correct version.

### Architecture Components

#### 1. Single Source of Truth
- **`version.json`**: Contains current version, commit hash, date, and timestamp
- **Structure**: JSON format with version, commit, date, and timestamp fields
- **Location**: Repository root, deployed alongside site assets

#### 2. Version Update Process
- **`scripts/update-version-json.js`**: Updates version.json during releases
- **Integration**: Runs via `standard-version` postbump hook
- **Automation**: Automatically stages version.json for commit

#### 3. Runtime Version Display
- **`js/version-display.js`**: Dynamically fetches and displays version
- **Features**: Cache-busting, fallback handling, multiple display targets
- **Initialization**: Auto-loads on page load, updates all version elements

#### 4. Release Management
- **`standard-version`**: Automated version bumping and release management
- **Scripts**: `release:patch`, `release:minor`, `release:major`
- **Integration**: Husky pre-commit hooks for automatic version management

### Deployment Integration

#### GitHub Pages Deployment
- **Source**: Automatic deployment from `main` branch
- **Trigger**: Any push to main branch
- **Process**: GitHub Pages builds and deploys static files
- **Version Sync**: version.json deployed with site, runtime fetching ensures accuracy

#### Release Workflow
1. **Version Bump**: `npm run release:patch|minor|major`
2. **Package Update**: `standard-version` bumps `package.json`
3. **Version File Update**: `update-version-json.js` updates `version.json`
4. **Commit**: Both files committed in same release commit
5. **Tag**: Git tag created (e.g., `v1.7.7`)
6. **Deploy**: GitHub Pages automatically deploys from main branch

### Benefits

#### ✅ Eliminates Common Issues
- **Off-by-one version display**: Site always shows correct version
- **Hardcoded version constants**: No more manual synchronization
- **Cache-related version lag**: Cache-busting ensures immediate updates
- **Complex deployment workflows**: Simple, reliable automatic deployment

#### ✅ Modern Best Practices
- **Single source of truth**: Version managed in one place
- **Dynamic fetching**: Runtime version updates without rebuilds
- **Cache-bustable**: Immediate version updates with timestamp parameters
- **Maintainable**: Clean, simple implementation

### Related Documentation
- **`docs/UI.md`**: Universal Modal System implementation and guidelines (consolidated)

## Conventions
- No build step; all assets static
- Prefer hash links (`#/page`) for Pages compatibility
- Keep code readable and small; avoid heavy dependencies
- DRY principles: Reusable functions for button text, category labels, CSS classes, and SVG icons
- Enhanced readability: 12px font for card summaries, modal enlargement for detailed content
