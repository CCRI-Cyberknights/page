#!/usr/bin/env node
// scripts/test-qr-urls.js
// Production-ready QR code URL validation script with smoke/full modes
// Prevents SPA routing QR code issues from recurring

const { execSync } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const isSmokeMode = args.includes('--smoke');
const isFullMode = args.includes('--full');

console.log('🔍 QR Code URL Validation Test');
console.log('=====================================');

if (isSmokeMode) {
  console.log('🚀 Running SMOKE tests (fast PR validation)...');
  console.log('Testing critical routes only for quick feedback\n');
} else if (isFullMode) {
  console.log('🧪 Running FULL tests (comprehensive validation)...');
  console.log('Testing all routes and edge cases\n');
} else {
  console.log('Testing production-ready QR code URL accuracy...\n');
}

try {
  // Determine test command based on mode
  let testCommand;
  if (isSmokeMode) {
    testCommand = `npx playwright test tests/qr-code-url-validation.spec.ts --project=chromium --timeout=15000 --reporter=list --grep="initial load and navigation update the QR"`;
  } else if (isFullMode) {
    testCommand = `npx playwright test tests/qr-code-url-validation.spec.ts --project=chromium --timeout=20000 --reporter=list`;
  } else {
    testCommand = `npx playwright test tests/qr-code-url-validation.spec.ts --project=chromium --timeout=20000 --reporter=list`;
  }
  
  console.log('Running QR code URL validation tests...');
  if (isSmokeMode) {
    console.log('Features tested:');
    console.log('• Initial load URL accuracy');
    console.log('• Basic navigation validation');
    console.log('• Core SPA route coverage');
  } else {
    console.log('Features tested:');
    console.log('• Initial load URL accuracy');
    console.log('• Hashchange event handling');
    console.log('• History API navigation');
    console.log('• URL normalization');
    console.log('• Query string preservation');
    console.log('• Edge case coverage');
  }
  console.log('');
  
  execSync(testCommand, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ QR Code URL validation completed successfully!');
  console.log('🎯 All SPA routes have correct QR code URLs');
  console.log('🚀 Production-ready QR code manager validated');
  
  if (isSmokeMode) {
    console.log('\n💡 Smoke tests passed! For full validation, run: npm run test:qr-urls:full');
  }
  
} catch (error) {
  console.error('\n❌ QR Code URL validation failed!');
  console.error('🚨 SPA routing QR code issue detected');
  console.error('\nPossible causes:');
  console.error('• QRCodeManager not updating URL on hash changes');
  console.error('• Missing hashchange/popstate event listeners');
  console.error('• History API wrapping not working');
  console.error('• URL normalization issues');
  console.error('• Debouncing problems');
  console.error('• Visibility observer issues');
  
  console.error('\n🔧 Debug steps:');
  console.error('1. Check browser console for QR telemetry events');
  console.error('2. Verify data-generated-url attribute on QR container');
  console.error('3. Test manual hash changes in browser dev tools');
  console.error('4. Check Playwright test artifacts for screenshots');
  
  if (isSmokeMode) {
    console.error('\n💡 Smoke test failed. Run full tests for detailed analysis: npm run test:qr-urls:full');
  }
  
  process.exit(1);
}
