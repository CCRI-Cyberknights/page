/**
 * Baseline Functionality Tests - Pre-Refactoring
 * 
 * These tests capture the expected behavior of the application BEFORE
 * the modular architecture refactoring. They will be used to verify
 * that the refactoring maintains identical functionality.
 * 
 * Test Coverage:
 * - Navigation between all routes
 * - Resource page rendering and filtering
 * - Blog page rendering and navigation
 * - Search functionality
 * - Modal/expandable element behavior
 * - Version display
 * - Mobile responsiveness
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

test.describe('Baseline: Core Navigation', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(/Cyber Club/i);
  });

  test('should navigate to all main routes', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Test Resources route
    await page.click('a[data-route="resources"]');
    await expect(page).toHaveURL(/#\/resources/);
    await page.waitForSelector('#resources-grid', { state: 'visible', timeout: 5000 });
    await expect(page.locator('#resources-grid')).toBeVisible();
    
    // Test Linux route
    await page.click('a[data-route="linux"]');
    await expect(page).toHaveURL(/#\/linux/);
    
    // Test Calendar route
    await page.click('a[data-route="calendar"]');
    await expect(page).toHaveURL(/#\/calendar/);
    
    // Test Home route
    await page.click('a[data-route="home"]');
    await expect(page).toHaveURL(/#\/home/);
  });

  test('should update active navigation state', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click resources
    await page.click('a[data-route="resources"]');
    const resourcesLink = page.locator('a[data-route="resources"]');
    await expect(resourcesLink).toHaveClass(/active/);
    
    // Click linux
    await page.click('a[data-route="linux"]');
    const linuxLink = page.locator('a[data-route="linux"]');
    await expect(linuxLink).toHaveClass(/active/);
    await expect(resourcesLink).not.toHaveClass(/active/);
  });
});

test.describe('Baseline: Resources Page', () => {
  test('should render resources page with content', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    
    // Wait for content to load
    await page.waitForSelector('#resources-grid', { state: 'visible' });
    
    // Should have search input
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    
    // Should have filter buttons
    await expect(page.locator('button[data-filter="cyberknights"]')).toBeVisible();
    
    // Wait for resources to load and render
    await page.waitForTimeout(1000);
    
    // Should have resource cards
    const cards = page.locator('[data-resource-card]').or(page.locator('div[onclick*="openResourceModal"]'));
    await expect(cards.first()).toBeVisible();
  });

  test('should filter resources by category', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    await page.waitForSelector('#resources-grid', { state: 'visible' });
    
    // Wait for resources to load
    await page.waitForTimeout(1000);
    
    // Get initial card count
    const allCards = page.locator('[data-resource-card]').or(page.locator('div[onclick*="openResourceModal"]'));
    const initialCount = await allCards.count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Click a category filter
    const ccriFilter = page.locator('button[data-filter="ccri"]');
    await ccriFilter.click();
    await page.waitForTimeout(500); // Wait for filter animation
    
    // Cards should still be visible (but possibly filtered)
    await expect(allCards.first()).toBeVisible();
  });

  test('should search resources', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    await page.waitForSelector('#resources-grid', { state: 'visible' });
    await page.waitForTimeout(1000); // Wait for resources to load
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('hack');
    await page.waitForTimeout(500); // Wait for search to process
    
    // Should show results containing "hack"
    const cards = page.locator('[data-resource-card]').or(page.locator('div[onclick*="openResourceModal"]'));
    await expect(cards.first()).toBeVisible();
  });
});

test.describe('Baseline: Blog Functionality', () => {
  test('should render blogs page', async ({ page }) => {
    await page.goto(`${BASE_URL}#/blogs`);
    
    // Wait for blogs content
    await page.waitForSelector('#blogs-content', { state: 'visible', timeout: 10000 });
    
    // Should show blog posts or coming soon message
    const blogsContent = page.locator('#blogs-content');
    await expect(blogsContent).toBeVisible();
  });

  test('should load individual blog post', async ({ page }) => {
    await page.goto(`${BASE_URL}#/blogs`);
    await page.waitForSelector('#blogs-content', { state: 'visible', timeout: 10000 });
    
    // Find first blog post link
    const blogLink = page.locator('a[href*="#/blogs/"]').first();
    
    if (await blogLink.count() > 0) {
      await blogLink.click();
      await page.waitForTimeout(1000);
      
      // Should navigate to blog post
      await expect(page).toHaveURL(/#\/blogs\/.+/);
    }
  });
});

test.describe('Baseline: Search Functionality', () => {
  test('should perform global search', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Find global search input
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="Search"]')).first();
    
    if (await searchInput.count() > 0) {
      await searchInput.fill('cybersecurity');
      await page.keyboard.press('Enter');
      
      // Should navigate to search results
      await expect(page).toHaveURL(/search\?q=/);
    }
  });
});

test.describe('Baseline: Version Display', () => {
  test('should display version information', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for version to load
    await page.waitForTimeout(2000);
    
    // Version should be visible somewhere in footer or header
    const versionText = page.locator('text=/v?\\d+\\.\\d+\\.\\d+/').first();
    
    if (await versionText.count() > 0) {
      await expect(versionText).toBeVisible();
    }
  });
});

test.describe('Baseline: Expandable Elements', () => {
  test('should expand clickable elements', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    await page.waitForSelector('#resources-grid', { state: 'visible' });
    
    // Find expandable elements (images, cards with data-expand attribute)
    const expandable = page.locator('[data-expand]').or(page.locator('img[data-expand]')).first();
    
    if (await expandable.count() > 0) {
      // Click to expand
      await expandable.click();
      
      // Overlay should appear
      const overlay = page.locator('.expand-overlay').or(page.locator('[data-overlay]'));
      await expect(overlay.first()).toBeVisible({ timeout: 2000 });
      
      // Close overlay (ESC or click close button)
      await page.keyboard.press('Escape');
      await expect(overlay.first()).not.toBeVisible({ timeout: 2000 });
    }
  });
});

test.describe('Baseline: Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size
  
  test('should render mobile navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Navigation should be visible and functional on mobile
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Should be able to click nav items
    await page.click('a[data-route="resources"]');
    await expect(page).toHaveURL(/#\/resources/);
  });

  test('should display mobile-friendly layout', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    await page.waitForSelector('#resources-grid', { state: 'visible' });
    
    // Content should be visible and not cut off
    const content = page.locator('#resources-grid');
    await expect(content).toBeVisible();
    
    // Check that content doesn't overflow viewport
    const boundingBox = await content.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });
});

test.describe('Baseline: Error Handling', () => {
  test('should handle invalid routes gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}#invalid-route-12345`);
    
    // Should either redirect to home or show 404
    // The app should still be functional
    await expect(page.locator('body')).toBeVisible();
    
    // Navigation should still work
    await page.click('a[data-route="home"]');
    await expect(page).toHaveURL(/#\/home/);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Block JSON requests to simulate network issues
    await page.route('**/*.json', route => route.abort());
    
    await page.goto(`${BASE_URL}#/resources`);
    
    // Page should still load even if data fails
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Baseline: Performance', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should navigate between routes quickly', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const startTime = Date.now();
    await page.click('a[data-route="resources"]');
    await page.waitForSelector('#resources-grid', { state: 'visible' });
    const navTime = Date.now() - startTime;
    
    // Route navigation should be quick (under 2 seconds)
    expect(navTime).toBeLessThan(2000);
  });
});
