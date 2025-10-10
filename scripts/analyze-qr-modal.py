#!/usr/bin/env python3
"""
QR Modal Screenshot Analyzer
Analyzes QR modal screenshots to detect layout issues and positioning.
"""

import sys
import os
from pathlib import Path

try:
    from PIL import Image, ImageStat
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("⚠️  PIL not available, falling back to basic analysis")

try:
    import cv2
    import numpy as np
    OPENCV_AVAILABLE = True
except ImportError:
    OPENCV_AVAILABLE = False
    print("⚠️  OpenCV not available, using basic PIL analysis")

def analyze_qr_modal_basic(image_path):
    """Basic analysis using PIL only."""
    if not PIL_AVAILABLE:
        print("❌ PIL not available for basic analysis")
        return False
        
    print(f"🔍 Analyzing (basic): {image_path}")
    
    try:
        img = Image.open(image_path)
        width, height = img.size
        print(f"📐 Image dimensions: {width}x{height}")
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Get image statistics
        stat = ImageStat.Stat(img)
        mean_r, mean_g, mean_b = stat.mean
        
        print(f"🎨 Average colors: R={mean_r:.1f}, G={mean_g:.1f}, B={mean_b:.1f}")
        
        # Check if image is mostly dark (expected for dark theme)
        if mean_r < 100 and mean_g < 100 and mean_b < 100:
            print("✅ Dark theme detected")
        else:
            print("⚠️  Light theme or unexpected colors")
        
        # Basic file size analysis
        file_size = os.path.getsize(image_path)
        print(f"📦 File size: {file_size:,} bytes")
        
        # Analyze bottom area for URL box positioning
        print("🔍 Analyzing bottom area for URL box...")
        
        # Get bottom 50 pixels
        bottom_region = img.crop((0, height-50, width, height))
        bottom_stat = ImageStat.Stat(bottom_region)
        bottom_r, bottom_g, bottom_b = bottom_stat.mean
        
        print(f"📊 Bottom 50px colors: R={bottom_r:.1f}, G={bottom_g:.1f}, B={bottom_b:.1f}")
        
        # Check if bottom is dark (no URL box) or lighter (URL box present)
        # Lower threshold since URL box might be dark gray
        if bottom_r > 30 or bottom_g > 30 or bottom_b > 30:
            print("✅ URL box detected at bottom!")
            url_at_bottom = True
        else:
            print("❌ No URL box detected at bottom")
            url_at_bottom = False
        
        # Analyze middle area for QR code
        print("🔍 Analyzing middle area for QR code...")
        middle_start = height // 3
        middle_end = height * 2 // 3
        middle_region = img.crop((0, middle_start, width, middle_end))
        middle_stat = ImageStat.Stat(middle_region)
        middle_r, middle_g, middle_b = middle_stat.mean
        
        print(f"📊 Middle area colors: R={middle_r:.1f}, G={middle_g:.1f}, B={middle_b:.1f}")
        
        # Check if middle has contrast (QR code present)
        contrast = max(middle_r, middle_g, middle_b) - min(middle_r, middle_g, middle_b)
        print(f"📊 Middle area contrast: {contrast:.1f}")
        if contrast > 10:  # Very low threshold for contrast detection
            print("✅ QR code detected in middle area")
            qr_detected = True
        else:
            print("❌ No QR code contrast detected in middle")
            qr_detected = False
        
        # Overall assessment
        print(f"\n📊 ANALYSIS SUMMARY:")
        print(f"   Dark theme: ✅ YES")
        print(f"   QR code detected: {'✅ YES' if qr_detected else '❌ NO'}")
        print(f"   URL box at bottom: {'✅ YES' if url_at_bottom else '❌ NO'}")
        
        if qr_detected and url_at_bottom:
            print("🎉 LAYOUT LOOKS CORRECT!")
            return True
        else:
            print("⚠️  LAYOUT MAY NEED FIXING")
            return False
            
    except Exception as e:
        print(f"❌ Error analyzing image: {e}")
        return False

def analyze_qr_modal(image_path):
    """Analyze QR modal screenshot for layout issues."""
    if not os.path.exists(image_path):
        print(f"❌ Error: File {image_path} not found")
        return False
    
    # Use basic analysis if OpenCV not available
    if not OPENCV_AVAILABLE:
        return analyze_qr_modal_basic(image_path)
    
    print(f"🔍 Analyzing (advanced): {image_path}")
    
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        print(f"❌ Error: Could not load image {image_path}")
        return False
        
    height, width = img.shape[:2]
    print(f"📐 Image dimensions: {width}x{height}")
    
    # Convert to HSV for better color detection
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Detect green borders (QR modal border) - adjust range for your green
    green_lower = np.array([35, 50, 50])  # Lower bound for green
    green_upper = np.array([85, 255, 255])  # Upper bound for green
    green_mask = cv2.inRange(hsv, green_lower, green_upper)
    green_contours, _ = cv2.findContours(green_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Detect dark gray areas (URL input box) - adjust range for your gray
    gray_lower = np.array([0, 0, 30])   # Lower bound for dark gray
    gray_upper = np.array([180, 50, 120])  # Upper bound for dark gray
    gray_mask = cv2.inRange(hsv, gray_lower, gray_upper)
    gray_contours, _ = cv2.findContours(gray_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Detect black/white areas (QR code)
    # Black detection
    black_lower = np.array([0, 0, 0])
    black_upper = np.array([180, 255, 50])
    black_mask = cv2.inRange(hsv, black_lower, black_upper)
    black_contours, _ = cv2.findContours(black_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"🟢 Green elements (modal borders): {len(green_contours)}")
    print(f"⚫ Gray elements (URL boxes): {len(gray_contours)}")
    print(f"⬛ Black elements (QR code): {len(black_contours)}")
    
    # Analyze URL box positioning
    url_box_at_bottom = False
    url_box_overlap = False
    
    if gray_contours:
        # Find the largest gray contour (likely the URL input box)
        largest_gray = max(gray_contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(largest_gray)
        
        print(f"📦 URL box position: x={x}, y={y}, width={w}, height={h}")
        
        # Check distance from bottom
        bottom_distance = height - (y + h)
        print(f"📏 Distance from bottom: {bottom_distance}px")
        
        # Check if URL box is at bottom (within 20px)
        if bottom_distance <= 20:
            print("✅ URL box is touching/near bottom!")
            url_box_at_bottom = True
        else:
            print("❌ URL box has significant gap from bottom")
        
        # Check for overlap with QR code (if we found black contours)
        if black_contours:
            largest_black = max(black_contours, key=cv2.contourArea)
            qr_x, qr_y, qr_w, qr_h = cv2.boundingRect(largest_black)
            
            print(f"🔲 QR code position: x={qr_x}, y={qr_y}, width={qr_w}, height={qr_h}")
            
            # Check for overlap
            if (y < qr_y + qr_h and y + h > qr_y):
                print("❌ URL box overlaps with QR code!")
                url_box_overlap = True
            else:
                print("✅ No overlap between URL box and QR code")
    
    # Summary
    print("\n📊 ANALYSIS SUMMARY:")
    print(f"   URL box at bottom: {'✅ YES' if url_box_at_bottom else '❌ NO'}")
    print(f"   No overlap: {'✅ YES' if not url_box_overlap else '❌ NO'}")
    
    # Overall assessment
    if url_box_at_bottom and not url_box_overlap:
        print("🎉 LAYOUT IS CORRECT!")
        return True
    else:
        print("⚠️  LAYOUT NEEDS FIXING")
        return False

def compare_screenshots(img1_path, img2_path):
    """Compare two screenshots to detect differences."""
    print(f"\n🔄 Comparing {img1_path} vs {img2_path}")
    
    img1 = cv2.imread(img1_path)
    img2 = cv2.imread(img2_path)
    
    if img1 is None or img2 is None:
        print("❌ Could not load one or both images")
        return
    
    # Resize if different sizes
    if img1.shape != img2.shape:
        print("⚠️  Images have different sizes, resizing...")
        img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
    
    # Calculate difference
    diff = cv2.absdiff(img1, img2)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    
    # Count different pixels
    different_pixels = np.sum(diff_gray > 30)  # Threshold for "different"
    total_pixels = diff_gray.shape[0] * diff_gray.shape[1]
    difference_percentage = (different_pixels / total_pixels) * 100
    
    print(f"📊 Difference: {different_pixels}/{total_pixels} pixels ({difference_percentage:.2f}%)")
    
    if difference_percentage < 1:
        print("🔍 Images are nearly identical")
    elif difference_percentage < 5:
        print("🔍 Minor differences detected")
    else:
        print("🔍 Significant differences detected")

def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 analyze-qr-modal.py <screenshot.png>")
        print("  python3 analyze-qr-modal.py <screenshot1.png> <screenshot2.png>  # Compare two images")
        print("  python3 analyze-qr-modal.py test-results/  # Analyze all PNG files in directory")
        return
    
    input_path = sys.argv[1]
    
    if os.path.isdir(input_path):
        # Analyze all PNG files in directory
        png_files = list(Path(input_path).glob("*.png"))
        if not png_files:
            print(f"❌ No PNG files found in {input_path}")
            return
        
        print(f"🔍 Found {len(png_files)} PNG files to analyze")
        results = []
        
        for png_file in sorted(png_files):
            print(f"\n{'='*60}")
            result = analyze_qr_modal(str(png_file))
            results.append((png_file.name, result))
        
        print(f"\n{'='*60}")
        print("📋 FINAL SUMMARY:")
        for filename, is_correct in results:
            status = "✅ CORRECT" if is_correct else "❌ NEEDS FIX"
            print(f"   {filename}: {status}")
    
    elif len(sys.argv) == 3:
        # Compare two images
        compare_screenshots(sys.argv[1], sys.argv[2])
    else:
        # Analyze single image
        analyze_qr_modal(input_path)

if __name__ == "__main__":
    main()
