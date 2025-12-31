import requests
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def debug_home():
    try:
        r = requests.get('https://halkarz.com/', headers=HEADERS)
        soup = BeautifulSoup(r.content, 'html.parser')
        
        # Dump all links to see what's being caught
        print("--- Finding Links ---")
        found = False
        for a in soup.find_all('a'):
            href = a.get('href', '')
            text = a.get_text(strip=True)
            if 'Formül' in text or 'formul' in href:
                print(f"MATCH FOUND: Text='{text}' Href='{href}' Parent='{a.parent.name}' Class='{a.get('class')}'")
                found = True
        
        if not found:
            print("NO MATCH found for 'Formül' in any <a> tag.")
            # check if it's in raw text
            if 'Formül' in r.text:
                print("But 'Formül' IS present in the raw HTML body.")
            else:
                print("'Formül' is NOT in the HTML body. It might be loaded via JS or headers block.")

    except Exception as e:
        print(e)

debug_home()
