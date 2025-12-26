import requests
import json
import os
from datetime import datetime

def log(msg):
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] {msg}")

def scrape_halkarz_target_prices():
    # The JSON URL from the AngularJS app
    json_url = "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json"
    
    log("Starting Halkarz Target Price Scraper...")
    log(f"Fetching data from: {json_url}")
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        response = requests.get(json_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse the JSON data
        data = response.json()
        log(f"Successfully fetched {len(data)} target price entries")
        
        # Save to public directory
        output_dir = "public"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        output_path = os.path.join(output_dir, "halkarz_target_prices.json")
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        log(f"Saved {len(data)} entries to {output_path}")
        log("Scraping completed successfully!")
        
        # Print sample entry
        if data:
            log(f"Sample entry: {data[0]}")
        
    except Exception as e:
        log(f"Error: {e}")
        raise

if __name__ == "__main__":
    scrape_halkarz_target_prices()
