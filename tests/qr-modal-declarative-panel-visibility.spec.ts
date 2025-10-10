import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

/**
 * Declarative Panel Visibility Matrix
 * 
 * This test suite validates that panel visibility follows a systematic,
 * declarative approach across all viewport configurations.
 * 
 * Each viewport configuration declares exactly which panels should be visible,
 * following responsive design best practices.
 */
const PANEL_VISIBILITY_MATRIX = {
  // Mobile Viewports (≤ 768px width)
  'mobile-portrait': { 
    width: 375, 
    height: 667, 
    description: 'iPhone SE portrait',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality  
      advanced: false  // Hidden - constrained viewport
    } 
  },
  'mobile-landscape': { 
    width: 667, 
    height: 375, 
    description: 'iPhone SE landscape',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: false  // Hidden - mobile viewport (≤ 768px width)
    } 
  },
  
  // Tablet Viewports (768px < width ≤ 1024px)
  'tablet-portrait': { 
    width: 768, 
    height: 1024, 
    description: 'iPad portrait',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: true   // Visible - sufficient space (height > 650px)
    } 
  },
  'tablet-landscape': { 
    width: 1024, 
    height: 768, 
    description: 'iPad landscape',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: true   // Visible - sufficient space (height > 650px)
    } 
  },
  
  // Laptop Viewports
  'laptop-constrained': { 
    width: 1024, 
    height: 624, 
    description: 'Small laptop (constrained height)',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: false  // Hidden - constrained viewport (height ≤ 650px)
    } 
  },
  'laptop-standard': { 
    width: 1366, 
    height: 768, 
    description: 'Standard laptop',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: true   // Visible - sufficient space (width > 1024px)
    } 
  },
  
  // Desktop Viewports
  'desktop-standard': { 
    width: 1920, 
    height: 1080, 
    description: 'Standard desktop',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: true   // Visible - sufficient space (width > 1024px)
    } 
  },
  'desktop-large': { 
    width: 2560, 
    height: 1440, 
    description: 'Large desktop',
    panels: { 
      display: true,   // Always visible - critical functionality
      input: true,     // Always visible - critical functionality
      advanced: true   // Visible - sufficient space (width > 1024px)
    } 
  }
};

test.describe('Declarative Panel Visibility System', () => {
  
  // Generate tests for each viewport configuration
  Object.entries(PANEL_VISIBILITY_MATRIX).forEach(([viewportKey, config]) => {
    test(`Panel visibility for ${viewportKey} (${config.description})`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: config.width, height: config.height });
      
      // Navigate to page with cache busting
      await page.goto(`${BASE_URL}?t=${Date.now()}`);
      
      // Wait for page to load completely
      await page.waitForLoadState('networkidle');
      
      // Open QR modal
      await page.click('#footer-qr-toggle');
      
      // Wait for modal to be fully rendered
      await page.waitForTimeout(1000);
      
      // Assert panel visibility for each panel
      Object.entries(config.panels).forEach(([panelName, shouldBeVisible]) => {
        const selector = `[data-qr-panel="${panelName}"]`;
        
        if (shouldBeVisible) {
          expect(page.locator(selector), 
            `Panel '${panelName}' should be visible on ${config.description} (${config.width}x${config.height})`
          ).toBeVisible();
        } else {
          expect(page.locator(selector), 
            `Panel '${panelName}' should be hidden on ${config.description} (${config.width}x${config.height})`
          ).toBeHidden();
        }
      });
      
      // Take screenshot for visual regression testing
      await page.screenshot({ 
        path: `test-results/qr-modal-${viewportKey}-${config.width}x${config.height}.png`,
        fullPage: true 
      });
      
      // Log the configuration for debugging
      console.log(`✅ ${config.description} (${config.width}x${config.height}):`, config.panels);
    });
  });

  test('CSS custom properties are properly defined', async ({ page }) => {
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    
    // Check that CSS custom properties are defined
    const customProperties = await page.evaluate(() => {
      const rootStyles = getComputedStyle(document.documentElement);
      return {
        '--breakpoint-mobile': rootStyles.getPropertyValue('--breakpoint-mobile').trim(),
        '--breakpoint-tablet': rootStyles.getPropertyValue('--breakpoint-tablet').trim(),
        '--breakpoint-desktop': rootStyles.getPropertyValue('--breakpoint-desktop').trim(),
        '--height-constrained': rootStyles.getPropertyValue('--height-constrained').trim(),
        '--panel-display-visibility': rootStyles.getPropertyValue('--panel-display-visibility').trim(),
        '--panel-input-visibility': rootStyles.getPropertyValue('--panel-input-visibility').trim(),
        '--panel-advanced-visibility': rootStyles.getPropertyValue('--panel-advanced-visibility').trim()
      };
    });
    
    // Assert that custom properties are defined
    expect(customProperties['--breakpoint-mobile']).toBe('480px');
    expect(customProperties['--breakpoint-tablet']).toBe('768px');
    expect(customProperties['--breakpoint-desktop']).toBe('1024px');
    expect(customProperties['--height-constrained']).toBe('650px');
    expect(customProperties['--panel-display-visibility']).toBe('block');
    expect(customProperties['--panel-input-visibility']).toBe('block');
    
    console.log('✅ CSS Custom Properties:', customProperties);
  });

  test('Panel visibility changes dynamically with viewport resize', async ({ page }) => {
    // Start with mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Verify advanced panel is hidden on mobile
    await expect(page.locator('[data-qr-panel="advanced"]')).toBeHidden();
    
    // Resize to desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000); // Allow CSS to update
    
    // Verify advanced panel is now visible on desktop
    await expect(page.locator('[data-qr-panel="advanced"]')).toBeVisible();
    
    // Resize back to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000); // Allow CSS to update
    
    // Verify advanced panel is hidden again
    await expect(page.locator('[data-qr-panel="advanced"]')).toBeHidden();
    
    console.log('✅ Dynamic panel visibility working correctly');
  });

  test('Accessibility attributes are properly managed', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile - advanced panel hidden
    await page.goto(`${BASE_URL}?t=${Date.now()}`);
    await page.waitForLoadState('networkidle');
    
    // Open QR modal
    await page.click('#footer-qr-toggle');
    await page.waitForTimeout(1000);
    
    // Check accessibility attributes on mobile (panel should be hidden)
    const mobileAccessibility = await page.evaluate(() => {
      const advancedPanel = document.querySelector('[data-qr-panel="advanced"]');
      return {
        ariaHidden: advancedPanel?.getAttribute('aria-hidden'),
        tabindex: advancedPanel?.getAttribute('tabindex'),
        display: getComputedStyle(advancedPanel).display
      };
    });
    
    expect(mobileAccessibility.ariaHidden).toBe('true');
    expect(mobileAccessibility.tabindex).toBe('-1');
    expect(mobileAccessibility.display).toBe('none');
    
    // Resize to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    // Check accessibility attributes on desktop (panel should be visible)
    const desktopAccessibility = await page.evaluate(() => {
      const advancedPanel = document.querySelector('[data-qr-panel="advanced"]');
      return {
        ariaHidden: advancedPanel?.getAttribute('aria-hidden'),
        tabindex: advancedPanel?.getAttribute('tabindex'),
        display: getComputedStyle(advancedPanel).display
      };
    });
    
    expect(desktopAccessibility.ariaHidden).toBeNull();
    expect(desktopAccessibility.tabindex).toBeNull();
    expect(desktopAccessibility.display).toBe('block');
    
    console.log('✅ Accessibility attributes managed correctly');
  });
});
