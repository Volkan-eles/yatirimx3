from curl_cffi import requests
from bs4 import BeautifulSoup
import json
import os
import time
import re
from datetime import datetime

# Setup logging
def log(msg):
    timestamp = datetime.now().isoformat()
    log_msg = f"[{timestamp}] {msg}"
    print(log_msg)
    with open("scraper_debug_halkarz.log", "a", encoding="utf-8") as f:
        f.write(log_msg + "\n")

def get_soup(url):
    # Try multiple browser profiles
    browsers = ["chrome120", "safari15_5", "edge99"]
    headers = {"Referer": "https://halkarz.com/"}
    
    for browser in browsers:
        try:
            log(f"Trying {browser} for {url}...")
            resp = requests.get(url, headers=headers, impersonate=browser, timeout=30)
            resp.raise_for_status()
            log(f"✓ Success with {browser}")
            return BeautifulSoup(resp.content, 'html.parser')
        except Exception as e:
            log(f"✗ {browser} failed: {e}")
            time.sleep(2)  # Wait between attempts
    
    log(f"All browsers failed for {url}")
    return None

def extract_detail_data(detail_url):
    soup = get_soup(detail_url)
    if not soup:
        return {}

    details = {
        "price": 0,
        "lotCount": "Bilinmiyor",
        "distributionType": "Bilinmiyor",
        "market": "Yıldız Pazar",
        "floatingRate": "",
        "discount": "",
        "totalSize": "",
        "lockup": [],
        "fundUsage": [],
        "broker": "Bilinmiyor",
        "allocationGroups": [],
        "estimatedDistribution": [],
        "financialData": {},
        "applicationHours": "",
        "priceStability": ""
    }

    full_text = soup.get_text("\n", strip=True)
    
    # URL Slug
    details["slug"] = detail_url.strip('/').split('/')[-1]

    # Price
    price_match = re.search(r'Halka\s*Arz\s*Fiyatı.*?(\d+[,.]\d{2})', full_text, re.IGNORECASE | re.DOTALL)
    if price_match:
        try:
            p_str = price_match.group(1).replace(',', '.')
            details["price"] = float(p_str)
        except: pass

    # Application Hours
    hours_match = re.search(r'(\d{2}:\d{2}-\d{2}:\d{2})', full_text)
    if hours_match:
        details["applicationHours"] = hours_match.group(1)

    # Market Type (Ana Pazar / Yıldız Pazar)
    if "Ana Pazar" in full_text:
        details["market"] = "Ana Pazar"
    elif "Yıldız Pazar" in full_text:
        details["market"] = "Yıldız Pazar"

    # Distribution Type
    if "Eşit Dağıtım" in full_text: 
        details["distributionType"] = "Eşit Dağıtım"
    elif "Oransal Dağıtım" in full_text: 
        details["distributionType"] = "Oransal Dağıtım"
    
    # Lot Count
    sermaye_match = re.search(r'Sermaye\s*Artırımı\s*:\s*([\d\.]+)\s*Lot', full_text)
    ortak_match = re.search(r'Ortak\s*Satışı\s*:\s*([\d\.]+)\s*Lot', full_text)
    total_lot = 0
    if sermaye_match:
        try: total_lot += int(sermaye_match.group(1).replace('.', '').replace(',', ''))
        except: pass
    if ortak_match:
        try: total_lot += int(ortak_match.group(1).replace('.', '').replace(',', ''))
        except: pass
    
    if total_lot > 0:
        if total_lot > 1000000: 
            details["lotCount"] = f"{round(total_lot/1000000, 1)} Milyon"
        else: 
            details["lotCount"] = f"{total_lot:,}"

    # Broker (Konsorsiyum Lideri)
    broker_section = re.search(r'Aracı Kurum.*?:(.*?)(?:Bist Kodu|$)', full_text, re.DOTALL | re.IGNORECASE)
    if broker_section:
        brokers = []
        for line in broker_section.group(1).split('\n'):
            line = line.strip()
            if line and 'A.Ş' in line and len(line) < 100:
                brokers.append(line)
        if brokers:
            details["broker"] = brokers[0] if len(brokers) == 1 else ", ".join(brokers[:2])

    # Floating Rate (Halka Açıklık)
    float_match = re.search(r'Halka\s*Açıklık\s*[:\-]\s*(%?[\d,\.]+)', full_text, re.IGNORECASE)
    if float_match:
        details["floatingRate"] = float_match.group(1).strip()
    
    # Discount (İskonto)
    discount_match = re.search(r'İskonto\s*[:\-]\s*(%?[\d,\.]+)', full_text, re.IGNORECASE)
    if discount_match:
        details["discount"] = discount_match.group(1).strip()
    
    # Total Size (Büyüklük)
    size_match = re.search(r'Büyüklüğü\s*[:\-～~]\s*([\d,\.]+ (?:Milyar|Milyon) TL)', full_text, re.IGNORECASE)
    if size_match:
        details["totalSize"] = size_match.group(1).strip()
        
    # Parse structured sections
    lines = full_text.split('\n')
    capture_fund = False
    capture_lockup = False
    capture_allocation = False
    capture_distribution = False
    capture_financial = False
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Section headers
        if "Fonun Kullanım Yeri" in line:
            capture_fund = True
            capture_lockup = capture_allocation = capture_distribution = capture_financial = False
            continue
        elif "Satmama Taahhüdü" in line:
            capture_lockup = True
            capture_fund = capture_allocation = capture_distribution = capture_financial = False
            continue
        elif "Fiyat İstikrarı" in line:
            # Capture the next line as price stability info
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if next_line.startswith('-'):
                    details["priceStability"] = next_line.strip('- ')
            continue
        elif "Tahsisat Grupları" in line:
            capture_allocation = True
            capture_fund = capture_lockup = capture_distribution = capture_financial = False
            continue
        elif "Dağıtılacak Pay Miktarı" in line:
            capture_distribution = True
            capture_fund = capture_lockup = capture_allocation = capture_financial = False
            continue
        elif "Finansal Tablo" in line:
            capture_financial = True
            capture_fund = capture_lockup = capture_allocation = capture_distribution = False
            continue
        
        # Stop conditions
        if any(x in line for x in ["Bist", "Endeks", "Başvuru Yerleri", "Şirket Hakkında", "Ekler"]):
            capture_fund = capture_lockup = capture_allocation = capture_distribution = capture_financial = False
            continue
            
        # Capture data
        if capture_fund and (line.startswith('-') or line.startswith('•') or line.startswith('%')):
            details["fundUsage"].append(line.strip('-• '))
        elif capture_lockup and (line.startswith('-') or line.startswith('•')):
            if "Bist" not in line and "Endeks" not in line:
                details["lockup"].append(line.strip('-• '))
        elif capture_allocation and (line.startswith('-') or 'Lot' in line):
            if "Bist" not in line:
                details["allocationGroups"].append(line.strip('-• '))
        elif capture_distribution and (line.startswith('-') or 'katılım' in line.lower()):
            details["estimatedDistribution"].append(line.strip('-• '))
        elif capture_financial and line and not line.startswith('*'):
            # Try to parse financial data
            if 'Hasılat' in line or 'Brüt Kâr' in line or 'Milyon TL' in line:
                details["financialData"]["raw"] = details["financialData"].get("raw", "") + line + " "

    return details

def scrape_halkarz():
    base_url = "https://halkarz.com/"
    log("Starting Halkarz Scraper...")
    
    soup = get_soup(base_url)
    if not soup:
        log("Failed to fetch main page, creating empty fallback...")
        os.makedirs('public', exist_ok=True)
        output_path = os.path.join("public", "halkarz_ipos.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump({"active_ipos": [], "draft_ipos": []}, f)
        log("Fallback file created.")
        return

    # Tabs are usually separate divs or ul inside tabs
    # The structure saw in html: 
    # div.tab_item -> index 0 for Active, index 1 for Draft (class 'taslak' in ul inside it)
    
    tab_items = soup.find_all("div", class_="tab_item")
    if len(tab_items) < 2:
        log("Could not find enough tab_items")
        return

    # Debug
    log(f"Found {len(tab_items)} tab_items")
    # Debug: Search for missing items
    full_str = str(soup)
    if "Formül" in full_str:
        log("DEBUG: Found 'Formül' in soup!")
    else:
        log("DEBUG: 'Formül' NOT found in soup.")
        
    if "Z Gayrimenkul" in full_str:
        log("DEBUG: Found 'Z Gayrimenkul' in soup!")
    else:
        log("DEBUG: 'Z Gayrimenkul' NOT found in soup.")

    active_container = tab_items[0]
    draft_container = tab_items[1]
    
    # Save HTML for inspection
    with open("debug_soup.html", "w", encoding="utf-8") as f:
        f.write(soup.prettify())
    
    results = {
        "active_ipos": [],
        "draft_ipos": []
    }
    
    # Save helper
    def save_data(data):
        output_path = os.path.join("public", "halkarz_ipos.json")
        try:
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            log(f"Error saving data: {e}")

    # Helper to parse list
    def parse_list(container, is_draft=False):
        items = []
        articles = container.find_all("article", class_="index-list")
        total = len(articles)
        for idx, art in enumerate(articles):
            try:
                # Basic info
                header_tag = art.find("h3", class_="il-halka-arz-sirket")
                if not header_tag: continue
                
                a_tag = header_tag.find("a")
                if not a_tag: continue
                
                name = a_tag.get_text(strip=True)
                link = a_tag['href']
                
                code_span = art.find("span", class_="il-bist-kod")
                code = code_span.get_text(strip=True) if code_span else "KOD_YOK"
                
                date_span = art.find("span", class_="il-halka-arz-tarihi")
                dates = date_span.get_text(strip=True) if date_span else "Tarih Yok"
                
                status_div = art.find("div", class_="il-badge")
                status = status_div.get_text(strip=True) if status_div else ""
                
                img_tag = art.find("img", class_="slogo")
                logo = img_tag['src'] if img_tag else ""

                log(f"[{idx+1}/{total}] Found {'Draft' if is_draft else 'Active'}: {name} ({code})")

                # Detail scraping
                # Faster delay
                time.sleep(0.1)
                details = extract_detail_data(link)
                
                item = {
                    "code": code,
                    "company": name,
                    "dates": dates,
                    "status": status,
                    "logo": logo,
                    "url": link,
                    "slug": details.get("slug", ""),
                    "price": details.get("price", 0),
                    "lotCount": details.get("lotCount", "Belirtilmedi"),
                    "distributionType": details.get("distributionType", "Belirtilmedi"),
                    "fundUsage": details.get("fundUsage", []),
                    "lockup": details.get("lockup", []),
                    "floatingRate": details.get("floatingRate", ""),
                    "market": details.get("market", ""),
                    "broker": details.get("broker", "Bilinmiyor"),
                    "discount": details.get("discount", ""),
                    "totalSize": details.get("totalSize", ""),
                    "allocationGroups": details.get("allocationGroups", []),
                    "estimatedDistribution": details.get("estimatedDistribution", []),
                    "financialData": details.get("financialData", {}),
                    "applicationHours": details.get("applicationHours", ""),
                    "priceStability": details.get("priceStability", "")
                }
                items.append(item)
                
                # Incremental Save
                if len(items) % 5 == 0:
                   current_results = {
                       "active_ipos": results["active_ipos"] + (items if not is_draft else []),
                       "draft_ipos": results["draft_ipos"] + (items if is_draft else [])
                   }
                   save_data(current_results)
                   
            except Exception as e:
                log(f"Error parsing item: {e}")
        return items

    log("Parsing Active IPOs...")
    results["active_ipos"] = parse_list(active_container, is_draft=False)
    
    # Final save after active
    save_data(results)
    
    log("Parsing Draft IPOs...")
    results["draft_ipos"] = parse_list(draft_container, is_draft=True)
    
    # Final save
    save_data(results)
    log(f"Finished. Saved {len(results['active_ipos'])} active and {len(results['draft_ipos'])} drafts.")

if __name__ == "__main__":
    scrape_halkarz()
