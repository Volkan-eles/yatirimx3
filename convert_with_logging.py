import json
import sys
import traceback
from pathlib import Path

# Log dosyası
log_file = Path('conversion_log.txt')

def log(msg):
    """Hem console hem de dosyaya yaz"""
    print(msg)
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(msg + '\n')

try:
    # Log dosyasını temizle
    if log_file.exists():
        log_file.unlink()
    
    log("=" * 70)
    log("HALKA ARZ VERİLERİ DÖNÜŞTÜRME")
    log("=" * 70)
    
    # Piapiri verilerini oku
    log("\n[1/4] Piapiri verileri okunuyor...")
    piapiri_path = Path('public/piapiri_ipos.json')
    
    if not piapiri_path.exists():
        raise FileNotFoundError(f"Dosya bulunamadı: {piapiri_path}")
    
    with open(piapiri_path, 'r', encoding='utf-8') as f:
        piapiri_data = json.load(f)
    
    log(f"   ✓ {len(piapiri_data)} halka arz kaydı yüklendi")
    
    # Dönüştür
    log("\n[2/4] Veriler dönüştürülüyor...")
    active_ipos = []
    draft_ipos = []
    
    active_statuses = {'Talep Toplanıyor', 'Yeni', 'Onaylı', 'Başvuru Sürecinde'}
    
    for idx, item in enumerate(piapiri_data, 1):
        try:
            company = item.get('company', '')
            status = item.get('status', 'Taslak')
            
            # Code çıkar
            code = ''
            if '(' in company and ')' in company:
                parts = company.rsplit('(', 1)
                if len(parts) == 2:
                    code = parts[1].replace(')', '').strip()
            
            ipo_item = {
                "code": code,
                "company": company,
                "dates": item.get('date', ''),
                "status": status if status else 'Taslak',
                "price": item.get('price', '') if item.get('price', '') else 'Belirlenmedi',
                "lotCount": "Bilgi Yok",
                "distributionType": "Belirtilmemiş"
            }
            
            # Kategorize et
            if status in active_statuses:
                active_ipos.append(ipo_item)
            else:
                draft_ipos.append(ipo_item)
            
            if idx % 100 == 0:
                log(f"   İşlenen: {idx}/{len(piapiri_data)}")
        
        except Exception as e:
            log(f"   UYARI: {idx}. kayıt işlenirken hata: {e}")
            continue
    
    log(f"   ✓ Toplam {idx} kayıt işlendi")
    log(f"   • Aktif: {len(active_ipos)}")
    log(f"   • Taslak: {len(draft_ipos)}")
    
    # JSON oluştur
    log("\n[3/4] JSON oluşturuluyor...")
    result = {
        "active_ipos": active_ipos,
        "draft_ipos": draft_ipos
    }
    
    # Kaydet
    log("\n[4/4] Dosya kaydediliyor...")
    output_path = Path('public/halkarz_ipos.json')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    # Doğrulama
    file_size = output_path.stat().st_size
    log(f"   ✓ Kaydedildi: {output_path}")
    log(f"   • Dosya boyutu: {file_size:,} bayt")
    
    log("\n" + "=" * 70)
    log("✅ BAŞARILI!")
    log(f"Toplam: {len(piapiri_data)} kayıt")
    log(f"Aktif Halka Arzlar: {len(active_ipos)}")
    log(f"Taslak Halka Arzlar: {len(draft_ipos)}")
    log("=" * 70)
    
    sys.exit(0)

except Exception as e:
    log(f"\n❌ HATA: {str(e)}")
    log("\nDetaylı hata:")
    log(traceback.format_exc())
    sys.exit(1)
