import { test, expect } from '@playwright/test';

test.describe('QR Code Manager Mobile Viewport', () => {
  test('should eliminate horizontal scrolling on narrow viewports', async ({ page }) => {
    // Set narrow mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:8000/#/resources');
    await page.waitForLoadState('networkidle');
    
    // Click on QR code in footer to open modal
    const qrCode = page.locator('#footer-qr-canvas');
    await expect(qrCode).toBeVisible();
    await qrCode.click();
    
    // Wait for modal to open
    const qrModal = page.locator('.qr-fullscreen');
    await expect(qrModal).toBeVisible();
    
    // Check that modal goes edge-to-edge on mobile
    const glowContainer = page.locator('.glow-container-mobile');
    await expect(glowContainer).toBeVisible();
    
    // Verify no horizontal scrolling
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    // Body scroll width should not exceed viewport width
    expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth + 10); // Small tolerance for browser differences
    
    // Check that modal container has mobile styles applied
    const containerStyles = await glowContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        height: styles.height,
        margin: styles.margin,
        padding: styles.padding,
        boxShadow: styles.boxShadow,
        border: styles.border,
        borderRadius: styles.borderRadius
      };
    });
    
    // On mobile, should have edge-to-edge styling
    expect(containerStyles.width).toBe('375px'); // Should be full viewport width
    expect(containerStyles.margin).toBe('0px'); // No margin
    expect(containerStyles.boxShadow).toBe('none'); // No shadow
    expect(containerStyles.border).toContain('0px'); // No border
  });
  
  test('should maintain green border on wider viewports', async ({ page }) => {
    // Set tablet/desktop viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('http://localhost:8000/#/resources');
    await page.waitForLoadState('networkidle');
    
    // Click on QR code in footer to open modal
    const qrCode = page.locator('#footer-qr-canvas');
    await expect(qrCode).toBeVisible();
    await qrCode.click();
    
    // Wait for modal to open
    const qrModal = page.locator('.qr-fullscreen');
    await expect(qrModal).toBeVisible();
    
    // Check that modal has green border on wider screens
    const glowContainer = page.locator('.glow-container-mobile');
    await expect(glowContainer).toBeVisible();
    
    const containerStyles = await glowContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        boxShadow: styles.boxShadow,
        border: styles.border
      };
    });
    
    // On wider screens, should have green styling
    expect(containerStyles.width).not.toBe('768px'); // Should not be full width
    expect(containerStyles.boxShadow).not.toBe('none'); // Should have shadow
    expect(containerStyles.border).not.toContain('0px'); // Should have border
  });
  
  test('should handle viewport changes dynamically', async ({ page }) => {
    // Start with desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:8000/#/resources');
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    const qrCode = page.locator('#footer-qr-canvas');
    await qrCode.click();
    
    const glowContainer = page.locator('.glow-container-mobile');
    await expect(glowContainer).toBeVisible();
    
    // Check desktop styling
    let containerStyles = await glowContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        boxShadow: styles.boxShadow
      };
    });
    
    expect(containerStyles.boxShadow).not.toBe('none'); // Should have shadow on desktop
    
    // Change to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for styles to update
    await page.waitForTimeout(100);
    
    // Check mobile styling
    containerStyles = await glowContainer.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        boxShadow: styles.boxShadow
      };
    });
    
    expect(containerStyles.width).toBe('375px'); // Should be full width on mobile
    expect(containerStyles.boxShadow).toBe('none'); // Should have no shadow on mobile
  });
});
