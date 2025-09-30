#!/usr/bin/env node
// scripts/test-qr-urls.js
// Production-ready QR code URL validation script
// Prevents SPA routing QR code issues from recurring

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 QR Code URL Validation Test');
console.log('=====================================');
console.log('Testing production-ready QR code URL accuracy...\n');

try {
  // Run the focused QR URL validation test with optimized settings
  const testCommand = `npx playwright test tests/qr-code-url-validation.spec.ts --project=chromium --timeout=20000 --reporter=list`;
  
  console.log('Running QR code URL validation tests...');
  console.log('Features tested:');
  console.log('• Initial load URL accuracy');
  console.log('• Hashchange event handling');
  console.log('• History API navigation');
  console.log('• URL normalization');
  console.log('• Query string preservation');
  console.log('');
  
  execSync(testCommand, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ QR Code URL validation completed successfully!');
  console.log('🎯 All SPA routes have correct QR code URLs');
  console.log('🚀 Production-ready QR code manager validated');
  
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
  
  process.exit(1);
}
