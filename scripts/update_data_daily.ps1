# YatirimX - Günlük Veri Güncelleme Scripti
# Hedef Fiyat ve Temettü verilerini otomatik olarak günceller

$ErrorActionPreference = "Continue"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
$logFile = Join-Path $projectRoot "logs\data_update.log"

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

Write-Log "=== Veri Güncelleme Başladı ==="

try {
    # Hedef Fiyatları Güncelle
    Write-Log "Hedef fiyatlar çekiliyor..."
    $targetUrl = "https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json"
    $targetPath = Join-Path $projectRoot "public\halkarz_target_prices.json"
    
    $response = Invoke-WebRequest -Uri $targetUrl -UseBasicParsing -TimeoutSec 30
    $data = $response.Content | ConvertFrom-Json
    $itemCount = $data.Count
    
    $data | ConvertTo-Json -Depth 10 | Out-File -FilePath $targetPath -Encoding UTF8
    Write-Log "✓ Hedef fiyatlar güncellendi ($itemCount kayıt)"
    
} catch {
    Write-Log "✗ Hedef fiyat hatası: $($_.Exception.Message)"
}

try {
    # Temettü Verilerini Güncelle
    Write-Log "Temettü verileri çekiliyor..."
    $divUrl = "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json"
    $divPath = Join-Path $projectRoot "public\temettu.json"
    
    $response = Invoke-WebRequest -Uri $divUrl -UseBasicParsing -TimeoutSec 30
    $data = $response.Content | ConvertFrom-Json
    $itemCount = $data.Count
    
    $data | ConvertTo-Json -Depth 10 | Out-File -FilePath $divPath -Encoding UTF8
    Write-Log "✓ Temettü verileri güncellendi ($itemCount kayıt)"
    
} catch {
    Write-Log "✗ Temettü verisi hatası: $($_.Exception.Message)"
}

try {
    # Halka Arz Verilerini Güncelle
    Write-Log "Halka arz verileri çekiliyor..."
    $pythonScript = Join-Path $scriptPath "convert_piapiri_to_halkarz.py"
    
    python $pythonScript
    Write-Log "✓ Halka arz verileri güncellendi"
    
} catch {
    Write-Log "✗ Halka arz verisi hatası: $($_.Exception.Message)"
}

Write-Log "=== Veri Güncelleme Tamamlandı ===`n"
