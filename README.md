# QR Code Landing Pages

## Project Overview

This repository hosts the official landing pages for the CCRI Cybersecurity Club's various QR code campaigns. The goal is to provide a single, easy-to-manage web platform that delivers targeted information and resources to new and prospective club members. This project is a foundational part of our recruitment and outreach strategy.

## Features

- Multi-page Design: Uses a single `index.html` file with a JavaScript router to display multiple pages, each corresponding to a different QR code. This allows us to use multiple QR codes that direct to a single, easily manageable URL.
- Fully Responsive: The site is built with Tailwind CSS, ensuring a clean and optimal viewing experience on any device, from desktop computers to mobile phones.
- Clean UI/UX: Simplified navigation with consistent design patterns, organized resource categories, and beginner-friendly guidance.
- Branded Color Palette: Hybrid forge color scheme with `#04703C` primary green, industrial accents, and strategic color hierarchy.
- Automated Testing: Comprehensive test suite using Selenium WebDriver to ensure functionality across different pages and features.
- Key Landing Pages:
  - Home: Features a hero section announcing venue changes and club mission
  - Cybersecurity Club: Provides links to our main club page and the official signup form
  - CyberKnights Linux: Contains comprehensive boot guides including USB Boot Guide and VirtualBox Boot Guide, with step-by-step instructions and common one-time boot menu keys
  - Calendar: Displays meeting schedules with color-coded meeting types and clickable room numbers
  - Resources: Curated tools and links for learning and competitions with organized categories and default club filter
  - Campus Maps: Interactive maps for meeting locations (e.g., `/map-warwick-4080`)
  - Documents: Standalone HTML documents that can be loaded within the SPA or accessed directly

## Getting Started

To view the site locally, simply open the `index.html` file in your web browser.

To link a QR code to a specific page, use hash routes. For example:

- To link to the Home page: `your-site-url.com/#/home`
- To link to the Cybersecurity Club page: `your-site-url.com/#/cybersecurity`
- To link to the Linux guide: `your-site-url.com/#/linux`
- To link to the Calendar: `your-site-url.com/#/calendar`
- To link to the Resources: `your-site-url.com/#/resources`
- To link to the Warwick Room 4080 map: `your-site-url.com/#/map-warwick-4080`
- To link to a document: `your-site-url.com/#/document/path/to/file.html`

### Resources Deep Links

- All resources: `#/resources` (defaults to Cyberknights filter)
- Category links (in display order):
  - Cyberknights: `#/resources/cyberknights` (default)
  - CCRI & Certs: `#/resources/ccri`
  - CTF Competitions: `#/resources/ctf-competitions`
  - CTF & Code Breaking Tools: `#/resources/ctf-tools`
  - STEM Day: `#/resources/stem`
  - Linux: `#/resources/linux`

### Document Loading System

The site includes a sophisticated document loading system that allows standalone HTML files to be seamlessly integrated into the Single-Page Application (SPA) while maintaining their ability to function as independent documents.

**Dual-Mode Operation:**
- **SPA Mode**: Documents loaded within the main application shell (`#/document/path/to/file.html`)
- **Standalone Mode**: Documents accessed directly as independent HTML files (`path/to/file.html`)

**Benefits:**
- Seamless user experience with consistent navigation
- Fast loading without full page reloads
- Documents work both within the SPA and as standalone files
- Easy sharing with direct URLs
- Maintains clean URL structure

**Example Usage:**
- SPA Link: `#/document/resources/linux-cheatsheet-1.html`
- Direct Link: `resources/linux-cheatsheet-1.html`

## Contribution

As this project is a core part of the club's infrastructure, contributions are highly encouraged. Here are a few ways to get involved:

- Content: Help us create new pages for upcoming events, workshops, or competitions.
- Design: Refine the existing look and feel, or propose new design ideas.
- Code: Improve the JavaScript router, add new features, or optimize the code for performance.

If you are a club member, you can fork this repository and submit a pull request with your changes. New to GitHub? We can help you get started with the basics of forking, branching, and submitting your first contribution.

## Deploying to GitHub Pages

1. In your repository, go to `Settings > Pages`.
2. Set Source to `Deploy from a branch`, Branch `main` and `/ (root)`.
3. Ensure a `.nojekyll` file exists at the root (prevents Jekyll processing).
4. After saving, your site will be available at the Pages URL shown.

### QR Codes

- Every page has a footer QR panel:
  - Generates a QR for the current page URL (offline, no CDN)
  - Lets you edit text/URL to generate a custom QR
  - Button: Download PNG
  - ECL Correction Level controls: − M + (cycles L → M → Q → H)
- You can link directly to a page via hash, for example:
  - Club page: `<pages-url>/#/cybersecurity`
  - Linux guide: `<pages-url>/#/linux`
  - Home: `<pages-url>/#/home`
  - Calendar: `<pages-url>/#/calendar`

## Documentation Index

- Architecture: `docs/ARCHITECTURE.md`
- Calendar maintainer guide: `docs/CALENDAR-UPDATING.md`
- Document Loading System: `docs/DOCUMENT-LOADING.md`
- Document Usage Examples: `docs/DOCUMENT-EXAMPLES.md`
- QR Codes: `docs/QR-CODES.md`
- Routing & Navigation: `docs/ROUTING-NAV.md`
- Mobile UX Guide: `docs/MOBILE-UX-GUIDE.md`
- Image Assets: `docs/ASSETS-IMAGES.md`
- QR UI Details: `docs/QR-UI.md`
- Resources Maintainers: `docs/RESOURCES-MAINTAINERS.md`
- Site Operations: `docs/SITE-OPERATIONS.md`
- Resources page: `docs/RESOURCES.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
- Color Palette: `docs/color-palettes/COLOR-PALETTE.md`

## Calendar Integration (Developer Spec)

This site renders club events from a public Google Calendar ICS feed. The Calendar page (`#/calendar`) combines three layers:

1) Native Google embed (optional) — read-only iframe for a familiar month view
2) FullCalendar month grid — driven by ICS, styled to match the site
3) Custom cards — “Next Event” and “Upcoming Events”, with actions

### 1. Setup & Configuration

In Google Calendar (account: `ccricyberknightclub@gmail.com`):

- Settings → Access permissions for events → enable "Make available to public" (See all event details)
- Settings → Integrate calendar → copy:
  - Public address in iCal format (ICS): `.../public/basic.ics`
  - Optional embed URL: `https://calendar.google.com/calendar/embed?...`

In `index.html` set:

```
const CALENDAR_ICS_URL = "https://calendar.google.com/calendar/ical/YOUR_CALENDAR_ID/public/basic.ics";
const CALENDAR_EMBED_URL = "https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=America/New_York"; // optional
```

Deployment: push to `main` and GitHub Pages redeploys. Maintainers: see `CALENDAR-UPDATING.md`.

### 2. Data Pipeline & Processing (Calendar)

- Fetch: Client-side `fetch(CALENDAR_ICS_URL)` with `no-store` cache.
- CORS fallback: If blocked, a read-only proxy is attempted via `https://r.jina.ai/http://<host>/<path>`.
- Parse: Minimal ICS parser extracts `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `LOCATION`, `URL`, `RRULE`.
- Recurrence: Weekly `RRULE` expansion implemented for ~90 days ahead.
  - Supports `FREQ=WEEKLY`, `INTERVAL`, and `BYDAY` (e.g., `BYDAY=MO,WE`).
  - Each occurrence preserves duration based on original `DTEND-DTSTART`.
- Normalization: Produces a uniform event object used by both FullCalendar and cards.

### 3. Rendering Layers

- FullCalendar (via CDN): Receives expanded events; clicking an event with a `URL` opens it in a new tab.
- Next/Upcoming cards: Sorted future events; “Next Event” is the earliest upcoming.
  - Classification: `regular` if weekly (RRULE) or title contains `meeting|hang|weekly` (case-insensitive); else `special`.
  - Actions:
    - Add to Calendar (ICS): The page generates a client-side `.ics` file for the single event.
    - Add to Google: Opens a prefilled `https://www.google.com/calendar/render?action=TEMPLATE&...` link.

### 4. Failure Modes & UX

- ICS missing: Banner prompts the admin to set `CALENDAR_ICS_URL`.
- Embed missing: Only custom list and FullCalendar render; banner suggests adding `CALENDAR_EMBED_URL` (optional).
- Fetch blocked: Proxy fallback attempted; if it fails, the embed still shows (when configured), but custom lists will be empty.
- ICS staleness: Google public ICS updates every ~3–4 hours; changes may not be immediate.

### 5. Maintenance Tasks

- Switch calendar: Update `CALENDAR_ICS_URL` (and optional `CALENDAR_EMBED_URL`) in `index.html`.
- Adjust recurrence horizon: Edit the 90-day window in `expandRecurring`.
- Tune classification: Modify `classifyEvent` keyword regex.
- Proxy strategy: If `r.jina.ai` changes, replace the proxy host in both fetch helpers.
- Add event fields: Extend the ICS parser switch in `parseIcs` and pass through to renderers.

### 6. Testing & QA

- ICS plumbing: Temporarily add a unique event in Google Calendar occurring today; verify it appears in both the card list and FullCalendar.
- Links: Ensure events with Zoom links (in `URL` or inside `DESCRIPTION`) open correctly from cards and from FullCalendar.
- Recurrence: Create a weekly event (`RRULE: FREQ=WEEKLY;BYDAY=...`); verify multiple future instances populate.
- Mobile: Check usability for small screens; ensure calendar grid scrolls and cards remain readable.

### 7. Optional: Google Embed

If you also want Google’s native embed, set `CALENDAR_EMBED_URL`. The page will show the iframe above the custom views. This is optional and can be omitted if you prefer a single, consistent UI with FullCalendar + cards.

## High-Level Requirements for the GitHub Pages Project

The main goal of this project is to create a flexible, centralized, and easy-to-manage web platform for the CCRI Cybersecurity Club's public-facing information. The site must be hosted on GitHub Pages for free, and it should be accessible and understandable to new and prospective club members, including those with little or no technical background.

Here are the key requirements broken down by category:

### 1. Project Structure & Hosting

- Single-File Architecture: The entire website will be contained within a single `index.html` file. This is crucial for simple hosting on GitHub Pages, as it doesn't require complex build processes or multiple file paths for deployment.
- Router-Based Navigation: The site must handle multiple "pages" within this single file using a simple JavaScript router. This allows different QR codes to direct users to specific content (e.g., the Linux boot guide or the club's main page) while keeping the project contained in one repository.
- Primary Landing Pages:
  - Cybersecurity Club: A page with information about the club and links to key resources, like the main CCRI cybersecurity website and the signup form.
  - CyberKnights Linux: A page with clear, step-by-step instructions for booting the Linux distro from a USB drive, including common boot keys for different computer manufacturers.
- Scalability: The architecture should be simple enough to allow for the easy addition of new content or pages in the future (e.g., a page for a specific event or a CTF guide) by adding a new `div` and updating the JavaScript.

### 2. User Experience & Design

- Responsive Design: The site's layout and content must be fully responsive, ensuring optimal viewing and usability on a variety of devices, from mobile phones to desktop computers. This is critical given that users will be accessing the site via QR codes on their phones.
- Clear & Concise Content: The language used on all pages should be straightforward and easy to understand for the target audience of new and potential club members. The Linux boot guide, in particular, should avoid jargon and focus on practical steps.
- Branding & Aesthetics: The design should be visually appealing and modern, using the club's branding as a guide. The current dark theme and use of Tailwind CSS align with this requirement.
- Call-to-Action: Each page should have a clear call-to-action, whether it's to sign up for the club, get more information, or follow a set of instructions.

#### Branding & Messaging

The site mirrors the business card’s concise messaging. A banner and home section highlight the three-word tagline:

- Excitement
- Opportunity
- Belonging

Use these words as copy anchors across pages. Primary accents use CCRI green (`#00703d` / `#22c55e`) for buttons and highlights.

### 3. Development & Maintenance

- Version Control: The project will live in a public GitHub repository. This will serve as a single source of truth for the club's web content and allow for collaborative development.
- Easy Updates: The single-file design and direct hosting on GitHub Pages mean that updates can be made by simply editing the `index.html` file and pushing the changes to the repository, which will automatically redeploy the site.
- Institutional Memory: By keeping the project on GitHub and the club's official email and resources, it creates a sustainable, long-term solution that is not dependent on a single individual. This supports the club's goal of maintaining institutional memory.

These requirements ensure the project will be a highly effective and easily maintainable solution for the CyberKnights Club's marketing and resource distribution. The files provided show a clear focus on building a professional club image, and this project directly supports that goal.

## Testing

The project includes a comprehensive test suite located in the `tests/` directory:

### Running Tests

1. **Start the development server:**
   ```bash
   python3 -m http.server 8000
   ```

2. **Activate the test environment:**
   ```bash
   source selenium_env/bin/activate
   ```

3. **Run all tests:**
   ```bash
   python tests/run_tests.py
   ```

4. **Run individual tests:**
   ```bash
   python tests/test_routing.py
   python tests/test_qr_standalone.py
   ```

### Test Coverage

- ✅ Client-side routing and navigation
- ✅ Resource page filtering and display
- ✅ QR Code functionality (toggle, generation, download)
- ✅ Cross-page link functionality
- ✅ Standalone page navigation

See `tests/README.md` for detailed test documentation.
