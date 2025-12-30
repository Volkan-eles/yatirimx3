
import requests
from bs4 import BeautifulSoup
import json
import re
import time
import os

# Headers to mimic a browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def fetch_details(link):
    try:
        response = requests.get(link, headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Clean text
        content = soup.select_one('.entry-content, .post-content, article')
        if not content:
            return {}
        
        # Normalize whitespace
        text = ' '.join(content.get_text(separator=' ').split())
        title = soup.find('h1').get_text(strip=True) if soup.find('h1') else ''

        # Regex Patterns
        code_regex = r'\(([A-Z]{3,5})\)'
        price_regex = r'(?:Halka Arz Fiyatı|Fiyat).*?([\d,.]+)\s*TL'
        date_regex = r'(?:Tarih|Talep Toplama).*?(\d{1,2}.*?\d{4})'
        draft_date_regex = r'(?:Takvimi).*?(\d{4}.*?)(?:\n|$|[*])'
        lot_regex = r'(?:Sermaye Artırımı|Ortak Satışı).*?([\d.,]+\s*Lot)'

        # Extraction
        code = ''
        match = re.search(code_regex, title)
        if match:
            code = match.group(1)

        price = 'Belirlenmedi'
        match = re.search(price_regex, text, re.IGNORECASE)
        if match:
            price = match.group(1)

        dates = 'Tarih Yok'
        match = re.search(date_regex, text, re.IGNORECASE)
        if match:
            dates = match.group(1)
        else:
            match = re.search(draft_date_regex, text, re.IGNORECASE)
            if match:
                dates = match.group(1).strip()

        distribution_type = 'Bilinmiyor'
        if 'Eşit Dağıtım' in text:
            distribution_type = 'Eşit Dağıtım'
        elif 'Oransal Dağıtım' in text:
            distribution_type = 'Oransal Dağıtım'

        lot_count = 'Belirtilmedi'
        match = re.search(lot_regex, text, re.IGNORECASE)
        if match:
            lot_count = match.group(1)

        return {
            'code': code,
            'price': price,
            'dates': dates,
            'distributionType': distribution_type,
            'lotCount': lot_count
        }

    except Exception as e:
        print(f"Error fetching detail for {link}: {e}")
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
        for item in active_links[:4]:
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

        # Process top 20 drafts
        print(f"Found {len(draft_links)} Draft IPOs. Processing top 20...")
        for item in draft_links[:20]:
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
    fetch_ipos()
