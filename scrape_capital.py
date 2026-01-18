from curl_cffi import requests
import time
from bs4 import BeautifulSoup
import json
import os
import re
import sys

def scrape_capital_increases():
    print("Starting scraper...")
    url = "https://halkarz.com/sermaye-artirimi/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://halkarz.com/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
    }

    browsers = ["chrome120", "safari15_5", "edge99"]
    
    response = None
    for attempt, browser in enumerate(browsers, 1):
        try:
            print(f"Attempt {attempt}/{len(browsers)}: Requesting {url} with {browser}")
            response = requests.get(url, headers=headers, impersonate=browser, timeout=30)
            if response.status_code == 200:
                print("Success fetching page")
                break
            else:
                print(f"Status code: {response.status_code}")
        except Exception as e:
            print(f"{browser} failed: {e}")
            if attempt < len(browsers):
                time.sleep(2)
    
    if not response or response.status_code != 200:
        print("Failed to fetch page")
        return

    try:
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Helper to clean text
        def clean(text):
            return text.strip().replace('\xa0', ' ')

        capital_increases = []

        # Find all tables
        tables = soup.find_all('table')
        print(f"Found {len(tables)} tables")

        table_roles = ["Bedelsiz", "Bedelli", "Tahsisli"]
        
        for i, table in enumerate(tables):
            if i >= len(table_roles):
                print(f"Skipping extra table {i}")
                break
                
            section_type = table_roles[i]
            print(f"Processing Table {i} as {section_type}")

            rows = table.find_all('tr')
            if not rows:
                print("No rows found")
                continue

            # Determine start index (skip header)
            start_idx = 0
            if rows[0].find('th'):
                start_idx = 1
            
            print(f"Processing {len(rows)-start_idx} rows in {section_type}")

            for row_idx, row in enumerate(rows[start_idx:]):
                cols = row.find_all('td')
                if not cols:
                    continue
                
                try:
                    col_texts = [clean(c.get_text()) for c in cols]
                    if row_idx < 3:
                        print(f"Row {row_idx}: {col_texts}")

                    # Heuristic Parsing
                    code = ""
                    company = ""
                    rate = ""
                    amount = ""
                    dates = []
                    
                    # 1. Company/Code is usually Col 0
                    if not col_texts: continue
                    company_text = col_texts[0]
                    # Extract Code (All caps, 3-5 chars at start mostly)
                    code_match = re.search(r'([A-Z]{3,5})', company_text)
                    if code_match:
                        code = code_match.group(1)
                    else:
                        code = company_text.split()[0]
                    company = company_text
                    
                    # 2. Iterate remaining columns look for signatures
                    for text in col_texts[1:]:
                        # Rate: Contains %
                        if '%' in text and not rate:
                            rate = text
                        # Amount: Contains TL or numeric format avoiding dates
                        elif ('TL' in text or (re.search(r'\d', text) and len(text) > 8)) and '00.' not in text and not amount:
                             # Check if it looks like a date
                             if not re.search(r'\d{2}\.\d{2}\.\d{4}', text):
                                amount = text
                        # Date: DD.MM.YYYY
                        if re.search(r'\d{2}\.\d{2}\.\d{4}', text):
                            dates.append(text)
                    
                    # Assign Dates
                    # Usually order: YKK, SPK, Tescil/Final
                    ykk_date = dates[0] if len(dates) > 0 else ""
                    spk_date = dates[1] if len(dates) > 1 else ""
                    final_date = dates[-1] if len(dates) > 0 else ""
                    
                    # Determine Main Date to Display and Status
                    display_date = ""
                    status = "Bekleniyor"
                    desc = ""

                    if section_type == "Bedelli":
                         pass # Extra processing if needed

                    if len(dates) >= 3:
                        display_date = final_date
                        status = "Onaylandı"
                        desc = f"Bölünme Tarihi: {final_date}"
                    elif len(dates) == 2:
                        display_date = spk_date
                        status = "SPK Onay"
                        desc = "SPK Onayı Alındı"
                    elif len(dates) == 1:
                        display_date = ykk_date
                        status = "YKK Kararı"
                        desc = "Yönetim Kurulu Kararı"
                    else:
                         display_date = ""
                         status = "Taslak"

                    # If display_date is in the past, mark as completed
                    if display_date:
                        try:
                            from datetime import datetime
                            # display_date format is DD.MM.YYYY
                            d_date = datetime.strptime(display_date, '%d.%m.%Y')
                            if datetime.now() > d_date:
                                status = "Tamamlandı"
                                if "GENIL" in code: print(f"DEBUG GENIL: Updated to Tamamlandı. Now: {datetime.now()} > {d_date}")
                            else:
                                if "GENIL" in code: print(f"DEBUG GENIL: Not updated. Now: {datetime.now()} <= {d_date}")
                        except Exception as e:
                            print(f"Date parse error: {e}")

                    if not display_date and status == "Taslak": # Only set if still default
                          display_date = ""
                          status = "Taslak"
                    # But dates should be captured by regex.

                    # Populate Details
                    if amount:
                        desc += f" | Tutar: {amount}"

                    capital_increases.append({
                        "code": code,
                        "company": company,
                        "type": section_type,
                        "rate": rate,
                        "date": display_date,
                        "status": status,
                        "description": desc
                    })

                except Exception as e:
                    print(f"Error parsing row: {e}")
                    continue

        os.makedirs('public', exist_ok=True)
        output_path = os.path.join('public', 'sermaye_artirimi.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(capital_increases, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully scraped {len(capital_increases)} records")

    except Exception as e:
        print(f"An error occurred: {e}")
        if not os.path.exists('public/sermaye_artirimi.json'):
             with open('public/sermaye_artirimi.json', 'w', encoding='utf-8') as f:
                json.dump([], f)

if __name__ == "__main__":
    scrape_capital_increases()
