import json
import sys

files = ['public/halkarz_target_prices.json', 'public/temettu.json']

for filepath in files:
    try:
        # Read with UTF-8
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix all broken chars
        fixed = (content
            .replace('Å.', 'Ş.')
            .replace('Å ', 'Ş ')
            .replace('Å"', 'Ş"')
            .replace('Å,', 'Ş,')
            .replace('Å}', 'Ş}')
            .replace('Åž', 'Ş')
            .replace('ÅŸ', 'ş')
            .replace('Ä°', 'İ')
            .replace('Ä±', 'ı')
            .replace('ÄŸ', 'ğ')
            .replace('Äž', 'Ğ')
        )
        
        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        
        print(f'✓ Fixed {filepath}')
    except Exception as e:
        print(f'✗ Error {filepath}: {e}')

print('\n✓ DONE')
