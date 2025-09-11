# Campus Maps Documentation

## Overview

The site includes campus-specific map pages to help students find meeting locations. Maps are designed to be easily expandable for multiple campuses and rooms.

## Current Maps

### Warwick Campus - Room 4080
- **URL**: `#/map-warwick-4080`
- **Image**: `map-rm4080-optimized.webp`
- **Location**: Auditorium (Room 4080)
- **Meeting Times**: Mondays 5-6pm, Wednesdays 5-6pm, Saturdays 10am-1pm

## Map Page Structure

Each map page follows this template structure:

```html
<template id="page-map-{campus}-{room}">
  <section class="space-y-6">
    <h2 class="text-3xl sm:text-4xl font-bold">Campus Map - Room {room}</h2>
    <p class="text-slate-300">Find our meeting location in the {room name}.</p>
    
    <div class="rounded-lg overflow-hidden border border-slate-800 bg-slate-900/40">
      <img src="map-{campus}-{room}-optimized.webp" alt="Campus Map showing Room {room} location" class="w-full h-auto" />
    </div>
    
    <div class="p-6 rounded-lg border border-slate-800 bg-slate-900/40">
      <h3 class="text-lg font-semibold mb-4">Meeting Location Details</h3>
      <!-- Meeting details with icons -->
    </div>
  </section>
</template>
```

## Adding New Maps

### 1. Prepare the Image
- Create or obtain the campus map image
- Optimize using ImageMagick:
  ```bash
  convert map-{campus}-{room}-original.png -quality 85 -strip -resize 1200x800 map-{campus}-{room}-optimized.webp
  ```

### 2. Add Template to index.html
- Add the map template before the `<script>` section
- Use the naming convention: `page-map-{campus}-{room}`
- Update the image source to match the optimized file

### 3. Add Route
- Add the route to the `routes` object:
  ```javascript
  'map-{campus}-{room}': document.getElementById('page-map-{campus}-{room}').innerHTML
  ```

### 4. Update Links
- Make room numbers clickable in relevant pages
- Link to the specific map: `#/map-{campus}-{room}`

## Image Optimization

All map images should be optimized for web:
- Format: WebP for better compression
- Quality: 85% for good balance of size/quality
- Size: 1200x800px maximum
- Strip metadata to reduce file size

## Naming Conventions

- **Template ID**: `page-map-{campus}-{room}`
- **Route**: `map-{campus}-{room}`
- **Image**: `map-{campus}-{room}-optimized.webp`
- **Original**: `map-{campus}-{room}-original.png`

Examples:
- Warwick Room 4080: `page-map-warwick-4080`, `#/map-warwick-4080`
- Newport Room 1234: `page-map-newport-1234`, `#/map-newport-1234`
- Lincoln Room 5678: `page-map-lincoln-5678`, `#/map-lincoln-5678`

## Integration Points

### Calendar Page
- Room numbers in meeting descriptions link to specific maps
- No generic "View Map" button (context-specific links only)

### Hero Section
- Main call-to-action can link to primary meeting location map
- Should be updated when primary location changes

### Navigation
- Maps are accessible via direct URL only
- No main navigation menu entry (contextual access)
