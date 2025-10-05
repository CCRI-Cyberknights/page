import { test, expect } from '@playwright/test';

/**
 * DOM Structure Diagnostic Test
 * 
 * This test opens the QR modal and inspects the DOM hierarchy
 * to identify if the modal is mounted at the correct level.
 */
test.describe('DOM Structure Diagnostic', () => {
  test('Inspect QR modal DOM hierarchy', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 862 });
    await page.goto('http://localhost:8000/#/linux');
    await page.waitForLoadState('networkidle');

    // Wait for QR code manager to initialize
    await page.waitForFunction(() => {
      return window.qrCodeManager && window.qrCodeManager.url;
    }, { timeout: 10000 });

    // Scroll to footer and open QR modal
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);

    const qrToggle = page.locator('#footer-qr-toggle');
    await qrToggle.click();
    await page.waitForTimeout(1000);

    // Get DOM structure analysis
    const domAnalysis = await page.evaluate(() => {
      const modal = document.querySelector('#footer-qr-panel.qr-fullscreen');
      const body = document.body;
      const main = document.querySelector('main');
      
      return {
        modalExists: !!modal,
        modalParent: modal?.parentElement?.tagName,
        modalParentId: modal?.parentElement?.id,
        modalParentClasses: modal?.parentElement?.className,
        bodyChildren: Array.from(body.children).map(el => ({
          tagName: el.tagName,
          id: el.id,
          className: el.className
        })),
        modalPosition: modal ? {
          position: window.getComputedStyle(modal).position,
          zIndex: window.getComputedStyle(modal).zIndex,
          top: window.getComputedStyle(modal).top,
          left: window.getComputedStyle(modal).left,
          right: window.getComputedStyle(modal).right,
          bottom: window.getComputedStyle(modal).bottom
        } : null,
        modalRect: modal ? modal.getBoundingClientRect() : null,
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });

    console.log('DOM Analysis:', JSON.stringify(domAnalysis, null, 2));

    // Take screenshot for visual inspection
    await page.screenshot({ 
      path: `test-results/dom-structure-analysis.png`,
      fullPage: true 
    });

    // Verify modal exists and is positioned correctly
    expect(domAnalysis.modalExists).toBe(true);
    expect(domAnalysis.modalPosition?.position).toBe('fixed');
    
    // Check if modal spans full viewport
    if (domAnalysis.modalRect) {
      const rect = domAnalysis.modalRect;
      const viewport = domAnalysis.viewportSize;
      
      console.log(`Modal rect: ${rect.width}×${rect.height} at (${rect.left}, ${rect.top})`);
      console.log(`Viewport: ${viewport.width}×${viewport.height}`);
      
      // Modal should span full viewport
      expect(rect.width).toBeCloseTo(viewport.width, 10);
      expect(rect.height).toBeCloseTo(viewport.height, 10);
      expect(rect.left).toBeCloseTo(0, 10);
      expect(rect.top).toBeCloseTo(0, 10);
    }
  });
});

