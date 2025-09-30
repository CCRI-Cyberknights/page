#!/usr/bin/env python3
"""
QR Code Integration Test

Quick integration test for QR code functionality.
Can be run as part of the project's test suite.
"""

import qrcode
import base64
import io
import sys
import requests
from PIL import Image

def test_qr_generation():
    """Test basic QR code generation."""
    test_url = "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html"
    
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(test_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Test base64 generation
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        base64_qr = f"data:image/png;base64,{img_str}"
        
        return True, f"Generated QR code: {len(base64_qr)} chars"
        
    except Exception as e:
        return False, f"QR generation failed: {e}"

def test_qr_decoding():
    """Test QR code decoding."""
    test_url = "https://ccri-cyberknights.github.io/page/"
    
    try:
        # Generate test QR code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(test_url)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to temp file
        import tempfile
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            img.save(tmp.name)
            temp_file = tmp.name
        
        # Test decoding
        with open(temp_file, 'rb') as f:
            files = {'file': f}
            response = requests.post('https://api.qrserver.com/v1/read-qr-code/', 
                                  files=files, timeout=10)
        
        # Clean up
        import os
        os.unlink(temp_file)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0 and 'symbol' in data[0]:
                decoded = data[0]['symbol'][0]['data']
                return decoded == test_url, f"Decoded: {decoded}"
        
        return False, "Decoding failed"
        
    except Exception as e:
        return False, f"QR decoding failed: {e}"

def main():
    """Run QR code integration tests."""
    print("🧪 QR Code Integration Test")
    print("=" * 40)
    
    # Test generation
    success_gen, msg_gen = test_qr_generation()
    print(f"Generation: {'✅' if success_gen else '❌'} {msg_gen}")
    
    # Test decoding
    success_decode, msg_decode = test_qr_decoding()
    print(f"Decoding: {'✅' if success_decode else '❌'} {msg_decode}")
    
    # Overall result
    overall_success = success_gen and success_decode
    print(f"\nOverall: {'✅ PASSED' if overall_success else '❌ FAILED'}")
    
    return overall_success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
