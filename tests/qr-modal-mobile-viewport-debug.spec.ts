import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('QR Modal Mobile Viewport Debug', () => {
  test('capture mobile viewport layout issue - 414x794', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 794 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    
    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);
    
    // Take screenshot of the entire page
    await page.screenshot({ 
      path: 'test-results/qr-modal-mobile-414x794-debug.png',
      fullPage: true 
    });
    
    // Get detailed layout information
    const layoutInfo = await page.evaluate(() => {
      const modal = document.querySelector('.qr-fullscreen');
      const qrDisplay = document.querySelector('[data-qr-panel="display"]');
      const urlContainer = document.querySelector('[data-qr-panel="input"]');
      
      if (!modal || !qrDisplay || !urlContainer) {
        return { error: 'Modal elements not found' };
      }
      
      const modalRect = modal.getBoundingClientRect();
      const qrRect = qrDisplay.getBoundingClientRect();
      const urlRect = urlContainer.getBoundingClientRect();
      
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        modal: {
          top: modalRect.top,
          bottom: modalRect.bottom,
          height: modalRect.height,
          width: modalRect.width
        },
        qrDisplay: {
          top: qrRect.top,
          bottom: qrRect.bottom,
          height: qrRect.height,
          width: qrRect.width,
          visible: qrRect.top >= 0 && qrRect.bottom <= window.innerHeight
        },
        urlContainer: {
          top: urlRect.top,
          bottom: urlRect.bottom,
          height: urlRect.height,
          width: urlRect.width,
          visible: urlRect.top >= 0 && urlRect.bottom <= window.innerHeight,
          clippedAtBottom: urlRect.bottom > window.innerHeight
        }
      };
    });
    
    console.log('Mobile Viewport Layout Debug Info:', JSON.stringify(layoutInfo, null, 2));
    
    // Verify URL container is not clipped
    expect(layoutInfo.urlContainer.clippedAtBottom).toBe(false);
    expect(layoutInfo.urlContainer.visible).toBe(true);
    
    // Verify QR display is visible
    expect(layoutInfo.qrDisplay.visible).toBe(true);
  });

  test('capture desktop viewport for comparison - 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    
    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);
    
    // Take screenshot for comparison
    await page.screenshot({ 
      path: 'test-results/qr-modal-desktop-1920x1080-comparison.png',
      fullPage: true 
    });
    
    // Verify both elements are visible on desktop
    const layoutInfo = await page.evaluate(() => {
      const qrDisplay = document.querySelector('[data-qr-panel="display"]');
      const urlContainer = document.querySelector('[data-qr-panel="input"]');
      
      if (!qrDisplay || !urlContainer) {
        return { error: 'Modal elements not found' };
      }
      
      const qrRect = qrDisplay.getBoundingClientRect();
      const urlRect = urlContainer.getBoundingClientRect();
      
      return {
        qrDisplay: {
          visible: qrRect.top >= 0 && qrRect.bottom <= window.innerHeight
        },
        urlContainer: {
          visible: urlRect.top >= 0 && urlRect.bottom <= window.innerHeight,
          clippedAtBottom: urlRect.bottom > window.innerHeight
        }
      };
    });
    
    // Desktop should work fine
    expect(layoutInfo.qrDisplay.visible).toBe(true);
    expect(layoutInfo.urlContainer.visible).toBe(true);
    expect(layoutInfo.urlContainer.clippedAtBottom).toBe(false);
  });
});
