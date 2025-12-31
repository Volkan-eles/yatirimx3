
import requests
from bs4 import BeautifulSoup
import json
import re
import time
import os
import sys
import concurrent.futures

# Headers to mimic a browser
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def clean_text(text):
    return ' '.join(text.split())

def fetch_details_for_item(item):
    """
    Fetches details for a given item dict {title, link, status}.
    Returns the complete item dict with details, or None on failure.
    """
    link = item['link']
    title = item['title']
    
    retries = 3
    for attempt in range(retries):
        try:
            response = requests.get(link, headers=HEADERS, timeout=20)
            if response.status_code == 200:
                break
            time.sleep(1)
        except Exception:
            if attempt == retries - 1:
                print(f"FAILED to fetch {title} after {retries} attempts.")
                return None
            time.sleep(1)
    
    if response.status_code != 200:
        return None

    try:
        soup = BeautifulSoup(response.content, 'html.parser')
        # ... rest of extraction ...

        # BeautifulSoup Extraction logic
        sp_table = soup.select_one('table.sp-table')
        content_div = soup.select_one('.entry-content, .post-content, article')
        text = clean_text(content_div.get_text()) if content_div else ""
        
        price = 'Belirlenmedi'
        dates = 'Tarih Yok'
        distribution_type = 'Bilinmiyor'
        lot_count = 'Belirtilmedi'
        code = ''

        # Extract Code
        code_tag = soup.select_one('.il-bist-kod')
        if code_tag:
            code = code_tag.get_text(strip=True)
        
        if not code:
            code_match = re.search(r'\(([A-Z]{3,5})\)', title)
            if code_match:
                code = code_match.group(1)

        # Extract from Table
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

        # Clean/Fallback
        if 'Hazırlanıyor' in dates:
            dates = 'Tarih Bekleniyor'
        
        if price == 'Belirlenmedi':
             match = re.search(r'(?:Halka Arz Fiyatı|Fiyat).*?([\d,.]+)\s*TL', text, re.IGNORECASE)
             if match: price = match.group(1) + ' TL'

        # Refining Status Logic
        final_status = item['status']
        if final_status == 'Yeni':
            if 'Tarih Bekleniyor' in dates:
                final_status = 'Onaylı' # Approved but dates pending
            elif re.search(r'\d', dates):
                final_status = 'Talep Toplanıyor' # Has numeric dates

        return {
            'company': title,
            'link': link,
            'status': final_status,
            'code': code,
            'price': price,
            'dates': dates,
            'distributionType': distribution_type,
            'lotCount': lot_count
        }

    except Exception as e:
        # print(f"Error details {link}: {e}")
        return None

def fetch_category_links(base_url, status_label):
    links = []
    page = 1
    max_pages = 50 # Safety limit
    
    print(f"Starting scan for {status_label} at {base_url}...")
    
    while page <= max_pages:
        url = f"{base_url}page/{page}/" if page > 1 else base_url
        try:
            response = requests.get(url, headers=HEADERS, timeout=10)
            if response.status_code == 404:
                # End of pages
                break
            if response.status_code != 200:
                print(f"Skipping page {page} due to status {response.status_code}")
                page += 1
                continue
            
            soup = BeautifulSoup(response.content, 'html.parser')
            articles = soup.select('article, .post-item')
            
            if not articles:
                # No articles found using selectors
                break
            
            new_items = []
            for article in articles:
                a_tag = article.find('a')
                if not a_tag: continue
                
                link = a_tag['href']
                title_tag = article.find(['h2', 'h3'])
                title = title_tag.get_text(strip=True) if title_tag else ''
                
                # Check for 'halkarz.com' to ensure internal link, avoid ads
                if link and 'halkarz.com' in link and title:
                    # Basic dedup check within this batch not needed if set used, but list is fine
                    new_items.append({'title': title, 'link': link, 'status': status_label})
            
            if not new_items:
                break
                
            links.extend(new_items)
            print(f"  Page {page}: Found {len(new_items)} items. Total: {len(links)}")
            
            # Check for "Next" button/link to verify pagination existence, 
            # otherwise 404 check above handles 
            # (halkarz usually 404s on out of bounds pages or redirects)
            
            page += 1
            time.sleep(0.2)
            
        except Exception as e:
            print(f"Error scanning page {page}: {e}")
            break
            
    return links

def fetch_ipos():
    output_path = 'public/halkarz_ipos.json'
    
    # 1. Fetch All Links
    print("--- Phase 1: Gathering Links ---")
    
    # scan for homepage items too, as some might be pinned there
    homepage_links = []
    try:
        print(f"Scanning Homepage (https://halkarz.com/)...")
        r_home = requests.get('https://halkarz.com/', headers=HEADERS, timeout=10)
        if r_home.status_code == 200:
            soup_home = BeautifulSoup(r_home.content, 'html.parser')
            # Homepage might have slider or different structure, but usually articles are there
            for article in soup_home.select('article, .post-item, .slider-caption'):
                a_tag = article.find('a')
                if not a_tag: 
                    # check parent if a_tag is not direct child (common in sliders)
                    a_tag = article.find_parent('a')
                
                if not a_tag: continue
                
                link = a_tag.get('href', '')
                title_tag = article.find(['h2', 'h3', 'h4', 'span'])
                title = title_tag.get_text(strip=True) if title_tag else ''
                
                if link and 'halkarz.com' in link and 'Taslak' not in title and ('A.Ş.' in title or 'Holding' in title):
                     homepage_links.append({'title': title, 'link': link, 'status': 'Yeni'})
        print(f"  Homepage: Found {len(homepage_links)} potential items.")
    except Exception as e:
        print(f"  Homepage scan failed: {e}")

    active_links = fetch_category_links('https://halkarz.com/k/halka-arz/', 'Yeni')
    draft_links = fetch_category_links('https://halkarz.com/k/taslak/', 'Taslak')
    
    # Merge Homepage + Category for Active
    all_active_raw = homepage_links + active_links
    unique_active = {v['link']:v for v in all_active_raw}.values()
    unique_draft = {v['link']:v for v in draft_links}.values()
    
    print(f"Total Unique Active/Completed: {len(unique_active)}")
    print(f"Total Unique Drafts: {len(unique_draft)}")

    # 2. Fetch Details Concurrently
    print("\n--- Phase 2: Fetching Details (Concurrent) ---")
    
    all_active_data = []
    all_draft_data = []
    
    # Use ThreadPoolExecutor
    # Adjust max_workers based on performance/server tolerance. 
    max_workers = 5
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Helper to submit
        def submit_list(items_list):
            return [executor.submit(fetch_details_for_item, item) for item in items_list]
            
        print(f"Starting threads for {len(unique_active)} active items...")
        futures_active = submit_list(unique_active)
        
        print(f"Starting threads for {len(unique_draft)} draft items...")
        futures_draft = submit_list(unique_draft)
        
        # Collect Active - In Order
        print("Collecting Active Results (Preserving Order)...")
        for i, future in enumerate(futures_active):
            try:
                res = future.result()
                if res:
                    all_active_data.append(res)
            except Exception as e:
                print(f"Error getting result: {e}")
            
            if (i + 1) % 10 == 0:
                print(f"  Active Progress: {i + 1}/{len(unique_active)}", end='\r')
        print(f"  Active Progress: {len(unique_active)}/{len(unique_active)} Done.")

        # Collect Drafts - In Order
        print("Collecting Draft Results (Preserving Order)...")
        for i, future in enumerate(futures_draft):
            try:
                res = future.result()
                if res:
                    all_draft_data.append(res)
            except Exception as e:
                print(f"Error getting result: {e}")
                
            if (i + 1) % 10 == 0:
                print(f"  Draft Progress: {i + 1}/{len(unique_draft)}", end='\r')
        print(f"  Draft Progress: {len(unique_draft)}/{len(unique_draft)} Done.")

    # Sort Active Data to prioritize New/Approved
    print("\nSorting data by status priority...")
    def sort_key(item):
        status = item.get('status', '')
        # Priority: Onaylı (0) > Talep Toplanıyor (1) > Others (2)
        if status == 'Onaylı':
            return 0
        if status == 'Talep Toplanıyor':
            return 1
        return 2

    all_active_data.sort(key=sort_key)

    # 3. Save
    print("--- Phase 3: Saving Data ---")
    data = {
        'active_ipos': all_active_data,
        'draft_ipos': all_draft_data
    } # Note: 'active_ipos' naming kept for compatibility, even though it contains completed/past ones now.

    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✓ Saved {len(all_active_data)} Active/Past and {len(all_draft_data)} Draft IPOs to {output_path}")
    except Exception as e:
        print(f"Error saving JSON: {e}")

if __name__ == "__main__":
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except:
            pass
    fetch_ipos()
