import requests

# Hedef Fiyat
print("Fetching target prices...")
r = requests.get('https://halkarz.com/api/hedef-fiyat')
r.encoding = 'utf-8'
data = r.json()

# Extract array
if 'value' in data:
    data = data['value']

with open('public/halkarz_target_prices.json', 'w', encoding='utf-8') as f:
    import json
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"✓ Saved {len(data)} items")

# Temettü
print("\nFetching dividends...")
r = requests.get('https://halkarz.com/api/temettu')
r.encoding = 'utf-8'
data = r.json()

if 'value' in data:
    data = data['value']

with open('public/temettu.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"✓ Saved {len(data)} items")

print("\n✓ TAMAMLANDI")
