# JSON Format Düzeltici
# "value" property'si içine gömülmüş array'leri dışarı çıkarır

function Fix-JsonFile {
    param (
        [string]$FilePath
    )

    if (Test-Path $FilePath) {
        Write-Host "İşleniyor: $FilePath"
        try {
            $content = Get-Content $FilePath -Raw | ConvertFrom-Json
            
            # Eğer 'value' property'si varsa ve bir array ise, onu al
            if ($content.PSObject.Properties.Match('value')) {
                Write-Host "  -> 'value' property bulundu, array dışarı çıkarılıyor..."
                $cleanData = $content.value
                $cleanData | ConvertTo-Json -Depth 10 | Out-File $FilePath -Encoding UTF8
                Write-Host "  -> Düzeltildi!"
            } 
            # Eğer 'Content' property'si varsa (bazen Invoke-WebRequest yapar)
            elseif ($content.PSObject.Properties.Match('Content')) {
                 Write-Host "  -> 'Content' property bulundu, düzeltiliyor..."
                 $cleanData = $content.Content
                 # Bazen Content string olarak gelir, tekrar parse etmek gerekebilir
                 if ($cleanData -is [string]) {
                     try { $cleanData = $cleanData | ConvertFrom-Json } catch {}
                 }
                 $cleanData | ConvertTo-Json -Depth 10 | Out-File $FilePath -Encoding UTF8
                 Write-Host "  -> Düzeltildi!"
            }
            else {
                Write-Host "  -> Zaten düzgün formatta veya 'value'/'Content' bulunamadı."
            }
        }
        catch {
            Write-Host "  -> HATA: $_"
        }
    } else {
        Write-Host "Dosya bulunamadı: $FilePath"
    }
}

# Hedef Fiyat
Fix-JsonFile "public\halkarz_target_prices.json"

# Temettü
Fix-JsonFile "public\temettu.json"

Write-Host "İşlem Tamamlandı."
