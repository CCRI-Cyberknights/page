#!/usr/bin/env python3
"""
Update cheatsheets to use SVG QR codes instead of canvas-based QR codes.
Reads generated SVG files and replaces the QR code sections in HTML files.
"""

import re
import sys

def read_svg_qr_codes(filename):
    """Read SVG QR codes from output file."""
    qr_codes = []
    current_title = None
    current_url = None
    svg_content = []
    in_svg = False
    
    with open(filename, 'r') as f:
        for line in f:
            line = line.strip()
            
            if line.startswith('# ') and not line.startswith('# QR Codes') and not line.startswith('# Generated') and not line.startswith('# URL') and not line.startswith('# Length'):
                # This is a title line
                if svg_content and current_title:
                    # Save previous QR code
                    qr_codes.append({
                        'title': current_title,
                        'url': current_url,
                        'svg': ''.join(svg_content)
                    })
                    svg_content = []
                
                current_title = line[2:]  # Remove '# ' prefix
                in_svg = False
                
            elif line.startswith('# URL:'):
                current_url = line.split(':', 1)[1].strip()
                
            elif line.startswith('<svg'):
                in_svg = True
                svg_content.append(line)
                
            elif in_svg:
                svg_content.append(line)
                if line.startswith('</svg>'):
                    in_svg = False
        
        # Don't forget the last QR code
        if svg_content and current_title:
            qr_codes.append({
                'title': current_title,
                'url': current_url,
                'svg': ''.join(svg_content)
            })
    
    return qr_codes

def update_cheatsheet_html(cheatsheet_num, qr_codes):
    """Update cheatsheet HTML with SVG QR codes."""
    filename = f'guides/linux-cheatsheet-{cheatsheet_num}.html'
    
    print(f"📝 Updating {filename}...")
    
    with open(filename, 'r') as f:
        content = f.read()
    
    # Pattern to find QR code IMG tags with base64 PNG data
    # We need to replace:
    #   <img src="data:image/png;base64,..." alt="QR Code for..." width="120" height="120" class="border border-emerald-500 rounded">
    # with:
    #   <svg ... > ... </svg>
    
    # Find all SVG elements with wrong viewBox (232x232)
    pattern = r'<svg width="120" height="120" viewBox="0 0 232 232"[^>]*>.*?</svg>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    # Replace in reverse order to preserve indices
    for i in range(len(qr_codes) - 1, -1, -1):
        qr = qr_codes[i]
        print(f"   Replacing QR code {i+1}: {qr['title']}")
        
        if len(matches) > i:
            match = matches[i]
            content = content[:match.start()] + qr['svg'] + content[match.end():]
        else:
            print(f"   ⚠️  Warning: Could not find SVG tag for QR code {i+1}")
    
    # Also update the CSS to remove canvas-specific styles
    # Replace the .qr-code-container canvas rule with one for svg
    content = re.sub(
        r'\.qr-code-container canvas \{\s*@apply transition-transform duration-200 hover:scale-105;\s*\}',
        '',
        content
    )
    
    with open(filename, 'w') as f:
        f.write(content)
    
    print(f"✅ Updated {filename}")

def main():
    """Main function."""
    cheatsheets = [
        (1, 'out/cheatsheet1_qr_svg_final.txt'),
        (2, 'out/cheatsheet2_qr_svg_final.txt'),
        (3, 'out/cheatsheet3_qr_svg_final.txt'),
    ]
    
    for cheatsheet_num, svg_file in cheatsheets:
        print(f"\n🎯 Processing Cheatsheet {cheatsheet_num}")
        
        try:
            qr_codes = read_svg_qr_codes(svg_file)
            print(f"   Found {len(qr_codes)} QR codes")
            
            update_cheatsheet_html(cheatsheet_num, qr_codes)
            
        except Exception as e:
            print(f"❌ Error processing cheatsheet {cheatsheet_num}: {e}")
            continue
    
    print("\n🎉 All cheatsheets updated!")

if __name__ == '__main__':
    main()

