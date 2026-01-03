from curl_cffi import requests
import time
import json
import os
from datetime import datetime
import sys

def log(msg):
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] {msg}")
    sys.stdout.flush()

def scrape_halkarz_target_prices():
    # The JSON URL from the AngularJS app
    json_url = "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json"
    
    log("Starting Halkarz Target Price Scraper...")
    log(f"Fetching data from: {json_url}")
    
    headers = {
        "Referer": "https://halkarz.com/",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    }
    
    browsers = ["chrome120", "safari15_5", "edge99"]
    
    for attempt, browser in enumerate(browsers, 1):
        try:
            log(f"Attempt {attempt}/{len(browsers)}: Sending request with {browser}...")
            response = requests.get(json_url, headers=headers, impersonate=browser, timeout=30)
            log(f"Response status: {response.status_code}")
            log(f"Response size: {len(response.content)} bytes")
            
            response.raise_for_status()
            
            # Parse the JSON data
            log("Parsing JSON data...")
            data = response.json()
            log(f"✓ Successfully fetched {len(data)} entries with {browser}")
            
            if len(data) > 0:
                log(f"Sample entry keys: {list(data[0].keys())}")
            
            # Save to public directory
            output_dir = "public"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            
            output_path = os.path.join(output_dir, "halkarz_target_prices.json")
            
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            log(f"✓ Saved {len(data)} entries to {output_path}")
            return True
            
        except Exception as e:
            log(f"✗ {browser} failed: {e}")
            if attempt < len(browsers):
                time.sleep(2)
            else:
                import traceback
                traceback.print_exc()
        

    
    # Create empty file on error
    log("Creating empty fallback file...")
    output_dir = "public"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_path = os.path.join(output_dir, "halkarz_target_prices.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump([], f)
    log("Fallback file created.")
    return False

if __name__ == "__main__":
    import sys
    scrape_halkarz_target_prices()
    sys.exit(0)  # Always exit 0

