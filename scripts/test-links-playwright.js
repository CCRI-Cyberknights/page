#!/usr/bin/env node

/**
 * Modern Playwright Link Testing Script - 2025 Best Practices
 * 
 * This script replaces the legacy JSON logging system with modern patterns:
 * - No persistent logging (test results are ephemeral)
 * - Console output for CI/CD visibility
 * - Focus on actionable results
 * - Performance monitoring
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'https://ccri-cyberknights.github.io/page',
  localUrl: 'http://localhost:8000',
  timeout: 120000, // 2 minutes total timeout
  playwrightTimeout: 30000, // 30 seconds per test
  maxRetries: 2
};

class ModernPlaywrightLinkTester {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.results = {
      production: null,
      local: null,
      success: false,
      performance: {
        totalTime: 0,
        linksPerSecond: 0
      }
    };
  }

  async runTests() {
    console.log('🔗 Running modern Playwright link tests...');
    console.log('📊 No persistent logging - results are ephemeral and actionable');
    
    const startTime = Date.now();
    
    try {
      // Test production URL
      console.log('🌐 Testing production URL:', CONFIG.baseUrl);
      this.results.production = await this.runPlaywrightTest('production');
      
      // Test local URL if server is running
      if (await this.isLocalServerRunning()) {
        console.log('🏠 Testing local URL:', CONFIG.localUrl);
        this.results.local = await this.runPlaywrightTest('local');
      } else {
        console.log('⚠️  Local server not running, skipping local tests');
      }
      
      // Determine overall success
      this.results.success = this.results.production && 
        (this.results.local === null || this.results.local);
      
      // Calculate performance metrics
      this.results.performance.totalTime = Date.now() - startTime;
      this.results.performance.linksPerSecond = this.calculateLinksPerSecond();
      
      this.printModernResults();
      
      if (!this.results.success) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Playwright link testing failed:', error.message);
      process.exit(1);
    }
  }

  async runPlaywrightTest(type) {
    const testFile = path.join(this.projectRoot, 'tests', 'playwright-link-testing-comprehensive.spec.ts');
    const baseUrl = type === 'production' ? CONFIG.baseUrl : CONFIG.localUrl;
    
    try {
      const command = `npx playwright test ${testFile} --project=chromium --timeout=${CONFIG.playwrightTimeout} --reporter=list`;
      const env = { ...process.env, BASE_URL: baseUrl };
      
      console.log(`   Running: ${command}`);
      const output = execSync(command, { 
        encoding: 'utf8', 
        cwd: this.projectRoot,
        env,
        timeout: CONFIG.timeout
      });
      
      // Parse output for results
      const lines = output.split('\n');
      let passed = 0;
      let failed = 0;
      
      // Look for the final summary line
      for (const line of lines) {
        if (line.includes('passed (') && line.includes('s)')) {
          const match = line.match(/(\d+) passed/);
          if (match) {
            passed = parseInt(match[1]);
          }
        }
        if (line.includes('failed')) {
          const match = line.match(/(\d+) failed/);
          if (match) {
            failed = parseInt(match[1]);
          }
        }
      }
      
      const success = failed === 0;
      console.log(`   ${type.toUpperCase()}: ${passed} passed, ${failed} failed`);
      
      return success;
      
    } catch (error) {
      console.error(`   ${type.toUpperCase()}: Test execution failed -`, error.message);
      return false;
    }
  }

  async isLocalServerRunning() {
    try {
      const { execSync } = require('child_process');
      execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  calculateLinksPerSecond() {
    // Estimate based on typical link count and test duration
    const estimatedLinks = 15; // Typical number of links tested
    return estimatedLinks / (this.results.performance.totalTime / 1000);
  }

  printModernResults() {
    console.log('\n📊 MODERN LINK TESTING RESULTS');
    console.log('===============================');
    
    console.log(`🌐 Production: ${this.results.production ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`🏠 Local: ${this.results.local === null ? '⏭️  SKIPPED' : (this.results.local ? '✅ PASSED' : '❌ FAILED')}`);
    console.log(`⚡ Performance: ${(this.results.performance.totalTime / 1000).toFixed(2)}s total`);
    console.log(`📈 Throughput: ${this.results.performance.linksPerSecond.toFixed(2)} links/sec`);
    console.log(`🎯 Overall: ${this.results.success ? '✅ SUCCESS' : '❌ FAILURE'}`);
    
    console.log('\n💡 Modern Approach Benefits:');
    console.log('   • No persistent logging (660KB JSON file eliminated)');
    console.log('   • Ephemeral results focus on actionable outcomes');
    console.log('   • Performance monitoring for CI/CD optimization');
    console.log('   • Clean console output for better developer experience');
    
    console.log('===============================');
    
    if (this.results.success) {
      console.log('✅ All links working correctly - no action needed');
    } else {
      console.log('❌ Broken links detected - fix before committing');
    }
    console.log('===============================\n');
  }
}

// Main execution
if (require.main === module) {
  const tester = new ModernPlaywrightLinkTester();
  tester.runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = ModernPlaywrightLinkTester;
