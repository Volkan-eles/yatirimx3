import yfinance as yf
import json
import sys

# Write to file instead of stdout
with open("test_output.txt", "w", encoding="utf-8") as log:
    log.write("Testing yfinance with BIST stocks...\n")
    
    # Test a few stocks
    test_stocks = ["GARAN", "AKBNK", "THYAO"]
    
    for code in test_stocks:
        try:
            ticker = yf.Ticker(f"{code}.IS")
            hist = ticker.history(period="1d")
            if not hist.empty:
                price = hist['Close'].iloc[-1]
                log.write(f"{code}: {price:.2f} TL\n")
            else:
                log.write(f"{code}: No data\n")
        except Exception as e:
            log.write(f"{code}: Error - {e}\n")
    
    log.write("Test complete!\n")

print("Results written to test_output.txt")
