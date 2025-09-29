#!/usr/bin/env python3
"""
⚠️  DEPRECATED: This Selenium-based testing system is deprecated.
    The project has migrated to modern Playwright testing for better performance and reliability.
    
    Modern alternative: npm run test:links:modern
    
    This file will be removed in a future release.
    See docs/SELENIUM-DEPRECATION-PLAN.md for migration details.
"""

print("⚠️  WARNING: Selenium testing system is DEPRECATED")
print("   Modern alternative: npm run test:links:modern")
print("   See docs/SELENIUM-DEPRECATION-PLAN.md for details")
print("")

import subprocess
import sys
import os

def run_test(test_file):
    """Run a single test file and return the exit code"""
    print(f"\n{'='*60}")
    print(f"Running {test_file}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run([sys.executable, test_file], 
                              cwd=os.path.dirname(os.path.abspath(__file__)),
                              capture_output=False)
        return result.returncode
    except Exception as e:
        print(f"Error running {test_file}: {e}")
        return 1

def main():
    """Run all tests"""
    print("🧪 CCRI Cyberknights Website Test Suite")
    print("=" * 60)
    
    # List of test files to run
    test_files = [
        "test_routing.py",
        "test_qr_standalone.py"
    ]
    
    # Track results
    results = []
    total_tests = len(test_files)
    
    # Run each test
    for test_file in test_files:
        exit_code = run_test(test_file)
        results.append((test_file, exit_code))
    
    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    
    passed = 0
    failed = 0
    
    for test_file, exit_code in results:
        status = "✅ PASSED" if exit_code == 0 else "❌ FAILED"
        print(f"{test_file}: {status}")
        if exit_code == 0:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {total_tests} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n💥 {failed} test(s) failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())
