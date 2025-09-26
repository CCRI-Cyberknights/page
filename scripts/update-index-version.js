#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Get package.json version
const pkg = require('../package.json');

// Get git information
const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
const commitDate = execSync('git log -1 --format="%ci"', { encoding: 'utf8' }).trim();

console.log(`🔄 Updating index.html with version ${pkg.version}`);
console.log(`   Commit: ${commitHash}`);
console.log(`   Date: ${commitDate}`);

// Read index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Update JavaScript constants using regex patterns
html = html
  .replace(/(const\s+VERSION\s*=\s*").*(";)/, `$1${pkg.version}$2`)
  .replace(/(const\s+COMMIT_HASH\s*=\s*").*(";)/, `$1${commitHash}$2`)
  .replace(/(const\s+COMMIT_DATE\s*=\s*").*(";)/, `$1${commitDate}$2`);

// Write back to index.html
fs.writeFileSync(indexPath, html);

console.log(`✅ Successfully updated index.html with version ${pkg.version}`);
console.log(`   - VERSION: ${pkg.version}`);
console.log(`   - COMMIT_HASH: ${commitHash}`);
console.log(`   - COMMIT_DATE: ${commitDate}`);
