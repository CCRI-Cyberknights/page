#!/usr/bin/env python3
"""
Simple QR Code Testing Script

This script generates QR codes and provides a simple way to test them
by displaying the generated images and base64 data.
"""

import qrcode
import base64
import io
import os
import sys
import json
from PIL import Image

def generate_qr_code(text, filename=None, size=10):
    """Generate a QR code and return the PIL Image object."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=size,
        border=4,
    )
    qr.add_data(text)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    if filename:
        img.save(filename)
        print(f"QR code saved to: {filename}")
    
    return img

def generate_base64_qr(text, size=10):
    """Generate a QR code and return it as base64 string."""
    img = generate_qr_code(text, size=size)
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def test_cheatsheet_qr_codes():
    """Test QR codes for the Linux cheatsheet."""
    print("🧪 Testing Linux Cheatsheet QR Codes")
    print("=" * 50)
    
    # URLs that should be in the cheatsheet
    test_urls = {
        "home_page": "https://ccri-cyberknights.github.io/page/",
        "cheatsheet_3": "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html",
        "video_1": "https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6",
        "video_2": "https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7"
    }
    
    results = {}
    
    for name, url in test_urls.items():
        print(f"\n📱 Testing {name}:")
        print(f"   URL: {url}")
        
        # Generate QR code
        filename = f"/tmp/qr_{name}.png"
        img = generate_qr_code(url, filename)
        
        # Generate base64 version
        base64_qr = generate_base64_qr(url)
        
        # Get image dimensions
        width, height = img.size
        
        results[name] = {
            "url": url,
            "filename": filename,
            "base64_length": len(base64_qr),
            "image_size": f"{width}x{height}",
            "base64_preview": base64_qr[:100] + "..."
        }
        
        print(f"   ✅ Generated: {filename}")
        print(f"   📊 Image size: {width}x{height}")
        print(f"   📊 Base64 length: {len(base64_qr)} chars")
    
    return results

def create_html_test_page(results):
    """Create an HTML page to visually test QR codes."""
    html_content = """
<!DOCTYPE html>
<html>
<head>
    <title>QR Code Test Page</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #fff; }
        .qr-test { margin: 20px 0; padding: 20px; border: 1px solid #333; border-radius: 8px; }
        .qr-image { margin: 10px 0; }
        .url { color: #4ade80; word-break: break-all; }
        .info { color: #94a3b8; font-size: 14px; }
        h1 { color: #fbbf24; }
        h2 { color: #60a5fa; }
    </style>
</head>
<body>
    <h1>🧪 QR Code Test Results</h1>
    <p class="info">Generated QR codes for testing. Use your phone's camera to scan and verify the URLs.</p>
"""
    
    for name, data in results.items():
        html_content += f"""
    <div class="qr-test">
        <h2>{name.replace('_', ' ').title()}</h2>
        <div class="url">URL: {data['url']}</div>
        <div class="info">File: {data['filename']}</div>
        <div class="info">Size: {data['image_size']}</div>
        <div class="info">Base64 length: {data['base64_length']} chars</div>
        <div class="qr-image">
            <img src="{data['base64_preview'].replace('...', '')}" alt="QR Code for {name}" />
        </div>
    </div>
"""
    
    html_content += """
</body>
</html>
"""
    
    filename = "/tmp/qr_test_results.html"
    with open(filename, 'w') as f:
        f.write(html_content)
    
    print(f"\n📄 HTML test page created: {filename}")
    return filename

def main():
    """Main test function."""
    print("🚀 QR Code Testing Suite")
    print("=" * 50)
    
    # Test cheatsheet QR codes
    results = test_cheatsheet_qr_codes()
    
    # Create HTML test page
    html_file = create_html_test_page(results)
    
    # Save JSON results
    json_file = "/tmp/qr_test_results.json"
    with open(json_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Test Summary")
    print("=" * 50)
    print(f"✅ Generated {len(results)} QR codes")
    print(f"📄 HTML test page: {html_file}")
    print(f"📄 JSON results: {json_file}")
    
    print(f"\n🔍 To test QR codes:")
    print(f"1. Open {html_file} in your browser")
    print(f"2. Use your phone's camera to scan each QR code")
    print(f"3. Verify the decoded URLs match the expected values")
    
    # Check if we can open the HTML file
    if os.path.exists(html_file):
        print(f"\n🌐 Opening test page...")
        os.system(f"xdg-open {html_file} 2>/dev/null || firefox {html_file} 2>/dev/null || echo 'Please open {html_file} manually'")
    
    return True

if __name__ == "__main__":
    main()
