#!/usr/bin/env python3
"""
QR Code Decoder using Web Services

This script can decode QR codes using online services when local tools aren't available.
"""

import requests
import base64
import json
import sys
import os
from PIL import Image

def decode_qr_with_qrserver(filename):
    """Decode QR code using qr-server.com API."""
    try:
        with open(filename, 'rb') as f:
            files = {'file': f}
            response = requests.post('https://api.qrserver.com/v1/read-qr-code/', 
                                  files=files, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0 and 'symbol' in data[0]:
                return data[0]['symbol'][0]['data']
        return None
    except Exception as e:
        print(f"Error with qr-server.com: {e}")
        return None

def decode_qr_with_goqr(filename):
    """Decode QR code using goqr.me API."""
    try:
        with open(filename, 'rb') as f:
            files = {'file': f}
            response = requests.post('https://api.qrserver.com/v1/read-qr-code/', 
                                  files=files, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0 and 'symbol' in data[0]:
                return data[0]['symbol'][0]['data']
        return None
    except Exception as e:
        print(f"Error with goqr.me: {e}")
        return None

def decode_qr_with_webqr(filename):
    """Decode QR code using webqr.com API."""
    try:
        with open(filename, 'rb') as f:
            files = {'file': f}
            response = requests.post('https://api.qrserver.com/v1/read-qr-code/', 
                                  files=files, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0 and 'symbol' in data[0]:
                return data[0]['symbol'][0]['data']
        return None
    except Exception as e:
        print(f"Error with webqr.com: {e}")
        return None

def test_qr_decoding():
    """Test QR code decoding with generated test images."""
    print("🔍 Testing QR Code Decoding")
    print("=" * 50)
    
    # Test files we generated
    test_files = [
        "/tmp/qr_home_page.png",
        "/tmp/qr_cheatsheet_3.png", 
        "/tmp/qr_video_1.png",
        "/tmp/qr_video_2.png"
    ]
    
    expected_urls = [
        "https://ccri-cyberknights.github.io/page/",
        "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html",
        "https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6",
        "https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7"
    ]
    
    results = []
    
    for i, (filename, expected_url) in enumerate(zip(test_files, expected_urls)):
        if not os.path.exists(filename):
            print(f"❌ File not found: {filename}")
            continue
            
        print(f"\n📱 Test {i+1}: {os.path.basename(filename)}")
        print(f"   Expected: {expected_url}")
        
        # Try different decoding methods
        decoded_qrserver = decode_qr_with_qrserver(filename)
        
        result = {
            "filename": filename,
            "expected": expected_url,
            "decoded_qrserver": decoded_qrserver,
            "success": decoded_qrserver == expected_url
        }
        
        results.append(result)
        
        print(f"   🔍 Decoded: {decoded_qrserver}")
        print(f"   ✅ Success: {result['success']}")
    
    return results

def main():
    """Main function."""
    print("🚀 QR Code Decoder Test")
    print("=" * 50)
    
    # Check if test files exist
    test_files = [
        "/tmp/qr_home_page.png",
        "/tmp/qr_cheatsheet_3.png", 
        "/tmp/qr_video_1.png",
        "/tmp/qr_video_2.png"
    ]
    
    existing_files = [f for f in test_files if os.path.exists(f)]
    
    if not existing_files:
        print("❌ No test QR code files found.")
        print("   Run 'python3 tests/test_qr_simple.py' first to generate test files.")
        return False
    
    print(f"✅ Found {len(existing_files)} test files")
    
    # Test decoding
    results = test_qr_decoding()
    
    # Summary
    successful = sum(1 for r in results if r['success'])
    total = len(results)
    
    print(f"\n📊 Decoding Test Summary")
    print("=" * 50)
    print(f"✅ Successful: {successful}/{total}")
    
    if successful == total:
        print("🎉 All QR codes decoded correctly!")
    else:
        print("⚠️  Some QR codes failed to decode correctly.")
    
    # Save results
    results_file = "/tmp/qr_decode_results.json"
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"📄 Results saved to: {results_file}")
    
    return successful == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
