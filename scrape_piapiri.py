from curl_cffi import requests
from bs4 import BeautifulSoup
import json
import os
import sys
import datetime

# Setup logging to file
def log(msg):
    with open("scraper_debug_piapiri.log", "a", encoding="utf-8") as f:
        timestamp = datetime.datetime.now().isoformat()
        f.write(f"[{timestamp}] {msg}\n")

def scrape_piapiri():
    url = "https://www.piapiri.com/halka-arz/"
    headers = {
        # User-Agent removed to let curl_cffi handle it
    }

    log(f"Starting scraper for {url}")
    try:
        response = requests.get(url, headers=headers, impersonate="chrome124", timeout=30)
        response.raise_for_status()
        log("Request successful")
    except Exception as e:
        log(f"Error fetching URL: {e}")
        return

    try:
        soup = BeautifulSoup(response.text, 'html.parser')
        log("Parsed HTML")
        
        # Find the specific table containing "Şirket Adı"
        tables = soup.find_all('table')
        target_table = None
        for t in tables:
            # Check if this table has the expected header
            # We look for a th or td containing "Şirket Adı"
            if "Şirket Adı" in t.get_text():
                # Verify it has enough headers or structure
                # This could be the outer table too if it finds text in nested table
                # We want the innermost table that has this text?
                # Actually, find_all returns matches. If nested, outer contains inner.
                # Use a more specific check. 
                # Does it have a thead with this text?
                headers = t.find_all(['th', 'td'])
                for h in headers:
                    if "Şirket Adı" in h.get_text():
                        target_table = t
                        break
            if target_table:
                break
        
        if not target_table:
            log("Could not find table with 'Şirket Adı'")
            with open("piapiri_failed.html", "w", encoding="utf-8") as f:
                f.write(response.text)
            return

        log("Found target table")

        # Get all rows (flattened)
        # Because of nesting/malformed HTML, find_all will get all rows irrespective of depth
        rows = target_table.find_all('tr')
            
        log(f"Found {len(rows)} rows in target table")

        data = []
        
        def extract_safe_text(tag, debug=False):
            if not tag:
                return ""
            
            # If it's a string, return it
            if not hasattr(tag, 'name') or tag.name is None:
                if debug: log(f"  Found string: '{str(tag)[:20]}...'")
                return str(tag).strip()
            
            if debug: log(f"  Entering tag: {tag.name}")
            
            parts = []
            
            if hasattr(tag, 'children'):
                for child in tag.children:
                    if debug: log(f"    Child: {getattr(child, 'name', 'String')}")
                    
                    if child.name in ['tr', 'table', 'tbody', 'thead', 'td', 'th']:
                        if debug: log(f"    BREAKING on blocked tag: {child.name}")
                        break
                    
                    text = extract_safe_text(child, debug)
                    if text:
                        if debug: log(f"    Extracted: '{text[:20]}...'")
                        parts.append(text)
            
            return " ".join(parts).strip()

        for row in rows:
            cols = row.find_all('td')
            
            if not cols or len(cols) < 4:
                continue

            company_name = extract_safe_text(cols[0])
            if "Şirket Adı" in company_name:
                continue
            
            date_text = extract_safe_text(cols[1])
            price_text = extract_safe_text(cols[2])
            status_text = extract_safe_text(cols[3])
           
            if not company_name: 
                continue

            item = {
                "company": company_name,
                "date": date_text,
                "price": price_text,
                "status": status_text
            }
            if item not in data:
                data.append(item)

        log(f"Extracted {len(data)} items")
        
        output_dir = 'public'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        output_path = os.path.join(output_dir, 'piapiri_ipos.json')
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        log(f"Saved data to {output_path}")
        
    except Exception as e:
        log(f"Error during parsing/processing: {e}")

if __name__ == "__main__":
    scrape_piapiri()
