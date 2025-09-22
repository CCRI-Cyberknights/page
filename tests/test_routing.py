#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def test_routing():
    # Set up Chrome options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    try:
        # Create WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        
        # Navigate to the site
        print("🌐 Navigating to http://localhost:8000...")
        driver.get("http://localhost:8000")
        
        # Wait for page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "app"))
        )
        print("✅ Page loaded successfully")
        
        # Test the resources/linux route
        print("🔍 Testing #/resources/linux route...")
        driver.get("http://localhost:8000/#/resources/linux")
        
        # Wait a moment for JavaScript to process
        time.sleep(2)
        
        # Check if we're on the right page
        current_url = driver.current_url
        print(f"📍 Current URL: {current_url}")
        
        # Look for Linux-specific content
        try:
            # Check for Linux resources heading
            linux_heading = driver.find_element(By.XPATH, "//h2[contains(text(), 'Linux Resources')]")
            print("✅ Found 'Linux Resources' heading")
        except:
            print("❌ Could not find 'Linux Resources' heading")
        
        # Check for the Linux cheat sheet link
        try:
            cheat_sheet_link = driver.find_element(By.XPATH, "//a[@href='resources/linux-cheatsheet-1.html']")
            print("✅ Found Linux Cheat Sheet link by href")
            print(f"🔗 Link URL: {cheat_sheet_link.get_attribute('href')}")
            print(f"📝 Link text: {cheat_sheet_link.text}")
        except:
            print("❌ Could not find Linux Cheat Sheet link by href")
            # Try finding any link with linux-cheatsheet in href
            try:
                cheat_sheet_link = driver.find_element(By.XPATH, "//a[contains(@href, 'linux-cheatsheet')]")
                print("✅ Found Linux Cheat Sheet link by partial href")
                print(f"🔗 Link URL: {cheat_sheet_link.get_attribute('href')}")
                print(f"📝 Link text: {cheat_sheet_link.text}")
            except:
                print("❌ Could not find any linux-cheatsheet link")
        
        # Test clicking the Linux cheat sheet link
        try:
            print("🖱️ Clicking Linux Cheat Sheet 1 link...")
            
            # Get the href and navigate directly since target="_blank" opens new tab
            href = cheat_sheet_link.get_attribute('href')
            print(f"🔗 Navigating directly to: {href}")
            driver.get(href)
            time.sleep(2)
            
            # Check if we're on the HTML file
            current_url = driver.current_url
            print(f"📍 After navigation URL: {current_url}")
            
            if "linux-cheatsheet-1.html" in current_url:
                print("✅ Successfully navigated to Linux Cheat Sheet HTML file")
                
                # Check for content
                try:
                    title = driver.find_element(By.XPATH, "//h1[contains(text(), 'Linux Cheat Sheet 1')]")
                    print("✅ Found Linux Cheat Sheet title")
                except:
                    print("❌ Could not find Linux Cheat Sheet title")
                    
                # Check for some key content
                try:
                    commands_section = driver.find_element(By.XPATH, "//h2[contains(text(), 'Essential Commands')]")
                    print("✅ Found Essential Commands section")
                except:
                    print("❌ Could not find Essential Commands section")
            else:
                print("❌ Did not navigate to the expected HTML file")
                
        except Exception as e:
            print(f"❌ Error navigating to link: {e}")
        
        # Test the "Back to Club" link
        print("\n🔍 Testing 'Back to Club' link...")
        driver.get("http://localhost:8000/#/resources/linux")
        time.sleep(2)
        
        try:
            back_link = driver.find_element(By.XPATH, "//a[contains(text(), 'Back to Club')]")
            print("✅ Found '← Back to Club' link")
            print(f"🔗 Back link URL: {back_link.get_attribute('href')}")
            
            # Click the back link
            print("🖱️ Clicking '← Back to Club' link...")
            back_link.click()
            time.sleep(2)
            
            current_url = driver.current_url
            print(f"📍 After back click URL: {current_url}")
            
            if "#/cybersecurity" in current_url:
                print("✅ Successfully navigated back to Club page")
                
                # Check for club content
                try:
                    club_heading = driver.find_element(By.XPATH, "//h2[contains(text(), 'Cybersecurity')]")
                    print("✅ Found 'Cybersecurity' heading on back navigation")
                except:
                    print("❌ Could not find 'Cybersecurity' heading on back navigation")
            else:
                print("❌ Did not navigate back to Club page")
                
        except Exception as e:
            print(f"❌ Error testing back link: {e}")
        
        # Test QR Code functionality
        print("\n🔍 Testing QR Code functionality...")
        driver.get("http://localhost:8000")
        time.sleep(2)
        
        try:
            # Look for QR Code toggle button
            qr_toggle = driver.find_element(By.ID, "footer-qr-toggle")
            print("✅ Found QR Code toggle button")
            
            # Click to show QR Code
            print("🖱️ Clicking QR Code toggle...")
            qr_toggle.click()
            time.sleep(2)
            
            # Check if QR Code panel is visible
            try:
                qr_panel = driver.find_element(By.ID, "footer-qr-panel")
                if qr_panel.is_displayed():
                    print("✅ QR Code panel is visible")
                    
                    # Check for QR Code canvas
                    try:
                        qr_canvas = driver.find_element(By.ID, "footer-qr-canvas")
                        print("✅ Found QR Code canvas")
                        
                        # Check QR Code info
                        try:
                            qr_info = driver.find_element(By.ID, "footer-qr-info")
                            print(f"📱 QR Code info: {qr_info.text}")
                        except:
                            print("❌ Could not find QR Code info")
                            
                    except:
                        print("❌ Could not find QR Code canvas")
                else:
                    print("❌ QR Code panel is not visible")
            except:
                print("❌ Could not find QR Code panel")
                
        except Exception as e:
            print(f"❌ Error testing QR Code: {e}")
        
        print("\n🎉 Test completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    test_routing()
