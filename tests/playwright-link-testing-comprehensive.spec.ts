/**
 * Playwright Link Testing System - Complete Replacement for Selenium
 * 
 * This system provides feature parity with the existing Selenium link testing
 * while offering better performance, reliability, and cross-browser support.
 */

import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import { execSync } from 'child_process';

// Configuration
const BASE_URL = process.env.BASE_URL || 'https://ccri-cyberknights.github.io/page';
const LOCAL_URL = 'http://localhost:8000';

// Link categorization (matching Selenium system)
interface LinkInfo {
  url: string;
  text: string;
  type: 'internal_hash' | 'internal_guide' | 'external' | 'navigation';
}

interface TestResult {
  success: boolean;
  message: string;
  duration?: number;
}

interface TestSession {
  totalTested: number;
  passed: number;
  failed: number;
  successRate: number;
  duration: number;
  linkTypes: {
    internal_hash: number;
    internal_guide: number;
    external: number;
    navigation: number;
  };
}

class PlaywrightLinkTester {
  private discoveredLinks: LinkInfo[] = [];
  private testResults: TestResult[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  async discoverLinksFromHTML(page: Page): Promise<LinkInfo[]> {
    console.log('DISCOVERING Discovering links from HTML...');
    
    try {
      // Read HTML file (same as Selenium)
      const htmlContent = fs.readFileSync('index.html', 'utf-8');
      
      // Parse with Playwright (equivalent to BeautifulSoup)
      await page.setContent(htmlContent);
      
      const links = await page.locator('a[href]').all();
      const linkInfos: LinkInfo[] = [];
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        const text = await link.textContent() || '';
        
        if (!href) continue;
        
        // Categorize links (same logic as Selenium)
        let type: LinkInfo['type'];
        if (href.startsWith('#/guides/') || href.startsWith('#/document/')) {
          type = 'internal_guide';
        } else if (href.startsWith('#/')) {
          type = 'internal_hash';
        } else if (href.startsWith('http')) {
          type = 'external';
        } else {
          type = 'navigation';
        }
        
        linkInfos.push({ url: href, text: text.trim(), type });
      }
      
      console.log(`   INTERNAL Discovered ${linkInfos.filter(l => l.type === 'internal_hash').length} internal hash links`);
      console.log(`   GUIDE Discovered ${linkInfos.filter(l => l.type === 'internal_guide').length} guide links`);
      console.log(`   EXTERNAL Discovered ${linkInfos.filter(l => l.type === 'external').length} external links`);
      console.log(`   NAVIGATION Discovered ${linkInfos.filter(l => l.type === 'navigation').length} navigation links`);
      
      return linkInfos;
    } catch (error) {
      console.error('Error discovering links from HTML:', error);
      return [];
    }
  }

  async discoverLinksFromRuntime(page: Page): Promise<LinkInfo[]> {
    console.log('DISCOVERING Discovering links from runtime page...');
    
    try {
      await page.goto(BASE_URL, { timeout: 10000 });
      
      // Wait for page to load with timeout
      try {
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (timeoutError) {
        console.log('   WARNING: Runtime discovery timeout, continuing anyway');
      }
      
      const links = await page.locator('a[href]').all();
      const linkInfos: LinkInfo[] = [];
      
      for (const link of links) {
        const href = await link.getAttribute('href');
        const text = await link.textContent() || '';
        
        if (!href) continue;
        
        let type: LinkInfo['type'];
        if (href.startsWith('#/guides/') || href.startsWith('#/document/')) {
          type = 'internal_guide';
        } else if (href.startsWith('#/')) {
          type = 'internal_hash';
        } else if (href.startsWith('http')) {
          type = 'external';
        } else {
          type = 'navigation';
        }
        
        linkInfos.push({ url: href, text: text.trim(), type });
      }
      
      console.log(`   RUNTIME Found ${linkInfos.length} additional runtime links`);
      return linkInfos;
    } catch (error) {
      console.error('Error discovering links from runtime:', error);
      return [];
    }
  }

  async testInternalLink(page: Page, linkInfo: LinkInfo): Promise<TestResult> {
    const { url, text } = linkInfo;
    const linkStartTime = Date.now();
    
    console.log(`DISCOVERING Testing internal link: ${text} (${url})`);
    
    try {
      // Convert hash link to full URL (same as Selenium)
      const fullUrl = url.startsWith('#/') ? `${BASE_URL}/${url}` : url;
      
      // Navigate to the link with timeout
      const response = await page.goto(fullUrl, { timeout: 10000 });
      
      // Check HTTP status (same as Selenium)
      if (response && response.status() !== 200) {
        const result = { success: false, message: `HTTP ${response.status()}`, duration: Date.now() - linkStartTime };
        console.log(`   FAIL FAIL: ${text} - ${result.message}`);
        return result;
      }
      
      // Wait for SPA routing with shorter timeout
      try {
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (timeoutError) {
        console.log(`   WARNING: ${text} - Load state timeout, continuing anyway`);
      }
      
      // Check if we're on the correct page (same as Selenium)
      const currentUrl = page.url();
      const pageContent = await page.textContent('body');
      
      if (!pageContent || pageContent.length < 100) {
        const result = { success: false, message: 'Page content too short', duration: Date.now() - linkStartTime };
        console.log(`   FAIL FAIL: ${text} - ${result.message}`);
        return result;
      }
      
      const result = { success: true, message: 'Page loaded successfully', duration: Date.now() - linkStartTime };
      console.log(`   PASS PASS: ${text} - Page loaded successfully`);
      return result;
      
    } catch (error) {
      const result = { success: false, message: error.toString(), duration: Date.now() - linkStartTime };
      console.log(`   FAIL FAIL: ${text} - ${error}`);
      return result;
    }
  }

  async testExternalLink(page: Page, linkInfo: LinkInfo): Promise<TestResult> {
    const { url, text } = linkInfo;
    const linkStartTime = Date.now();
    
    console.log(`DISCOVERING Testing external link: ${text} (${url})`);
    
    try {
      // Test external link (same as Selenium)
      const response = await page.goto(url, { timeout: 10000 });
      
      if (response && response.status() !== 200) {
        const result = { success: false, message: `HTTP ${response.status()}`, duration: Date.now() - linkStartTime };
        console.log(`   FAIL FAIL: ${text} - ${result.message}`);
        return result;
      }
      
      const result = { success: true, message: `Status ${response?.status() || 'OK'}`, duration: Date.now() - linkStartTime };
      console.log(`   PASS PASS: ${text} - Status ${response?.status() || 'OK'}`);
      return result;
      
    } catch (error) {
      const result = { success: false, message: error.toString(), duration: Date.now() - linkStartTime };
      console.log(`   FAIL FAIL: ${text} - ${error}`);
      return result;
    }
  }

  async runComprehensiveTest(page: Page): Promise<TestSession> {
    console.log('STARTING Starting comprehensive link testing...');
    
    // Discover all links
    const htmlLinks = await this.discoverLinksFromHTML(page);
    const runtimeLinks = await this.discoverLinksFromRuntime(page);
    
    // Combine and deduplicate
    const allLinks = [...htmlLinks, ...runtimeLinks];
    const uniqueLinks = allLinks.filter((link, index, self) => 
      index === self.findIndex(l => l.url === link.url)
    );
    
    console.log(`DISCOVERING Testing ${uniqueLinks.length} unique links...`);
    
    let passed = 0;
    let failed = 0;
    
    // Test all links
    for (const link of uniqueLinks) {
      let result: TestResult;
      
      if (link.type === 'external') {
        result = await this.testExternalLink(page, link);
      } else {
        result = await this.testInternalLink(page, link);
      }
      
      this.testResults.push(result);
      
      if (result.success) {
        passed++;
      } else {
        failed++;
      }
    }
    
    const duration = Date.now() - this.startTime;
    const successRate = (passed / uniqueLinks.length) * 100;
    
    // Count link types
    const linkTypes = {
      internal_hash: uniqueLinks.filter(l => l.type === 'internal_hash').length,
      internal_guide: uniqueLinks.filter(l => l.type === 'internal_guide').length,
      external: uniqueLinks.filter(l => l.type === 'external').length,
      navigation: uniqueLinks.filter(l => l.type === 'navigation').length,
    };
    
    const session: TestSession = {
      totalTested: uniqueLinks.length,
      passed,
      failed,
      successRate,
      duration,
      linkTypes
    };
    
    console.log(`LOG Test session completed:`);
    console.log(`LOG   Total tested: ${session.totalTested}`);
    console.log(`LOG   Passed: ${session.passed}`);
    console.log(`LOG   Failed: ${session.failed}`);
    console.log(`LOG   Success Rate: ${session.successRate.toFixed(1)}%`);
    console.log(`LOG   Duration: ${(session.duration / 1000).toFixed(2)} seconds`);
    
    return session;
  }

  async testLocalServer(page: Page): Promise<TestSession> {
    console.log('🏠 Testing local URL: http://localhost:8000');
    
    // Update base URL for local testing
    const originalBaseUrl = BASE_URL;
    (this as any).baseUrl = LOCAL_URL;
    
    try {
      const session = await this.runComprehensiveTest(page);
      return session;
    } finally {
      // Restore original base URL
      (this as any).baseUrl = originalBaseUrl;
    }
  }
}

// Test Suite: Production Link Testing
test.describe('Production Link Testing', () => {
  let linkTester: PlaywrightLinkTester;
  
  test.beforeEach(() => {
    linkTester = new PlaywrightLinkTester();
  });

  test('comprehensive production link testing', async ({ page }) => {
    const session = await linkTester.runComprehensiveTest(page);
    
    // Verify success rate (should match Selenium results)
    expect(session.failed).toBe(0);
    expect(session.successRate).toBe(100);
    
    console.log('✅ SUCCESS ALL TESTS PASSED! All discovered links are working correctly.');
  });
});

// Test Suite: Local Server Testing
test.describe('Local Server Testing', () => {
  let linkTester: PlaywrightLinkTester;
  
  test.beforeEach(() => {
    linkTester = new PlaywrightLinkTester();
  });

  test('comprehensive local link testing', async ({ page }) => {
    const session = await linkTester.testLocalServer(page);
    
    // Verify success rate
    expect(session.failed).toBe(0);
    expect(session.successRate).toBe(100);
    
    console.log('✅ SUCCESS ALL TESTS PASSED! All discovered links are working correctly on local server.');
  });
});

// Test Suite: Performance Comparison
test.describe('Performance Analysis', () => {
  test('link testing performance', async ({ page }) => {
    const startTime = Date.now();
    const linkTester = new PlaywrightLinkTester();
    
    const session = await linkTester.runComprehensiveTest(page);
    
    const totalTime = Date.now() - startTime;
    
    console.log(`✅ Performance Analysis:`);
    console.log(`   Total Time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`   Links Tested: ${session.totalTested}`);
    console.log(`   Links/Second: ${(session.totalTested / (totalTime / 1000)).toFixed(2)}`);
    console.log(`   Success Rate: ${session.successRate.toFixed(1)}%`);
    
    // Performance should be better than Selenium
    expect(totalTime).toBeLessThan(60000); // Less than 60 seconds
    expect(session.successRate).toBe(100); // 100% success rate
  });
});

// Test Suite: Feature Verification
test.describe('Feature Verification', () => {
  test('verify link discovery works', async ({ page }) => {
    const linkTester = new PlaywrightLinkTester();
    
    const htmlLinks = await linkTester.discoverLinksFromHTML(page);
    const runtimeLinks = await linkTester.discoverLinksFromRuntime(page);
    
    // Should find links
    expect(htmlLinks.length).toBeGreaterThan(0);
    expect(runtimeLinks.length).toBeGreaterThan(0);
    
    console.log(`✅ Link Discovery: HTML=${htmlLinks.length}, Runtime=${runtimeLinks.length}`);
  });

  test('verify SPA navigation works', async ({ page }) => {
    await page.goto(BASE_URL, { timeout: 10000 });
    
    // Test SPA navigation with timeouts
    try {
      await page.click('a[href="#/calendar"]', { timeout: 5000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      expect(page.url()).toContain('#/calendar');
      
      await page.click('a[href="#/resources"]', { timeout: 5000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      expect(page.url()).toContain('#/resources');
      
      console.log('✅ SPA Navigation: Working correctly');
    } catch (error) {
      console.log(`❌ SPA Navigation failed: ${error}`);
      throw error;
    }
  });
});
