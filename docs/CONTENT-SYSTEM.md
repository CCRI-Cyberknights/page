# Unified Content Management System

## Overview

The CCRI Cyberknights website uses a **unified content management system** that treats blogs and guides as first-class content types with identical technical infrastructure. This approach eliminates code duplication, ensures consistency, and makes the system highly extensible.

---

## Core Principle: DRY (Don't Repeat Yourself)

Both blogs and guides share:
- **Identical JSON schema** for metadata
- **Same routing patterns** (`#/blogs/file.html`, `#/guides/file.html`)
- **Unified template system** (`page-blogs`, `page-guides`)
- **Shared styling patterns** (idiomatic Tailwind CSS with JIT + @layer)
- **Common navigation system** (DRY back navigation)
- **Integrated resources display** (automatic card generation)
- **Consistent search integration** (unified search endpoint)

---

## JSON Metadata System

### Shared Schema

Both `blogs/blog-posts.json` and `guides/guides.json` use **identical structure**:

```json
{
  "slug": "unique-identifier",
  "title": "Display Title",
  "date": "YYYY-MM-DD",
  "category": "category-key",
  "author": "Author Name",
  "summary": "Short description for cards",
  "description": "Short description for cards",
  "detailedSummary": "Comprehensive description for modals",
  "file": "filename.html",
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Why This Matters

**Single Code Path**: The SPA uses one unified system to:
1. Load metadata from JSON files
2. Generate resource cards
3. Handle routing
4. Render content
5. Manage navigation

**Extensibility**: Adding a new content type (e.g., tutorials, case studies) requires:
- Creating a new JSON file with the same schema
- Adding a routing pattern
- Reusing existing template system

---

## Routing System

### Pattern Consistency

**Blogs**:
- List view: `#/blog`
- Individual post: `#/blogs/filename.html`

**Guides**:
- List view: `#/resources/linux` (filtered resources)
- Individual guide: `#/guides/filename.html`

### Dual-Mode Operation

Both content types support:
1. **SPA Integration**: Loaded into main application shell
2. **Standalone Access**: Direct file access works independently

---

## Template System

### Dedicated Content Areas

**Blogs**: Uses `page-blogs` template with:
- `#blogs-content` - Content injection area
- `#blogs-navigation` - Consistent "← Back to Blog" navigation

**Guides**: Uses `page-guides` template with:
- `#guides-content` - Content injection area
- `#guides-navigation` - Consistent "← Back to Linux Learner's Guide" navigation

### Template Benefits

- **Consistency**: All content uses same loading pattern
- **Maintainability**: Navigation changes in one place
- **Error Handling**: Unified error states
- **Loading States**: Consistent loading indicators

---

## Styling System: Idiomatic Tailwind CSS

### Shared Approach

Both blogs and guides use:

**1. JIT Configuration**:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'neon-surge': '#43CC50',
          'steel-glow': '#5B6E6E',
          'pale-alloy': '#B8B8B8',
          'primary-green': '#04703C',
          'ember-spark': '#C27329',
          'arc-weld-blue': '#2DB2C4',
        }
      }
    }
  }
</script>
```

**2. @layer Organization**:
```html
<style type="text/tailwindcss">
  @layer base {
    :root { color-scheme: dark; }
    body { background: #0f172a; color: #e2e8f0; }
  }
  
  @layer components {
    .section-container { @apply p-6 rounded-lg border border-slate-800 bg-slate-900/40; }
    .section-title { @apply text-xl font-bold mb-4 text-neon-surge; }
    .emphasis-text { @apply font-semibold text-ember-spark; }
  }
</style>
```

**3. Custom Color Utilities**:
- `text-neon-surge` - Primary green for headings
- `text-ember-spark` - Amber for emphasis
- `text-arc-weld-blue` - Blue for links/accents

### Visual Differentiation

While sharing the same technical infrastructure, blogs and guides are visually differentiated in the resources grid:

- **Guides**: Cool blue hover accents (`hover:border-blue-500`)
- **Blogs**: Warm amber hover accents (`hover:border-amber-500`)

---

## Resources Integration

### Automatic Card Generation

Both content types automatically appear in the Resources page (`#/resources`) without manual configuration:

**Process**:
1. JSON metadata loaded on page initialization
2. Cards generated with:
   - Title, summary, and detailed summary
   - Category-based filtering
   - Search integration
   - Modal system for expanded view
3. Hover accents applied based on content type

### Category System

**Guides Categories**:
- `linux` - Linux guides and cheatsheets
- `cybersecurity` - Security-focused guides
- `setup` - Setup and configuration guides

**Blogs Categories**:
- `career` - Career opportunities and guidance
- `technical` - Technical tutorials and deep dives
- `club` - Club announcements and updates
- `competition` - CTF and competition results
- `announcement` - Important announcements

---

## Navigation System

### DRY Back Navigation

Both content types use the unified navigation system:

**Factory Pattern**:
```javascript
function createBackNavigation(options) {
  const {
    text = 'Back',
    route = '#/',
    style = 'emerald',
    showArrow = true,
    additionalLinks = []
  } = options;
  
  // Generate consistent navigation HTML
}
```

**Usage**:
- Blogs: `createBackNavigation({ text: 'Back to Blog', route: '#/blog' })`
- Guides: `createBackNavigation({ text: 'Back to Linux Learner\'s Guide', route: '#/resources/linux' })`

### Navigation Features

- Consistent styling across all content
- Configurable text and routes
- Optional arrows and additional links
- Error state handling
- Comprehensive test coverage

---

## Search Integration

### Unified Search Endpoint

Both content types integrate with the search system (`#/search?q=term`):

**Search Scope**:
- Resource names
- URLs
- Category labels
- Descriptions
- Summaries
- Tags

**Search Results**:
- Renders resources page with pre-populated query
- Highlights matching content
- Supports category filtering
- Maintains search context

---

## QR Code Integration

### Educational Content Enhancement

**Guides**: Extensive QR code integration for video content
- Table-based layouts with embedded SVG QR codes
- Green background (#10b981) with black modules
- Links to supplementary video content
- Mobile-friendly tap targets

**Blogs**: QR code support available but less common
- Can include QR codes for external resources
- Same technical infrastructure as guides
- Consistent styling and implementation

### QR Code Standards

Both content types follow the same QR code standards:
- **Format**: SVG (not PNG)
- **ViewBox**: `"0 0 23.2 23.2"` (scaled by factor of 10)
- **Fill Color**: `"#000000"` (hex format)
- **Display Size**: `120x120` pixels
- **Background**: `#10b981` (emerald green)

**Documentation**: See `docs/UI.md` - Educational Guide QR Integration section

---

## File Structure

### Directory Organization

```
project/
├── blogs/
│   ├── README.md                          # Blog-specific documentation
│   ├── blog-posts.json                    # Blog metadata (unified schema)
│   └── *.html                             # Individual blog posts
├── guides/
│   ├── README.md                          # Guide-specific documentation
│   ├── guides.json                        # Guide metadata (unified schema)
│   └── *.html                             # Individual guides
└── docs/
    ├── CONTENT-SYSTEM.md                  # This file (unified system docs)
    ├── ARCHITECTURE.md                    # Technical architecture
    └── UI.md                              # UI/UX patterns and components
```

### File Naming Conventions

Both use **kebab-case** for consistency:
- ✅ `microsoft-aws-ai-opportunities.html`
- ✅ `linux-cheatsheet-1.html`
- ❌ `MicrosoftAWSOpportunities.html`
- ❌ `Linux_Cheatsheet_1.html`

---

## Content Creation Workflow

### Adding New Content (Blogs or Guides)

**Step 1: Create HTML File**
1. Copy existing file as template
2. Update metadata (title, date, author)
3. Write content with consistent styling
4. Include JIT configuration and @layer directives

**Step 2: Update JSON Metadata**
1. Add entry to `blogs/blog-posts.json` or `guides/guides.json`
2. Use unified schema structure
3. Include all required fields (slug, title, date, etc.)
4. Add descriptive summary and detailedSummary

**Step 3: Test Integration**
1. Verify SPA routing works (`#/blogs/file.html` or `#/guides/file.html`)
2. Confirm appearance in Resources page
3. Test search integration
4. Verify standalone access
5. Check mobile responsiveness

**Step 4: Verify Automatic Features**
1. Resource card auto-generated ✅
2. Category filtering works ✅
3. Search finds content ✅
4. Navigation consistent ✅
5. Hover accents correct ✅

---

## Testing

### Comprehensive Test Coverage

Both content types have dedicated test suites:

**Blog Testing** (`tests/blog-functionality.spec.ts`):
- Blog loading and rendering
- Direct navigation
- Search integration
- Responsive design
- Error handling

**Guides Testing** (`tests/guides-functionality.spec.ts`):
- Guide loading and content display
- Navigation consistency
- Search integration
- Responsive design
- Error handling

**Shared Tests** (`tests/dry-navigation.spec.ts`):
- Navigation pattern consistency
- Styling variants
- Error states
- Cross-component support

---

## Maintenance Guidelines

### Adding New Content Types

To add a new content type (e.g., "tutorials"):

1. **Create Directory**: `tutorials/`
2. **Create JSON File**: `tutorials/tutorials.json` (use unified schema)
3. **Add Routing**: Pattern like `#/tutorials/filename.html`
4. **Create Template**: `page-tutorials` in `index.html`
5. **Add Category**: New category key in resources system
6. **Choose Hover Color**: Select unique accent color
7. **Update Documentation**: Add to this file

### Updating Shared Systems

When modifying shared infrastructure:

1. **Test Both Content Types**: Changes affect blogs AND guides
2. **Update JSON Schema**: Maintain consistency across both files
3. **Update Templates**: Ensure both `page-blogs` and `page-guides` work
4. **Run Full Test Suite**: Verify no regressions
5. **Update Documentation**: Reflect changes in all relevant docs

---

## Best Practices

### Content Quality

- **Accuracy**: Verify all technical information
- **Relevance**: Ensure value for club members
- **Completeness**: Include all necessary context
- **Consistency**: Follow established patterns

### Technical Quality

- **Standalone Functionality**: Each file works independently
- **SPA Integration**: Proper routing and navigation
- **Performance**: Optimize for fast loading
- **Accessibility**: Follow WCAG guidelines
- **Mobile-First**: Test on actual devices

### Metadata Quality

- **Descriptive Titles**: Clear, searchable titles
- **Accurate Categories**: Use established category keys
- **Comprehensive Summaries**: Write for both cards and modals
- **Relevant Tags**: Include searchable keywords
- **Proper Dates**: Use YYYY-MM-DD format

---

## Related Documentation

### Core Documentation

- **`docs/ARCHITECTURE.md`**: Technical architecture and system overview
- **`docs/UI.md`**: UI/UX patterns, components, and resources system
- **`docs/ROUTING.md`**: Hash routing and SPA navigation
- **`docs/TESTING.md`**: Test suite and quality assurance

### Content-Specific Documentation

- **`blogs/README.md`**: Blog-specific guidelines and workflow
- **`guides/README.md`**: Guide-specific guidelines and QR integration
- **`docs/COLOR-PALETTE.md`**: Official color palette and usage
- **`docs/TAILWIND-IDIOMS.md`**: Tailwind CSS patterns and best practices

### Testing Documentation

- **`tests/README.md`**: Test suite overview
- **`docs/TEST-DOCUMENTATION/dry-navigation.md`**: Navigation testing
- **`docs/TEST-DOCUMENTATION/category-configuration.md`**: Category system testing

---

## Future Enhancements

### Planned Features

- **Content Versioning**: Track content updates and history
- **Author Profiles**: Link to author information
- **Related Content**: Automatic related content suggestions
- **Content Analytics**: Track views and engagement
- **RSS Feeds**: Generate feeds for blogs and guides

### System Improvements

- **TypeScript Migration**: Add type safety to JSON schemas
- **Build-Time Validation**: Validate JSON schemas during build
- **Automated Testing**: Generate tests from JSON metadata
- **Content Preview**: Preview content before publishing
- **Batch Operations**: Tools for bulk content updates

---

**Last Updated**: October 9, 2025  
**Maintained By**: Cyberknights Development Team

