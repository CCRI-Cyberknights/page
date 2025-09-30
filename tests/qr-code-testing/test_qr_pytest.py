#!/usr/bin/env python3
"""
QR Code Unit Tests (Pytest)

Comprehensive unit tests for QR code generation and validation.
"""

import pytest
import os
import json
import base64
from PIL import Image
from gen_and_embed import gen_qr, verify_b64_roundtrip, make_html

class TestQRGeneration:
    """Test QR code generation functionality."""
    
    def test_qr_generation_basic(self, tmp_path):
        """Test basic QR code generation."""
        # Change to temp directory
        os.chdir(tmp_path)
        
        # Generate QR code
        png_path, b64 = gen_qr("test1", "https://example.com/test")
        
        # Verify files exist
        assert os.path.exists(png_path)
        assert os.path.exists("out/qr_test1.b64.txt")
        assert os.path.exists("out/qr_test1.meta.json")
        
        # Verify PNG is valid image
        img = Image.open(png_path)
        assert img.size[0] > 0
        assert img.size[1] > 0
        
        # Verify Base64 is valid
        assert len(b64) > 100  # Should be substantial
        assert isinstance(b64, str)
        
        # Verify metadata
        with open("out/qr_test1.meta.json") as f:
            meta = json.load(f)
        assert meta["id"] == "test1"
        assert meta["data"] == "https://example.com/test"
    
    def test_qr_generation_different_sizes(self, tmp_path):
        """Test QR code generation with different parameters."""
        os.chdir(tmp_path)
        
        test_cases = [
            ("small", "https://example.com", 5, 2, "L"),
            ("medium", "https://example.com", 10, 4, "M"),
            ("large", "https://example.com", 15, 6, "H")
        ]
        
        for id, url, box_size, border, error in test_cases:
            png_path, b64 = gen_qr(id, url, box_size, border, error)
            
            # Verify generation
            assert os.path.exists(png_path)
            assert len(b64) > 0
            
            # Verify metadata
            with open(f"out/qr_{id}.meta.json") as f:
                meta = json.load(f)
            assert meta["box_size"] == box_size
            assert meta["border"] == border
            assert meta["error_level"] == error
    
    def test_base64_roundtrip(self, tmp_path):
        """Test Base64 encoding/decoding roundtrip."""
        os.chdir(tmp_path)
        
        # Generate QR code
        gen_qr("roundtrip", "https://example.com/roundtrip")
        
        # Test roundtrip
        success, msg = verify_b64_roundtrip("roundtrip")
        assert success, f"Roundtrip failed: {msg}"
    
    def test_html_generation(self, tmp_path):
        """Test HTML page generation."""
        os.chdir(tmp_path)
        
        # Generate test QR codes
        gen_qr("html1", "https://example.com/1")
        gen_qr("html2", "https://example.com/2")
        
        # Generate HTML
        html_path = make_html(["html1", "html2"])
        
        # Verify HTML file
        assert os.path.exists(html_path)
        
        # Read and verify content
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        assert "data:image/png;base64," in html_content
        assert "qr_html1" in html_content
        assert "qr_html2" in html_content
        assert "<!DOCTYPE html>" in html_content

class TestQRValidation:
    """Test QR code validation functionality."""
    
    def test_qr_content_validation(self, tmp_path):
        """Test that generated QR codes contain expected content."""
        os.chdir(tmp_path)
        
        test_url = "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html"
        
        # Generate QR code
        png_path, b64 = gen_qr("validation", test_url)
        
        # Verify PNG exists and is valid
        assert os.path.exists(png_path)
        img = Image.open(png_path)
        assert img.size[0] > 0 and img.size[1] > 0
        
        # Verify Base64 contains data
        assert len(b64) > 1000  # Should be substantial for this URL
        
        # Verify metadata
        with open("out/qr_validation.meta.json") as f:
            meta = json.load(f)
        assert meta["data"] == test_url
    
    def test_error_correction_levels(self, tmp_path):
        """Test different error correction levels."""
        os.chdir(tmp_path)
        
        test_url = "https://example.com/ecl-test"
        ecl_levels = ["L", "M", "Q", "H"]
        
        for ecl in ecl_levels:
            png_path, b64 = gen_qr(f"ecl_{ecl}", test_url, error=ecl)
            
            # Verify generation
            assert os.path.exists(png_path)
            assert len(b64) > 0
            
            # Verify metadata
            with open(f"out/qr_ecl_{ecl}.meta.json") as f:
                meta = json.load(f)
            assert meta["error_level"] == ecl

class TestQRIntegration:
    """Integration tests for complete QR code pipeline."""
    
    def test_complete_pipeline(self, tmp_path):
        """Test complete QR code generation and HTML pipeline."""
        os.chdir(tmp_path)
        
        # Test URLs from the project
        test_urls = {
            "home": "https://ccri-cyberknights.github.io/page/",
            "cheatsheet3": "https://ccri-cyberknights.github.io/page/#/guides/linux-cheatsheet-3.html"
        }
        
        generated_ids = []
        
        # Generate QR codes
        for id, url in test_urls.items():
            png_path, b64 = gen_qr(id, url)
            generated_ids.append(id)
            
            # Verify each step
            assert os.path.exists(png_path)
            assert len(b64) > 0
            
            # Verify roundtrip
            success, _ = verify_b64_roundtrip(id)
            assert success
        
        # Generate HTML
        html_path = make_html(generated_ids)
        assert os.path.exists(html_path)
        
        # Verify HTML contains all QR codes
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        for id in generated_ids:
            assert f"qr_{id}" in html_content
            assert "data:image/png;base64," in html_content

# Pytest configuration
@pytest.fixture(autouse=True)
def setup_test_environment(tmp_path):
    """Setup test environment before each test."""
    # Create output directory in temp path
    out_dir = tmp_path / "out"
    out_dir.mkdir(exist_ok=True)
    
    # Change to temp directory
    original_cwd = os.getcwd()
    os.chdir(tmp_path)
    
    yield
    
    # Restore original directory
    os.chdir(original_cwd)

if __name__ == "__main__":
    # Run tests directly
    pytest.main([__file__, "-v"])
