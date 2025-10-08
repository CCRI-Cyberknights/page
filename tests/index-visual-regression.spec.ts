import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for index.html Refactoring
 * 
 * These tests capture visual snapshots BEFORE the Tailwind refactoring
 * and compare them AFTER to ensure no visual changes occur.
 * 
 * Run BEFORE refactoring to create baseline snapshots:
 *   npm run test:visual-baseline
 * 
 * Run AFTER refactoring to compare:
 *   npm run test:visual-regression
 * 
 * If tests fail, review diff images in test-results/
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:8000';

test.describe('Visual Regression: Home Page', () => {
  test('home page full viewport', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(1000);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page-full.png', {
      fullPage: true,
      maxDiffPixels: 100, // Allow minor anti-aliasing differences
    });
  });

  test('home page above fold', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(1000);
    
    // Take viewport screenshot
    await expect(page).toHaveScreenshot('home-page-viewport.png', {
      maxDiffPixels: 100,
    });
  });

  test('header and navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(500);
    
    const header = page.locator('header').first();
    await expect(header).toHaveScreenshot('header-navigation.png', {
      maxDiffPixels: 50,
    });
  });

  test('footer with QR code', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(1000);
    
    const footer = page.locator('footer').first();
    await expect(footer).toHaveScreenshot('footer-qr.png', {
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression: Resources Page', () => {
  test('resources page full view', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    
    // Wait for resources to load
    await page.waitForFunction(() => {
      const grid = document.getElementById('resources-grid');
      return grid && grid.children.length > 0;
    }, { timeout: 10000 });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('resources-page-full.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('resources grid and cards', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    
    // Wait for resources to load
    await page.waitForFunction(() => {
      const grid = document.getElementById('resources-grid');
      return grid && grid.children.length > 0;
    }, { timeout: 10000 });
    
    await page.waitForTimeout(500);
    
    const grid = page.locator('#resources-grid');
    await expect(grid).toHaveScreenshot('resources-grid.png', {
      maxDiffPixels: 100,
    });
  });

  test('filter buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    await page.waitForTimeout(500);
    
    const filters = page.locator('.flex.flex-wrap.gap-2.text-xs').first();
    await expect(filters).toHaveScreenshot('filter-buttons.png', {
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression: Linux Page', () => {
  test('linux page full view', async ({ page }) => {
    await page.goto(`${BASE_URL}#/linux`);
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('linux-page-full.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression: Calendar Page', () => {
  test('calendar page full view', async ({ page }) => {
    await page.goto(`${BASE_URL}#/calendar`);
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('calendar-page-full.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression: Navigation States', () => {
  test('navigation active state - home', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(500);
    
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('nav-active-home.png', {
      maxDiffPixels: 50,
    });
  });

  test('navigation active state - resources', async ({ page }) => {
    await page.goto(`${BASE_URL}#/resources`);
    await page.waitForTimeout(500);
    
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('nav-active-resources.png', {
      maxDiffPixels: 50,
    });
  });

  test('navigation active state - linux', async ({ page }) => {
    await page.goto(`${BASE_URL}#/linux`);
    await page.waitForTimeout(500);
    
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('nav-active-linux.png', {
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression: Mobile Views', () => {
  test('mobile home page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('mobile-home.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('mobile resources page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}#/resources`);
    
    // Wait for resources to load
    await page.waitForFunction(() => {
      const grid = document.getElementById('resources-grid');
      return grid && grid.children.length > 0;
    }, { timeout: 10000 });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('mobile-resources.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(500);
    
    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('mobile-nav.png', {
      maxDiffPixels: 50,
    });
  });
});

test.describe('Visual Regression: Color Verification', () => {
  test('emphasis text should be ember-spark orange', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(500);
    
    const emphasis = page.locator('.emphasis-text').first();
    if (await emphasis.count() > 0) {
      await expect(emphasis).toHaveScreenshot('emphasis-text-color.png', {
        maxDiffPixels: 10,
      });
    }
  });

  test('primary buttons should be emerald green', async ({ page }) => {
    await page.goto(`${BASE_URL}#/home`);
    await page.waitForTimeout(500);
    
    const button = page.locator('a.bg-emerald-500, button.bg-emerald-500').first();
    if (await button.count() > 0) {
      await expect(button).toHaveScreenshot('primary-button.png', {
        maxDiffPixels: 10,
      });
    }
  });
});

