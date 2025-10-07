import { test, expect } from '@playwright/test';

test.describe('Blog Hashtag Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
  });

  test('should make hashtags clickable in blog posts', async ({ page }) => {
    // Navigate to blog post
    await page.goto('http://localhost:8000/#/blog/microsoft-aws-ai-opportunities');
    
    // Wait for blog post to load
    await page.waitForSelector('#blogs-content', { timeout: 10000 });
    
    // Check that hashtags are clickable (converted to links)
    const clickableHashtags = page.locator('#blogs-content a[href*="#/search"]');
    await expect(clickableHashtags).toHaveCount(6);
    
    // Verify specific hashtags are present
    await expect(page.locator('#blogs-content a:has-text("#career")')).toBeVisible();
    await expect(page.locator('#blogs-content a:has-text("#microsoft")')).toBeVisible();
    await expect(page.locator('#blogs-content a:has-text("#aws")')).toBeVisible();
  });

  test('should navigate to search endpoint when hashtag is clicked', async ({ page }) => {
    // Navigate to blog post
    await page.goto('http://localhost:8000/#/blog/microsoft-aws-ai-opportunities');
    
    // Wait for blog post to load
    await page.waitForSelector('#blogs-content', { timeout: 10000 });
    
    // Click on a hashtag
    const careerHashtag = page.locator('#blogs-content a:has-text("#career")').first();
    await careerHashtag.click();
    
    // Should navigate to resources page (search endpoint renders resources page)
    await expect(page).toHaveURL(/.*#\/resources/);
    
    // Wait a bit for the search to be triggered
    await page.waitForTimeout(200);
    
    // Should have search input with hashtag text
    const searchInput = page.locator('#resources-search');
    await expect(searchInput).toHaveValue('career');
  });

  test('should trigger search when hashtag is clicked', async ({ page }) => {
    // Navigate to blog post
    await page.goto('http://localhost:8000/#/blog/microsoft-aws-ai-opportunities');
    
    // Wait for blog post to load
    await page.waitForSelector('#blogs-content', { timeout: 10000 });
    
    // Click on a hashtag
    const microsoftHashtag = page.locator('#blogs-content a:has-text("#microsoft")').first();
    await microsoftHashtag.click();
    
    // Should navigate to resources page
    await expect(page).toHaveURL(/.*#\/resources/);
    
    // Wait a bit for the search to be triggered
    await page.waitForTimeout(200);
    
    // Should show search results
    await page.waitForSelector('#search-results-container', { state: 'visible', timeout: 5000 });
    
    // Check that search results are displayed
    const searchResults = page.locator('#search-results');
    await expect(searchResults).toBeVisible();
  });

  test('should make hashtags clickable in blog modal', async ({ page }) => {
    // Navigate to blogs page
    await page.goto('http://localhost:8000/#/blog');
    
    // Wait for blog posts to load
    await page.waitForSelector('[onclick*="openBlogPost"]', { timeout: 10000 });
    
    // Click on a blog post to open modal
    const blogPost = page.locator('[onclick*="openBlogPost"]').first();
    await blogPost.click();
    
    // Wait for modal to appear
    await page.waitForSelector('.fixed.inset-0.bg-black\\/90', { timeout: 10000 });
    
    // Check that hashtags in modal are clickable
    const modalHashtags = page.locator('.fixed.inset-0.bg-black\\/90 a[href*="#/search"]');
    await expect(modalHashtags).toHaveCount(6);
  });

  test('should close modal and navigate to resources when modal hashtag is clicked', async ({ page }) => {
    // Navigate to blogs page
    await page.goto('http://localhost:8000/#/blog');
    
    // Wait for blog posts to load
    await page.waitForSelector('[onclick*="openBlogPost"]', { timeout: 10000 });
    
    // Click on a blog post to open modal
    const blogPost = page.locator('[onclick*="openBlogPost"]').first();
    await blogPost.click();
    
    // Wait for modal to appear
    await page.waitForSelector('.fixed.inset-0.bg-black\\/90', { timeout: 10000 });
    
    // Click on a hashtag in modal
    const awsHashtag = page.locator('.fixed.inset-0.bg-black\\/90 a:has-text("#aws")').first();
    await awsHashtag.click();
    
    // Modal should be closed
    await expect(page.locator('.fixed.inset-0.bg-black\\/90')).not.toBeVisible();
    
    // Should navigate to resources page
    await expect(page).toHaveURL(/.*#\/resources/);
    
    // Wait a bit for the search to be triggered
    await page.waitForTimeout(200);
    
    // Should have search input with hashtag text
    const searchInput = page.locator('#resources-search');
    await expect(searchInput).toHaveValue('aws');
  });
});
