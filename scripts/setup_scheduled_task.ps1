# Windows Task Scheduler Kurulum Scripti
# YatirimX için günlük otomatik veri güncelleme görevi oluşturur

$ErrorActionPreference = "Stop"

# Script yolları
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
$updateScript = Join-Path $projectRoot "scripts\update_data_daily.ps1"

# Task Scheduler ayarları
$taskName = "YatirimX Günlük Veri Güncelleme"
$taskDescription = "Hedef fiyat ve temettü verilerini her gün otomatik olarak günceller"
$taskTime = "02:00"  # Sabah 2:00

Write-Host "="*60
Write-Host "YatirimX - Task Scheduler Kurulumu"
Write-Host "="*60
Write-Host ""

# Mevcut görevi kontrol et
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "⚠️  Mevcut görev bulundu. Siliniyor..."
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

# Yeni görev oluştur
Write-Host "📅 Yeni görev oluşturuluyor..."

# Action: PowerShell scriptini çalıştır
$action = New-ScheduledTaskAction `
    -Execute "PowerShell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$updateScript`"" `
    -WorkingDirectory $projectRoot

# Trigger: Her gün sabah 2:00
$trigger = New-ScheduledTaskTrigger -Daily -At $taskTime

# Settings: Görev ayarları
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable

# Principal: Kullanıcı hesabı ile çalıştır
$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType S4U `
    -RunLevel Highest

# Görevi kaydet
Register-ScheduledTask `
    -TaskName $taskName `
    -Description $taskDescription `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal | Out-Null

Write-Host "✓ Görev başarıyla oluşturuldu!"
Write-Host ""
Write-Host "Görev Detayları:"
Write-Host "  İsim: $taskName"
Write-Host "  Çalışma Saati: Her gün $taskTime"
Write-Host "  Script: $updateScript"
Write-Host ""
Write-Host "Görevi kontrol etmek için:"
Write-Host "  Task Scheduler'ı açın (taskschd.msc)"
Write-Host "  veya PowerShell'de: Get-ScheduledTask -TaskName '$taskName'"
Write-Host ""
Write-Host "Görevi manuel çalıştırmak için:"
Write-Host "  Start-ScheduledTask -TaskName '$taskName'"
Write-Host ""
Write-Host "="*60
