import { test, expect } from '@playwright/test';

/**
 * QR Modal Viewport Regression Testing
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * This test suite validates QR modal behavior across all viewport sizes,
 * ensuring responsive design works correctly and visual regression is prevented.
 */

const BASE_URL = 'http://localhost:8000';

// Comprehensive viewport matrix for testing
const viewportMatrix = {
  // Desktop variations
  desktop: { width: 1920, height: 1080 },
  desktopSmall: { width: 1440, height: 900 },
  
  // Laptop variations  
  laptop: { width: 1366, height: 768 },
  laptopSmall: { width: 1280, height: 720 },
  laptopConstrained: { width: 1024, height: 624 }, // Key responsive breakpoint
  
  // Tablet variations
  tabletLandscape: { width: 1024, height: 768 },
  tabletPortrait: { width: 768, height: 1024 },
  
  // Mobile variations
  mobileLarge: { width: 414, height: 896 },
  mobile: { width: 375, height: 667 },
  mobileSmall: { width: 360, height: 640 }
};

// Expected behavior for each viewport category
const expectedBehaviors = {
  desktop: { 
    hasAdvancedControls: true, 
    maxQRSize: 160,
    modalWidth: 300,
    description: 'Full feature set'
  },
  laptopConstrained: { 
    hasAdvancedControls: false, 
    maxQRSize: 120,
    modalWidth: 280,
    description: 'Simplified content (QR + URL only)'
  },
  mobile: { 
    hasAdvancedControls: false, 
    maxQRSize: 140,
    modalWidth: 280,
    description: 'Touch-optimized layout'
  }
};

test.describe('QR Modal Viewport Regression', () => {
  
  for (const [viewportName, viewport] of Object.entries(viewportMatrix)) {
    test.describe(`${viewportName} (${viewport.width}×${viewport.height})`, () => {
      
      test('QR modal fits within viewport constraints', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer to ensure QR code is visible
        await page.evaluate(() => {
          document.querySelector('footer')?.scrollIntoView();
        });
        await page.waitForTimeout(500);

        // Confirm footer QR is within visible window
        const footerQR = page.locator('#footer-qr-toggle');
        await expect(footerQR).toBeVisible();
        
        const footerRect = await footerQR.boundingBox();
        if (footerRect) {
          expect(footerRect.bottom).toBeLessThanOrEqual(viewport.height);
          expect(footerRect.right).toBeLessThanOrEqual(viewport.width);
        }

        // Open QR modal
        await footerQR.click();
        await page.waitForTimeout(1000);

        // Check QR modal fits screen constraints
        const qrModal = page.locator('#footer-qr-panel');
        await expect(qrModal).toBeVisible();
        
        const modalRect = await qrModal.boundingBox();
        expect(modalRect).not.toBeNull();
        
        // Modal should be ≤ 90% of viewport width/height
        const widthPercent = (modalRect!.width / viewport.width) * 100;
        const heightPercent = (modalRect!.height / viewport.height) * 100;
        
        expect(widthPercent).toBeLessThanOrEqual(90);
        expect(heightPercent).toBeLessThanOrEqual(90);
        
        // Modal should fit entirely within viewport
        expect(modalRect!.bottom).toBeLessThanOrEqual(viewport.height);
        expect(modalRect!.right).toBeLessThanOrEqual(viewport.width);

        console.log(`✅ ${viewportName}: Modal fits viewport (${widthPercent.toFixed(1)}% width, ${heightPercent.toFixed(1)}% height)`);
      });

      test('QR modal visual regression', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open modal
        await page.evaluate(() => {
          document.querySelector('footer')?.scrollIntoView();
        });
        await page.waitForTimeout(500);

        const footerQR = page.locator('#footer-qr-toggle');
        await footerQR.click();
        await page.waitForTimeout(1000);

        // Take screenshot for visual regression comparison
        const qrModal = page.locator('#footer-qr-panel');
        await expect(qrModal).toBeVisible();
        
        await expect(qrModal).toHaveScreenshot(`qr-modal-${viewportName}.png`);
        
        console.log(`✅ ${viewportName}: Visual regression baseline saved`);
      });

      test('QR modal responsive behavior validation', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open modal
        await page.evaluate(() => {
          document.querySelector('footer')?.scrollIntoView();
        });
        await page.waitForTimeout(500);

        const footerQR = page.locator('#footer-qr-toggle');
        await footerQR.click();
        await page.waitForTimeout(1000);

        const qrModal = page.locator('#footer-qr-panel');
        await expect(qrModal).toBeVisible();

        // Determine expected behavior based on viewport
        let expectedBehavior;
        if (viewport.width <= 1024 && viewport.height <= 700) {
          expectedBehavior = expectedBehaviors.laptopConstrained;
        } else if (viewport.width <= 768) {
          expectedBehavior = expectedBehaviors.mobile;
        } else {
          expectedBehavior = expectedBehaviors.desktop;
        }

        // Validate advanced panel visibility (target full-screen modal)
        const advancedPanel = page.locator('.qr-fullscreen [data-qr-panel="advanced"]');
        
        if (expectedBehavior.hasAdvancedControls) {
          await expect(advancedPanel).toBeVisible();
        } else {
          await expect(advancedPanel).not.toBeVisible();
        }

        // Validate QR code is visible (either canvas or SVG in full-screen modal)
        const qrCanvas = page.locator('#footer-qr-canvas');
        const qrSvg = page.locator('.qr-fullscreen svg');
        
        const canvasVisible = await qrCanvas.count() > 0 ? await qrCanvas.isVisible() : false;
        const svgVisible = await qrSvg.count() > 0 ? await qrSvg.isVisible() : false;
        
        expect(canvasVisible || svgVisible).toBe(true);

        console.log(`✅ ${viewportName}: ${expectedBehavior.description} - Advanced controls (3rd panel): ${expectedBehavior.hasAdvancedControls}`);
      });

      test('QR modal accessibility and usability', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open modal
        await page.evaluate(() => {
          document.querySelector('footer')?.scrollIntoView();
        });
        await page.waitForTimeout(500);

        const footerQR = page.locator('#footer-qr-toggle');
        await footerQR.click();
        await page.waitForTimeout(1000);

        const qrModal = page.locator('#footer-qr-panel');
        await expect(qrModal).toBeVisible();

        // Core functionality should always be present
        const qrCanvas = page.locator('#footer-qr-canvas');
        const urlInput = page.locator('#footer-qr-panel input[type="text"]');
        
        await expect(qrCanvas).toBeVisible();
        await expect(urlInput).toBeVisible();

        // QR code should be fully visible (not clipped)
        const canvasRect = await qrCanvas.boundingBox();
        expect(canvasRect).not.toBeNull();
        expect(canvasRect!.width).toBeGreaterThan(0);
        expect(canvasRect!.height).toBeGreaterThan(0);

        // Input should be usable
        await urlInput.fill('https://example.com');
        await expect(urlInput).toHaveValue('https://example.com');

        // Close button should be visible and functional
        const closeButton = page.locator('#footer-qr-panel button').first();
        await expect(closeButton).toBeVisible();
        
        await closeButton.click();
        await expect(qrModal).not.toBeVisible();

        console.log(`✅ ${viewportName}: Core functionality preserved and accessible`);
      });
    });
  }

  // Cross-viewport consistency test
  test('QR modal behavior consistency across similar viewports', async ({ page }) => {
    const similarViewports = [
      { name: 'SmallLaptop1', viewport: { width: 1024, height: 624 } },
      { name: 'SmallLaptop2', viewport: { width: 1024, height: 600 } },
      { name: 'SmallLaptop3', viewport: { width: 1000, height: 650 } }
    ];

    for (const { name, viewport } of similarViewports) {
      await page.setViewportSize(viewport);
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      // Wait for QR code manager to initialize
      await page.waitForFunction(() => {
        return window.qrCodeManager && window.qrCodeManager.url;
      }, { timeout: 10000 });

      // Scroll to footer and open modal
      await page.evaluate(() => {
        document.querySelector('footer')?.scrollIntoView();
      });
      await page.waitForTimeout(500);

      const footerQR = page.locator('#footer-qr-toggle');
      await footerQR.click();
      await page.waitForTimeout(1000);

      const qrModal = page.locator('#footer-qr-panel');
      await expect(qrModal).toBeVisible();

      // All small laptop viewports should have consistent behavior
      const advancedControls = page.locator('#footer-qr-panel .flex.gap-2');
      const downloadButton = page.locator('#footer-qr-download');
      
      await expect(advancedControls).not.toBeVisible();
      await expect(downloadButton).not.toBeVisible();

      console.log(`✅ ${name}: Consistent simplified behavior at ${viewport.width}×${viewport.height}`);
    }
  });
});
