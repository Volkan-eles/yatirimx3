"""
Halkarz.com scraper - WordPress site yapısını kullanarak veri çeker
"""
import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_halkarz():
    """Ana scraper fonksiyonu"""
    
    print("=" * 70)
    print(" Halkarz.com Halka Arz Verileri Çekiliyor".center(70))
    print("=" * 70)
    
    active_ipos = []
    draft_ipos = []
    
    try:
        # 1. Ana sayfadan linkleri çek
        print("\n[1/3] Ana sayfa yükleniyor...")
        url = "https://halkarz.com/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=20)
        response.raise_for_status()
        response.encoding = 'utf-8'
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 2. Şirket linklerini bul
        print("[2/3] Halka arz linkleri aranıyor...")
        
        # Halkarz.com'da şirketlerin linkleri genelde tek kelimelik path'lerde
        all_links = soup.find_all('a', href=True)
        
        company_links = []
        for link in all_links:
            href = link.get('href', '')
            
            # Şirket linklerini filtrele
            # Format: https://halkarz.com/şirket-adı/ veya /şirket-adı/
            if re.match(r'^https://halkarz\.com/[a-z0-9-]+/$', href) or \
               re.match(r'^/[a-z0-9-]+/$', href):
                
                # Gereksiz sayfaları çıkar
                ignore_list = [
                    '/halka-arz/', '/taslak-arzlar/', '/hakkimizda/',
                    '/iletisim/', '/gizlilik-politikasi/', '/cerez-politikasi/', 
                    '/kullanim-kosullari/', '/bist-100/', '/bist-30/'
                ]
                
                if href in ignore_list or href == '/':
                    continue
                
                # Tam URL'ye çevir
                if href.startswith('/'):
                    href = 'https://halkarz.com' + href
                
                company_name = link.get_text(strip=True)
                
                if company_name and len(company_name) > 2:
                    company_links.append({
                        'url': href,
                        'name': company_name
                    })
        
        # Unique linkleri al
        seen = set()
        unique_links = []
        for link in company_links:
            if link['url'] not in seen:
                seen.add(link['url'])
                unique_links.append(link)
        
        print(f"   ✓ {len(unique_links)} benzersiz şirket linki bulundu")
        
        # 3. Her şirket için veri oluştur
        print("[3/3] Halka arz verileri oluşturuluyor...")
        
        for i, link in enumerate(unique_links[:50], 1):  # İlk 50 ile sınırla
            company_name = link['name']
            
            # Code'u şirket adından çıkarmaya çalış
            code = ''
            if '(' in company_name and ')' in company_name:
                code = company_name[company_name.rfind('(')+1:company_name.rfind(')')].strip()
            
            ipo_data = {
                "code": code,
                "company": company_name,
                "dates": "",
                "status": "Taslak",
                "price": "Belirlenmedi",
                "lotCount": "Bilgi Yok",
                "distributionType": "Belirtilmemiş",
                "url": link['url']
            }
            
            # Aktif/taslak ayrımı için basit kontrol
            # "Talep" kelimesi içeriyorsa veya tarih var gibi görünüyorsa aktif
            if 'talep' in company_name.lower() or re.search(r'\d{1,2}[-/]\d{1,2}', company_name):
                ipo_data['status'] = 'Talep Toplanıyor'
                active_ipos.append(ipo_data)
            else:
                draft_ipos.append(ipo_data)
            
            if i % 10 == 0:
                print(f"   İşlenen: {i}/{min(len(unique_links), 50)}")
        
        print(f"\n✅ Toplam {len(active_ipos)} aktif, {len(draft_ipos)} taslak halka arz")
        
    except requests.RequestException as e:
        print(f"\n❌ Bağlantı hatası: {e}")
        print("⚠️  Mevcut veriler korunuyor...")
        return load_existing_data()
    
    except Exception as e:
        print(f"\n❌ Genel hata: {e}")
        import traceback
        traceback.print_exc()
        return load_existing_data()
    
    # Sonuçları kaydet
    result = {
        "active_ipos": active_ipos,
        "draft_ipos": draft_ipos
    }
    
    try:
        with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Veriler kaydedildi: public/halkarz_ipos.json")
    except Exception as e:
        print(f"\n❌ Kayıt hatası: {e}")
    
    print("=" * 70)
    return result

def load_existing_data():
    """Mevcut veriyi yükle"""
    try:
        with open('public/halkarz_ipos.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return {"active_ipos": [], "draft_ipos": []}

if __name__ == "__main__":
    scrape_halkarz()
