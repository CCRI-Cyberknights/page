#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test footer visibility on different pages
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

def test_footer_visibility():
    """Test footer visibility on different pages"""
    driver = setup_driver()
    
    try:
        print("=== FOOTER VISIBILITY TEST ===")
        
        pages_to_test = [
            ("http://localhost:8000", "Home page"),
            ("http://localhost:8000/#/resources", "Resources page"),
            ("http://localhost:8000/#/linux", "Linux page"),
            ("http://localhost:8000/#/cybersecurity", "Club page")
        ]
        
        for url, page_name in pages_to_test:
            print(f"\n--- Testing {page_name} ---")
            driver.get(url)
            time.sleep(2)
            
            # Get page height
            page_height = driver.execute_script("return document.body.scrollHeight")
            window_height = driver.get_window_size()['height']
            
            print(f"Page height: {page_height}px")
            print(f"Window height: {window_height}px")
            
            # Check if footer exists
            try:
                footer = driver.find_element(By.TAG_NAME, "footer")
                footer_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", footer)
                footer_bottom = footer_rect['y'] + footer_rect['height']
                
                print(f"Footer position: y={footer_rect['y']}, height={footer_rect['height']}")
                print(f"Footer bottom: {footer_bottom}px")
                print(f"Window height: {window_height}px")
                
                if footer_bottom <= window_height:
                    print("RESULT: Footer is VISIBLE in viewport")
                else:
                    print("RESULT: Footer is BELOW viewport (not visible)")
                    
                # Check if footer is in viewport
                is_footer_visible = driver.execute_script("""
                    var footer = arguments[0];
                    var rect = footer.getBoundingClientRect();
                    return rect.top >= 0 && rect.bottom <= window.innerHeight;
                """, footer)
                
                print(f"Footer in viewport: {is_footer_visible}")
                
            except Exception as e:
                print(f"Footer not found: {e}")
            
            # Take screenshot for visual verification
            filename = f"footer_test_{page_name.lower().replace(' ', '_')}.png"
            driver.save_screenshot(filename)
            print(f"Screenshot saved: {filename}")
        
        print(f"\n=== TEST COMPLETE ===")
        
    except Exception as e:
        print(f"Error during test: {e}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_footer_visibility()
