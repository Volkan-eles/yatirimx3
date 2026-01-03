import json

# Piapiri verilerin tamamını yükle
with open('piapiri_ipos.json', 'r', encoding='utf-8') as f:
    piapiri_data = json.load(f)

active_ipos = []
draft_ipos = []

# Tüm verileri dönüştür
for item in piapiri_data:
    company = item.get('company', '')
    status = item.get('status', 'Taslak')
    
    # Code'u çıkar
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
with open('halkarz_ipos.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Aktif: {len(active_ipos)}, Taslak: {len(draft_ipos)}, Toplam: {len(piapiri_data)}")
