# Guide Loading System

## Overview

The CCRI Cyberknights website includes a sophisticated guide loading system that allows standalone HTML files to be seamlessly integrated into the Single-Page Application (SPA) while maintaining their ability to function as independent guides.

## Architecture

### Dual-Mode Operation

The system supports two modes of operation:

1. **SPA Mode**: Documents loaded within the main application shell
2. **Standalone Mode**: Documents accessed directly as independent HTML files

### Technical Implementation

#### Route Structure
- **SPA Route**: `#/guides/filename.html` (clean URLs without path prefixes)
- **Legacy Route**: `#/document/filename.html` (deprecated, backward compatibility)
- **Standalone Route**: `guides/filename.html` (direct file access)

#### Core Components

1. **Guide Template**: `page-guides` template in `index.html` (minimal template with no headers)
2. **Async Router**: Enhanced `render()` function with fetch capability
3. **Content Extraction**: Body content extraction from full HTML documents

## Template Design

### Clean Document Display

The document template (`page-document`) uses a minimal design approach:

- **No Template Headers**: Documents display with only their native headers
- **Clean URLs**: `#/guides/filename.html` instead of `#/guides/guides/filename.html`
- **Direct Content Loading**: Content loads directly into `#document-content` without wrapper headers
- **Bottom Navigation**: Simple navigation links at the bottom for context

This approach ensures documents maintain their original design and hierarchy while being seamlessly integrated into the SPA.

## How It Works

### SPA Document Loading Process

1. **Route Detection**: Router detects `#/guides/` prefix (or legacy `#/document/` prefix)
2. **Template Loading**: Loads `page-guides` template
3. **File Fetching**: Uses `fetch()` to retrieve the target HTML file
4. **Content Extraction**: Extracts body content using regex pattern
5. **Content Injection**: Injects extracted content into `#guides-content`

### Legacy Route Support

The system maintains backward compatibility for existing `#/document/` URLs:

- **Automatic Detection**: Legacy routes are automatically detected and handled
- **Deprecation Notice**: Users accessing legacy routes see a warning banner
- **Same Functionality**: Legacy routes work identically to new routes
- **Migration Encouragement**: Users are prompted to update bookmarks to new format

**Legacy Route Examples:**
- `#/document/linux-cheatsheet-1.html` → loads `guides/linux-cheatsheet-1.html`
- `#/document/linux-day-1-setup-tips.html` → loads `guides/linux-day-1-setup-tips.html`

**Migration Path:**
- Update bookmarks from `#/document/` to `#/guides/`
- Update any hardcoded links in documentation
- Legacy routes will continue to work but may be removed in future versions

### Code Implementation

```javascript
// Route definition
const routes = {
  // ... other routes
  'document': document.getElementById('page-document').innerHTML
};

// Enhanced render function
async function render() {
  const raw = (location.hash || '').replace(/^#\/?/, '');
  const [pageName, ...segments] = raw.split('/');
  const page = pageName || 'home';
  
  const app = document.getElementById('app');

  // Handle document pages
  if (page === 'document' && segments.length > 0) {
    app.innerHTML = routes['document'];
    
    // Build file path with document/ prefix for clean URLs
    const filePath = 'document/' + segments.join('/');
    
    try {
      const res = await fetch(filePath);
      const text = await res.text();
      const bodyMatch = text.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const content = bodyMatch ? bodyMatch[1] : text;
      
      // Load content directly - no template headers
      document.getElementById('document-content').innerHTML = content;
    } catch (err) {
      document.getElementById('document-content').innerHTML =
        `<p class="text-red-400">Failed to load ${filePath}</p>`;
    }
    return;
  }
  
  // ... rest of render function
}
```

## Usage Examples

### Creating a New Document

1. **Create Standalone HTML File**:
   ```html
   <!-- document/new-guide.html -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="utf-8">
     <title>New Guide - CCRI Cyberknights</title>
     <script src="https://cdn.tailwindcss.com"></script>
     <!-- Include necessary scripts and styles -->
   </head>
   <body class="bg-slate-900 text-slate-200 min-h-screen">
     <div class="max-w-4xl mx-auto p-6 space-y-8">
       <!-- Document content -->
       <h1>New Guide</h1>
       <p>Guide content here...</p>
     </div>
   </body>
   </html>
   ```

2. **Add SPA Link**:
   ```html
   <a href="#/guides/new-guide.html">New Guide</a>
   ```

3. **Add to Resources Data** (if applicable):
   ```javascript
   { 
     name: 'New Guide', 
     url: '#/guides/new-guide.html', 
     cat: 'category', 
     desc: 'Description of the guide' 
   }
   ```

### Navigation Patterns

#### Internal SPA Navigation
```html
<!-- Links within the SPA -->
<a href="#/guides/linux-cheatsheet-1.html">Linux Cheat Sheet</a>
```

#### External/Direct Access
```html
<!-- Direct links to standalone files -->
<a href="document/linux-cheatsheet-1.html" target="_blank">Linux Cheat Sheet</a>
```

## Benefits

### For Users
- **Seamless Experience**: Documents load within the main application shell
- **Consistent Navigation**: Header, footer, and navigation remain available
- **Fast Loading**: No full page reloads when navigating between documents
- **Bookmarkable**: Both SPA routes and direct file URLs work

### For Developers
- **Flexible Architecture**: Documents can be standalone or integrated
- **Easy Maintenance**: Single source of truth for document content
- **Progressive Enhancement**: Documents work even if JavaScript fails
- **SEO Friendly**: Direct file access provides proper HTML structure

### For Content Creators
- **Familiar Format**: Standard HTML documents with full styling
- **Independent Testing**: Can test documents in isolation
- **Easy Sharing**: Direct URLs work for external sharing
- **Version Control**: Each document is a separate file

## File Structure

```
project-root/
├── index.html                    # Main SPA with document loading
├── document/
│   ├── linux-cheatsheet-1.html   # Standalone document
│   └── other-guides.html         # Additional documents
├── js/
│   ├── qr-code-manager.js        # QR functionality
│   └── qrcode.min.js            # QR library
└── docs/
    └── DOCUMENT-LOADING.md       # This documentation
```

## Best Practices

### Document Creation
1. **Use Full HTML Structure**: Include complete `<!DOCTYPE html>` declaration
2. **Include Required Scripts**: Add Tailwind CSS and necessary JavaScript
3. **Consistent Styling**: Use the same color scheme and design patterns
4. **Responsive Design**: Ensure documents work on mobile devices

### Navigation Links
1. **SPA Links**: Use `#/document/path/to/file.html` for internal navigation
2. **External Links**: Use `path/to/file.html` for external sharing
3. **Back Navigation**: Include appropriate back links in document content

### Error Handling
1. **Graceful Degradation**: Documents should work without JavaScript
2. **Clear Error Messages**: Provide helpful error messages for failed loads
3. **Fallback Content**: Include fallback content for missing files

## Troubleshooting

### Common Issues

#### Document Not Loading
- **Check File Path**: Ensure the file path in the route matches the actual file location
- **Verify Server**: Ensure files are being served over HTTP (not file://)
- **Check CORS**: Verify CORS headers allow fetch requests

#### Styling Issues
- **Missing CSS**: Ensure Tailwind CSS is included in the document
- **Style Conflicts**: Check for CSS conflicts between SPA and document styles
- **Responsive Issues**: Test on different screen sizes

#### Navigation Problems
- **Hash Routing**: Ensure the SPA router is properly handling document routes
- **Link Format**: Verify links use the correct `#/document/` format
- **Back Navigation**: Check that back links work correctly

### Debug Mode

Enable debug logging by adding console statements:

```javascript
console.log('Loading document:', filePath);
console.log('Fetch response:', res);
console.log('Extracted content length:', content.length);
```

## Future Enhancements

### Planned Features
1. **Document Indexing**: Automatic generation of document lists
2. **Search Integration**: Include document content in site search
3. **Caching**: Implement document content caching for performance
4. **Lazy Loading**: Load document content on demand

### Extension Points
1. **Custom Templates**: Support for different document templates
2. **Metadata Extraction**: Extract and display document metadata
3. **Version Control**: Track document versions and changes
4. **Analytics**: Track document usage and engagement

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md) - Overall system architecture
- [Routing & Navigation](ROUTING-NAV.md) - Routing system details
- [Resources Management](RESOURCES-MAINTAINERS.md) - Managing resource links
- [Testing Guide](TESTING.md) - Testing document loading functionality
- [QR Code Integration](../document/README.md) - QR code implementation in educational documents
- [QR Code Generation](../scripts/README.md) - QR code generation system and tools
