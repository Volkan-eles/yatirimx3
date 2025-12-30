import requests
import json
import sys

def log(msg):
    """Log to file since console output is suppressed"""
    with open('ipo_fetch.log', 'a', encoding='utf-8') as f:
        f.write(f"{msg}\n")
    print(msg)

def fetch_halkarz_ipos():
    """
    Halkaarz.com'dan IPO verilerini çeker (UTF-8 encoding ile).
    """
    url = "https://halkarz.com/api/halka-arz"
    
    try:
        log(f"Fetching from: {url}")
        response = requests.get(url, timeout=15)
        response.encoding = 'utf-8'
        
        log(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            log(f"Hata: HTTP {response.status_code}")
            return create_empty()
        
        data = response.json()
        log(f"Data type: {type(data)}")
        log(f"Data keys: {data.keys() if isinstance(data, dict) else 'Not a dict'}")
        
        # API'den gelen veriyi kontrol et
        if isinstance(data, dict):
            # Eğer value içindeyse çıkar
            if 'value' in data:
                data = data['value']
                log(f"Unwrapped 'value', new length: {len(data) if isinstance(data, list) else 'not a list'}")
            elif 'Content' in data:
                data = data['Content']
                log(f"Unwrapped 'Content'")
        
        # Veriyi kaydet  
        # Halkaarz.com'dan gelen "active" verilerini "draft_ipos" (Taslak Arzlar) olarak kaydet
        result = {
            "active_ipos": [],  # Gerçek halka arzlar (şimdilik boş)
            "draft_ipos": data.get('active_ipos', []) if isinstance(data, dict) else []
        }
        
        log(f"Result - active: {len(result['active_ipos'])}, draft: {len(result['draft_ipos'])}")
        
        with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Halka arz verileri kaydedildi")
        return data
        
    except Exception as e:
        print(f"Hata: {e}")
        import traceback
        traceback.print_exc()
        return create_empty()

def create_empty():
    empty = {"active_ipos": [], "draft_ipos": []}
    with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
        json.dump(empty, f, ensure_ascii=False, indent=2)
    return empty

if __name__ == "__main__":
    result = fetch_halkarz_ipos()
    print("\n✓ Tamamlandı")
