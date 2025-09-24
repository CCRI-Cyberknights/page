#!/usr/bin/env python3
"""
YouTube URL Shortener
Shortens long YouTube URLs to youtu.be format while preserving prefixes like @
"""

import re
from urllib.parse import urlparse, parse_qs


def shorten_youtube_url(url):
    """
    Shorten a YouTube URL from long format to short format.
    
    Args:
        url (str): The YouTube URL to shorten (e.g., "@https://www.youtube.com/watch?v=VIDEO_ID&list=...")
    
    Returns:
        str: The shortened URL (e.g., "@https://youtu.be/VIDEO_ID")
    """
    # Extract prefix (like @) if present
    prefix = ""
    if url.startswith('@'):
        prefix = "@"
        url = url[1:]
    
    # Parse the URL
    parsed_url = urlparse(url)
    
    # Check if it's a YouTube URL
    if 'youtube.com' not in parsed_url.netloc and 'youtu.be' not in parsed_url.netloc:
        return prefix + url  # Return original if not YouTube
    
    # If already short format, return as is
    if 'youtu.be' in parsed_url.netloc:
        return prefix + url
    
    # Extract video ID from query parameters
    query_params = parse_qs(parsed_url.query)
    video_id = query_params.get('v', [None])[0]
    
    if not video_id:
        return prefix + url  # Return original if no video ID found
    
    # Construct short URL
    short_url = f"https://youtu.be/{video_id}"
    return prefix + short_url


def shorten_youtube_url_regex(url):
    """
    Alternative implementation using regex for YouTube URL shortening.
    
    Args:
        url (str): The YouTube URL to shorten
    
    Returns:
        str: The shortened URL
    """
    # Extract prefix (like @) if present
    prefix = ""
    if url.startswith('@'):
        prefix = "@"
        url = url[1:]
    
    # Regex pattern to match YouTube URLs and extract video ID
    pattern = r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([a-zA-Z0-9_-]+)'
    match = re.search(pattern, url)
    
    if match:
        video_id = match.group(1)
        short_url = f"https://youtu.be/{video_id}"
        return prefix + short_url
    
    # If already short format or not a YouTube URL, return as is
    return prefix + url


def batch_shorten_urls(urls):
    """
    Shorten multiple YouTube URLs at once.
    
    Args:
        urls (list): List of YouTube URLs to shorten
    
    Returns:
        list: List of shortened URLs
    """
    return [shorten_youtube_url(url) for url in urls]


if __name__ == "__main__":
    import sys
    
    # If URLs provided as command line arguments, shorten them
    if len(sys.argv) > 1:
        urls_to_shorten = sys.argv[1:]
        print("Shortening YouTube URLs:")
        print("=" * 40)
        
        for url in urls_to_shorten:
            shortened = shorten_youtube_url(url)
            print(f"Input:  {url}")
            print(f"Output: {shortened}")
            print()
    else:
        # Test cases
        test_urls = [
            "@https://www.youtube.com/watch?v=N9j--n-zGgc&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=43s",
            "@https://youtu.be/N9j--n-zGgc",  # Already short
            "https://www.youtube.com/watch?v=abc123",
            "https://example.com/not-youtube",  # Not YouTube
            "@https://www.youtube.com/watch?v=xyz789&feature=youtu.be"
        ]
        
        print("YouTube URL Shortener Test Results:")
        print("=" * 50)
        
        for i, url in enumerate(test_urls, 1):
            shortened = shorten_youtube_url(url)
            print(f"Test {i}:")
            print(f"  Input:  {url}")
            print(f"  Output: {shortened}")
            print()
        
        print("Batch shortening test:")
        batch_results = batch_shorten_urls(test_urls)
        for original, shortened in zip(test_urls, batch_results):
            print(f"{original} -> {shortened}")
        
        print("\nUsage examples:")
        print("python youtube_url_shortener.py 'https://www.youtube.com/watch?v=VIDEO_ID'")
        print("python youtube_url_shortener.py '@https://www.youtube.com/watch?v=VIDEO_ID&list=...'")
