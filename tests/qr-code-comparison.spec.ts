import { test, expect } from '@playwright/test';

test.describe('QR Code Visual Comparison', () => {
  test('Compare QR codes between cheatsheet 3 and 4', async ({ page }) => {
    // Navigate to cheatsheet 3
    await page.goto('http://localhost:8000/guides/linux-cheatsheet-3.html');
    
    // Take screenshot of cheatsheet 3 QR codes
    const qrCodes3 = page.locator('svg[width="120"]');
    await expect(qrCodes3).toHaveCount(2);
    
    // Get the SVG elements and check their content
    const svg3Elements = await qrCodes3.all();
    for (let i = 0; i < svg3Elements.length; i++) {
      const svgContent = await svg3Elements[i].innerHTML();
      console.log(`Cheatsheet 3 QR ${i + 1} SVG content length:`, svgContent.length);
      console.log(`Cheatsheet 3 QR ${i + 1} has path element:`, svgContent.includes('<path'));
      console.log(`Cheatsheet 3 QR ${i + 1} path data length:`, svgContent.match(/d="([^"]*)"/)?.[1]?.length || 0);
    }
    
    // Navigate to cheatsheet 4
    await page.goto('http://localhost:8000/guides/linux-cheatsheet-4.html');
    
    // Take screenshot of cheatsheet 4 QR codes
    const qrCodes4 = page.locator('svg[width="120"]');
    await expect(qrCodes4).toHaveCount(2);
    
    // Get the SVG elements and check their content
    const svg4Elements = await qrCodes4.all();
    for (let i = 0; i < svg4Elements.length; i++) {
      const svgContent = await svg4Elements[i].innerHTML();
      console.log(`Cheatsheet 4 QR ${i + 1} SVG content length:`, svgContent.length);
      console.log(`Cheatsheet 4 QR ${i + 1} has path element:`, svgContent.includes('<path'));
      console.log(`Cheatsheet 4 QR ${i + 1} path data length:`, svgContent.match(/d="([^"]*)"/)?.[1]?.length || 0);
    }
    
    // Take screenshots for visual comparison
    await page.screenshot({ path: 'test-results/cheatsheet4-qr-codes.png', fullPage: true });
    
    await page.goto('http://localhost:8000/guides/linux-cheatsheet-3.html');
    await page.screenshot({ path: 'test-results/cheatsheet3-qr-codes.png', fullPage: true });
  });
});
