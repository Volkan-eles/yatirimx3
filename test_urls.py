import requests
import json

def test_url(url, name):
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/plain, */*",
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.ok:
            data = response.json()
            print(f"✓ Success! Got {len(data)} items")
            if len(data) > 0:
                print(f"Sample item keys: {list(data[0].keys())}")
            return True, data
        else:
            print(f"✗ Failed with status {response.status_code}")
            return False, []
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False, []

# Test all URLs
urls = {
    "Target Prices": "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json",
    "Dividends": "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json",
}

results = {}
for name, url in urls.items():
    success, data = test_url(url, name)
    results[name] = {"success": success, "count": len(data)}

print(f"\n{'='*60}")
print("SUMMARY")
print(f"{'='*60}")
for name, result in results.items():
    status = "✓" if result["success"] else "✗"
    print(f"{status} {name}: {result['count']} items")
