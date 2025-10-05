import { test, expect } from '@playwright/test';

/**
 * QR Code Empty String Edge Case Test
 * 
 * Tests the counter-intuitive behavior where clearing the QR code input
 * causes it to revert to the original URL instead of generating a QR code
 * for an empty string.
 * 
 * Expected behavior: Empty string should generate a QR code for empty content,
 * not fall back to the original URL.
 */
test.describe('QR Code Empty String Edge Case', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
  });

  test('should handle empty string input correctly', async ({ page }) => {
    // Open QR code panel
    await page.click('#footer-qr-toggle');
    await page.waitForSelector('#footer-qr-panel:not(.hidden)');
    
    // Wait for QR code to be initialized
    await page.waitForSelector('#footer-qr-canvas');
    
    // Get the input field and clear it completely
    const input = page.locator('#footer-qr-input');
    await input.clear();
    
    // Verify the input is actually empty
    await expect(input).toHaveValue('');
    
    // Wait for any rendering to complete
    await page.waitForTimeout(1000);
    
    // Check that length display shows 0
    const lengthDisplay = page.locator('#footer-qr-length');
    await expect(lengthDisplay).toContainText('Length: 0');
    
    // Verify QR code is still visible (should show QR for empty string)
    // The QR code should be in either the canvas or the SVG container
    const qrCanvas = page.locator('#footer-qr-canvas');
    const qrSvgContainer = page.locator('#footer-qr-canvas').locator('..').locator('div[style*="width: 160px"]');
    
    // At least one should be visible
    const canvasVisible = await qrCanvas.isVisible();
    const svgVisible = await qrSvgContainer.isVisible();
    
    expect(canvasVisible || svgVisible).toBe(true);
    
    // The QR code should still be there, not reverted to original URL
    // This test verifies the fix - it should show empty string QR instead of reverting
  });

  test('should not revert to original URL when input is cleared', async ({ page }) => {
    // Open QR code panel
    await page.click('#footer-qr-toggle');
    await page.waitForSelector('#footer-qr-panel:not(.hidden)');
    
    // Wait for QR code to be initialized
    await page.waitForSelector('#footer-qr-canvas');
    
    // Get the original URL value
    const input = page.locator('#footer-qr-input');
    const originalUrl = await input.inputValue();
    
    // Clear the input
    await input.clear();
    await expect(input).toHaveValue('');
    
    // Wait for rendering
    await page.waitForTimeout(1000);
    
    // The input should remain empty, not revert to original URL
    await expect(input).toHaveValue('');
    
    // Length should show 0
    const lengthDisplay = page.locator('#footer-qr-length');
    await expect(lengthDisplay).toContainText('Length: 0');
  });

  test('should generate QR code for empty string', async ({ page }) => {
    // Open QR code panel
    await page.click('#footer-qr-toggle');
    await page.waitForSelector('#footer-qr-panel:not(.hidden)');
    
    // Clear input
    const input = page.locator('#footer-qr-input');
    await input.clear();
    
    // Wait for rendering
    await page.waitForTimeout(500);
    
    // QR code should still be visible (representing empty string)
    const qrContainer = page.locator('#footer-qr-canvas').locator('..').locator('div[style*="width: 160px"]');
    await expect(qrContainer).toBeVisible();
    
    // QR code should contain SVG (not be empty or show error)
    const svgElement = qrContainer.locator('svg');
    await expect(svgElement).toBeVisible();
    
    // The QR code should be a valid QR code for empty string
    // (This test documents the expected behavior)
  });

  test('should handle single character input correctly', async ({ page }) => {
    // Open QR code panel
    await page.click('#footer-qr-toggle');
    await page.waitForSelector('#footer-qr-panel:not(.hidden)');
    
    // Test with single character
    const input = page.locator('#footer-qr-input');
    await input.fill('1');
    
    // Wait for rendering
    await page.waitForTimeout(500);
    
    // Length should show 1
    const lengthDisplay = page.locator('#footer-qr-length');
    await expect(lengthDisplay).toContainText('Length: 1');
    
    // QR code should be visible
    const qrContainer = page.locator('#footer-qr-canvas').locator('..').locator('div[style*="width: 160px"]');
    await expect(qrContainer).toBeVisible();
    
    // Now clear it
    await input.clear();
    await expect(input).toHaveValue('');
    
    // Wait for rendering
    await page.waitForTimeout(500);
    
    // Length should show 0 (not revert to original URL length)
    await expect(lengthDisplay).toContainText('Length: 0');
  });

  test('should maintain empty state when ECL is changed', async ({ page }) => {
    // Open QR code panel
    await page.click('#footer-qr-toggle');
    await page.waitForSelector('#footer-qr-panel:not(.hidden)');
    
    // Clear input
    const input = page.locator('#footer-qr-input');
    await input.clear();
    await expect(input).toHaveValue('');
    
    // Change error correction level
    const eclInc = page.locator('#footer-qr-ecl-inc');
    await eclInc.click();
    
    // Wait for rendering
    await page.waitForTimeout(500);
    
    // Input should still be empty (not revert to original URL)
    await expect(input).toHaveValue('');
    
    // Length should still show 0
    const lengthDisplay = page.locator('#footer-qr-length');
    await expect(lengthDisplay).toContainText('Length: 0');
  });
});

/**
 * Expected Behavior Documentation:
 * 
 * When a user clears the QR code input field:
 * 1. The input should remain empty (not revert to original URL)
 * 2. The length display should show "Length: 0"
 * 3. A QR code should be generated for the empty string
 * 4. The QR code should remain visible and functional
 * 5. Changing ECL should not cause reversion to original URL
 * 
 * Current Bug:
 * The code uses `this.input.value || this.url` which causes fallback
 * to original URL when input is empty. This should be changed to
 * `this.input.value` to allow empty string QR codes.
 */
