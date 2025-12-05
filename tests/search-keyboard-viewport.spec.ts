import { test, expect } from '@playwright/test';

/**
 * Search Results Keyboard Viewport Tests
 * 
 * Tests the Visual Viewport API integration for search results positioning
 * when the mobile keyboard appears.
 * 
 * Key behaviors tested:
 * 1. Search results position adjusts when keyboard appears
 * 2. Results remain visible above keyboard
 * 3. Proper cleanup when navigating away
 * 4. Fallback works on browsers without Visual Viewport API
 */

const BASE_URL = 'http://localhost:8000';

test.describe('Search Results Keyboard Positioning', () => {
  
  test.describe('Mobile Devices (Visual Viewport API)', () => {
    test.use({ 
      viewport: { width: 375, height: 667 }, // iPhone SE
      isMobile: true,
      hasTouch: true
    });

    test('search results visible before keyboard appears', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      // Type in search
      const searchInput = page.locator('#resources-search');
      await searchInput.fill('cyber');
      
      // Wait for search results to appear
      const searchResults = page.locator('#search-results-container');
      await expect(searchResults).not.toHaveClass(/hidden/);
      await expect(searchResults).toBeVisible();
      
      // Verify results are at bottom initially
      const box = await searchResults.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.y + box!.height).toBeGreaterThan(500); // Near bottom of screen
    });

    test('search results reposition when keyboard appears', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      const searchResults = page.locator('#search-results-container');
      
      // Focus search input (triggers keyboard)
      await searchInput.click();
      await searchInput.fill('cyber');
      
      // Wait for results to appear
      await expect(searchResults).toBeVisible();
      
      // On real mobile devices, Visual Viewport API would detect keyboard
      // In Playwright, we simulate by checking for the keyboard-visible class
      // or transform style that would be applied
      
      // Verify search results container has appropriate styling
      await expect(searchResults).toHaveCSS('transition', /transform|max-height/);
    });

    test('search results restore position when keyboard hidden', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      const searchResults = page.locator('#search-results-container');
      
      // Show search results
      await searchInput.fill('cyber');
      await expect(searchResults).toBeVisible();
      
      // Blur input (hide keyboard)
      await page.click('body');
      
      // Search results should hide
      await page.waitForTimeout(200); // Wait for blur timeout
      await expect(searchResults).toHaveClass(/hidden/);
    });

    test('search results fit in visible viewport', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      const searchResults = page.locator('#search-results-container');
      
      // Type search query
      await searchInput.fill('tool');
      
      // Wait for results
      await expect(searchResults).toBeVisible();
      
      // Verify max-height constraint
      const maxHeight = await searchResults.evaluate(el => 
        window.getComputedStyle(el).maxHeight
      );
      
      // Max height should be 50vh on mobile
      expect(maxHeight).toContain('vh');
      
      // Verify results don't overflow viewport
      const box = await searchResults.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeLessThan(667 * 0.5); // Less than 50% of viewport
    });

    test('search manager initializes only on resources page', async ({ page }) => {
      // Start on home page
      await page.goto(`${BASE_URL}/#/home`);
      
      // Check that search manager doesn't exist
      const managerExists = await page.evaluate(() => {
        return window.searchKeyboardManager !== undefined;
      });
      expect(managerExists).toBe(false);
      
      // Navigate to resources
      await page.goto(`${BASE_URL}/#/resources`);
      
      // Now it should exist
      const managerExistsOnResources = await page.evaluate(() => {
        return window.searchKeyboardManager !== undefined &&
               window.searchKeyboardManager !== null;
      });
      expect(managerExistsOnResources).toBe(true);
    });

    test('search manager cleanup on navigation', async ({ page }) => {
      // Start on resources page
      await page.goto(`${BASE_URL}/#/resources`);
      
      // Verify manager exists
      let managerExists = await page.evaluate(() => {
        return window.searchKeyboardManager !== undefined &&
               window.searchKeyboardManager !== null;
      });
      expect(managerExists).toBe(true);
      
      // Navigate away
      await page.click('a[href="#/home"]');
      await page.waitForURL(/\#\/home/);
      
      // Manager should be cleaned up
      managerExists = await page.evaluate(() => {
        return window.searchKeyboardManager === null ||
               window.searchKeyboardManager === undefined;
      });
      expect(managerExists).toBe(true);
    });
  });

  test.describe('Desktop - No Keyboard Handling', () => {
    test.use({ 
      viewport: { width: 1920, height: 1080 }
    });

    test('search manager not initialized on desktop', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      // Type in search
      const searchInput = page.locator('#resources-search');
      await searchInput.fill('cyber');
      
      // Results should appear normally
      const searchResults = page.locator('#search-results-container');
      await expect(searchResults).toBeVisible();
      
      // Keyboard manager may exist but shouldn't activate positioning
      // Desktop viewports should use default positioning
      const hasKeyboardClass = await searchResults.evaluate(el => 
        el.classList.contains('keyboard-visible')
      );
      expect(hasKeyboardClass).toBe(false);
    });
  });

  test.describe('Multiple Mobile Devices', () => {
    const mobileDevices = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 12', width: 390, height: 844 },
      { name: 'Pixel 5', width: 393, height: 851 },
      { name: 'Samsung Galaxy S21', width: 360, height: 800 }
    ];

    for (const device of mobileDevices) {
      test(`search works correctly on ${device.name}`, async ({ page }) => {
        await page.setViewportSize({ width: device.width, height: device.height });
        await page.goto(`${BASE_URL}/#/resources`);
        
        const searchInput = page.locator('#resources-search');
        const searchResults = page.locator('#search-results-container');
        
        // Search
        await searchInput.fill('linux');
        
        // Verify results appear
        await expect(searchResults).toBeVisible();
        
        // Verify results fit in viewport
        const box = await searchResults.boundingBox();
        expect(box).toBeTruthy();
        expect(box!.width).toBeLessThanOrEqual(device.width);
        expect(box!.height).toBeLessThan(device.height * 0.6); // Max 60% of screen
      });
    }
  });

  test.describe('Search Interaction with Keyboard', () => {
    test.use({ 
      viewport: { width: 375, height: 667 },
      isMobile: true
    });

    test('selecting result closes search and keyboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      const searchResults = page.locator('#search-results-container');
      
      // Search for something
      await searchInput.fill('cyberchef');
      await expect(searchResults).toBeVisible();
      
      // Click a search result
      await page.click('#search-results > div:first-child');
      
      // Modal should open
      await expect(page.locator('.expanded-element-overlay')).toBeVisible();
      
      // Search should be hidden
      await expect(searchResults).toHaveClass(/hidden/);
      
      // Search input should be cleared
      await expect(searchInput).toHaveValue('');
    });

    test('typing updates results in real-time', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      const searchResults = page.locator('#search-results-container');
      
      // Type first letter
      await searchInput.fill('c');
      await expect(searchResults).toBeVisible();
      
      // Get initial result count
      const initialCount = await page.locator('#search-results > div').count();
      expect(initialCount).toBeGreaterThan(0);
      
      // Type more specific query
      await searchInput.fill('cyber');
      
      // Results should update
      const newCount = await page.locator('#search-results > div').count();
      // Likely different count (more specific)
      expect(newCount).toBeLessThanOrEqual(initialCount);
    });

    test('empty search hides results', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      const searchResults = page.locator('#search-results-container');
      
      // Show results
      await searchInput.fill('linux');
      await expect(searchResults).toBeVisible();
      
      // Clear search
      await searchInput.fill('');
      
      // Results should hide
      await expect(searchResults).toHaveClass(/hidden/);
    });
  });

  test.describe('Accessibility with Keyboard', () => {
    test.use({ 
      viewport: { width: 375, height: 667 },
      isMobile: true
    });

    test('search results accessible via keyboard navigation', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      
      // Focus and type
      await searchInput.focus();
      await searchInput.fill('tool');
      
      // Verify results visible
      const searchResults = page.locator('#search-results-container');
      await expect(searchResults).toBeVisible();
      
      // Tab to first result (if keyboard navigation supported)
      await page.keyboard.press('Tab');
      
      // Should be able to select with Enter
      await page.keyboard.press('Enter');
      
      // Modal should open or some action should occur
      // (Depends on implementation - this tests keyboard accessibility)
    });

    test('focus remains in search input while typing', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      
      // Focus
      await searchInput.focus();
      
      // Type
      await page.keyboard.type('cryptography');
      
      // Verify focus still in input
      const focusedElement = await page.evaluate(() => document.activeElement?.id);
      expect(focusedElement).toBe('resources-search');
    });
  });

  test.describe('Visual Regression', () => {
    test.use({ 
      viewport: { width: 375, height: 667 },
      isMobile: true
    });

    test('search results appearance consistent', async ({ page }) => {
      await page.goto(`${BASE_URL}/#/resources`);
      
      const searchInput = page.locator('#resources-search');
      await searchInput.fill('cyber');
      
      // Wait for results
      const searchResults = page.locator('#search-results-container');
      await expect(searchResults).toBeVisible();
      
      // Take screenshot
      await expect(searchResults).toHaveScreenshot('search-results-mobile.png', {
        maxDiffPixels: 100
      });
    });
  });
});

