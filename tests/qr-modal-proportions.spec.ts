import { test, expect } from '@playwright/test';
import { mobileViewports, desktopViewports } from './helpers/viewports';

/**
 * QR Modal Square Proportions Test
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * These tests verify that the QR modal container maintains square-ish proportions
 * that fit the form of the QR code, rather than stretching horizontally.
 */
test.describe('QR Modal Square Proportions', () => {
  for (const [device, viewport] of Object.entries({ ...mobileViewports, ...desktopViewports })) {
    test.describe(`${device} (${viewport.width}×${viewport.height})`, () => {
      test('QR modal container maintains square-ish proportions', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        // Open QR modal
        const qrToggle = page.locator('#footer-qr-toggle');
        await expect(qrToggle).toBeVisible();
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Get container dimensions
        const containerDimensions = await page.locator('.glow-container-mobile').evaluate((el) => {
          const rect = el.getBoundingClientRect();
          const computed = window.getComputedStyle(el);
          return {
            width: rect.width,
            height: rect.height,
            aspectRatio: rect.width / rect.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            widthPercent: (rect.width / window.innerWidth) * 100,
            heightPercent: (rect.height / window.innerHeight) * 100
          };
        });

        console.log(`${device} container dimensions:`, containerDimensions);

        // Verify container is not too wide (should be more square-ish)
        const aspectRatio = containerDimensions.aspectRatio;
        expect(aspectRatio).toBeLessThan(1.5); // Should not be more than 1.5:1 ratio
        
        // On mobile, container should be more square-ish
        if (viewport.width < 768) {
          expect(aspectRatio).toBeLessThan(1.3); // Even more square on mobile
        }

        // Verify container doesn't take up too much horizontal space
        const widthPercent = containerDimensions.widthPercent;
        expect(widthPercent).toBeLessThan(95); // Should not exceed 95% of viewport width

        // Verify container is reasonably sized
        expect(containerDimensions.width).toBeGreaterThan(300); // Minimum reasonable width
        expect(containerDimensions.height).toBeGreaterThan(400); // Minimum reasonable height

        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `test-results/qr-modal-proportions-${device}.png`,
          fullPage: true 
        });

        console.log(`✅ ${device}: Container aspect ratio ${aspectRatio.toFixed(2)}:1 (${widthPercent.toFixed(1)}% width)`);
      });

      test('QR modal adapts to different viewport orientations', async ({ page }) => {
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open modal
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        const qrToggle = page.locator('#footer-qr-toggle');
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Test different viewport sizes to ensure proportions remain reasonable
        const testViewports = [
          { width: Math.min(viewport.width, 400), height: Math.min(viewport.height, 600) }, // Smaller
          { width: viewport.width, height: viewport.height }, // Original
          { width: Math.min(viewport.width * 1.2, 800), height: Math.min(viewport.height * 1.2, 1000) } // Larger
        ];

        for (const testViewport of testViewports) {
          await page.setViewportSize(testViewport);
          await page.waitForTimeout(300);

          const containerDimensions = await page.locator('.glow-container-mobile').evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height,
              aspectRatio: rect.width / rect.height
            };
          });

          // Verify proportions remain reasonable across different viewport sizes
          expect(containerDimensions.aspectRatio).toBeLessThan(1.5);
          expect(containerDimensions.width).toBeGreaterThan(250);
          expect(containerDimensions.height).toBeGreaterThan(300);

          console.log(`${device} ${testViewport.width}×${testViewport.height}: aspect ratio ${containerDimensions.aspectRatio.toFixed(2)}:1`);
        }
      });
    });
  }
});
