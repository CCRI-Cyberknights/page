#!/usr/bin/env python3
"""
Quick QR Code Tester

Command-line tool for testing QR code generation and decoding.
Usage: python3 qr_test.py <text> [output_file]
"""

import qrcode
import base64
import io
import sys
import requests
from PIL import Image

def generate_qr(text, output_file=None, size=10):
    """Generate QR code and optionally save to file."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=size,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    if output_file:
        img.save(output_file)
        print(f"QR code saved to: {output_file}")
    
    return img

def decode_qr(filename):
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
    except Exception as e:
        print(f"Error decoding QR code: {e}")
        return None

def get_base64_qr(text, size=10):
    """Get QR code as base64 string."""
    img = generate_qr(text, size=size)
    
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python3 qr_test.py <text> [output_file]")
        print("       python3 qr_test.py --decode <filename>")
        print("       python3 qr_test.py --base64 <text>")
        sys.exit(1)
    
    if sys.argv[1] == "--decode":
        if len(sys.argv) < 3:
            print("Usage: python3 qr_test.py --decode <filename>")
            sys.exit(1)
        
        filename = sys.argv[2]
        decoded = decode_qr(filename)
        
        if decoded:
            print(f"Decoded content: {decoded}")
        else:
            print("Failed to decode QR code")
            sys.exit(1)
    
    elif sys.argv[1] == "--base64":
        if len(sys.argv) < 3:
            print("Usage: python3 qr_test.py --base64 <text>")
            sys.exit(1)
        
        text = sys.argv[2]
        base64_qr = get_base64_qr(text)
        print(base64_qr)
    
    else:
        text = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        
        print(f"Generating QR code for: {text}")
        img = generate_qr(text, output_file)
        
        width, height = img.size
        print(f"QR code size: {width}x{height}")
        
        if output_file:
            # Test decoding
            decoded = decode_qr(output_file)
            if decoded:
                print(f"Decoded content: {decoded}")
                print(f"✅ Success: {decoded == text}")
            else:
                print("❌ Failed to decode QR code")

if __name__ == "__main__":
    main()
