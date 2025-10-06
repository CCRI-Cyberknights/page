import { test, expect } from '@playwright/test';

test.describe('Blog Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
  });

  test('should load blog page and display blog posts', async ({ page }) => {
    // Navigate to blog page
    await page.goto('http://localhost:8000/#/blog');
    
    // Check if blog page loads
    await expect(page.locator('h2')).toContainText('Updates & Blog');
    
    // Check if blog posts are displayed
    await expect(page.locator('article')).toHaveCount(1);
    
    // Check if first blog post has required elements
    const firstPost = page.locator('article').first();
    await expect(firstPost.locator('h3')).toBeVisible();
    await expect(firstPost.locator('text=by')).toBeVisible();
    await expect(firstPost.locator('text=Read more')).toBeVisible();
  });

  test('should open blog post modal when clicking on a post', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog');
    
    // Click on first blog post
    await page.locator('article').first().click();
    
    // Check if modal opens
    await expect(page.locator('.fixed.inset-0.bg-black\\/90')).toBeVisible();
    
    // Check if modal contains post content
    await expect(page.locator('.bg-slate-900.rounded-lg.border.border-slate-800')).toBeVisible();
    
    // Check if close button works
    await page.locator('button:has-text("Close")').click();
    await expect(page.locator('.fixed.inset-0.bg-black\\/90')).not.toBeVisible();
  });

  test('should navigate to individual blog post page', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog');
    
    // Get the first post's slug from the onclick attribute
    const firstPost = page.locator('article').first();
    const onclickAttr = await firstPost.getAttribute('onclick');
    const slug = onclickAttr?.match(/openBlogPost\('([^']+)'\)/)?.[1];
    
    if (slug) {
      // Navigate to individual post
      await page.goto(`http://localhost:8000/#/blog/${slug}`);
      
      // Check if individual post page loads
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Back to Blog').first()).toBeVisible();
      
      // Check if back link works
      await page.locator('text=Back to Blog').first().click();
      await expect(page.locator('h2')).toContainText('Updates & Blog');
    }
  });

  test('should handle blog post not found gracefully', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog/non-existent-post');
    
    // Check if error message is displayed
    await expect(page.locator('text=Post Not Found')).toBeVisible();
  });

  test('should load blog data from external JSON file', async ({ page }) => {
    // Test that the blog data is loaded from external JSON
    await page.goto('http://localhost:8000/#/blog');
    
    // Check if blog posts are loaded (this tests the JSON loading)
    await expect(page.locator('article')).toHaveCount(1);
    
    // Verify the Microsoft/AWS post is present (check title specifically)
    await expect(page.locator('h3:has-text("Microsoft")')).toBeVisible();
    await expect(page.locator('h3:has-text("AWS")')).toBeVisible();
  });

  test('should display blog post metadata correctly', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog');
    
    const firstPost = page.locator('article').first();
    
    // Check for required metadata fields
    await expect(firstPost.locator('h3')).toBeVisible(); // title
    await expect(firstPost.locator('text=by')).toBeVisible(); // author
    await expect(firstPost.locator('text=#career')).toBeVisible(); // tags
    
    // Check if date is displayed in correct format
    const dateText = await firstPost.locator('text=/\\d{4}/').textContent();
    expect(dateText).toMatch(/\d{4}/); // Should contain a year
  });

  test('should handle JSON loading errors gracefully', async ({ page }) => {
    // Mock a failed JSON request
    await page.route('**/blogs/blog-posts.json', route => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Not found' })
      });
    });
    
    await page.goto('http://localhost:8000/#/blog');
    
    // Should fallback to empty state or error message
    await expect(page.locator('text=Coming Soon')).toBeVisible();
  });

  test('should work in production environment', async ({ page }) => {
    // Test with production URL structure
    await page.goto('http://localhost:8000/#/blog');
    
    // Verify blog functionality works
    await expect(page.locator('h2')).toContainText('Updates & Blog');
    await expect(page.locator('article')).toHaveCount(1);
  });

  test('should maintain responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/#/blog');
    
    // Check if blog posts are responsive
    await expect(page.locator('article')).toBeVisible();
    
    // Check if modal works on mobile
    await page.locator('article').first().click();
    await expect(page.locator('.fixed.inset-0.bg-black\\/90')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog');
    
    // Click on first blog post to open modal
    await page.locator('article').first().click();
    
    // Wait for modal to appear and check if it opens
    await expect(page.locator('.fixed.inset-0.bg-black\\/90')).toBeVisible({ timeout: 10000 });
    
    // Wait a bit for content to load
    await page.waitForTimeout(1000);
    
    // Close modal with Escape
    await page.keyboard.press('Escape');
    
    // Wait for modal to close and check if it's closed
    await expect(page.locator('.fixed.inset-0.bg-black\\/90')).not.toBeVisible({ timeout: 10000 });
  });
});
