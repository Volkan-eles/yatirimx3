import requests
from bs4 import BeautifulSoup
import re

url = "https://halkarz.com/arf-bio-yenilenebilir-enerji-uretim-a-s/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

try:
    resp = requests.get(url, headers=headers, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')
    
    full_text = soup.get_text("\n", strip=True)
    
    print("--- SEARCHING FOR 'Halka Arz Fiyatı' ---")
    # Find all occurrences and print context
    for match in re.finditer(r'Halka\s*Arz\s*Fiyatı', full_text, re.IGNORECASE):
        start = max(0, match.start() - 50)
        end = min(len(full_text), match.end() + 100)
        print(f"CONTEXT: ...{full_text[start:end].replace(chr(10), ' ')}...")

    print("\n--- HTML SNIPPET ---")
    # Try to find the element containing it
    elements = soup.find_all(string=re.compile(r'Halka\s*Arz\s*Fiyatı', re.IGNORECASE))
    for el in elements:
        parent = el.parent
        print(f"ELEMENT: {parent}")
        print(f"TEXT: {parent.get_text(strip=True)}")

except Exception as e:
    print(f"Error: {e}")
