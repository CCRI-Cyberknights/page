# Routing and Navigation

## Hash Routing

The routing system uses **overloaded hash routing** with two distinct mechanisms:

### **1. Static Routes (Template-Based)**
- URLs use `#/page` (e.g., `#/home`, `#/cybersecurity`, `#/linux`, `#/calendar`, `#/resources`)
- Resources supports optional subpaths for preselected filters: `#/resources/<filter>` where `<filter>` is one of `all`, `cyberknights`, `ccri`, `ctf-competitions`, `ctf-tools`, `stem`, `career`, `linux`
- Maps use campus-specific routes: `#/map-{campus}-{room}` (e.g., `#/map-warwick-4080`)
- These routes use pre-defined HTML templates from the `routes` object

### **2. Dynamic Routes (File Loading)**
- Guides use dynamic loading routes: `#/guides/filename.html` (e.g., `#/guides/linux-cheatsheet-1.html`)
- Legacy document routes are supported: `#/document/filename.html` (deprecated, shows warning)
- These routes **dynamically load HTML files** from the `guides/` directory
- Both route types load the same files but use different URL prefixes

### **Route Processing**
- On load, a normalizer converts legacy `?page=` URLs to hash routes via `history.replaceState`
- Router logic lives in `index.html` and re-renders on `hashchange`
- The system first checks for dynamic routes (`guides`/`document`), then falls back to static routes

## Guide Loading Routes

The system supports loading standalone HTML files into the SPA using the `#/guides/` prefix:

- **Route Format**: `#/guides/filename.html`
- **Example**: `#/guides/linux-cheatsheet-1.html`
- **Behavior**: Fetches the HTML file and injects its body content into the document template
- **Dual Mode**: Files work both as SPA routes and as standalone HTML documents

### Document Loading Process

1. Router detects `#/guides/` prefix (or legacy `#/document/` prefix)
2. Loads the `page-guides` template
3. Fetches the target HTML file using `fetch()`
4. Extracts body content using regex pattern
5. Injects content into `#guides-content` element

### Legacy Route Support

**Backward Compatibility:**
- Legacy `#/document/filename.html` routes continue to work
- Automatic detection and handling of legacy routes
- Deprecation warning displayed to users
- Same functionality as new routes

**Migration:**
- Users should update bookmarks from `#/document/` to `#/guides/`
- Legacy routes may be removed in future versions
- All existing links continue to function

**Examples:**
- Legacy: `#/document/linux-cheatsheet-1.html`
- New: `#/guides/linux-cheatsheet-1.html`
- Both load the same content from `guides/linux-cheatsheet-1.html`

## Legacy Route Migration

### Background
The website underwent a refactoring to rename the `document/` directory to `guides/` to avoid conflicts with software development documentation. This change affects all guide-related URLs in the Single Page Application (SPA).

### Why Legacy Routes Coexist
The legacy `/document` route coexists with `/guides` for **continuity** and **backward compatibility**:

- **User Bookmarks**: Existing bookmarks continue to work without breaking
- **External Links**: Third-party sites linking to guides remain functional
- **Gradual Migration**: Users can update links at their own pace
- **Zero Downtime**: No immediate disruption to existing workflows

### Technical Implementation
The routing system uses **overloaded routing** with two distinct mechanisms:

**Static Routes (Template-Based):**
```javascript
// Routes object contains pre-defined HTML templates
routes = {
  home: document.getElementById('page-home').innerHTML,
  linux: document.getElementById('page-linux').innerHTML,
  calendar: document.getElementById('page-calendar').innerHTML,
  resources: document.getElementById('page-resources').innerHTML,
  'map-warwick-4080': document.getElementById('page-map-warwick-4080').innerHTML,
  'guides': document.getElementById('page-guides').innerHTML,
  'document': document.getElementById('page-guides').innerHTML  // Legacy route support
};
```

**Dynamic Routes (File Loading):**
Both legacy and new routes are handled by the same **dynamic file loading logic**:

```javascript
// Both routes are handled by the same logic
if ((page === 'guides' || page === 'document') && segments.length > 0) {
  // Use the guides template
  app.innerHTML = routes['guides'];
  
  // Show deprecation notice for legacy routes
  if (page === 'document') {
    const legacyNotice = document.getElementById('legacy-notice');
    if (legacyNotice) {
      legacyNotice.classList.remove('hidden');
    }
  }
  
  // Build file path (always uses guides/ directory)
  const filePath = 'guides/' + segments.join('/');
  
  // Dynamically load the HTML file
  const res = await fetch(filePath);
  const text = await res.text();
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : text;
  document.getElementById('guides-content').innerHTML = content;
}
```

### Deprecation Notice
Users accessing legacy routes see a prominent warning banner explaining the migration and encouraging bookmark updates.

### Route Mapping
Legacy routes are automatically mapped to the new file structure:

| Legacy Route | New Route | File Path |
|--------------|-----------|-----------|
| `#/document/linux-cheatsheet-1.html` | `#/guides/linux-cheatsheet-1.html` | `guides/linux-cheatsheet-1.html` |
| `#/document/linux-cheatsheet-2.html` | `#/guides/linux-cheatsheet-2.html` | `guides/linux-cheatsheet-2.html` |
| `#/document/linux-day-1-setup-tips.html` | `#/guides/linux-day-1-setup-tips.html` | `guides/linux-day-1-setup-tips.html` |

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

1. Create a standalone HTML file (e.g., `document/your-document.html`).
2. Ensure the file has complete HTML structure with `<body>` content.
3. Link using `#/guides/path/to/your-guide.html`.
4. The file will work both as an SPA route and as a standalone document.

## Legacy Documentation

The following files were consolidated into this document:
- **`docs/LEGACY-ROUTE-MIGRATION.md`** - Complete migration guide and technical implementation details (last updated: commit `61c789c`)
