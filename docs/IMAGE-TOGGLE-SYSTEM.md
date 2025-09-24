# Image Toggle System Documentation

## Overview

The CCRI Cyberknights website features a unified image toggle system that allows users to expand images to full-screen modal views for better detail viewing. This system uses CSS custom properties and JavaScript to provide consistent behavior across all interactive images.

## System Architecture

### CSS Custom Properties

The system uses CSS custom properties defined in `:root` to ensure consistency:

```css
:root {
  --image-expanded-width: min(96vw, 1400px);
  --image-expanded-height: min(96vh, 1000px);
  --image-expanded-bg: rgba(0, 0, 0, 0.9);
  --image-expanded-padding: 2rem;
  --image-expanded-shadow: 0 0 60px rgba(16, 185, 129, 0.5);
  --image-expanded-radius: 1rem;
}
```

### JavaScript Toggle Function

A single DRY function handles all image toggles:

```javascript
window.toggleImageSize = function(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Determine which classes to toggle based on element ID
  let expandedClass, collapsedClass;
  
  if (elementId === 'cyberknight-welder-large') {
    expandedClass = 'welder-expanded';
    collapsedClass = 'welder-collapsed';
  } else if (elementId === 'vbox-summary-image') {
    expandedClass = 'vbox-summary-expanded';
    collapsedClass = 'vbox-summary-collapsed';
  } else {
    // Default to icon classes for navigation icon
    expandedClass = 'icon-expanded';
    collapsedClass = 'icon-collapsed';
  }

  element.classList.toggle(expandedClass);
  element.classList.toggle(collapsedClass);
  
  // Add/remove body scroll lock when expanded
  if (element.classList.contains(expandedClass)) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
};
```

## Supported Images

### 1. Navigation Icon (`cyberknight-icon`)
- **Location**: Top navigation bar
- **Collapsed State**: 40px × 40px (2.5rem)
- **Expanded State**: 96% screen width/height with CSS custom properties
- **Usage**: `onclick="toggleImageSize('cyberknight-icon')"`

### 2. Welder Image (`cyberknight-welder-large`)
- **Location**: Home page hero section
- **Collapsed State**: 288px × 288px (18rem)
- **Expanded State**: 96% screen width/height with CSS custom properties
- **Usage**: `onclick="toggleImageSize('cyberknight-welder-large')"`

### 3. VBox Summary Image (`vbox-summary-image`)
- **Location**: Linux page VirtualBox guide
- **Collapsed State**: Full container width (100% of mt-6 div)
- **Expanded State**: 96% screen width/height with CSS custom properties
- **Usage**: `onclick="toggleImageSize('vbox-summary-image')"`

## CSS Classes

### Expanded State Classes
All expanded classes use the same CSS custom properties:

```css
.icon-expanded,
.welder-expanded,
.vbox-summary-expanded {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  width: var(--image-expanded-width);
  height: var(--image-expanded-height);
  object-fit: contain;
  background-color: var(--image-expanded-bg);
  border-radius: var(--image-expanded-radius);
  padding: var(--image-expanded-padding);
  box-shadow: var(--image-expanded-shadow);
}
```

### Collapsed State Classes
Each image has its own collapsed state class:

```css
.icon-collapsed {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
}

.welder-collapsed {
  width: 18rem;
  height: 18rem;
  object-fit: contain;
  filter: drop-shadow(0 0 40px rgba(16, 185, 129, 0.25));
}

.vbox-summary-collapsed {
  width: 100%;
  margin: 0 auto;
  border-radius: 0.375rem;
  border: 1px solid #334155;
  object-fit: contain;
}
```

## Features

### Responsive Design
- **Mobile**: Images expand to 96% of viewport width/height
- **Desktop**: Images expand to maximum 1400px × 1000px
- **Aspect Ratio**: Maintained through `object-fit: contain`

### User Experience
- **Smooth Transitions**: CSS transitions provide smooth animation
- **Body Scroll Lock**: Prevents background scrolling when expanded
- **Click to Close**: Clicking expanded image returns to collapsed state
- **Consistent Behavior**: All images behave identically

### Accessibility
- **Keyboard Navigation**: Images are focusable and can be activated with Enter key
- **Screen Readers**: Alt text provided for all images
- **High Contrast**: Dark background with glowing border for visibility

## Implementation Guidelines

### Adding New Toggleable Images

1. **Add CSS Classes**:
   ```css
   .new-image-collapsed {
     /* Define collapsed state styles */
   }
   
   .new-image-expanded {
     /* Use CSS custom properties for consistency */
     position: fixed;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
     z-index: 50;
     width: var(--image-expanded-width);
     height: var(--image-expanded-height);
     object-fit: contain;
     background-color: var(--image-expanded-bg);
     border-radius: var(--image-expanded-radius);
     padding: var(--image-expanded-padding);
     box-shadow: var(--image-expanded-shadow);
   }
   ```

2. **Update JavaScript**:
   ```javascript
   // Add new condition to toggleImageSize function
   } else if (elementId === 'new-image-id') {
     expandedClass = 'new-image-expanded';
     collapsedClass = 'new-image-collapsed';
   ```

3. **Add HTML**:
   ```html
   <img id="new-image-id" 
        src="path/to/image.jpg" 
        alt="Description" 
        class="new-image-collapsed cursor-pointer transition-all duration-300 ease-in-out" 
        onclick="toggleImageSize('new-image-id')" />
   ```

## Performance Considerations

- **CSS Custom Properties**: Efficient browser handling of CSS variables
- **Single JavaScript Function**: DRY approach reduces code duplication
- **Minimal DOM Manipulation**: Only toggles classes, no style calculations
- **Hardware Acceleration**: CSS transforms use GPU acceleration

## Browser Support

- **Modern Browsers**: Full support for CSS custom properties and transforms
- **Fallback**: Graceful degradation for older browsers
- **Mobile**: Optimized for touch interactions

## Future Enhancements

- **Keyboard Shortcuts**: ESC key to close expanded images
- **Gesture Support**: Pinch-to-zoom on mobile devices
- **Image Preloading**: Preload images for faster expansion
- **Animation Options**: Configurable transition durations
- **Multiple Images**: Support for image galleries with navigation

## Troubleshooting

### Common Issues

1. **Image Not Expanding**: Check that element ID matches JavaScript condition
2. **Inconsistent Sizing**: Verify CSS custom properties are defined
3. **Scroll Lock Not Working**: Ensure body overflow is being set correctly
4. **Mobile Issues**: Test touch interactions and viewport sizing

### Debug Mode

Add console logging to the toggle function for debugging:

```javascript
window.toggleImageSize = function(elementId) {
  console.log('Toggling image:', elementId);
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }
  // ... rest of function
};
```

## Conclusion

The image toggle system provides a consistent, accessible, and performant way to enhance image viewing across the CCRI Cyberknights website. The use of CSS custom properties ensures maintainability while the DRY JavaScript approach provides scalability for future enhancements.
