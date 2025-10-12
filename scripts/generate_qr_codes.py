#!/usr/bin/env python3
"""
QR Code Generator Script for Educational Guides

This script generates QR codes with custom colors and minimal margins for embedding
directly into HTML guides as SVG elements. Supports multiple cheatsheet types.

Usage:
    python generate_qr_codes.py                    # Generate for cheatsheet 1 (default)
    python generate_qr_codes.py --cheatsheet 2     # Generate for cheatsheet 2
    python generate_qr_codes.py --cheatsheet 4     # Generate for cheatsheet 4

Features:
- Low Error Correction Level (ECL) for smaller QR codes
- Custom colors (green background, black modules)
- Minimal border for tight spacing
- SVG output for direct HTML embedding
- Configurable box size and border settings
- Support for multiple cheatsheet types
"""

import qrcode
import qrcode.image.svg
import base64
from io import BytesIO
import argparse
import sys
import os

def generate_qr_code(data, ecl='L', box_size=8, border=2, fill_color="black", back_color="#10b981"):
    """
    Generate a QR code and return it as SVG data.
    
    Args:
        data (str): The data to encode in the QR code
        ecl (str): Error Correction Level ('L', 'M', 'Q', 'H')
        box_size (int): Size of each module in pixels
        border (int): Border size in modules
        fill_color (str): Color of QR code modules
        back_color (str): Background color
    
    Returns:
        str: SVG data ready for HTML embedding
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
        
        # Create SVG factory with custom colors
        factory = qrcode.image.svg.SvgPathImage
        img = qr.make_image(image_factory=factory)
        
        # Get SVG content
        svg_content = img.to_string().decode('utf-8')
        
        # Extract the path data from the SVG
        import re
        path_match = re.search(r'<path d="([^"]*)"', svg_content)
        if not path_match:
            raise ValueError("Could not extract path data from SVG")
        
        path_data = path_match.group(1)
        
        # Calculate dimensions (box_size * modules + border * 2 * box_size)
        modules = qr.modules_count
        total_size = modules * box_size + border * 2 * box_size
        
        # Create custom SVG with our styling
        # Display size: 120x120px, but internal coordinates scaled down by 10
        # This matches the pattern used in cheatsheet 4
        scaled_size = total_size / 10
        svg = f'''<svg width="120" height="120" viewBox="0 0 {scaled_size} {scaled_size}" xmlns="http://www.w3.org/2000/svg" class="border border-emerald-500 rounded" style="background-color: {back_color};">
  <path d="{path_data}" fill="#000000" fill-opacity="1" fill-rule="nonzero" stroke="none"/>
  <title>QR Code</title>
</svg>'''
        
        return svg
    
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return None

def get_cheatsheet_videos(cheatsheet_num):
    """Get video data for specific cheatsheet."""
    cheatsheets = {
        1: [
            {
                'title': 'Linux Commands and File Structure',
                'url': 'https://youtu.be/N9j--n-zGgc',
                'full_url': 'https://www.youtube.com/watch?v=N9j--n-zGgc&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M',
                'filename': 'video1_qr'
            },
            {
                'title': 'File System Navigation from the Terminal',
                'url': 'https://youtu.be/lI0mUMqBesU',
                'full_url': 'https://www.youtube.com/watch?v=lI0mUMqBesU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=3',
                'filename': 'video2_qr'
            }
        ],
        2: [
            {
                'title': 'Creating & Moving Files & Folders',
                'url': 'https://youtu.be/7JYJO_D8zVs',
                'full_url': 'https://www.youtube.com/watch?v=7JYJO_D8zVs&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=4',
                'filename': 'video1_qr'
            },
            {
                'title': 'Advanced File Operations',
                'url': 'https://youtu.be/gSVg40u0fZE',
                'full_url': 'https://www.youtube.com/watch?v=gSVg40u0fZE&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=5',
                'filename': 'video2_qr'
            }
        ],
        3: [
            {
                'title': 'Files, Deleting, History & Redirects',
                'url': 'https://youtu.be/twREXouRxns',
                'full_url': 'https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6',
                'filename': 'video1_qr'
            },
            {
                'title': 'Advanced File Operations & Redirects',
                'url': 'https://youtu.be/2DcDQe8idtU',
                'full_url': 'https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7',
                'filename': 'video2_qr'
            }
        ],
        4: [
            {
                'title': 'Text Editors & GUI Programs',
                'url': 'https://youtu.be/rR_n2ciilrc',
                'full_url': 'https://www.youtube.com/watch?v=rR_n2ciilrc&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=8',
                'filename': 'video1_qr'
            },
            {
                'title': 'File Deletion & Terminal Management',
                'url': 'https://youtu.be/l0d7ks9ZkjU',
                'full_url': 'https://www.youtube.com/watch?v=l0d7ks9ZkjU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=9',
                'filename': 'video2_qr'
            }
        ],
        3: [
            {
                'title': 'Files, Deleting, History & Redirects',
                'url': 'https://youtu.be/twREXouRxns',
                'full_url': 'https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6',
                'filename': 'video1_qr'
            },
            {
                'title': 'Advanced File Operations & Redirects',
                'url': 'https://youtu.be/2DcDQe8idtU',
                'full_url': 'https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7',
                'filename': 'video2_qr'
            }
        ],
        5: [
            {
                'title': 'Users, Permissions & Sudo (Part 1)',
                'url': 'https://youtu.be/y6-e233rrQE',
                'full_url': 'https://www.youtube.com/watch?v=y6-e233rrQE&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=10',
                'filename': 'video1_qr'
            },
            {
                'title': 'Users, Permissions & Sudo (Part 2)',
                'url': 'https://youtu.be/to0GrfGERK0',
                'full_url': 'https://www.youtube.com/watch?v=to0GrfGERK0&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=11',
                'filename': 'video2_qr'
            }
        ]
    }
    return cheatsheets.get(cheatsheet_num, [])

def main():
    """Main function to generate QR codes for educational document videos."""
    
    parser = argparse.ArgumentParser(description='Generate QR codes for educational document videos')
    parser.add_argument('--cheatsheet', type=int, choices=[1, 2, 3, 4, 5], default=1,
                       help='Cheatsheet number (1, 2, 3, 4, or 5, default: 1)')
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
    
    print(f"🎯 Generating QR codes for Linux Cheatsheet {args.cheatsheet}...")
    print(f"   ECL: {args.ecl}")
    print(f"   Box size: {args.box_size}px")
    print(f"   Border: {args.border} modules")
    print(f"   Fill color: {args.fill_color}")
    print(f"   Background color: {args.back_color}")
    print()
    
    # Get videos for selected cheatsheet
    videos = get_cheatsheet_videos(args.cheatsheet)
    
    if not videos:
        print(f"❌ No videos found for cheatsheet {args.cheatsheet}")
        sys.exit(1)
    
    generated_codes = []
    
    for i, video in enumerate(videos, 1):
        print(f"📹 Generating QR code {i}: {video['title']}")
        print(f"   URL: {video['url']}")
        
        qr_svg = generate_qr_code(
            data=video['url'],
            ecl=args.ecl,
            box_size=args.box_size,
            border=args.border,
            fill_color=args.fill_color,
            back_color=args.back_color
        )
        
        if qr_svg:
            generated_codes.append({
                'title': video['title'],
                'url': video['url'],
                'filename': video['filename'],
                'svg': qr_svg,
                'length': len(qr_svg)
            })
            print(f"   ✅ Generated successfully ({len(qr_svg)} characters)")
        else:
            print(f"   ❌ Failed to generate QR code")
        print()
    
    # Save to output file
    if generated_codes:
        try:
            with open(args.output, 'w') as f:
                f.write(f"# QR Codes for Linux Cheatsheet {args.cheatsheet}\n")
                f.write("# Generated with generate_qr_codes.py (SVG format)\n\n")
                
                for code in generated_codes:
                    f.write(f"# {code['title']}\n")
                    f.write(f"# URL: {code['url']}\n")
                    f.write(f"# Length: {code['length']} characters\n")
                    f.write(f"{code['svg']}\n\n")
            
            print(f"📁 QR codes saved to: {args.output}")
            print(f"✅ Generated {len(generated_codes)} QR codes successfully!")
            
            # Print usage instructions
            print("\n📋 Usage Instructions:")
            print("1. Copy the SVG code from the output file")
            print("2. Paste it directly into your HTML")
            print("3. Example: <div>SVG_CODE_HERE</div>")
            
        except Exception as e:
            print(f"❌ Error saving output file: {e}")
            sys.exit(1)
    else:
        print("❌ No QR codes were generated successfully")
        sys.exit(1)

if __name__ == "__main__":
    main()