# Legacy Route Migration Guide

## Overview

This document explains the migration from `#/document/` routes to `#/guides/` routes and the legacy support system implemented for backward compatibility.

## Background

The CCRI Cyberknights website underwent a refactoring to rename the `document/` directory to `guides/` to avoid conflicts with software development documentation. This change affects all guide-related URLs in the Single Page Application (SPA).

## Route Changes

### Before (Legacy)
- `#/document/linux-cheatsheet-1.html`
- `#/document/linux-cheatsheet-2.html`
- `#/document/linux-day-1-setup-tips.html`

### After (New Format)
- `#/guides/linux-cheatsheet-1.html`
- `#/guides/linux-cheatsheet-2.html`
- `#/guides/linux-day-1-setup-tips.html`

## Legacy Support Implementation

### Automatic Detection
The routing system automatically detects legacy `#/document/` URLs and handles them identically to new `#/guides/` URLs:

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
}
```

### Deprecation Notice
Users accessing legacy routes see a prominent warning banner:

- **Visual Design**: Amber-colored warning with warning icon
- **Message**: Explains the legacy route usage and encourages migration
- **Action**: Users are prompted to update bookmarks to new format
- **Timeline**: Notes that legacy routes may be removed in future versions

### Route Mapping
Legacy routes are automatically mapped to the new file structure:

| Legacy Route | New Route | File Path |
|--------------|-----------|-----------|
| `#/document/linux-cheatsheet-1.html` | `#/guides/linux-cheatsheet-1.html` | `guides/linux-cheatsheet-1.html` |
| `#/document/linux-cheatsheet-2.html` | `#/guides/linux-cheatsheet-2.html` | `guides/linux-cheatsheet-2.html` |
| `#/document/linux-day-1-setup-tips.html` | `#/guides/linux-day-1-setup-tips.html` | `guides/linux-day-1-setup-tips.html` |

## Migration Steps

### For Users
1. **Update Bookmarks**: Change any bookmarked URLs from `#/document/` to `#/guides/`
2. **Update Links**: Update any hardcoded links in personal documentation
3. **Test Functionality**: Verify that new routes work correctly

### For Developers
1. **Update Documentation**: Ensure all documentation uses new `#/guides/` format
2. **Update Tests**: Modify test suites to use new route format
3. **Monitor Usage**: Track legacy route usage to plan future removal

### For Content Creators
1. **New Content**: Always use `#/guides/` format for new guide links
2. **Existing Content**: Update existing references when convenient
3. **Cross-References**: Update any internal links between guides

## Technical Implementation

### Route Registration
Both legacy and new routes are registered in the routes object:

```javascript
routes = {
  // ... other routes
  'guides': document.getElementById('page-guides').innerHTML,
  'document': document.getElementById('page-guides').innerHTML  // Legacy route support
};
```

### URL Detection
The system checks for both route patterns:

```javascript
// External link detection
if (url && !url.startsWith('#/guides/') && !url.startsWith('#/document/')) {
  return 'target="_blank" rel="noopener noreferrer"';
}

// Icon selection
if (url.startsWith('#/guides/') || url.startsWith('#/document/')) {
  return getDocumentIcon();
}
```

### Deprecation Notice HTML
The deprecation notice is embedded in the guides template:

```html
<div id="legacy-notice" class="hidden p-4 rounded-lg border border-amber-600 bg-amber-900/20 text-amber-200">
  <div class="flex items-start space-x-3">
    <svg class="w-5 h-5 mt-0.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <!-- Warning icon -->
    </svg>
    <div>
      <h3 class="font-semibold text-amber-300">Legacy Route Detected</h3>
      <p class="text-sm mt-1">You're using a legacy <code class="bg-amber-800/40 px-1 rounded">#/document/</code> URL. Please update your bookmarks to use the new <code class="bg-amber-800/40 px-1 rounded">#/guides/</code> format.</p>
      <p class="text-xs mt-2 text-amber-400">Legacy routes will continue to work but may be removed in future versions.</p>
    </div>
  </div>
</div>
```

## Testing

### Manual Testing
1. **Legacy Routes**: Test that `#/document/linux-cheatsheet-1.html` loads correctly
2. **Deprecation Notice**: Verify warning banner appears for legacy routes
3. **New Routes**: Confirm `#/guides/linux-cheatsheet-1.html` works without warning
4. **Functionality**: Ensure both route types load identical content

### Automated Testing
The test suite has been updated to handle both route types:

```python
# Test both new and legacy routes
test_urls = [
    "#/guides/linux-cheatsheet-1.html",
    "#/document/linux-cheatsheet-1.html"  # Legacy route
]
```

## Future Plans

### Phase 1: Current (v1.5.6)
- ✅ Legacy routes work with deprecation warnings
- ✅ New routes are the default
- ✅ Comprehensive documentation

### Phase 2: Future Version
- 🔄 Monitor legacy route usage
- 🔄 Consider removal timeline
- 🔄 Plan migration assistance tools

### Phase 3: Deprecation
- ⏳ Remove legacy route support
- ⏳ Update all documentation
- ⏳ Clean up codebase

## Benefits of Migration

### Improved Semantics
- **Clear Purpose**: "guides" better describes educational content
- **Avoid Conflicts**: No confusion with software documentation
- **Consistent Naming**: Aligns with directory structure

### Better Organization
- **Logical Structure**: Guides are clearly educational resources
- **Easier Maintenance**: Consistent naming throughout codebase
- **Future-Proof**: Room for additional guide types

### Enhanced User Experience
- **Clear Intent**: Users understand they're accessing guides
- **Consistent URLs**: All educational content uses same pattern
- **Better SEO**: More descriptive URLs for search engines

## Support

For questions about the migration or legacy route support:

1. **Check Documentation**: Review this guide and related docs
2. **Test Routes**: Verify functionality with both route types
3. **Report Issues**: Document any problems with legacy support
4. **Plan Migration**: Update bookmarks and links when convenient

## Conclusion

The migration from `#/document/` to `#/guides/` routes improves the semantic clarity of the application while maintaining full backward compatibility. Legacy routes continue to work with appropriate deprecation warnings, ensuring a smooth transition for all users.

The implementation provides a robust foundation for future development while respecting existing user workflows and bookmarks.
