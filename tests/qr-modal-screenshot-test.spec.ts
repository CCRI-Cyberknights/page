import { test, expect } from '@playwright/test';

test.describe('QR Modal Screenshot Test', () => {
  test('should capture QR modal on Pixel 7a at /linux endpoint', async ({ page }) => {
    // Navigate to /linux endpoint
    await page.goto('http://localhost:8000/#/linux');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Scroll to bottom of page to see footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Take screenshot before opening modal
    await page.screenshot({ 
      path: 'test-results/pixel7a-linux-before-modal.png',
      fullPage: true 
    });

    // Click on the QR code toggle button to open modal
    const qrToggle = page.locator('#footer-qr-toggle');
    await expect(qrToggle).toBeVisible();
    await qrToggle.click();

    // Wait for modal to open
    await page.waitForTimeout(1000);

    // Take screenshot of the opened QR modal
    await page.screenshot({ 
      path: 'test-results/pixel7a-linux-qr-modal.png',
      fullPage: true 
    });

    // Verify modal is open and full screen
    const qrPanel = page.locator('#footer-qr-panel');
    await expect(qrPanel).toBeVisible();

    const panelClasses = await qrPanel.getAttribute('class');
    console.log('QR Panel classes:', panelClasses);
    
    // Should be full screen on mobile
    expect(panelClasses).toContain('qr-fullscreen');
    expect(panelClasses).toContain('fixed');

    // Check if QR code is visible (SVG should be visible, canvas hidden)
    const qrSvg = page.locator('#footer-qr-panel svg');
    await expect(qrSvg).toBeVisible();

    console.log('✅ QR modal successfully opened on Pixel 7a at /linux endpoint');
  });

  test('should capture QR modal on desktop viewport at /linux endpoint', async ({ page }) => {
    // Navigate to /linux endpoint
    await page.goto('http://localhost:8000/#/linux');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Scroll to bottom of page to see footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for scroll to complete
    await page.waitForTimeout(1000);

    // Take screenshot before opening modal
    await page.screenshot({ 
      path: 'test-results/desktop-linux-before-modal.png',
      fullPage: true 
    });

    // Click on the QR code toggle button to open modal
    const qrToggle = page.locator('#footer-qr-toggle');
    await expect(qrToggle).toBeVisible();
    await qrToggle.click();

    // Wait for modal to open
    await page.waitForTimeout(1000);

    // Take screenshot of the opened QR modal
    await page.screenshot({ 
      path: 'test-results/desktop-linux-qr-modal.png',
      fullPage: true 
    });

    // Verify modal is open
    const qrPanel = page.locator('#footer-qr-panel');
    await expect(qrPanel).toBeVisible();

    const panelClasses = await qrPanel.getAttribute('class');
    console.log('QR Panel classes:', panelClasses);
    
    // Should be full screen on desktop too
    expect(panelClasses).toContain('qr-fullscreen');
    expect(panelClasses).toContain('fixed');

    // Check if QR code is visible
    const qrSvg = page.locator('#footer-qr-panel svg');
    await expect(qrSvg).toBeVisible();

    console.log('✅ QR modal successfully opened on desktop at /linux endpoint');
  });
});
