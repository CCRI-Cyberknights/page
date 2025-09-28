# Modal Code Review Checklist

## Pre-Submission Checklist

Before submitting any PR that includes modal functionality, ensure all items below are checked:

### **✅ Universal Modal Compliance**

- [ ] **Uses Universal Modal System**: All modals use `UniversalModal` class or convenience functions (`openModal`, `openResourceModal`, `openImageModal`)
- [ ] **No Custom Modal HTML**: No inline modal HTML structures (use `#universal-modal` container)
- [ ] **No Duplicate Event Handlers**: No custom escape key or overlay click handlers
- [ ] **Proper Size Selection**: Uses appropriate size variant (`small`, `medium`, `large`, `fullscreen`)

### **✅ HTML Structure**

- [ ] **Single Container**: Uses `#universal-modal` container only
- [ ] **ARIA Attributes**: Includes `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-hidden`
- [ ] **Semantic HTML**: Uses proper heading hierarchy (`h2` for modal title)
- [ ] **Close Button**: Includes close button with `aria-label="Close dialog"`
- [ ] **Backdrop**: Includes clickable backdrop with `data-modal-close` attribute

### **✅ JavaScript Implementation**

- [ ] **Event Cleanup**: Properly removes event listeners when modal closes
- [ ] **Focus Management**: Implements focus trapping and restoration
- [ ] **Scroll Locking**: Locks body scroll when modal is open
- [ ] **Mobile Support**: Includes mobile back button support for full-screen modals
- [ ] **Error Handling**: Graceful fallback if modal fails to open/close

### **✅ Accessibility**

- [ ] **Keyboard Navigation**: Tab cycling works within modal
- [ ] **Screen Reader Support**: Modal announces properly to screen readers
- [ ] **Focus Trap**: Focus stays within modal when open
- [ ] **Focus Restoration**: Returns focus to trigger element when closed
- [ ] **ARIA Labels**: All interactive elements properly labeled

### **✅ Mobile Experience**

- [ ] **Touch Targets**: Minimum 44px touch targets for all interactive elements
- [ ] **Viewport Fit**: Modal fits within mobile viewport
- [ ] **Back Button**: Mobile back button closes modal (for full-screen modals)
- [ ] **Swipe Gestures**: Considered for full-screen modals
- [ ] **Performance**: Optimized for mobile devices

### **✅ Styling & Design**

- [ ] **Tailwind Classes**: Uses standardized Tailwind classes
- [ ] **Color Palette**: Follows official CyberKnights color scheme
- [ ] **Animations**: Smooth transitions (300ms duration)
- [ ] **Responsive**: Works across all screen sizes
- [ ] **Consistent**: Matches existing modal styling

### **✅ Testing**

- [ ] **Keyboard Testing**: Tested with keyboard navigation
- [ ] **Screen Reader Testing**: Tested with screen reader
- [ ] **Mobile Testing**: Tested on mobile devices
- [ ] **Cross-Browser**: Tested in major browsers
- [ ] **Edge Cases**: Tested with long content, small screens, etc.

---

## **Code Review Questions**

### **For Reviewers**

1. **Does this modal follow the Universal Modal pattern?**
   - Uses `UniversalModal` class or convenience functions
   - No custom modal HTML structures
   - No duplicate event handling

2. **Is accessibility properly implemented?**
   - ARIA attributes present and correct
   - Focus management working
   - Screen reader compatibility

3. **Does mobile experience work well?**
   - Touch targets appropriate size
   - Back button support (if needed)
   - Viewport compatibility

4. **Is the code maintainable?**
   - Follows established patterns
   - Proper cleanup and error handling
   - Clear and documented

---

## **Common Violations**

### **❌ Anti-Patterns to Avoid**

```javascript
// DON'T: Create custom modal HTML
const modal = document.createElement('div');
modal.className = 'fixed inset-0 bg-black/50...';

// DON'T: Custom event handlers
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { /* custom logic */ }
});

// DON'T: Inline modal structures
<div class="modal-overlay">
  <div class="modal-content">
    <!-- custom modal content -->
  </div>
</div>
```

### **✅ Correct Patterns**

```javascript
// DO: Use Universal Modal
openModal(content, title, actions, { size: 'medium' });

// DO: Use convenience functions
openResourceModal(resource);
openImageModal(src, alt, isCanvas);

// DO: Use Universal Modal HTML structure
<div id="universal-modal" role="dialog" aria-modal="true">
  <!-- standard structure -->
</div>
```

---

## **Enforcement Rules**

### **Automatic Checks**

1. **Linting Rules**: Add ESLint rules to prevent custom modal implementations
2. **HTML Validation**: Ensure only `#universal-modal` container exists
3. **JavaScript Analysis**: Detect custom modal event handlers

### **Manual Review Requirements**

1. **Accessibility Review**: All modals must be tested with screen reader
2. **Mobile Review**: All modals must be tested on mobile devices
3. **Keyboard Review**: All modals must be tested with keyboard navigation

### **Documentation Requirements**

1. **Modal Guidelines**: All developers must read Modal Guidelines document
2. **Code Examples**: Provide clear examples for common modal patterns
3. **Migration Guide**: Document how to migrate from old modal systems

---

## **Review Process**

### **Step 1: Automated Checks**
- [ ] Linting passes
- [ ] HTML validation passes
- [ ] JavaScript analysis passes
- [ ] Build succeeds

### **Step 2: Manual Review**
- [ ] Code follows Universal Modal pattern
- [ ] Accessibility requirements met
- [ ] Mobile experience verified
- [ ] Documentation updated

### **Step 3: Testing**
- [ ] Manual testing completed
- [ ] Accessibility testing completed
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed

### **Step 4: Approval**
- [ ] All checklist items verified
- [ ] No anti-patterns detected
- [ ] Performance acceptable
- [ ] Ready for merge

---

## **Training Requirements**

### **For New Developers**

1. **Read Modal Guidelines**: Complete reading of Modal Guidelines document
2. **Review Examples**: Study existing modal implementations
3. **Practice Implementation**: Create test modals using Universal Modal
4. **Accessibility Training**: Learn ARIA attributes and focus management

### **For Existing Developers**

1. **Migration Training**: Learn how to migrate existing modals
2. **Best Practices**: Review common patterns and anti-patterns
3. **Testing Procedures**: Learn proper modal testing techniques
4. **Code Review Process**: Understand review checklist and requirements

---

## **Quality Metrics**

### **Success Criteria**

- **100% Universal Modal Usage**: All modals use Universal Modal system
- **Zero Accessibility Violations**: All modals pass accessibility tests
- **Consistent User Experience**: All modals behave identically
- **Maintainable Code**: Modal code is easy to understand and modify

### **Monitoring**

- **Code Review Metrics**: Track checklist completion rates
- **Accessibility Scores**: Monitor accessibility compliance
- **User Feedback**: Collect feedback on modal usability
- **Performance Metrics**: Track modal performance impact

---

*Last Updated: 2025-09-27*
*Version: 1.0.0*
*Related: [Modal Guidelines](MODAL-GUIDELINES.md) | [Modal Inventory](MODAL-INVENTORY.md)*
