#!/usr/bin/env python3
"""
Piapiri.com Halka Arz Scraper
Fetches current and past IPO data from piapiri.com
"""
import requests
from bs4 import BeautifulSoup
import json
import os
import sys
from datetime import datetime

def log(msg):
    """Log with timestamp"""
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] {msg}")
    sys.stdout.flush()

def scrape_piapiri_ipos():
    """Scrape IPO data from Piapiri.com"""
    base_url = "https://www.piapiri.com"
    
    # Two pages: current IPOs and past IPOs
    current_url = f"{base_url}/halka-arz/"
    past_url = f"{base_url}/halka-arz/gecmis-halka-arzlar/" if False else current_url  # Use same for now
    
    log("Starting Piapiri IPO Scraper")
    log(f"Fetching from {current_url}")
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }
        
        # Fetch main page
        response = requests.get(current_url, headers=headers, timeout=15)
        log(f"Response status: {response.status_code}")
        
        if not response.ok:
            raise Exception(f"HTTP {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all IPO cards/links
        ipo_links = set()
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Look for IPO detail pages
            if '/halka-arz/' in href and href.count('/') >= 3:
                full_url = href if href.startswith('http') else f"{base_url}{href}"
                ipo_links.add(full_url)
        
        log(f"Found {len(ipo_links)} unique IPO links")
        
        # For now, treat first 10 as current, rest as past
        # In production, you'd check status/date to categorize
        ipo_list = list(ipo_links)[:20]  # Limit to 20 total
        
        active_ipos = []
        past_ipos = []
        
        for idx, ipo_url in enumerate(ipo_list, 1):
            log(f"[{idx}/{len(ipo_list)}] Fetching {ipo_url}")
            
            try:
                ipo_data = scrape_ipo_detail(ipo_url, headers)
                if ipo_data:
                    # Categorize based on status or date
                    # For now: first 5 = active, rest = past
                    if idx <= 5:
                        active_ipos.append(ipo_data)
                    else:
                        past_ipos.append(ipo_data)
            except Exception as e:
                log(f"  Error: {e}")
                continue
        
        # Save results
        result = {
            "active_ipos": active_ipos,
            "draft_ipos": past_ipos  # Using draft_ipos for past IPOs
        }
        
        os.makedirs('public', exist_ok=True)
        output_path = 'public/halkarz_ipos.json'
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        log(f"✓ Saved {len(active_ipos)} current and {len(past_ipos)} past IPOs")
        log(f"✓ File: {output_path}")
        return True
        
    except Exception as e:
        log(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        
        # Save empty result
        result = {"active_ipos": [], "draft_ipos": []}
        os.makedirs('public', exist_ok=True)
        with open('public/halkarz_ipos.json', 'w', encoding='utf-8') as f:
            json.dump(result, f)
        log("Created empty fallback file")
        return False

def scrape_ipo_detail(url, headers):
    """Scrape individual IPO page"""
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract company name
    title = soup.find('h1')
    company = title.get_text(strip=True) if title else url.split('/')[-2].replace('-', ' ').title()
    
    # Extract code
    code = "N/A"
    for elem in soup.find_all(['span', 'strong', 'b', 'div']):
        text = elem.get_text(strip=True)
        # Look for uppercase codes 3-6 chars
        if text.isupper() and 3 <= len(text) <= 6 and text.isalpha():
            code = text
            break
    
    # Extract other data
    dates = "Tarih Yok"
    price = 0
    status = "Tamamlandı"
    
    # Look for data in text
    text_content = soup.get_text()
    
    # Try to find price
    import re
    price_match = re.search(r'(\d+[.,]\d+)\s*TL', text_content)
    if price_match:
        try:
            price = float(price_match.group(1).replace(',', '.'))
        except:
            pass
    
    # Try to find dates
    date_match = re.search(r'(\d{1,2}[./]\d{1,2}[./]\d{2,4})', text_content)
    if date_match:
        dates = date_match.group(1)
    
    return {
        "code": code,
        "company": company,
        "dates": dates,
        "status": status,
        "price": price,
        "lotCount": "Belirtilmedi",
        "distributionType": "Belirtilmedi",
        "url": url,
        "logo": ""
    }

if __name__ == "__main__":
    log("="*60)
    log("PIAPIRI IPO SCRAPER")
    log("="*60)
    success = scrape_piapiri_ipos()
    sys.exit(0 if success else 1)

