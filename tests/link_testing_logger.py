#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Link Testing Logger for CCRI Cyberknights Landing Pages
Tracks tested links, success status, content size changes, and maintains historical log
"""

import json
import os
import hashlib
import requests
from datetime import datetime
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin, urlparse


class LinkTestingLogger:
    """Logs link testing results with content size tracking and historical data"""
    
    def __init__(self, log_file_path: str = "tests/tested-links.json"):
        self.log_file_path = log_file_path
        self.log_data = self._load_existing_log()
        self.current_test_session = {
            "timestamp": datetime.now().isoformat(),
            "test_id": self._generate_test_id(),
            "base_url": "",
            "links_tested": [],
            "summary": {
                "total_tested": 0,
                "total_passed": 0,
                "total_failed": 0,
                "content_changes": 0,
                "new_links": 0
            }
        }
    
    def _load_existing_log(self) -> Dict[str, Any]:
        """Load existing log data or create new structure"""
        if os.path.exists(self.log_file_path):
            try:
                with open(self.log_file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                print(f"WARNING: Could not load existing log file: {e}")
        
        return {
            "metadata": {
                "created": datetime.now().isoformat(),
                "version": "1.0",
                "description": "Link testing log with content size tracking"
            },
            "test_sessions": [],
            "link_history": {}
        }
    
    def _generate_test_id(self) -> str:
        """Generate unique test session ID"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"test_{timestamp}"
    
    def _get_content_hash(self, url: str) -> Optional[str]:
        """Get content hash for a URL to detect changes"""
        try:
            response = requests.get(url, timeout=10, allow_redirects=True)
            if response.status_code == 200:
                content = response.content
                return hashlib.md5(content).hexdigest()
        except Exception as e:
            print(f"WARNING: Could not get content hash for {url}: {e}")
        return None
    
    def _get_content_size(self, url: str) -> Optional[int]:
        """Get content size for a URL"""
        try:
            response = requests.head(url, timeout=10, allow_redirects=True)
            if response.status_code == 200:
                return int(response.headers.get('content-length', 0))
        except Exception as e:
            print(f"WARNING: Could not get content size for {url}: {e}")
        return None
    
    def start_test_session(self, base_url: str):
        """Start a new test session"""
        self.current_test_session["base_url"] = base_url
        self.current_test_session["timestamp"] = datetime.now().isoformat()
        print(f"LOG Starting test session {self.current_test_session['test_id']} for {base_url}")
    
    def log_link_test(self, url: str, link_text: str, success: bool, 
                     status_code: Optional[int] = None, error_message: Optional[str] = None):
        """Log the result of a single link test"""
        # Get current content info
        current_hash = self._get_content_hash(url)
        current_size = self._get_content_size(url)
        
        # Check for content changes
        content_changed = False
        size_changed = False
        previous_hash = None
        previous_size = None
        
        if url in self.log_data["link_history"]:
            history = self.log_data["link_history"][url]
            previous_hash = history.get("last_content_hash")
            previous_size = history.get("last_content_size")
            
            if previous_hash and current_hash and previous_hash != current_hash:
                content_changed = True
            
            if previous_size and current_size and previous_size != current_size:
                size_changed = True
        else:
            # New link
            self.current_test_session["summary"]["new_links"] += 1
        
        # Update link history
        self.log_data["link_history"][url] = {
            "url": url,
            "link_text": link_text,
            "last_tested": datetime.now().isoformat(),
            "last_success": success,
            "last_status_code": status_code,
            "last_content_hash": current_hash,
            "last_content_size": current_size,
            "total_tests": self.log_data["link_history"].get(url, {}).get("total_tests", 0) + 1,
            "success_count": self.log_data["link_history"].get(url, {}).get("success_count", 0) + (1 if success else 0)
        }
        
        # Log test result
        test_result = {
            "url": url,
            "link_text": link_text,
            "success": success,
            "status_code": status_code,
            "error_message": error_message,
            "content_hash": current_hash,
            "content_size": current_size,
            "content_changed": content_changed,
            "size_changed": size_changed,
            "previous_hash": previous_hash,
            "previous_size": previous_size,
            "timestamp": datetime.now().isoformat()
        }
        
        self.current_test_session["links_tested"].append(test_result)
        
        # Update summary
        self.current_test_session["summary"]["total_tested"] += 1
        if success:
            self.current_test_session["summary"]["total_passed"] += 1
        else:
            self.current_test_session["summary"]["total_failed"] += 1
        
        if content_changed or size_changed:
            self.current_test_session["summary"]["content_changes"] += 1
        
        # Print result
        status_icon = "✅" if success else "❌"
        change_indicator = ""
        if content_changed:
            change_indicator += " 📄"
        if size_changed:
            change_indicator += " 📏"
        
        print(f"LOG {status_icon} {link_text} ({url}) - Status: {status_code}{change_indicator}")
    
    def end_test_session(self):
        """End the current test session and save to log"""
        self.current_test_session["end_timestamp"] = datetime.now().isoformat()
        self.current_test_session["duration_seconds"] = (
            datetime.fromisoformat(self.current_test_session["end_timestamp"]) - 
            datetime.fromisoformat(self.current_test_session["timestamp"])
        ).total_seconds()
        
        # Add session to log
        self.log_data["test_sessions"].append(self.current_test_session)
        
        # Keep only last 50 test sessions to prevent file from growing too large
        if len(self.log_data["test_sessions"]) > 50:
            self.log_data["test_sessions"] = self.log_data["test_sessions"][-50:]
        
        # Save to file
        self._save_log()
        
        # Print summary
        summary = self.current_test_session["summary"]
        print(f"\nLOG Test session {self.current_test_session['test_id']} completed:")
        print(f"LOG   Total tested: {summary['total_tested']}")
        print(f"LOG   Passed: {summary['total_passed']}")
        print(f"LOG   Failed: {summary['total_failed']}")
        print(f"LOG   Content changes: {summary['content_changes']}")
        print(f"LOG   New links: {summary['new_links']}")
        print(f"LOG   Duration: {self.current_test_session['duration_seconds']:.2f} seconds")
    
    def _save_log(self):
        """Save log data to file"""
        try:
            os.makedirs(os.path.dirname(self.log_file_path), exist_ok=True)
            with open(self.log_file_path, 'w', encoding='utf-8') as f:
                json.dump(self.log_data, f, indent=2, ensure_ascii=False)
        except IOError as e:
            print(f"ERROR: Could not save log file: {e}")
    
    def get_link_statistics(self) -> Dict[str, Any]:
        """Get statistics about all tested links"""
        if not self.log_data["link_history"]:
            return {"message": "No link history available"}
        
        total_links = len(self.log_data["link_history"])
        successful_links = sum(1 for link in self.log_data["link_history"].values() 
                              if link.get("last_success", False))
        
        return {
            "total_unique_links": total_links,
            "successful_links": successful_links,
            "failed_links": total_links - successful_links,
            "success_rate": (successful_links / total_links * 100) if total_links > 0 else 0,
            "total_test_sessions": len(self.log_data["test_sessions"])
        }
    
    def get_recent_changes(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get links that have changed content in the last N days"""
        cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
        changes = []
        
        for session in self.log_data["test_sessions"]:
            session_time = datetime.fromisoformat(session["timestamp"]).timestamp()
            if session_time >= cutoff_date:
                for link_test in session["links_tested"]:
                    if link_test.get("content_changed", False) or link_test.get("size_changed", False):
                        changes.append({
                            "url": link_test["url"],
                            "link_text": link_test["link_text"],
                            "timestamp": link_test["timestamp"],
                            "content_changed": link_test.get("content_changed", False),
                            "size_changed": link_test.get("size_changed", False),
                            "previous_size": link_test.get("previous_size"),
                            "current_size": link_test.get("content_size")
                        })
        
        return sorted(changes, key=lambda x: x["timestamp"], reverse=True)


def main():
    """Example usage of the LinkTestingLogger"""
    logger = LinkTestingLogger()
    
    # Example test session
    logger.start_test_session("https://ccri-cyberknights.github.io/page")
    
    # Log some test results
    logger.log_link_test("https://ccri-cyberknights.github.io/page/#/home", "Home", True, 200)
    logger.log_link_test("https://ccri-cyberknights.github.io/page/#/linux", "Linux", True, 200)
    logger.log_link_test("https://example.com/broken", "Broken Link", False, 404, "Not Found")
    
    logger.end_test_session()
    
    # Print statistics
    stats = logger.get_link_statistics()
    print(f"\nStatistics: {stats}")
    
    # Print recent changes
    changes = logger.get_recent_changes()
    print(f"\nRecent changes: {len(changes)} links changed")


if __name__ == "__main__":
    main()
