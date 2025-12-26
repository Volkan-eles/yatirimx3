import re

text = """
25-26 Aralık 2025Halka Arz Fiyatı/Aralığı : 19,50 TLDağıtım Yöntemi : Eşit Dağıtım **Pay : 47,000,000 Lot
"""

regex = r'Halka\s*Arz\s*Fiyatı.*?(\d+[,.]\d{2})'
match = re.search(regex, text, re.IGNORECASE | re.DOTALL)

if match:
    print(f"MATCH: {match.group(0)}")
    print(f"GROUP 1: {match.group(1)}")
else:
    print("NO MATCH")
