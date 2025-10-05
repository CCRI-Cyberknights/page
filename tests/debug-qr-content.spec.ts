import { test, expect } from '@playwright/test';

/**
 * QR Code Content Diagnostic Test
 * 
 * This test checks what's actually inside the QR modal
 * to see why the QR code isn't being created.
 */
test.describe('QR Code Content Diagnostic', () => {
  test('Inspect QR modal content structure', async ({ page }) => {
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

    // Get content analysis
    const contentAnalysis = await page.evaluate(() => {
      const modal = document.querySelector('#footer-qr-panel.qr-fullscreen');
      const dialog = document.querySelector('.qr-dialog');
      const svg = document.querySelector('.qr-fullscreen svg');
      const canvas = document.querySelector('.qr-fullscreen canvas');
      
      return {
        modalExists: !!modal,
        dialogExists: !!dialog,
        svgExists: !!svg,
        canvasExists: !!canvas,
        modalChildren: modal ? Array.from(modal.children).map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id
        })) : [],
        dialogChildren: dialog ? Array.from(dialog.children).map(el => ({
          tagName: el.tagName,
          className: el.className,
          id: el.id
        })) : [],
        modalComputedStyle: modal ? {
          backgroundColor: window.getComputedStyle(modal).backgroundColor,
          opacity: window.getComputedStyle(modal).opacity,
          backdropFilter: window.getComputedStyle(modal).backdropFilter
        } : null
      };
    });

    console.log('Content Analysis:', JSON.stringify(contentAnalysis, null, 2));

    // Take screenshot for visual inspection
    await page.screenshot({ 
      path: `test-results/qr-content-analysis.png`,
      fullPage: true 
    });

    // Verify modal and dialog exist
    expect(contentAnalysis.modalExists).toBe(true);
    expect(contentAnalysis.dialogExists).toBe(true);
    
    // Check if QR code exists (either SVG or canvas)
    const qrCodeExists = contentAnalysis.svgExists || contentAnalysis.canvasExists;
    expect(qrCodeExists).toBe(true);
  });
});

