import { test, expect } from '@playwright/test';

/**
 * QR Modal Visual Regression Tests - Tests That Actually Understand The Problem
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * These tests catch the ACTUAL visual regression: the outer container stretching
 * horizontally instead of maintaining square proportions that fit the QR code form.
 */
test.describe('QR Modal Visual Regression - Tests That Understand The Problem', () => {
  test('CRITICAL: QR modal outer container must not stretch horizontally on small viewports', async ({ page }) => {
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

    // Find the ACTUAL outer container that's causing the visual problem
    // This is the container that wraps the QR code and has the grey background
    const outerContainer = page.locator('#footer-qr-panel.qr-fullscreen');
    await expect(outerContainer).toBeVisible();

    // Get the dimensions of the outer container (the one that's visually stretching)
    const outerContainerDimensions = await outerContainer.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        aspectRatio: rect.width / rect.height,
        viewportWidth: window.innerWidth,
        widthPercent: (rect.width / window.innerWidth) * 100
      };
    });

    console.log('Outer container dimensions:', outerContainerDimensions);

    // CRITICAL ASSERTIONS - These catch the actual visual regression
    
    // 1. The outer container should NOT fill the entire viewport width
    expect(outerContainerDimensions.widthPercent).toBeLessThanOrEqual(95, 
      `REGRESSION DETECTED: Outer container width ${outerContainerDimensions.widthPercent.toFixed(1)}% fills too much of viewport`);

    // 2. The outer container should be more square-ish (not a wide rectangle)
    expect(outerContainerDimensions.aspectRatio).toBeLessThan(1.3, 
      `REGRESSION DETECTED: Outer container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 is too wide`);

    // 3. The outer container should not be wider than it is tall by more than 30%
    expect(outerContainerDimensions.aspectRatio).toBeLessThanOrEqual(1.3, 
      `REGRESSION DETECTED: Outer container is ${((outerContainerDimensions.aspectRatio - 1) * 100).toFixed(1)}% wider than tall`);

    // Take screenshot for visual verification
    await page.screenshot({ 
      path: `../test-results/qr-modal-visual-regression-outer-container-400x826.png`,
      fullPage: true 
    });

    console.log(`✅ VISUAL REGRESSION PREVENTED: Outer container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 (${outerContainerDimensions.widthPercent.toFixed(1)}% width)`);
  });

  test('QR modal outer container must maintain square proportions across mobile viewports', async ({ page }) => {
    const mobileViewports = [
      { name: 'smallAndroid', width: 360, height: 740 },
      { name: 'pixel7a', width: 414, height: 794 },
      { name: 'iphone13', width: 390, height: 844 }
    ];

    for (const viewport of mobileViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
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

      // Get the outer container dimensions
      const outerContainerDimensions = await page.locator('#footer-qr-panel.qr-fullscreen').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          aspectRatio: rect.width / rect.height,
          viewportWidth: window.innerWidth,
          widthPercent: (rect.width / window.innerWidth) * 100
        };
      });

      console.log(`${viewport.name} outer container:`, outerContainerDimensions);

      // The outer container should maintain reasonable proportions
      expect(outerContainerDimensions.aspectRatio).toBeLessThan(1.4, 
        `${viewport.name}: Outer container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 too wide`);

      expect(outerContainerDimensions.widthPercent).toBeLessThanOrEqual(95, 
        `${viewport.name}: Outer container width ${outerContainerDimensions.widthPercent.toFixed(1)}% too wide`);

      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `../test-results/qr-modal-visual-regression-${viewport.name}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name}: Outer container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 (${outerContainerDimensions.widthPercent.toFixed(1)}% width)`);
    }
  });

  test('QR modal must not have horizontal stretching on very narrow viewports', async ({ page }) => {
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

    // Get the outer container dimensions
    const outerContainerDimensions = await page.locator('#footer-qr-panel.qr-fullscreen').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        aspectRatio: rect.width / rect.height,
        viewportWidth: window.innerWidth,
        widthPercent: (rect.width / window.innerWidth) * 100
      };
    });

    console.log(`Narrow viewport (${narrowViewport.width}×${narrowViewport.height}) outer container:`, outerContainerDimensions);

    // CRITICAL: Outer container must not stretch to fill narrow viewport
    expect(outerContainerDimensions.aspectRatio).toBeLessThan(1.2, 
      `Narrow viewport outer container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 should be ≤ 1.2:1`);

    expect(outerContainerDimensions.widthPercent).toBeLessThan(90, 
      `Narrow viewport outer container width ${outerContainerDimensions.widthPercent.toFixed(1)}% should be ≤ 90%`);

    // Container should be roughly square even on very narrow viewports
    expect(outerContainerDimensions.aspectRatio).toBeGreaterThanOrEqual(0.8, 
      `Container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 should be ≥ 0.8:1`);

    console.log(`✅ Narrow viewport: Outer container aspect ratio ${outerContainerDimensions.aspectRatio.toFixed(2)}:1 - NO HORIZONTAL STRETCHING`);
  });

  test('QR modal visual comparison - before and after fix', async ({ page }) => {
    // This test takes screenshots for visual comparison
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

    // Take screenshot for visual comparison
    await page.screenshot({ 
      path: `../test-results/qr-modal-visual-comparison-400x826.png`,
      fullPage: true 
    });

    // Get both inner and outer container dimensions for comparison
    const containerAnalysis = await page.evaluate(() => {
      const outerContainer = document.querySelector('#footer-qr-panel.qr-fullscreen');
      const innerContainer = document.querySelector('.glow-container-mobile');
      
      if (!outerContainer || !innerContainer) return null;
      
      const outerRect = outerContainer.getBoundingClientRect();
      const innerRect = innerContainer.getBoundingClientRect();
      
      return {
        outer: {
          width: outerRect.width,
          height: outerRect.height,
          aspectRatio: outerRect.width / outerRect.height,
          widthPercent: (outerRect.width / window.innerWidth) * 100
        },
        inner: {
          width: innerRect.width,
          height: innerRect.height,
          aspectRatio: innerRect.width / innerRect.height,
          widthPercent: (innerRect.width / window.innerWidth) * 100
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });

    console.log('Container analysis:', containerAnalysis);

    // The outer container should be the one we're concerned about
    if (containerAnalysis) {
      expect(containerAnalysis.outer.aspectRatio).toBeLessThan(1.3, 
        `Outer container aspect ratio ${containerAnalysis.outer.aspectRatio.toFixed(2)}:1 should be ≤ 1.3:1`);
      
      expect(containerAnalysis.outer.widthPercent).toBeLessThanOrEqual(95, 
        `Outer container width ${containerAnalysis.outer.widthPercent.toFixed(1)}% should be ≤ 95%`);
    }

    console.log(`✅ Visual comparison complete - check screenshots for visual verification`);
  });
});
