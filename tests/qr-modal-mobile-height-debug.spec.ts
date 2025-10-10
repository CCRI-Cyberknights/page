import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('QR Modal Mobile Height Debug', () => {
  test('debug mobile viewport height issue - 414x794', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 794 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    
    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);
    
    // Get detailed height information
    const heightInfo = await page.evaluate(() => {
      const modal = document.querySelector('.qr-fullscreen');
      const glowContainer = document.querySelector('.glow-container-mobile');
      const qrDisplay = document.querySelector('[data-qr-panel="display"]');
      const urlContainer = document.querySelector('[data-qr-panel="input"]');
      
      if (!modal || !glowContainer || !qrDisplay || !urlContainer) {
        return { error: 'Modal elements not found' };
      }
      
      const modalRect = modal.getBoundingClientRect();
      const glowRect = glowContainer.getBoundingClientRect();
      const qrRect = qrDisplay.getBoundingClientRect();
      const urlRect = urlContainer.getBoundingClientRect();
      
      return {
        viewport: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          visualViewportHeight: window.visualViewport ? window.visualViewport.height : 'N/A'
        },
        modal: {
          computedHeight: getComputedStyle(modal).height,
          boundingHeight: modalRect.height,
          top: modalRect.top,
          bottom: modalRect.bottom
        },
        glowContainer: {
          computedHeight: getComputedStyle(glowContainer).height,
          boundingHeight: glowRect.height,
          top: glowRect.top,
          bottom: glowRect.bottom,
          cssHeight: getComputedStyle(glowContainer).height,
          cssMaxHeight: getComputedStyle(glowContainer).maxHeight
        },
        qrDisplay: {
          boundingHeight: qrRect.height,
          top: qrRect.top,
          bottom: qrRect.bottom,
          cssHeight: getComputedStyle(qrDisplay).height
        },
        urlContainer: {
          boundingHeight: urlRect.height,
          top: urlRect.top,
          bottom: urlRect.bottom,
          cssHeight: getComputedStyle(urlContainer).height,
          distanceFromBottom: window.innerHeight - urlRect.bottom
        },
        overflow: {
          modalOverflows: modalRect.bottom > window.innerHeight,
          glowOverflows: glowRect.bottom > window.innerHeight,
          urlOverflows: urlRect.bottom > window.innerHeight
        }
      };
    });
    
    console.log('Mobile Height Debug Info:', JSON.stringify(heightInfo, null, 2));
    
    // Log key issues
    if (heightInfo.overflow.urlOverflows) {
      console.log('❌ URL container overflows viewport!');
      console.log(`   URL bottom: ${heightInfo.urlContainer.bottom}`);
      console.log(`   Viewport height: ${heightInfo.viewport.innerHeight}`);
      console.log(`   Distance from bottom: ${heightInfo.urlContainer.distanceFromBottom}`);
    }
    
    if (heightInfo.overflow.glowOverflows) {
      console.log('❌ Glow container overflows viewport!');
      console.log(`   Glow bottom: ${heightInfo.glowContainer.bottom}`);
      console.log(`   Viewport height: ${heightInfo.viewport.innerHeight}`);
    }
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/qr-modal-mobile-height-debug.png',
      fullPage: true 
    });
    
    // The test should fail if there's overflow
    expect(heightInfo.overflow.urlOverflows).toBe(false);
    expect(heightInfo.overflow.glowOverflows).toBe(false);
  });
});
