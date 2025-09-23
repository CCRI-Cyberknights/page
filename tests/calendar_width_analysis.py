#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Calendar page width analysis
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

def test_calendar_width():
    """Test calendar page width issues"""
    driver = setup_driver()
    
    try:
        print("=== CALENDAR PAGE WIDTH ANALYSIS ===")
        
        # Navigate to calendar page
        driver.get("http://localhost:8000/#/calendar")
        time.sleep(3)
        
        # Get window dimensions
        window_size = driver.get_window_size()
        print(f"Window size: {window_size}")
        
        # Get main element
        main = driver.find_element(By.ID, "app")
        main_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", main)
        print(f"Main element rect: {main_rect}")
        
        # Get main element styles
        main_styles = driver.execute_script("""
            var elem = arguments[0];
            var styles = window.getComputedStyle(elem);
            return {
                display: styles.display,
                width: styles.width,
                maxWidth: styles.maxWidth,
                margin: styles.margin,
                padding: styles.padding,
                flexGrow: styles.flexGrow
            };
        """, main)
        
        print(f"Main element styles: {main_styles}")
        
        # Look for calendar-specific elements
        try:
            # Try to find calendar iframe or embed
            calendar_elements = driver.find_elements(By.CSS_SELECTOR, "iframe, embed, object")
            print(f"Found {len(calendar_elements)} embedded elements")
            
            for i, elem in enumerate(calendar_elements):
                elem_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", elem)
                elem_styles = driver.execute_script("""
                    var elem = arguments[0];
                    var styles = window.getComputedStyle(elem);
                    return {
                        width: styles.width,
                        height: styles.height,
                        maxWidth: styles.maxWidth,
                        margin: styles.margin
                    };
                """, elem)
                
                print(f"Embedded element {i+1}:")
                print(f"  Rect: {elem_rect}")
                print(f"  Styles: {elem_styles}")
                
        except Exception as e:
            print(f"Error finding calendar elements: {e}")
        
        # Look for any elements with width constraints
        constrained_elements = driver.find_elements(By.CSS_SELECTOR, "[style*='width'], [style*='max-width']")
        print(f"Found {len(constrained_elements)} elements with width constraints")
        
        for i, elem in enumerate(constrained_elements[:5]):  # Limit to first 5
            try:
                elem_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", elem)
                elem_style = elem.get_attribute("style")
                print(f"Constrained element {i+1}:")
                print(f"  Rect: {elem_rect}")
                print(f"  Style: {elem_style}")
            except:
                pass
        
        # Take screenshot
        driver.save_screenshot("calendar_width_analysis.png")
        print("Screenshot saved: calendar_width_analysis.png")
        
        print(f"\n=== ANALYSIS COMPLETE ===")
        
    except Exception as e:
        print(f"Error during analysis: {e}")
        
    finally:
        driver.quit()

if __name__ == "__main__":
    test_calendar_width()
