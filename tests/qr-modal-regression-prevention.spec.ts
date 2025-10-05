import { test, expect } from '@playwright/test';
import { mobileViewports } from './helpers/viewports';

/**
 * QR Modal Proportions Regression Prevention Tests
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * These tests prevent regression of QR modal proportions, specifically ensuring
 * the container maintains square-ish proportions on small mobile viewports
 * and doesn't stretch horizontally to fill the viewport width.
 */
test.describe('QR Modal Proportions Regression Prevention', () => {
  // Test critical mobile viewports that are prone to horizontal stretching
  const criticalMobileViewports = {
    smallAndroid: mobileViewports.smallAndroid, // 360×740 - most prone to stretching
    pixel7a: mobileViewports.pixel7a,           // 414×794 - common mobile size
    iphone13: mobileViewports.iphone13         // 390×844 - iPhone size
  };

  for (const [device, viewport] of Object.entries(criticalMobileViewports)) {
    test.describe(`${device} (${viewport.width}×${viewport.height})`, () => {
      test('QR modal container MUST maintain square proportions on small viewports', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open QR modal
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        const qrToggle = page.locator('#footer-qr-toggle');
        await expect(qrToggle).toBeVisible();
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Get container dimensions and CSS properties
        const containerAnalysis = await page.locator('.glow-container-mobile').evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
          };
          
          return {
            container: {
              width: rect.width,
              height: rect.height,
              aspectRatio: rect.width / rect.height
            },
            css: {
              width: computed.width,
              height: computed.height,
              maxWidth: computed.maxWidth,
              maxHeight: computed.maxHeight
            },
            viewport: viewport,
            widthPercent: (rect.width / viewport.width) * 100,
            heightPercent: (rect.height / viewport.height) * 100
          };
        });

        console.log(`${device} container analysis:`, containerAnalysis);

        // CRITICAL ASSERTIONS - These prevent the regression shown in the screenshots
        
        // 1. Container must be square-ish (aspect ratio close to 1:1)
        const aspectRatio = containerAnalysis.container.aspectRatio;
        expect(aspectRatio).toBeLessThanOrEqual(1.2, 
          `Container aspect ratio ${aspectRatio.toFixed(2)}:1 is too wide on ${device}. Should be ≤ 1.2:1`);

        // 2. Container width must not exceed 90% of viewport width
        const widthPercent = containerAnalysis.widthPercent;
        expect(widthPercent).toBeLessThanOrEqual(90, 
          `Container width ${widthPercent.toFixed(1)}% exceeds 90% of viewport on ${device}`);

        // 3. Container must not be wider than it is tall by more than 20%
        expect(aspectRatio).toBeLessThanOrEqual(1.2, 
          `Container is ${((aspectRatio - 1) * 100).toFixed(1)}% wider than tall on ${device}`);

        // 4. For very small viewports (≤400px), container should be even more square
        if (viewport.width <= 400) {
          expect(aspectRatio).toBeLessThanOrEqual(1.1, 
            `Small viewport ${device} container aspect ratio ${aspectRatio.toFixed(2)}:1 should be ≤ 1.1:1`);
        }

        // 5. Container should have reasonable minimum size
        expect(containerAnalysis.container.width).toBeGreaterThanOrEqual(300, 
          `Container width ${containerAnalysis.container.width}px too small on ${device}`);
        expect(containerAnalysis.container.height).toBeGreaterThanOrEqual(300, 
          `Container height ${containerAnalysis.container.height}px too small on ${device}`);

        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `../test-results/qr-modal-regression-prevention-${device}.png`,
          fullPage: true 
        });

        console.log(`✅ ${device}: Container aspect ratio ${aspectRatio.toFixed(2)}:1 (${widthPercent.toFixed(1)}% width) - REGRESSION PREVENTED`);
      });

      test('QR modal CSS properties must enforce square proportions', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open QR modal
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        const qrToggle = page.locator('#footer-qr-toggle');
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Verify CSS properties are correctly applied
        const cssProperties = await page.locator('.glow-container-mobile').evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            width: computed.width,
            height: computed.height,
            maxWidth: computed.maxWidth,
            maxHeight: computed.maxHeight,
            margin: computed.margin,
            boxSizing: computed.boxSizing
          };
        });

        console.log(`${device} CSS properties:`, cssProperties);

        // Verify CSS uses min() function for square proportions
        expect(cssProperties.width).toContain('min(');
        expect(cssProperties.height).toContain('min(');
        
        // Verify max-width and max-height also use min() for consistency
        expect(cssProperties.maxWidth).toContain('min(');
        expect(cssProperties.maxHeight).toContain('min(');

        // Verify margin is auto for centering
        expect(cssProperties.margin).toContain('auto');

        // Verify box-sizing is border-box for proper padding calculation
        expect(cssProperties.boxSizing).toBe('border-box');

        console.log(`✅ ${device}: CSS properties correctly enforce square proportions`);
      });

      test('QR modal must not stretch horizontally on narrow viewports', async ({ page }) => {
        // Test with an even narrower viewport to catch edge cases
        const narrowViewport = { width: 320, height: 568 }; // iPhone 5 size
        await page.setViewportSize(narrowViewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open QR modal
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        const qrToggle = page.locator('#footer-qr-toggle');
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Get container dimensions
        const containerDimensions = await page.locator('.glow-container-mobile').evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            aspectRatio: rect.width / rect.height,
            viewportWidth: window.innerWidth,
            widthPercent: (rect.width / window.innerWidth) * 100
          };
        });

        console.log(`Narrow viewport (${narrowViewport.width}×${narrowViewport.height}) container:`, containerDimensions);

        // CRITICAL: Container must not stretch to fill narrow viewport
        expect(containerDimensions.aspectRatio).toBeLessThanOrEqual(1.1, 
          `Narrow viewport container aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1 should be ≤ 1.1:1`);

        expect(containerDimensions.widthPercent).toBeLessThanOrEqual(85, 
          `Narrow viewport container width ${containerDimensions.widthPercent.toFixed(1)}% should be ≤ 85%`);

        // Container should be roughly square even on very narrow viewports
        expect(containerDimensions.aspectRatio).toBeGreaterThanOrEqual(0.9, 
          `Container aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1 should be ≥ 0.9:1`);

        console.log(`✅ Narrow viewport: Container aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1 - NO HORIZONTAL STRETCHING`);
      });
    });
  }

  // Test that verifies the specific regression shown in the screenshots
  test('CRITICAL: QR modal must not regress to horizontal stretching on small viewports', async ({ page }) => {
    // Use the exact viewport from the regression screenshot (400×826)
    await page.setViewportSize({ width: 400, height: 826 });
    await page.goto('http://localhost:8000/#/linux');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Scroll to footer and open QR modal
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const qrToggle = page.locator('#footer-qr-toggle');
    await qrToggle.click();
    await page.waitForTimeout(1000);

    // Get container dimensions
    const containerDimensions = await page.locator('.glow-container-mobile').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        aspectRatio: rect.width / rect.height,
        viewportWidth: window.innerWidth,
        widthPercent: (rect.width / window.innerWidth) * 100
      };
    });

    console.log('Regression test container dimensions:', containerDimensions);

    // This test specifically prevents the regression shown in the screenshots
    // The container should NOT stretch horizontally to fill the viewport
    
    // Container aspect ratio must be close to 1:1 (square-ish)
    expect(containerDimensions.aspectRatio).toBeLessThanOrEqual(1.15, 
      `REGRESSION DETECTED: Container aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1 is too wide. Should be ≤ 1.15:1`);

    // Container width must not exceed 90% of viewport
    expect(containerDimensions.widthPercent).toBeLessThanOrEqual(90, 
      `REGRESSION DETECTED: Container width ${containerDimensions.widthPercent.toFixed(1)}% exceeds 90% of viewport`);

    // Container should be roughly square (not a wide rectangle)
    expect(containerDimensions.aspectRatio).toBeGreaterThanOrEqual(0.85, 
      `Container aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1 should be ≥ 0.85:1`);

    // Take screenshot for comparison with regression screenshots
    await page.screenshot({ 
      path: `../test-results/qr-modal-regression-fix-400x826.png`,
      fullPage: true 
    });

    console.log(`✅ REGRESSION PREVENTED: Container aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1 (${containerDimensions.widthPercent.toFixed(1)}% width)`);
  });
});

