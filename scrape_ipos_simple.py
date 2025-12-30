#!/usr/bin/env python3
"""
Simplified IPO scraper for halkarz.com
Extracts active and draft IPOs from the main page
"""
import requests
from bs4 import BeautifulSoup
import json
import os
import sys

def log(msg):
    print(msg)
    sys.stdout.flush()

def scrape_ipos():
    url = "https://halkarz.com/"
    log(f"Fetching IPO data from {url}...")
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        log(f"Response status: {response.status_code}")
        
        if not response.ok:
            raise Exception(f"HTTP {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        log("Parsing HTML...")
        
        # Find tab containers
        tab_items = soup.find_all("div", class_="tab_item")
        log(f"Found {len(tab_items)} tab containers")
        
        if len(tab_items) < 2:
            log("Warning: Expected at least 2 tabs (active and draft)")
            active_container = tab_items[0] if len(tab_items) > 0 else soup
            draft_container = soup
        else:
            active_container = tab_items[0]
            draft_container = tab_items[1]
        
        result = {
            "active_ipos": [],
            "draft_ipos": []
        }
        
        # Parse active IPOs
        log("Parsing active IPOs...")
        active_articles = active_container.find_all("article", class_="index-list")
        log(f"Found {len(active_articles)} active IPO articles")
        
        for article in active_articles:
            try:
                ipo = extract_ipo_data(article)
                if ipo:
                    result["active_ipos"].append(ipo)
            except Exception as e:
                log(f"Error parsing active IPO: {e}")
        
        # Parse draft IPOs
        log("Parsing draft IPOs...")
        draft_articles = draft_container.find_all("article", class_="index-list")
        log(f"Found {len(draft_articles)} draft IPO articles")
        
        for article in draft_articles:
            try:
                ipo = extract_ipo_data(article)
                if ipo:
                    result["draft_ipos"].append(ipo)
            except Exception as e:
                log(f"Error parsing draft IPO: {e}")
        
        # Save results
        os.makedirs('public', exist_ok=True)
        output_path = 'public/halkarz_ipos.json'
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        log(f"✓ Saved {len(result['active_ipos'])} active and {len(result['draft_ipos'])} draft IPOs")
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

def extract_ipo_data(article):
    """Extract IPO data from article element"""
    # Company name and link
    header = article.find("h3", class_="il-halka-arz-sirket")
    if not header:
        return None
    
    a_tag = header.find("a")
    if not a_tag:
        return None
    
    company = a_tag.get_text(strip=True)
    url = a_tag.get('href', '')
    
    # Stock code
    code_span = article.find("span", class_="il-bist-kod")
    code = code_span.get_text(strip=True) if code_span else "N/A"
    
    # Dates
    date_span = article.find("span", class_="il-halka-arz-tarihi")
    dates = date_span.get_text(strip=True) if date_span else "Tarih Yok"
    
    # Status badge
    status_div = article.find("div", class_="il-badge")
    status = status_div.get_text(strip=True) if status_div else ""
    
    # Logo
    img_tag = article.find("img", class_="slogo")
    logo = img_tag.get('src', '') if img_tag else ""
    
    return {
        "code": code,
        "company": company,
        "dates": dates,
        "status": status,
        "logo": logo,
        "url": url,
        "price": 0,
        "lotCount": "Belirtilmedi",
        "distributionType": "Belirtilmedi"
    }

if __name__ == "__main__":
    log("="*60)
    log("IPO SCRAPER - Simplified Version")
    log("="*60)
    success = scrape_ipos()
    sys.exit(0 if success else 1)
