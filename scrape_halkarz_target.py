from curl_cffi import requests
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
    
    try:
        headers = {
            "Referer": "https://halkarz.com/",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
        }
        
        log("Sending HTTP request...")
        response = requests.get(json_url, headers=headers, impersonate="chrome124", timeout=30)
        log(f"Response status: {response.status_code}")
        log(f"Response size: {len(response.content)} bytes")
        
        response.raise_for_status()
        
        # Parse the JSON data
        log("Parsing JSON data...")
        data = response.json()
        log(f"Successfully fetched {len(data)} target price entries")
        
        if len(data) > 0:
            log(f"Sample entry keys: {list(data[0].keys())}")
        
        # Save to public directory
        output_dir = "public"
        if not os.path.exists(output_dir):
            log(f"Creating directory: {output_dir}")
            os.makedirs(output_dir)
        
        output_path = os.path.join(output_dir, "halkarz_target_prices.json")
        
        log(f"Saving data to: {output_path}")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        log(f"✓ Saved {len(data)} entries to {output_path}")
        log("✓ Scraping completed successfully!")
        
        return True
        
    except Exception as e:
        log(f"✗ Error: {e}")
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
    success = scrape_halkarz_target_prices()
    sys.exit(0 if success else 1)

