import sys
import os

# Write everything to a log file
log = open("simple_test_log.txt", "w", encoding="utf-8")

try:
    log.write("Step 1: Importing yfinance...\n")
    log.flush()
    import yfinance as yf
    log.write("SUCCESS: yfinance imported\n")
    log.flush()
    
    log.write("\nStep 2: Testing with GARAN.IS...\n")
    log.flush()
    ticker = yf.Ticker("GARAN.IS")
    log.write("SUCCESS: Ticker created\n")
    log.flush()
    
    log.write("\nStep 3: Fetching history...\n")
    log.flush()
    hist = ticker.history(period="1d")
    log.write(f"SUCCESS: Got {len(hist)} rows\n")
    log.flush()
    
    if not hist.empty:
        price = hist['Close'].iloc[-1]
        log.write(f"\nGARAN Price: {price:.2f} TL\n")
        log.flush()
        
        # Try to save simple JSON
        log.write("\nStep 4: Saving JSON...\n")
        log.flush()
        import json
        data = {
            "test": "success",
            "garan_price": float(price)
        }
        
        os.makedirs("public", exist_ok=True)
        with open("public/test_data.json", "w") as f:
            json.dump(data, f, indent=2)
        
        log.write("SUCCESS: JSON saved to public/test_data.json\n")
        log.flush()
    else:
        log.write("ERROR: No data returned\n")
        log.flush()
        
except Exception as e:
    log.write(f"\nERROR: {e}\n")
    log.flush()
    import traceback
    log.write(traceback.format_exc())
    log.flush()

log.write("\n=== TEST COMPLETE ===\n")
log.close()
print("Test complete! Check simple_test_log.txt")
