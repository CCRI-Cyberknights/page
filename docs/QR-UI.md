# QR Code UI & Image Modal System

## Purpose

Provide a built-in generator for page-specific QR codes with minimal friction and no external services, plus a unified modal overlay system for enhanced image viewing across all interactive images on the site.

## QR Code Generation

### Behavior
- Defaults to the current page URL (hash route included)
- Live preview rendered to `<canvas>` via `qrcode.min.js`
- Error handling: shows an encoder error line if creation fails

### Controls
- Error Correction Level (ECL): `L → M → Q → H` via − / + buttons
- Version/size readout: `QR Version N (WxW)` displayed above preview
- Length line: shown next to the URL helper copy
- Download PNG: exports a larger raster (default 512px width) using the current ECL

### Implementation Notes
- QR Code functionality is implemented using the shared `QRCodeManager` class from `js/qr-code-manager.js`
- Uses `QRCode.create()` to compute version for the info line, then `QRCode.toCanvas()` to draw
- Export path renders to a temporary canvas and triggers an `<a download>` click
- Auto-initializes on the main site; standalone pages can explicitly instantiate with custom options

## Unified Image Modal System

### Overview
The website features a unified modal overlay system that allows users to expand ANY interactive image to full-screen views for better detail viewing. This system uses a standard modal/lightbox pattern with Tailwind CSS utilities and applies to:

- **Navigation Icon** (`cyberknight-icon`) - Top navigation bar
- **Welder Image** (`cyberknight-welder-large`) - Home page hero section  
- **VBox Summary Image** (`vbox-summary-image`) - Linux page VirtualBox guide
- **QR Code Canvas** (`footer-qr-canvas`) - Footer QR code

### Supported Images

#### 1. Navigation Icon (`cyberknight-icon`)
- **Location**: Top navigation bar
- **Thumbnail State**: `w-10 h-10 rounded hover:scale-110`
- **Modal State**: `max-w-[96vw] max-h-[96vh] object-contain`
- **Usage**: `onclick="toggleIconSize()"`

#### 2. Welder Image (`cyberknight-welder-large`)
- **Location**: Home page hero section
- **Thumbnail State**: `w-72 h-72 object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:scale-105`
- **Modal State**: `max-w-[96vw] max-h-[96vh] object-contain`
- **Usage**: `onclick="toggleWelderSize()"`

#### 3. VBox Summary Image (`vbox-summary-image`)
- **Location**: Linux page VirtualBox guide
- **Thumbnail State**: `w-full mx-auto rounded border border-slate-700 object-contain hover:scale-105`
- **Modal State**: `max-w-[96vw] max-h-[96vh] object-contain`
- **Usage**: `onclick="toggleVBoxSummarySize()"`

#### 4. QR Code Canvas (`footer-qr-canvas`)
- **Location**: Footer QR code
- **Thumbnail State**: `bg-white p-1 rounded hover:scale-105`
- **Modal State**: `w-[min(85vw,85vh)] h-[min(85vw,85vh)] object-contain` (square container)
- **Usage**: `onclick="toggleQRCodeSize()"`

### Modal Architecture

#### HTML Structure
```html
<div id="image-modal" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-300">
  <img id="modal-image" class="rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]" />
</div>
```

#### JavaScript Functions
```javascript
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');

function openModal(src, alt, isCanvas = false) {
  modalImage.src = src;
  modalImage.alt = alt;
  if (isCanvas) {
    modalImage.className = 'w-[min(85vw,85vh)] h-[min(85vw,85vh)] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]';
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

### Modal Sizing Logic

The modal system uses different sizing strategies based on content type:

#### Canvas Content (QR Codes)
- **Square Container**: Uses `w-[min(85vw,85vh)] h-[min(85vw,85vh)]` for perfect shadow alignment
- **Canvas Support**: Converts canvas to data URL for modal display
- **Perfect Shadow Alignment**: Square container ensures green glow is centered around square QR codes

#### Regular Images (Welder, Cybersmith, VBox)
- **Responsive Sizing**: Uses `max-w-[96vw] max-h-[96vh] object-contain` for flexible sizing
- **Aspect Ratio Preservation**: Maintains original image proportions

#### Modal Classes
- **QR Code**: `w-[min(85vw,85vh)] h-[min(85vw,85vh)] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]`
- **Regular Images**: `max-w-[96vw] max-h-[96vh] object-contain rounded-xl shadow-[0_0_60px_rgba(16,185,129,0.5)]`

### User Experience Features
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

## UX Layout Guidelines

- Information order: URL input → helper/length → settings (ECL + version) → preview → action
- Keep the panel compact (≈500px max) with comfortable spacing
- Hide copy-to-clipboard; rely on user's manual copy if needed

## Troubleshooting

### Common Issues
1. **Modal Not Opening**: Check that `openModal()` function is called correctly
2. **QR Code Too Small**: Ensure `isCanvas = true` parameter is passed to `openModal()`
3. **Keyboard Not Working**: Verify event listeners are attached to modal
4. **Layout Shifts**: Ensure thumbnails use normal document flow classes
5. **Shadow Misalignment**: Use square container (`min(85vw,85vh)`) for QR codes

### Debug Mode
Add console logging to modal functions for debugging:
```javascript
function openModal(src, alt, isCanvas = false) {
  console.log('Opening modal:', { src, alt, isCanvas });
  // ... rest of function
}
```
