import { test, expect } from '@playwright/test';

test.describe('Mobile Back Button Functionality', () => {
  test('should close modals when mobile back button is pressed', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:8000/');
    await page.waitForLoadState('networkidle');
    
    // Test image modal
    await test.step('Test image modal mobile back button', async () => {
      // Click on an image to open modal
      const image = page.locator('img[onclick*="expandElement"]').first();
      await expect(image).toBeVisible();
      await image.click();
      
      // Verify modal is open
      const modal = page.locator('.expand-overlay');
      await expect(modal).toBeVisible();
      
      // Simulate mobile back button press
      await page.goBack();
      
      // Verify modal is closed
      await expect(modal).not.toBeVisible();
    });
    
    // Test resource card modal
    await test.step('Test resource card modal mobile back button', async () => {
      // Navigate to resources page
      await page.goto('http://localhost:8000/#/resources');
      await page.waitForLoadState('networkidle');
      
      // Click on a resource card
      const resourceCard = page.locator('#resources-grid > div').first();
      await expect(resourceCard).toBeVisible();
      await resourceCard.click();
      
      // Verify resource modal is open
      const resourceModal = page.locator('.expand-overlay');
      await expect(resourceModal).toBeVisible();
      
      // Simulate mobile back button press
      await page.goBack();
      
      // Verify resource modal is closed
      await expect(resourceModal).not.toBeVisible();
    });
  });
  
  test('should handle multiple modal opens/closes with back button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/');
    await page.waitForLoadState('networkidle');
    
    // Open first modal
    const image = page.locator('img[onclick*="expandElement"]').first();
    await image.click();
    await expect(page.locator('.expand-overlay')).toBeVisible();
    
    // Close with back button
    await page.goBack();
    await expect(page.locator('.expand-overlay')).not.toBeVisible();
    
    // Open second modal
    await image.click();
    await expect(page.locator('.expand-overlay')).toBeVisible();
    
    // Close with back button again
    await page.goBack();
    await expect(page.locator('.expand-overlay')).not.toBeVisible();
    
    // Verify we're back to the original page
    expect(page.url()).toContain('localhost:8000');
  });
  
  test('should not interfere with normal page navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:8000/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to resources page
    await page.click('a[href="#/resources"]');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('#/resources');
    
    // Open modal
    const resourceCard = page.locator('#resources-grid > div').first();
    await resourceCard.click();
    await expect(page.locator('.expand-overlay')).toBeVisible();
    
    // Close modal with back button
    await page.goBack();
    await expect(page.locator('.expand-overlay')).not.toBeVisible();
    
    // Verify we're still on resources page
    expect(page.url()).toContain('#/resources');
    
    // Navigate to calendar page
    await page.click('a[href="#/calendar"]');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('#/calendar');
  });
});
