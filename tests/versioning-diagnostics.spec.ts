/**
 * Versioning Pipeline Diagnostic Harness
 * 
 * This test suite validates the entire versioning pipeline:
 * 1. File System Verification (version.json updates)
 * 2. Git History Validation (commits include required files)
 * 3. Deployment Verification (UI displays correct version)
 * 
 * Run after releases to catch versioning failures at every layer.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Configuration
const PROJECT_ROOT = path.join(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');
const VERSION_JSON_PATH = path.join(PROJECT_ROOT, 'version.json');
const LIVE_SITE_URL = 'https://ccri-cyberknights.github.io/page';

// Helper functions
function getPackageVersion(): string {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  return pkg.version;
}

function getVersionJson(): any {
  if (!fs.existsSync(VERSION_JSON_PATH)) {
    throw new Error('version.json does not exist');
  }
  return JSON.parse(fs.readFileSync(VERSION_JSON_PATH, 'utf8'));
}

function getLatestCommitFiles(): string[] {
  try {
    const output = execSync('git show --pretty="" --name-only HEAD', { 
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    });
    return output.trim().split('\n').filter(line => line.length > 0);
  } catch (error) {
    throw new Error(`Failed to get latest commit files: ${error}`);
  }
}

function getLatestCommitMessage(): string {
  try {
    return execSync('git log -1 --pretty=%B', { 
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    }).trim();
  } catch (error) {
    throw new Error(`Failed to get latest commit message: ${error}`);
  }
}

function isReleaseCommit(): boolean {
  const message = getLatestCommitMessage();
  return message.includes('chore(release):');
}

// Test Suite: File System Verification
test.describe('File System Verification', () => {
  test('version.json should exist', () => {
    expect(fs.existsSync(VERSION_JSON_PATH)).toBe(true);
  });

  test('version.json should have valid JSON structure', () => {
    const versionJson = getVersionJson();
    expect(versionJson).toHaveProperty('version');
    expect(versionJson).toHaveProperty('commit');
    expect(versionJson).toHaveProperty('date');
    expect(typeof versionJson.version).toBe('string');
  });

  test('version.json should match package.json version', () => {
    const packageVersion = getPackageVersion();
    const versionJson = getVersionJson();
    
    expect(versionJson.version).toBe(packageVersion);
  });

  test('version.json should have recent timestamp', () => {
    const versionJson = getVersionJson();
    const buildTime = versionJson.buildTime || versionJson.timestamp;
    
    if (buildTime) {
      const buildDate = new Date(buildTime);
      const now = new Date();
      const diffHours = (now.getTime() - buildDate.getTime()) / (1000 * 60 * 60);
      
      // Should be within last 24 hours
      expect(diffHours).toBeLessThan(24);
    }
  });

  test('version-display.js should exist and be valid', () => {
    const versionDisplayPath = path.join(PROJECT_ROOT, 'js', 'version-display.js');
    expect(fs.existsSync(versionDisplayPath)).toBe(true);
    
    const content = fs.readFileSync(versionDisplayPath, 'utf8');
    expect(content).toContain('VersionDisplay');
    expect(content).toContain('/page/version.json'); // Correct URL path
  });
});

// Test Suite: Git History Validation
test.describe('Git History Validation', () => {
  test('latest commit should include version.json if it is a release', () => {
    if (isReleaseCommit()) {
      const files = getLatestCommitFiles();
      expect(files).toContain('version.json');
    }
  });

  test('latest commit should include package.json if it is a release', () => {
    if (isReleaseCommit()) {
      const files = getLatestCommitFiles();
      expect(files).toContain('package.json');
    }
  });

  test('latest commit should include CHANGELOG.md if it is a release', () => {
    if (isReleaseCommit()) {
      const files = getLatestCommitFiles();
      expect(files).toContain('CHANGELOG.md');
    }
  });

  test('release commits should have proper format', () => {
    if (isReleaseCommit()) {
      const message = getLatestCommitMessage();
      const versionMatch = message.match(/chore\(release\): (\d+\.\d+\.\d+)/);
      expect(versionMatch).toBeTruthy();
      
      if (versionMatch) {
        const commitVersion = versionMatch[1];
        const packageVersion = getPackageVersion();
        expect(commitVersion).toBe(packageVersion);
      }
    }
  });

  test('version.json should be committed with correct version', () => {
    if (isReleaseCommit()) {
      const packageVersion = getPackageVersion();
      const versionJson = getVersionJson();
      expect(versionJson.version).toBe(packageVersion);
    }
  });
});

// Test Suite: Deployment Verification
test.describe('Deployment Verification', () => {
  test('live site should load without errors', async ({ page }) => {
    const response = await page.goto(LIVE_SITE_URL);
    expect(response?.status()).toBe(200);
  });

  test('version display should be present in UI', async ({ page }) => {
    await page.goto(LIVE_SITE_URL);
    
    // Wait for version display to load
    await page.waitForSelector('#version', { timeout: 10000 });
    
    const versionElement = await page.locator('#version');
    expect(await versionElement.isVisible()).toBe(true);
  });

  test('version display should show correct version', async ({ page }) => {
    await page.goto(LIVE_SITE_URL);
    
    // Wait for version display to load
    await page.waitForSelector('#version', { timeout: 10000 });
    
    const versionText = await page.textContent('#version');
    const packageVersion = getPackageVersion();
    
    expect(versionText).toContain(packageVersion);
  });

  test('version.json should be accessible on live site', async ({ page }) => {
    const response = await page.goto(`${LIVE_SITE_URL}/version.json`);
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    const versionJson = JSON.parse(content || '{}');
    
    expect(versionJson).toHaveProperty('version');
    expect(versionJson.version).toBe(getPackageVersion());
  });

  test('version tooltip should show commit info', async ({ page }) => {
    await page.goto(LIVE_SITE_URL);
    
    // Wait for version display to load
    await page.waitForSelector('#version', { timeout: 10000 });
    
    // Hover over version to show tooltip
    await page.hover('#version');
    
    // Check if tooltip appears (may need to wait)
    await page.waitForTimeout(1000);
    
    const tooltip = await page.locator('#version-tooltip');
    if (await tooltip.isVisible()) {
      const tooltipText = await tooltip.textContent();
      expect(tooltipText).toContain('Commit:');
      expect(tooltipText).toContain('v' + getPackageVersion());
    }
  });

  test('version-display.js should load without errors', async ({ page }) => {
    const response = await page.goto(`${LIVE_SITE_URL}/js/version-display.js`);
    expect(response?.status()).toBe(200);
    
    const content = await page.textContent('body');
    expect(content).toContain('VersionDisplay');
  });
});

// Test Suite: End-to-End Pipeline Validation
test.describe('End-to-End Pipeline Validation', () => {
  test('complete versioning pipeline should be consistent', async ({ page }) => {
    // 1. Check local files
    const packageVersion = getPackageVersion();
    const versionJson = getVersionJson();
    expect(versionJson.version).toBe(packageVersion);
    
    // 2. Check git history (if release commit)
    if (isReleaseCommit()) {
      const files = getLatestCommitFiles();
      expect(files).toContain('version.json');
      expect(files).toContain('package.json');
    }
    
    // 3. Check live deployment
    await page.goto(LIVE_SITE_URL);
    await page.waitForSelector('#version', { timeout: 10000 });
    
    const liveVersionText = await page.textContent('#version');
    expect(liveVersionText).toContain(packageVersion);
    
    // 4. Check live version.json
    const liveVersionResponse = await page.goto(`${LIVE_SITE_URL}/version.json`);
    expect(liveVersionResponse?.status()).toBe(200);
    
    const liveVersionContent = await page.textContent('body');
    const liveVersionJson = JSON.parse(liveVersionContent || '{}');
    expect(liveVersionJson.version).toBe(packageVersion);
  });

  test('versioning system should handle errors gracefully', async ({ page }) => {
    await page.goto(LIVE_SITE_URL);
    
    // Check that version display doesn't break the page
    const response = await page.goto(LIVE_SITE_URL);
    expect(response?.status()).toBe(200);
    
    // Check that version element exists even if version.json fails
    await page.waitForSelector('#version', { timeout: 10000 });
    const versionElement = await page.locator('#version');
    expect(await versionElement.isVisible()).toBe(true);
  });
});

// Test Suite: Diagnostic Utilities
test.describe('Diagnostic Utilities', () => {
  test('should provide diagnostic information on failure', () => {
    const packageVersion = getPackageVersion();
    const versionJson = getVersionJson();
    const latestCommit = getLatestCommitMessage();
    const files = getLatestCommitFiles();
    
    console.log('=== VERSIONING DIAGNOSTIC INFO ===');
    console.log(`Package Version: ${packageVersion}`);
    console.log(`Version.json Version: ${versionJson.version}`);
    console.log(`Latest Commit: ${latestCommit}`);
    console.log(`Latest Commit Files: ${files.join(', ')}`);
    console.log(`Is Release Commit: ${isReleaseCommit()}`);
    console.log('================================');
    
    // This test always passes - it's just for diagnostic output
    expect(true).toBe(true);
  });
});
