import { test, expect } from '@playwright/test';

test.describe('Layout Architecture Validation', () => {
  test('should use wrapper pattern for layout', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    
    // Check that body does NOT have flex flex-col
    const bodyClasses = await page.locator('body').getAttribute('class');
    expect(bodyClasses).not.toContain('flex flex-col');
    
    // Check that wrapper div has flex flex-col min-h-screen
    const wrapperDiv = page.locator('body > div').first();
    const wrapperClasses = await wrapperDiv.getAttribute('class');
    expect(wrapperClasses).toContain('flex flex-col min-h-screen');
  });

  test('should have proper header structure', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    
    // Check header has max-w-5xl mx-auto and border classes
    const header = page.locator('header').first();
    const headerClasses = await header.getAttribute('class');
    expect(headerClasses).toContain('max-w-5xl');
    expect(headerClasses).toContain('mx-auto');
    expect(headerClasses).toContain('border-b');
    
    // Check header has proper padding
    expect(headerClasses).toContain('px-4');
    expect(headerClasses).toContain('py-6');
  });

  test('should have proper main structure', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check main has flex-1 (not flex-grow) - this is the key layout fix
    const main = page.locator('main#app');
    const mainClasses = await main.getAttribute('class');
    expect(mainClasses).toContain('flex-1');
    expect(mainClasses).not.toContain('flex-grow');
    
    // Verify main is visible and properly sized
    const mainBox = await main.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(300);
    expect(mainBox?.height).toBeGreaterThan(100);
    
    // Check that content is properly contained (not overflowing)
    const mainComputedStyle = await main.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        flexGrow: style.flexGrow,
        maxWidth: style.maxWidth
      };
    });
    
    expect(mainComputedStyle.display).toBe('block');
    expect(mainComputedStyle.flexGrow).toBe('1');
  });

  test('should have proper footer structure', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    
    // Check footer has mt-6 (not mt-auto)
    const footer = page.locator('footer').first();
    const footerClasses = await footer.getAttribute('class');
    expect(footerClasses).toContain('mt-6');
    expect(footerClasses).not.toContain('mt-auto');
    
    // Check footer has border-t
    expect(footerClasses).toContain('border-t');
  });

  test('should maintain proper layout at different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:8000/');
      
      // Check that header is visible and properly positioned
      const header = page.locator('header').first();
      await expect(header).toBeVisible();
      
      // Check that footer is visible
      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();
      
      // Check that main content area is visible
      const main = page.locator('main#app');
      await expect(main).toBeVisible();
    }
  });

  test('should prevent layout regressions', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check specific layout measurements
    const header = page.locator('header').first();
    const headerBox = await header.boundingBox();
    
    // Header should span full width
    expect(headerBox?.width).toBeGreaterThan(300);
    
    // Check that navigation is properly centered
    const nav = page.locator('nav').first();
    const navBox = await nav.boundingBox();
    expect(navBox?.width).toBeGreaterThan(200);
    
    // Check that main content area is visible and properly sized
    const main = page.locator('main#app');
    const mainBox = await main.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(300);
    expect(mainBox?.height).toBeGreaterThan(100);
  });
});
