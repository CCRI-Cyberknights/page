import { test, expect } from '@playwright/test';

test.describe('Blog Navigation Bar', () => {
  test('should display blog navigation bar on home page', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Check if the blog navigation bar is visible (look for the specific span with amber text)
    await expect(page.locator('span.text-amber-400:has-text("Stay Updated")')).toBeVisible();
    
    // Check if the "View Latest Posts" button is visible
    await expect(page.locator('text=View Latest Posts')).toBeVisible();
    const viewBlogButton = page.locator('text=View Latest Posts');
    await expect(viewBlogButton).toHaveClass(/bg-amber-600/);
  });

  test('should navigate to blog page when clicking View Latest Posts', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Click on "View Latest Posts" button
    await page.locator('text=View Latest Posts').click();
    
    // Should navigate to blog page
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('http://localhost:8000/#/blog');
    
    // Should show blog page content
    await expect(page.locator('text=Updates & Blog')).toBeVisible();
  });

  test('should have blog navigation bar with amber styling', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Blog navigation bar should have amber colors
    const stayUpdated = page.locator('span.text-amber-400:has-text("Stay Updated")');
    await expect(stayUpdated).toBeVisible();
    
    // Check for icon presence (blog icon specifically)
    await expect(page.locator('text=Stay Updated').locator('..').locator('svg')).toBeVisible();
    
    // Check for amber button styling
    await expect(page.locator('text=View Latest Posts')).toHaveClass(/bg-amber-600/);
  });

  test('should be positioned within home page template only', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Blog navigation bar should be visible on home page
    await expect(page.locator('text=View Latest Posts')).toBeVisible();
    
    // Navigate to a different page to ensure it's not site-wide
    await page.goto('http://localhost:8000/#/blog');
    await page.waitForTimeout(2000);
    
    // Blog navigation bar should NOT be visible on other pages (check for the specific button)
    await expect(page.locator('text=View Latest Posts')).not.toBeVisible();
    
    // Navigate back to home to confirm it's still there
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);
    await expect(page.locator('text=View Latest Posts')).toBeVisible();
  });

  test('should have three core content boxes instead of fragmented sections', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Check for the three core boxes
    await expect(page.locator('text=A Thriving Technical Community')).toBeVisible();
    await expect(page.locator('text=🛠️ Hands-On Skills & Training')).toBeVisible();
    await expect(page.locator('text=🚀 Your Path to Tech: Our Members Get Hired')).toBeVisible();
    
    // Should not have the old fragmented section headers
    await expect(page.locator('text=Our Mission').locator('..').locator('h3')).not.toBeVisible();
    await expect(page.locator('text=What we do').locator('..').locator('h3')).not.toBeVisible();
  });

  test('should maintain consolidated content in three boxes', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Box 1: Thriving Technical Community
    const communityBox = page.locator('text=A Thriving Technical Community').locator('..');
    await expect(communityBox).toBeVisible();
    await expect(communityBox.locator('text=only computer club on campus')).toBeVisible();
    await expect(communityBox.locator('text=all skill levels')).toBeVisible();
    
    // Box 2: Skills & Training
    const skillsBox = page.locator('text=🛠️ Hands-On Skills & Training').locator('..');
    await expect(skillsBox).toBeVisible();
    await expect(skillsBox.locator('text=practical, hands-on experience')).toBeVisible();
    await expect(skillsBox.locator('text=National Cyber League')).toBeVisible();
    await expect(skillsBox.locator('text=Linux Command Line Interface')).toBeVisible();
    
    // Box 3: Career & Networking
    const careerBox = page.locator('text=🚀 Your Path to Tech: Our Members Get Hired').locator('..');
    await expect(careerBox).toBeVisible();
    await expect(careerBox.locator('text=successful employment')).toBeVisible();
    await expect(careerBox.locator('text=Industry Speakers')).toBeVisible();
    await expect(careerBox.locator('text=Major Networking Events')).toBeVisible();
  });
});