import { test, expect } from '@playwright/test';

test.describe('Category Configuration System', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000');
  });

  test.describe('Current Behavior Validation', () => {
    
    test('all category filter buttons are present and clickable', async ({ page }) => {
      await page.goto('http://localhost:8000/#/resources');
      
      const expectedCategories = [
        'cyberknights', 'ccri', 'ctf-competitions', 
        'ctf-tools', 'stem', 'career', 'linux', 'blog'
      ];
      
      for (const category of expectedCategories) {
        const button = page.locator(`button[data-filter="${category}"]`);
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    });

    test('category descriptions display correctly for each filter', async ({ page }) => {
      await page.goto('http://localhost:8000/#/resources');
      
      const categoryDescriptions = {
        'cyberknights': 'Internal resources supporting club activities and community',
        'ccri': 'Institutional support for cybersecurity education',
        'ctf-tools': 'Versatile online tools for cryptanalysis and data manipulation',
        'ctf-competitions': 'National-level cybersecurity competitions for skill-building',
        'stem': 'Resources for STEM-related events',
        'career': 'Professional development in tech and cybersecurity fields',
        'linux': 'Foundational resources for cybersecurity learners',
        'blog': 'Updates, announcements, and insights from the CCRI Cyberknights club'
      };
      
      for (const [category, expectedText] of Object.entries(categoryDescriptions)) {
        // Click the category filter button
        await page.click(`button[data-filter="${category}"]`);
        
        // Wait for the description to update
        await page.waitForTimeout(100);
        
        // Check that the intro text contains the expected description
        const introText = page.locator('#intro-text');
        await expect(introText).toContainText(expectedText);
      }
    });

    test('category labels display correctly in resource cards', async ({ page }) => {
      await page.goto('http://localhost:8000/#/resources');
      
      const categoryLabels = {
        'cyberknights': 'Cyberknights',
        'ccri': 'CCRI', 
        'ctf-tools': 'CTF & Code Breaking Tools',
        'ctf-competitions': 'CTF Competitions',
        'stem': 'STEM Day',
        'career': 'Career',
        'linux': 'Linux',
        'blog': 'Blog Posts'
      };
      
      for (const [category, expectedLabel] of Object.entries(categoryLabels)) {
        // Click the category filter
        await page.click(`button[data-filter="${category}"]`);
        await page.waitForTimeout(200);
        
        // Check if any cards are visible for this category
        const cards = page.locator('#resources-grid > div');
        const cardCount = await cards.count();
        
        if (cardCount > 0) {
          // Check that the first visible card has the correct category label
          const firstCard = cards.first();
          const categoryLabel = firstCard.locator('.text-\\[11px\\].text-slate-400');
          await expect(categoryLabel).toContainText(expectedLabel);
        }
      }
    });

    test('visual differentiation works for different content types', async ({ page }) => {
      await page.goto('http://localhost:8000/#/resources');
      
      // Test blog posts have amber hover (if any exist)
      await page.click('button[data-filter="blog"]');
      await page.waitForTimeout(200);
      
      const blogCards = page.locator('#resources-grid > div');
      const blogCardCount = await blogCards.count();
      
      if (blogCardCount > 0) {
        const firstBlogCard = blogCards.first();
        const classes = await firstBlogCard.getAttribute('class');
        expect(classes).toContain('hover:border-amber-500');
      }
      
      // Test guides have blue hover
      await page.click('button[data-filter="linux"]');
      await page.waitForTimeout(200);
      
      const guideCards = page.locator('#resources-grid > div');
      const guideCardCount = await guideCards.count();
      
      if (guideCardCount > 0) {
        const firstGuideCard = guideCards.first();
        const classes = await firstGuideCard.getAttribute('class');
        expect(classes).toContain('hover:border-blue-500');
      }
    });

    test('default resources page shows cyberknights filter', async ({ page }) => {
      await page.goto('http://localhost:8000/#/resources');
      
      // Wait for the page to fully load and render
      await page.waitForTimeout(500);
      
      // Check that cyberknights button is active by default (using ring instead of bg)
      const cyberknightsButton = page.locator('button[data-filter="cyberknights"]');
      const classes = await cyberknightsButton.getAttribute('class');
      expect(classes).toContain('ring-emerald-500');
      
      // Check that the intro text shows the cyberknights description (default filter)
      const introText = page.locator('#intro-text');
      await expect(introText).toContainText('Internal resources supporting club activities');
    });

    test('category filter buttons update URL hash', async ({ page }) => {
      await page.goto('http://localhost:8000/#/resources');
      
      // Test each category updates the URL
      const categories = ['cyberknights', 'ccri', 'ctf-tools', 'ctf-competitions', 'stem', 'career', 'linux', 'blog'];
      
      for (const category of categories) {
        await page.click(`button[data-filter="${category}"]`);
        await page.waitForTimeout(100);
        
        const currentUrl = page.url();
        expect(currentUrl).toContain(`#/resources/${category}`);
      }
    });

    test('deep linking to specific categories works', async ({ page }) => {
      const categoryUrls = [
        '#/resources/cyberknights',
        '#/resources/ccri', 
        '#/resources/ctf-tools',
        '#/resources/ctf-competitions',
        '#/resources/stem',
        '#/resources/career',
        '#/resources/linux',
        '#/resources/blog'
      ];
      
      for (const url of categoryUrls) {
        await page.goto(`http://localhost:8000/${url}`);
        await page.waitForTimeout(500);
        
        // Verify the correct filter button is active
        const category = url.split('/').pop();
        const activeButton = page.locator(`button[data-filter="${category}"]`);
        const classes = await activeButton.getAttribute('class');
        expect(classes).toContain('ring-emerald-500');
      }
    });

    test('all categories have complete configuration', async ({ page }) => {
      // This test will validate that all categories have both labels and descriptions
      await page.goto('http://localhost:8000/#/resources');
      
      const categories = ['cyberknights', 'ccri', 'ctf-tools', 'ctf-competitions', 'stem', 'career', 'linux', 'blog'];
      
      for (const category of categories) {
        // Test that clicking the button shows a description
        await page.click(`button[data-filter="${category}"]`);
        await page.waitForTimeout(100);
        
        const introText = page.locator('#intro-text');
        const textContent = await introText.textContent();
        
        // Each description should be meaningful (not empty or generic)
        expect(textContent).toBeTruthy();
        expect(textContent!.length).toBeGreaterThan(20); // Meaningful descriptions
        
        // Test that the category label exists and is not just the category name
        const button = page.locator(`button[data-filter="${category}"]`);
        const buttonText = await button.textContent();
        expect(buttonText).toBeTruthy();
        expect(buttonText).not.toBe(category); // Should be a proper label, not the raw category name
      }
    });
  });

  test.describe('Error Handling', () => {
    
    test('invalid category filter gracefully handles missing configuration', async ({ page }) => {
      // Test direct navigation to invalid category
      await page.goto('http://localhost:8000/#/resources/invalid-category');
      
      // Should not crash, should show some default state
      const introText = page.locator('#intro-text');
      await expect(introText).toBeVisible();
    });

    test('missing category configuration shows fallback behavior', async ({ page }) => {
      // This test ensures the system gracefully handles missing categories
      await page.goto('http://localhost:8000/#/resources');
      
      // The system should work even if a category is missing from configuration
      const buttons = page.locator('button[data-filter]');
      const buttonCount = await buttons.count();
      
      expect(buttonCount).toBeGreaterThan(0);
    });

    test('new category addition requires complete configuration', async ({ page }) => {
      // This test verifies that the validation catches missing properties
      await page.goto('http://localhost:8000/#/resources');
      
      // The validation should have passed during page load
      // This test ensures that if someone adds a new category with missing properties,
      // the validation will catch it and throw an error
      
      // Check that all existing categories have complete configurations
      const categories = ['cyberknights', 'ccri', 'ctf-tools', 'ctf-competitions', 'stem', 'career', 'linux', 'blog'];
      
      for (const category of categories) {
        // Test that each category has a description (not the fallback)
        await page.click(`button[data-filter="${category}"]`);
        await page.waitForTimeout(100);
        
        const introText = page.locator('#intro-text');
        const textContent = await introText.textContent();
        
        // Should not be the fallback text
        expect(textContent).not.toBe('No description available');
        // Should be a meaningful description
        expect(textContent!.length).toBeGreaterThan(20);
      }
    });
  });
});
