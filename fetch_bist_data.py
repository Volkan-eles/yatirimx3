#!/usr/bin/env python3
"""
Fetch live BIST (Borsa Istanbul) stock data using Yahoo Finance API
Saves data to public/bist_live_data.json for frontend consumption
"""

import yfinance as yf
import json
from datetime import datetime
import os

# Comprehensive list of BIST stocks (500+ stocks)
BIST_STOCKS = [
    # BIST 30
    "AKBNK", "ALARK", "ARCLK", "ASELS", "BIMAS", "EKGYO", "ENJSA", "EREGL", 
    "FROTO", "GARAN", "GUBRF", "HEKTS", "ISCTR", "KCHOL", "KOZAA", "KOZAL", 
    "KRDMD", "PETKM", "PGSUS", "SAHOL", "SASA", "SISE", "TAVHL", "TCELL", 
    "THYAO", "TOASO", "TUPRS", "VAKBN", "VESTL", "YKBNK",
    
    # Additional Popular Stocks
    "AEFES", "AGHOL", "AKSA", "AKSEN", "ALBRK", "ALGYO", "ANACM", "ASUZU",
    "AYDEM", "BAGFS", "BIOEN", "BJKAS", "BRISA", "BRYAT", "BUCIM", "CEMTS",
    "CLEBI", "CIMSA", "DOAS", "DOHOL", "EGEEN", "ENKAI", "FENER", "GENIL",
    "GENTS", "GESAN", "GOLTS", "GOZDE", "HALKB", "INDES", "ISGYO", "KARTN",
    "KLMSN", "KONTR", "KORDS", "KONYA", "KRSTL", "LOGO", "MAVI", "MGROS",
    "MPARK", "ODAS", "OTKAR", "OYAKC", "PARSN", "PENGD", "PETUN", "PRKME",
    "QUAGR", "SELEC", "SKBNK", "SMART", "SOKM", "SRVGY", "TATGD", "TBORG",
    "TKNSA", "TMSN", "TRGYO", "TRILC", "TTKOM", "TTRAK", "TUKAS", "TURSG",
    "ULKER", "ULUUN", "VAKKO", "VERUS", "VESBE", "YATAS", "YEOTK", "ZOREN",
    
    # BIST 50-100 and more
    "ADEL", "AEFES", "AFYON", "AKENR", "AKFGY", "AKFYE", "AKSGY", "AKSUE",
    "AKYHO", "ALCAR", "ALCTL", "ALFAS", "ALKA", "ALMAD", "ALTIN", "ANELE",
    "ANHYT", "ANSGR", "ARASE", "ARDYZ", "ARENA", "ARMDA", "ARSAN", "ARTMS",
    "ARZUM", "ASTOR", "ATAGY", "ATAKP", "ATATP", "ATEKS", "ATLAS", "AVGYO",
    "AVHOL", "AVOD", "AVTUR", "AYCES", "AYEN", "AYES", "BAKAB", "BALAT",
    "BANVT", "BARMA", "BASCM", "BASGZ", "BAYRK", "BEGYO", "BERA", "BEYAZ",
    "BFREN", "BIGCH", "BINHO", "BIZIM", "BLCYT", "BMSCH", "BMSTL", "BNTAS",
    "BOBET", "BORLS", "BORSK", "BOSSA", "BRKSN", "BRKVY", "BRMEN", "BRSAN",
    "BSOKE", "BTCIM", "BUCIM", "BURCE", "BURVA", "BVSAN", "BYDNR", "CANTE",
    "CASA", "CATES", "CCOLA", "CELHA", "CEMAS", "CEOEM", "CMBTN", "CMENT",
    "CONSE", "COSMO", "CRDFA", "CRFSA", "CUSAN", "CVKMD", "CWENE", "DAGHL",
    "DAGI", "DAPGM", "DARDL", "DENGE", "DERHL", "DERIM", "DESA", "DESPC",
    "DEVA", "DGATE", "DGGYO", "DGNMO", "DIRIT", "DITAS", "DJIST", "DMSAS",
    "DNISI", "DOBUR", "DOCO", "DOFER", "DOGUB", "DOKTA", "DURDO", "DYOBY",
    "DZGYO", "ECILC", "ECZYT", "EDATA", "EDIP", "EFORC", "EGEPO", "EGGUB",
    "EGPRO", "EGSER", "EKIZ", "EKOS", "EKSUN", "ELITE", "EMKEL", "EMNIS",
    "ENERY", "ENSRI", "EPLAS", "ERBOS", "ERCB", "ERSU", "ESCAR", "ESCOM",
    "ESEN", "ETILR", "ETYAT", "EUHOL", "EUKYO", "EUPWR", "EUREN", "EUYO",
    "EYGYO", "FADE", "FLAP", "FMIZP", "FONET", "FORMT", "FORTE", "FRIGO",
    "FZLGY", "GARFA", "GEDIK", "GEDZA", "GEREL", "GIPTA", "GLBMD", "GLCVY",
    "GLRYH", "GLYHO", "GMTAS", "GOKNR", "GOODY", "GRNYO", "GRSEL", "GRTRK",
    "GSDDE", "GSDHO", "GSRAY", "GUNDZ", "GWIND", "GZNMI", "HATEK", "HATSN",
    "HDFGS", "HEDEF", "HKTM", "HLGYO", "HTTBT", "HUBVC", "HUNER", "HURGZ",
    "ICBCT", "ICUGS", "IDEAS", "IDGYO", "IEYHO", "IHAAS", "IHEVA", "IHGZT",
    "IHLAS", "IHLGM", "IHYAY", "IMASM", "INFO", "INGRM", "INTEM", "INVEO",
    "INVES", "IPEKE", "ISATR", "ISBIR", "ISBTR", "ISDMR", "ISFIN", "ISGSY",
    "ISKPL", "ISKUR", "ISSEN", "ISYAT", "IZENR", "IZFAS", "IZINV", "IZMDC",
    "JANTS", "KAPLM", "KAREL", "KARSN", "KARYE", "KATMR", "KAYSE", "KBORU",
    "KCAER", "KENT", "KERVN", "KERVT", "KFEIN", "KGYO", "KIMMR", "KLGYO",
    "KLKIM", "KLNMA", "KLRHO", "KLSER", "KLSYN", "KMPUR", "KNFRT", "KOCMT",
    "KONTR", "KOPOL", "KOTON", "KRDMA", "KRDMB", "KRGYO", "KRONT", "KRPLS",
    "KRTEK", "KRVGD", "KSTUR", "KTLEV", "KTSKR", "KUTPO", "KUVVA", "KUYAS",
    "KZBGY", "KZGYO", "LIDER", "LINK", "LKMNH", "LRSHO", "LUKSK", "MAALT",
    "MACKO", "MAGEN", "MAKIM", "MAKTK", "MAMSE", "MANAS", "MARBL", "MARKA",
    "MARTI", "MEDTR", "MEGAP", "MEGMT", "MEKAG", "MEPET", "MERCN", "MERIT",
    "MERKO", "METRO", "METUR", "MHRGY", "MIATK", "MMCAS", "MNDRS", "MNDTR",
    "MOBTL", "MOGAN", "MRGYO", "MRSHL", "MSGYO", "MTRKS", "MTRYO", "MZHLD",
    "NATEN", "NETAS", "NIBAS", "NTGAZ", "NTHOL", "NUGYO", "NUHCM", "OBASE",
    "ODINE", "OFSYM", "ONCSM", "ONRYT", "ORCAY", "ORGE", "ORMA", "OSMEN",
    "OSTIM", "OTTO", "OYAYO", "OYLUM", "OYYAT", "OZGYO", "OZKGY", "OZRDN",
    "OZSUB", "PAMEL", "PAPIL", "PASEU", "PATEK", "PCILT", "PEGYO", "PEKGY",
    "PENTA", "PINSU", "PKART", "PKENT", "PLTUR", "PNLSN", "PNSUT", "POLHO",
    "POLTK", "PRDGS", "PRKAB", "PRZMA", "PSDTC", "PSGYO", "QNBFB", "QNBFL",
    "RALYH", "RAYSG", "REEDR", "RGYAS", "RHEAG", "RNPOL", "RODRG", "ROYAL",
    "RTALB", "RUBNS", "RYGYO", "RYSAS", "SAFKR", "SAMAT", "SANEL", "SANFM",
    "SANKO", "SARKY", "SAYAS", "SDTTR", "SEGMN", "SEGYO", "SEKFK", "SEKUR",
    "SELGD", "SELVA", "SEYKM", "SILVR", "SKTAS", "SKYLP", "SKYMD", "SMRTG",
    "SNGYO", "SNICA", "SNKRN", "SNPAM", "SODSN", "SONME", "SUMAS", "SUNTK",
    "SUWEN", "TARKM", "TARKS", "TATEN", "TDGYO", "TEKTU", "TERA", "TETMT",
    "TEZOL", "TGSAS", "TIRE", "TKFEN", "TLMAN", "TMPOL", "TRCAS", "TSGYO",
    "TSKB", "TSPOR", "TUCLK", "TUREX", "TURGG", "UFUK", "UKIM", "ULUFA",
    "ULUSE", "UMPAS", "UNLU", "USAK", "UZERB", "VAKFN", "VANGD", "VBTYZ",
    "VERTU", "VKFYO", "VKING", "VKGYO", "YAPRK", "YATVK", "YESIL", "YGGYO",
    "YGYO", "YKSLN", "YUNSA", "YYLGD", "ZEDUR", "ZELOT", "ZRGYO"
]

def main():
    # Create log file
    log_file = open("fetch_log.txt", "w", encoding="utf-8")
    
    def log(msg):
        log_file.write(msg + "\n")
        log_file.flush()
    
    log("Starting BIST data fetch...")
    log(f"Total stocks: {len(BIST_STOCKS)}")
    
    # Add .IS suffix for Yahoo Finance
    symbols = [f"{code}.IS" for code in BIST_STOCKS]
    
    # Also fetch BIST 100 index
    symbols.append("XU100.IS")
    
    log(f"Fetching data for {len(symbols)} symbols...")
    
    try:
        # Download all data at once - much faster!
        data = yf.download(
            symbols,
            period="5d",
            group_by='ticker',
            threads=True,
            progress=False
        )
        
        log("Data downloaded successfully!")
        
        # Process BIST 100 index
        bist100_data = {"value": 0, "change": 0, "change_percent": 0}
        try:
            if "XU100.IS" in data:
                xu100 = data["XU100.IS"]
                if not xu100.empty and len(xu100) >= 2:
                    current = xu100['Close'].iloc[-1]
                    prev = xu100['Close'].iloc[-2]
                    change = current - prev
                    change_pct = (change / prev) * 100
                    bist100_data = {
                        "value": round(float(current), 2),
                        "change": round(float(change), 2),
                        "change_percent": round(float(change_pct), 2)
                    }
                    log(f"BIST100: {bist100_data['value']}")
        except Exception as e:
            log(f"Error processing BIST100: {e}")
        
        # Process individual stocks
        stocks_data = []
        successful = 0
        failed = 0
        
        for code in BIST_STOCKS:
            symbol = f"{code}.IS"
            try:
                if symbol in data:
                    stock_df = data[symbol]
                    if not stock_df.empty and len(stock_df) >= 2:
                        current_price = stock_df['Close'].iloc[-1]
                        prev_price = stock_df['Close'].iloc[-2]
                        volume = stock_df['Volume'].iloc[-1]
                        
                        change = current_price - prev_price
                        change_percent = (change / prev_price) * 100
                        
                        # Get additional info
                        ticker = yf.Ticker(symbol)
                        info = ticker.info
                        
                        stock_info = {
                            "symbol": symbol,
                            "code": code,
                            "name": info.get('longName', code),
                            "price": round(float(current_price), 2),
                            "change": round(float(change), 2),
                            "change_percent": round(float(change_percent), 2),
                            "volume": int(volume),
                            "market_cap": info.get('marketCap', 0),
                            "pe_ratio": round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else None,
                            "week_52_high": round(info.get('fiftyTwoWeekHigh', 0), 2) if info.get('fiftyTwoWeekHigh') else None,
                            "week_52_low": round(info.get('fiftyTwoWeekLow', 0), 2) if info.get('fiftyTwoWeekLow') else None,
                        }
                        
                        stocks_data.append(stock_info)
                        successful += 1
                        log(f"✓ {code}: {stock_info['price']} TL")
                    else:
                        failed += 1
                        log(f"✗ {code}: No data")
                else:
                    failed += 1
                    log(f"✗ {code}: Not in dataset")
            except Exception as e:
                failed += 1
                log(f"✗ {code}: Error - {e}")
        
        # Sort by market cap
        stocks_data.sort(key=lambda x: x.get('market_cap', 0), reverse=True)
        
        # Prepare output
        output_data = {
            "last_update": datetime.now().isoformat(),
            "bist100_index": bist100_data,
            "total_stocks": len(stocks_data),
            "stocks": stocks_data
        }
        
        # Save to JSON
        os.makedirs("public", exist_ok=True)
        output_path = "public/bist_live_data.json"
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)
        
        log(f"\n✅ Success!")
        log(f"Saved to: {output_path}")
        log(f"Successful: {successful}")
        log(f"Failed: {failed}")
        log(f"Total: {len(stocks_data)} stocks")
        
    except Exception as e:
        log(f"ERROR: {e}")
        import traceback
        log(traceback.format_exc())
    
    log_file.close()
    print("Done! Check fetch_log.txt for details")

if __name__ == "__main__":
    main()
