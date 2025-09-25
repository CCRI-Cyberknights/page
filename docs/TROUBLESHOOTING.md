# Troubleshooting Guide

This document covers common issues encountered during development and maintenance of the CCRI Cyberknights website.

## URL Structure Issues

### Problem: URLs Changed from `/#/home` to `/index.html#/home`

**Symptoms:**
- Users reported that URLs were showing `index.html` in the path
- Previously clean URLs like `https://ccri-cyberknights.github.io/page/#/home` became `https://ccri-cyberknights.github.io/page/index.html#/home`
- Issue appeared after implementing the Linux cheat sheet functionality

**Root Cause:**
The issue was caused by navigation links in `document/linux-cheatsheet-1.html` that explicitly referenced `index.html`:

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

### Modal Bullet Formatting Missing

**Problem:** Resource modals showing empty content instead of bulleted detailed summaries

**Symptoms:**
- Modals open but show no detailed content
- Detailed summary text appears to be missing
- Bullet points not displaying in modal content
- Issue appeared after removing "more info" pulldowns

**Root Cause:**
The `formatDetailedSummary` function was accidentally removed when cleaning up the "more info" pulldown functionality, but the modal was still trying to call this function.

**Solution:**
1. **Re-added the `formatDetailedSummary` function**:
   ```javascript
   function formatDetailedSummary(text) {
     if (!text) return '';
     
     // Split by periods and filter out empty strings
     const sentences = text.split('.').filter(s => s.trim().length > 0);
     
     // Create bullet points
     return sentences.map(sentence => {
       const trimmed = sentence.trim();
       return `<li>${trimmed}${trimmed.endsWith('.') ? '' : '.'}</li>`;
     }).join('');
   }
   ```

2. **Updated modal HTML to wrap bullets in `<ul>` tags**:
   ```html
   <div class="text-slate-400 mb-6 leading-relaxed">
     <ul class="list-disc list-inside space-y-1">
       ${formatDetailedSummary(resource.detailedSummary)}
     </ul>
   </div>
   ```

**Current Implementation:**
- Detailed summaries are properly formatted as bullet points
- Modal content displays correctly with proper spacing
- Function dependency is maintained for consistent formatting

**Verification:**
- Open any resource modal to confirm bullet points display
- Check that detailed summaries are properly formatted
- Verify consistent spacing and styling

### Modal Interaction Problems

**Problem:** Resource modals not closing when clicking on content

**Symptoms:**
- Users had to click the "X" button to close modals
- Clicking anywhere on the modal content didn't close it
- Poor user experience for modal interaction

**Root Cause:**
The modal was only configured to close when clicking the overlay (outside the modal) or the "X" button, but not when clicking on the modal content itself.

**Solution:**
1. **Added click handler to modal content:**
   ```javascript
   <div class="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto cursor-pointer" onclick="closeResourceModal()">
   ```

2. **Prevented action button from closing modal:**
   ```javascript
   <a href="${resource.url}" ... onclick="event.stopPropagation()">
   ```

**Current Implementation:**
- Click anywhere on modal content → Modal closes
- Click "Visit Site" button → Opens link (doesn't close modal)
- Click "X" button → Modal closes (still works)
- Click outside modal → Modal closes (already worked)

**Verification:**
- Modal closes when clicking on title, content, or empty areas
- Action button still functions correctly without closing modal
- All existing close methods continue to work

### Bulleted Formatting Inconsistency

**Problem:** Modal content displayed as wall of text instead of bullet points

**Symptoms:**
- Inline card expansion showed bulleted content
- Modal popup showed raw text without formatting
- Inconsistent user experience between interaction methods

**Root Cause:**
The modal was displaying `resource.detailedSummary` directly without using the `formatDetailedSummary()` function that creates bullet points.

**Solution:**
Updated modal to use the same formatting function as inline expansion:
```javascript
// Before
${resource.detailedSummary}

// After  
${formatDetailedSummary(resource.detailedSummary)}
```

**Current Implementation:**
- Both inline card expansion and modal popup use bulleted formatting
- Consistent user experience across all resource detail views
- Same `formatDetailedSummary()` function used everywhere

**Verification:**
- Modal content displays with bullet points
- Inline expansion continues to work with bullet points
- Consistent formatting across all interaction methods

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
   - [ ] Modal opens when clicking resource cards
   - [ ] Modal closes when clicking anywhere on content
   - [ ] Modal displays bulleted formatting
   - [ ] Action button opens links without closing modal
   - [ ] Inline card expansion shows bulleted content
   - [ ] Inline expansion can be collapsed by re-clicking

### Automated Testing

Use the Selenium test suite in the `tests/` directory:

```bash
# Start development server
python3 -m http.server 8000

# Activate test environment
source selenium_env/bin/activate

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
*Related Files: `document/linux-cheatsheet-1.html`, `index.html`, `.nojekyll`*
