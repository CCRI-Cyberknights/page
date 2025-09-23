# Troubleshooting Guide

This document covers common issues encountered during development and maintenance of the CCRI Cyberknights website.

## URL Structure Issues

### Problem: URLs Changed from `/#/home` to `/index.html#/home`

**Symptoms:**
- Users reported that URLs were showing `index.html` in the path
- Previously clean URLs like `https://ccri-cyberknights.github.io/page/#/home` became `https://ccri-cyberknights.github.io/page/index.html#/home`
- Issue appeared after implementing the Linux cheat sheet functionality

**Root Cause:**
The issue was caused by navigation links in `resources/linux-cheatsheet-1.html` that explicitly referenced `index.html`:

```html
<!-- INCORRECT (caused the issue) -->
<a href="../index.html#/resources">← Back to Resources</a>
<a href="../index.html#/linux">Linux Boot Guide</a>

<!-- CORRECT (clean URLs) -->
<a href="../#/resources">← Back to Resources</a>
<a href="../#/linux">Linux Boot Guide</a>
```

**Why This Happened:**
When users clicked the navigation links in the Linux cheat sheet, their browsers displayed the full URL including `index.html`. This created the appearance that GitHub Pages had changed its serving behavior, when in fact both URL formats work correctly.

**Solution:**
Update navigation links in standalone HTML files to use clean hash routing without explicit `index.html` references.

**Verification:**
Both URL formats serve identical content:
- `https://ccri-cyberknights.github.io/page/#/home` ✅
- `https://ccri-cyberknights.github.io/page/index.html#/home` ✅

**Prevention:**
- Always use clean hash routing (`#/page`) in internal navigation links
- Avoid explicit `index.html` references in relative URLs
- Test navigation flows to ensure clean URLs are maintained

## Routing Issues

### Problem: Linux Resources Page Shows "Loading Document..."

**Symptoms:**
- Visiting `#/resources/linux` displays "Loading Document..." instead of content
- Issue appeared after major refactoring commit

**Root Cause:**
The Linux resources page was using a separate template (`page-resources-linux`) that wasn't properly integrated with the main resources system.

**Solution:**
1. **Integrated Linux into main resources system** - Removed the separate `page-resources-linux` template
2. **Updated routing** - Linux resources now use the main resources template with filtering
3. **Enhanced intro text** - Added Linux-specific intro text that displays when navigating to `/resources/linux`

**Current Implementation:**
- Linux resources are now part of the main resources data array
- The `/resources/linux` route uses the main resources template with `linux` filter preselected
- Linux-specific intro text displays automatically when navigating to the Linux filter
- All dynamic functionality (search, filtering, transitions) works for Linux resources

**Verification:**
- `#/resources/linux` now displays Linux resources with proper filtering
- Linux filter button is active when navigating to `/resources/linux`
- Linux-specific intro text displays correctly
- Dynamic intro text transitions work when clicking filter buttons

## GitHub Pages Configuration

### `.nojekyll` File

**Purpose:**
The `.nojekyll` file tells GitHub Pages to serve files as static assets without Jekyll processing.

**When to Use:**
- When using custom build processes
- When serving static HTML/CSS/JS files directly
- When Jekyll processing interferes with site functionality

**Implementation:**
Create an empty `.nojekyll` file in the repository root:
```bash
touch .nojekyll
```

**Note:** This file was added during troubleshooting but is kept as a best practice for static sites.

## Common Development Issues

### JavaScript Module Loading

**Problem:** QR code functionality not working after refactoring

**Symptoms:**
- QR code toggle button not responding
- Console errors about missing functions
- Inconsistent behavior between main site and standalone pages

**Solution:**
- Ensure `js/qr-code-manager.js` is loaded after `js/qrcode.min.js`
- Use consistent initialization patterns across all pages
- Test functionality on both main site and standalone pages

### File Path Issues

**Problem:** Broken links after moving files

**Symptoms:**
- 404 errors for JavaScript files
- Missing images or assets
- Inconsistent behavior between local and deployed versions

**Solution:**
- Update all references when moving files
- Use relative paths consistently
- Test both local and deployed versions

## Testing Strategy

### Manual Testing Checklist

Before deploying changes:

1. **Navigation Testing:**
   - [ ] All internal links work correctly
   - [ ] URLs remain clean (no unnecessary `index.html`)
   - [ ] Hash routing functions properly

2. **Cross-Page Testing:**
   - [ ] Main site navigation works
   - [ ] Standalone pages load correctly
   - [ ] Links between pages function properly

3. **QR Code Testing:**
   - [ ] QR code toggle works on main site
   - [ ] QR code functionality works on standalone pages
   - [ ] Download functionality works

4. **Resource Page Testing:**
   - [ ] All resource categories display correctly
   - [ ] Filtering works properly
   - [ ] Deep links function correctly

### Automated Testing

Use the Selenium test suite in the `tests/` directory:

```bash
# Start development server
python3 -m http.server 8000

# Activate test environment
source testing_env/bin/activate

# Run all tests
python tests/run_tests.py
```

## Debugging Tips

### Browser Developer Tools

1. **Console Tab:**
   - Check for JavaScript errors
   - Verify function availability
   - Monitor network requests

2. **Network Tab:**
   - Verify all assets load correctly
   - Check for 404 errors
   - Monitor redirect behavior

3. **Elements Tab:**
   - Inspect DOM structure
   - Verify CSS classes are applied
   - Check for missing elements

### Server-Side Debugging

1. **Check GitHub Pages Status:**
   - Verify deployment completed successfully
   - Check for build errors
   - Confirm file structure

2. **Test Both URL Formats:**
   ```bash
   curl "https://ccri-cyberknights.github.io/page/#/home"
   curl "https://ccri-cyberknights.github.io/page/index.html#/home"
   ```

## Prevention Strategies

### Code Review Checklist

- [ ] All internal links use clean hash routing
- [ ] No explicit `index.html` references in relative URLs
- [ ] All routes are properly registered
- [ ] JavaScript modules load in correct order
- [ ] Cross-page functionality tested

### Documentation Updates

- [ ] Update relevant documentation when making changes
- [ ] Document new troubleshooting steps
- [ ] Keep this file current with new issues

## Lessons Learned

1. **Simple Issues Can Have Complex Symptoms:** The URL structure issue appeared to be a GitHub Pages configuration problem but was actually caused by simple navigation links.

2. **Test User Journeys:** Always test complete user flows, not just individual pages.

3. **Verify Assumptions:** Both URL formats worked correctly - the issue was browser behavior, not server behavior.

4. **Document Troubleshooting:** Keep detailed records of issues and solutions for future reference.

---

*Last Updated: January 2025*
*Related Files: `resources/linux-cheatsheet-1.html`, `index.html`, `.nojekyll`*
