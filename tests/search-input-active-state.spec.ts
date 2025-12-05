import { test, expect } from '@playwright/test';

/**
 * Search Input Active State Tests
 * 
 * Tests the search input active state feature that shows an orange border
 * when the search input has content, providing visual feedback that search is active.
 * 
 * Key behaviors tested:
 * 1. Default styling when empty (no orange border)
 * 2. Active state when typing (orange border appears)
 * 3. Active state clears when input is emptied
 */

const BASE_URL = 'http://localhost:8000';

test.describe('Search Input Active State', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/resources`);
  });

  test('search input has default styling when empty', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    
    await expect(searchInput).not.toHaveClass(/searching/);
    
    const borderColor = await searchInput.evaluate(el => 
      window.getComputedStyle(el).borderColor
    );
    
    // Should not be orange (RGB values for orange: 249, 115, 22)
    expect(borderColor).not.toContain('249, 115, 22');
  });

  test('search input gets active state when typing', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    
    await searchInput.fill('test');
    // Wait for JavaScript to process and apply styles
    await page.waitForTimeout(300);
    
    await expect(searchInput).toHaveClass(/searching/);
    
    // Check border color from computed styles
    const borderColor = await searchInput.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.borderColor || style.borderTopColor;
    });
    
    // Should be orange (RGB values: 249, 115, 22)
    expect(borderColor).toContain('249, 115, 22');
  });

  test('search input active state clears when emptied', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    
    // First add some text
    await searchInput.fill('test');
    await page.waitForTimeout(100);
    
    // Verify it has the active state
    await expect(searchInput).toHaveClass(/searching/);
    
    // Clear the input
    await searchInput.fill('');
    await page.waitForTimeout(100);
    
    // Verify active state is removed
    await expect(searchInput).not.toHaveClass(/searching/);
  });

  test('search input active state updates dynamically while typing', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    
    // Type one character
    await searchInput.type('t');
    await page.waitForTimeout(100);
    await expect(searchInput).toHaveClass(/searching/);
    
    // Add more characters
    await searchInput.type('est');
    await page.waitForTimeout(100);
    await expect(searchInput).toHaveClass(/searching/);
    
    // Clear one by one
    await searchInput.press('Backspace');
    await page.waitForTimeout(100);
    await expect(searchInput).toHaveClass(/searching/);
    
    // Clear all
    await searchInput.fill('');
    await page.waitForTimeout(100);
    await expect(searchInput).not.toHaveClass(/searching/);
  });
});
