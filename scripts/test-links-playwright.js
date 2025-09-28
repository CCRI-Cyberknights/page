#!/usr/bin/env node

/**
 * Playwright Link Testing Script - Pre-commit Hook Integration
 * 
 * This script replaces the Selenium link testing system in the pre-commit hook
 * with a faster, more reliable Playwright-based solution.
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

class PlaywrightLinkTester {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.results = {
      production: null,
      local: null,
      success: false,
      errors: []
    };
  }

  async runTests() {
    console.log('🔗 Running Playwright link tests...');
    
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
      
      this.printResults();
      
      if (!this.results.success) {
        process.exit(1);
      }
      
    } catch (error) {
      console.error('❌ Playwright link testing failed:', error.message);
      this.results.errors.push(error.message);
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

  printResults() {
    console.log('\n================================================================================');
    console.log('REPORT PLAYWRIGHT LINK TESTING REPORT');
    console.log('================================================================================');
    
    console.log('\nSUMMARY SUMMARY:');
    console.log(`   Production Tests: ${this.results.production ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   Local Tests: ${this.results.local === null ? '⏭️  SKIPPED' : (this.results.local ? '✅ PASSED' : '❌ FAILED')}`);
    console.log(`   Overall Result: ${this.results.success ? '✅ SUCCESS' : '❌ FAILURE'}`);
    
    if (this.results.errors.length > 0) {
      console.log('\nERRORS ERRORS:');
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    console.log('\n================================================================================');
    
    if (this.results.success) {
      console.log('SUCCESS ALL TESTS PASSED! All discovered links are working correctly.');
    } else {
      console.log('FAILURE Some tests failed. Please check the results above.');
    }
    console.log('================================================================================\n');
  }
}

// Main execution
if (require.main === module) {
  const tester = new PlaywrightLinkTester();
  tester.runTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = PlaywrightLinkTester;
