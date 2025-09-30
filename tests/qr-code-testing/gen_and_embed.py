#!/usr/bin/env python3
"""
Robust QR Code Generator with Base64 Embedding

Generates QR codes and creates HTML test pages with proper Base64 embedding.
This addresses the white QR code rendering issue by ensuring clean data URI generation.
"""

from qrcode import QRCode
from PIL import Image
import base64
import io
import json
import os
import sys

OUT = "out"
os.makedirs(OUT, exist_ok=True)

def gen_qr(id, data, box_size=10, border=4, error='M'):
    """Generate QR code and save as PNG, Base64, and metadata."""
    import qrcode.constants
    qr = QRCode(
        error_correction=getattr(qrcode.constants, f'ERROR_CORRECT_{error}'),
        box_size=box_size, 
        border=border
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    # Generate image with RGBA for better compatibility
    img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
    
    # Save PNG
    png_path = f"{OUT}/qr_{id}.png"
    img.save(png_path, format='PNG')
    
    # Generate Base64 (raw, no data URI prefix)
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    b64 = base64.b64encode(buffer.getvalue()).decode('ascii')
    
    # Save Base64 to file
    with open(f"{OUT}/qr_{id}.b64.txt", 'w') as f:
        f.write(b64)
    
    # Save metadata
    with open(f"{OUT}/qr_{id}.meta.json", 'w') as f:
        json.dump({
            "id": id,
            "data": data,
            "box_size": box_size,
            "border": border,
            "error_level": error,
            "png_size": img.size,
            "base64_length": len(b64)
        }, f, indent=2)
    
    return png_path, b64

def make_html(ids):
    """Create HTML page with properly embedded QR codes."""
    parts = []
    
    for id in ids:
        # Read Base64 data
        b64_file = f"{OUT}/qr_{id}.b64.txt"
        if not os.path.exists(b64_file):
            print(f"Warning: Base64 file not found for {id}")
            continue
            
        b64 = open(b64_file).read().strip()
        
        # Read metadata
        meta_file = f"{OUT}/qr_{id}.meta.json"
        meta = {}
        if os.path.exists(meta_file):
            with open(meta_file) as f:
                meta = json.load(f)
        
        # Create card with proper data URI
        parts.append(f'''
        <div class="card" data-qr-id="{id}">
            <h3>QR Code {id}</h3>
            <div class="qr-info">
                <div class="url">{meta.get('data', 'Unknown URL')}</div>
                <div class="meta">Size: {meta.get('png_size', 'Unknown')} | Base64: {meta.get('base64_length', 'Unknown')} chars</div>
            </div>
            <img id="qr_{id}" 
                 src="data:image/png;base64,{b64}" 
                 alt="QR Code {id}"
                 class="qr-image"
                 data-expected-url="{meta.get('data', '')}"
                 data-base64-length="{len(b64)}">
        </div>''')
    
    html = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>QR Code Test Results</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background: #1a1a1a;
            color: #fff;
        }}
        .card {{
            display: inline-block;
            padding: 20px;
            margin: 20px;
            background: #2a2a2a;
            border-radius: 8px;
            border: 1px solid #333;
            vertical-align: top;
        }}
        .qr-info {{
            margin-bottom: 15px;
        }}
        .url {{
            color: #4ade80;
            word-break: break-all;
            font-size: 14px;
            margin-bottom: 5px;
        }}
        .meta {{
            color: #94a3b8;
            font-size: 12px;
        }}
        .qr-image {{
            width: 200px;
            height: 200px;
            border: 2px solid #444;
            background: #fff;
        }}
        h1 {{
            color: #fbbf24;
            margin-bottom: 30px;
        }}
        h3 {{
            color: #60a5fa;
            margin-top: 0;
        }}
        .debug-info {{
            margin-top: 20px;
            padding: 15px;
            background: #333;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
        }}
    </style>
</head>
<body>
    <h1>🧪 QR Code Test Results</h1>
    <p>Generated QR codes for testing. Use your phone's camera to scan and verify the URLs.</p>
    
    {''.join(parts)}
    
    <div class="debug-info">
        <h3>Debug Information</h3>
        <p>Run this in browser console to check image loading:</p>
        <pre>document.querySelectorAll('img').forEach(img => {{
    console.log('ID:', img.id, 
                'Src length:', img.src.length,
                'Natural size:', img.naturalWidth + 'x' + img.naturalHeight,
                'Visible:', img.offsetWidth > 0 && img.offsetHeight > 0);
}});</pre>
    </div>
</body>
</html>'''
    
    html_path = f"{OUT}/index.html"
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    return html_path

def verify_b64_roundtrip(id):
    """Verify Base64 roundtrip by decoding and comparing with original PNG."""
    b64_file = f"{OUT}/qr_{id}.b64.txt"
    png_file = f"{OUT}/qr_{id}.png"
    
    if not os.path.exists(b64_file) or not os.path.exists(png_file):
        return False, "Files not found"
    
    # Read Base64
    b64 = open(b64_file).read().strip()
    
    # Decode Base64
    try:
        decoded_data = base64.b64decode(b64)
        
        # Write decoded data to temp file
        temp_file = f"{OUT}/qr_{id}_decoded.png"
        with open(temp_file, 'wb') as f:
            f.write(decoded_data)
        
        # Compare file sizes
        original_size = os.path.getsize(png_file)
        decoded_size = os.path.getsize(temp_file)
        
        return original_size == decoded_size, f"Original: {original_size}, Decoded: {decoded_size}"
        
    except Exception as e:
        return False, f"Decode error: {e}"

def main():
    """Generate QR codes for Linux cheatsheet URLs."""
    print("🚀 QR Code Generator with Debugging")
    print("=" * 50)
    
    # Test URLs
    test_urls = {
        "home": "https://ccri-cyberknights.github.io/page/",
        "cheatsheet3": "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html",
        "video1": "https://www.youtube.com/watch?v=twREXouRxns&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=6",
        "video2": "https://www.youtube.com/watch?v=2DcDQe8idtU&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M&index=7"
    }
    
    generated_ids = []
    
    for id, url in test_urls.items():
        print(f"\n📱 Generating QR code for {id}:")
        print(f"   URL: {url}")
        
        try:
            png_path, b64 = gen_qr(id, url)
            generated_ids.append(id)
            
            print(f"   ✅ PNG saved: {png_path}")
            print(f"   ✅ Base64 length: {len(b64)} chars")
            
            # Verify roundtrip
            success, msg = verify_b64_roundtrip(id)
            print(f"   🔍 Roundtrip test: {'✅' if success else '❌'} {msg}")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Create HTML page
    if generated_ids:
        html_path = make_html(generated_ids)
        print(f"\n📄 HTML test page created: {html_path}")
        
        # Open in browser
        import webbrowser
        webbrowser.open(f"file://{os.path.abspath(html_path)}")
    
    print(f"\n📊 Summary:")
    print(f"   Generated: {len(generated_ids)} QR codes")
    print(f"   Output directory: {os.path.abspath(OUT)}")
    print(f"   Files: PNG, Base64, JSON metadata, HTML page")

if __name__ == "__main__":
    main()
