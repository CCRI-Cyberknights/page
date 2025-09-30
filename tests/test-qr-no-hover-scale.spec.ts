import { test, expect } from '@playwright/test';

test.describe('QR Code Visual Integrity', () => {
  test('QR code should never have hover scale effects that could blur the code', async ({ page }) => {
    await page.goto('http://localhost:8000/#/home');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Get the QR code SVG element (regardless of visibility)
    const styles = await page.evaluate(() => {
      const canvas = document.querySelector('#footer-qr-canvas');
      if (!canvas) return null;
      
      const svg = canvas.parentNode.querySelector('svg');
      if (!svg) return null;
      
      const computedStyle = window.getComputedStyle(svg);
      const classList = Array.from(svg.classList);
      
      return {
        className: svg.className,
        classList: classList,
        transform: computedStyle.transform,
        transition: computedStyle.transition,
        hasHoverScale: classList.some(cls => cls.includes('hover:scale')),
        hasScale: classList.some(cls => cls.includes('scale-'))
      };
    });

    console.log('QR Code styles:', styles);

    // CRITICAL: QR codes must never have hover scale effects
    expect(styles?.hasHoverScale).toBe(false);
    expect(styles?.hasScale).toBe(false);
    
    // Verify no transform is applied
    expect(styles?.transform).toBe('none');
    
    // Verify the className doesn't contain scale effects
    expect(styles?.className).not.toContain('hover:scale');
    expect(styles?.className).not.toContain('scale-');

    console.log('✅ QR code has no hover scale effects - visual integrity preserved');
  });

  test('QR code should maintain pixel-perfect rendering', async ({ page }) => {
    await page.goto('http://localhost:8000/#/home');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Check that the QR code has crisp, pixel-perfect rendering
    const renderingInfo = await page.evaluate(() => {
      const canvas = document.querySelector('#footer-qr-canvas');
      if (!canvas) return null;
      
      const svg = canvas.parentNode.querySelector('svg');
      if (!svg) return null;
      
      const computedStyle = window.getComputedStyle(svg);
      
      return {
        imageRendering: computedStyle.imageRendering,
        shapeRendering: computedStyle.shapeRendering,
        textRendering: computedStyle.textRendering,
        // Check for any CSS that could cause blurring
        filter: computedStyle.filter,
        backdropFilter: computedStyle.backdropFilter,
        // Check for transforms that could cause scaling
        transform: computedStyle.transform,
        transformOrigin: computedStyle.transformOrigin
      };
    });

    console.log('QR Code rendering info:', renderingInfo);

    // Ensure no filters that could blur the QR code
    expect(renderingInfo?.filter).toBe('none');
    expect(renderingInfo?.backdropFilter).toBe('none');
    
    // Ensure no transforms
    expect(renderingInfo?.transform).toBe('none');
    
    // Verify crisp rendering settings
    expect(renderingInfo?.shapeRendering).toMatch(/crispEdges|geometricPrecision/i);

    console.log('✅ QR code maintains pixel-perfect rendering');
  });

  test('QR code should not have any CSS animations that could affect scanning', async ({ page }) => {
    await page.goto('http://localhost:8000/#/home');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Check for any animations that could interfere with QR code scanning
    const animationInfo = await page.evaluate(() => {
      const canvas = document.querySelector('#footer-qr-canvas');
      if (!canvas) return null;
      
      const svg = canvas.parentNode.querySelector('svg');
      if (!svg) return null;
      
      const computedStyle = window.getComputedStyle(svg);
      
      return {
        animation: computedStyle.animation,
        animationName: computedStyle.animationName,
        animationDuration: computedStyle.animationDuration,
        animationTimingFunction: computedStyle.animationTimingFunction,
        transition: computedStyle.transition,
        transitionProperty: computedStyle.transitionProperty,
        // Check for any transforms in animations
        hasTransformAnimation: computedStyle.animation.includes('transform') || 
                              computedStyle.transition.includes('transform')
      };
    });

    console.log('QR Code animation info:', animationInfo);

    // CRITICAL: QR codes should not have transform animations
    expect(animationInfo?.hasTransformAnimation).toBe(false);
    
    // Verify no animations that could affect the QR code
    expect(animationInfo?.animationName).toBe('none');
    expect(animationInfo?.animationDuration).toBe('0s');

    console.log('✅ QR code has no animations that could affect scanning');
  });
});
