import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

print("BIST hisse verilerini çekiyorum...")

# Borsa Istanbul'dan veri çek
url = "https://www.getmidas.com/canli-borsa/"

try:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Hisse verilerini bul
    stocks = []
    
    # Tablo satırlarını bul
    rows = soup.find_all('tr', class_=['even', 'odd'])
    
    print(f"Bulunan satır sayısı: {len(rows)}")
    
    for row in rows[:100]:  # İlk 100 hisse
        try:
            cols = row.find_all('td')
            if len(cols) >= 6:
                code = cols[0].get_text(strip=True)
                price_text = cols[1].get_text(strip=True).replace(',', '.')
                change_text = cols[2].get_text(strip=True).replace(',', '.')
                change_pct = cols[3].get_text(strip=True).replace('%', '').replace(',', '.')
                volume = cols[4].get_text(strip=True)
                
                # Fiyatı parse et
                try:
                    price = float(price_text)
                    change_rate = float(change_pct)
                    
                    stocks.append({
                        'code': code,
                        'name': code,  # İsim için ayrı bir kaynak gerekebilir
                        'price': price,
                        'change': float(change_text) if change_text else 0,
                        'changeRate': change_rate,
                        'volume': volume,
                        'sector': 'BIST'
                    })
                    print(f"✓ {code}: {price} TL ({change_rate:+.2f}%)")
                except ValueError:
                    continue
        except Exception as e:
            continue
    
    # JSON'a kaydet
    output = {
        'last_update': datetime.now().isoformat(),
        'source': 'getmidas.com',
        'total_stocks': len(stocks),
        'stocks': stocks
    }
    
    with open('public/bist_live_data.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Başarılı! {len(stocks)} hisse verisi kaydedildi.")
    print(f"📁 Dosya: public/bist_live_data.json")
    
except Exception as e:
    print(f"❌ Hata: {e}")
    print("\nAlternatif olarak mevcut JSON verilerini kullanıyoruz...")
