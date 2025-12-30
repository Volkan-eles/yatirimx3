@echo off
REM YatirimX - Veri Güncelleme Batch Dosyası
REM Çift tıklayarak çalıştırabilirsiniz

echo ============================================================
echo YatirimX - Veri Güncelleme
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/3] Hedef fiyatlar güncelleniyor...
powershell -Command "$url = 'https://halkarz.com/wp-content/themes/halkarz/json/hedef-fiyat.json'; Invoke-WebRequest -Uri $url -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Out-File 'public\halkarz_target_prices.json' -Encoding UTF8; Write-Host '  OK - Hedef fiyatlar güncellendi'"

echo.
echo [2/3] Temettü verileri güncelleniyor...
powershell -Command "$url = 'https://halkarz.com/wp-content/themes/halkarz/json/temettu.json'; Invoke-WebRequest -Uri $url -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 10 | Out-File 'public\temettu.json' -Encoding UTF8; Write-Host '  OK - Temettü verileri güncellendi'"

echo.
echo [3/3] Halka arz verileri güncelleniyor (Piapiri)...
powershell -ExecutionPolicy Bypass -File "scripts\fetch_ip_ps.ps1"
if %ERRORLEVEL% EQU 0 (
    echo   OK - Halka arz verileri güncellendi
) else (
    echo   UYARI - Halka arz güncellemesinde sorun olabilir
)

echo.
echo ============================================================
echo Güncelleme tamamlandı!
echo ============================================================
echo.
pause
