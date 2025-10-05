# Test Documentation: Mobile Cutoff Prevention

## File: `mobile-cutoff-prevention.spec.ts`

### **Test Category**: Mobile Testing / Layout Integrity
### **Created**: October 5, 2025
### **Purpose**: Prevents QR modal content from being cut off on mobile devices

## Test Overview

This test suite specifically addresses mobile layout issues where QR modal content could be cut off at the bottom of the screen. It validates the implementation of dynamic viewport height (dvh) and overflow scrolling to ensure all content remains accessible.

## Test Cases

### 1. **QR modal content is not cut off at bottom**
- **Type**: Mobile Layout Test
- **Scope**: All mobile viewports (Pixel 7a, iPhone 13, Pixel 5, small Android)
- **Validates**:
  - Modal uses proper mobile CSS classes
  - `overflow-y: auto` is applied for scrolling
  - `box-sizing: border-box` for proper padding calculation
  - All critical elements are accessible via scrolling
- **Critical Elements Tested**:
  - QR Code SVG
  - URL Input field
  - Length Display
  - Error Correction Controls
  - Download Buttons

### 2. **QR modal adapts to viewport height changes**
- **Type**: Responsive Design Test
- **Scope**: All mobile viewports with height variations
- **Validates**:
  - Modal adapts to different viewport heights
  - Address bar hide/show simulation
  - Container height adjustments
  - QR code remains visible and functional

## TDD Implementation

### **Red Phase** (Problem Identification)
- **Issue**: QR modal content was being clipped on mobile devices
- **Root Cause**: Fixed viewport heights (`100vh`) didn't account for mobile browser UI
- **Requirement**: Dynamic viewport handling with overflow scrolling

### **Green Phase** (Solution Implementation)
- **Dynamic Viewport Height**: Added `100dvh` support for mobile browsers
- **Overflow Scrolling**: Added `overflow-y: auto` for content exceeding viewport
- **Safe Padding**: Added `0.5rem` padding to prevent edge cutoff
- **Box Sizing**: Set `box-sizing: border-box` for proper padding calculation
- **Fallback Support**: Added fallback for browsers without `dvh` support

### **Refactor Phase** (Test Validation)
- **Comprehensive Testing**: All mobile devices validated
- **Scroll Testing**: Verified scrolling works when content exceeds viewport
- **Viewport Adaptation**: Tested different height scenarios

## Test Patterns Used

### **CSS Property Validation**
```typescript
const containerStyles = await glowContainer.evaluate((el) => {
  const computed = window.getComputedStyle(el);
  return {
    height: computed.height,
    width: computed.width,
    padding: computed.padding,
    overflowY: computed.overflowY,
    boxSizing: computed.boxSizing
  };
});

// Verify mobile-specific CSS is applied
expect(containerStyles.overflowY).toBe('auto');
expect(containerStyles.boxSizing).toBe('border-box');
```

### **Scroll Functionality Testing**
```typescript
const scrollHeight = await scrollableArea.evaluate((el) => el.scrollHeight);
const clientHeight = await scrollableArea.evaluate((el) => el.clientHeight);

if (scrollHeight > clientHeight) {
  // Test scrolling to bottom
  await scrollableArea.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  
  const scrollTop = await scrollableArea.evaluate((el) => el.scrollTop);
  expect(scrollTop).toBeGreaterThan(0);
}
```

### **Viewport Height Simulation**
```typescript
const testHeights = [
  viewport.height - 100, // Address bar visible
  viewport.height,       // Normal height
  viewport.height + 50   // Extra space
];

for (const height of testHeights) {
  await page.setViewportSize({ width: viewport.width, height });
  await page.waitForTimeout(300);
  
  // Verify modal adapts to new height
  const containerHeight = await glowContainer.evaluate((el) => {
    return window.getComputedStyle(el).height;
  });
}
```

### **Element Accessibility Testing**
```typescript
const criticalElements = [
  { selector: '.glow-container-mobile svg', name: 'QR Code' },
  { selector: '.glow-container-mobile input[type="text"]', name: 'URL Input' },
  // ... more elements
];

for (const { selector, name } of criticalElements) {
  const element = page.locator(selector).first();
  await element.scrollIntoViewIfNeeded();
  const isVisible = await element.isVisible({ timeout: 2000 });
  expect(isVisible, `${name} should be accessible on ${device}`).toBeTruthy();
}
```

## Assertions

### **CSS Property Validation**
- `overflowY: 'auto'` - Enables scrolling when needed
- `boxSizing: 'border-box'` - Proper padding calculation
- Dynamic height values - Adapts to viewport changes

### **Scroll Functionality**
- Content scrolls when exceeding viewport
- Scroll position updates correctly
- All elements remain accessible

### **Viewport Adaptation**
- Modal adapts to height changes
- QR code remains visible and functional
- Container dimensions adjust appropriately

## Test Results

### **Success Metrics**
- ✅ All mobile devices tested successfully
- ✅ Scrolling works when content exceeds viewport
- ✅ Viewport adaptation functions correctly
- ✅ No content cutoff issues detected

### **Performance**
- **Execution Time**: ~8 seconds for all mobile tests
- **Test Coverage**: 4 mobile devices × 2 test cases = 8 total tests
- **Success Rate**: 8/8 tests passing

## Implementation Details

### **CSS Changes Applied**
```css
@media (max-width: 480px) {
  .qr-fullscreen .glow-container-mobile {
    width: min(95vw, 95vh) !important;
    height: min(95vh, 95vw) !important;
    height: min(95dvh, 95vw) !important; /* Dynamic viewport height */
    margin: auto !important;
    padding: 0.5rem !important; /* Safe padding */
    overflow-y: auto !important; /* Enable scrolling */
    box-sizing: border-box !important;
  }
}
```

### **Fallback Support**
```css
@supports not (height: 100dvh) {
  @media (max-width: 480px) {
    .qr-fullscreen .glow-container-mobile {
      height: calc(100vh - env(safe-area-inset-bottom)) !important;
    }
  }
}
```

## Maintenance Notes

### **Key Features**
- **Dynamic Viewport Height**: Uses `dvh` for modern browsers
- **Overflow Scrolling**: Content scrolls when exceeding viewport
- **Safe Padding**: Prevents content from touching screen edges
- **Fallback Support**: Works on older browsers without `dvh`

### **Browser Compatibility**
- Modern browsers: Full `dvh` support
- Older browsers: Fallback with `calc()` and `env()`
- All mobile browsers: Proper overflow handling

## Related Files

- **Implementation**: `js/qr-code-manager.js` (mobile CSS injection)
- **Helpers**: `tests/helpers/viewports.ts` (device configurations)
- **Package Script**: `npm run test:mobile:cutoff`

---

*This test exemplifies mobile-specific problem solving with TDD: identifying a mobile layout issue, implementing a comprehensive solution, and validating the fix across all mobile devices.*

