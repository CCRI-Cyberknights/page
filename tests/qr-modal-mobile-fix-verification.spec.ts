import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('QR Modal Mobile Fix Verification', () => {
  test('verify mobile viewport fix - 414x794 with 100dvh', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 794 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    
    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);
    
    // Get the actual rendered height using dvh
    const dvhInfo = await page.evaluate(() => {
      // Create a test element to measure 100dvh
      const testEl = document.createElement('div');
      testEl.style.height = '100dvh';
      testEl.style.position = 'absolute';
      testEl.style.visibility = 'hidden';
      document.body.appendChild(testEl);
      
      const dvhHeight = testEl.offsetHeight;
      document.body.removeChild(testEl);
      
      const modal = document.querySelector('.qr-fullscreen');
      const glowContainer = document.querySelector('.glow-container-mobile');
      const urlContainer = document.querySelector('[data-qr-panel="input"]');
      
      if (!modal || !glowContainer || !urlContainer) {
        return { error: 'Modal elements not found' };
      }
      
      const modalRect = modal.getBoundingClientRect();
      const glowRect = glowContainer.getBoundingClientRect();
      const urlRect = urlContainer.getBoundingClientRect();
      
      return {
        viewport: {
          innerHeight: window.innerHeight,
          dvhHeight: dvhHeight,
          difference: window.innerHeight - dvhHeight
        },
        modal: {
          height: modalRect.height,
          usesDvh: getComputedStyle(modal).height.includes('dvh') || getComputedStyle(modal).height === `${dvhHeight}px`
        },
        glowContainer: {
          height: glowRect.height,
          computedHeight: getComputedStyle(glowContainer).height,
          usesDvh: getComputedStyle(glowContainer).height.includes('dvh') || getComputedStyle(glowContainer).height === `${dvhHeight}px`
        },
        urlContainer: {
          bottom: urlRect.bottom,
          visible: urlRect.bottom <= window.innerHeight,
          clippedAtBottom: urlRect.bottom > window.innerHeight
        }
      };
    });
    
    console.log('Mobile DVH Fix Info:', JSON.stringify(dvhInfo, null, 2));
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/qr-modal-mobile-fix-414x794.png',
      fullPage: true 
    });
    
    // Verify the fix
    expect(dvhInfo.glowContainer.usesDvh).toBe(true);
    expect(dvhInfo.urlContainer.clippedAtBottom).toBe(false);
    expect(dvhInfo.urlContainer.visible).toBe(true);
  });

  test('verify desktop viewport still works - 1920x1080', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    
    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);
    
    // Verify desktop layout still works
    const desktopInfo = await page.evaluate(() => {
      const qrDisplay = document.querySelector('[data-qr-panel="display"]');
      const urlContainer = document.querySelector('[data-qr-panel="input"]');
      const advancedPanel = document.querySelector('[data-qr-panel="advanced"]');
      
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
        },
        advancedPanel: {
          exists: !!advancedPanel,
          visible: advancedPanel ? getComputedStyle(advancedPanel).display !== 'none' : false
        }
      };
    });
    
    console.log('Desktop Layout Info:', JSON.stringify(desktopInfo, null, 2));
    
    // Desktop should work perfectly
    expect(desktopInfo.qrDisplay.visible).toBe(true);
    expect(desktopInfo.urlContainer.visible).toBe(true);
    expect(desktopInfo.urlContainer.clippedAtBottom).toBe(false);
    expect(desktopInfo.advancedPanel.visible).toBe(true); // Advanced controls should be visible on desktop
    
    // Take screenshot for comparison
    await page.screenshot({ 
      path: 'test-results/qr-modal-desktop-1920x1080-after-fix.png',
      fullPage: true 
    });
  });
});
