# QR Code Design Standards

This document establishes the **canonical QR code design standards** for the CCRI Cyberknights project to ensure consistency across all guides and future implementations.

## 🎯 Design Standards

### **SVG Format (Required)**
- **Format**: SVG (Scalable Vector Graphics) - NOT PNG or other raster formats
- **Display Size**: `width="120" height="120"` pixels
- **ViewBox**: `viewBox="0 0 23.2 23.2"` (scaled down by factor of 10)
- **Background**: `style="background-color: #10b981;"` (emerald green)
- **Border**: `class="border border-emerald-500 rounded"`

### **Color Standards**
- **QR Pattern**: `fill="#000000"` (black hex format, NOT "black")
- **Background**: `#10b981` (emerald green)
- **Border**: `border-emerald-500` (Tailwind CSS class)

### **SVG Structure**
```html
<svg width="120" height="120" viewBox="0 0 23.2 23.2" xmlns="http://www.w3.org/2000/svg" class="border border-emerald-500 rounded" style="background-color: #10b981;">
  <path d="[QR_CODE_PATH_DATA]" fill="#000000" fill-opacity="1" fill-rule="nonzero" stroke="none"/>
  <title>QR Code</title>
</svg>
```

## 🔧 Technical Specifications

### **QR Code Parameters**
- **Error Correction Level**: L (Low) - for smaller, more compact codes
- **Box Size**: 8 pixels per module
- **Border**: 2 modules
- **Modules**: 25x25 (version 1 QR code)

### **ViewBox Calculation**
```
total_size = modules * box_size + border * 2 * box_size
total_size = 25 * 8 + 2 * 2 * 8 = 200 + 32 = 232
scaled_size = total_size / 10 = 23.2
viewBox = "0 0 23.2 23.2"
```

## 📋 Implementation Checklist

### **For New QR Codes**
- [ ] Use `generate_qr_codes.py` script
- [ ] Verify `viewBox="0 0 23.2 23.2"`
- [ ] Verify `fill="#000000"` (not "black")
- [ ] Verify `width="120" height="120"`
- [ ] Verify `style="background-color: #10b981;"`
- [ ] Verify `class="border border-emerald-500 rounded"`
- [ ] Test QR code scans correctly
- [ ] Test visual appearance matches existing cheatsheets

### **For Existing QR Codes**
- [ ] Check current format (PNG vs SVG)
- [ ] If PNG: Convert to SVG using `update-cheatsheet-qr-to-svg.py`
- [ ] Verify all parameters match standards
- [ ] Test functionality and appearance

## 🚫 Anti-Patterns to Avoid

### **❌ Wrong ViewBox**
```html
<!-- WRONG -->
<svg viewBox="0 0 232 232">

<!-- CORRECT -->
<svg viewBox="0 0 23.2 23.2">
```

### **❌ Wrong Fill Color**
```html
<!-- WRONG -->
<path fill="black">

<!-- CORRECT -->
<path fill="#000000">
```

### **❌ Wrong Display Size**
```html
<!-- WRONG -->
<svg width="232" height="232">

<!-- CORRECT -->
<svg width="120" height="120">
```

### **❌ PNG Format**
```html
<!-- WRONG -->
<img src="data:image/png;base64,...">

<!-- CORRECT -->
<svg>...</svg>
```

## 🛠️ Scripts and Tools

### **Primary Scripts**
1. **`generate_qr_codes.py`** - Generate new SVG QR codes
2. **`update-cheatsheet-qr-to-svg.py`** - Convert existing PNG to SVG
3. **`youtube_url_shortener.py`** - Shorten YouTube URLs for QR codes

### **Usage Workflow**
```bash
# 1. Shorten YouTube URLs
python youtube_url_shortener.py "https://www.youtube.com/watch?v=VIDEO_ID"

# 2. Generate SVG QR codes
python generate_qr_codes.py --cheatsheet 1

# 3. Update existing cheatsheets (if needed)
python update-cheatsheet-qr-to-svg.py
```

## 📚 Reference Implementation

### **Cheatsheet 4 (Canonical)**
Cheatsheet 4 serves as the **reference implementation** for all QR code standards. All other cheatsheets must match this format exactly.

**File**: `guides/linux-cheatsheet-4.html`
**QR Codes**: 2 SVG elements with proper viewBox and styling

### **Verification**
Use Playwright tests to verify QR codes render correctly:
```bash
npx playwright test tests/qr-code-comparison.spec.ts
```

## 🔄 Maintenance

### **Regular Checks**
- [ ] Monthly: Verify all QR codes scan correctly
- [ ] Quarterly: Check for new YouTube URL formats
- [ ] Annually: Review and update design standards

### **When Adding New Cheatsheets**
1. Add cheatsheet data to `generate_qr_codes.py`
2. Generate QR codes using the script
3. Verify they match cheatsheet 4 format
4. Test functionality and appearance
5. Update documentation

### **When Updating Existing QR Codes**
1. Use `update-cheatsheet-qr-to-svg.py` script
2. Verify all parameters match standards
3. Test functionality and appearance
4. Commit changes with proper documentation

## 📖 Documentation Updates

When making changes to QR code standards:
1. Update this document
2. Update `scripts/README.md`
3. Update relevant guide documentation
4. Create/update Playwright tests
5. Document changes in commit messages

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintainer**: CCRI Cyberknights Development Team
