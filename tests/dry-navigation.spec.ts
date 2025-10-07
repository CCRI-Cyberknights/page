import { test, expect } from '@playwright/test';

test.describe('DRY Navigation Pattern', () => {
  test('should have consistent Back to Blog navigation in blog posts', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog/microsoft-aws-ai-opportunities');
    await page.waitForTimeout(2000);

    // Check for Back to Blog link with proper styling
    const backToBlogLink = page.locator('text=Back to Blog');
    await expect(backToBlogLink).toBeVisible();
    
    // Check link has proper href
    await expect(backToBlogLink).toHaveAttribute('href', '#/blog');
    
    // Check link has proper styling classes
    await expect(backToBlogLink).toHaveClass(/text-emerald-400/);
    await expect(backToBlogLink).toHaveClass(/hover:text-emerald-300/);
  });

  test('should have consistent Back to Linux Guide navigation in guides', async ({ page }) => {
    await page.goto('http://localhost:8000/#/guides/linux-day-1-setup-tips.html');
    await page.waitForTimeout(2000);

    // Check for Back to Linux Learner's Guide link
    const backToGuideLink = page.locator('text=Back to Linux Learner\'s Guide');
    await expect(backToGuideLink).toBeVisible();
    
    // Check link has proper href
    await expect(backToGuideLink).toHaveAttribute('href', '#/resources/linux');
    
    // Check link has proper styling classes
    await expect(backToGuideLink).toHaveClass(/text-emerald-400/);
    await expect(backToGuideLink).toHaveClass(/hover:text-emerald-300/);
  });

  test('should have consistent Back to Calendar navigation', async ({ page }) => {
    await page.goto('http://localhost:8000/#/map-warwick-4080');
    await page.waitForTimeout(2000);

    // Check for Back to Calendar link
    const backToCalendarLink = page.locator('text=Back to Calendar');
    await expect(backToCalendarLink).toBeVisible();
    
    // Check link has proper href
    await expect(backToCalendarLink).toHaveAttribute('href', '#/calendar');
    
    // Check link has proper styling classes
    await expect(backToCalendarLink).toHaveClass(/text-emerald-400/);
    await expect(backToCalendarLink).toHaveClass(/hover:text-emerald-300/);
  });

  test('should have consistent Back to Club Home navigation with neon-surge styling', async ({ page }) => {
    await page.goto('http://localhost:8000/#/resources');
    await page.waitForTimeout(2000);

    // Check for Back to Club Home link
    const backToHomeLink = page.locator('text=Back to Club Home');
    await expect(backToHomeLink).toBeVisible();
    
    // Check link has proper href
    await expect(backToHomeLink).toHaveAttribute('href', '#/home');
    
    // Check link has neon-surge styling (no arrow, different class)
    await expect(backToHomeLink).toHaveClass(/neon-surge-link/);
    await expect(backToHomeLink).toHaveClass(/transition-opacity/);
  });

  test('should have proper error navigation in blog error states', async ({ page }) => {
    await page.goto('http://localhost:8000/#/blog/non-existent-post');
    await page.waitForTimeout(2000);

    // Check for error message
    await expect(page.locator('text=Post Not Found')).toBeVisible();
    
    // Check for Back to Blog error navigation
    const errorBackLink = page.locator('text=Back to Blog');
    await expect(errorBackLink).toBeVisible();
    
    // Check link has proper href
    await expect(errorBackLink).toHaveAttribute('href', '#/blog');
    
    // Check link has proper styling classes
    await expect(errorBackLink).toHaveClass(/text-emerald-400/);
    await expect(errorBackLink).toHaveClass(/hover:text-emerald-300/);
    await expect(errorBackLink).toHaveClass(/inline-flex/);
    await expect(errorBackLink).toHaveClass(/items-center/);
  });

  test('should have additional links in Linux guide navigation', async ({ page }) => {
    await page.goto('http://localhost:8000/#/guides/linux-day-1-setup-tips.html');
    await page.waitForTimeout(2000);

    // Check for Back to Linux Learner's Guide link
    await expect(page.locator('text=Back to Linux Learner\'s Guide')).toBeVisible();
    
    // Check for additional Linux Boot Guide link
    await expect(page.locator('text=Linux Boot Guide')).toBeVisible();
    
    // Check separator bullet point
    await expect(page.locator('.mx-2')).toBeVisible();
  });

  test('should have Back to Club Home navigation on resources page', async ({ page }) => {
    await page.goto('http://localhost:8000/#/resources');
    await page.waitForTimeout(2000);

    // Check for Back to Club Home link
    await expect(page.locator('text=Back to Club Home')).toBeVisible();
    
    // Check link has proper href
    await expect(page.locator('text=Back to Club Home')).toHaveAttribute('href', '#/home');
    
    // Check link has neon-surge styling
    await expect(page.locator('text=Back to Club Home')).toHaveClass(/neon-surge-link/);
  });
});
