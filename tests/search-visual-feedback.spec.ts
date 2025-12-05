import { test, expect } from '@playwright/test';

/**
 * Search Visual Feedback Tests
 * 
 * Tests the collapsing intro text feature that provides more vertical space
 * for search results when the user starts typing.
 * 
 * Key behaviors tested:
 * 1. Intro text is visible by default
 * 2. Intro text collapses when user types in search
 * 3. Intro text expands when search is cleared
 * 4. Smooth animation transitions
 */

const BASE_URL = 'http://localhost:8000';

test.describe('Visual Search Feedback - Collapsing Intro Text', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/resources`);
  });

  test.describe('Mobile Viewport (≤768px)', () => {
    test.use({ 
      viewport: { width: 375, height: 667 }, // iPhone SE - mobile
      isMobile: true,
      hasTouch: true
    });

    test('intro text is visible when page loads', async ({ page }) => {
      const introText = page.locator('#intro-text');
      await expect(introText).toBeVisible();
      
      // Verify it has content
      await expect(introText).not.toBeEmpty();
    });

    test('intro text collapses when user types in search', async ({ page }) => {
      const introContainer = page.locator('#intro-container');
      const searchInput = page.locator('#resources-search');
      
      // Get initial height of container
      const initialBox = await introContainer.boundingBox();
      expect(initialBox).toBeTruthy();
      expect(initialBox!.height).toBeGreaterThan(0);
      
      // Type in search
      await searchInput.fill('linux');
      
      // Wait for animation
      await page.waitForTimeout(400); // 300ms animation + buffer
      
      // Verify collapsed - check container for class
      await expect(introContainer).toHaveClass(/collapsed/);
      
      // Verify height is collapsed (should be 0 or very small)
      const collapsedBox = await introContainer.boundingBox();
      expect(collapsedBox).toBeTruthy();
      expect(collapsedBox!.height).toBeLessThan(10); // Allow small margin for padding/border
    });

    test('category filters collapse when user types in search', async ({ page }) => {
      const categoryFilters = page.locator('#category-filters-container');
      const searchInput = page.locator('#resources-search');
      
      // Get initial height
      const initialBox = await categoryFilters.boundingBox();
      expect(initialBox).toBeTruthy();
      expect(initialBox!.height).toBeGreaterThan(0);
      
      // Type in search
      await searchInput.fill('linux');
      
      // Wait for animation
      await page.waitForTimeout(400);
      
      // Verify collapsed
      await expect(categoryFilters).toHaveClass(/collapsed/);
      
      // Verify height is collapsed
      const collapsedBox = await categoryFilters.boundingBox();
      expect(collapsedBox).toBeTruthy();
      expect(collapsedBox!.height).toBeLessThan(10);
    });

    test('both sections expand when search is cleared', async ({ page }) => {
      const introContainer = page.locator('#intro-container');
      const categoryFilters = page.locator('#category-filters-container');
      const introText = page.locator('#intro-text');
      const searchInput = page.locator('#resources-search');
      
      // Type then clear
      await searchInput.fill('linux');
      await page.waitForTimeout(400);
      
      // Verify both collapsed
      await expect(introContainer).toHaveClass(/collapsed/);
      await expect(categoryFilters).toHaveClass(/collapsed/);
      
      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(400);
      
      // Verify both expanded
      await expect(introContainer).not.toHaveClass(/collapsed/);
      await expect(categoryFilters).not.toHaveClass(/collapsed/);
      await expect(introText).toBeVisible();
      
      const introBox = await introContainer.boundingBox();
      const filtersBox = await categoryFilters.boundingBox();
      expect(introBox).toBeTruthy();
      expect(introBox!.height).toBeGreaterThan(0);
      expect(filtersBox).toBeTruthy();
      expect(filtersBox!.height).toBeGreaterThan(0);
    });

    test('intro collapse has smooth animation', async ({ page }) => {
      const introContainer = page.locator('#intro-container');
      
      // Check for transition property on container
      const transition = await introContainer.evaluate(el => 
        window.getComputedStyle(el).transition
      );
      
      expect(transition).toContain('max-height');
      expect(transition).toContain('opacity');
      expect(transition).toMatch(/0\.3s|300ms/); // 300ms duration
    });
  });

  test.describe('Desktop Viewport (>768px)', () => {
    test.use({ 
      viewport: { width: 1920, height: 1080 }
    });

    test('intro text does NOT collapse on desktop when typing', async ({ page }) => {
      const introContainer = page.locator('#intro-container');
      const searchInput = page.locator('#resources-search');
      
      // Type in search
      await searchInput.fill('linux');
      await page.waitForTimeout(400);
      
      // Verify NOT collapsed on desktop
      await expect(introContainer).not.toHaveClass(/collapsed/);
      
      // Verify still visible
      const box = await introContainer.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThan(0);
    });

    test('category filters do NOT collapse on desktop when typing', async ({ page }) => {
      const categoryFilters = page.locator('#category-filters-container');
      const searchInput = page.locator('#resources-search');
      
      // Type in search
      await searchInput.fill('linux');
      await page.waitForTimeout(400);
      
      // Verify NOT collapsed on desktop
      await expect(categoryFilters).not.toHaveClass(/collapsed/);
      
      // Verify still visible
      const box = await categoryFilters.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThan(0);
    });
  });
});

