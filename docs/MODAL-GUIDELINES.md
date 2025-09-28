# Modal Implementation Guidelines

## Overview

This document provides comprehensive guidelines for implementing modals in the CCRI Cyber Club website using the Universal Modal System. All modals must follow these standards to ensure consistency, accessibility, and maintainability.

## Universal Modal System

### **Core Principles**

1. **Single Source of Truth**: All modals use the `#universal-modal` container
2. **Consistent Behavior**: Standardized closing methods and user interactions
3. **Full Accessibility**: ARIA attributes, focus management, keyboard navigation
4. **Mobile-Friendly**: Back button support and touch-optimized interactions
5. **Performance**: Efficient event handling and cleanup

---

## **Required HTML Structure**

### **Base Modal Container**
```html
<div id="universal-modal" 
     class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 opacity-0 pointer-events-none transition-opacity duration-300" 
     role="dialog" 
     aria-modal="true" 
     aria-labelledby="modal-title" 
     aria-hidden="true">
  
  <!-- Modal Backdrop (clickable overlay) -->
  <div class="absolute inset-0" data-modal-close></div>
  
  <!-- Modal Container -->
  <div class="modal-container bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden relative z-10 transform transition-transform duration-300 scale-95">
    
    <!-- Modal Header -->
    <div class="modal-header flex items-start justify-between p-6 border-b border-slate-700">
      <h2 id="modal-title" class="modal-title text-xl font-semibold text-slate-100 flex-1 mr-4"></h2>
      <button class="modal-close text-slate-400 hover:text-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 rounded" 
              data-modal-close 
              aria-label="Close dialog">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- Modal Body -->
    <div id="modal-content" class="modal-body p-6 overflow-y-auto max-h-[60vh]"></div>
    
    <!-- Modal Footer -->
    <div id="modal-actions" class="modal-footer p-6 border-t border-slate-700 flex justify-end gap-3"></div>
  </div>
</div>
```

### **Required ARIA Attributes**
- `role="dialog"` - Identifies the element as a dialog
- `aria-modal="true"` - Indicates the dialog is modal
- `aria-labelledby="modal-title"` - References the modal title
- `aria-hidden="true"` - Hides from screen readers when closed
- `aria-label="Close dialog"` - Labels the close button

---

## **JavaScript Implementation**

### **Basic Usage**

```javascript
// Initialize modal with default options
const modal = new UniversalModal();

// Open modal with content
modal.open(
  '<p>Your modal content here</p>',
  'Modal Title',
  '<button class="btn-primary">Action</button>'
);

// Close modal
modal.close();
```

### **Advanced Configuration**

```javascript
// Initialize with custom options
const modal = new UniversalModal({
  size: 'large',              // small, medium, large, fullscreen
  closable: true,             // Allow closing via standard methods
  mobileBackButton: true,     // Enable mobile back button support
  focusTrap: true,           // Trap focus within modal
  scrollLock: true,          // Lock body scroll when open
  animation: true            // Enable open/close animations
});
```

### **Convenience Functions**

```javascript
// Global modal functions (auto-initialized)
openModal(content, title, actions, options);
closeModal();

// Specialized functions
openResourceModal(resourceObject);
openImageModal(imageSrc, imageAlt, isCanvas);
```

---

## **Size Variants**

### **Small Modal** (`size: 'small'`)
- **Max Width**: 28rem (448px)
- **Use Case**: Simple confirmations, alerts
- **Example**: "Are you sure you want to delete this item?"

### **Medium Modal** (`size: 'medium'`)
- **Max Width**: 32rem (512px)
- **Use Case**: Standard content, resource information
- **Example**: Resource details, form inputs

### **Large Modal** (`size: 'large'`)
- **Max Width**: 48rem (768px)
- **Use Case**: Complex content, images, detailed information
- **Example**: Image galleries, detailed forms

### **Fullscreen Modal** (`size: 'fullscreen'`)
- **Dimensions**: 100vw × 100vh
- **Use Case**: Complex interfaces, QR code manager
- **Example**: Full-screen QR generator, complex forms

---

## **Required Closing Methods**

### **Mandatory Methods**
1. **Escape Key** - Universal keyboard shortcut
2. **Overlay Click** - Click outside modal content
3. **Close Button** - Explicit X button in header
4. **Action Buttons** - Buttons that complete modal purpose

### **Optional Methods**
1. **Backspace Key** - Legacy support for backward compatibility
2. **Mobile Back Button** - For full-screen modals only

### **Implementation Example**
```javascript
// All closing methods are handled automatically by UniversalModal
// No additional code required for standard closing behavior
```

---

## **Accessibility Requirements**

### **Focus Management**
- **Focus Trap**: Focus stays within modal when open
- **Focus Restoration**: Returns focus to trigger element when closed
- **Keyboard Navigation**: Tab cycling within modal

### **Screen Reader Support**
- **ARIA Labels**: Proper labeling for all interactive elements
- **Live Regions**: Announce modal state changes
- **Semantic HTML**: Use proper heading hierarchy

### **Keyboard Support**
- **Tab**: Navigate between focusable elements
- **Shift+Tab**: Navigate backward
- **Escape**: Close modal
- **Enter/Space**: Activate buttons and links

---

## **Mobile Considerations**

### **Touch Interactions**
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Consider swipe-to-close for full-screen modals
- **Viewport**: Ensure modal fits within mobile viewport

### **Back Button Support**
```javascript
// Enable mobile back button for full-screen modals
const modal = new UniversalModal({
  size: 'fullscreen',
  mobileBackButton: true
});
```

---

## **Styling Guidelines**

### **Required Tailwind Classes**

```css
/* Modal Overlay */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4;
  @apply opacity-0 pointer-events-none transition-opacity duration-300;
}

/* Modal Container */
.modal-container {
  @apply bg-slate-900 border border-slate-700 rounded-lg;
  @apply w-full max-h-[90vh] overflow-hidden relative z-10;
  @apply transform transition-transform duration-300 scale-95;
}

/* Modal Header */
.modal-header {
  @apply flex items-start justify-between p-6 border-b border-slate-700;
}

/* Modal Body */
.modal-body {
  @apply p-6 overflow-y-auto max-h-[60vh];
}

/* Modal Footer */
.modal-footer {
  @apply p-6 border-t border-slate-700 flex justify-end gap-3;
}
```

### **Custom Styling**
- **Colors**: Use official CyberKnights color palette
- **Spacing**: Follow Tailwind spacing scale
- **Typography**: Use consistent font sizes and weights
- **Animations**: Use smooth transitions (300ms duration)

---

## **Event Handling**

### **Required Event Listeners**
```javascript
// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.isOpen) {
    modal.close();
  }
});

// Overlay click
modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-modal-close')) {
    modal.close();
  }
});

// Focus trap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && modal.isOpen) {
    // Focus trap logic
  }
});
```

### **Cleanup Requirements**
- **Remove Event Listeners**: Clean up when modal is destroyed
- **Restore Focus**: Return focus to trigger element
- **Unlock Scroll**: Restore body scroll when closed
- **History State**: Clean up mobile back button state

---

## **Migration Guide**

### **From Resource Modals**
```javascript
// OLD: openResourceModal(resource)
// NEW: openResourceModal(resource) - automatically uses UniversalModal
```

### **From Image Modals**
```javascript
// OLD: openModal(src, alt, isCanvas)
// NEW: openImageModal(src, alt, isCanvas) - automatically uses UniversalModal
```

### **From QR Manager**
```javascript
// OLD: expandPanel() - custom full-screen implementation
// NEW: Use UniversalModal with size: 'fullscreen' and mobileBackButton: true
```

---

## **Code Review Checklist**

### **Before Submitting PR**
- [ ] Uses `UniversalModal` class or convenience functions
- [ ] Includes proper ARIA attributes
- [ ] Implements focus management
- [ ] Handles mobile back button (if full-screen)
- [ ] Includes proper cleanup
- [ ] Follows Tailwind class standards
- [ ] Tests keyboard navigation
- [ ] Tests screen reader compatibility
- [ ] Tests mobile touch interactions

### **Accessibility Checklist**
- [ ] `role="dialog"` present
- [ ] `aria-modal="true"` present
- [ ] `aria-labelledby` references title
- [ ] `aria-hidden` toggles correctly
- [ ] Focus trap implemented
- [ ] Focus restoration works
- [ ] Keyboard navigation functional
- [ ] Screen reader announcements work

### **Mobile Checklist**
- [ ] Touch targets minimum 44px
- [ ] Modal fits mobile viewport
- [ ] Back button support (if full-screen)
- [ ] Swipe gestures considered
- [ ] Performance optimized

---

## **Common Patterns**

### **Confirmation Dialog**
```javascript
const content = '<p>Are you sure you want to delete this item?</p>';
const actions = `
  <button onclick="confirmDelete(); closeModal();" class="btn-danger">Delete</button>
  <button onclick="closeModal();" class="btn-secondary">Cancel</button>
`;
openModal(content, 'Confirm Delete', actions, { size: 'small' });
```

### **Resource Information**
```javascript
// Automatically handled by openResourceModal()
openResourceModal({
  name: 'Resource Name',
  detailedSummary: 'Resource description...',
  url: 'https://example.com'
});
```

### **Image Gallery**
```javascript
// Automatically handled by openImageModal()
openImageModal('image.jpg', 'Image Description', false);
```

### **Full-Screen Interface**
```javascript
const modal = new UniversalModal({
  size: 'fullscreen',
  mobileBackButton: true,
  closable: true
});

modal.open(complexContent, 'Full-Screen Interface', '');
```

---

## **Troubleshooting**

### **Common Issues**

**Modal doesn't open**
- Check if `#universal-modal` exists in HTML
- Verify `universal-modal.js` is loaded
- Check console for JavaScript errors

**Focus not trapped**
- Ensure `focusTrap: true` in options
- Check for focusable elements in modal content
- Verify event listeners are attached

**Mobile back button not working**
- Ensure `mobileBackButton: true` in options
- Check if modal is full-screen
- Verify history state management

**Accessibility issues**
- Check ARIA attributes are present
- Test with screen reader
- Verify keyboard navigation works

### **Debug Mode**
```javascript
// Enable debug logging
const modal = new UniversalModal({ debug: true });
```

---

## **Future Enhancements**

### **Planned Features**
- **Stacked Modals**: Support for multiple open modals
- **Nested Dialogs**: Modal within modal support
- **Custom Animations**: Configurable animation types
- **Theme Support**: Light/dark mode variants
- **Accessibility Improvements**: Enhanced screen reader support

### **Performance Optimizations**
- **Lazy Loading**: Load modal content on demand
- **Virtual Scrolling**: For large content lists
- **Memory Management**: Better cleanup and garbage collection

---

*Last Updated: 2025-09-27*
*Version: 1.0.0*
*Related: [Modal Inventory](MODAL-INVENTORY.md) | [Architecture](ARCHITECTURE.md) | [UI Guidelines](UI.md)*
