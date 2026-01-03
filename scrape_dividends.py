from curl_cffi import requests
import json
import os
from datetime import datetime

def log(msg):
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] {msg}")
    import sys
    sys.stdout.flush()

def scrape_dividends():
    url = "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json"
    headers = {
        "Referer": "https://halkarz.com/temettu-takvimi/",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    }

    try:
        log(f"Fetching data from {url}...")
        # Use curl_cffi to bypass 403 blocks
        response = requests.get(url, headers=headers, impersonate="chrome124", timeout=30)
        log(f"Response status: {response.status_code}")
        log(f"Response size: {len(response.content)} bytes")
        
        response.raise_for_status()
        
        log("Parsing JSON data...")
        data = response.json()
        log(f"✓ Fetched {len(data)} dividend records")
        
        if len(data) > 0:
            log(f"Sample entry keys: {list(data[0].keys())}")

        # Ensure public directory exists
        os.makedirs('public', exist_ok=True)
        
        output_path = os.path.join('public', 'temettu.json')
        log(f"Saving data to {output_path}...")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        log(f"✓ Successfully saved {len(data)} records to {output_path}")
        return True

    except Exception as e:
        log(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
    
    log("Creating empty fallback file...")
    os.makedirs('public', exist_ok=True)
    output_path = os.path.join('public', 'temettu.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump([], f)
    log("Fallback file created.")
    return False

if __name__ == "__main__":
    import sys
    success = scrape_dividends()
    sys.exit(0 if success else 1)

