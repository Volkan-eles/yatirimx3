import requests
import json
import sys

def test_url(url, name):
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://halkarz.com/",
        }
        
        print("Sending request...")
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'N/A')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
        if response.ok:
            try:
                data = response.json()
                print(f"✓ Success! Parsed JSON with {len(data)} items")
                
                if len(data) > 0:
                    print(f"\nSample item (first):")
                    print(f"  Keys: {list(data[0].keys())}")
                    print(f"  Data: {json.dumps(data[0], ensure_ascii=False, indent=2)[:300]}...")
                    
                return True, data
            except json.JSONDecodeError as e:
                print(f"✗ Failed to parse JSON: {e}")
                print(f"Response preview: {response.text[:200]}")
                return False, []
        else:
            print(f"✗ Failed with status {response.status_code}")
            print(f"Response: {response.text[:200]}")
            return False, []
            
    except requests.Timeout:
        print(f"✗ Request timed out after 10 seconds")
        return False, []
    except requests.RequestException as e:
        print(f"✗ Request error: {e}")
        return False, []
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
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
all_success = True
for name, result in results.items():
    status = "✓" if result["success"] else "✗"
    print(f"{status} {name}: {result['count']} items")
    if not result["success"]:
        all_success = False

sys.exit(0 if all_success else 1)
