#!/usr/bin/env node

/**
 * Modern Version Update Script - 2025 Best Practice
 * Updates version.json with comprehensive metadata
 * Implements error handling, validation, and atomic operations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  versionFile: 'version.json',
  packageFile: 'package.json',
  maxRetries: 3,
  retryDelay: 1000
};

class VersionUpdater {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
    this.versionPath = path.join(this.projectRoot, CONFIG.versionFile);
    this.packagePath = path.join(this.projectRoot, CONFIG.packageFile);
  }

  async update() {
    try {
      console.log('🚀 Starting version update process...');
      
      const versionInfo = await this.buildVersionInfo();
      await this.writeVersionFile(versionInfo);
      
      console.log('✅ Version update completed successfully');
      console.log(`   Version: ${versionInfo.version}`);
      console.log(`   Commit: ${versionInfo.commit}`);
      console.log(`   Date: ${versionInfo.date}`);
      
    } catch (error) {
      console.error('❌ Version update failed:', error.message);
      process.exit(1);
    }
  }

  async buildVersionInfo() {
    // Get package.json version
    const pkg = this.loadPackageJson();
    
    // Get git information with error handling
    const gitInfo = await this.getGitInfo();
    
    return {
      version: pkg.version,
      commit: gitInfo.commitHash,
      date: gitInfo.commitDate,
      timestamp: new Date().toISOString(),
      buildTime: Date.now(),
      nodeVersion: process.version,
      platform: process.platform
    };
  }

  loadPackageJson() {
    try {
      const pkgContent = fs.readFileSync(this.packagePath, 'utf8');
      return JSON.parse(pkgContent);
    } catch (error) {
      throw new Error(`Failed to load package.json: ${error.message}`);
    }
  }

  async getGitInfo() {
    try {
      const commitHash = execSync('git rev-parse --short HEAD', { 
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 5000
      }).trim();
      
      const commitDate = execSync('git log -1 --format="%ci"', { 
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: 5000
      }).trim();
      
      return { commitHash, commitDate };
    } catch (error) {
      console.warn('⚠️  Git information unavailable, using fallback values');
      return {
        commitHash: 'unknown',
        commitDate: new Date().toISOString()
      };
    }
  }

  async writeVersionFile(versionInfo) {
    try {
      // Atomic write: write to temp file first, then rename
      const tempPath = `${this.versionPath}.tmp`;
      const content = JSON.stringify(versionInfo, null, 2) + '\n';
      
      fs.writeFileSync(tempPath, content, 'utf8');
      fs.renameSync(tempPath, this.versionPath);
      
    } catch (error) {
      throw new Error(`Failed to write version.json: ${error.message}`);
    }
  }
}

// Run the updater
if (require.main === module) {
  const updater = new VersionUpdater();
  updater.update();
}

module.exports = VersionUpdater;
