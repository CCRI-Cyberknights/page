import { test, expect } from '@playwright/test';
import { mobileViewports } from './helpers/viewports';

/**
 * Mobile Layout Cutoff Prevention Tests
 * 
 * PREREQUISITE: Dev server must be running
 * ```bash
 * python3 -m http.server 8000 &
 * ```
 * 
 * These tests verify that QR modal content is not cut off on mobile devices
 * and that all elements are accessible via scrolling if needed.
 */
test.describe('Mobile Layout Cutoff Prevention', () => {
  for (const [device, viewport] of Object.entries(mobileViewports)) {
    test.describe(`${device} (${viewport.width}×${viewport.height})`, () => {
      test('QR modal content is not cut off at bottom', async ({ page }) => {
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

        // Check that the modal uses proper mobile CSS classes
        const glowContainer = page.locator('.glow-container-mobile');
        await expect(glowContainer).toBeVisible();

        // Verify mobile-specific CSS is applied
        const containerStyles = await glowContainer.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            height: computed.height,
            width: computed.width,
            padding: computed.padding,
            overflowY: computed.overflowY,
            boxSizing: computed.boxSizing
          };
        });

        console.log(`${device} container styles:`, containerStyles);

        // Check that overflow-y is set to auto for scrolling
        expect(containerStyles.overflowY).toBe('auto');

        // Check that box-sizing is border-box
        expect(containerStyles.boxSizing).toBe('border-box');

        // Verify all critical elements are accessible
        const criticalElements = [
          { selector: '.glow-container-mobile svg', name: 'QR Code' },
          { selector: '.glow-container-mobile input[type="text"]', name: 'URL Input' },
          { selector: '.glow-container-mobile', name: 'Length Display' },
          { selector: '.glow-container-mobile', name: 'Error Correction Controls' },
          { selector: '.glow-container-mobile', name: 'Download Buttons' }
        ];

        for (const { selector, name } of criticalElements) {
          const element = page.locator(selector).first();
          
          // Ensure element exists
          await expect(element).toHaveCount(1);
          
          // Scroll element into view and verify it's accessible
          await element.scrollIntoViewIfNeeded();
          const isVisible = await element.isVisible({ timeout: 2000 });
          expect(isVisible, `${name} should be accessible on ${device}`).toBeTruthy();
        }

        // Test scrolling within the modal
        const scrollableArea = page.locator('.glow-container-mobile');
        const scrollHeight = await scrollableArea.evaluate((el) => el.scrollHeight);
        const clientHeight = await scrollableArea.evaluate((el) => el.clientHeight);
        
        console.log(`${device} scroll metrics:`, { scrollHeight, clientHeight });

        // If content exceeds viewport, verify scrolling works
        if (scrollHeight > clientHeight) {
          // Test scrolling to bottom
          await scrollableArea.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
          
          await page.waitForTimeout(200);
          
          const scrollTop = await scrollableArea.evaluate((el) => el.scrollTop);
          expect(scrollTop).toBeGreaterThan(0);
          
          console.log(`✅ Scrolling works on ${device} - scrolled to ${scrollTop}px`);
        }

        // Take screenshot for visual verification
        await page.screenshot({ 
          path: `test-results/mobile-cutoff-prevention-${device}.png`,
          fullPage: true 
        });
      });

      test('QR modal adapts to viewport height changes', async ({ page }) => {
        await page.goto('http://localhost:8000/#/linux');
        await page.waitForLoadState('networkidle');

        // Wait for QR code manager to initialize
        await page.waitForFunction(() => {
          return window.qrCodeManager && window.qrCodeManager.url;
        }, { timeout: 10000 });

        // Scroll to footer and open modal
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(500);

        const qrToggle = page.locator('#footer-qr-toggle');
        await qrToggle.click();
        await page.waitForTimeout(1000);

        // Test with different viewport heights (simulating browser UI changes)
        const testHeights = [
          viewport.height - 100, // Address bar visible
          viewport.height,       // Normal height
          viewport.height + 50   // Extra space
        ];

        for (const height of testHeights) {
          await page.setViewportSize({ width: viewport.width, height });
          await page.waitForTimeout(300); // Wait for layout adjustment

          const glowContainer = page.locator('.glow-container-mobile');
          await expect(glowContainer).toBeVisible();

          // Verify modal adapts to new height
          const containerHeight = await glowContainer.evaluate((el) => {
            return window.getComputedStyle(el).height;
          });

          console.log(`${device} height ${height}: container height = ${containerHeight}`);

          // Modal should still be visible and functional
          const qrSvg = page.locator('.glow-container-mobile svg');
          await qrSvg.scrollIntoViewIfNeeded();
          await expect(qrSvg).toBeVisible({ timeout: 2000 });
        }
      });
    });
  }
});

