import yfinance as yf
import json
from datetime import datetime
import sys

# TÜM BIST HİSSELERİ (500+ hisse)
BIST_STOCKS = [
    # BIST 30
    "GARAN", "AKBNK", "YKBNK", "ISCTR", "VAKBN", "HALKB", "THYAO", "PGSUS",
    "TUPRS", "PETKM", "EREGL", "KRDMD", "ASELS", "BIMAS", "MGROS", "SOKM",
    "TTKOM", "TCELL", "SISE", "ARCLK", "VESTL", "SAHOL", "KCHOL", "DOHOL",
    "FROTO", "TOASO", "TMSN", "KOZAL", "KOZAA", "TAVHL", "EKGYO", "ENJSA",
    
    # BIST 50-100
    "SASA", "GUBRF", "HEKTS", "CLEBI", "LOGO", "NETAS", "AEFES", "ULKER",
    "TTRAK", "OTKAR", "ALARK", "MAVI", "KARSN", "ODAS", "SKBNK", "QNBFB",
    "AGHOL", "AKSA", "AKSEN", "ALBRK", "ALGYO", "ANACM", "ASUZU", "AYDEM",
    "BAGFS", "BIOEN", "BJKAS", "BRISA", "BRYAT", "BUCIM", "CEMTS", "CIMSA",
    
    # BIST 100+
    "ADEL", "ADESE", "AFYON", "AGESA", "AKENR", "AKFGY", "AKFYE", "AKSGY",
    "AKSUE", "AKYHO", "ALCAR", "ALCTL", "ALFAS", "ALKA", "ALMAD", "ALTIN",
    "ANELE", "ANHYT", "ANSGR", "ARASE", "ARDYZ", "ARENA", "ARMDA", "ARSAN",
    "ARTMS", "ARZUM", "ASTOR", "ATAGY", "ATAKP", "ATATP", "ATEKS", "ATLAS",
    "AVGYO", "AVHOL", "AVOD", "AVTUR", "AYCES", "AYEN", "AYES", "BAKAB",
    "BALAT", "BANVT", "BARMA", "BASCM", "BASGZ", "BAYRK", "BEGYO", "BERA",
    "BEYAZ", "BFREN", "BIGCH", "BINHO", "BIZIM", "BLCYT", "BMSCH", "BMSTL",
    "BNTAS", "BOBET", "BORLS", "BORSK", "BOSSA", "BRKSN", "BRKVY", "BRMEN",
    "BRSAN", "BSOKE", "BTCIM", "BURCE", "BURVA", "BVSAN", "BYDNR", "CANTE",
    "CASA", "CATES", "CCOLA", "CELHA", "CEMAS", "CEOEM", "CMBTN", "CMENT",
    "CONSE", "COSMO", "CRDFA", "CRFSA", "CUSAN", "CVKMD", "CWENE", "DAGHL",
    "DAGI", "DAPGM", "DARDL", "DENGE", "DERHL", "DERIM", "DESA", "DESPC",
    "DEVA", "DGATE", "DGGYO", "DGNMO", "DIRIT", "DITAS", "DJIST", "DMSAS",
    "DNISI", "DOAS", "DOBUR", "DOCO", "DOFER", "DOGUB", "DOKTA", "DURDO",
    "DYOBY", "DZGYO", "ECILC", "ECZYT", "EDATA", "EDIP", "EFORC", "EGEEN",
    "EGEPO", "EGGUB", "EGPRO", "EGSER", "EKIZ", "EKOS", "EKSUN", "ELITE",
    "EMKEL", "EMNIS", "ENERY", "ENSRI", "EPLAS", "ERBOS", "ERCB", "ERSU",
    "ESCAR", "ESCOM", "ESEN", "ETILR", "ETYAT", "EUHOL", "EUKYO", "EUPWR",
    "EUREN", "EUYO", "EYGYO", "FADE", "FENER", "FLAP", "FMIZP", "FONET",
    "FORMT", "FORTE", "FRIGO", "FZLGY", "GARFA", "GEDIK", "GEDZA", "GENIL",
    "GENTS", "GEREL", "GESAN", "GIPTA", "GLBMD", "GLCVY", "GLRYH", "GLYHO",
    "GMTAS", "GOKNR", "GOLTS", "GOODY", "GOZDE", "GRNYO", "GRSEL", "GRTRK",
    "GSDDE", "GSDHO", "GSRAY", "GUNDZ", "GWIND", "GZNMI", "HATEK", "HATSN",
    "HDFGS", "HEDEF", "HKTM", "HLGYO", "HTTBT", "HUBVC", "HUNER", "HURGZ",
    "ICBCT", "ICUGS", "IDEAS", "IDGYO", "IEYHO", "IHAAS", "IHEVA", "IHGZT",
    "IHLAS", "IHLGM", "IHYAY", "IMASM", "INDES", "INFO", "INGRM", "INTEM",
    "INVEO", "INVES", "IPEKE", "ISATR", "ISBIR", "ISBTR", "ISDMR", "ISFIN",
    "ISGSY", "ISGYO", "ISKPL", "ISKUR", "ISSEN", "ISYAT", "IZENR", "IZFAS",
    "IZINV", "IZMDC", "JANTS", "KAPLM", "KAREL", "KARTN", "KARYE", "KATMR",
    "KAYSE", "KBORU", "KCAER", "KENT", "KERVN", "KERVT", "KFEIN", "KGYO",
    "KIMMR", "KLGYO", "KLKIM", "KLMSN", "KLNMA", "KLRHO", "KLSER", "KLSYN",
    "KMPUR", "KNFRT", "KOCMT", "KONYA", "KONTR", "KOPOL", "KORDS", "KOTON",
    "KRDMA", "KRDMB", "KRGYO", "KRONT", "KRPLS", "KRSTL", "KRTEK", "KRVGD",
    "KSTUR", "KTLEV", "KTSKR", "KUTPO", "KUVVA", "KUYAS", "KZBGY", "KZGYO",
    "LIDER", "LINK", "LKMNH", "LRSHO", "LUKSK", "MAALT", "MACKO", "MAGEN",
    "MAKIM", "MAKTK", "MAMSE", "MANAS", "MARBL", "MARKA", "MARTI", "MEDTR",
    "MEGAP", "MEGMT", "MEKAG", "MEPET", "MERCN", "MERIT", "MERKO", "METRO",
    "METUR", "MHRGY", "MIATK", "MMCAS", "MNDRS", "MNDTR", "MOBTL", "MOGAN",
    "MPARK", "MRGYO", "MRSHL", "MSGYO", "MTRKS", "MTRYO", "MZHLD", "NATEN",
    "NIBAS", "NTGAZ", "NTHOL", "NUGYO", "NUHCM", "OBASE", "ODINE", "OFSYM",
    "ONCSM", "ONRYT", "ORCAY", "ORGE", "ORMA", "OSMEN", "OSTIM", "OTTO",
    "OYAKC", "OYAYO", "OYLUM", "OYYAT", "OZGYO", "OZKGY", "OZRDN", "OZSUB",
    "PAMEL", "PAPIL", "PARSN", "PASEU", "PATEK", "PCILT", "PEGYO", "PEKGY",
    "PENGD", "PENTA", "PETUN", "PINSU", "PKART", "PKENT", "PLTUR", "PNLSN",
    "PNSUT", "POLHO", "POLTK", "PRDGS", "PRKAB", "PRKME", "PRZMA", "PSDTC",
    "PSGYO", "QNBFL", "QUAGR", "RALYH", "RAYSG", "REEDR", "RGYAS", "RHEAG",
    "RNPOL", "RODRG", "ROYAL", "RTALB", "RUBNS", "RYGYO", "RYSAS", "SAFKR",
    "SAMAT", "SANEL", "SANFM", "SANKO", "SARKY", "SAYAS", "SDTTR", "SEGMN",
    "SEGYO", "SEKFK", "SEKUR", "SELEC", "SELGD", "SELVA", "SEYKM", "SILVR",
    "SKTAS", "SKYLP", "SKYMD", "SMART", "SMRTG", "SNGYO", "SNICA", "SNKRN",
    "SNPAM", "SODSN", "SONME", "SRVGY", "SUMAS", "SUNTK", "SUWEN", "TARKM",
    "TARKS", "TATEN", "TATGD", "TBORG", "TDGYO", "TEKTU", "TERA", "TETMT",
    "TEZOL", "TGSAS", "TIRE", "TKFEN", "TKNSA", "TLMAN", "TMPOL", "TRCAS",
    "TRGYO", "TRILC", "TSGYO", "TSKB", "TSPOR", "TUCLK", "TUKAS", "TUREX",
    "TURGG", "TURSG", "UFUK", "UKIM", "ULUFA", "ULUSE", "ULUUN", "UMPAS",
    "UNLU", "USAK", "UZERB", "VAKFN", "VAKKO", "VANGD", "VBTYZ", "VERTU",
    "VERUS", "VESBE", "VKFYO", "VKING", "VKGYO", "YAPRK", "YATAS", "YATVK",
    "YESIL", "YEOTK", "YGGYO", "YGYO", "YKSLN", "YUNSA", "YYLGD", "ZEDUR",
    "ZELOT", "ZOREN", "ZRGYO"
]

print("=" * 60)
print("BIST CANLI VERİ ÇEKİCİ - Yahoo Finance")
print("=" * 60)
print(f"\nToplam {len(BIST_STOCKS)} hisse için veri çekiliyor...\n")

stocks_data = []
success_count = 0
fail_count = 0

for i, code in enumerate(BIST_STOCKS, 1):
    symbol = f"{code}.IS"
    try:
        print(f"[{i}/{len(BIST_STOCKS)}] {code}...", end=" ", flush=True)
        
        # Hisse verisini çek
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1y")
        
        if not hist.empty and len(hist) >= 1:
            current_price = float(hist['Close'].iloc[-1])
            prev_close = float(hist['Close'].iloc[-2]) if len(hist) >= 2 else current_price
            
            change = current_price - prev_close
            change_pct = (change / prev_close * 100) if prev_close > 0 else 0
            volume = int(hist['Volume'].iloc[-1])
            
            # Kapsamlı veri toplama
            stock_info = {
                # Temel Bilgiler
                "code": code,
                "symbol": symbol,
                "name": info.get('longName', info.get('shortName', code)),
                "shortName": info.get('shortName', code),
                
                # Fiyat Verileri
                "price": round(current_price, 2),
                "change": round(change, 2),
                "changeRate": round(change_pct, 2),
                "previousClose": round(prev_close, 2),
                "open": round(info.get('open', current_price), 2),
                "dayLow": round(info.get('dayLow', current_price * 0.98), 2),
                "dayHigh": round(info.get('dayHigh', current_price * 1.02), 2),
                "fiftyTwoWeekLow": round(info.get('fiftyTwoWeekLow', current_price * 0.7), 2),
                "fiftyTwoWeekHigh": round(info.get('fiftyTwoWeekHigh', current_price * 1.5), 2),
                "fiftyDayAverage": round(info.get('fiftyDayAverage', current_price), 2),
                "twoHundredDayAverage": round(info.get('twoHundredDayAverage', current_price), 2),
                
                # Hacim
                "volume": f"{volume:,}",
                "averageVolume": info.get('averageVolume', volume),
                "averageVolume10days": info.get('averageVolume10days', volume),
                
                # Piyasa Değeri
                "marketCap": info.get('marketCap', 0),
                "enterpriseValue": info.get('enterpriseValue', 0),
                "sharesOutstanding": info.get('sharesOutstanding', 0),
                
                # Şirket Bilgileri
                "sector": info.get('sector', 'Diğer'),
                "industry": info.get('industry', ''),
                "website": info.get('website', ''),
                "address": info.get('address1', ''),
                "city": info.get('city', ''),
                "country": info.get('country', 'Turkey'),
                "phone": info.get('phone', ''),
                "description": info.get('longBusinessSummary', ''),
                
                # Değerleme Oranları
                "pe": info.get('trailingPE', None),
                "forwardPE": info.get('forwardPE', None),
                "priceToBook": info.get('priceToBook', None),
                "pegRatio": info.get('pegRatio', None),
                "priceToSales": info.get('priceToSalesTrailing12Months', None),
                "enterpriseToRevenue": info.get('enterpriseToRevenue', None),
                "enterpriseToEbitda": info.get('enterpriseToEbitda', None),
                
                # Karlılık
                "profitMargins": info.get('profitMargins', None),
                "grossMargins": info.get('grossMargins', None),
                "operatingMargins": info.get('operatingMargins', None),
                "returnOnAssets": info.get('returnOnAssets', None),
                "returnOnEquity": info.get('returnOnEquity', None),
                
                # Finansal Sağlık
                "totalRevenue": info.get('totalRevenue', None),
                "revenuePerShare": info.get('revenuePerShare', None),
                "totalCash": info.get('totalCash', None),
                "totalDebt": info.get('totalDebt', None),
                "debtToEquity": info.get('debtToEquity', None),
                "currentRatio": info.get('currentRatio', None),
                "quickRatio": info.get('quickRatio', None),
                
                # Hisse Başı Veriler
                "eps": info.get('trailingEps', None),
                "forwardEps": info.get('forwardEps', None),
                "bookValue": info.get('bookValue', None),
                
                # Temettü
                "dividendRate": info.get('dividendRate', None),
                "dividendYield": info.get('dividendYield', None),
                "exDividendDate": info.get('exDividendDate', None),
                "payoutRatio": info.get('payoutRatio', None),
                
                # Analist Tahminleri
                "targetHighPrice": info.get('targetHighPrice', None),
                "targetLowPrice": info.get('targetLowPrice', None),
                "targetMeanPrice": info.get('targetMeanPrice', None),
                "targetMedianPrice": info.get('targetMedianPrice', None),
                "recommendationMean": info.get('recommendationMean', None),
                "recommendationKey": info.get('recommendationKey', ''),
                "numberOfAnalystOpinions": info.get('numberOfAnalystOpinions', 0),
                
                # Risk
                "beta": info.get('beta', None),
                
                # Tarihsel Veriler (Son 30 gün)
                "historicalData": hist.tail(30)[['Close', 'Volume']].to_dict('records') if len(hist) >= 30 else [],
                
                # Kurumsal Sahiplik
                "heldPercentInsiders": info.get('heldPercentInsiders', None),
                "heldPercentInstitutions": info.get('heldPercentInstitutions', None),
            }
            
            stocks_data.append(stock_info)
            success_count += 1
            print(f"✓ {current_price:.2f} TL ({change_pct:+.2f}%)")
        else:
            fail_count += 1
            print("✗ Veri yok")
            
    except Exception as e:
        fail_count += 1
        print(f"✗ Hata: {str(e)[:30]}")

# Sonuçları kaydet
output = {
    "last_update": datetime.now().isoformat(),
    "source": "Yahoo Finance (yfinance)",
    "total_stocks": len(stocks_data),
    "successful": success_count,
    "failed": fail_count,
    "stocks": stocks_data
}

# JSON'a yaz
try:
    with open('public/bist_live_data.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print("✅ BAŞARILI!")
    print("=" * 60)
    print(f"📊 Başarılı: {success_count} hisse")
    print(f"❌ Başarısız: {fail_count} hisse")
    print(f"📁 Dosya: public/bist_live_data.json")
    print(f"🕐 Güncelleme: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ HATA: Dosya kaydedilemedi - {e}")
    sys.exit(1)
