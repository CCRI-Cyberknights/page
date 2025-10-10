import { test, expect } from '@playwright/test';
import { viewports } from './helpers/viewports';

/**
 * Comprehensive QR Modal Responsive Behavior Test Suite
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * This test suite validates QR modal behavior across different viewport sizes,
 * ensuring optimal usability and content visibility on all devices.
 * 
 * Key Test Scenarios:
 * - Desktop (>1024px): Full feature set with all controls
 * - Small Laptop (≤1024px, ≤700px): Simplified content (QR + URL only)
 * - Mobile (≤768px): Touch-optimized layout with hidden advanced controls
 */
test.describe('QR Modal Responsive Behavior', () => {
  
  // Test key responsive breakpoints
  const responsiveBreakpoints = [
    {
      name: 'Desktop',
      viewport: viewports.desktop,
      expectedBehavior: {
        hasErrorCorrection: true,
        hasDownloadButton: true,
        qrCanvasSize: 160,
        modalPadding: '1rem'
      }
    },
    {
      name: 'SmallLaptop',
      viewport: viewports.smallLaptop,
      expectedBehavior: {
        hasErrorCorrection: false,
        hasDownloadButton: false,
        qrCanvasSize: 120,
        modalPadding: '1rem'
      }
    },
    {
      name: 'Mobile',
      viewport: viewports.pixel7a,
      expectedBehavior: {
        hasErrorCorrection: false,
        hasDownloadButton: false,
        qrCanvasSize: 140,
        modalPadding: '0.75rem'
      }
    }
  ];

  for (const { name, viewport, expectedBehavior } of responsiveBreakpoints) {
    test.describe(`${name} (${viewport.width}×${viewport.height})`, () => {
      
      test('QR modal adapts content based on viewport size', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/home');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer
        await page.evaluate(() => {
          document.querySelector('footer')?.scrollIntoView();
        });
        await page.waitForTimeout(500);

        // Open QR modal
        const qrToggle = page.locator('#footer-qr-toggle');
        await expect(qrToggle).toBeVisible();
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Verify modal is visible
        const qrPanel = page.locator('#footer-qr-panel');
        await expect(qrPanel).toBeVisible();

        // Test error correction controls visibility
        const errorCorrectionControls = page.locator('#footer-qr-panel').locator('text=/Error Correction/');
        if (expectedBehavior.hasErrorCorrection) {
          await expect(errorCorrectionControls).toBeVisible();
        } else {
          await expect(errorCorrectionControls).not.toBeVisible();
        }

        // Test download button visibility
        const downloadButton = page.locator('#footer-qr-download');
        if (expectedBehavior.hasDownloadButton) {
          await expect(downloadButton).toBeVisible();
        } else {
          await expect(downloadButton).not.toBeVisible();
        }

        // Test QR canvas size
        const qrCanvas = page.locator('#footer-qr-canvas');
        await expect(qrCanvas).toBeVisible();
        
        const canvasDimensions = await qrCanvas.evaluate((el) => ({
          width: el.width,
          height: el.height
        }));
        
        // Canvas should be close to expected size (allow some tolerance)
        const tolerance = 10;
        expect(canvasDimensions.width).toBeGreaterThanOrEqual(expectedBehavior.qrCanvasSize - tolerance);
        expect(canvasDimensions.width).toBeLessThanOrEqual(expectedBehavior.qrCanvasSize + tolerance);

        // Take screenshot for visual verification
        await page.screenshot({
          path: `test-results/qr-modal-${name.toLowerCase()}-${viewport.width}x${viewport.height}.png`,
          fullPage: true
        });

        console.log(`✅ ${name}: QR modal adapted correctly for ${viewport.width}×${viewport.height}`);
      });

      test('QR modal content is always visible and functional', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/home');
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

        const qrToggle = page.locator('#footer-qr-toggle');
        await qrToggle.click();
        await page.waitForTimeout(1000);

        const qrPanel = page.locator('#footer-qr-panel');
        await expect(qrPanel).toBeVisible();

        // Core functionality should always be present
        const qrCanvas = page.locator('#footer-qr-canvas');
        await expect(qrCanvas).toBeVisible();

        const urlInput = page.locator('#footer-qr-panel input[type="text"]');
        await expect(urlInput).toBeVisible();

        const lengthDisplay = page.locator('#footer-qr-panel').locator('text=/Length/');
        await expect(lengthDisplay).toBeVisible();

        // QR code should be fully visible (not clipped)
        const canvasRect = await qrCanvas.boundingBox();
        expect(canvasRect).not.toBeNull();
        expect(canvasRect!.width).toBeGreaterThan(0);
        expect(canvasRect!.height).toBeGreaterThan(0);

        // Modal should fit within viewport
        const panelRect = await qrPanel.boundingBox();
        expect(panelRect).not.toBeNull();
        expect(panelRect!.bottom).toBeLessThanOrEqual(viewport.height);
        expect(panelRect!.right).toBeLessThanOrEqual(viewport.width);

        console.log(`✅ ${name}: Core QR functionality preserved at ${viewport.width}×${viewport.height}`);
      });

      test('QR modal maintains proper aspect ratio', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/home');
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

        const qrToggle = page.locator('#footer-qr-toggle');
        await qrToggle.click();
        await page.waitForTimeout(1000);

        const qrPanel = page.locator('#footer-qr-panel');
        await expect(qrPanel).toBeVisible();

        // Get modal dimensions
        const panelDimensions = await qrPanel.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            aspectRatio: rect.width / rect.height
          };
        });

        // Modal should have reasonable aspect ratio (not too wide or tall)
        expect(panelDimensions.aspectRatio).toBeLessThan(1.5); // Should not be more than 1.5:1 ratio
        
        // On mobile, modal should be more square-ish
        if (viewport.width <= 768) {
          expect(panelDimensions.aspectRatio).toBeLessThan(1.3);
        }

        // Modal should not exceed reasonable viewport percentages
        const widthPercent = (panelDimensions.width / viewport.width) * 100;
        const heightPercent = (panelDimensions.height / viewport.height) * 100;
        
        expect(widthPercent).toBeLessThan(95); // Should not exceed 95% of viewport width
        expect(heightPercent).toBeLessThan(80); // Should not exceed 80% of viewport height

        console.log(`✅ ${name}: Modal aspect ratio ${panelDimensions.aspectRatio.toFixed(2)}:1 (${widthPercent.toFixed(1)}% width, ${heightPercent.toFixed(1)}% height)`);
      });
    });
  }

  // Test cross-viewport consistency
  test('QR modal behavior is consistent across similar viewport sizes', async ({ page }) => {
    const similarViewports = [
      { name: 'SmallLaptop1', viewport: { width: 1024, height: 624 } },
      { name: 'SmallLaptop2', viewport: { width: 1024, height: 600 } },
      { name: 'SmallLaptop3', viewport: { width: 1000, height: 650 } }
    ];

    for (const { name, viewport } of similarViewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:8000/#/home');
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

      const qrToggle = page.locator('#footer-qr-toggle');
      await qrToggle.click();
      await page.waitForTimeout(1000);

      const qrPanel = page.locator('#footer-qr-panel');
      await expect(qrPanel).toBeVisible();

      // Error correction controls should be hidden for all small laptop viewports
      const errorCorrectionControls = page.locator('#footer-qr-panel').locator('text=/Error Correction/');
      await expect(errorCorrectionControls).not.toBeVisible();

      // Download button should be hidden for all small laptop viewports
      const downloadButton = page.locator('#footer-qr-download');
      await expect(downloadButton).not.toBeVisible();

      console.log(`✅ ${name}: Consistent simplified behavior at ${viewport.width}×${viewport.height}`);
    }
  });
});
