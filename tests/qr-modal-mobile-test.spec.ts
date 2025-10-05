import { test, expect } from '@playwright/test';

test.describe('QR Modal Mobile Display', () => {
  test('should open QR modal correctly on Pixel 7a', async ({ page }) => {
    await page.goto('http://localhost:8000/#/home');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Scroll to footer to ensure QR code is visible
    await page.evaluate(() => {
      document.querySelector('footer')?.scrollIntoView();
    });

    // Wait a bit for scroll to complete
    await page.waitForTimeout(500);

    // Take screenshot before clicking
    await page.screenshot({ 
      path: '../test-results/qr-modal-before-click-pixel7a.png',
      fullPage: true 
    });

    // Click on the QR code toggle button (the SVG container)
    const qrToggle = page.locator('#footer-qr-toggle');
    await expect(qrToggle).toBeVisible();
    await qrToggle.click();

    // Wait for modal to open
    await page.waitForTimeout(1000);

    // Take screenshot after clicking
    await page.screenshot({ 
      path: '../test-results/qr-modal-after-click-pixel7a.png',
      fullPage: true 
    });

    // Check if the QR panel is visible (should be full screen on mobile)
    const qrPanel = page.locator('#footer-qr-panel');
    await expect(qrPanel).toBeVisible();

    // Check if the panel has full screen classes
    const panelClasses = await qrPanel.getAttribute('class');
    console.log('QR Panel classes:', panelClasses);

    // Check if there's a QR code displayed (either canvas or SVG)
    const qrCanvas = page.locator('#footer-qr-canvas');
    const qrSvg = page.locator('#footer-qr-panel svg');
    
    // One of them should be visible
    const canvasVisible = await qrCanvas.isVisible();
    const svgVisible = await qrSvg.isVisible();
    
    console.log('Canvas visible:', canvasVisible);
    console.log('SVG visible:', svgVisible);

    // At least one QR code element should be visible
    expect(canvasVisible || svgVisible).toBe(true);

    // Check if the modal is full screen on mobile
    const isFullScreen = panelClasses?.includes('qr-fullscreen') || panelClasses?.includes('fixed');
    console.log('Is full screen:', isFullScreen);

    // On mobile, it should be full screen
    expect(isFullScreen).toBe(true);

    // Check if there's a close button
    const closeButton = page.locator('#footer-qr-panel button');
    await expect(closeButton).toBeVisible();

    // Take final screenshot
    await page.screenshot({ 
      path: '../test-results/qr-modal-final-pixel7a.png',
      fullPage: true 
    });
  });

  test('should display QR modal content correctly on Pixel 7a', async ({ page }) => {
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
    await qrToggle.click();
    await page.waitForTimeout(1000);

    // Check modal layout and content
    const qrPanel = page.locator('#footer-qr-panel');
    await expect(qrPanel).toBeVisible();

    // Check if URL input is present and visible
    const urlInput = page.locator('#footer-qr-panel input[type="text"]');
    await expect(urlInput).toBeVisible();

    // Check if length display is present
    const lengthDisplay = page.locator('#footer-qr-panel').locator('text=/Length/');
    await expect(lengthDisplay).toBeVisible();

    // Check if error correction controls are present
    const eclControls = page.locator('#footer-qr-panel').locator('text=/Error Correction/');
    await expect(eclControls).toBeVisible();

    // Check if download button is present
    const downloadButton = page.locator('#footer-qr-panel').locator('text=/Download/');
    await expect(downloadButton).toBeVisible();

    // Take screenshot of modal content
    await page.screenshot({ 
      path: '../test-results/qr-modal-content-pixel7a.png',
      fullPage: true 
    });

    // Test closing the modal
    const closeButton = page.locator('#footer-qr-panel button').first();
    await closeButton.click();
    await page.waitForTimeout(500);

    // Panel should be hidden again
    await expect(qrPanel).not.toBeVisible();
  });
});

