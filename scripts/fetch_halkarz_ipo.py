
import requests
from bs4 import BeautifulSoup
import json
import re
import time
import os
import sys

# Headers to mimic a browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def clean_text(text):
    return ' '.join(text.split())

def clean_text(text):
    return ' '.join(text.split())

def fetch_details(link):
    try:
        response = requests.get(link, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Clean text
        content = soup.select_one('.entry-content, .post-content, article')
        if not content:
            print(f"DEBUG: Content NOT found for {link}")
            return {}
        
        # Normalize whitespace
        text = clean_text(content.get_text())
        title = soup.find('h1').get_text(strip=True) if soup.find('h1') else ''

        title = soup.find('h1').get_text(strip=True) if soup.find('h1') else ''

        # BeautifulSoup Extraction
        # Try to find data in the table first
        sp_table = soup.select_one('table.sp-table')
        
        price = 'Belirlenmedi'
        dates = 'Tarih Yok'
        distribution_type = 'Bilinmiyor'
        lot_count = 'Belirtilmedi'
        code = ''

        # Extract Code from header if available
        code_tag = soup.select_one('.il-bist-kod')
        if code_tag:
            code = code_tag.get_text(strip=True)
        
        if not code:
            # Fallback to Title Regex
            code_match = re.search(r'\(([A-Z]{3,5})\)', title)
            if code_match:
                code = code_match.group(1)

        if sp_table:
            for tr in sp_table.find_all('tr'):
                tds = tr.find_all('td')
                if len(tds) < 2: continue
                
                label = tds[0].get_text(strip=True)
                value = tds[1].get_text(strip=True)

                if 'Fiyat' in label:
                    price = value
                elif 'Tarih' in label:
                    dates = value
                elif 'Dağıtım' in label:
                    distribution_type = value
                elif 'Pay' in label:
                     lot_count = value

        # Clean up values
        if 'Hazırlanıyor' in dates:
            dates = 'Tarih Bekleniyor'
        
        # Fallback for draft pages which might structure data differently (e.g. lists)
        if price == 'Belirlenmedi':
             match = re.search(r'(?:Halka Arz Fiyatı|Fiyat).*?([\d,.]+)\s*TL', text, re.IGNORECASE)
             if match: price = match.group(1) + ' TL'

        return {
            'code': code,
            'price': price,
            'dates': dates,
            'distributionType': distribution_type,
            'lotCount': lot_count
        }

    except Exception as e:
    except Exception as e:
        # print(f"Error fetching detail for {link}: {e}")
        return {}

def fetch_ipos():
    output_path = 'public/halkarz_ipos.json'
    active_ipos = []
    draft_ipos = []

    try:
        print("Fetching Main Page (halkarz.com)...")
        response = requests.get('https://halkarz.com/', headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # 1. Active IPOs
        # Looking for recent posts that are not drafts
        active_links = []
        for article in soup.select('article, .post-item'):
            a_tag = article.find('a')
            if not a_tag: continue
            
            link = a_tag['href']
            title_tag = article.find(['h2', 'h3'])
            title = title_tag.get_text(strip=True) if title_tag else ''

            if link and 'halkarz.com' in link and 'Taslak' not in title:
                # Basic filtering to ensure it's a company
                if 'A.Ş.' in title or 'Holding' in title:
                    active_links.append({'title': title, 'link': link})

        # Process top 4 actives
        print(f"Found {len(active_links)} potential active IPOs. Processing top 4...")
        
        # Process top 4 actives
        print(f"Found {len(active_links)} potential active IPOs. Processing top 4...")
        
        for item in active_links[:4]:
            print(f"Processing Active: {item['title']}")
            details = fetch_details(item['link'])
            active_ipos.append({
                'company': item['title'],
                'link': item['link'],
                'status': 'Yeni',
                'code': details.get('code', ''),
                'price': details.get('price', 'Belirlenmedi'),
                'dates': details.get('dates', 'Tarih Yok'),
                'distributionType': details.get('distributionType', 'Bilinmiyor'),
                'lotCount': details.get('lotCount', 'Belirtilmedi')
            })
            time.sleep(0.5)

        # 2. Draft IPOs
        print("Fetching Draft Page (halkarz.com/k/taslak/)...")
        print("Fetching Draft Page (halkarz.com/k/taslak/)...")
        response = requests.get('https://halkarz.com/k/taslak/', headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        draft_links = []
        for article in soup.select('article, .post-item'):
            a_tag = article.find('a')
            if not a_tag: continue
            
            link = a_tag['href']
            title_tag = article.find(['h2', 'h3'])
            title = title_tag.get_text(strip=True) if title_tag else ''

            if link and title:
                # Avoid duplicates
                if not any(d['link'] == link for d in draft_ipos):
                    draft_links.append({'title': title, 'link': link})

        # Process top 5 drafts (reduced for debug speed)
        print(f"Found {len(draft_links)} Draft IPOs. Processing top 5 for debug...")
        for item in draft_links[:5]:
            print(f"Processing Draft: {item['title']}")
            details = fetch_details(item['link'])
            draft_ipos.append({
                'company': item['title'],
                'link': item['link'],
                'status': 'Taslak',
                'code': details.get('code', ''),
                'price': details.get('price', 'Belirlenmedi'),
                'dates': details.get('dates', 'Tarih Bekleniyor'),
                'distributionType': details.get('distributionType', 'Bilinmiyor'),
                'lotCount': details.get('lotCount', 'Belirtilmedi')
            })
            time.sleep(0.5)

        # Save to JSON
        data = {
            'active_ipos': active_ipos,
            'draft_ipos': draft_ipos
        }

        # Write with UTF-8 encoding
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Saved {len(active_ipos)} Active and {len(draft_ipos)} Draft IPOs to {output_path}")


    except Exception as e:
        print(f"Error in fetch_ipos: {e}")

if __name__ == "__main__":
    # Ensure stdout is utf-8 to avoid encoding errors in console
    sys.stdout.reconfigure(encoding='utf-8')
    fetch_ipos()
