#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parallel Dynamic Link Testing System for CCRI Cyberknights Landing Pages
Automatically discovers and tests all links found in the HTML using parallel execution
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
import re
from bs4 import BeautifulSoup
import concurrent.futures
import threading
from multiprocessing import cpu_count
import queue

class ParallelLinkTester:
    def __init__(self, base_url="https://ccri-cyberknights.github.io/page", max_workers=None):
        self.base_url = base_url
        self.max_workers = max_workers or min(cpu_count(), 8)  # Cap at 8 to avoid overwhelming servers
        self.discovered_links = {
            'internal_hash': [],
            'internal_guide': [],
            'external': [],
            'navigation': []
        }
        self.results = {
            'total_tested': 0,
            'total_passed': 0,
            'total_failed': 0,
            'failed_links': []
        }
        self.results_lock = threading.Lock()
        self.print_lock = threading.Lock()

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
            driver = webdriver.Chrome(options=chrome_options)
            driver.set_page_load_timeout(30)
            return driver
        except Exception as e:
            with self.print_lock:
                print(f"ERROR: Failed to initialize Chrome driver: {e}")
            return None

    def discover_links_from_html(self):
        """Discover all links by parsing the HTML file"""
        with self.print_lock:
            print("DISCOVERING Discovering links from HTML...")
        
        try:
            # Read the HTML file
            with open('index.html', 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Find all links
            links = soup.find_all('a', href=True)
            
            for link in links:
                href = link['href']
                text = link.get_text(strip=True)
                
                # Categorize links
                if href.startswith('#/'):
                    if href.startswith('#/guides/'):
                        self.discovered_links['internal_guide'].append({
                            'url': href,
                            'text': text,
                            'element': link
                        })
                    elif href.startswith('#/document/'):
                        self.discovered_links['internal_guide'].append({
                            'url': href,
                            'text': text,
                            'element': link,
                            'legacy': True
                        })
                    else:
                        self.discovered_links['internal_hash'].append({
                            'url': href,
                            'text': text,
                            'element': link
                        })
                elif href.startswith('http'):
                    self.discovered_links['external'].append({
                        'url': href,
                        'text': text,
                        'element': link
                    })
                elif href.startswith('/'):
                    # Convert relative URLs to absolute
                    absolute_url = urljoin(self.base_url, href)
                    self.discovered_links['external'].append({
                        'url': absolute_url,
                        'text': text,
                        'element': link
                    })
            
            # Also discover navigation links from the nav structure
            nav_links = soup.find_all('nav')
            for nav in nav_links:
                nav_anchors = nav.find_all('a', href=True)
                for anchor in nav_anchors:
                    href = anchor['href']
                    text = anchor.get_text(strip=True)
                    if href.startswith('#/'):
                        self.discovered_links['navigation'].append({
                            'url': href,
                            'text': text,
                            'element': anchor
                        })
            
            with self.print_lock:
                print(f"   INTERNAL Discovered {len(self.discovered_links['internal_hash'])} internal hash links")
                print(f"   GUIDE Discovered {len(self.discovered_links['internal_guide'])} guide links")
                print(f"   EXTERNAL Discovered {len(self.discovered_links['external'])} external links")
                print(f"   NAVIGATION Discovered {len(self.discovered_links['navigation'])} navigation links")
            
            return True
            
        except Exception as e:
            with self.print_lock:
                print(f"FAIL Error discovering links: {e}")
            return False

    def discover_links_from_runtime(self):
        """Discover additional links by loading the page and scanning dynamically"""
        with self.print_lock:
            print("DISCOVERING Discovering links from runtime page...")
        
        driver = self.setup_driver()
        if not driver:
            return False
            
        try:
            # Load the main page
            driver.get(f"{self.base_url}/#/home")
            time.sleep(3)
            
            # Find all links on the page
            links = driver.find_elements(By.TAG_NAME, "a")
            
            runtime_links = []
            for link in links:
                try:
                    href = link.get_attribute('href')
                    text = link.text.strip()
                    if href and text:
                        runtime_links.append({
                            'url': href,
                            'text': text,
                            'element': link
                        })
                except:
                    continue
            
            with self.print_lock:
                print(f"   RUNTIME Found {len(runtime_links)} additional runtime links")
            
            # Add any new links we haven't seen before
            all_discovered = []
            for category in self.discovered_links.values():
                all_discovered.extend(category)
            
            for runtime_link in runtime_links:
                # Check if this link is new
                is_new = True
                for existing in all_discovered:
                    if existing['url'] == runtime_link['url']:
                        is_new = False
                        break
                
                if is_new:
                    if runtime_link['url'].startswith('#/'):
                        self.discovered_links['internal_hash'].append(runtime_link)
                    elif runtime_link['url'].startswith('http'):
                        self.discovered_links['external'].append(runtime_link)
            
            return True
            
        except Exception as e:
            with self.print_lock:
                print(f"FAIL Error discovering runtime links: {e}")
            return False
            
        finally:
            if driver:
                driver.quit()

    def test_internal_link_worker(self, link_info):
        """Test an internal navigation link - worker function for parallel execution"""
        url = link_info['url']
        text = link_info['text']
        
        # Convert hash link to full URL
        if url.startswith('#/'):
            full_url = f"{self.base_url}/{url}"
        else:
            full_url = url
        
        driver = self.setup_driver()
        if not driver:
            return False, f"Failed to setup driver for {text}"
        
        try:
            with self.print_lock:
                print(f"DISCOVERING Testing internal link: {text} ({url})")
            
            # Navigate to the link
            driver.get(full_url)
            time.sleep(5)  # Wait for SPA routing
            
            # Check if we're on the correct page
            current_url = driver.current_url
            page_source = driver.page_source.lower()
            
            # Check for error indicators (be specific to avoid false positives)
            has_error = any(error in page_source for error in ['404', 'not found', 'site not found', 'page not found'])
            
            # Check if we're actually on the site (not a 404)
            is_on_site = 'cyberknights' in page_source or 'ccri' in page_source
            
            # For hash links, check if the hash is in the URL
            hash_correct = True
            if url.startswith('#/'):
                expected_hash = url[1:]  # Remove the #
                hash_correct = expected_hash in current_url
            
            if not has_error and is_on_site and hash_correct:
                with self.print_lock:
                    print(f"   PASS PASS: {text} - Page loaded successfully")
                return True, None
            else:
                error_msg = f"Page load failed or incorrect navigation - Expected hash: {url}, Current URL: {current_url}, Has error: {has_error}, Is on site: {is_on_site}, Hash correct: {hash_correct}"
                with self.print_lock:
                    print(f"   FAIL FAIL: {text} - Error detected or incorrect navigation")
                    print(f"      Expected hash: {url}")
                    print(f"      Current URL: {current_url}")
                    print(f"      Has error: {has_error}")
                    print(f"      Is on site: {is_on_site}")
                    print(f"      Hash correct: {hash_correct}")
                return False, error_msg
                
        except Exception as e:
            error_msg = str(e)
            with self.print_lock:
                print(f"   FAIL ERROR: {text} - {error_msg}")
            return False, error_msg
            
        finally:
            if driver:
                driver.quit()

    def test_external_link_worker(self, link_info):
        """Test an external link using HTTP requests - worker function for parallel execution"""
        url = link_info['url']
        text = link_info['text']
        
        try:
            with self.print_lock:
                print(f"DISCOVERING Testing external link: {text}")
            
            # Use requests to check if the URL is accessible
            response = requests.get(url, timeout=10, allow_redirects=True)
            
            if response.status_code == 200:
                with self.print_lock:
                    print(f"   PASS PASS: {text} - Status {response.status_code}")
                return True, None
            else:
                error_msg = f'HTTP {response.status_code}'
                with self.print_lock:
                    print(f"   FAIL FAIL: {text} - Status {response.status_code}")
                return False, error_msg
                
        except requests.exceptions.RequestException as e:
            error_msg = str(e)
            with self.print_lock:
                print(f"   FAIL ERROR: {text} - {error_msg}")
            return False, error_msg

    def run_parallel_tests(self, links, test_type, worker_func):
        """Run tests in parallel for a given set of links"""
        if not links:
            return
        
        with self.print_lock:
            print(f"\n{test_type} Testing {len(links)} {test_type.lower()} links in parallel (using {self.max_workers} workers)...")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_link = {
                executor.submit(worker_func, link): link 
                for link in links
            }
            
            # Collect results as they complete
            for future in concurrent.futures.as_completed(future_to_link):
                link = future_to_link[future]
                try:
                    success, error_msg = future.result()
                    
                    with self.results_lock:
                        self.results['total_tested'] += 1
                        if success:
                            self.results['total_passed'] += 1
                        else:
                            self.results['total_failed'] += 1
                            self.results['failed_links'].append({
                                'type': test_type.lower().replace(' ', '_'),
                                'url': link['url'],
                                'text': link['text'],
                                'error': error_msg or 'Unknown error'
                            })
                            
                except Exception as e:
                    with self.results_lock:
                        self.results['total_tested'] += 1
                        self.results['total_failed'] += 1
                        self.results['failed_links'].append({
                            'type': test_type.lower().replace(' ', '_'),
                            'url': link['url'],
                            'text': link['text'],
                            'error': str(e)
                        })

    def run_all_tests(self):
        """Run all discovered link tests in parallel"""
        print("STARTING Starting parallel dynamic link testing...")
        print(f"BASE_URL Base URL: {self.base_url}")
        print(f"PARALLEL Using {self.max_workers} parallel workers (CPU cores: {cpu_count()})")
        
        try:
            # Discover links
            if not self.discover_links_from_html():
                return False
            
            if not self.discover_links_from_runtime():
                return False
            
            # Run tests in parallel
            self.run_parallel_tests(
                self.discovered_links['internal_hash'], 
                "INTERNAL", 
                self.test_internal_link_worker
            )
            
            self.run_parallel_tests(
                self.discovered_links['internal_guide'], 
                "GUIDE", 
                self.test_internal_link_worker
            )
            
            self.run_parallel_tests(
                self.discovered_links['external'], 
                "EXTERNAL", 
                self.test_external_link_worker
            )
            
            return True
            
        except Exception as e:
            print(f"FAIL Test suite error: {e}")
            return False

    def generate_report(self):
        """Generate a comprehensive test report"""
        print("\n" + "="*80)
        print("REPORT PARALLEL DYNAMIC LINK TESTING REPORT")
        print("="*80)
        
        print(f"\nSUMMARY SUMMARY:")
        print(f"   Total Links Tested: {self.results['total_tested']}")
        print(f"   Passed: {self.results['total_passed']}")
        print(f"   Failed: {self.results['total_failed']}")
        if self.results['total_tested'] > 0:
            print(f"   Success Rate: {(self.results['total_passed'] / self.results['total_tested'] * 100):.1f}%")
        
        print(f"\nPERFORMANCE PERFORMANCE:")
        print(f"   Parallel Workers Used: {self.max_workers}")
        print(f"   Available CPU Cores: {cpu_count()}")
        
        # Show discovered links by category
        print(f"\nDISCOVERING DISCOVERED LINKS:")
        print(f"   Internal Hash Links: {len(self.discovered_links['internal_hash'])}")
        print(f"   Internal Guide Links: {len(self.discovered_links['internal_guide'])}")
        print(f"   External Links: {len(self.discovered_links['external'])}")
        print(f"   Navigation Links: {len(self.discovered_links['navigation'])}")
        
        # Show failed links
        if self.results['failed_links']:
            print(f"\nFAIL FAILED LINKS ({len(self.results['failed_links'])}):")
            for link in self.results['failed_links']:
                print(f"   {link['type'].upper()}: {link['text']} ({link['url']})")
                print(f"      Error: {link['error']}")
        
        # Overall result
        if self.results['total_failed'] == 0:
            print(f"\nSUCCESS ALL TESTS PASSED! All discovered links are working correctly.")
            return True
        else:
            print(f"\nWARNING  {self.results['total_failed']} TESTS FAILED! Please fix the broken links before committing.")
            return False

def main():
    """Main function to run the parallel dynamic link testing suite"""
    # Allow override of max workers via command line
    max_workers = None
    if len(sys.argv) > 1:
        try:
            max_workers = int(sys.argv[1])
            print(f"PARALLEL Using custom worker count: {max_workers}")
        except ValueError:
            print("PARALLEL Invalid worker count, using default")
    
    tester = ParallelLinkTester(max_workers=max_workers)
    
    if tester.run_all_tests():
        success = tester.generate_report()
        sys.exit(0 if success else 1)
    else:
        print("FAIL Test suite failed to run")
        sys.exit(1)

if __name__ == "__main__":
    main()
