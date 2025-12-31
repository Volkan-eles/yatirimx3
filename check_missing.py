import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Referer": "https://halkarz.com/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
}

try:
    print("Fetching...")
    resp = requests.get("https://halkarz.com/", headers=headers, timeout=10)
    text = resp.text
    print(f"Status: {resp.status_code}")
    print(f"Length: {len(text)}")
    
    if "Formül" in text:
        print("FOUND: Formül")
    else:
        print("NOT FOUND: Formül")
        
    if "Z Gayrimenkul" in text:
        print("FOUND: Z Gayrimenkul")
    else:
        print("NOT FOUND: Z Gayrimenkul")
        
    with open("check_output.html", "w", encoding="utf-8") as f:
        f.write(text)
        
except Exception as e:
    print(f"Error: {e}")
