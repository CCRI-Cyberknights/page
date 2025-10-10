import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('QR Modal at 1024x624 viewport', () => {
  test('should display QR modal correctly at 1024x624', async ({ page }) => {
    // Set viewport to 1024x624
    await page.setViewportSize({ width: 1024, height: 624 });
    
    // Navigate to home page
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Wait for footer QR code to be visible
    await page.waitForSelector('#footer-qr-svg', { state: 'visible', timeout: 5000 });
    
    // Click the QR code to open modal
    await page.click('#footer-qr-svg');
    
    // Wait for modal to appear
    await page.waitForSelector('#qr-modal', { state: 'visible', timeout: 2000 });
    
    // Get modal dimensions and QR code dimensions
    const modalInfo = await page.evaluate(() => {
      const modal = document.querySelector('#qr-modal');
      const qrCode = document.querySelector('#qr-modal svg');
      const modalRect = modal?.getBoundingClientRect();
      const qrRect = qrCode?.getBoundingClientRect();
      
      return {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        modal: {
          width: modalRect?.width || 0,
          height: modalRect?.height || 0,
          top: modalRect?.top || 0,
          left: modalRect?.left || 0,
        },
        qrCode: {
          width: qrRect?.width || 0,
          height: qrRect?.height || 0,
          top: qrRect?.top || 0,
          left: qrRect?.left || 0,
        },
      };
    });
    
    // Log the dimensions
    console.log('\n📐 QR Modal Dimensions at 1024×624:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Viewport: ${modalInfo.viewport.width}×${modalInfo.viewport.height}px`);
    console.log(`Modal: ${modalInfo.modal.width}×${modalInfo.modal.height}px`);
    console.log(`  Position: top=${modalInfo.modal.top}px, left=${modalInfo.modal.left}px`);
    console.log(`QR Code: ${modalInfo.qrCode.width}×${modalInfo.qrCode.height}px`);
    console.log(`  Position: top=${modalInfo.qrCode.top}px, left=${modalInfo.qrCode.left}px`);
    console.log(`QR Code takes ${((modalInfo.qrCode.width / modalInfo.viewport.width) * 100).toFixed(1)}% of viewport width`);
    console.log(`QR Code takes ${((modalInfo.qrCode.height / modalInfo.viewport.height) * 100).toFixed(1)}% of viewport height`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Take screenshot
    await page.screenshot({
      path: 'test-results/qr-modal-1024x624.png',
      fullPage: false,
    });
    
    console.log('📸 Screenshot saved to: test-results/qr-modal-1024x624.png\n');
    
    // Assertions
    expect(modalInfo.viewport.width).toBe(1024);
    expect(modalInfo.viewport.height).toBe(624);
    expect(modalInfo.qrCode.width).toBeGreaterThan(150); // QR should be substantial
    expect(modalInfo.qrCode.height).toBeGreaterThan(150);
    
    // QR code should be visible and centered
    const qrCenterX = modalInfo.qrCode.left + modalInfo.qrCode.width / 2;
    const viewportCenterX = modalInfo.viewport.width / 2;
    const horizontalOffset = Math.abs(qrCenterX - viewportCenterX);
    
    console.log(`QR Code horizontal centering: offset=${horizontalOffset.toFixed(1)}px from center`);
    expect(horizontalOffset).toBeLessThan(50); // Should be reasonably centered
  });
  
  test('should show all modal controls at 1024x624', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 624 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Open modal
    await page.click('#footer-qr-svg');
    await page.waitForSelector('#qr-modal', { state: 'visible' });
    
    // Check that all controls are visible
    const controls = await page.evaluate(() => {
      const urlInput = document.querySelector('#qr-url-input');
      const eclButtons = document.querySelectorAll('#footer-qr-ecl-dec, #footer-qr-ecl-inc');
      const downloadButtons = document.querySelectorAll('button[id*="download"]');
      const closeButton = document.querySelector('#qr-modal button[onclick*="closeQRModal"]');
      
      return {
        urlInput: !!urlInput && window.getComputedStyle(urlInput).display !== 'none',
        eclButtons: eclButtons.length === 2,
        downloadButtons: downloadButtons.length >= 2,
        closeButton: !!closeButton,
      };
    });
    
    console.log('\n🎛️  Modal Controls Visibility:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`URL Input: ${controls.urlInput ? '✅ Visible' : '❌ Hidden'}`);
    console.log(`ECL Buttons: ${controls.eclButtons ? '✅ Present (2)' : '❌ Missing'}`);
    console.log(`Download Buttons: ${controls.downloadButtons ? '✅ Present' : '❌ Missing'}`);
    console.log(`Close Button: ${controls.closeButton ? '✅ Present' : '❌ Missing'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    expect(controls.urlInput).toBe(true);
    expect(controls.eclButtons).toBe(true);
    expect(controls.downloadButtons).toBe(true);
    expect(controls.closeButton).toBe(true);
  });
  
  test('should allow closing modal at 1024x624', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 624 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Open modal
    await page.click('#footer-qr-svg');
    await page.waitForSelector('#qr-modal', { state: 'visible' });
    
    // Close by clicking backdrop
    await page.click('#qr-modal', { position: { x: 10, y: 10 } });
    
    // Modal should be hidden
    await page.waitForSelector('#qr-modal', { state: 'hidden', timeout: 2000 });
    
    const isHidden = await page.evaluate(() => {
      const modal = document.querySelector('#qr-modal');
      return !modal || window.getComputedStyle(modal).display === 'none';
    });
    
    console.log(`\n✅ Modal closes correctly: ${isHidden ? 'Yes' : 'No'}\n`);
    expect(isHidden).toBe(true);
  });
});

