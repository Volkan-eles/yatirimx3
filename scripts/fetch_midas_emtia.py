import requests
from bs4 import BeautifulSoup
import json
import os
import time

def clean_price_text(text):
    if not text:
        return ""
    return text.strip()

def fetch_url(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    print(f"Fetching data from {url}...")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_table_row(row):
    try:
        # Name: a.title.stock-code
        title_elem = row.select_one('.title.stock-code')
        if not title_elem:
            return None
            
        name = title_elem.get_text(strip=True)
        cells = row.select('td.val')
        
        if len(cells) < 2:
            return None
            
        # Standard: [Name, Buy, Sell, Change] or similar
        # Main page: cells[0]=Buy, cells[1]=Sell
        buy_price = cells[0].get_text(strip=True)
        sell_price = cells[1].get_text(strip=True)
        
        change_cell = row.select_one('.dailyChangePercent')
        change_rate = change_cell.get_text(strip=True) if change_cell else ""
        
        # Fallback for change rate if class not found but cells exist
        if not change_rate and len(cells) > 2:
             change_rate = cells[-1].get_text(strip=True)

        return {
            "name": name,
            "buy_price": buy_price,
            "sell_price": sell_price,
            "change_rate": change_rate,
            "fetched_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception:
        return None

def fetch_midas_emtia():
    all_commodities = {}

    # 1. Fetch Main Commodity Page
    soup_main = fetch_url("https://www.getmidas.com/emtia/")
    if soup_main:
        rows = soup_main.select('tr.table-row')
        print(f"Found {len(rows)} commodities on main page.")
        for row in rows:
            data = parse_table_row(row)
            if data:
                all_commodities[data["name"]] = data

    # 2. Fetch Detailed Gold Page
    soup_gold = fetch_url("https://www.getmidas.com/altin/")
    if soup_gold:
        # Cards (Quarter, Half, etc.)
        cards = soup_gold.select('.gold-card') # Class might be partial, assuming from subagent
        # If scraper fails on specific class, reliance on table is safer.
        # But cards often have "Çeyrek", "Yarım".
        # Let's check table first as it's more structured.
        
        rows = soup_gold.select('tr.table-row')
        print(f"Found {len(rows)} gold types in table.")
        for row in rows:
            data = parse_table_row(row)
            if data:
                # Overwrite or Add
                # Gold page might have more precise data for "GRAM ALTIN" than main page
                all_commodities[data["name"]] = data

        # If table didn't cover cards (Top items), we might need card parsing.
        # However, usually Top items are also in the table OR they are few.
        # Let's rely on the table for now as Midas usually lists all in the table below.
        
    # Convert dict to list
    final_list = list(all_commodities.values())
    
    # Sort: Gold types first, then others? Or just A-Z?
    # Let's keep it somewhat original order but maybe prioritize "ALTIN" containing items
    
    if not final_list:
        print("No data extracted.")
        return

    output_path = os.path.join("public", "emtia.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved {len(final_list)} items to {output_path}")

if __name__ == "__main__":
    fetch_midas_emtia()
