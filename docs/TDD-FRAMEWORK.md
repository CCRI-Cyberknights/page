# Test-Driven Development (TDD) Documentation Framework

## Overview

This document establishes the TDD patterns, documentation standards, and best practices used in this project's Playwright-based testing suite. It serves as a comprehensive guide for maintaining consistency, readability, and effectiveness across all test files.

## TDD Principles Applied

### 1. **Red-Green-Refactor Cycle**
- **Red**: Write failing tests first to define expected behavior
- **Green**: Implement minimal code to make tests pass
- **Refactor**: Improve code while keeping tests green

### 2. **Test-First Development**
- Tests are written before implementation
- Tests serve as living documentation of requirements
- Tests drive the design of the application

### 3. **Behavior-Driven Testing**
- Tests describe user behavior, not implementation details
- Focus on what the user sees and does
- Use descriptive test names that read like specifications

## Test File Organization

### Naming Conventions

#### **Test Files (.spec.ts)**
```
{feature}-{type}-{scope}.spec.ts
```

**Examples:**
- `qr-modal-proportions.spec.ts` - QR modal visual proportions testing
- `mobile-layout-integrity.spec.ts` - Mobile layout integrity testing
- `qr-code-url-validation.spec.ts` - QR code URL validation testing

#### **Test Categories**
1. **Unit Tests**: `*-unit.spec.ts` - Test individual components in isolation
2. **Integration Tests**: `*-integration.spec.ts` - Test component interactions
3. **Visual Regression**: `*-visual.spec.ts` - Test visual consistency
4. **Mobile Testing**: `mobile-*.spec.ts` - Mobile-specific testing
5. **URL Validation**: `*-url-validation.spec.ts` - URL accuracy testing
6. **Layout Testing**: `*-layout-*.spec.ts` - Layout integrity testing

### Test Structure Pattern

```typescript
import { test, expect } from '@playwright/test';
import { helperModule } from './helpers/helperModule';

/**
 * {Feature} {Type} Tests
 * 
 * PREREQUISITE: {Any setup requirements}
 * 
 * These tests verify {specific behavior/functionality}
 * and ensure {expected outcomes}.
 */
test.describe('{Feature} {Type}', () => {
  // Setup and teardown
  test.beforeEach(async ({ page }) => {
    // Common setup
  });

  test.afterEach(async ({ page }) => {
    // Common cleanup
  });

  // Test cases
  test('{specific behavior} should {expected outcome}', async ({ page }) => {
    await test.step('{Step description}', async () => {
      // Test implementation
    });
    
    await test.step('{Verification step}', async () => {
      // Assertions
    });
  });
});
```

## Documentation Standards

### 1. **File Headers**
Every test file must include:
- **Purpose**: What the test file validates
- **Prerequisites**: Required setup (dev server, etc.)
- **Scope**: What features/behaviors are covered
- **Dependencies**: Required helper modules or configurations

### 2. **Test Descriptions**
- Use descriptive names that read like specifications
- Include the expected outcome in the test name
- Group related tests using `test.describe()`

### 3. **Test Steps**
Use `test.step()` to document the test flow:
```typescript
await test.step('Navigate to the target page', async () => {
  await page.goto('http://localhost:8000/#/target');
});

await test.step('Verify element is visible', async () => {
  await expect(page.locator('#target-element')).toBeVisible();
});
```

### 4. **Comments and Documentation**
- Explain complex test logic
- Document why specific assertions are important
- Include troubleshooting hints for common issues

## Test Categories and Patterns

### 1. **Unit Tests**
**Purpose**: Test individual components in isolation
**Pattern**: Mock dependencies, test specific methods/functions
**Example**: `qr-code-manager-unit.spec.ts`

### 2. **Integration Tests**
**Purpose**: Test component interactions and workflows
**Pattern**: Test complete user journeys
**Example**: `playwright-link-testing-comprehensive.spec.ts`

### 3. **Visual Regression Tests**
**Purpose**: Ensure visual consistency across changes
**Pattern**: Screenshot comparison, layout verification
**Example**: `mobile-layout-integrity.spec.ts`

### 4. **Mobile Testing**
**Purpose**: Ensure mobile responsiveness and functionality
**Pattern**: Multiple viewport testing, touch interaction simulation
**Example**: `mobile-cutoff-prevention.spec.ts`

### 5. **URL Validation Tests**
**Purpose**: Ensure URLs are accurate and functional
**Pattern**: URL generation and validation testing
**Example**: `qr-code-url-validation.spec.ts`

## Best Practices

### 1. **Test Isolation**
- Each test should be independent
- Use `beforeEach`/`afterEach` for setup/cleanup
- Avoid shared state between tests

### 2. **Stable Selectors**
- Use data-testid attributes when possible
- Prefer role-based selectors
- Avoid fragile CSS selectors

### 3. **Error Handling**
- Include meaningful error messages
- Use descriptive assertion messages
- Handle async operations properly

### 4. **Performance**
- Use `waitForLoadState()` appropriately
- Avoid unnecessary waits
- Use parallel execution when possible

### 5. **Maintainability**
- Keep tests simple and focused
- Use helper functions for common operations
- Regular refactoring to improve readability

## Helper Modules

### **Viewport Definitions** (`helpers/viewports.ts`)
- Centralized viewport configurations
- Device-specific settings
- Responsive testing utilities

### **Common Utilities**
- Page navigation helpers
- Element interaction helpers
- Assertion utilities

## CI/CD Integration

### **Test Execution**
- Smoke tests for PR validation
- Full test suite for releases
- Parallel execution for performance

### **Reporting**
- HTML reports for detailed analysis
- JSON output for CI integration
- Screenshot capture on failures

## Quality Gates

### **Test Coverage**
- Critical user journeys must be tested
- Mobile responsiveness must be validated
- Visual regression must be prevented

### **Performance Standards**
- Tests should complete within reasonable time
- No flaky tests in the main suite
- Clear failure messages for debugging

## Maintenance Guidelines

### **Regular Reviews**
- Review test effectiveness quarterly
- Update tests when features change
- Remove obsolete tests

### **Documentation Updates**
- Keep this framework current
- Update patterns as they evolve
- Share knowledge with team

---

*This framework is living documentation that evolves with the project. Regular updates ensure it remains relevant and effective.*
