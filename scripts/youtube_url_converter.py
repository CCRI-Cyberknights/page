#!/usr/bin/env python3
"""
YouTube URL Converter
Converts long YouTube URLs to short format while preserving prefixes like @
"""

import re
from urllib.parse import urlparse, parse_qs


def convert_youtube_url(url):
    """
    Convert a YouTube URL from long format to short format.
    
    Args:
        url (str): The YouTube URL to convert (e.g., "@https://www.youtube.com/watch?v=VIDEO_ID&list=...")
    
    Returns:
        str: The converted short URL (e.g., "@https://youtu.be/VIDEO_ID")
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


def convert_youtube_url_regex(url):
    """
    Alternative implementation using regex for YouTube URL conversion.
    
    Args:
        url (str): The YouTube URL to convert
    
    Returns:
        str: The converted short URL
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


def batch_convert_urls(urls):
    """
    Convert multiple YouTube URLs at once.
    
    Args:
        urls (list): List of YouTube URLs to convert
    
    Returns:
        list: List of converted URLs
    """
    return [convert_youtube_url(url) for url in urls]


if __name__ == "__main__":
    # Test cases
    test_urls = [
        "@https://www.youtube.com/watch?v=N9j--n-zGgc&list=PLqux0fXsj7x3WYm6ZWuJnGC1rXQZ1018M",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=43s",
        "@https://youtu.be/N9j--n-zGgc",  # Already short
        "https://www.youtube.com/watch?v=abc123",
        "https://example.com/not-youtube",  # Not YouTube
        "@https://www.youtube.com/watch?v=xyz789&feature=youtu.be"
    ]
    
    print("YouTube URL Converter Test Results:")
    print("=" * 50)
    
    for i, url in enumerate(test_urls, 1):
        converted = convert_youtube_url(url)
        print(f"Test {i}:")
        print(f"  Input:  {url}")
        print(f"  Output: {converted}")
        print()
    
    print("Batch conversion test:")
    batch_results = batch_convert_urls(test_urls)
    for original, converted in zip(test_urls, batch_results):
        print(f"{original} -> {converted}")
