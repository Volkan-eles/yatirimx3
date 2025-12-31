
import requests
from bs4 import BeautifulSoup
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def clean_text(text):
    return ' '.join(text.split())

def test_fetch():
    link = "https://halkarz.com/formul-plastik-ve-metal-sanayi-a-s/"
    print(f"Testing extraction for: {link}")
    
    try:
        response = requests.get(link, headers=HEADERS, timeout=15)
        print(f"Status Code: {response.status_code}")
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        sp_table = soup.select_one('table.sp-table')
        print(f"Table found: {sp_table is not None}")
        
        price = 'Belirlenmedi'
        dates = 'Tarih Yok'
        
        if sp_table:
            for tr in sp_table.find_all('tr'):
                tds = tr.find_all('td')
                if len(tds) < 2: continue
                label = tds[0].get_text(strip=True)
                value = tds[1].get_text(strip=True)
                print(f"  Row: {label} -> {value}")
                
                if 'Fiyat' in label: price = value
                if 'Tarih' in label: dates = value

        print(f"Extracted Price: {price}")
        print(f"Extracted Date: {dates}")
        
    except Exception as e:
        print(f"Error: {e}")

test_fetch()
