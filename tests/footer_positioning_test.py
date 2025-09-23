#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Detailed footer positioning test
"""

import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def setup_driver():
    """Set up Chrome driver with options for screenshot capture"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def test_footer_positioning():
    """Test detailed footer positioning"""
    driver = setup_driver()
    
    try:
        print("=== DETAILED FOOTER POSITIONING TEST ===")
        
        # Test Resources page specifically
        print("\n--- Testing Resources page ---")
        driver.get("http://localhost:8000/#/resources")
        time.sleep(2)
        
        # Get window dimensions
        window_size = driver.get_window_size()
        print(f"Window size: {window_size}")
        
        # Get body dimensions
        body_height = driver.execute_script("return document.body.scrollHeight")
        print(f"Body scroll height: {body_height}px")
        
        # Get wrapper div
        wrapper = driver.find_element(By.CSS_SELECTOR, "body > div.flex")
        wrapper_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", wrapper)
        print(f"Wrapper rect: {wrapper_rect}")
        
        # Get main element
        main = driver.find_element(By.ID, "app")
        main_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", main)
        print(f"Main rect: {main_rect}")
        
        # Get footer
        footer = driver.find_element(By.TAG_NAME, "footer")
        footer_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", footer)
        print(f"Footer rect: {footer_rect}")
        
        # Calculate if footer should be sticky
        footer_bottom = footer_rect['y'] + footer_rect['height']
        window_bottom = window_size['height']
        
        print(f"Footer bottom: {footer_bottom}px")
        print(f"Window bottom: {window_bottom}px")
        print(f"Difference: {footer_bottom - window_bottom}px")
        
        if footer_bottom <= window_bottom:
            print("RESULT: Footer is within viewport")
        else:
            print("RESULT: Footer extends beyond viewport")
        
        # Check if footer is actually visible (not hidden by CSS)
        footer_visible = driver.execute_script("""
            var footer = arguments[0];
            var rect = footer.getBoundingClientRect();
            var styles = window.getComputedStyle(footer);
            return {
                inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                position: styles.position
            };
        """, footer)
        
        print(f"Footer visibility check: {footer_visible}")
        
        # Take screenshot
        driver.save_screenshot("footer_positioning_test.png")
        print("Screenshot saved: footer_positioning_test.png")
        
        print(f"\n=== TEST COMPLETE ===")
        
    except Exception as e:
        print(f"Error during test: {e}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_footer_positioning()
