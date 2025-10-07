import { test, expect } from '@playwright/test';

test.describe('Blog Section Redesign', () => {
  test('should display blog section on home page', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Check if the blog section is visible
    await expect(page.locator('text=Updates & Blog')).toBeVisible();
    
    // Check if the "View Blog" button is visible
    await expect(page.locator('text=View Blog')).toBeVisible();
    const viewBlogButton = page.locator('text=View Blog');
    await expect(viewBlogButton).toHaveClass(/bg-amber-600/);
  });

  test('should navigate to blog page when clicking View Blog', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Click on "View Blog" button
    await page.locator('text=View Blog').click();
    
    // Should navigate to blog page
    await page.waitForTimeout(1000);
    expect(page.url()).toBe('http://localhost:8000/#/blog');
    
    // Should show blog page content
    await expect(page.locator('text=Updates & Blog')).toBeVisible();
  });

  test('should not have blog button in Get Involved section', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Check that "Updates & Blog" is NOT in the Get Involved section
    const getInvolvedSection = page.locator('text=Get involved').locator('..');
    await expect(getInvolvedSection).toBeVisible();
    
    // Should not contain the old blog button
    await expect(getInvolvedSection.locator('text=Updates & Blog')).not.toBeVisible();
    
    // Should still have other buttons
    await expect(getInvolvedSection.locator('text=Club Calendar')).toBeVisible();
    await expect(getInvolvedSection.locator('text=Competitions')).toBeVisible();
  });

  test('should have blog section with amber styling', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Blog section should have amber colors
    const blogTitle = page.locator('text=Updates & Blog');
    await expect(blogTitle).toBeVisible();
    
    // Check that it has amber text color
    await expect(blogTitle).toHaveClass(/text-amber-400/);
    
    // Check for icon presence (blog icon specifically)
    await expect(page.locator('text=Updates & Blog').locator('..').locator('svg')).toBeVisible();
    
    // Check for amber button styling
    await expect(page.locator('text=View Blog')).toHaveClass(/bg-amber-600/);
  });

  test('should be positioned after Get Involved section', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await page.waitForTimeout(2000);

    // Get Involved section should be visible
    await expect(page.locator('text=Get involved')).toBeVisible();
    
    // Blog section should be visible
    await expect(page.locator('text=Updates & Blog')).toBeVisible();
    
    // Blog section should appear after Get Involved section
    const getInvolvedSection = page.locator('text=Get involved').locator('../../../..');
    const blogSection = page.locator('text=Updates & Blog').locator('../../../..');
    
    // Check that blog section comes after Get Involved in DOM order
    const getInvolvedBox = await getInvolvedSection.boundingBox();
    const blogBox = await blogSection.boundingBox();
    
    if (getInvolvedBox && blogBox) {
      expect(blogBox.y).toBeGreaterThan(getInvolvedBox.y);
    }
  });
});