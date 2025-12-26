import yfinance as yf
import json
from datetime import datetime

# Test with just a few stocks first
test_stocks = ["GARAN", "AKBNK", "THYAO", "EREGL", "TUPRS"]

print("Testing yfinance...")

# Add .IS suffix
symbols = [f"{code}.IS" for code in test_stocks]

# Download data
print(f"Downloading {len(symbols)} stocks...")
data = yf.download(symbols, period="1d", progress=False, group_by='ticker')

print("Processing data...")
stocks_data = []

for code in test_stocks:
    symbol = f"{code}.IS"
    try:
        if symbol in data.columns.levels[0]:
            stock_df = data[symbol]
            if not stock_df.empty:
                price = stock_df['Close'].iloc[-1]
                volume = stock_df['Volume'].iloc[-1]
                
                stocks_data.append({
                    "code": code,
                    "symbol": symbol,
                    "price": float(price),
                    "volume": int(volume)
                })
                print(f"{code}: {price:.2f} TL")
    except Exception as e:
        print(f"{code}: Error - {e}")

# Save
output = {
    "last_update": datetime.now().isoformat(),
    "stocks": stocks_data
}

with open("public/bist_test.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(stocks_data)} stocks to public/bist_test.json")
