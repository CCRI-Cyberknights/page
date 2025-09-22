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

def test_standalone_qr():
    # Set up Chrome options for headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    try:
        # Create WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        
        # Navigate to the standalone HTML file
        print("🌐 Navigating to http://localhost:8000/resources/linux-cheatsheet-1.html...")
        driver.get("http://localhost:8000/resources/linux-cheatsheet-1.html")
        
        # Wait for page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        print("✅ Standalone HTML page loaded successfully")
        
        # Test QR Code functionality (full interactive panel)
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
            print(f"❌ Error testing QR Code on standalone page: {e}")
        
        print("\n🎉 Standalone QR Code test completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    test_standalone_qr()
