#!/usr/bin/env python3
"""
Direct data fetcher - bypasses complex scraper logic
Fetches JSON data directly from source URLs and saves to public folder
"""
import requests
import json
import os
import sys

def fetch_and_save(url, output_file, name):
    """Fetch JSON from URL and save to file"""
    print(f"\n{'='*60}")
    print(f"Fetching: {name}")
    print(f"URL: {url}")
    print(f"Output: {output_file}")
    print(f"{'='*60}")
    
    try:
        # Make request
        print("Making HTTP request...")
        response = requests.get(url, timeout=20)
        print(f"Status: {response.status_code}")
        
        if not response.ok:
            print(f"ERROR: HTTP {response.status_code}")
            return False
        
        # Parse JSON
        print("Parsing JSON...")
        data = response.json()
        print(f"SUCCESS: Got {len(data)} items")
        
        # Show sample
        if len(data) > 0:
            print(f"Sample keys: {list(data[0].keys())[:5]}")
        
        # Save to file
        os.makedirs(os.path.dirname(output_file) or '.', exist_ok=True)
        print(f"Saving to {output_file}...")
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Verify
        file_size = os.path.getsize(output_file)
        print(f"✓ Saved successfully ({file_size:,} bytes)")
        return True
        
    except Exception as e:
        print(f"✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main function"""
    print("="*60)
    print("DIRECT DATA FETCHER")
    print("="*60)
    
    # Define data sources
    sources = [
        {
            "name": "Target Prices",
            "url": "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json",
            "output": "public/halkarz_target_prices.json"
        },
        {
            "name": "Dividends",
            "url": "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json",
            "output": "public/temettu.json"
        }
    ]
    
    # Fetch all
    results = {}
    for source in sources:
        success = fetch_and_save(source["url"], source["output"], source["name"])
        results[source["name"]] = success
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    
    for name, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{status}: {name}")
    
    # Exit code
    all_success = all(results.values())
    sys.exit(0 if all_success else 1)

if __name__ == "__main__":
    main()
