import requests
import json

def fetch_halkarz_ipos():
    """
    Halkaarz.com'dan IPO verilerini çeker (UTF-8 encoding ile).
    """
    url = "https://halkarz.com/api/halka-arz"
    
    try:
        response = requests.get(url, timeout=15)
        response.encoding = 'utf-8'
        
        if response.status_code != 200:
            print(f"Hata: HTTP {response.status_code}")
            return create_empty()
        
        data = response.json()
        
        # API'den gelen veriyi kontrol et
        if isinstance(data, dict):
            # Eğer value içindeyse çıkar
            if 'value' in data:
                data = data['value']
            elif 'Content' in data:
                data = data['Content']
        
        # Veriyi kaydet  
        # Halkaarz.com'dan gelen "active" verilerini "draft_ipos" (Taslak Arzlar) olarak kaydet
        result = {
            "active_ipos": [],  # Gerçek halka arzlar (şimdilik boş)
            "draft_ipos": data.get('active_ipos', []) if isinstance(data, dict) else []
        }
        
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
