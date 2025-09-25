#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Performance Comparison Script for Link Testing
Compares sequential vs parallel link testing performance
"""

import sys
import os
import time
import subprocess
sys.path.append('/home/zachary/Cursor_Projects/qr-code-landing-pages/testing_env/lib/python3.12/site-packages')

def run_test_script(script_name, description):
    """Run a test script and measure execution time"""
    print(f"\n{'='*60}")
    print(f"RUNNING {description}")
    print(f"Script: {script_name}")
    print(f"{'='*60}")
    
    start_time = time.time()
    
    try:
        # Activate virtual environment and run script
        result = subprocess.run([
            'bash', '-c', 
            f'source ./testing_env/bin/activate && python3 {script_name}'
        ], capture_output=True, text=True, cwd='/home/zachary/Cursor_Projects/qr-code-landing-pages')
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        print(f"EXECUTION TIME: {execution_time:.2f} seconds")
        print(f"EXIT CODE: {result.returncode}")
        
        if result.stdout:
            print("\nSTDOUT:")
            print(result.stdout)
        
        if result.stderr:
            print("\nSTDERR:")
            print(result.stderr)
        
        return execution_time, result.returncode == 0
        
    except Exception as e:
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"ERROR: {e}")
        print(f"EXECUTION TIME: {execution_time:.2f} seconds")
        return execution_time, False

def main():
    """Main function to compare performance"""
    print("PERFORMANCE COMPARISON: Sequential vs Parallel Link Testing")
    print("="*80)
    
    # Check if we're in the right directory
    if not os.path.exists('scripts/test-links-dynamic.py'):
        print("ERROR: Please run this script from the project root directory")
        sys.exit(1)
    
    # Run sequential test
    sequential_time, sequential_success = run_test_script(
        'scripts/test-links-dynamic.py', 
        'Sequential Link Testing'
    )
    
    # Run parallel test
    parallel_time, parallel_success = run_test_script(
        'scripts/test-links-dynamic-parallel.py', 
        'Parallel Link Testing'
    )
    
    # Calculate performance improvement
    if sequential_time > 0:
        speedup = sequential_time / parallel_time
        time_saved = sequential_time - parallel_time
        improvement_percent = ((sequential_time - parallel_time) / sequential_time) * 100
        
        print(f"\n{'='*60}")
        print("PERFORMANCE COMPARISON RESULTS")
        print(f"{'='*60}")
        print(f"Sequential Time: {sequential_time:.2f} seconds")
        print(f"Parallel Time:   {parallel_time:.2f} seconds")
        print(f"Time Saved:      {time_saved:.2f} seconds")
        print(f"Speedup:         {speedup:.2f}x faster")
        print(f"Improvement:     {improvement_percent:.1f}% faster")
        
        if parallel_success and sequential_success:
            print(f"\n✅ Both tests completed successfully!")
            print(f"🚀 Parallel testing is {speedup:.2f}x faster!")
        elif parallel_success and not sequential_success:
            print(f"\n✅ Parallel test succeeded, sequential test failed")
            print(f"🚀 Parallel testing is both faster AND more reliable!")
        elif not parallel_success and sequential_success:
            print(f"\n❌ Parallel test failed, sequential test succeeded")
            print(f"⚠️  Need to debug parallel implementation")
        else:
            print(f"\n❌ Both tests failed")
            print(f"⚠️  Need to debug both implementations")
    else:
        print(f"\n❌ Could not measure sequential performance")
    
    print(f"\n{'='*60}")
    print("RECOMMENDATION")
    print(f"{'='*60}")
    if parallel_success and parallel_time < sequential_time:
        print("✅ Use parallel link testing for faster commits!")
        print("   The parallel version is now active in the pre-commit hook.")
    else:
        print("⚠️  Consider debugging parallel implementation")
        print("   Sequential version is still being used.")

if __name__ == "__main__":
    main()
