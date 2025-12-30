import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

def fetch_piapiri_ipos():
    """
    Piapiri.com'dan halka arz verilerini çeker.
    UTF-8 encoding'e özen gösterir.
    """
    url = "https://www.piapiri.com/halka-arz/"
    
    try:
        # UTF-8 encoding ile istek
        response = requests.get(url, timeout=15)
        response.encoding = 'utf-8'
        
        if response.status_code != 200:
            print(f"Hata: HTTP {response.status_code}")
            return {"active_ipos": [], "draft_ipos": []}
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        active_ipos = []
        draft_ipos = []
        
        # Halka arz kartlarını bul
        ipo_cards = soup.find_all('div', class_='ipo-card') or soup.find_all('article')
        
        if not ipo_cards:
            # Alternatif: tüm linkleri tara
            links = soup.find_all('a', href=re.compile(r'/halka-arz/[^/]+/$'))
            print(f"Found {len(links)} IPO links")
            
            for link in links[:10]:  # İlk 10 tanesi
                ipo_name = link.get_text(strip=True)
                ipo_url = link.get('href')
                
                if not ipo_url.startswith('http'):
                    ipo_url = f"https://www.piapiri.com{ipo_url}"
                
                # Basit IPO objesi
                ipo = {
                    "company": ipo_name,
                    "code": "",
                    "price": 0,
                    "dates": "Belirlenmedi",
                    "status": "active",
                    "link": ipo_url
                }
                
                active_ipos.append(ipo)
        
        result = {
            "active_ipos": active_ipos,
            "draft_ipos": draft_ipos
        }
        
        # UTF-8 ile kaydet
        with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"✓ {len(active_ipos)} aktif, {len(draft_ipos)} geçmiş halka arz kaydedildi")
        return result
        
    except Exception as e:
        print(f"Hata: {e}")
        # Boş dosya oluştur
        empty = {"active_ipos": [], "draft_ipos": []}
        with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
            json.dump(empty, f, ensure_ascii=False, indent=2)
        return empty

if __name__ == "__main__":
    fetch_piapiri_ipos()
