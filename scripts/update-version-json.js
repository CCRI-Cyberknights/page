#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get package.json version
const pkg = require('../package.json');

// Get git information
const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
const commitDate = execSync('git log -1 --format="%ci"', { encoding: 'utf8' }).trim();

// Create version object
const versionInfo = {
  version: pkg.version,
  commit: commitHash,
  date: commitDate,
  timestamp: new Date().toISOString()
};

// Write to version.json in the root directory
const versionPath = path.join(__dirname, '..', 'version.json');
fs.writeFileSync(versionPath, JSON.stringify(versionInfo, null, 2));

console.log(`✅ Updated version.json with version ${pkg.version}`);
console.log(`   Commit: ${commitHash}`);
console.log(`   Date: ${commitDate}`);
