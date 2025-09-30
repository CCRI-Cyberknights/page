#!/usr/bin/env python3
"""
QR Code Unit Tests for Linux Cheatsheet

This script tests QR code generation and decoding functionality
specifically for the Linux cheatsheet project.
"""

import qrcode
import base64
import io
import json
import os
import sys
import requests
from PIL import Image

class QRCodeTester:
    """QR Code testing utility class."""
    
    def __init__(self):
        self.test_results = []
    
    def generate_qr_code(self, text, size=10):
        """Generate a QR code and return PIL Image."""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=size,
            border=4,
        )
        qr.add_data(text)
        qr.make(fit=True)
        
        return qr.make_image(fill_color="black", back_color="white")
    
    def generate_base64_qr(self, text, size=10):
        """Generate QR code as base64 string."""
        img = self.generate_qr_code(text, size)
        
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    
    def decode_qr_with_api(self, filename):
        """Decode QR code using online API."""
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
        except Exception:
            return None
    
    def test_cheatsheet_qr_codes(self):
        """Test QR codes for Linux cheatsheet."""
        print("🧪 Testing Linux Cheatsheet QR Codes")
        print("=" * 50)
        
        # Expected URLs for the cheatsheet
        expected_urls = {
            "home_page": "https://ccri-cyberknights.github.io/page/",
            "cheatsheet_3": "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html",
            "video_1": "https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6",
            "video_2": "https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7"
        }
        
        results = {}
        
        for name, url in expected_urls.items():
            print(f"\n📱 Testing {name}:")
            print(f"   URL: {url}")
            
            # Generate QR code
            img = self.generate_qr_code(url)
            
            # Save to temp file for decoding test
            temp_file = f"/tmp/test_{name}.png"
            img.save(temp_file)
            
            # Generate base64 version
            base64_qr = self.generate_base64_qr(url)
            
            # Test decoding
            decoded_url = self.decode_qr_with_api(temp_file)
            
            # Get image dimensions
            width, height = img.size
            
            result = {
                "name": name,
                "expected_url": url,
                "decoded_url": decoded_url,
                "base64_length": len(base64_qr),
                "image_size": f"{width}x{height}",
                "success": decoded_url == url,
                "temp_file": temp_file
            }
            
            results[name] = result
            self.test_results.append(result)
            
            print(f"   ✅ Generated: {temp_file}")
            print(f"   📊 Image size: {width}x{height}")
            print(f"   📊 Base64 length: {len(base64_qr)} chars")
            print(f"   🔍 Decoded: {decoded_url}")
            print(f"   ✅ Success: {result['success']}")
        
        return results
    
    def test_qr_code_quality(self):
        """Test QR code quality and readability."""
        print("\n🔍 Testing QR Code Quality")
        print("=" * 50)
        
        test_url = "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html"
        
        # Test different sizes
        sizes = [5, 10, 15, 20]
        quality_results = []
        
        for size in sizes:
            print(f"\n📏 Testing size {size}:")
            
            img = self.generate_qr_code(test_url, size)
            temp_file = f"/tmp/quality_test_{size}.png"
            img.save(temp_file)
            
            # Test decoding
            decoded_url = self.decode_qr_with_api(temp_file)
            
            width, height = img.size
            
            result = {
                "size": size,
                "image_size": f"{width}x{height}",
                "decoded_url": decoded_url,
                "success": decoded_url == test_url
            }
            
            quality_results.append(result)
            
            print(f"   📊 Image size: {width}x{height}")
            print(f"   🔍 Decoded: {decoded_url}")
            print(f"   ✅ Success: {result['success']}")
        
        return quality_results
    
    def test_error_correction_levels(self):
        """Test different error correction levels."""
        print("\n🛡️ Testing Error Correction Levels")
        print("=" * 50)
        
        test_url = "https://ccri-cyberknights.github.io/page/"
        
        # Error correction levels
        ecl_levels = {
            "L": qrcode.constants.ERROR_CORRECT_L,
            "M": qrcode.constants.ERROR_CORRECT_M,
            "Q": qrcode.constants.ERROR_CORRECT_Q,
            "H": qrcode.constants.ERROR_CORRECT_H
        }
        
        ecl_results = []
        
        for ecl_name, ecl_constant in ecl_levels.items():
            print(f"\n🛡️ Testing ECL {ecl_name}:")
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=ecl_constant,
                box_size=10,
                border=4,
            )
            qr.add_data(test_url)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            temp_file = f"/tmp/ecl_test_{ecl_name}.png"
            img.save(temp_file)
            
            # Test decoding
            decoded_url = self.decode_qr_with_api(temp_file)
            
            width, height = img.size
            
            result = {
                "ecl": ecl_name,
                "image_size": f"{width}x{height}",
                "decoded_url": decoded_url,
                "success": decoded_url == test_url
            }
            
            ecl_results.append(result)
            
            print(f"   📊 Image size: {width}x{height}")
            print(f"   🔍 Decoded: {decoded_url}")
            print(f"   ✅ Success: {result['success']}")
        
        return ecl_results
    
    def run_all_tests(self):
        """Run all QR code tests."""
        print("🚀 QR Code Unit Test Suite")
        print("=" * 50)
        
        # Test cheatsheet QR codes
        cheatsheet_results = self.test_cheatsheet_qr_codes()
        
        # Test QR code quality
        quality_results = self.test_qr_code_quality()
        
        # Test error correction levels
        ecl_results = self.test_error_correction_levels()
        
        # Summary
        print("\n📊 Test Summary")
        print("=" * 50)
        
        cheatsheet_success = sum(1 for r in cheatsheet_results.values() if r['success'])
        quality_success = sum(1 for r in quality_results if r['success'])
        ecl_success = sum(1 for r in ecl_results if r['success'])
        
        total_tests = len(cheatsheet_results) + len(quality_results) + len(ecl_results)
        total_success = cheatsheet_success + quality_success + ecl_success
        
        print(f"Cheatsheet QR Tests: {cheatsheet_success}/{len(cheatsheet_results)} passed")
        print(f"Quality Tests: {quality_success}/{len(quality_results)} passed")
        print(f"Error Correction Tests: {ecl_success}/{len(ecl_results)} passed")
        print(f"Overall: {total_success}/{total_tests} passed")
        
        # Save results
        results = {
            "cheatsheet_results": cheatsheet_results,
            "quality_results": quality_results,
            "ecl_results": ecl_results,
            "summary": {
                "total_tests": total_tests,
                "total_success": total_success,
                "success_rate": total_success / total_tests if total_tests > 0 else 0
            }
        }
        
        results_file = "/tmp/qr_unit_test_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: {results_file}")
        
        return total_success == total_tests

def main():
    """Main function."""
    tester = QRCodeTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All QR code tests passed!")
    else:
        print("\n⚠️  Some QR code tests failed.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
