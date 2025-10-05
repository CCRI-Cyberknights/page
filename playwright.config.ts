// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Comprehensive Testing
 * 
 * This configuration is optimized for:
 * - Versioning pipeline validation
 * - File system and git history checks
 * - Live site deployment verification
 * - Diagnostic reporting
 * - Cross-browser compatibility testing
 * - Mobile device emulation (including Pixel 7a)
 */
export default defineConfig({
  testDir: './tests',
  
  // Run tests in parallel for faster execution
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'tests/playwright-report' }],
    ['json', { outputFile: 'tests/test-results/versioning-results.json' }],
    ['list']
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for live site tests
    baseURL: 'https://ccri-cyberknights.github.io/page',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Output directory for test artifacts
    outputDir: 'tests/test-results',
  },

  // Configure projects for major browsers and mobile devices
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'pixel-7a',
      use: {
        viewport: { width: 414, height: 794 }, // Pixel 7a CSS viewport (actual browser viewport)
        deviceScaleFactor: 2.61,               // Actual DPR from whatismyviewport.com
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        // US-specific defaults for realistic testing
        locale: 'en-US',
        timezoneId: 'America/New_York',
        geolocation: { latitude: 41.8236, longitude: -71.4222 }, // Providence, RI (CCRI location)
        permissions: ['geolocation'],
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }, // Fallback mobile device
    },
    {
      name: 'desktop-chrome',
      use: {
        viewport: { width: 1867, height: 963 }, // Your actual desktop viewport
        deviceScaleFactor: 1.00,               // Your actual DPR
        isMobile: false,
        hasTouch: false,
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        // Desktop defaults
        locale: 'en-US',
        timezoneId: 'America/New_York',
      },
    },
  ],

  // No local server needed - testing live site
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:8000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
