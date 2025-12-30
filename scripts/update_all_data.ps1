# YatirimX - Tüm Verileri Güncelleme (Manuel Test)
# Hedef Fiyat, Temettü ve Halka Arz verilerini günceller

Write-Host "="*60
Write-Host "YatirimX - Veri Güncelleme"
Write-Host "="*60

# 1. Hedef Fiyatlar
Write-Host "`n[1/3] Hedef fiyatlar güncelleniyor..."
try {
    $url = "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json"
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $data = $response.Content | ConvertFrom-Json
    $data | ConvertTo-Json -Depth 10 | Out-File "public\halkarz_target_prices.json" -Encoding UTF8
    Write-Host "  ✓ $($data.Count) hedef fiyat kaydı güncellendi"
} catch {
    Write-Host "  ✗ Hata: $($_.Exception.Message)"
}

# 2. Temettü
Write-Host "`n[2/3] Temettü verileri güncelleniyor..."
try {
    $url = "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json"
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    $data = $response.Content | ConvertFrom-Json
    $data | ConvertTo-Json -Depth 10 | Out-File "public\temettu.json" -Encoding UTF8
    Write-Host "  ✓ $($data.Count) temettü kaydı güncellendi"
} catch {
    Write-Host "  ✗ Hata: $($_.Exception.Message)"
}



Write-Host "`n" + "="*60
Write-Host "Güncelleme tamamlandı!"
Write-Host "="*60
