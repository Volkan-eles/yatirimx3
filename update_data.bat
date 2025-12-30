@echo off
REM YatirimX - Veri Güncelleme Batch Dosyası
REM Çift tıklayarak çalıştırabilirsiniz
@echo off
chcp 65001 >nul
echo ============================================================
echo YATIRIMX - GUNLUK VERI GUNCELLEME
echo ============================================================
echo.
echo [1/3] Hedef Fiyat ve Temettu verileri indiriliyor...
node scripts/fetch_all_data.js
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Veriler basariyla indirildi
) else (
    echo   ✗ Veri indirmede sorun oluştu
)


if %ERRORLEVEL% EQU 0 (
    echo   ✓ Veri formatlari duzeltildi
) else (
    echo   ✗ Format duzeltmede sorun oluştu
)


echo.
echo ============================================================
echo Güncelleme tamamlandı!
echo ============================================================
echo.
pause
