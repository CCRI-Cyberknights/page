import { test, expect } from '@playwright/test';

test.describe('QR Code Manager Debug', () => {
  test('Check QRCodeManager initialization', async ({ page }) => {
    await page.goto('https://ccri-cyberknights.github.io/page/#/home');
    await page.waitForLoadState('networkidle');
    
    // Check if QRCodeManager exists
    const qrManagerExists = await page.evaluate(() => {
      return window.qrCodeManager !== undefined;
    });
    
    console.log('QRCodeManager exists:', qrManagerExists);
    
    if (qrManagerExists) {
      // Check QRCodeManager properties
      const qrManagerInfo = await page.evaluate(() => {
        return {
          currentUrl: window.qrCodeManager.currentUrl,
          isVisible: window.qrCodeManager.isVisible,
          hasDebouncedUpdate: typeof window.qrCodeManager.debouncedUpdate === 'function',
          hasBuildUrl: typeof window.qrCodeManager.buildUrl === 'function'
        };
      });
      
      console.log('QRCodeManager info:', qrManagerInfo);
      
      // Check if QR code elements exist
      const elementsExist = await page.evaluate(() => {
        return {
          toggle: !!document.getElementById('footer-qr-toggle'),
          panel: !!document.getElementById('footer-qr-panel'),
          canvas: !!document.getElementById('footer-qr-canvas'),
          input: !!document.getElementById('footer-qr-input')
        };
      });
      
      console.log('Elements exist:', elementsExist);
      
      // Check if QRCode library is loaded
      const qrCodeLoaded = await page.evaluate(() => {
        return typeof window.QRCode !== 'undefined';
      });
      
      console.log('QRCode library loaded:', qrCodeLoaded);
      
      // Check if data attribute exists
      const dataAttribute = await page.evaluate(() => {
        const canvas = document.getElementById('footer-qr-canvas');
        if (canvas && canvas.parentNode) {
          return canvas.parentNode.getAttribute('data-generated-url');
        }
        return null;
      });
      
      console.log('Data attribute:', dataAttribute);
    }
    
    // This test is just for debugging, so we'll always pass
    expect(true).toBe(true);
  });
});
