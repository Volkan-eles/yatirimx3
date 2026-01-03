try:
    from curl_cffi import requests
    print("curl_cffi imported successfully")
    r = requests.get("https://www.google.com", impersonate="chrome120")
    print(f"Request status: {r.status_code}")
except ImportError as e:
    print(f"ImportError: {e}")
except Exception as e:
    print(f"Error: {e}")
