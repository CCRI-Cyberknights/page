import { test, expect } from '@playwright/test';

/**
 * QR Modal Desired State Tests - Tests That Ensure The Right Visual Outcome
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * These tests ensure the QR modal opens to the DESIRED state:
 * - Large QR code dominating the viewport (like left screenshot)
 * - NOT the regular page content with small QR code (like right screenshot)
 */
test.describe('QR Modal Desired State - Tests That Ensure The Right Visual Outcome', () => {

  test('QR modal must work correctly across different viewports', async ({ page }) => {
    const testViewports = [
      { name: 'smallAndroid', width: 360, height: 740 },
      { name: 'pixel7a', width: 414, height: 794 },
      { name: 'iphone13', width: 390, height: 862 },
      { name: 'narrow', width: 320, height: 568 }
    ];

    for (const viewport of testViewports) {
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

      // Verify QR modal opens correctly
      const qrPanel = page.locator('#footer-qr-panel.qr-fullscreen');
      await expect(qrPanel).toBeVisible();

      // Verify QR code is large and visible
      const qrCode = page.locator('.qr-fullscreen svg');
      await expect(qrCode).toBeVisible();

      // Get QR code dimensions
      const qrCodeDimensions = await qrCode.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          widthPercent: (rect.width / window.innerWidth) * 100,
          heightPercent: (rect.height / window.innerHeight) * 100
        };
      });

      // QR code should be substantial on all viewports
      expect(qrCodeDimensions.width).toBeGreaterThan(150, 
        `${viewport.name}: QR code width ${qrCodeDimensions.width}px should be > 150px`);
      
      expect(qrCodeDimensions.height).toBeGreaterThan(150, 
        `${viewport.name}: QR code height ${qrCodeDimensions.height}px should be > 150px`);

      // QR code should take up reasonable portion of viewport
      expect(qrCodeDimensions.widthPercent).toBeGreaterThan(30, 
        `${viewport.name}: QR code width ${qrCodeDimensions.widthPercent.toFixed(1)}% should be > 30%`);

      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `../test-results/qr-modal-desired-state-${viewport.name}.png`,
        fullPage: true 
      });

      console.log(`✅ ${viewport.name}: QR code ${qrCodeDimensions.width}×${qrCodeDimensions.height}px (${qrCodeDimensions.widthPercent.toFixed(1)}% width)`);
    }
  });

  test('QR modal must close properly and return to normal page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 862 });
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

    // Verify QR modal is open
    const qrPanel = page.locator('#footer-qr-panel.qr-fullscreen');
    await expect(qrPanel).toBeVisible();

    // Close the modal
    const closeButton = page.locator('button:has-text("✕")');
    await closeButton.click();
    await page.waitForTimeout(500);

    // Verify QR modal is closed
    await expect(qrPanel).not.toBeVisible();

    // Verify regular page content is visible again
    const mainHeading = page.locator('h1, h2, h3').first();
    await expect(mainHeading).toBeVisible();

    console.log(`✅ Modal closes properly and returns to normal page state`);
  });
});
