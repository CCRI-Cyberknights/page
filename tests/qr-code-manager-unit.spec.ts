// tests/qr-code-manager-unit.spec.ts
// Unit tests for QRCodeManager logic with mocked events
// Complements Playwright integration tests

import { test, expect } from '@playwright/test';

test.describe('QRCodeManager Unit Tests', () => {
  test('QRCodeManager constructor initializes correctly', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Check if QRCodeManager exists and has expected properties
    const qrManagerInfo = await page.evaluate(() => {
      if (!window.qrCodeManager) return null;
      
      return {
        hasUrl: typeof window.qrCodeManager.url !== 'undefined',
        hasEclLevels: Array.isArray(window.qrCodeManager.ECL_LEVELS),
        hasEclIndex: typeof window.qrCodeManager.eclIndex === 'number',
        hasSetupRouterEvents: typeof window.qrCodeManager.setupRouterEvents === 'function',
        hasSetupEventListeners: typeof window.qrCodeManager.setupEventListeners === 'function',
        hasRender: typeof window.qrCodeManager.render === 'function'
      };
    });
    
    expect(qrManagerInfo).not.toBeNull();
    expect(qrManagerInfo.hasUrl).toBe(true);
    expect(qrManagerInfo.hasEclLevels).toBe(true);
    expect(qrManagerInfo.hasEclIndex).toBe(true);
    expect(qrManagerInfo.hasSetupRouterEvents).toBe(true);
    expect(qrManagerInfo.hasSetupEventListeners).toBe(true);
    expect(qrManagerInfo.hasRender).toBe(true);
    
    console.log('✅ QRCodeManager constructor initializes correctly');
  });

  test('QRCodeManager handles hashchange events', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for QRCodeManager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });
    
    // Get initial URL
    const initialUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(initialUrl).toBe('https://ccri-cyberknights.github.io/page/#/home');
    
    // Simulate hashchange event
    await page.evaluate(() => {
      window.location.hash = '#/guides/linux-cheatsheet-3.html';
    });
    
    // Wait for event to be processed
    await page.waitForTimeout(200);
    
    // Check if URL was updated
    const updatedUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(updatedUrl).toBe('https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html');
    
    console.log('✅ QRCodeManager handles hashchange events correctly');
  });

  test('QRCodeManager handles popstate events', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for QRCodeManager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });
    
    // Get initial URL
    const initialUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(initialUrl).toBe('https://ccri-cyberknights.github.io/page/#/home');
    
    // Simulate popstate event (browser back/forward)
    await page.evaluate(() => {
      history.pushState(null, '', '#/resources');
      // Trigger popstate by going back
      history.back();
    });
    
    // Wait for event to be processed
    await page.waitForTimeout(200);
    
    // Check if URL was updated
    const updatedUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(updatedUrl).toBe('https://ccri-cyberknights.github.io/page/#/home');
    
    console.log('✅ QRCodeManager handles popstate events correctly');
  });

  test('QRCodeManager handles pushState/replaceState wrapping', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for QRCodeManager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });
    
    // Get initial URL
    const initialUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(initialUrl).toBe('https://ccri-cyberknights.github.io/page/#/home');
    
    // Test pushState wrapping
    await page.evaluate(() => {
      history.pushState(null, '', '#/guides/linux-cheatsheet-3.html');
    });
    
    // Wait for event to be processed
    await page.waitForTimeout(200);
    
    // Check if URL was updated
    const pushStateUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(pushStateUrl).toBe('https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html');
    
    // Test replaceState wrapping
    await page.evaluate(() => {
      history.replaceState(null, '', '#/resources');
    });
    
    // Wait for event to be processed
    await page.waitForTimeout(200);
    
    // Check if URL was updated
    const replaceStateUrl = await page.evaluate(() => {
      return window.qrCodeManager ? window.qrCodeManager.url : null;
    });
    
    expect(replaceStateUrl).toBe('https://ccri-cyberknights.github.io/page/#/resources');
    
    console.log('✅ QRCodeManager handles pushState/replaceState wrapping correctly');
  });

  test('QRCodeManager ECL levels are correctly configured', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for QRCodeManager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.ECL_LEVELS;
    }, { timeout: 10000 });
    
    const eclInfo = await page.evaluate(() => {
      if (!window.qrCodeManager) return null;
      
      return {
        levels: window.qrCodeManager.ECL_LEVELS,
        currentIndex: window.qrCodeManager.eclIndex,
        currentLevel: window.qrCodeManager.ECL_LEVELS[window.qrCodeManager.eclIndex]
      };
    });
    
    expect(eclInfo).not.toBeNull();
    expect(eclInfo.levels).toEqual(['L', 'M', 'Q', 'H']);
    expect(eclInfo.currentIndex).toBe(1); // Default 'M'
    expect(eclInfo.currentLevel).toBe('M');
    
    console.log('✅ QRCodeManager ECL levels are correctly configured');
  });

  test('QRCodeManager input field updates on URL changes', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Wait for QRCodeManager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });
    
    // Get initial input value
    const initialInputValue = await page.evaluate(() => {
      const input = document.getElementById('footer-qr-input');
      return input ? input.value : null;
    });
    
    expect(initialInputValue).toBe('https://ccri-cyberknights.github.io/page/#/home');
    
    // Simulate hashchange event
    await page.evaluate(() => {
      window.location.hash = '#/guides/linux-cheatsheet-3.html';
    });
    
    // Wait for event to be processed
    await page.waitForTimeout(200);
    
    // Check if input field was updated
    const updatedInputValue = await page.evaluate(() => {
      const input = document.getElementById('footer-qr-input');
      return input ? input.value : null;
    });
    
    expect(updatedInputValue).toBe('https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html');
    
    console.log('✅ QRCodeManager input field updates on URL changes');
  });
});
