import { test, expect } from '@playwright/test';

test.describe('Guides Functionality - Core Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
  });

  test('should load guides from external JSON file', async ({ page }) => {
    // Navigate to resources page and filter by linux (which includes guides)
    await page.goto('http://localhost:8000/#/resources/linux');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Check if guides are displayed in resources - use more specific selectors
    await expect(page.locator('text=Linux Cheatsheet 1')).toBeVisible();
    await expect(page.locator('text=Getting Started with Linux')).toBeVisible();
    
    // Verify we have multiple guides - check total cards in grid instead of data-cat
    const guideCards = page.locator('#resources-grid > div');
    await expect(guideCards).toHaveCount(5); // 4 cheatsheets + 1 setup tips
  });

  test('should load guide content from HTML files', async ({ page }) => {
    // Navigate directly to a guide
    await page.goto('http://localhost:8000/#/guides/linux-cheatsheet-1.html');
    
    // Check if guide content loads
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Linux Cheatsheet 1')).toBeVisible();
    
    // Check if guide has proper content structure - use more specific selector
    await expect(page.locator('h2:has-text("File System")')).toBeVisible();
  });

  test('should work in production environment for guides', async ({ page }) => {
    // Test with production URL structure
    await page.goto('http://localhost:8000/#/guides/linux-cheatsheet-1.html');
    
    // Verify guide functionality works
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Linux Cheatsheet 1')).toBeVisible();
  });

  test('should load all guide types correctly', async ({ page }) => {
    await page.goto('http://localhost:8000/#/resources/linux');
    await page.waitForTimeout(2000);
    
    // Check that all expected guides are present
    await expect(page.locator('text=Getting Started with Linux - Day 1 Setup Tips')).toBeVisible();
    await expect(page.locator('text=Linux Cheatsheet 1')).toBeVisible();
    await expect(page.locator('text=Linux Cheatsheet 2')).toBeVisible();
    await expect(page.locator('text=Linux Cheatsheet 3')).toBeVisible();
    await expect(page.locator('text=Linux Cheatsheet 4')).toBeVisible();
  });

  test('should maintain proper URL structure for guides', async ({ page }) => {
    // Test direct guide access
    await page.goto('http://localhost:8000/#/guides/linux-cheatsheet-2.html');
    
    // Verify URL is correct
    expect(page.url()).toContain('#/guides/linux-cheatsheet-2.html');
    
    // Verify content loads
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1:has-text("Linux Cheatsheet 2")')).toBeVisible();
  });

  test('should handle JSON loading errors gracefully for guides', async ({ page }) => {
    // Mock a failed JSON request for guides
    await page.route('**/guides/guides.json', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not found' })
      });
    });
    
    await page.goto('http://localhost:8000/#/resources/linux');
    await page.waitForTimeout(2000);
    
    // Should still show other resources, just not guides
    await expect(page.locator('a:has-text("Resources")')).toBeVisible();
    // Guides should not be present due to loading error
    await expect(page.locator('text=Linux Cheatsheet 1')).not.toBeVisible();
  });

  test('should work with blog filter in resources', async ({ page }) => {
    await page.goto('http://localhost:8000/#/resources/blog');
    await page.waitForTimeout(2000);
    
    // Check if blog posts are displayed - use more specific selector
    await expect(page.locator('text=Level Up Your Resume')).toBeVisible();
    
    // Verify blog post is present
    const blogCard = page.locator('#resources-grid > div').first();
    await expect(blogCard).toBeVisible();
  });

  test('should maintain responsive design on mobile for guides', async ({ page }) => {
    page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:8000/#/resources/linux');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=Linux Cheatsheet 1')).toBeVisible();
    
    // Check if elements adapt to smaller screen
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('should support search functionality for guides', async ({ page }) => {
    await page.goto('http://localhost:8000/#/resources');
    await page.waitForTimeout(2000);
    
    // Search for a guide
    await page.fill('#resources-search', 'Linux');
    
    // Check if search results appear
    await expect(page.locator('#search-results-container')).toBeVisible();
    await expect(page.locator('#search-results').locator('text=Linux Cheatsheet 1')).toBeVisible();
  });
});
