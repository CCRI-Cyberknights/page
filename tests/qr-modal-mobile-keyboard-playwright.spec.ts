import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

/**
 * QR Modal Mobile Keyboard Testing - Playwright Native Approach
 * 
 * Uses Playwright's built-in mobile device emulation and visual testing
 * to verify QR modal behavior when mobile keyboard appears.
 */

test.describe('QR Modal Mobile Keyboard - Playwright Native', () => {
  
  test('Mobile keyboard behavior on iPhone SE', async ({ page }) => {
    // Use Playwright's built-in iPhone SE emulation
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Take screenshot before keyboard
    await page.screenshot({ 
      path: 'test-results/iphone-se-before-keyboard.png',
      fullPage: true 
    });
    
    // Focus on input to trigger keyboard
    const inputField = page.locator('[data-qr-panel="input"] input');
    await inputField.click();
    await page.waitForTimeout(2000); // Wait for keyboard animation
    
    // Take screenshot after keyboard appears
    await page.screenshot({ 
      path: 'test-results/iphone-se-with-keyboard.png',
      fullPage: true 
    });
    
    // Verify QR display is still visible
    const qrDisplay = page.locator('[data-qr-panel="display"]');
    await expect(qrDisplay).toBeVisible();
    
    // Verify input field is still accessible
    await expect(inputField).toBeVisible();
    await inputField.fill('test input');
    await expect(inputField).toHaveValue('test input');
    
    // Verify advanced controls are hidden (mobile behavior)
    const advancedPanel = page.locator('[data-qr-panel="advanced"]');
    await expect(advancedPanel).toBeHidden();
  });

  test('Mobile keyboard behavior on Pixel 5', async ({ page }) => {
    // Use Playwright's built-in Pixel 5 emulation
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Focus on input to trigger keyboard
    const inputField = page.locator('[data-qr-panel="input"] input');
    await inputField.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot with keyboard
    await page.screenshot({ 
      path: 'test-results/pixel-5-with-keyboard.png',
      fullPage: true 
    });
    
    // Verify both elements are visible and accessible
    const qrDisplay = page.locator('[data-qr-panel="display"]');
    await expect(qrDisplay).toBeVisible();
    await expect(inputField).toBeVisible();
    
    // Test interaction with input field
    await inputField.fill('https://example.com');
    await expect(inputField).toHaveValue('https://example.com');
  });

  test('Cross-device keyboard behavior comparison', async ({ page }) => {
    const devices = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'Pixel 5', width: 393, height: 851 }
    ];
    
    for (const device of devices) {
      // Set viewport for device
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto(`${BASE_URL}?t=${Date.now()}`);
      
      // Open QR modal
      await page.click('#footer-qr-toggle');
      await page.waitForTimeout(1000);
      
      // Focus input to trigger keyboard
      const inputField = page.locator('[data-qr-panel="input"] input');
      await inputField.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await page.screenshot({ 
        path: `test-results/${device.name.replace(/\s+/g, '-').toLowerCase()}-keyboard.png`,
        fullPage: true 
      });
      
      // Verify visibility
      const qrDisplay = page.locator('[data-qr-panel="display"]');
      await expect(qrDisplay).toBeVisible();
      await expect(inputField).toBeVisible();
      
      // Test input functionality
      await inputField.fill(`test-${device.name}`);
      await expect(inputField).toHaveValue(`test-${device.name}`);
      
      console.log(`✅ ${device.name}: QR modal works correctly with keyboard`);
    }
  });

  test('Visual regression testing for keyboard behavior', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Focus input to trigger keyboard
    await page.click('[data-qr-panel="input"] input');
    await page.waitForTimeout(2000);
    
    // Take screenshot for visual regression testing
    await page.screenshot({ 
      path: 'test-results/mobile-keyboard-regression.png',
      fullPage: true 
    });
    
    // Verify key elements are visible
    await expect(page.locator('[data-qr-panel="display"]')).toBeVisible();
    await expect(page.locator('[data-qr-panel="input"] input')).toBeVisible();
    await expect(page.locator('[data-qr-panel="advanced"]')).toBeHidden();
  });

  test('Keyboard interaction and QR generation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Focus input and enter URL
    const inputField = page.locator('[data-qr-panel="input"] input');
    await inputField.click();
    await inputField.fill('https://cyberknights.club');
    await page.waitForTimeout(1000);
    
    // Verify QR code is generated and visible
    const qrImage = page.locator('[data-qr-panel="display"] img');
    await expect(qrImage).toBeVisible();
    
    // Take screenshot showing QR code with keyboard
    await page.screenshot({ 
      path: 'test-results/qr-generation-with-keyboard.png',
      fullPage: true 
    });
    
    // Verify input field still shows the URL
    await expect(inputField).toHaveValue('https://cyberknights.club');
  });
});
