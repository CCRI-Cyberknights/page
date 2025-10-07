import { test, expect } from '@playwright/test';

test.describe('Hashtag Functionality Demonstration', () => {
  test('should demonstrate hashtag click navigation to resources with search', async ({ page }) => {
    // Navigate to the blog post
    await page.goto('http://localhost:8000/#/blogs/microsoft-aws-ai-opportunities.html');
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Check that we're on the blog post page
    await expect(page.locator('h1')).toContainText('Level Up Your Resume');
    
    // Find the hashtag elements - they should be clickable links now
    const hashtagLinks = page.locator('a[href*="#/search"]');
    await expect(hashtagLinks).toHaveCount(6); // Should have 6 hashtag links
    
    // Click on the #microsoft hashtag
    const microsoftHashtag = page.locator('a[href*="#/search"]:has-text("#microsoft")');
    await microsoftHashtag.click();
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Verify we're now on the resources page
    await expect(page).toHaveURL(/.*#\/resources.*/);
    
    // Verify the search input has the hashtag value
    const searchInput = page.locator('#resources-search');
    await expect(searchInput).toHaveValue('microsoft');
    
    // Verify search results are showing
    const searchResults = page.locator('#search-results-container');
    await expect(searchResults).not.toHaveClass(/hidden/);
    
    // Verify the blog post appears in search results
    await expect(page.locator('text=Level Up Your Resume')).toBeVisible();
    
    console.log('✅ Hashtag click successfully navigated to resources page with search');
    console.log('✅ Search input populated with hashtag value');
    console.log('✅ Search results showing relevant content');
  });

  test('should demonstrate hashtag click in blog modal', async ({ page }) => {
    // Navigate to the blog page first
    await page.goto('http://localhost:8000/#/blog');
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Click on the blog post to open modal
    const blogPostCard = page.locator('text=Level Up Your Resume').first();
    await blogPostCard.click();
    
    // Wait for modal to open
    await page.waitForTimeout(1000);
    
    // Find hashtag in modal and click it
    const hashtagInModal = page.locator('#blog-modal a[href*="#/search"]:has-text("#aws")');
    await hashtagInModal.click();
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Verify we're on resources page with search
    await expect(page).toHaveURL(/.*#\/resources.*/);
    
    // Verify search input has the hashtag value
    const searchInput = page.locator('#resources-search');
    await expect(searchInput).toHaveValue('aws');
    
    console.log('✅ Modal hashtag click successfully navigated to resources page with search');
  });
});
