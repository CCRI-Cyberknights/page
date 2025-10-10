import { test } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test('capture 1024x624 viewport analysis', async ({ page }) => {
  // Set viewport
  await page.setViewportSize({ width: 1024, height: 624 });
  
  // Navigate
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for everything to render
  await page.waitForTimeout(1000);
  
  // 1. Take viewport-only screenshot (what user sees initially)
  await page.screenshot({
    path: 'test-results/viewport-1024x624-initial.png',
    fullPage: false, // Only capture viewport
  });
  
  // 2. Take full page screenshot (complete content)
  await page.screenshot({
    path: 'test-results/viewport-1024x624-full.png',
    fullPage: true,
  });
  
  // 3. Scroll to footer and capture QR code area
  await page.evaluate(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  await page.waitForTimeout(1000); // Wait for scroll
  
  // 4. Take screenshot of footer area
  await page.screenshot({
    path: 'test-results/viewport-1024x624-footer.png',
    fullPage: false,
  });
  
  // 5. Click QR code to open modal
  const qrElement = page.locator('#footer-qr-svg, #footer-qr-canvas').first();
  if (await qrElement.isVisible()) {
    await qrElement.click();
    await page.waitForTimeout(500); // Wait for modal animation
    
    // 6. Take screenshot of QR modal
    await page.screenshot({
      path: 'test-results/viewport-1024x624-qr-modal.png',
      fullPage: false,
    });
    
    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  
  console.log('\n📸 Screenshots saved:');
  console.log('  - test-results/viewport-1024x624-initial.png (viewport only)');
  console.log('  - test-results/viewport-1024x624-full.png (full page)');
  console.log('  - test-results/viewport-1024x624-footer.png (footer area)');
  console.log('  - test-results/viewport-1024x624-qr-modal.png (QR modal)');
  console.log(`\nViewport: 1024×624px\n`);
  
  // Check QR code visibility and position
  const qrInfo = await page.evaluate(() => {
    const qrSvg = document.querySelector('#footer-qr-svg');
    const qrCanvas = document.querySelector('#footer-qr-canvas');
    const footer = document.querySelector('footer');
    
    const qrRect = qrSvg?.getBoundingClientRect() || qrCanvas?.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();
    
    return {
      qrExists: !!(qrSvg || qrCanvas),
      qrVisible: qrRect && qrRect.top < window.innerHeight && qrRect.bottom > 0,
      qrPosition: qrRect ? { top: qrRect.top, left: qrRect.left, width: qrRect.width, height: qrRect.height } : null,
      footerPosition: footerRect ? { top: footerRect.top, height: footerRect.height } : null,
      viewportHeight: window.innerHeight,
      scrollY: window.scrollY,
    };
  });
  
  console.log('QR Code Analysis:');
  console.log(`  Exists: ${qrInfo.qrExists}`);
  console.log(`  Visible in viewport: ${qrInfo.qrVisible}`);
  if (qrInfo.qrPosition) {
    console.log(`  Position: top=${qrInfo.qrPosition.top}px, size=${qrInfo.qrPosition.width}×${qrInfo.qrPosition.height}px`);
  }
  if (qrInfo.footerPosition) {
    console.log(`  Footer top: ${qrInfo.footerPosition.top}px (viewport height: ${qrInfo.viewportHeight}px)`);
  }
  console.log(`  Scroll position: ${qrInfo.scrollY}px`);
  console.log('');
});

