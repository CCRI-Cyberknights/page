import { test, expect } from '@playwright/test';

/**
 * Category Highlighting Tests
 * 
 * Tests the category highlighting feature that glows orange when categories
 * contain matching search results.
 * 
 * Key behaviors tested:
 * 1. No highlighting by default
 * 2. Matching categories get orange glow
 * 3. Multiple categories can highlight simultaneously
 * 4. Non-matching categories not highlighted
 * 5. Pulse animation present
 * 6. Highlighting clears when search cleared
 */

const BASE_URL = 'http://localhost:8000';

test.describe('Category Highlighting - Orange Glow', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/#/resources`);
  });

  test('categories have no highlighting by default', async ({ page }) => {
    const categoryButtons = page.locator('[data-filter]');
    const count = await categoryButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = categoryButtons.nth(i);
      await expect(button).not.toHaveClass(/category-match/);
      await expect(button).not.toHaveClass(/category-partial-match/);
    }
  });

  test('category with matching results gets orange glow', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    const linuxButton = page.locator('[data-filter="linux"]');
    
    // Search for linux-related term
    await searchInput.fill('terminal');
    
    // Wait for results processing
    await page.waitForTimeout(200);
    
    // Verify linux category is highlighted
    await expect(linuxButton).toHaveClass(/category-match/);
    
    // Verify has orange styling (border or box-shadow)
    const borderColor = await linuxButton.evaluate(el => 
      window.getComputedStyle(el).borderColor
    );
    // Check if it contains orange RGB values (249, 115, 22) or is orange
    expect(borderColor).toMatch(/(249|250|251|252|253|254|255).*?(115|116|117|118|119|120).*?(22|23|24|25|26|27|28)|orange|rgb\(249/i);
  });

  test('multiple categories can highlight simultaneously', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    
    // Search for generic term that matches multiple categories
    await searchInput.fill('cyber');
    await page.waitForTimeout(200);
    
    // Count highlighted categories
    const highlighted = page.locator('[data-filter].category-match');
    const count = await highlighted.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('categories without matches are not highlighted', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    const careerButton = page.locator('[data-filter="career"]');
    
    // Search for linux-specific term
    await searchInput.fill('bash');
    await page.waitForTimeout(200);
    
    // Career category should not be highlighted (assuming no bash in career)
    await expect(careerButton).not.toHaveClass(/category-match/);
  });

  test('highlighted category has pulsing animation', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    await searchInput.fill('linux');
    await page.waitForTimeout(200);
    
    const linuxButton = page.locator('[data-filter="linux"]');
    
    // Check for animation
    const animation = await linuxButton.evaluate(el => 
      window.getComputedStyle(el).animation
    );
    
    expect(animation).toMatch(/pulse|categoryPulse|category-pulse/i);
    expect(animation).toMatch(/infinite/);
  });

  test('highlighting removed when search cleared', async ({ page }) => {
    const searchInput = page.locator('#resources-search');
    const categoryButtons = page.locator('[data-filter]');
    
    // Apply highlighting
    await searchInput.fill('linux');
    await page.waitForTimeout(200);
    
    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);
    
    // Verify all highlights cleared
    const count = await categoryButtons.count();
    for (let i = 0; i < count; i++) {
      await expect(categoryButtons.nth(i)).not.toHaveClass(/category-match/);
    }
  });
});

