#!/usr/bin/env python3
"""
QR Code Generator Script for Linux Cheat Sheet

This script generates QR codes with custom colors and minimal margins for embedding
directly into HTML documents as base64 data URLs.

Usage:
    python generate_qr_codes.py

Features:
- Low Error Correction Level (ECL) for smaller QR codes
- Custom colors (green background, black modules)
- Minimal border for tight spacing
- Base64 output for direct HTML embedding
- Configurable box size and border settings
"""

import qrcode
import base64
from io import BytesIO
import argparse
import sys
import os

def generate_qr_code(data, ecl='L', box_size=8, border=2, fill_color="black", back_color="#10b981"):
    """
    Generate a QR code and return it as a base64 data URL.
    
    Args:
        data (str): The data to encode in the QR code
        ecl (str): Error Correction Level ('L', 'M', 'Q', 'H')
        box_size (int): Size of each module in pixels
        border (int): Border size in modules
        fill_color (str): Color of QR code modules
        back_color (str): Background color
    
    Returns:
        str: Base64 data URL ready for HTML embedding
    """
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=getattr(qrcode.constants, f'ERROR_CORRECT_{ecl.upper()}'),
            box_size=box_size,
            border=border,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        # Create image with specified colors
        img = qr.make_image(fill_color=fill_color, back_color=back_color)
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_str}"
    
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return None

def main():
    """Main function to generate QR codes for Linux cheat sheet videos."""
    
    parser = argparse.ArgumentParser(description='Generate QR codes for Linux cheat sheet')
    parser.add_argument('--ecl', default='L', choices=['L', 'M', 'Q', 'H'],
                       help='Error Correction Level (default: L)')
    parser.add_argument('--box-size', type=int, default=8,
                       help='Box size in pixels (default: 8)')
    parser.add_argument('--border', type=int, default=2,
                       help='Border size in modules (default: 2)')
    parser.add_argument('--fill-color', default='black',
                       help='QR code module color (default: black)')
    parser.add_argument('--back-color', default='#10b981',
                       help='Background color (default: #10b981 - emerald green)')
    parser.add_argument('--output', '-o', default='qr_codes_output.txt',
                       help='Output file for base64 QR codes (default: qr_codes_output.txt)')
    
    args = parser.parse_args()
    
    print("🎯 Generating QR codes for Linux cheat sheet videos...")
    print(f"   ECL: {args.ecl}")
    print(f"   Box size: {args.box_size}px")
    print(f"   Border: {args.border} modules")
    print(f"   Fill color: {args.fill_color}")
    print(f"   Background color: {args.back_color}")
    print()
    
    # Video URLs to encode
    videos = [
        {
            'title': 'Linux Commands and File Structure',
            'url': 'https://youtu.be/N9j--n-zGgc',
            'filename': 'video1_qr'
        },
        {
            'title': 'File System Navigation from the Terminal',
            'url': 'https://youtu.be/lI0mUMqBesU',
            'filename': 'video2_qr'
        }
    ]
    
    generated_codes = []
    
    for i, video in enumerate(videos, 1):
        print(f"📹 Generating QR code {i}: {video['title']}")
        print(f"   URL: {video['url']}")
        
        qr_base64 = generate_qr_code(
            data=video['url'],
            ecl=args.ecl,
            box_size=args.box_size,
            border=args.border,
            fill_color=args.fill_color,
            back_color=args.back_color
        )
        
        if qr_base64:
            generated_codes.append({
                'title': video['title'],
                'url': video['url'],
                'filename': video['filename'],
                'base64': qr_base64,
                'length': len(qr_base64)
            })
            print(f"   ✅ Generated successfully ({len(qr_base64)} characters)")
        else:
            print(f"   ❌ Failed to generate QR code")
        print()
    
    # Save to output file
    if generated_codes:
        try:
            with open(args.output, 'w') as f:
                f.write("# QR Codes for Linux Cheat Sheet\n")
                f.write("# Generated with generate_qr_codes.py\n\n")
                
                for code in generated_codes:
                    f.write(f"# {code['title']}\n")
                    f.write(f"# URL: {code['url']}\n")
                    f.write(f"# Length: {code['length']} characters\n")
                    f.write(f"{code['base64']}\n\n")
            
            print(f"📁 QR codes saved to: {args.output}")
            print(f"✅ Generated {len(generated_codes)} QR codes successfully!")
            
            # Print usage instructions
            print("\n📋 Usage Instructions:")
            print("1. Copy the base64 data URLs from the output file")
            print("2. Paste them into your HTML <img> src attributes")
            print("3. Example: <img src=\"data:image/png;base64,iVBORw0KGgo...\" />")
            
        except Exception as e:
            print(f"❌ Error saving output file: {e}")
            sys.exit(1)
    else:
        print("❌ No QR codes were generated successfully")
        sys.exit(1)

if __name__ == "__main__":
    main()