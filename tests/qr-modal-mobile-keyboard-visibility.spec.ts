import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

/**
 * Mobile Keyboard Visibility Test Suite
 * 
 * Tests that QR modal remains fully visible when mobile keyboard appears
 * across different device types using Playwright device emulation and OpenCV analysis
 */

// Device configurations for comprehensive testing
const MOBILE_DEVICES = {
  'iPhone SE': { width: 375, height: 667, pixelRatio: 2 },
  'iPhone 12': { width: 390, height: 844, pixelRatio: 3 },
  'iPhone 12 Pro Max': { width: 428, height: 926, pixelRatio: 3 },
  'Pixel 5': { width: 393, height: 851, pixelRatio: 2.75 },
  'Pixel 7': { width: 412, height: 915, pixelRatio: 2.625 },
  'Samsung Galaxy S21': { width: 384, height: 854, pixelRatio: 3 },
  'iPad Mini': { width: 768, height: 1024, pixelRatio: 2 },
  'iPad Pro': { width: 1024, height: 1366, pixelRatio: 2 }
};

// Keyboard simulation configurations
const KEYBOARD_CONFIGS = {
  // iOS keyboard heights (approximate)
  'iOS Portrait': { height: 258, offsetTop: 0 },
  'iOS Landscape': { height: 162, offsetTop: 0 },
  // Android keyboard heights (approximate)
  'Android Portrait': { height: 272, offsetTop: 0 },
  'Android Landscape': { height: 144, offsetTop: 0 }
};

test.describe('QR Modal Mobile Keyboard Visibility', () => {
  
  // Test each device configuration
  Object.entries(MOBILE_DEVICES).forEach(([deviceName, config]) => {
    test(`QR modal and keyboard both visible on ${deviceName}`, async ({ page }) => {
      // Set device viewport
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto(`${BASE_URL}?t=${Date.now()}`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Open QR modal
      await page.click('#footer-qr-toggle');
      await page.waitForTimeout(1000);
      
      // Get initial modal state
      const initialModalInfo = await page.evaluate(() => {
        const modal = document.querySelector('.qr-fullscreen');
        const qrDisplay = document.querySelector('[data-qr-panel="display"]');
        const urlInput = document.querySelector('[data-qr-panel="input"]');
        
        if (!modal || !qrDisplay || !urlInput) {
          return { error: 'Modal elements not found' };
        }
        
        const modalRect = modal.getBoundingClientRect();
        const qrRect = qrDisplay.getBoundingClientRect();
        const inputRect = urlInput.getBoundingClientRect();
        
        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          modal: {
            top: modalRect.top,
            bottom: modalRect.bottom,
            height: modalRect.height,
            visible: modalRect.top >= 0 && modalRect.bottom <= window.innerHeight
          },
          qrDisplay: {
            top: qrRect.top,
            bottom: qrRect.bottom,
            height: qrRect.height,
            visible: qrRect.top >= 0 && qrRect.bottom <= window.innerHeight
          },
          urlInput: {
            top: inputRect.top,
            bottom: inputRect.bottom,
            height: inputRect.height,
            visible: inputRect.top >= 0 && inputRect.bottom <= window.innerHeight
          }
        };
      });
      
      console.log(`${deviceName} - Initial state:`, initialModalInfo);
      
      // Verify initial state is good
      expect(initialModalInfo.modal.visible).toBe(true);
      expect(initialModalInfo.qrDisplay.visible).toBe(true);
      expect(initialModalInfo.urlInput.visible).toBe(true);
      
      // Simulate keyboard appearance by focusing on URL input
      await page.click('[data-qr-panel="input"] input');
      await page.waitForTimeout(500);
      
      // Simulate keyboard by reducing viewport height
      const keyboardHeight = config.height > 800 ? 300 : 250; // Larger keyboards for larger devices
      const reducedHeight = config.height - keyboardHeight;
      
      // Use Playwright's visualViewport API to simulate keyboard
      await page.evaluate(({ reducedHeight, keyboardHeight }) => {
        // Simulate visualViewport change (keyboard appearing)
        if (window.visualViewport) {
          // Trigger resize event with reduced height
          Object.defineProperty(window.visualViewport, 'height', {
            value: reducedHeight,
            writable: true
          });
          
          // Dispatch resize event
          window.visualViewport.dispatchEvent(new Event('resize'));
        } else {
          // Fallback: manually trigger resize
          window.dispatchEvent(new Event('resize'));
        }
        
        // Also simulate the keyboard by adjusting the viewport
        window.innerHeight = reducedHeight;
      }, { reducedHeight, keyboardHeight });
      
      await page.waitForTimeout(1000);
      
      // Get modal state after keyboard simulation
      const keyboardModalInfo = await page.evaluate(() => {
        const modal = document.querySelector('.qr-fullscreen');
        const qrDisplay = document.querySelector('[data-qr-panel="display"]');
        const urlInput = document.querySelector('[data-qr-panel="input"]');
        
        if (!modal || !qrDisplay || !urlInput) {
          return { error: 'Modal elements not found' };
        }
        
        const modalRect = modal.getBoundingClientRect();
        const qrRect = qrDisplay.getBoundingClientRect();
        const inputRect = urlInput.getBoundingClientRect();
        
        return {
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            visualHeight: window.visualViewport?.height || window.innerHeight
          },
          modal: {
            top: modalRect.top,
            bottom: modalRect.bottom,
            height: modalRect.height,
            visible: modalRect.top >= 0 && modalRect.bottom <= window.innerHeight
          },
          qrDisplay: {
            top: qrRect.top,
            bottom: qrRect.bottom,
            height: qrRect.height,
            visible: qrRect.top >= 0 && qrRect.bottom <= window.innerHeight
          },
          urlInput: {
            top: inputRect.top,
            bottom: inputRect.bottom,
            height: inputRect.height,
            visible: inputRect.top >= 0 && inputRect.bottom <= window.innerHeight,
            accessible: inputRect.bottom <= (window.visualViewport?.height || window.innerHeight)
          }
        };
      });
      
      console.log(`${deviceName} - With keyboard:`, keyboardModalInfo);
      
      // Take screenshots for visual analysis
      const beforeScreenshot = `test-results/qr-keyboard-${deviceName.replace(/\s+/g, '-')}-before.png`;
      const afterScreenshot = `test-results/qr-keyboard-${deviceName.replace(/\s+/g, '-')}-after.png`;
      
      // Reset viewport for before screenshot
      await page.evaluate(({ originalHeight }) => {
        if (window.visualViewport) {
          Object.defineProperty(window.visualViewport, 'height', {
            value: originalHeight,
            writable: true
          });
          window.visualViewport.dispatchEvent(new Event('resize'));
        }
        window.innerHeight = originalHeight;
      }, { originalHeight: config.height });
      
      await page.waitForTimeout(500);
      await page.screenshot({ path: beforeScreenshot, fullPage: true });
      
      // Apply keyboard simulation again
      await page.evaluate(({ reducedHeight }) => {
        if (window.visualViewport) {
          Object.defineProperty(window.visualViewport, 'height', {
            value: reducedHeight,
            writable: true
          });
          window.visualViewport.dispatchEvent(new Event('resize'));
        }
        window.innerHeight = reducedHeight;
      }, { reducedHeight });
      
      await page.waitForTimeout(500);
      await page.screenshot({ path: afterScreenshot, fullPage: true });
      
      // Assertions for keyboard visibility
      expect(keyboardModalInfo.urlInput.accessible, 
        `URL input should be accessible above keyboard on ${deviceName}`
      ).toBe(true);
      
      // QR display should still be visible (may be smaller but not clipped)
      expect(keyboardModalInfo.qrDisplay.visible, 
        `QR display should remain visible on ${deviceName}`
      ).toBe(true);
      
      // Modal should adapt to keyboard (height should be reduced)
      expect(keyboardModalInfo.modal.height, 
        `Modal should adapt to keyboard height on ${deviceName}`
      ).toBeLessThan(initialModalInfo.modal.height);
      
      console.log(`✅ ${deviceName}: QR modal adapts correctly to keyboard`);
    });
  });

  test('Visual analysis with OpenCV for keyboard clipping detection', async ({ page }) => {
    // Test on a representative device (iPhone 12)
    const deviceConfig = MOBILE_DEVICES['iPhone 12'];
    await page.setViewportSize({ width: deviceConfig.width, height: deviceConfig.height });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Take before screenshot
    await page.screenshot({ path: 'test-results/keyboard-visual-before.png', fullPage: true });
    
    // Simulate keyboard
    const keyboardHeight = 300;
    const reducedHeight = deviceConfig.height - keyboardHeight;
    
    await page.evaluate(({ reducedHeight }) => {
      if (window.visualViewport) {
        Object.defineProperty(window.visualViewport, 'height', {
          value: reducedHeight,
          writable: true
        });
        window.visualViewport.dispatchEvent(new Event('resize'));
      }
      window.innerHeight = reducedHeight;
    }, { reducedHeight });
    
    await page.waitForTimeout(1000);
    
    // Take after screenshot
    await page.screenshot({ path: 'test-results/keyboard-visual-after.png', fullPage: true });
    
    // The visual analysis will be done by the Python script
    console.log('Screenshots captured for OpenCV analysis');
  });

  test('Cross-platform keyboard behavior consistency', async ({ page }) => {
    // Test both iOS and Android simulation
    const testDevices = [
      { name: 'iPhone 12', config: MOBILE_DEVICES['iPhone 12'], platform: 'iOS' },
      { name: 'Pixel 7', config: MOBILE_DEVICES['Pixel 7'], platform: 'Android' }
    ];
    
    for (const { name, config, platform } of testDevices) {
      await page.setViewportSize({ width: config.width, height: config.height });
      await page.goto(`${BASE_URL}?t=${Date.now()}`);
      await page.waitForLoadState('networkidle');
      
      // Open QR modal
      await page.click('#footer-qr-toggle');
      await page.waitForTimeout(1000);
      
      // Simulate keyboard
      const keyboardHeight = platform === 'iOS' ? 258 : 272;
      const reducedHeight = config.height - keyboardHeight;
      
      await page.evaluate(({ reducedHeight }) => {
        if (window.visualViewport) {
          Object.defineProperty(window.visualViewport, 'height', {
            value: reducedHeight,
            writable: true
          });
          window.visualViewport.dispatchEvent(new Event('resize'));
        }
        window.innerHeight = reducedHeight;
      }, { reducedHeight });
      
      await page.waitForTimeout(1000);
      
      // Check that both QR and input are accessible
      const accessibilityInfo = await page.evaluate(() => {
        const qrDisplay = document.querySelector('[data-qr-panel="display"]');
        const urlInput = document.querySelector('[data-qr-panel="input"]');
        
        if (!qrDisplay || !urlInput) {
          return { error: 'Elements not found' };
        }
        
        const qrRect = qrDisplay.getBoundingClientRect();
        const inputRect = urlInput.getBoundingClientRect();
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        
        return {
          qrVisible: qrRect.top >= 0 && qrRect.bottom <= viewportHeight,
          inputAccessible: inputRect.top >= 0 && inputRect.bottom <= viewportHeight,
          viewportHeight,
          qrBottom: qrRect.bottom,
          inputBottom: inputRect.bottom
        };
      });
      
      console.log(`${name} (${platform}) accessibility:`, accessibilityInfo);
      
      // Both should be accessible
      expect(accessibilityInfo.qrVisible, 
        `QR should be visible on ${name} (${platform})`
      ).toBe(true);
      
      expect(accessibilityInfo.inputAccessible, 
        `Input should be accessible on ${name} (${platform})`
      ).toBe(true);
    }
  });
});
