#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QR Code Standards Validator

This script validates that all QR codes in the project follow the established
design standards. It checks HTML files for QR code implementations and ensures
they match the canonical format used in cheatsheet 4.

Usage:
    python validate_qr_standards.py
    python validate_qr_standards.py --file guides/linux-cheatsheet-1.html
    python validate_qr_standards.py --fix  # Auto-fix common issues
"""

import argparse
import re
import os
import sys
from pathlib import Path

class QRStandardsValidator:
    def __init__(self):
        self.standards = {
            'format': 'svg',
            'width': '120',
            'height': '120', 
            'viewbox': '0 0 23.2 23.2',
            'fill_color': '#000000',
            'background_color': '#10b981',
            'border_class': 'border border-emerald-500 rounded',
            'xmlns': 'http://www.w3.org/2000/svg'
        }
        self.errors = []
        self.warnings = []
        
    def validate_file(self, filepath):
        """Validate QR codes in a single file."""
        print(f"[VALIDATE] Checking {filepath}...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"[ERROR] File not found: {filepath}")
            return False
            
        # Find all SVG elements
        svg_pattern = r'<svg[^>]*>.*?</svg>'
        svg_matches = re.findall(svg_pattern, content, re.DOTALL)
        
        if not svg_matches:
            print(f"[WARNING] No SVG elements found in {filepath}")
            return True
            
        print(f"   Found {len(svg_matches)} SVG element(s)")
        
        valid_count = 0
        for i, svg in enumerate(svg_matches):
            if self.validate_svg_element(svg, i+1):
                valid_count += 1
                
        print(f"   [SUCCESS] {valid_count}/{len(svg_matches)} SVG elements are valid")
        return valid_count == len(svg_matches)
        
    def validate_svg_element(self, svg_content, element_num):
        """Validate a single SVG element against standards."""
        is_valid = True
        
        # Check format (should be SVG, not IMG)
        if '<img' in svg_content:
            self.errors.append(f"Element {element_num}: Uses IMG tag instead of SVG")
            is_valid = False
            
        # Check width
        width_match = re.search(r'width="([^"]*)"', svg_content)
        if not width_match or width_match.group(1) != self.standards['width']:
            self.errors.append(f"Element {element_num}: Width should be '{self.standards['width']}', found '{width_match.group(1) if width_match else 'none'}'")
            is_valid = False
            
        # Check height
        height_match = re.search(r'height="([^"]*)"', svg_content)
        if not height_match or height_match.group(1) != self.standards['height']:
            self.errors.append(f"Element {element_num}: Height should be '{self.standards['height']}', found '{height_match.group(1) if height_match else 'none'}'")
            is_valid = False
            
        # Check viewBox
        viewbox_match = re.search(r'viewBox="([^"]*)"', svg_content)
        if not viewbox_match or viewbox_match.group(1) != self.standards['viewbox']:
            self.errors.append(f"Element {element_num}: ViewBox should be '{self.standards['viewbox']}', found '{viewbox_match.group(1) if viewbox_match else 'none'}'")
            is_valid = False
            
        # Check fill color
        fill_match = re.search(r'fill="([^"]*)"', svg_content)
        if not fill_match or fill_match.group(1) != self.standards['fill_color']:
            self.errors.append(f"Element {element_num}: Fill should be '{self.standards['fill_color']}', found '{fill_match.group(1) if fill_match else 'none'}'")
            is_valid = False
            
        # Check background color
        bg_match = re.search(r'background-color:\s*([^;"]*)', svg_content)
        if not bg_match or bg_match.group(1).strip() != self.standards['background_color']:
            self.warnings.append(f"Element {element_num}: Background should be '{self.standards['background_color']}', found '{bg_match.group(1).strip() if bg_match else 'none'}'")
            
        # Check border class
        if self.standards['border_class'] not in svg_content:
            self.warnings.append(f"Element {element_num}: Missing border class '{self.standards['border_class']}'")
            
        # Check xmlns
        if self.standards['xmlns'] not in svg_content:
            self.warnings.append(f"Element {element_num}: Missing xmlns attribute")
            
        return is_valid
        
    def validate_all_files(self):
        """Validate QR codes in all guide files."""
        guides_dir = Path('guides')
        if not guides_dir.exists():
            print("❌ Guides directory not found")
            return False
            
        guide_files = list(guides_dir.glob('*.html'))
        if not guide_files:
            print("❌ No HTML files found in guides directory")
            return False
            
        print(f"🔍 Found {len(guide_files)} guide files")
        
        all_valid = True
        for filepath in guide_files:
            if not self.validate_file(filepath):
                all_valid = False
                
        return all_valid
        
    def print_results(self):
        """Print validation results."""
        if self.errors:
            print("\n[ERRORS]:")
            for error in self.errors:
                print(f"   - {error}")
                
        if self.warnings:
            print("\n[WARNINGS]:")
            for warning in self.warnings:
                print(f"   - {warning}")
                
        if not self.errors and not self.warnings:
            print("\n[SUCCESS] All QR codes meet the design standards!")
            
    def fix_common_issues(self, filepath):
        """Auto-fix common QR code issues."""
        print(f"[FIX] Auto-fixing issues in {filepath}...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"[ERROR] File not found: {filepath}")
            return False
            
        # Fix common issues
        fixes_applied = []
        
        # Fix viewBox
        if 'viewBox="0 0 232 232"' in content:
            content = content.replace('viewBox="0 0 232 232"', 'viewBox="0 0 23.2 23.2"')
            fixes_applied.append("Fixed viewBox scaling")
            
        # Fix fill color
        if 'fill="black"' in content:
            content = content.replace('fill="black"', 'fill="#000000"')
            fixes_applied.append("Fixed fill color format")
            
        # Fix display size
        if 'width="232" height="232"' in content:
            content = content.replace('width="232" height="232"', 'width="120" height="120"')
            fixes_applied.append("Fixed display size")
            
        if fixes_applied:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"   [SUCCESS] Applied fixes: {', '.join(fixes_applied)}")
            return True
        else:
            print("   [INFO] No common issues found to fix")
            return True

def main():
    parser = argparse.ArgumentParser(description='Validate QR code design standards')
    parser.add_argument('--file', help='Specific file to validate')
    parser.add_argument('--fix', action='store_true', help='Auto-fix common issues')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    
    args = parser.parse_args()
    
    validator = QRStandardsValidator()
    
    print("QR Code Standards Validator")
    print("=" * 40)
    
    if args.file:
        if args.fix:
            success = validator.fix_common_issues(args.file)
        else:
            success = validator.validate_file(args.file)
    else:
        success = validator.validate_all_files()
        
    validator.print_results()
    
    if success and not validator.errors:
        print("\n[SUCCESS] All QR codes are compliant with design standards!")
        sys.exit(0)
    else:
        print(f"\n[ERROR] Found {len(validator.errors)} errors and {len(validator.warnings)} warnings")
        if not args.fix:
            print("[TIP] Run with --fix to auto-fix common issues")
        sys.exit(1)

if __name__ == '__main__':
    main()
