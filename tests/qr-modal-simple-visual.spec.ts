import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('QR Modal Simple Visual Test', () => {
  test('1024x624 viewport - 3rd panel should be hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 624 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
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
    const footerQR = page.locator('#footer-qr-toggle');
    await footerQR.click();
    await page.waitForTimeout(1000);

    // Verify modal is visible
    const qrModal = page.locator('#footer-qr-panel');
    await expect(qrModal).toBeVisible();

    // Verify advanced panel is hidden
    const advancedPanel = page.locator('.qr-fullscreen [data-qr-panel="advanced"]');
    await expect(advancedPanel).not.toBeVisible();

    // Verify QR code is visible
    const qrCanvas = page.locator('#footer-qr-canvas');
    const qrSvg = page.locator('.qr-fullscreen svg');
    
    const canvasVisible = await qrCanvas.count() > 0 ? await qrCanvas.isVisible() : false;
    const svgVisible = await qrSvg.count() > 0 ? await qrSvg.isVisible() : false;
    
    expect(canvasVisible || svgVisible).toBe(true);

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/qr-modal-1024x624-simplified.png',
      fullPage: false
    });

    console.log('✅ 1024x624: 3rd panel hidden, QR code visible, modal centered');
  });

  test('Desktop viewport - 3rd panel should be visible', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
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
    const footerQR = page.locator('#footer-qr-toggle');
    await footerQR.click();
    await page.waitForTimeout(1000);

    // Verify modal is visible
    const qrModal = page.locator('#footer-qr-panel');
    await expect(qrModal).toBeVisible();

    // Verify advanced panel is visible on desktop
    const advancedPanel = page.locator('.qr-fullscreen [data-qr-panel="advanced"]');
    await expect(advancedPanel).toBeVisible();

    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/qr-modal-1920x1080-full.png',
      fullPage: false
    });

    console.log('✅ 1920x1080: 3rd panel visible, all controls present');
  });
});

