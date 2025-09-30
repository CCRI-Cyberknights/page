#!/usr/bin/env python3
"""
Playwright QR Code Validation

Validates QR code rendering using Playwright to diagnose white box issues.
Checks DOM properties, computed styles, and takes screenshots for debugging.
"""

from playwright.sync_api import sync_playwright, expect
import os
import json
import sys

OUT = "out"

def validate_qr_rendering(html_path=None):
    """Validate QR code rendering using Playwright."""
    if html_path is None:
        html_path = os.path.join(OUT, "index.html")
    
    if not os.path.exists(html_path):
        print(f"❌ HTML file not found: {html_path}")
        return False
    
    print("🔍 Playwright QR Code Validation")
    print("=" * 50)
    
    # Convert to file:// URL
    html_url = f"file://{os.path.abspath(html_path)}"
    print(f"📄 Loading: {html_url}")
    
    results = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Show browser for debugging
        page = browser.new_page()
        
        try:
            page.goto(html_url)
            page.wait_for_load_state('networkidle')
            
            # Find all QR code images
            imgs = page.query_selector_all("img.qr-image")
            print(f"📱 Found {len(imgs)} QR code images")
            
            for i, img in enumerate(imgs):
                img_id = img.get_attribute("id") or f"img_{i}"
                print(f"\n🔍 Analyzing {img_id}:")
                
                # Get basic properties
                src = img.get_attribute("src") or ""
                alt = img.get_attribute("alt") or ""
                expected_url = img.get_attribute("data-expected-url") or ""
                
                # Get natural dimensions (actual image size)
                natural_dims = page.evaluate("(img) => [img.naturalWidth, img.naturalHeight]", img)
                natural_width, natural_height = natural_dims
                
                # Check if image is visible
                is_visible = img.is_visible()
                
                # Get computed styles
                computed_styles = page.evaluate("""
                    (img) => {
                        const cs = window.getComputedStyle(img);
                        return {
                            display: cs.display,
                            visibility: cs.visibility,
                            opacity: cs.opacity,
                            width: cs.width,
                            height: cs.height,
                            background: cs.background,
                            backgroundColor: cs.backgroundColor,
                            filter: cs.filter,
                            mixBlendMode: cs.mixBlendMode,
                            zIndex: cs.zIndex
                        };
                    }
                """, img)
                
                # Check parent element styles
                parent_styles = page.evaluate("""
                    (img) => {
                        const parent = img.parentElement;
                        if (!parent) return null;
                        const cs = window.getComputedStyle(parent);
                        return {
                            display: cs.display,
                            overflow: cs.overflow,
                            backgroundColor: cs.backgroundColor,
                            width: cs.width,
                            height: cs.height
                        };
                    }
                """, img)
                
                result = {
                    "id": img_id,
                    "src_length": len(src),
                    "src_prefix": src[:50] + "..." if len(src) > 50 else src,
                    "natural_width": natural_width,
                    "natural_height": natural_height,
                    "is_visible": is_visible,
                    "expected_url": expected_url,
                    "computed_styles": computed_styles,
                    "parent_styles": parent_styles,
                    "issues": []
                }
                
                # Diagnose issues
                if natural_width == 0 or natural_height == 0:
                    result["issues"].append("Image not loaded (natural dimensions are 0)")
                
                if not is_visible:
                    result["issues"].append("Image not visible")
                
                if len(src) < 1000:
                    result["issues"].append("Base64 data seems too short")
                
                if not src.startswith("data:image/png;base64,"):
                    result["issues"].append("Invalid data URI format")
                
                if computed_styles.get("opacity") == "0":
                    result["issues"].append("Opacity is 0")
                
                if computed_styles.get("display") == "none":
                    result["issues"].append("Display is none")
                
                if computed_styles.get("visibility") == "hidden":
                    result["issues"].append("Visibility is hidden")
                
                results.append(result)
                
                # Print diagnosis
                print(f"   📊 Natural size: {natural_width}x{natural_height}")
                print(f"   👁️  Visible: {is_visible}")
                print(f"   📏 Computed size: {computed_styles.get('width')} x {computed_styles.get('height')}")
                print(f"   🎨 Background: {computed_styles.get('backgroundColor')}")
                print(f"   🔍 Issues: {len(result['issues'])}")
                
                for issue in result["issues"]:
                    print(f"      ❌ {issue}")
            
            # Take full page screenshot
            screenshot_path = os.path.join(OUT, "playwright_screenshot.png")
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"\n📸 Screenshot saved: {screenshot_path}")
            
            # Save detailed results
            results_path = os.path.join(OUT, "playwright_results.json")
            with open(results_path, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"📄 Results saved: {results_path}")
            
        except Exception as e:
            print(f"❌ Error during validation: {e}")
            return False
        
        finally:
            browser.close()
    
    # Summary
    total_issues = sum(len(r["issues"]) for r in results)
    successful_qrs = sum(1 for r in results if len(r["issues"]) == 0)
    
    print(f"\n📊 Validation Summary")
    print("=" * 50)
    print(f"Total QR codes: {len(results)}")
    print(f"Successful: {successful_qrs}")
    print(f"Total issues: {total_issues}")
    
    if total_issues == 0:
        print("🎉 All QR codes rendered successfully!")
        return True
    else:
        print("⚠️  Some QR codes have rendering issues")
        return False

def main():
    """Main function."""
    if len(sys.argv) > 1:
        html_path = sys.argv[1]
    else:
        html_path = None
    
    success = validate_qr_rendering(html_path)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
