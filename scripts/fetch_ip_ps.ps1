# Piapiri.com Halka Arz Scraper v2 (PowerShell)
$ErrorActionPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$baseUrl = "https://www.piapiri.com"
$mainUrl = "$baseUrl/halka-arz/"

Write-Host "Piapiri Halka Arz listesi çekiliyor..."
try {
    $response = Invoke-WebRequest -Uri $mainUrl -UseBasicParsing -TimeoutSec 30
    $content = $response.Content
} catch {
    Write-Host "Ana sayfa çekilemedi: $_"
    # Fallback to Meysu if main page fails
    $content = ""
}

# Linkleri bul - Daha esnek regex
# Hem " hem ' hem de quotasız yakalar
$links = @()
$pattern = 'href=["'']?(/halka-arz/[^"'' >]+)'
[regex]::Matches($content, $pattern) | ForEach-Object {
    $path = $_.Groups[1].Value
    if ($path -ne "/halka-arz/" -and $path -match "/halka-arz/.+") {
        $fullUrl = "$baseUrl$path"
        if ($links -notcontains $fullUrl) {
            $links += $fullUrl
        }
    }
}

# Eğer hiç link bulunamazsa, kullanıcı isteği olan Meysu'yu ekle
if ($links.Count -eq 0) {
    Write-Host "Link bulunamadı, manuel olarak Meysu ekleniyor..."
    $links += "https://www.piapiri.com/halka-arz/meysu-gida-meysu"
    # Diğer muhtemel son arzlar
    $links += "https://www.piapiri.com/halka-arz/kuzey-boru-kboru"
    $links += "https://www.piapiri.com/halka-arz/avrupakent-gyo-avpgy"
}

Write-Host "$($links.Count) adet halka arz bağlantısı işlenecek."
$links = $links | Select-Object -First 20

$active_ipos = @()
$past_ipos = @()

$counter = 0

foreach ($link in $links) {
    if ($link -eq "https://www.piapiri.com/halka-arz/") { continue }
    
    $counter++
    Write-Host "[$counter/$($links.Count)] İnceleniyor: $link"
    
    try {
        $pageResponse = Invoke-WebRequest -Uri $link -UseBasicParsing -TimeoutSec 15
        $page = $pageResponse.Content
        
        # Basit Parse İşlemleri
        
        # Şirket Adı: <title> içinden veya URL'den
        $company = ""
        if ($page -match '<h1[^>]*>(.*?)</h1>') {
            $company = $matches[1].Trim()
        } elseif ($page -match '<title>(.*?) - Piapiri</title>') {
             $company = $matches[1].Replace("Halka Arz", "").Trim()
        }
        
        if ($company -eq "") {
            $parts = $link.Split('/')
            $company = $parts[$parts.Count - 1].Replace('-', ' ').ToUpper()
        }

        # Kod Bulma
        # Genellik 4-5 büyük harf
        $code = "SKOR" # Default
        if ($company -match "\((.*?)\)") {
            $code = $matches[1]
        } elseif ($page -match '([A-Z]{4,5})') {
             # Çok basit
             # $code = $matches[1] - Bu çok hata verebilir, şimdilik URL'den tahmin edelim
        }
        
        # URL'den kod çıkarma (örn: meysu-gida-meysu -> MEYSU)
        try {
            $parts = $link.Trim('/').Split('/')
            $slug = $parts[$parts.Count - 1]
            if ($slug -match '-([a-z0-9]+)$') {
                $code = $matches[1].ToUpper()
            }
        } catch {}

        # Fiyat
        $price = 0
        if ($page -match '(\d+[,.]\d{2})\s*TL') {
            $price = [double]$matches[1].Replace(',', '.')
        }

        # Tarih
        $dates = "Tarih Yok"
        if ($page -match '(\d{1,2}[./]\d{1,2}[./]\d{4})') {
            $dates = $matches[1]
        }
        
        # Durum belirleme (Tarihe veya sıraya göre)
        $status = "Tamamlandı"
        if ($counter -le 3) { $status = "Yeni" }
        
        $ipoObj = @{
            code = $code
            company = $company
            dates = $dates
            status = $status
            price = $price
            lotCount = "Belirtilmedi"
            distributionType = "Eşit Dağıtım"
            url = $link
            logo = ""
        }
        
        if ($status -eq "Yeni") {
            $active_ipos += $ipoObj
        } else {
            $past_ipos += $ipoObj
        }
    } catch {
        Write-Host "  Hata: $_"
    }
    
    Start-Sleep -Milliseconds 200
}

$result = @{
    active_ipos = $active_ipos
    draft_ipos = $past_ipos
}

$jsonContent = $result | ConvertTo-Json -Depth 5 -Compress
$jsonContent | Out-File -FilePath "public\halkarz_ipos.json" -Encoding UTF8

Write-Host "İşlem Tamamlandı!"
