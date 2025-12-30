# YatirimX Otomatik Veri Güncelleme Kılavuzu

## Günlük Otomatik Güncelleme

### Yöntem 1: Manuel Çalıştırma (Önerilen - Test için)

PowerShell'i açın ve şu komutları çalıştırın:

```powershell
# Proje klasörüne gidin
cd "c:\Users\vlkne\OneDrive\Desktop\yatirimx---finans-&-analiz"

# Hedef Fiyatları Güncelle
$url = "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json"
Invoke-WebRequest -Uri $url -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Out-File "public\halkarz_target_prices.json" -Encoding UTF8

# Temettü Verilerini Güncelle
$url = "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json"
Invoke-WebRequest -Uri $url -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Out-File "public\temettu.json" -Encoding UTF8

# Halka Arz Verilerini Güncelle (Piapiri)
python scripts\fetch_piapiri_ipos.py

Write-Host "Tüm veriler güncellendi!"
```

### Yöntem 2: Batch Dosyası (Çift tıkla çalıştır)

`update_data.bat` dosyası oluşturuldu. Çift tıklayarak çalıştırabilirsiniz.

### Yöntem 3: Windows Task Scheduler (Otomatik)

1. **Task Scheduler'ı Açın**:
   - Windows tuşu + R
   - `taskschd.msc` yazın
   - Enter

2. **Yeni Görev Oluşturun**:
   - Sağ panel: "Create Basic Task"
   - İsim: "YatirimX Günlük Veri Güncelleme"
   - Açıklama: "Hedef fiyat ve temettü verilerini günceller"

3. **Trigger (Tetikleyici)**:
   - Daily (Günlük)
   - Saat: 02:00 (Sabah 2:00)
   - Start date: Bugün

4. **Action (Eylem)**:
   - Start a program
   - Program/script: `C:\Users\vlkne\OneDrive\Desktop\yatirimx---finans-&-analiz\update_data.bat`
   - Start in: `C:\Users\vlkne\OneDrive\Desktop\yatirimx---finans-&-analiz`

5. **Finish** - Görevi kaydedin

## Veri Kaynakları

- **Hedef Fiyat**: https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json
- **Temettü**: https://halkarz.com/wp-content/themes/halkarz/json/temettu.json
- **Halka Arz**: https://www.piapiri.com/halka-arz/ (scraper ile)

## Sorun Giderme

### Veri güncellenmiyor
- İnternet bağlantınızı kontrol edin
- Kaynak sitelerin erişilebilir olduğunu kontrol edin
- Log dosyasını kontrol edin: `logs\data_update.log`

### Python scraper çalışmıyor
- Python'un yüklü olduğundan emin olun: `python --version`
- BeautifulSoup yüklü olmalı: `pip install beautifulsoup4 requests`

### Task Scheduler görevi çalışmıyor
- Görevin "Enabled" olduğundan emin olun
- "Run whether user is logged on or not" seçeneğini deneyin
- "Run with highest privileges" seçeneğini işaretleyin
