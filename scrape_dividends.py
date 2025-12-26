import requests
import json
import os

def scrape_dividends():
    url = "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://halkarz.com/temettu-takvimi/"
    }

    try:
        print(f"Fetching data from {url}...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        print(f"Fetched {len(data)} records.")

        # Ensure public directory exists
        os.makedirs('public', exist_ok=True)
        
        output_path = os.path.join('public', 'temettu.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully saved data to {output_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_dividends()
