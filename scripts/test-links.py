#!/usr/bin/env python3
"""
Comprehensive Link Testing System for CCRI Cyberknights Landing Pages
Tests all internal navigation links and external links before commits
"""

import sys
import os
sys.path.append('/home/zachary/Cursor_Projects/qr-code-landing-pages/testing_env/lib/python3.12/site-packages')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
import time
import requests
from urllib.parse import urljoin, urlparse
import json

class LinkTester:
    def __init__(self, base_url="https://ccri-cyberknights.github.io/page"):
        self.base_url = base_url
        self.driver = None
        self.results = {
            'internal_links': [],
            'external_links': [],
            'failed_links': [],
            'total_tested': 0,
            'total_passed': 0,
            'total_failed': 0
        }
        
        # Define all internal navigation links
        self.internal_links = [
            # Main navigation
            {"url": "#/home", "name": "Home", "expected_content": "Cyberknights"},
            {"url": "#/cybersecurity", "name": "Club", "expected_content": "Cyberknights at CCRI"},
            {"url": "#/linux", "name": "Linux", "expected_content": "CyberKnights Linux"},
            {"url": "#/calendar", "name": "Calendar", "expected_content": "Club Calendar"},
            {"url": "#/resources", "name": "Resources", "expected_content": "Resources"},
            
            # Resource category links
            {"url": "#/resources/cyberknights", "name": "Resources - Cyberknights", "expected_content": "Resources"},
            {"url": "#/resources/ccri", "name": "Resources - CCRI", "expected_content": "Resources"},
            {"url": "#/resources/ctf-competitions", "name": "Resources - CTF Competitions", "expected_content": "Resources"},
            {"url": "#/resources/ctf-tools", "name": "Resources - CTF Tools", "expected_content": "Resources"},
            {"url": "#/resources/stem", "name": "Resources - STEM Day", "expected_content": "Resources"},
            {"url": "#/resources/career", "name": "Resources - Career", "expected_content": "Resources"},
            {"url": "#/resources/linux", "name": "Resources - Linux", "expected_content": "Resources"},
            
            # Map links
            {"url": "#/map-warwick-4080", "name": "Map - Warwick 4080", "expected_content": "Room 4080"},
            
            # Document links
            {"url": "#/document/resources/linux-cheatsheet-1.html", "name": "Linux Cheatsheet", "expected_content": "Linux"},
        ]
        
        # Define external links
        self.external_links = [
            {"url": "https://www.ccri.edu/comp/cybersecurity/studentclub.html", "name": "CCRI Cybersecurity Student Club"},
            {"url": "https://forms.cloud.microsoft/r/U26WUVJGgp", "name": "Microsoft Forms Signup"},
        ]

    def setup_driver(self):
        """Initialize Chrome driver with appropriate options"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--allow-running-insecure-content")
        
        try:
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.set_page_load_timeout(30)
            return True
        except Exception as e:
            print(f"❌ Failed to initialize Chrome driver: {e}")
            return False

    def test_internal_link(self, link_info):
        """Test an internal navigation link"""
        url = link_info['url']
        name = link_info['name']
        expected_content = link_info['expected_content']
        
        full_url = f"{self.base_url}/{url}"
        
        try:
            print(f"🔍 Testing internal link: {name} ({url})")
            
            # Navigate to the link
            self.driver.get(full_url)
            
            # Wait longer for SPA routing and content loading
            time.sleep(5)
            
            # Check if we're on the correct page
            current_url = self.driver.current_url
            page_source = self.driver.page_source.lower()
            
            # Check for expected content (be more flexible)
            content_found = expected_content.lower() in page_source
            
            # Check for error indicators (be more specific to avoid false positives)
            has_error = any(error in page_source for error in ['404', 'not found', 'site not found', 'page not found'])
            
            # Additional check: look for the main app div content
            try:
                app_div = self.driver.find_element(By.ID, "app")
                app_content = app_div.text.lower()
                content_found = content_found or expected_content.lower() in app_content
            except:
                pass
            
            # Check if we're actually on the site (not a 404)
            is_on_site = 'cyberknights' in page_source or 'ccri' in page_source
            
            if content_found and not has_error and is_on_site:
                print(f"   ✅ PASS: {name} - Content found, no errors")
                self.results['internal_links'].append({
                    'name': name,
                    'url': url,
                    'status': 'PASS',
                    'current_url': current_url
                })
                return True
            else:
                print(f"   ❌ FAIL: {name} - Expected content not found or error detected")
                print(f"      Expected: {expected_content}")
                print(f"      Current URL: {current_url}")
                print(f"      Content found: {content_found}")
                print(f"      Has error: {has_error}")
                print(f"      Is on site: {is_on_site}")
                self.results['internal_links'].append({
                    'name': name,
                    'url': url,
                    'status': 'FAIL',
                    'current_url': current_url,
                    'error': 'Expected content not found or error detected'
                })
                return False
                
        except Exception as e:
            print(f"   ❌ ERROR: {name} - {str(e)}")
            self.results['internal_links'].append({
                'name': name,
                'url': url,
                'status': 'ERROR',
                'error': str(e)
            })
            return False

    def test_external_link(self, link_info):
        """Test an external link using HTTP requests"""
        url = link_info['url']
        name = link_info['name']
        
        try:
            print(f"🔍 Testing external link: {name}")
            
            # Use requests to check if the URL is accessible
            response = requests.get(url, timeout=10, allow_redirects=True)
            
            if response.status_code == 200:
                print(f"   ✅ PASS: {name} - Status {response.status_code}")
                self.results['external_links'].append({
                    'name': name,
                    'url': url,
                    'status': 'PASS',
                    'status_code': response.status_code
                })
                return True
            else:
                print(f"   ❌ FAIL: {name} - Status {response.status_code}")
                self.results['external_links'].append({
                    'name': name,
                    'url': url,
                    'status': 'FAIL',
                    'status_code': response.status_code
                })
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ ERROR: {name} - {str(e)}")
            self.results['external_links'].append({
                'name': name,
                'url': url,
                'status': 'ERROR',
                'error': str(e)
            })
            return False

    def test_navigation_flow(self):
        """Test key navigation flows"""
        print("\n🔄 Testing navigation flows...")
        
        flows = [
            {
                'name': 'Home → Club',
                'steps': [
                    {'url': '#/home', 'click': 'Club'},
                    {'url': '#/cybersecurity', 'verify': 'Cyberknights at CCRI'}
                ]
            },
            {
                'name': 'Club → Resources',
                'steps': [
                    {'url': '#/cybersecurity', 'click': 'Explore Resources'},
                    {'url': '#/resources', 'verify': 'Resources'}
                ]
            },
            {
                'name': 'Resources → Linux',
                'steps': [
                    {'url': '#/resources', 'click': 'Linux'},
                    {'url': '#/resources/linux', 'verify': 'Resources'}
                ]
            }
        ]
        
        for flow in flows:
            try:
                print(f"   🔍 Testing flow: {flow['name']}")
                
                # Start at the first step
                self.driver.get(f"{self.base_url}/{flow['steps'][0]['url']}")
                time.sleep(3)
                
                # Click the specified link
                if 'click' in flow['steps'][0]:
                    click_text = flow['steps'][0]['click']
                    try:
                        # Try multiple selectors for the link
                        link = None
                        selectors = [
                            f"//a[contains(text(), '{click_text}')]",
                            f"//a[contains(@href, '{click_text.lower()}')]",
                            f"//*[contains(text(), '{click_text}')]//ancestor::a"
                        ]
                        
                        for selector in selectors:
                            try:
                                link = self.driver.find_element(By.XPATH, selector)
                                break
                            except:
                                continue
                        
                        if link:
                            link.click()
                            time.sleep(3)
                        else:
                            print(f"      ⚠️  Could not find clickable element for '{click_text}'")
                            continue
                            
                    except Exception as e:
                        print(f"      ⚠️  Error clicking '{click_text}': {str(e)}")
                        continue
                
                # Verify we're on the expected page
                if 'verify' in flow['steps'][1]:
                    verify_text = flow['steps'][1]['verify']
                    page_source = self.driver.page_source.lower()
                    current_url = self.driver.current_url
                    
                    if verify_text.lower() in page_source:
                        print(f"      ✅ PASS: {flow['name']}")
                    else:
                        print(f"      ❌ FAIL: {flow['name']} - Expected '{verify_text}' not found")
                        print(f"         Current URL: {current_url}")
                        
            except Exception as e:
                print(f"      ❌ ERROR: {flow['name']} - {str(e)}")

    def run_all_tests(self):
        """Run all link tests"""
        print("🚀 Starting comprehensive link testing...")
        print(f"📍 Base URL: {self.base_url}")
        
        if not self.setup_driver():
            return False
        
        try:
            # Test internal links
            print(f"\n📋 Testing {len(self.internal_links)} internal links...")
            for link in self.internal_links:
                self.results['total_tested'] += 1
                if self.test_internal_link(link):
                    self.results['total_passed'] += 1
                else:
                    self.results['total_failed'] += 1
            
            # Test external links
            print(f"\n🌐 Testing {len(self.external_links)} external links...")
            for link in self.external_links:
                self.results['total_tested'] += 1
                if self.test_external_link(link):
                    self.results['total_passed'] += 1
                else:
                    self.results['total_failed'] += 1
            
            # Test navigation flows
            self.test_navigation_flow()
            
            return True
            
        except Exception as e:
            print(f"❌ Test suite error: {e}")
            return False
            
        finally:
            if self.driver:
                self.driver.quit()

    def generate_report(self):
        """Generate a comprehensive test report"""
        print("\n" + "="*80)
        print("📊 LINK TESTING REPORT")
        print("="*80)
        
        print(f"\n📈 SUMMARY:")
        print(f"   Total Links Tested: {self.results['total_tested']}")
        print(f"   Passed: {self.results['total_passed']}")
        print(f"   Failed: {self.results['total_failed']}")
        print(f"   Success Rate: {(self.results['total_passed'] / self.results['total_tested'] * 100):.1f}%")
        
        # Internal links report
        print(f"\n🔗 INTERNAL LINKS ({len(self.results['internal_links'])}):")
        for link in self.results['internal_links']:
            status_icon = "✅" if link['status'] == 'PASS' else "❌"
            print(f"   {status_icon} {link['name']} ({link['url']})")
            if link['status'] != 'PASS':
                print(f"      Error: {link.get('error', 'Unknown error')}")
        
        # External links report
        print(f"\n🌐 EXTERNAL LINKS ({len(self.results['external_links'])}):")
        for link in self.results['external_links']:
            status_icon = "✅" if link['status'] == 'PASS' else "❌"
            print(f"   {status_icon} {link['name']}")
            if link['status'] != 'PASS':
                print(f"      Error: {link.get('error', 'Unknown error')}")
        
        # Overall result
        if self.results['total_failed'] == 0:
            print(f"\n🎉 ALL TESTS PASSED! Your links are working correctly.")
            return True
        else:
            print(f"\n⚠️  {self.results['total_failed']} TESTS FAILED! Please fix the broken links before committing.")
            return False

def main():
    """Main function to run the link testing suite"""
    tester = LinkTester()
    
    if tester.run_all_tests():
        success = tester.generate_report()
        sys.exit(0 if success else 1)
    else:
        print("❌ Test suite failed to run")
        sys.exit(1)

if __name__ == "__main__":
    main()
