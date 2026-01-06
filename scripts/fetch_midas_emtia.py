import requests
from bs4 import BeautifulSoup
import json
import os
import time

def clean_price_text(text):
    """
    Cleans price text:
    - Removes currency symbols (₺, $, etc.)
    - Removes whitespace
    - Keeps the format for display or parses to float if needed.
    """
    if not text:
        return ""
    return text.strip()

def fetch_midas_emtia():
    url = "https://www.getmidas.com/emtia/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    print(f"Fetching data from {url}...")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all commodity rows
        # Based on investigation: tr.table-row
        rows = soup.select('tr.table-row')
        
        commodities = []
        
        print(f"Found {len(rows)} commodity rows.")
        
        for row in rows:
            try:
                # Name: a.title.stock-code OR text inside the first cell if link is missing
                title_elem = row.select_one('.title.stock-code')
                name = title_elem.get_text(strip=True) if title_elem else "Unknown"
                
                # Prices are in td.val
                # nth-child is 1-based in CSS, but select returns list
                cells = row.select('td.val')
                
                # Expected structure based on investigation:
                # Cell 0: (Might be name container's parent TD? No, .title.stock-code is usually in a td)
                # Let's verify the cells.
                # Usually: [NameCol, BuyPrice, SellPrice, Min, Max, Change%, Time]
                
                # Using the subagent's finding:
                # Price (Buy): child(2) -> index 0 of .val? 
                # Let's grab all text from cells to be safe and map them.
                
                # Debugging cell values:
                # [cell.get_text() for cell in cells]
                
                if len(cells) < 3:
                    continue
                    
                # Assuming standard layout:
                # 1. Alış (Buy)
                # 2. Satış (Sell)
                # 3. Fark (Diff) ? or Min/Max?
                # 4. Change %
                
                # Subagent said:
                # Price (Alış): nth-child(2) -> This is likely the first 'val' class td if Name is not 'val'
                # Price (Satış): nth-child(3)
                # Change: dailyChangePercent (class)
                
                buy_price = cells[0].get_text(strip=True)
                sell_price = cells[1].get_text(strip=True)
                
                # Find the change cell by class if possible
                change_cell = row.select_one('.dailyChangePercent')
                if change_cell:
                    change_rate = change_cell.get_text(strip=True)
                else:
                    # Fallback to last known position if class missing
                    change_rate = cells[-1].get_text(strip=True) 

                commodities.append({
                    "name": name,
                    "buy_price": buy_price,
                    "sell_price": sell_price,
                    "change_rate": change_rate,
                    "fetched_at": time.strftime("%Y-%m-%d %H:%M:%S")
                })
                
            except Exception as e:
                print(f"Error parsing row: {e}")
                continue
                
        # Validate data
        if not commodities:
            print("No commodities found. CSS selectors might be outdated.")
            # Fallback/Debug: print first row html
            if rows:
                print("DEBUG First Row HTML:", rows[0].prettify())
            return
            
        # Save to JSON
        output_path = os.path.join("public", "emtia.json")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(commodities, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully saved {len(commodities)} commodities to {output_path}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    fetch_midas_emtia()
