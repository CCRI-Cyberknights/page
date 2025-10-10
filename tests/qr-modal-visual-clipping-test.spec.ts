import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('QR Modal Visual Clipping Test', () => {
  test('capture modal-only screenshot for OpenCV analysis - 414x794', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 794 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    
    // Wait for modal to be fully rendered
    await page.waitForTimeout(1000);
    
    // Take screenshot of just the modal area (not full page)
    await page.screenshot({ 
      path: 'test-results/qr-modal-only-414x794.png',
      clip: { x: 0, y: 0, width: 414, height: 794 }
    });
    
    // Get the modal element and screenshot it specifically
    const modalElement = await page.locator('.qr-fullscreen');
    await modalElement.screenshot({ 
      path: 'test-results/qr-modal-element-414x794.png' 
    });
    
    // Get detailed positioning info
    const modalInfo = await page.evaluate(() => {
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
          width: window.innerWidth,
          height: window.innerHeight
        },
        modal: {
          boundingRect: {
            x: modalRect.x,
            y: modalRect.y,
            width: modalRect.width,
            height: modalRect.height,
            top: modalRect.top,
            right: modalRect.right,
            bottom: modalRect.bottom,
            left: modalRect.left
          },
          computedStyle: {
            height: getComputedStyle(modal).height,
            width: getComputedStyle(modal).width,
            position: getComputedStyle(modal).position,
            top: getComputedStyle(modal).top,
            left: getComputedStyle(modal).left,
            right: getComputedStyle(modal).right,
            bottom: getComputedStyle(modal).bottom
          }
        },
        glowContainer: {
          boundingRect: {
            x: glowRect.x,
            y: glowRect.y,
            width: glowRect.width,
            height: glowRect.height,
            top: glowRect.top,
            right: glowRect.right,
            bottom: glowRect.bottom,
            left: glowRect.left
          },
          computedStyle: {
            height: getComputedStyle(glowContainer).height,
            width: getComputedStyle(glowContainer).width,
            padding: getComputedStyle(glowContainer).padding,
            boxSizing: getComputedStyle(glowContainer).boxSizing
          }
        },
        qrDisplay: {
          boundingRect: {
            x: qrRect.x,
            y: qrRect.y,
            width: qrRect.width,
            height: qrRect.height,
            top: qrRect.top,
            right: qrRect.right,
            bottom: qrRect.bottom,
            left: qrRect.left
          }
        },
        urlContainer: {
          boundingRect: {
            x: urlRect.x,
            y: urlRect.y,
            width: urlRect.width,
            height: urlRect.height,
            top: urlRect.top,
            right: urlRect.right,
            bottom: urlRect.bottom,
            left: urlRect.left
          },
          computedStyle: {
            position: getComputedStyle(urlContainer).position,
            bottom: getComputedStyle(urlContainer).bottom
          }
        }
      };
    });
    
    console.log('Detailed Modal Info:', JSON.stringify(modalInfo, null, 2));
    
    // Save the info to a file for analysis
    await page.evaluate((info) => {
      const blob = new Blob([JSON.stringify(info, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modal-info-414x794.json';
      a.click();
      URL.revokeObjectURL(url);
    }, modalInfo);
  });
});
