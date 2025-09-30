// Debug script to test QRCodeManager initialization
// Run this in browser console to debug

console.log('🔍 Debugging QRCodeManager initialization...');

// Check if QRCodeManager class exists
console.log('QRCodeManager class:', typeof QRCodeManager);

// Check if elements exist
console.log('Toggle element:', document.getElementById('footer-qr-toggle'));
console.log('Panel element:', document.getElementById('footer-qr-panel'));
console.log('Canvas element:', document.getElementById('footer-qr-canvas'));

// Check if window.qrCodeManager exists
console.log('window.qrCodeManager:', window.qrCodeManager);

// Check if QRCodeManager is initialized
if (window.qrCodeManager) {
  console.log('QRCodeManager currentUrl:', window.qrCodeManager.currentUrl);
  console.log('QRCodeManager isVisible:', window.qrCodeManager.isVisible);
  console.log('QRCodeManager debouncedUpdate:', typeof window.qrCodeManager.debouncedUpdate);
} else {
  console.log('❌ QRCodeManager not initialized');
}

// Check if QRCode library is loaded
console.log('QRCode library:', typeof window.QRCode);

// Check DOM state
console.log('Document ready state:', document.readyState);
console.log('Window location:', window.location.href);
