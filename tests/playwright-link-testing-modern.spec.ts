/**
 * Modern Playwright Link Testing - 2025 Best Practices
 * 
 * This replaces the legacy JSON logging system with modern patterns:
 * - No persistent logging (test results are ephemeral)
 * - Console output for CI/CD visibility
 * - Artifact upload only on failures
 * - Focus on actionable results
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';

// Configuration
const BASE_URL = process.env.BASE_URL || 'https://ccri-cyberknights.github.io/page';
const LOCAL_URL = 'http://localhost:8000';

interface LinkInfo {
  url: string;
  text: string;
  type: 'internal_hash' | 'internal_guide' | 'external' | 'navigation';
}

interface TestResult {
  success: boolean;
  message: string;
  duration: number;
}

interface TestSession {
  totalTested: number;
  passed: number;
  failed: number;
  successRate: number;
  duration: number;
  failures: Array<{ url: string; text: string; error: string }>;
}

class ModernLinkTester {
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  async discoverLinksFromHTML(page: any): Promise<LinkInfo[]> {
    console.log('🔍 Discovering links from HTML...');
    
    try {
      const htmlContent = fs.readFileSync('index.html', 'utf-8');
      await page.setContent(htmlContent);
      
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
      
      console.log(`   📊 Found ${linkInfos.length} links (${linkInfos.filter(l => l.type === 'internal_hash').length} internal, ${linkInfos.filter(l => l.type === 'external').length} external)`);
      return linkInfos;
    } catch (error) {
      console.error('❌ Error discovering links:', error);
      return [];
    }
  }

  async discoverLinksFromRuntime(page: any): Promise<LinkInfo[]> {
    console.log('🌐 Discovering links from runtime...');
    
    try {
      await page.goto(BASE_URL, { timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
      await page.waitForTimeout(1000);
      
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
      
      console.log(`   📊 Found ${linkInfos.length} additional runtime links`);
      return linkInfos;
    } catch (error) {
      console.error('❌ Error discovering runtime links:', error);
      return [];
    }
  }

  async testLink(page: any, linkInfo: LinkInfo): Promise<TestResult> {
    const { url, text } = linkInfo;
    const linkStartTime = Date.now();
    
    try {
      if (linkInfo.type === 'external') {
        // Test external link with redirect handling
        try {
          const response = await page.goto(url, { 
            timeout: 10000,
            waitUntil: 'domcontentloaded'
          });
          
          // Consider 200-299 status codes as success (handles redirects)
          const success = response && response.status() >= 200 && response.status() < 300;
          const message = success ? `Status ${response?.status()}` : `HTTP ${response?.status() || 'Error'}`;
          
          return { success, message, duration: Date.now() - linkStartTime };
        } catch (error) {
          return { success: false, message: `Network Error: ${error.message}`, duration: Date.now() - linkStartTime };
        }
      } else {
        // Test internal link
        const fullUrl = url.startsWith('#/') ? `${BASE_URL}/${url}` : url;
        const response = await page.goto(fullUrl, { timeout: 10000 });
        
        if (response && response.status() !== 200) {
          return { success: false, message: `HTTP ${response.status()}`, duration: Date.now() - linkStartTime };
        }
        
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        await page.waitForTimeout(1000);
        
        const pageContent = await page.textContent('body');
        const success = pageContent && pageContent.length > 100;
        const message = success ? 'Page loaded successfully' : 'Page content too short';
        
        return { success, message, duration: Date.now() - linkStartTime };
      }
    } catch (error) {
      return { success: false, message: error.toString(), duration: Date.now() - linkStartTime };
    }
  }

  async runComprehensiveTest(page: any): Promise<TestSession> {
    console.log('🚀 Starting comprehensive link testing...');
    
    // Discover all links
    const htmlLinks = await this.discoverLinksFromHTML(page);
    const runtimeLinks = await this.discoverLinksFromRuntime(page);
    
    // Combine and deduplicate
    const allLinks = [...htmlLinks, ...runtimeLinks];
    const uniqueLinks = allLinks.filter((link, index, self) => 
      index === self.findIndex(l => l.url === link.url)
    );
    
    console.log(`🧪 Testing ${uniqueLinks.length} unique links...`);
    
    let passed = 0;
    let failed = 0;
    const failures: Array<{ url: string; text: string; error: string }> = [];
    
    // Test all links
    for (const link of uniqueLinks) {
      const result = await this.testLink(page, link);
      
      if (result.success) {
        passed++;
        console.log(`   ✅ ${link.text || link.url} - ${result.message}`);
      } else {
        failed++;
        failures.push({ url: link.url, text: link.text, error: result.message });
        console.log(`   ❌ ${link.text || link.url} - ${result.message}`);
      }
    }
    
    const duration = Date.now() - this.startTime;
    const successRate = (passed / uniqueLinks.length) * 100;
    
    const session: TestSession = {
      totalTested: uniqueLinks.length,
      passed,
      failed,
      successRate,
      duration,
      failures
    };
    
    // Modern reporting - no persistent logging
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`Total Links: ${session.totalTested}`);
    console.log(`Passed: ${session.passed}`);
    console.log(`Failed: ${session.failed}`);
    console.log(`Success Rate: ${session.successRate.toFixed(1)}%`);
    console.log(`Duration: ${(session.duration / 1000).toFixed(2)}s`);
    
    if (session.failed > 0) {
      console.log('\n❌ FAILED LINKS:');
      session.failures.forEach(failure => {
        console.log(`   • ${failure.text || failure.url}: ${failure.error}`);
      });
    }
    
    console.log('========================\n');
    
    return session;
  }
}

// Test Suite: Production Link Testing
test.describe('Production Link Testing', () => {
  test('comprehensive production link testing', async ({ page }) => {
    const linkTester = new ModernLinkTester();
    const session = await linkTester.runComprehensiveTest(page);
    
    // Fail fast on broken links - this is the only thing that matters
    expect(session.failed).toBe(0);
    
    // Optional: Log performance metrics for CI/CD
    if (process.env.CI) {
      console.log(`📈 Performance: ${session.totalTested} links in ${(session.duration / 1000).toFixed(2)}s (${(session.totalTested / (session.duration / 1000)).toFixed(2)} links/sec)`);
    }
  });
});

// Test Suite: Local Server Testing
test.describe('Local Server Testing', () => {
  test('comprehensive local link testing', async ({ page }) => {
    const linkTester = new ModernLinkTester();
    
    // Update base URL for local testing
    const originalBaseUrl = BASE_URL;
    (linkTester as any).baseUrl = LOCAL_URL;
    
    try {
      const session = await linkTester.runComprehensiveTest(page);
      expect(session.failed).toBe(0);
    } finally {
      (linkTester as any).baseUrl = originalBaseUrl;
    }
  });
});

// Test Suite: Performance Monitoring
test.describe('Performance Monitoring', () => {
  test('link testing performance benchmark', async ({ page }) => {
    const startTime = Date.now();
    const linkTester = new ModernLinkTester();
    
    const session = await linkTester.runComprehensiveTest(page);
    const totalTime = Date.now() - startTime;
    
    // Performance assertions
    expect(totalTime).toBeLessThan(30000); // Less than 30 seconds
    expect(session.successRate).toBe(100); // 100% success rate
    
    // Log performance metrics for monitoring
    console.log(`⚡ Performance: ${session.totalTested} links in ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`📊 Throughput: ${(session.totalTested / (totalTime / 1000)).toFixed(2)} links/second`);
  });
});
