#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced navigation analysis script
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

def analyze_navigation_layout():
    """Analyze navigation layout in detail"""
    driver = setup_driver()
    
    try:
        print("=== NAVIGATION LAYOUT ANALYSIS ===")
        
        # Navigate to the main page
        driver.get("http://localhost:8000")
        time.sleep(2)
        
        # Get window size
        window_size = driver.get_window_size()
        print("Window size: " + str(window_size))
        
        # Find header and navigation elements
        header = driver.find_element(By.TAG_NAME, "header")
        nav = driver.find_element(By.CSS_SELECTOR, "nav")
        nav_links = driver.find_elements(By.CSS_SELECTOR, "nav a")
        
        # Get element dimensions and positions
        header_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", header)
        nav_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", nav)
        
        print("\n=== HEADER ANALYSIS ===")
        print("Header position: x=" + str(header_rect['x']) + ", y=" + str(header_rect['y']))
        print("Header size: width=" + str(header_rect['width']) + ", height=" + str(header_rect['height']))
        
        print("\n=== NAVIGATION ANALYSIS ===")
        print("Nav position: x=" + str(nav_rect['x']) + ", y=" + str(nav_rect['y']))
        print("Nav size: width=" + str(nav_rect['width']) + ", height=" + str(nav_rect['height']))
        
        # Calculate if navigation is centered
        nav_center_x = nav_rect['x'] + (nav_rect['width'] / 2)
        window_center_x = window_size['width'] / 2
        center_offset = abs(nav_center_x - window_center_x)
        
        print("Nav center X: " + str(nav_center_x))
        print("Window center X: " + str(window_center_x))
        print("Center offset: " + str(center_offset) + " pixels")
        
        if center_offset < 50:
            print("RESULT: Navigation appears CENTERED")
        else:
            print("RESULT: Navigation appears LEFT-ALIGNED")
        
        # Analyze each navigation link
        print("\n=== NAVIGATION LINKS ===")
        for i, link in enumerate(nav_links):
            link_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", link)
            text = link.text.strip()
            print("Link " + str(i+1) + " (" + text + "):")
            print("  Position: x=" + str(link_rect['x']) + ", y=" + str(link_rect['y']))
            print("  Size: width=" + str(link_rect['width']) + ", height=" + str(link_rect['height']))
        
        # Get computed styles
        print("\n=== COMPUTED STYLES ===")
        try:
            # Get header styles
            header_styles = driver.execute_script("""
                var elem = arguments[0];
                var styles = window.getComputedStyle(elem);
                return {
                    display: styles.display,
                    justifyContent: styles.justifyContent,
                    alignItems: styles.alignItems,
                    textAlign: styles.textAlign,
                    maxWidth: styles.maxWidth,
                    margin: styles.margin,
                    padding: styles.padding,
                    width: styles.width
                };
            """, header)
            
            print("Header styles:")
            for key, value in header_styles.items():
                print("  " + key + ": " + value)
            
            # Get nav styles
            nav_styles = driver.execute_script("""
                var elem = arguments[0];
                var styles = window.getComputedStyle(elem);
                return {
                    display: styles.display,
                    justifyContent: styles.justifyContent,
                    alignItems: styles.alignItems,
                    textAlign: styles.textAlign,
                    flexDirection: styles.flexDirection,
                    gap: styles.gap,
                    margin: styles.margin,
                    padding: styles.padding
                };
            """, nav)
            
            print("\nNav styles:")
            for key, value in nav_styles.items():
                print("  " + key + ": " + value)
                
        except Exception as e:
            print("Error getting computed styles: " + str(e))
        
        # Check if there's a wrapper div affecting layout
        print("\n=== WRAPPER ANALYSIS ===")
        try:
            wrapper_divs = driver.find_elements(By.CSS_SELECTOR, "body > div")
            print("Found " + str(len(wrapper_divs)) + " direct div children of body")
            
            for i, wrapper in enumerate(wrapper_divs):
                wrapper_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", wrapper)
                wrapper_styles = driver.execute_script("""
                    var elem = arguments[0];
                    var styles = window.getComputedStyle(elem);
                    return {
                        display: styles.display,
                        flexDirection: styles.flexDirection,
                        justifyContent: styles.justifyContent,
                        alignItems: styles.alignItems,
                        width: styles.width,
                        height: styles.height
                    };
                """, wrapper)
                
                print("Wrapper " + str(i+1) + ":")
                print("  Position: x=" + str(wrapper_rect['x']) + ", y=" + str(wrapper_rect['y']))
                print("  Size: width=" + str(wrapper_rect['width']) + ", height=" + str(wrapper_rect['height']))
                print("  Styles:")
                for key, value in wrapper_styles.items():
                    print("    " + key + ": " + value)
                    
        except Exception as e:
            print("Error analyzing wrappers: " + str(e))
        
        print("\n=== ANALYSIS COMPLETE ===")
        
    except Exception as e:
        print("Error during analysis: " + str(e))
        
    finally:
        driver.quit()

if __name__ == "__main__":
    analyze_navigation_layout()
