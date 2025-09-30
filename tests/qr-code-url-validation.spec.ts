import { test, expect } from '@playwright/test';

// Test URLs that represent different SPA routes
const TEST_ROUTES = [
  { route: '#/home', expectedUrl: 'https://ccri-cyberknights.github.io/page/#/home' },
  { route: '#/guides/linux-cheatsheet-1.html', expectedUrl: 'https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-1.html' },
  { route: '#/guides/linux-cheatsheet-2.html', expectedUrl: 'https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-2.html' },
  { route: '#/guides/linux-cheatsheet-3.html', expectedUrl: 'https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html' },
  { route: '#/resources', expectedUrl: 'https://ccri-cyberknights.github.io/page/#/resources' },
  { route: '#/calendar', expectedUrl: 'https://ccri-cyberknights.github.io/page/#/calendar' }
];

test.describe('Footer QR URL validation', () => {
  const baseUrl = 'https://ccri-cyberknights.github.io/page';

  test('initial load and navigation update the QR', async ({ page }) => {
    // Test initial load on first route
    await page.goto(`${baseUrl}${TEST_ROUTES[0].route}`);

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.currentUrl;
    }, { timeout: 10000 });

    const qrContainer = page.locator('#footer-qr-canvas').locator('..');
    
    // Wait for QR code to be rendered and visible
    await page.waitForTimeout(200);
    
    // Check data-generated-url attribute for fast validation
    const generated = await qrContainer.getAttribute('data-generated-url');
    expect(generated).toBe(TEST_ROUTES[0].expectedUrl);

    // Now navigate through routes and assert update
    for (const { route, expectedUrl } of TEST_ROUTES) {
      await page.evaluate((r) => { location.href = r; }, `${baseUrl}${route}`);
      
      // Wait for debounced update (80ms + buffer)
      await page.waitForTimeout(120);
      
      const attr = await qrContainer.getAttribute('data-generated-url');
      expect(attr).toBe(expectedUrl);
      
      console.log(`✅ Route ${route}: QR URL correctly set to ${attr}`);
    }
  });

  test('QR code manager responds to hashchange events', async ({ page }) => {
    await page.goto(`${baseUrl}#/home`);
    await page.waitForLoadState('networkidle');
    
    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.currentUrl;
    }, { timeout: 10000 });
    
    const qrContainer = page.locator('#footer-qr-canvas').locator('..');
    
    // Wait for QR code to be rendered
    await page.waitForTimeout(200);
    
    // Verify initial state
    let generated = await qrContainer.getAttribute('data-generated-url');
    expect(generated).toBe(`${baseUrl}/#/home`);
    
    // Simulate hashchange event
    await page.evaluate(() => {
      window.location.hash = '#/guides/linux-cheatsheet-3.html';
    });
    
    // Wait for debounced update
    await page.waitForTimeout(120);
    
    // Verify URL updated
    generated = await qrContainer.getAttribute('data-generated-url');
    expect(generated).toBe(`${baseUrl}/#/guides/linux-cheatsheet-3.html`);
    
    console.log('✅ QR code manager correctly responds to hashchange events');
  });

  test('QR code manager handles History API navigation', async ({ page }) => {
    await page.goto(`${baseUrl}#/home`);
    await page.waitForLoadState('networkidle');
    
    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.currentUrl;
    }, { timeout: 10000 });
    
    const qrContainer = page.locator('#footer-qr-canvas').locator('..');
    
    // Wait for QR code to be rendered
    await page.waitForTimeout(200);
    
    // Verify initial state
    let generated = await qrContainer.getAttribute('data-generated-url');
    expect(generated).toBe(`${baseUrl}/#/home`);
    
    // Simulate History API navigation
    await page.evaluate(() => {
      history.pushState(null, '', '#/resources');
    });
    
    // Wait for debounced update
    await page.waitForTimeout(120);
    
    // Verify URL updated
    generated = await qrContainer.getAttribute('data-generated-url');
    expect(generated).toBe(`${baseUrl}/#/resources`);
    
    console.log('✅ QR code manager correctly handles History API navigation');
  });

  test('URL normalization handles trailing slashes correctly', async ({ page }) => {
    // Test with trailing slash in base URL
    await page.goto(`${baseUrl}/#/home`);
    await page.waitForLoadState('networkidle');
    
    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.currentUrl;
    }, { timeout: 10000 });
    
    const qrContainer = page.locator('#footer-qr-canvas').locator('..');
    
    // Wait for QR code to be rendered
    await page.waitForTimeout(200);
    
    const generated = await qrContainer.getAttribute('data-generated-url');
    
    // Should normalize trailing slash
    expect(generated).toBe(`${baseUrl}/#/home`);
    
    console.log('✅ URL normalization handles trailing slashes correctly');
  });

  test('QR code manager handles query strings and fragments', async ({ page }) => {
    // Test with query string
    await page.goto(`${baseUrl}/#/resources?filter=linux`);
    await page.waitForLoadState('networkidle');
    
    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.currentUrl;
    }, { timeout: 10000 });
    
    const qrContainer = page.locator('#footer-qr-canvas').locator('..');
    
    // Wait for QR code to be rendered
    await page.waitForTimeout(200);
    
    const generated = await qrContainer.getAttribute('data-generated-url');
    
    // Should preserve query string
    expect(generated).toBe(`${baseUrl}/#/resources?filter=linux`);
    
    console.log('✅ QR code manager preserves query strings correctly');
  });
});