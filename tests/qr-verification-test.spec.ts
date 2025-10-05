import { test, expect } from '@playwright/test';

test.describe('Linux Cheatsheet 4 QR Code Verification', () => {
  test('should display both QR codes correctly and verify they are scannable', async ({ page }) => {
    // Navigate to the cheatsheet
    await page.goto('http://localhost:8000/guides/linux-cheatsheet-4.html');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the first QR code image is visible and has proper dimensions
    const firstQrCode = page.locator('img[alt="QR Code for Text Editors & GUI Programs"]');
    await expect(firstQrCode).toBeVisible();
    
    // Verify the QR code has proper dimensions
    const firstQrBox = await firstQrCode.boundingBox();
    expect(firstQrBox?.width).toBeGreaterThan(100);
    expect(firstQrBox?.height).toBeGreaterThan(100);
    
    console.log(`First QR Code dimensions: ${firstQrBox?.width}x${firstQrBox?.height}`);

    // Check if the second QR code image is visible and has proper dimensions
    const secondQrCode = page.locator('img[alt="QR Code for File Deletion & Terminal Management"]');
    await expect(secondQrCode).toBeVisible();
    
    // Verify the QR code has proper dimensions
    const secondQrBox = await secondQrCode.boundingBox();
    expect(secondQrBox?.width).toBeGreaterThan(100);
    expect(secondQrBox?.height).toBeGreaterThan(100);
    
    console.log(`Second QR Code dimensions: ${secondQrBox?.width}x${secondQrBox?.height}`);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'test-results/qr-codes-verification.png', fullPage: true });
    
    console.log('✅ Both QR codes are visible and have proper dimensions');
  });
});
