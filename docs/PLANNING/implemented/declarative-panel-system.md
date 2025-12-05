# Declarative Panel Visibility System

**Status**: ✅ IMPLEMENTED
**Implementation Date**: 2025-10-10
**Target Consolidation**: `docs/UI.md` or `docs/ARCHITECTURE.md`

## Overview

This document defines a systematic, declarative approach to managing QR modal panel visibility across different viewports, following responsive design best practices.

**Note**: This system is implemented and tested. Awaiting consolidation into canonical documentation.

## Design Principles

### 1. **Single Source of Truth**
- All viewport breakpoints defined in CSS custom properties
- Panel visibility rules declared in one place
- No arbitrary CSS changes or JavaScript overrides

### 2. **Mobile-First Approach**
- Base styles target smallest viewports
- Progressive enhancement for larger screens
- Clear hierarchy of panel importance

### 3. **Declarative Configuration**
- Panel visibility expressed as data attributes
- CSS handles all responsive behavior
- JavaScript only manages state, not styling

## Panel Hierarchy

### Core Panels (Always Visible)
1. **QR Display Panel** (`data-qr-panel="display"`)
   - **Purpose**: Shows the QR code
   - **Visibility**: Always visible on all viewports
   - **Priority**: Critical (P0)

2. **URL Input Panel** (`data-qr-panel="input"`)
   - **Purpose**: URL input and display
   - **Visibility**: Always visible on all viewports
   - **Priority**: Critical (P0)

### Enhanced Panels (Conditionally Visible)
3. **Advanced Controls Panel** (`data-qr-panel="advanced"`)
   - **Purpose**: QR version, error correction level, download
   - **Visibility**: Hidden on constrained viewports
   - **Priority**: Enhanced (P1)

## Viewport Breakpoint System

### CSS Custom Properties (Single Source of Truth)
```css
:root {
  /* Viewport Breakpoints */
  --breakpoint-mobile: 480px;        /* Mobile devices */
  --breakpoint-tablet: 768px;        /* Tablets and small laptops */
  --breakpoint-desktop: 1024px;      /* Desktop and large tablets */
  --breakpoint-large: 1280px;        /* Large desktops */
  
  /* Height Constraints */
  --height-constrained: 650px;       /* Hide advanced controls */
  --height-mobile: 700px;            /* Mobile-specific adjustments */
  
  /* Panel Visibility Rules */
  --panel-display-visibility: block;      /* Always visible */
  --panel-input-visibility: block;        /* Always visible */
  --panel-advanced-visibility: block;     /* Conditional */
}
```

### Responsive Panel Visibility Rules

#### Mobile Viewports (≤ 768px width)
```css
@media (max-width: var(--breakpoint-tablet)) {
  [data-qr-panel="advanced"] {
    --panel-advanced-visibility: none;
    display: var(--panel-advanced-visibility) !important;
  }
}
```

#### Constrained Viewports (≤ 1024px width AND ≤ 650px height)
```css
@media (max-width: var(--breakpoint-desktop)) and (max-height: var(--height-constrained)) {
  [data-qr-panel="advanced"] {
    --panel-advanced-visibility: none;
    display: var(--panel-advanced-visibility) !important;
  }
}
```

#### Desktop Viewports (> 1024px width OR > 650px height)
```css
@media (min-width: calc(var(--breakpoint-desktop) + 1px)), (min-height: calc(var(--height-constrained) + 1px)) {
  [data-qr-panel="advanced"] {
    --panel-advanced-visibility: block;
    display: var(--panel-advanced-visibility) !important;
  }
}
```

## Implementation Pattern

### 1. HTML Structure (Declarative)
```html
<div class="qr-modal" data-qr-modal="main">
  <div class="qr-modal__panel" data-qr-panel="display">
    <!-- QR Code Content -->
  </div>
  <div class="qr-modal__panel" data-qr-panel="input">
    <!-- URL Input Content -->
  </div>
  <div class="qr-modal__panel" data-qr-panel="advanced">
    <!-- Advanced Controls Content -->
  </div>
</div>
```

### 2. CSS Classes (BEM Methodology)
```css
.qr-modal {
  /* Container styles */
}

.qr-modal__panel {
  /* Base panel styles */
  display: var(--panel-display-visibility);
}

.qr-modal__panel--display {
  --panel-display-visibility: block;
}

.qr-modal__panel--input {
  --panel-input-visibility: block;
}

.qr-modal__panel--advanced {
  --panel-advanced-visibility: block;
}
```

### 3. JavaScript (State Management Only)
```javascript
class QRModalManager {
  constructor() {
    this.initializePanelStates();
    this.setupResponsiveListeners();
  }
  
  initializePanelStates() {
    // Set initial panel states based on viewport
    this.updatePanelVisibility();
  }
  
  updatePanelVisibility() {
    // Update aria-hidden, tabindex based on CSS visibility
    // No direct style manipulation
  }
}
```

## Testing Strategy

### Declarative Test Assertions
```javascript
const PANEL_VISIBILITY_MATRIX = {
  'mobile': { width: 375, height: 667, panels: { display: true, input: true, advanced: false } },
  'tablet': { width: 768, height: 1024, panels: { display: true, input: true, advanced: false } },
  'laptop-constrained': { width: 1024, height: 624, panels: { display: true, input: true, advanced: false } },
  'laptop': { width: 1366, height: 768, panels: { display: true, input: true, advanced: true } },
  'desktop': { width: 1920, height: 1080, panels: { display: true, input: true, advanced: true } }
};

// Test each viewport configuration
Object.entries(PANEL_VISIBILITY_MATRIX).forEach(([viewport, config]) => {
  test(`Panel visibility for ${viewport}`, async ({ page }) => {
    await page.setViewportSize({ width: config.width, height: config.height });
    
    Object.entries(config.panels).forEach(([panel, shouldBeVisible]) => {
      const selector = `[data-qr-panel="${panel}"]`;
      if (shouldBeVisible) {
        expect(page.locator(selector)).toBeVisible();
      } else {
        expect(page.locator(selector)).toBeHidden();
      }
    });
  });
});
```

## Benefits

### 1. **Maintainability**
- Single place to modify panel visibility rules
- Clear separation of concerns
- Easy to understand and debug

### 2. **Predictability**
- Deterministic behavior across viewports
- No arbitrary CSS overrides
- Consistent responsive behavior

### 3. **Testability**
- Declarative test assertions
- Clear viewport → panel visibility mapping
- Easy to verify behavior

### 4. **Scalability**
- Easy to add new panels or viewports
- Consistent patterns for new features
- Future-proof architecture

## Migration Plan

1. **Phase 1**: Implement CSS custom properties system
2. **Phase 2**: Replace existing media queries with declarative rules
3. **Phase 3**: Remove JavaScript style manipulation
4. **Phase 4**: Add comprehensive test coverage
5. **Phase 5**: Document and validate system

This declarative approach eliminates arbitrary CSS changes and provides a systematic, maintainable solution for panel visibility across all viewports.
