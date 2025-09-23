#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Selenium script to capture navigation bar screenshots and analyze layout issues
"""

import os
import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Add project root to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def setup_driver():
    """Set up Chrome driver with options for screenshot capture"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-logging")
    chrome_options.add_argument("--disable-web-security")
    chrome_options.add_argument("--allow-running-insecure-content")
    
    driver = webdriver.Chrome(options=chrome_options)
    return driver

def capture_navigation_analysis():
    """Capture screenshots and analyze navigation bar layout"""
    driver = setup_driver()
    
    try:
        print("Analyzing navigation bar layout...")
        
        # Navigate to the main page
        driver.get("http://localhost:8000")
        time.sleep(2)
        
        # Take full page screenshot
        driver.save_screenshot("navigation_analysis_full_page.png")
        print("Captured full page screenshot: navigation_analysis_full_page.png")
        
        # Find and capture navigation elements
        try:
            # Find the header element
            header = driver.find_element(By.TAG_NAME, "header")
            
            # Take screenshot of just the header
            driver.execute_script("arguments[0].scrollIntoView();", header)
            time.sleep(1)
            header.screenshot("navigation_analysis_header.png")
            print("Captured header screenshot: navigation_analysis_header.png")
            
            # Analyze navigation structure
            nav_elements = driver.find_elements(By.CSS_SELECTOR, "nav a")
            print("Found " + str(len(nav_elements)) + " navigation links:")
            
            for i, nav in enumerate(nav_elements):
                text = nav.text.strip()
                href = nav.get_attribute("href")
                print("  " + str(i+1) + ". '" + text + "' -> " + href)
                
                # Get element position and size
                location = nav.location
                size = nav.size
                print("     Position: " + str(location) + ", Size: " + str(size))
            
            # Check if navigation is centered or left-aligned
            nav_container = driver.find_element(By.CSS_SELECTOR, "nav")
            nav_style = driver.execute_script("return window.getComputedStyle(arguments[0]);", nav_container)
            
            print("\nNavigation container analysis:")
            print("  Display: " + nav_style['display'])
            print("  Justify-content: " + nav_style['justify-content'])
            print("  Text-align: " + nav_style['text-align'])
            print("  Flex-direction: " + nav_style['flex-direction'])
            
            # Check header container
            header_style = driver.execute_script("return window.getComputedStyle(arguments[0]);", header)
            print("\nHeader container analysis:")
            print("  Display: " + header_style['display'])
            print("  Justify-content: " + header_style['justify-content'])
            print("  Max-width: " + header_style['max-width'])
            print("  Margin: " + header_style['margin'])
            
        except Exception as e:
            print("Error analyzing navigation: " + str(e))
        
        # Navigate to different pages to see if issue persists
        pages_to_test = [
            ("#/home", "Home page"),
            ("#/cybersecurity", "Club page"), 
            ("#/linux", "Linux page"),
            ("#/calendar", "Calendar page"),
            ("#/resources", "Resources page")
        ]
        
        for route, page_name in pages_to_test:
            try:
                print("\nTesting " + page_name + "...")
                driver.get("http://localhost:8000/" + route)
                time.sleep(2)
                
                # Take screenshot of this page
                filename = "navigation_analysis_" + route.replace('#/', '').replace('/', '_') + ".png"
                driver.save_screenshot(filename)
                print("Captured " + page_name + " screenshot: " + filename)
                
                # Check if navigation looks different
                nav_elements = driver.find_elements(By.CSS_SELECTOR, "nav a")
                if nav_elements:
                    first_nav = nav_elements[0]
                    location = first_nav.location
                    print("  First nav element position: " + str(location))
                
            except Exception as e:
                print("Error testing " + page_name + ": " + str(e))
        
        print("\nAnalysis complete! Check the generated PNG files to see the navigation layout.")
        print("Screenshots saved in: " + os.getcwd())
        
    except Exception as e:
        print("Error during analysis: " + str(e))
        
    finally:
        driver.quit()

if __name__ == "__main__":
    print("Starting navigation bar analysis...")
    print("This will capture screenshots and analyze the navigation layout")
    print("Make sure your local server is running on http://localhost:8000")
    print()
    
    capture_navigation_analysis()