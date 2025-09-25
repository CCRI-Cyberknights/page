# Image Modal System Documentation

## Overview

The CCRI Cyberknights website features a clean modal overlay system that allows users to expand images to full-screen views for better detail viewing. This system uses a standard modal/lightbox pattern with Tailwind CSS utilities to provide consistent behavior across all interactive images.

## System Architecture

### Modal Overlay Pattern

The system uses a fixed-position modal overlay that appears above the page content:

```html
<div id="image-modal" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-300">
  <img id="modal-image" class="rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]" />
</div>
```

### JavaScript Modal Functions

Clean, simple functions handle modal operations:

```javascript
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');

function openModal(src, alt, isCanvas = false) {
  modalImage.src = src;
  modalImage.alt = alt;
  if (isCanvas) {
    modalImage.className = 'w-[85vw] h-[85vh] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]';
  } else {
    modalImage.className = 'max-w-[96vw] max-h-[96vh] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]';
  }
  modal.classList.remove('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = 'auto';
}
```

## Supported Images

### 1. Navigation Icon (`cyberknight-icon`)
- **Location**: Top navigation bar
- **Thumbnail State**: `w-10 h-10 rounded hover:scale-110`
- **Modal State**: `max-w-[96vw] max-h-[96vh] object-contain`
- **Usage**: `onclick="toggleIconSize()"`

### 2. Welder Image (`cyberknight-welder-large`)
- **Location**: Home page hero section
- **Thumbnail State**: `w-72 h-72 object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:scale-105`
- **Modal State**: `max-w-[96vw] max-h-[96vh] object-contain`
- **Usage**: `onclick="toggleWelderSize()"`

### 3. VBox Summary Image (`vbox-summary-image`)
- **Location**: Linux page VirtualBox guide
- **Thumbnail State**: `w-full mx-auto rounded border border-slate-700 object-contain hover:scale-105`
- **Modal State**: `max-w-[96vw] max-h-[96vh] object-contain`
- **Usage**: `onclick="toggleVBoxSummarySize()"`

### 4. QR Code Canvas (`footer-qr-canvas`)
- **Location**: Footer QR code
- **Thumbnail State**: `bg-white p-1 rounded hover:scale-105`
- **Modal State**: `w-[85vw] h-[85vh] object-contain` (fills 85% of screen)
- **Usage**: `onclick="toggleQRCodeSize()"`

## Tailwind CSS Classes

### Modal Overlay Classes
```html
<div id="image-modal" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-300">
```

### Image Classes
- **Regular Images**: `max-w-[96vw] max-h-[96vh] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]`
- **QR Code**: `w-[85vw] h-[85vh] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]`

### Thumbnail Classes
- **Icon**: `w-10 h-10 rounded hover:scale-110 cursor-pointer transition-transform duration-200 ease-in-out`
- **Welder**: `w-72 h-72 object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:scale-105 cursor-pointer transition-transform duration-200 ease-in-out`
- **VBox**: `w-full mx-auto rounded border border-slate-700 object-contain hover:scale-105 cursor-pointer transition-transform duration-200 ease-in-out`
- **QR Code**: `bg-white p-1 rounded hover:scale-105 cursor-pointer transition-transform duration-200 ease-in-out`

## Features

### Responsive Design
- **Regular Images**: Expand to 96% of viewport width/height (`max-w-[96vw] max-h-[96vh]`)
- **QR Code**: Fills 85% of screen (`w-[85vw] h-[85vh]`) for better readability
- **Aspect Ratio**: Maintained through `object-fit: contain`

### User Experience
- **Smooth Transitions**: Opacity transitions provide smooth modal animation
- **Body Scroll Lock**: Prevents background scrolling when modal is open
- **Click to Close**: Clicking modal overlay closes the modal
- **Keyboard Support**: ESC and Backspace keys close the modal
- **No Layout Shifts**: Thumbnails stay in document flow, modal is separate overlay

### Accessibility
- **Keyboard Navigation**: ESC/Backspace keys close modal
- **Screen Readers**: Alt text provided for all images
- **Focus Management**: Modal images are focusable
- **High Contrast**: Dark overlay with glowing border for visibility
- **Tab Index**: All interactive images have `tabindex="0"`

## Implementation Guidelines

### Adding New Modal Images

1. **Add HTML with Tailwind Classes**:
   ```html
   <img id="new-image-id" 
        src="path/to/image.jpg" 
        alt="Description" 
        class="w-32 h-32 object-contain rounded hover:scale-105 cursor-pointer transition-transform duration-200 ease-in-out" 
        onclick="toggleNewImageSize()" 
        tabindex="0" 
        title="Click to expand" />
   ```

2. **Add JavaScript Function**:
   ```javascript
   window.toggleNewImageSize = function() {
     const image = document.getElementById('new-image-id');
     openModal(image.src, image.alt);
   };
   ```

3. **For Canvas Elements** (like QR codes):
   ```javascript
   window.toggleNewCanvasSize = function() {
     const canvas = document.getElementById('new-canvas-id');
     const dataURL = canvas.toDataURL();
     openModal(dataURL, 'Canvas Content', true); // true = isCanvas
   };
   ```

## Performance Considerations

- **Modal Overlay**: Single DOM element reused for all images
- **Tailwind CSS**: Utility classes provide efficient styling
- **Minimal DOM Manipulation**: Only changes modal visibility and image source
- **Hardware Acceleration**: CSS transforms use GPU acceleration
- **No Layout Shifts**: Thumbnails remain in document flow

## Browser Support

- **Modern Browsers**: Full support for CSS Grid, Flexbox, and transforms
- **Mobile**: Optimized for touch interactions
- **Accessibility**: Keyboard navigation and screen reader support

## Key Benefits of Modal Pattern

### Eliminates Layout Shifts
- **Before**: Images morphed between in-flow and fixed positioning, causing layout shifts
- **After**: Thumbnails stay in document flow, modal is separate overlay

### Standard UI Pattern
- **Before**: Custom morphing approach with complex CSS classes
- **After**: Standard modal/lightbox pattern used by Tailwind UI, Headless UI, etc.

### Cleaner Code
- **Before**: Complex CSS custom properties and class toggling
- **After**: Simple Tailwind utilities and straightforward JavaScript

### Better Accessibility
- **Before**: Limited keyboard support
- **After**: Full keyboard navigation (ESC/Backspace) and focus management

## Troubleshooting

### Common Issues

1. **Modal Not Opening**: Check that `openModal()` function is called correctly
2. **QR Code Too Small**: Ensure `isCanvas = true` parameter is passed to `openModal()`
3. **Keyboard Not Working**: Verify event listeners are attached to modal
4. **Layout Shifts**: Ensure thumbnails use normal document flow classes

### Debug Mode

Add console logging to modal functions for debugging:

```javascript
function openModal(src, alt, isCanvas = false) {
  console.log('Opening modal:', { src, alt, isCanvas });
  // ... rest of function
}
```

## Conclusion

The modal overlay system provides a clean, accessible, and performant way to enhance image viewing across the CCRI Cyberknights website. The standard modal pattern eliminates layout shifts while providing a professional user experience that follows established UI conventions.
