#!/usr/bin/env python3
"""
Mobile Keyboard Visibility Analysis Tool

Uses OpenCV to analyze QR modal screenshots and detect if both QR code and keyboard
input remain visible when mobile keyboard appears across different devices.

Usage:
    python3 scripts/analyze-keyboard-visibility.py <before_screenshot> <after_screenshot>
"""

import cv2
import numpy as np
import sys
import os
from pathlib import Path

def analyze_image_for_qr_modal(image_path):
    """
    Analyze a screenshot to detect QR modal elements and their visibility.
    
    Returns:
        dict: Analysis results including QR code position, input field position,
              and overall modal visibility
    """
    if not os.path.exists(image_path):
        print(f"❌ Image not found: {image_path}")
        return None
    
    # Load image
    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ Could not load image: {image_path}")
        return None
    
    height, width = image.shape[:2]
    print(f"📱 Analyzing image: {width}x{height}")
    
    # Convert to different color spaces for better detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    results = {
        'image_dimensions': (width, height),
        'qr_detected': False,
        'input_detected': False,
        'modal_visible': False,
        'elements': {}
    }
    
    # Detect QR code using template matching and feature detection
    qr_analysis = detect_qr_code(gray, image)
    if qr_analysis:
        results['qr_detected'] = True
        results['elements']['qr_code'] = qr_analysis
    
    # Detect input field (usually darker rectangular areas)
    input_analysis = detect_input_field(gray, image)
    if input_analysis:
        results['input_detected'] = True
        results['elements']['input_field'] = input_analysis
    
    # Detect modal container (look for the overall modal structure)
    modal_analysis = detect_modal_container(gray, image)
    if modal_analysis:
        results['modal_visible'] = True
        results['elements']['modal'] = modal_analysis
    
    return results

def detect_qr_code(gray, color_image):
    """
    Detect QR code in the image using multiple techniques.
    
    Returns:
        dict: QR code position and dimensions, or None if not found
    """
    height, width = gray.shape
    
    # Method 1: Look for high-contrast square patterns (QR codes have distinctive patterns)
    # Apply edge detection
    edges = cv2.Canny(gray, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Look for square-like contours that could be QR codes
    for contour in contours:
        # Approximate the contour
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        # Check if it's roughly square and reasonably sized
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(contour)
            aspect_ratio = w / h
            
            # QR codes are roughly square and should be reasonably large
            if 0.8 <= aspect_ratio <= 1.2 and w > 100 and h > 100:
                # Additional check: QR codes have high contrast
                roi = gray[y:y+h, x:x+w]
                contrast = np.std(roi)
                
                if contrast > 50:  # High contrast threshold
                    return {
                        'position': (x, y),
                        'dimensions': (w, h),
                        'center': (x + w//2, y + h//2),
                        'confidence': 'high' if contrast > 80 else 'medium'
                    }
    
    # Method 2: Template matching for QR code patterns
    # Create a simple QR code template (this is a simplified approach)
    qr_template = create_qr_template()
    if qr_template is not None:
        result = cv2.matchTemplate(gray, qr_template, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        
        if max_val > 0.6:  # Threshold for template matching
            h, w = qr_template.shape
            return {
                'position': max_loc,
                'dimensions': (w, h),
                'center': (max_loc[0] + w//2, max_loc[1] + h//2),
                'confidence': 'template_match'
            }
    
    return None

def create_qr_template():
    """
    Create a simple QR code template for template matching.
    This is a simplified 7x7 QR code finder pattern.
    """
    template = np.zeros((49, 49), dtype=np.uint8)
    
    # QR code finder pattern (simplified)
    # Outer square
    cv2.rectangle(template, (0, 0), (48, 48), 255, 2)
    # Inner squares
    cv2.rectangle(template, (6, 6), (42, 42), 255, 2)
    cv2.rectangle(template, (12, 12), (36, 36), 255, 2)
    cv2.rectangle(template, (18, 18), (30, 30), 255, -1)
    
    return template

def detect_input_field(gray, color_image):
    """
    Detect input field (usually a darker rectangular area with text).
    
    Returns:
        dict: Input field position and dimensions, or None if not found
    """
    height, width = gray.shape
    
    # Look for rectangular areas that are darker than the background
    # Input fields typically have a darker background
    
    # Apply threshold to find darker areas
    _, thresh = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours of dark areas
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        
        # Input fields are typically wider than they are tall
        aspect_ratio = w / h
        
        # Should be reasonably sized and rectangular
        if 2.0 <= aspect_ratio <= 8.0 and w > 150 and h > 30:
            # Check if it's in the lower portion of the image (typical for input fields)
            if y > height * 0.6:  # Bottom 40% of image
                # Additional validation: check for text-like patterns
                roi = gray[y:y+h, x:x+w]
                if np.mean(roi) < 128:  # Darker than average
                    return {
                        'position': (x, y),
                        'dimensions': (w, h),
                        'center': (x + w//2, y + h//2),
                        'confidence': 'high'
                    }
    
    return None

def detect_modal_container(gray, color_image):
    """
    Detect the overall modal container structure.
    
    Returns:
        dict: Modal container position and dimensions, or None if not found
    """
    height, width = gray.shape
    
    # Look for large rectangular areas that could be the modal
    # Modals typically take up a significant portion of the screen
    
    # Use edge detection to find the modal boundaries
    edges = cv2.Canny(gray, 30, 100)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Sort contours by area (largest first)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        
        # Modal should be reasonably large (at least 30% of screen area)
        area_ratio = (w * h) / (width * height)
        
        if area_ratio > 0.3 and w > width * 0.5 and h > height * 0.5:
            # Check if it's roughly centered
            center_x = x + w // 2
            center_y = y + h // 2
            
            # Should be roughly centered horizontally and vertically
            if (width * 0.2 < center_x < width * 0.8 and 
                height * 0.2 < center_y < height * 0.8):
                
                return {
                    'position': (x, y),
                    'dimensions': (w, h),
                    'center': (center_x, center_y),
                    'area_ratio': area_ratio,
                    'confidence': 'high'
                }
    
    return None

def compare_keyboard_visibility(before_analysis, after_analysis):
    """
    Compare before and after analyses to determine keyboard impact.
    
    Returns:
        dict: Comparison results and recommendations
    """
    if not before_analysis or not after_analysis:
        return {
            'status': 'error',
            'message': 'Could not analyze one or both images'
        }
    
    results = {
        'status': 'success',
        'qr_visibility': 'unknown',
        'input_visibility': 'unknown',
        'modal_adaptation': 'unknown',
        'recommendations': []
    }
    
    # Check QR code visibility
    before_qr = before_analysis.get('elements', {}).get('qr_code')
    after_qr = after_analysis.get('elements', {}).get('qr_code')
    
    if before_qr and after_qr:
        # Check if QR code moved or changed size significantly
        before_center = before_qr['center']
        after_center = after_qr['center']
        
        movement = np.sqrt((after_center[0] - before_center[0])**2 + 
                          (after_center[1] - before_center[1])**2)
        
        if movement < 50:  # Less than 50 pixels movement
            results['qr_visibility'] = 'stable'
        else:
            results['qr_visibility'] = 'moved'
            results['recommendations'].append('QR code position changed significantly')
    
    elif before_qr and not after_qr:
        results['qr_visibility'] = 'hidden'
        results['recommendations'].append('QR code became hidden after keyboard appeared')
    elif not before_qr and after_qr:
        results['qr_visibility'] = 'appeared'
        results['recommendations'].append('QR code appeared after keyboard (unexpected)')
    else:
        results['qr_visibility'] = 'not_detected'
    
    # Check input field visibility
    before_input = before_analysis.get('elements', {}).get('input_field')
    after_input = after_analysis.get('elements', {}).get('input_field')
    
    if before_input and after_input:
        # Check if input field is still accessible
        after_bottom = after_input['position'][1] + after_input['dimensions'][1]
        viewport_height = after_analysis['image_dimensions'][1]
        
        # Estimate visible area (assuming keyboard takes up bottom portion)
        visible_area = viewport_height * 0.7  # 70% of screen visible above keyboard
        
        if after_bottom <= visible_area:
            results['input_visibility'] = 'accessible'
        else:
            results['input_visibility'] = 'blocked'
            results['recommendations'].append('Input field may be blocked by keyboard')
    
    # Check modal adaptation
    before_modal = before_analysis.get('elements', {}).get('modal')
    after_modal = after_analysis.get('elements', {}).get('modal')
    
    if before_modal and after_modal:
        before_height = before_modal['dimensions'][1]
        after_height = after_modal['dimensions'][1]
        
        height_change = (after_height - before_height) / before_height
        
        if abs(height_change) < 0.1:  # Less than 10% change
            results['modal_adaptation'] = 'static'
            results['recommendations'].append('Modal did not adapt to keyboard (may cause issues)')
        else:
            results['modal_adaptation'] = 'adaptive'
    
    return results

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 scripts/analyze-keyboard-visibility.py <before_screenshot> <after_screenshot>")
        sys.exit(1)
    
    before_path = sys.argv[1]
    after_path = sys.argv[2]
    
    print("🔍 Analyzing Mobile Keyboard Visibility...")
    print(f"📸 Before: {before_path}")
    print(f"📸 After: {after_path}")
    print()
    
    # Analyze both images
    print("Analyzing before screenshot...")
    before_analysis = analyze_image_for_qr_modal(before_path)
    
    print("Analyzing after screenshot...")
    after_analysis = analyze_image_for_qr_modal(after_path)
    
    if not before_analysis or not after_analysis:
        print("❌ Could not analyze one or both images")
        sys.exit(1)
    
    # Compare results
    print("\n🔍 Comparing keyboard impact...")
    comparison = compare_keyboard_visibility(before_analysis, after_analysis)
    
    # Print results
    print("\n📊 Analysis Results:")
    print(f"QR Code Visibility: {comparison['qr_visibility']}")
    print(f"Input Field Visibility: {comparison['input_visibility']}")
    print(f"Modal Adaptation: {comparison['modal_adaptation']}")
    
    if comparison['recommendations']:
        print("\n💡 Recommendations:")
        for rec in comparison['recommendations']:
            print(f"  • {rec}")
    else:
        print("\n✅ No issues detected - keyboard behavior looks good!")
    
    print(f"\n📱 Image dimensions: {before_analysis['image_dimensions'][0]}x{before_analysis['image_dimensions'][1]}")
    
    # Detailed element analysis
    if before_analysis.get('elements'):
        print("\n🔍 Before keyboard - Detected elements:")
        for element, info in before_analysis['elements'].items():
            print(f"  {element}: {info['position']} {info['dimensions']}")
    
    if after_analysis.get('elements'):
        print("\n🔍 After keyboard - Detected elements:")
        for element, info in after_analysis['elements'].items():
            print(f"  {element}: {info['position']} {info['dimensions']}")

if __name__ == "__main__":
    main()
