#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Test suite for Navigation & Interaction Upgrade (v1.5.0)

Tests the new features:
- Button-style navigation elements
- Mobile-friendly search with dropdown results
- Interactive resource cards with expand/collapse
- External link indicators
- Clickable vs static text functionality
"""

import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys


class NavigationInteractionUpgradeTests(unittest.TestCase):
    """Test suite for v1.5.0 navigation and interaction upgrades"""
    
    @classmethod
    def setUpClass(cls):
        """Set up the test environment"""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--window-size=1920,1080")
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.wait = WebDriverWait(cls.driver, 10)
        cls.base_url = "http://localhost:8000"
        
    @classmethod
    def tearDownClass(cls):
        """Clean up the test environment"""
        cls.driver.quit()
    
    def setUp(self):
        """Navigate to resources page before each test"""
        self.driver.get("{}/#/resources".format(self.base_url))
        time.sleep(2)  # Allow page to load
    
    def test_navigation_button_styles(self):
        """Test that navigation links are styled as buttons"""
        print("Testing navigation button styles...")
        
        # Find navigation elements
        nav_links = self.driver.find_elements(By.CSS_SELECTOR, "nav a")
        
        self.assertGreater(len(nav_links), 0, "Navigation links should exist")
        
        for link in nav_links:
            # Check for button-like styling classes
            classes = link.get_attribute("class")
            self.assertIn("px-3", classes, "Link should have horizontal padding: {}".format(link.text))
            self.assertIn("py-2", classes, "Link should have vertical padding: {}".format(link.text))
            self.assertIn("rounded-md", classes, "Link should be rounded: {}".format(link.text))
            self.assertIn("bg-slate-800", classes, "Link should have background: {}".format(link.text))
            self.assertIn("border", classes, "Link should have border: {}".format(link.text))
            self.assertIn("font-medium", classes, "Link should have medium font weight: {}".format(link.text))
            
            # Check hover effects
            self.assertIn("hover:bg-slate-700", classes, "Link should have hover background: {}".format(link.text))
            self.assertIn("transition-all", classes, "Link should have transitions: {}".format(link.text))
            
        print("✓ Navigation button styles verified")
    
    def test_mobile_search_dropdown(self):
        """Test mobile-friendly search with dropdown results"""
        print("Testing mobile search dropdown...")
        
        # Find search input
        search_input = self.wait.until(
            EC.presence_of_element_located((By.ID, "resources-search"))
        )
        
        # Test search functionality
        search_input.clear()
        search_input.send_keys("quipqiup")
        time.sleep(1)
        
        # Check if dropdown appears
        dropdown = self.driver.find_element(By.ID, "search-results-container")
        self.assertFalse("hidden" in dropdown.get_attribute("class"), 
                        "Search dropdown should be visible when typing")
        
        # Check if results are shown
        results = self.driver.find_element(By.ID, "search-results")
        self.assertIn("quipqiup", results.text.lower(), "Search results should contain the search term")
        
        # Test clicking on a search result
        result_items = self.driver.find_elements(By.CSS_SELECTOR, "#search-results > div")
        if result_items:
            result_items[0].click()
            time.sleep(1)
            
            # Check if modal opens
            modal = self.driver.find_element(By.CSS_SELECTOR, ".fixed.inset-0.bg-black\\/50")
            self.assertTrue(modal.is_displayed(), "Modal should open when clicking search result")
            
            # Close modal
            close_btn = self.driver.find_element(By.CSS_SELECTOR, "button[onclick='closeResourceModal()']")
            close_btn.click()
            time.sleep(1)
        
        # Test clearing search
        search_input.clear()
        time.sleep(1)
        
        # Check if dropdown is hidden
        dropdown_classes = dropdown.get_attribute("class")
        self.assertIn("hidden", dropdown_classes, "Search dropdown should be hidden when cleared")
        
        print("✓ Mobile search dropdown functionality verified")
    
    def test_resource_card_expand_collapse(self):
        """Test resource card expand/collapse functionality"""
        print("Testing resource card expand/collapse...")
        
        # Find resource cards with "more info" buttons
        more_info_buttons = self.driver.find_elements(By.CSS_SELECTOR, "[onclick*='toggleCardDetails']")
        
        if more_info_buttons:
            button = more_info_buttons[0]
            
            # Check initial state
            toggle_text = button.find_element(By.CSS_SELECTOR, ".toggle-text")
            self.assertEqual(toggle_text.text, "more info", "Initial state should show 'more info'")
            
            # Click to expand
            button.click()
            time.sleep(0.5)
            
            # Check expanded state
            self.assertEqual(toggle_text.text, "less info", "Should show 'less info' when expanded")
            
            # Check if detailed summary is visible
            detailed_summary = button.find_element(By.XPATH, "following-sibling::div")
            self.assertFalse("hidden" in detailed_summary.get_attribute("class"), 
                           "Detailed summary should be visible when expanded")
            
            # Check if content is formatted with bullet points
            bullet_points = detailed_summary.find_elements(By.CSS_SELECTOR, ".text-emerald-400")
            self.assertGreater(len(bullet_points), 0, "Detailed summary should have bullet points")
            
            # Click to collapse
            button.click()
            time.sleep(0.5)
            
            # Check collapsed state
            self.assertEqual(toggle_text.text, "more info", "Should show 'more info' when collapsed")
            self.assertIn("hidden", detailed_summary.get_attribute("class"), 
                         "Detailed summary should be hidden when collapsed")
            
            print("✓ Resource card expand/collapse functionality verified")
        else:
            print("! No resource cards with 'more info' found - skipping test")
    
    def test_external_link_indicators(self):
        """Test external link indicators on outbound links"""
        print("Testing external link indicators...")
        
        # Find external links in resource cards
        external_links = self.driver.find_elements(By.CSS_SELECTOR, "a[target='_blank']")
        
        self.assertGreater(len(external_links), 0, "Should have external links")
        
        for link in external_links:
            # Check for external link icon
            icon = link.find_element(By.CSS_SELECTOR, "svg")
            self.assertIsNotNone(icon, "External link should have icon: {}".format(link.get_attribute('href')))
            
            # Check icon attributes
            icon_classes = icon.get_attribute("class")
            self.assertIn("w-3", icon_classes, "Icon should have width class")
            self.assertIn("h-3", icon_classes, "Icon should have height class")
            
            # Check for external link attributes
            href = link.get_attribute("href")
            target = link.get_attribute("target")
            rel = link.get_attribute("rel")
            
            self.assertEqual(target, "_blank", "External link should open in new tab: {}".format(href))
            self.assertIn("noopener", rel, "External link should have noopener: {}".format(href))
            self.assertIn("noreferrer", rel, "External link should have noreferrer: {}".format(href))
        
        print("✓ External link indicators verified")
    
    def test_clickable_vs_static_text(self):
        """Test distinction between clickable and static text elements"""
        print("Testing clickable vs static text...")
        
        # Find clickable elements (buttons, links)
        clickable_elements = self.driver.find_elements(By.CSS_SELECTOR, 
            "a, button, [onclick], .cursor-pointer")
        
        # Find static text elements
        static_elements = self.driver.find_elements(By.CSS_SELECTOR, 
            "p, span, div:not([onclick]):not(.cursor-pointer)")
        
        # Test clickable elements have appropriate styling
        for element in clickable_elements:
            classes = element.get_attribute("class")
            tag_name = element.tag_name.lower()
            
            if tag_name == "a":
                self.assertIn("hover:", classes, "Clickable link should have hover effects: {}".format(element.text))
            elif "cursor-pointer" in classes:
                self.assertIn("hover:", classes, "Clickable element should have hover effects: {}".format(element.text))
        
        # Test static elements don't have click styling
        for element in static_elements[:5]:  # Test first 5 to avoid too many assertions
            classes = element.get_attribute("class")
            tag_name = element.tag_name.lower()
            
            if tag_name in ["p", "span"] and not element.find_elements(By.XPATH, ".//*[@onclick or @href]"):
                # Static text shouldn't have cursor-pointer unless it's inside a clickable element
                self.assertNotIn("cursor-pointer", classes, 
                               "Static text shouldn't have cursor-pointer: {}".format(element.text[:50]))
        
        print("✓ Clickable vs static text distinction verified")
    
    def test_link_integrity(self):
        """Test that all links are valid and functional"""
        print("Testing link integrity...")
        
        # Find all links
        all_links = self.driver.find_elements(By.TAG_NAME, "a")
        
        self.assertGreater(len(all_links), 0, "Should have links on the page")
        
        for link in all_links:
            href = link.get_attribute("href")
            
            # Skip empty or javascript links
            if not href or href.startswith("javascript:") or href.startswith("#"):
                continue
            
            # Check for valid href
            self.assertIsNotNone(href, "Link should have href attribute")
            self.assertGreater(len(href), 0, "Link href should not be empty")
            
            # Check for proper external link attributes if external
            if href.startswith("http") and not href.startswith("http://localhost"):
                target = link.get_attribute("target")
                rel = link.get_attribute("rel")
                
                self.assertEqual(target, "_blank", "External link should open in new tab: {}".format(href))
                self.assertIn("noopener", rel, "External link should have noopener: {}".format(href))
        
        print("✓ Link integrity verified")
    
    def test_mobile_responsiveness(self):
        """Test mobile responsiveness of new features"""
        print("Testing mobile responsiveness...")
        
        # Set mobile viewport
        self.driver.set_window_size(375, 667)  # iPhone SE size
        time.sleep(1)
        
        # Test navigation buttons on mobile
        nav_links = self.driver.find_elements(By.CSS_SELECTOR, "nav a")
        for link in nav_links:
            # Check if buttons are still visible and clickable
            self.assertTrue(link.is_displayed(), "Navigation button should be visible on mobile: {}".format(link.text))
            
            # Check button size is appropriate for mobile
            size = link.size
            self.assertGreater(size["height"], 30, "Button should be tall enough for mobile: {}".format(link.text))
        
        # Test search functionality on mobile
        search_input = self.driver.find_element(By.ID, "resources-search")
        self.assertTrue(search_input.is_displayed(), "Search input should be visible on mobile")
        
        # Test search dropdown positioning on mobile
        search_input.click()
        search_input.send_keys("test")
        time.sleep(1)
        
        dropdown = self.driver.find_element(By.ID, "search-results-container")
        self.assertTrue(dropdown.is_displayed(), "Search dropdown should be visible on mobile")
        
        # Reset viewport
        self.driver.set_window_size(1920, 1080)
        
        print("✓ Mobile responsiveness verified")


def run_tests():
    """Run all tests"""
    print("Starting Navigation & Interaction Upgrade Tests (v1.5.0)")
    print("=" * 60)
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(NavigationInteractionUpgradeTests)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 60)
    print("Tests run: {}".format(result.testsRun))
    print("Failures: {}".format(len(result.failures)))
    print("Errors: {}".format(len(result.errors)))
    
    if result.failures:
        print("\nFailures:")
        for test, traceback in result.failures:
            print("- {}: {}".format(test, traceback))
    
    if result.errors:
        print("\nErrors:")
        for test, traceback in result.errors:
            print("- {}: {}".format(test, traceback))
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    print("\n{}".format("✓ All tests passed!" if success else "✗ Some tests failed!"))
    
    return success


if __name__ == "__main__":
    run_tests()
