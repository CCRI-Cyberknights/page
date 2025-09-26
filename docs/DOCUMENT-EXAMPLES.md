# Document Loading Usage Examples

## Quick Start Guide

This guide provides practical examples for using the document loading system in the Cyber Club website.

## Basic Usage

### Creating a New Document

1. **Create the HTML file**:
   ```html
   <!-- document/ctf-guide.html -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="utf-8">
     <title>CTF Guide - Cyber Club</title>
     <script src="https://cdn.tailwindcss.com"></script>
     <script src="../js/qrcode.min.js"></script>
     <script src="../js/qr-code-manager.js"></script>
     <style>
       :root { color-scheme: dark; }
       /* Include necessary CSS variables */
     </style>
   </head>
   <body class="bg-slate-900 text-slate-200 min-h-screen">
     <div class="max-w-4xl mx-auto p-6 space-y-8">
       <h1 class="text-4xl font-bold mb-4" style="color: var(--neon-surge);">CTF Guide 📚</h1>
       <p class="text-slate-300 text-lg">Comprehensive guide to Capture The Flag competitions</p>
       
       <!-- Document content -->
       <div class="space-y-6">
         <h2 class="text-2xl font-bold">Getting Started</h2>
         <p class="text-slate-300">CTF competitions are cybersecurity challenges...</p>
       </div>
       
       <!-- Navigation -->
       <div class="mt-8 pt-6 border-t border-slate-700">
         <div class="flex flex-wrap gap-4 text-sm">
           <a href="../#/resources" class="text-emerald-400 hover:text-emerald-300 underline">← Back to Resources</a>
           <span class="text-slate-500">•</span>
           <a href="../#/cybersecurity" class="text-emerald-400 hover:text-emerald-300 underline">Club Page</a>
         </div>
       </div>
     </div>
   </body>
   </html>
   ```

2. **Add SPA link**:
   ```html
   <a href="#/guides/ctf-guide.html">CTF Guide</a>
   ```

3. **Add to resources data** (optional):
   ```javascript
   { 
     name: 'CTF Guide', 
     url: '#/guides/ctf-guide.html', 
     cat: 'ctf-competitions', 
     desc: 'Comprehensive guide to Capture The Flag competitions' 
   }
   ```

## Advanced Examples

### Multi-Section Document

```html
<!-- document/linux-advanced.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Advanced Linux Guide - Cyber Club</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="../js/qrcode.min.js"></script>
  <script src="../js/qr-code-manager.js"></script>
</head>
<body class="bg-slate-900 text-slate-200 min-h-screen">
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-4xl font-bold mb-4" style="color: var(--neon-surge);">Advanced Linux Guide 🐧</h1>
    
    <!-- Table of Contents -->
    <div class="p-6 rounded-lg border border-slate-800 bg-slate-900/40">
      <h2 class="text-lg font-semibold mb-4">Table of Contents</h2>
      <ul class="space-y-2">
        <li><a href="#networking" class="text-emerald-400 hover:text-emerald-300">Networking</a></li>
        <li><a href="#security" class="text-emerald-400 hover:text-emerald-300">Security</a></li>
        <li><a href="#automation" class="text-emerald-400 hover:text-emerald-300">Automation</a></li>
      </ul>
    </div>
    
    <!-- Sections -->
    <section id="networking">
      <h2 class="text-2xl font-bold mb-4">Networking</h2>
      <div class="space-y-4">
        <div class="p-4 rounded border border-slate-700 bg-slate-800/60">
          <h3 class="font-semibold">Network Configuration</h3>
          <code class="block mt-2 p-2 bg-slate-900 rounded text-sm">ip addr show</code>
        </div>
      </div>
    </section>
    
    <!-- Navigation -->
    <div class="mt-8 pt-6 border-t border-slate-700">
      <div class="flex flex-wrap gap-4 text-sm">
        <a href="../#/guides/linux-cheatsheet-1.html" class="text-emerald-400 hover:text-emerald-300 underline">← Linux Basics</a>
        <span class="text-slate-500">•</span>
        <a href="../#/resources/linux" class="text-emerald-400 hover:text-emerald-300 underline">Linux Resources</a>
      </div>
    </div>
  </div>
</body>
</html>
```

### Interactive Document with JavaScript

```html
<!-- document/interactive-demo.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Interactive Demo - Cyber Club</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-200 min-h-screen">
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <h1 class="text-4xl font-bold mb-4" style="color: var(--neon-surge);">Interactive Demo 🎮</h1>
    
    <div class="p-6 rounded-lg border border-slate-800 bg-slate-900/40">
      <h2 class="text-lg font-semibold mb-4">Try It Out</h2>
      <button id="demo-button" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
        Click Me!
      </button>
      <div id="demo-output" class="mt-4 p-4 bg-slate-800 rounded hidden">
        <p>Button clicked! This demonstrates interactive content within documents.</p>
      </div>
    </div>
    
    <script>
      document.getElementById('demo-button').addEventListener('click', function() {
        const output = document.getElementById('demo-output');
        output.classList.remove('hidden');
        output.scrollIntoView({ behavior: 'smooth' });
      });
    </script>
  </div>
</body>
</html>
```

## Integration Patterns

### Adding to Resources Page

```javascript
// In the resources data array
const resources = [
  // ... existing resources
  { 
    name: 'CTF Guide', 
    url: '#/guides/ctf-guide.html', 
    cat: 'ctf-competitions', 
    desc: 'Comprehensive guide to Capture The Flag competitions' 
  },
  { 
    name: 'Advanced Linux', 
    url: '#/guides/linux-advanced.html', 
    cat: 'linux', 
    desc: 'Advanced Linux administration and networking' 
  }
];
```

### Cross-Document Navigation

```html
<!-- In any document -->
<div class="mt-8 pt-6 border-t border-slate-700">
  <div class="flex flex-wrap gap-4 text-sm">
    <a href="../#/guides/linux-cheatsheet-1.html" class="text-emerald-400 hover:text-emerald-300 underline">← Linux Basics</a>
    <span class="text-slate-500">•</span>
    <a href="../#/guides/ctf-guide.html" class="text-emerald-400 hover:text-emerald-300 underline">CTF Guide</a>
    <span class="text-slate-500">•</span>
    <a href="../#/resources" class="text-emerald-400 hover:text-emerald-300 underline">All Resources</a>
  </div>
</div>
```

## Best Practices

### File Organization

```
document/
├── linux-cheatsheet-1.html      # Basic Linux guide
├── linux-advanced.html          # Advanced Linux topics
├── ctf-guide.html              # CTF competition guide
├── networking-basics.html       # Networking fundamentals
└── security-primer.html         # Security concepts
```

### Naming Conventions

- Use descriptive, lowercase filenames with hyphens
- Include the topic in the filename (e.g., `linux-advanced.html`)
- Use consistent naming patterns across related documents

### Content Structure

1. **Always include**:
   - Complete HTML structure (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`)
   - Tailwind CSS script
   - Proper meta tags
   - Navigation links

2. **Use consistent styling**:
   - Same color scheme as the main site
   - Responsive design patterns
   - Consistent spacing and typography

3. **Include navigation**:
   - Back links to relevant pages
   - Cross-references to related documents
   - Links to main site sections

### Error Handling

```html
<!-- Example of error handling in document content -->
<div id="content-loading" class="text-center py-8">
  <p class="text-slate-400">Loading content...</p>
</div>

<div id="content-error" class="text-center py-8 hidden">
  <p class="text-red-400">Failed to load content. Please try again.</p>
  <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">
    Retry
  </button>
</div>
```

## Testing Your Documents

### Local Testing

1. **Start development server**:
   ```bash
   python3 -m http.server 8000
   ```

2. **Test SPA mode**:
   - Navigate to `http://localhost:8000/#/guides/your-file.html`
   - Verify content loads correctly
   - Check navigation links work

3. **Test standalone mode**:
   - Navigate to `http://localhost:8000/guides/your-file.html`
   - Verify document displays correctly
   - Check all functionality works

### Production Testing

1. **Deploy to GitHub Pages**
2. **Test both modes**:
   - SPA: `https://your-site.github.io/page/#/guides/your-file.html`
   - Standalone: `https://your-site.github.io/page/guides/your-file.html`

## Troubleshooting

### Common Issues

**Document not loading in SPA**:
- Check file path is correct
- Verify file is accessible via HTTP
- Check browser console for fetch errors

**Styling issues**:
- Ensure Tailwind CSS is included
- Check for CSS conflicts
- Verify responsive design works

**Navigation problems**:
- Check link formats (`../#/page` for SPA navigation)
- Verify target pages exist
- Test both SPA and standalone modes

### Debug Tips

```javascript
// Add to document for debugging
console.log('Document loaded:', window.location.href);
console.log('Content element:', document.getElementById('document-content'));
```

## Related Documentation

- [Document Loading System](DOCUMENT-LOADING.md) - Complete technical documentation
- [Architecture Overview](ARCHITECTURE.md) - System architecture
- [Routing & Navigation](ROUTING-NAV.md) - Routing system details
- [Resources Management](RESOURCES-MAINTAINERS.md) - Managing resource links
