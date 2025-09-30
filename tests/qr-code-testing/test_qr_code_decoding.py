#!/usr/bin/env python3
"""
QR Code Testing Script

This script tests QR code generation and decoding functionality.
It can generate QR codes, save them as images, and decode them using various methods.
"""

import qrcode
import base64
import io
import os
import sys
import subprocess
import tempfile
from PIL import Image
import json

def generate_qr_code(text, filename=None):
    """Generate a QR code and return the PIL Image object."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    if filename:
        img.save(filename)
        print(f"QR code saved to: {filename}")
    
    return img

def generate_base64_qr(text):
    """Generate a QR code and return it as base64 string."""
    img = generate_qr_code(text)
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def decode_qr_with_zbar(filename):
    """Decode QR code using zbarimg command-line tool."""
    try:
        result = subprocess.run(['zbarimg', '--raw', filename], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return None
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return None

def decode_qr_with_opencv(filename):
    """Decode QR code using OpenCV (if available)."""
    try:
        import cv2
        from pyzbar import pyzbar
        
        image = cv2.imread(filename)
        barcodes = pyzbar.decode(image)
        
        if barcodes:
            return barcodes[0].data.decode('utf-8')
        return None
    except ImportError:
        return None

def test_qr_generation_and_decoding():
    """Test QR code generation and decoding."""
    print("🧪 Testing QR Code Generation and Decoding")
    print("=" * 50)
    
    # Test URLs
    test_urls = [
        "https://ccri-cyberknights.github.io/page/",
        "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html",
        "https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6",
        "https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7"
    ]
    
    results = []
    
    for i, url in enumerate(test_urls):
        print(f"\n📱 Test {i+1}: {url[:50]}...")
        
        # Generate QR code
        filename = f"/tmp/qr_test_{i+1}.png"
        img = generate_qr_code(url, filename)
        
        # Try to decode with zbarimg
        decoded_zbar = decode_qr_with_zbar(filename)
        
        # Try to decode with OpenCV (if available)
        decoded_opencv = decode_qr_with_opencv(filename)
        
        # Generate base64 version
        base64_qr = generate_base64_qr(url)
        
        result = {
            "url": url,
            "filename": filename,
            "decoded_zbar": decoded_zbar,
            "decoded_opencv": decoded_opencv,
            "base64_length": len(base64_qr),
            "success": decoded_zbar == url or decoded_opencv == url
        }
        
        results.append(result)
        
        print(f"   ✅ Generated: {filename}")
        print(f"   🔍 ZBar decode: {decoded_zbar}")
        print(f"   🔍 OpenCV decode: {decoded_opencv}")
        print(f"   📊 Base64 length: {len(base64_qr)} chars")
        print(f"   ✅ Success: {result['success']}")
    
    return results

def test_current_cheatsheet_qr():
    """Test the QR code from the current cheatsheet."""
    print("\n🔍 Testing Current Cheatsheet QR Code")
    print("=" * 50)
    
    # The URL that should be in the cheatsheet QR code
    expected_url = "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html"
    
    print(f"Expected URL: {expected_url}")
    
    # Generate the correct QR code
    correct_filename = "/tmp/cheatsheet_correct.png"
    generate_qr_code(expected_url, correct_filename)
    
    # Generate base64 version for embedding
    base64_correct = generate_base64_qr(expected_url)
    
    print(f"✅ Correct QR code generated: {correct_filename}")
    print(f"📊 Base64 length: {len(base64_correct)} chars")
    
    # Test decoding
    decoded = decode_qr_with_zbar(correct_filename)
    print(f"🔍 Decoded content: {decoded}")
    print(f"✅ Matches expected: {decoded == expected_url}")
    
    return {
        "expected_url": expected_url,
        "filename": correct_filename,
        "base64": base64_correct,
        "decoded": decoded,
        "success": decoded == expected_url
    }

def main():
    """Main test function."""
    print("🚀 QR Code Testing Suite")
    print("=" * 50)
    
    # Check available tools
    print("\n🔧 Checking Available Tools:")
    
    # Check zbarimg
    try:
        subprocess.run(['zbarimg', '--version'], capture_output=True, timeout=5)
        print("   ✅ zbarimg available")
        zbar_available = True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print("   ❌ zbarimg not available")
        zbar_available = False
    
    # Check OpenCV
    try:
        import cv2
        from pyzbar import pyzbar
        print("   ✅ OpenCV + pyzbar available")
        opencv_available = True
    except ImportError:
        print("   ❌ OpenCV/pyzbar not available")
        opencv_available = False
    
    print("   ✅ qrcode (Python) available")
    print("   ✅ PIL (Python) available")
    
    # Run tests
    test_results = test_qr_generation_and_decoding()
    cheatsheet_result = test_current_cheatsheet_qr()
    
    # Summary
    print("\n📊 Test Summary")
    print("=" * 50)
    
    successful_tests = sum(1 for r in test_results if r['success'])
    total_tests = len(test_results)
    
    print(f"QR Generation Tests: {successful_tests}/{total_tests} passed")
    print(f"Cheatsheet QR Test: {'✅ PASSED' if cheatsheet_result['success'] else '❌ FAILED'}")
    
    # Save results
    results_file = "/tmp/qr_test_results.json"
    with open(results_file, 'w') as f:
        json.dump({
            "test_results": test_results,
            "cheatsheet_result": cheatsheet_result,
            "tools_available": {
                "zbarimg": zbar_available,
                "opencv": opencv_available
            }
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {results_file}")
    
    return successful_tests == total_tests and cheatsheet_result['success']

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
