# Routing and Navigation

## Hash Routing

- URLs use `#/page` (e.g., `#/home`, `#/cybersecurity`, `#/linux`, `#/calendar`, `#/resources`).
- Resources supports optional subpaths for preselected filters: `#/resources/<filter>` where `<filter>` is one of `all`, `cyberknights`, `ccri`, `ctf-competitions`, `ctf-tools`, `stem`, `career`, `linux`.
- Maps use campus-specific routes: `#/map-{campus}-{room}` (e.g., `#/map-warwick-4080`).
- Documents use dynamic loading routes: `#/document/filename.html` (e.g., `#/document/linux-cheatsheet-1.html`).
- On load, a normalizer converts legacy `?page=` URLs to hash routes via `history.replaceState`.
- Router logic lives in `index.html` and re-renders on `hashchange`.

## Document Loading Routes

The system supports loading standalone HTML files into the SPA using the `#/document/` prefix:

- **Route Format**: `#/document/filename.html`
- **Example**: `#/document/linux-cheatsheet-1.html`
- **Behavior**: Fetches the HTML file and injects its body content into the document template
- **Dual Mode**: Files work both as SPA routes and as standalone HTML documents

### Document Loading Process

1. Router detects `#/document/` prefix
2. Loads the `page-document` template
3. Fetches the target HTML file using `fetch()`
4. Extracts body content using regex pattern
5. Injects content into `#document-content` element

## Navigation Design

- Simplified direct navigation with no hamburger menu.
- Navigation is always visible and responsive across all screen sizes.
- Clean header design featuring only the CyberKnights logo and navigation links.

## Adding a Route

### Standard Routes

1. Add a `<template id="page-yourid">`.
2. Register it in the `routes` map in `index.html`.
3. Link using `#/yourid` (avoid modifying the primary header nav unless essential).

### Document Routes

1. Create a standalone HTML file (e.g., `resources/your-document.html`).
2. Ensure the file has complete HTML structure with `<body>` content.
3. Link using `#/document/path/to/your-document.html`.
4. The file will work both as an SPA route and as a standalone document.
