import requests
from bs4 import BeautifulSoup
import json
import os
import re
import sys

def log(msg):
    with open("scraper_debug.log", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def scrape_capital_increases():
    log("Starting scraper...")
    url = "https://halkarz.com/sermaye-artirimi/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        log(f"Requesting {url}")
        response = requests.get(url, headers=headers)
        log(f"Response status: {response.status_code}")
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        log("Parsed HTML")

        capital_increases = []

        tables = soup.find_all('table')
        log(f"Found {len(tables)} tables")
        
        for i, table in enumerate(tables):
            log(f"Processing table {i}")
            section_type = "Bilinmiyor"
            prev = table.find_previous(['h2', 'h3', 'h4'])
            if prev:
                header_text = prev.get_text().strip().lower()
                if 'bedelsiz' in header_text:
                    section_type = "Bedelsiz"
                elif 'bedelli' in header_text:
                    section_type = "Bedelli"
                elif 'tahsisli' in header_text:
                    section_type = "Tahsisli"
            
            log(f"Section type: {section_type}")

            rows = table.find_all('tr')
            if not rows:
                continue

            start_idx = 1 if rows[0].find('th') else 0

            for row in rows[start_idx:]:
                cols = row.find_all('td')
                if not cols:
                    continue
                
                try:
                    col_texts = [c.get_text(strip=True) for c in cols]
                    
                    code = ""
                    company = ""
                    rate = ""
                    date = ""
                    status = "Bekleniyor"
                    description = ""

                    first_col = cols[0]
                    link = first_col.find('a')
                    company = first_col.get_text(strip=True)
                    
                    code_match = re.search(r'([A-Z]{3,5})', company)
                    if code_match:
                        code = code_match.group(1)
                    else:
                        code = company[:5].upper() 

                    if len(cols) > 1:
                        rate = cols[1].get_text(strip=True)
                    
                    if len(cols) > 2:
                        date = cols[2].get_text(strip=True)
                        
                    if len(cols) > 3:
                        status_text = cols[3].get_text(strip=True)
                        if "Onay" in status_text:
                            status = "Onaylandı"
                        elif "SPK" in status_text:
                            status = "SPK Başvuru"
                        elif "Taslak" in status_text:
                            status = "Taslak"
                        else:
                            status = status_text
                            
                    capital_increases.append({
                        "code": code,
                        "company": company,
                        "type": section_type,
                        "rate": rate,
                        "date": date,
                        "status": status,
                        "description": description
                    })

                except Exception as e:
                    log(f"Error parsing row: {e}")
                    continue

        os.makedirs('public', exist_ok=True)
        
        output_path = os.path.join('public', 'sermaye_artirimi.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(capital_increases, f, ensure_ascii=False, indent=2)
            
        log(f"Successfully scraped {len(capital_increases)} records to {output_path}")
        print(f"Successfully scraped {len(capital_increases)} records")

    except Exception as e:
        log(f"An error occurred: {e}")
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    scrape_capital_increases()
