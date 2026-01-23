import json
import os

file_path = 'public/halkarz_ipos.json'

print(f"Reading from {os.path.abspath(file_path)}")

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Current first item: {data['active_ipos'][0]['company']}")

    new_items = [
        {
            'code': 'KOD_YOK',
            'company': 'Akhan Un Fabrikası ve Tarım Ürünleri Gıda Sanayi Tic. A.Ş.',
            'dates': 'Hazırlanıyor...',
            'status': 'Yeni!',
            'logo': 'https://halkarz.com/wp-content/uploads/2024/07/AKHANUN.jpg',
            'url': 'https://halkarz.com/akhan-un-fabrikasi-ve-tarim-urunleri-gida-sanayi-tic-a-s/',
            'price': '21,50 TL',
            'lotCount': '54.7 Milyon',
            'distributionType': 'Eşit Dağıtım',
            'market': 'Ana Pazar',
            'floatingRate': '%20,01',
            'totalSize': '1,1 Milyar TL',
            'slug': 'akhan-un-fabrikasi-ve-tarim-urunleri-gida-sanayi-tic-a-s'
        },
        {
            'code': 'KOD_YOK',
            'company': 'Netcad Yazılım A.Ş.',
            'dates': 'Hazırlanıyor...',
            'status': 'Yeni!',
            'logo': 'https://halkarz.com/wp-content/uploads/2022/03/NETCD-2.jpg',
            'url': 'https://halkarz.com/netcad-yazilim-a-s/',
            'price': '46,00 TL',
            'lotCount': '36.5 Milyon',
            'distributionType': 'Eşit Dağıtım',
            'market': 'Ana Pazar',
            'floatingRate': '%27,61',
            'slug': 'netcad-yazilim-a-s'
        }
    ]

    # Filter out if they exist
    existing = data.get('active_ipos', [])
    filtered = [x for x in existing if x['company'] not in [
        'Akhan Un Fabrikası ve Tarım Ürünleri Gıda Sanayi Tic. A.Ş.',
        'Netcad Yazılım A.Ş.',
        'Akhan Un', # Handle short names if present
        'Netcad'
    ]]

    # Prepend
    data['active_ipos'] = new_items + filtered

    print(f"New first item: {data['active_ipos'][0]['company']}")
    print(f"New second item: {data['active_ipos'][1]['company']}")

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Saved successfully.")

except Exception as e:
    print(f"Error: {e}")
