#!/usr/bin/env python3
"""
Comprehensive QR Code Troubleshooting Script

Runs the complete debugging pipeline:
1. Generate QR codes with proper Base64
2. Verify Base64 roundtrip
3. Create HTML test page
4. Run Playwright validation
5. Generate debugging report
"""

import os
import sys
import json
import subprocess
import zipfile
from datetime import datetime

def run_command(cmd, description):
    """Run a command and return success status."""
    print(f"\n🔧 {description}")
    print(f"   Command: {cmd}")
    
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"   ✅ Success")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"   ❌ Failed")
            if result.stderr.strip():
                print(f"   Error: {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"   ❌ Exception: {e}")
        return False

def create_debug_report():
    """Create comprehensive debugging report."""
    print("🚀 QR Code Troubleshooting Pipeline")
    print("=" * 60)
    
    # Step 1: Generate QR codes
    print("\n📱 Step 1: Generate QR Codes")
    success_gen = run_command("python3 tests/gen_and_embed.py", "Generate QR codes and HTML")
    
    if not success_gen:
        print("❌ QR generation failed - stopping pipeline")
        return False
    
    # Step 2: Check generated files
    print("\n📁 Step 2: Verify Generated Files")
    out_dir = "out"
    if os.path.exists(out_dir):
        files = os.listdir(out_dir)
        print(f"   Files in {out_dir}: {len(files)}")
        for file in sorted(files):
            file_path = os.path.join(out_dir, file)
            size = os.path.getsize(file_path)
            print(f"   📄 {file}: {size} bytes")
    else:
        print("   ❌ Output directory not found")
        return False
    
    # Step 3: Run Playwright validation
    print("\n🎭 Step 3: Playwright Validation")
    success_playwright = run_command("python3 tests/playwright_validate.py", "Validate QR rendering")
    
    # Step 4: Create debugging package
    print("\n📦 Step 4: Create Debug Package")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    debug_package = f"qr_debug_{timestamp}.zip"
    
    with zipfile.ZipFile(debug_package, 'w') as zf:
        # Add all output files
        for root, dirs, files in os.walk(out_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, '.')
                zf.write(file_path, arc_path)
        
        # Add test scripts
        test_files = [
            "tests/gen_and_embed.py",
            "tests/playwright_validate.py",
            "tests/qr_test.py"
        ]
        
        for test_file in test_files:
            if os.path.exists(test_file):
                zf.write(test_file, os.path.basename(test_file))
        
        # Add summary report
        summary = {
            "timestamp": timestamp,
            "generation_success": success_gen,
            "playwright_success": success_playwright,
            "files_generated": len(os.listdir(out_dir)) if os.path.exists(out_dir) else 0,
            "debug_package": debug_package
        }
        
        zf.writestr("debug_summary.json", json.dumps(summary, indent=2))
    
    print(f"   📦 Debug package created: {debug_package}")
    
    # Step 5: Print next steps
    print("\n📋 Next Steps for Engineer")
    print("=" * 60)
    print("1. 📁 Check the 'out/' directory for generated files:")
    print("   - PNG files: Actual QR code images")
    print("   - B64 files: Base64 encoded data")
    print("   - JSON files: Metadata")
    print("   - HTML file: Test page")
    print("   - Screenshot: Playwright rendering result")
    
    print("\n2. 🔍 Open 'out/index.html' in browser to see visual result")
    
    print("\n3. 📊 Check 'out/playwright_results.json' for detailed analysis")
    
    print("\n4. 📦 Send 'qr_debug_TIMESTAMP.zip' to engineer for analysis")
    
    print("\n5. 🛠️  Common fixes to try:")
    print("   - Check if PNG files are actually white when viewed directly")
    print("   - Verify Base64 data doesn't have line breaks or extra characters")
    print("   - Check browser console for image loading errors")
    print("   - Try replacing data URI with direct PNG file path")
    
    return success_gen and success_playwright

def main():
    """Main troubleshooting function."""
    success = create_debug_report()
    
    if success:
        print("\n🎉 Troubleshooting completed successfully!")
    else:
        print("\n⚠️  Troubleshooting completed with issues")
        print("   Check the debug package for detailed analysis")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
