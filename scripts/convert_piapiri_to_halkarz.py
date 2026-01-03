import json

print("=" * 70)
print(" Tüm Piapiri Verileri Halkarz Formatına Dönüştürülüyor".center(70))
print("=" * 70)

# Load piapiri data
print("\n[1/3] Piapiri verileri yükleniyor...")
with open('public/piapiri_ipos.json', 'r', encoding='utf-8') as f:
    piapiri_data = json.load(f)

print(f"   ✓ {len(piapiri_data)} halka arz verisi bulundu")

# Convert to halkarz format
print("\n[2/3] Veriler dönüştürülüyor...")
active_ipos = []
draft_ipos = []

for idx, item in enumerate(piapiri_data, 1):
    company = item.get('company', '')
    status = item.get('status', 'Taslak')
    
    # Extract code from company name if it contains parentheses
    code = ''
    if '(' in company and ')' in company:
        code = company.split('(')[-1].replace(')', '').strip()
    
    # Convert to halkarz format
    ipo_item = {
        "code": code,
        "company": company,
        "dates": item.get('date', ''),
        "status": status if status else 'Taslak',
        "price": item.get('price', 'Belirlenmedi'),
        "lotCount": "Bilgi Yok",
        "distributionType": "Belirtilmemiş"
    }
    
    # Categorize based on status
    # Aktif: Talep Toplanıyor, Yeni, Onaylı, Başvuru Sürecinde
    if status in ['Talep Toplanıyor', 'Yeni', 'Onaylı', 'Başvuru Sürecinde']:
        active_ipos.append(ipo_item)
    else:
        # Taslak, Ertelendi, ve diğer durumlar
        draft_ipos.append(ipo_item)
    
    if idx % 100 == 0:
        print(f"   İşlenen: {idx}/{len(piapiri_data)}")

print(f"   ✓ Dönüştürme tamamlandı")

result = {
    "active_ipos": active_ipos,
    "draft_ipos": draft_ipos
}

# Save to halkarz_ipos.json
print("\n[3/3] Veriler kaydediliyor...")
with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"   ✓ Kaydedildi: public/halkarz_ipos.json")

print("\n" + "=" * 70)
print(f"📊 ÖZET:")
print(f"   • Toplam Halka Arz: {len(piapiri_data)}")
print(f"   • Aktif/Başvuru Sürecinde: {len(active_ipos)}")
print(f"   • Taslak/Ertelendi: {len(draft_ipos)}")
print("=" * 70)
print("\n✅ Tüm veriler başarıyla aktarıldı!\n")
