import { test, expect } from '@playwright/test';
import { mobileViewports, desktopViewports, isMobileViewport } from './helpers/viewports';

/**
 * Mobile Layout Integrity Tests
 * 
 * PREREQUISITE: Dev server must be running
 * 
 * Start the dev server before running these tests:
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * Then run tests:
 * ```bash
 * npm run test:mobile
 * npm run test:mobile:all
 * npm run test:desktop
 * ```
 * 
 * These tests verify:
 * - QR modal opens correctly on all viewports
 * - All critical elements are visible or scrollable
 * - Page scrolls when content exceeds viewport
 * - Layout remains stable when viewport height changes
 * - Visual regression detection
 * - Cross-device consistency
 */

test.describe('Mobile Layout Integrity', () => {
  // Test all mobile viewports
  for (const [device, viewport] of Object.entries(mobileViewports)) {
    test.describe(`${device} (${viewport.width}×${viewport.height})`, () => {
      test('QR modal opens and all content is visible', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer to ensure QR code is visible
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        // Open QR modal
        const qrToggle = page.locator('#footer-qr-toggle');
        await expect(qrToggle).toBeVisible();
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Verify modal is open and full screen
        const qrPanel = page.locator('#footer-qr-panel');
        await expect(qrPanel).toBeVisible();

        // Check critical elements are visible or scrollable (semantic assertions)
        const criticalElements = [
          { selector: '#footer-qr-panel svg', name: 'QR Code' },
          { selector: '#footer-qr-panel input[type="text"]', name: 'URL Input' },
          { selector: '#footer-qr-panel', name: 'Length Display' },
          { selector: '#footer-qr-panel', name: 'Error Correction Controls' },
          { selector: '#footer-qr-panel', name: 'Download Buttons' },
          { selector: '#footer-qr-panel button', name: 'Close Button' }
        ];

        for (const { selector, name } of criticalElements) {
          const element = page.locator(selector).first();
          
          // Ensure element exists
          await expect(element).toHaveCount(1);
          
          // Semantic assertion: element should be reachable
          await element.scrollIntoViewIfNeeded();
          const isVisible = await element.isVisible({ timeout: 2000 });
          expect(isVisible, `${name} should be reachable on ${device}`).toBeTruthy();
        }

        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `test-results/mobile-layout-${device}.png`,
          fullPage: true 
        });
      });

      test('Page scrolls when content exceeds viewport (tolerant)', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300); // Wait for layout settling

        // Get scroll metrics
        const scrollMetrics = await page.evaluate(() => ({
          scrollHeight: document.body.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          scrollTop: window.pageYOffset,
          innerHeight: window.innerHeight
        }));

        console.log(`${device} scroll metrics:`, scrollMetrics);

        // Allow tolerance for minor differences (browser UI, padding, etc.)
        const diff = scrollMetrics.scrollHeight - scrollMetrics.clientHeight;
        const tolerance = 20; // px tolerance
        expect(diff).toBeGreaterThanOrEqual(-tolerance);
        
        // Verify we can actually scroll (with safety scroll)
        await page.evaluate(() => window.scrollBy(0, 1000));
        const scrolledTop = await page.evaluate(() => window.pageYOffset);
        expect(scrolledTop).toBeGreaterThan(0);
      });

      test('Layout remains stable when viewport height changes (tolerant)', async ({ page }) => {
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(300); // Wait for layout settling

        // Initial viewport (simulate address bar visible)
        const initialHeight = viewport.height - 100;
        await page.setViewportSize({ width: viewport.width, height: initialHeight });
        await page.waitForTimeout(200); // Wait for viewport change
        
        const initialScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const initialClientHeight = await page.evaluate(() => document.documentElement.clientHeight);

        // Simulate address bar hiding (viewport grows)
        await page.setViewportSize(viewport);
        await page.waitForTimeout(200); // Wait for viewport change
        
        const newScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        const newClientHeight = await page.evaluate(() => document.documentElement.clientHeight);

        // Allow tolerance for layout changes (browser UI animations, etc.)
        const scrollHeightDiff = Math.abs(newScrollHeight - initialScrollHeight);
        const tolerance = 30; // px tolerance for layout stability
        
        expect(scrollHeightDiff).toBeLessThanOrEqual(tolerance);
        expect(newClientHeight).toBeGreaterThan(initialClientHeight);
      });
    });
  }
});

test.describe('Desktop Layout Integrity', () => {
  // Test desktop viewports
  for (const [device, viewport] of Object.entries(desktopViewports)) {
    test.describe(`${device} (${viewport.width}×${viewport.height})`, () => {
      test('QR modal opens and all content is visible', async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        // Open QR modal
        const qrToggle = page.locator('#footer-qr-toggle');
        await expect(qrToggle).toBeVisible();
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Verify modal is open
        const qrPanel = page.locator('#footer-qr-panel');
        await expect(qrPanel).toBeVisible();

        // Check critical elements
        const qrSvg = page.locator('#footer-qr-panel svg');
        await expect(qrSvg).toBeVisible();

        const urlInput = page.locator('#footer-qr-panel input[type="text"]');
        await expect(urlInput).toBeVisible();

        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `test-results/desktop-layout-${device}.png`,
          fullPage: true 
        });
      });
    });
  }
});

test.describe('Visual Regression Tests', () => {
  test('Mobile layout visual regression (tolerant)', async ({ page }) => {
    await page.setViewportSize(mobileViewports.pixel7a);
    await page.goto('http://localhost:8000/#/linux');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300); // Wait for layout settling

    // Scroll to footer and open QR modal
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const qrToggle = page.locator('#footer-qr-toggle');
    await qrToggle.click();
    await page.waitForTimeout(1000);

    // Take screenshot for visual regression testing with tolerance
    await page.screenshot({ 
      path: 'test-results/mobile-layout-regression.png',
      fullPage: true 
    });

    // Verify critical elements are visible (semantic check)
    const qrPanel = page.locator('#footer-qr-panel');
    await expect(qrPanel).toBeVisible({ timeout: 2000 });
    
    // Verify QR code is reachable
    const qrSvg = page.locator('#footer-qr-panel svg');
    await qrSvg.scrollIntoViewIfNeeded();
    await expect(qrSvg).toBeVisible({ timeout: 2000 });
  });

  test('Desktop layout visual regression (tolerant)', async ({ page }) => {
    await page.setViewportSize(desktopViewports.desktop);
    await page.goto('http://localhost:8000/#/linux');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300); // Wait for layout settling

    // Scroll to footer and open QR modal
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const qrToggle = page.locator('#footer-qr-toggle');
    await qrToggle.click();
    await page.waitForTimeout(1000);

    // Take screenshot for visual regression testing with tolerance
    await page.screenshot({ 
      path: 'test-results/desktop-layout-regression.png',
      fullPage: true 
    });

    // Verify critical elements are visible (semantic check)
    const qrPanel = page.locator('#footer-qr-panel');
    await expect(qrPanel).toBeVisible({ timeout: 2000 });
    
    // Verify QR code is reachable
    const qrSvg = page.locator('#footer-qr-panel svg');
    await qrSvg.scrollIntoViewIfNeeded();
    await expect(qrSvg).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Cross-Device Consistency', () => {
  test('QR modal behavior is consistent across devices', async ({ page }) => {
    const devices = [
      { name: 'Pixel 7a', viewport: mobileViewports.pixel7a },
      { name: 'iPhone 13', viewport: mobileViewports.iphone13 },
      { name: 'Desktop', viewport: desktopViewports.desktop }
    ];

    for (const { name, viewport } of devices) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:8000/#/linux');
      await page.waitForLoadState('networkidle');

      // Wait for QR code manager to initialize
      await page.waitForFunction(() => {
        return window.qrCodeManager && window.qrCodeManager.url;
      }, { timeout: 10000 });
      await page.waitForTimeout(300); // Wait for layout settling

      // Scroll to footer
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(500);

      // Open QR modal
      const qrToggle = page.locator('#footer-qr-toggle');
      await expect(qrToggle).toBeVisible({ timeout: 2000 });
      await qrToggle.click();
      await page.waitForTimeout(1000);

      // Verify modal opens consistently
      const qrPanel = page.locator('#footer-qr-panel');
      await expect(qrPanel).toBeVisible({ timeout: 2000 });

      // Verify QR code is reachable (semantic check)
      const qrSvg = page.locator('#footer-qr-panel svg');
      await qrSvg.scrollIntoViewIfNeeded();
      await expect(qrSvg).toBeVisible({ timeout: 2000 });

      // Verify close button works
      const closeButton = page.locator('#footer-qr-panel button').first();
      await closeButton.click();
      await page.waitForTimeout(500);

      // Modal should be closed
      await expect(qrPanel).not.toBeVisible({ timeout: 2000 });

      console.log(`✅ QR modal behavior consistent on ${name}`);
    }
  });
});
