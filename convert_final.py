#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import sys
import codecs

# UTF-8 encoding için
if sys.stdout.encoding != 'utf-8':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

try:
    # Piapiri verilerini yükle
    with open('public/piapiri_ipos.json', 'r', encoding='utf-8') as f:
        piapiri_data = json.load(f)
    
    active_ipos = []
    draft_ipos = []
    
    # Tüm verileri dönüştür
    for item in piapiri_data:
        company = item.get('company', '')
        status = item.get('status', 'Taslak')
        
        # Code çıkar
        code = ''
        if '(' in company and ')' in company:
            code = company.split('(')[-1].replace(')', '').strip()
        
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
        if status in ['Talep Toplanıyor', 'Yeni', 'Onaylı', 'Başvuru Sürecinde']:
            active_ipos.append(ipo_item)
        else:
            draft_ipos.append(ipo_item)
    
    result = {
        "active_ipos": active_ipos,
        "draft_ipos": draft_ipos
    }
    
    # Kaydet
    with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    # Sonuç yazdır
    print(f"BASARILI: Aktif={len(active_ipos)}, Taslak={len(draft_ipos)}, Toplam={len(piapiri_data)}")
    sys.exit(0)

except Exception as e:
    print(f"HATA: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
