import fs from 'fs';
import path from 'path';

const filePath = path.join('public', 'halkarz_ipos.json');

console.log(`Reading from ${filePath}`);

try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    if (data.active_ipos && data.active_ipos.length > 0) {
        console.log(`Current first item: ${data.active_ipos[0].company}`);
    } else {
        console.log("active_ipos is empty or undefined");
    }

    const newItems = [
        {
            "code": "KOD_YOK",
            "company": "Akhan Un Fabrikası ve Tarım Ürünleri Gıda Sanayi Tic. A.Ş.",
            "dates": "Hazırlanıyor...",
            "status": "Yeni!",
            "logo": "https://halkarz.com/wp-content/uploads/2024/07/AKHANUN.jpg",
            "url": "https://halkarz.com/akhan-un-fabrikasi-ve-tarim-urunleri-gida-sanayi-tic-a-s/",
            "price": "21,50 TL",
            "lotCount": "54.7 Milyon",
            "distributionType": "Eşit Dağıtım",
            "market": "Ana Pazar",
            "floatingRate": "%20,01",
            "totalSize": "1,1 Milyar TL",
            "slug": "akhan-un-fabrikasi-ve-tarim-urunleri-gida-sanayi-tic-a-s"
        },
        {
            "code": "KOD_YOK",
            "company": "Netcad Yazılım A.Ş.",
            "dates": "Hazırlanıyor...",
            "status": "Yeni!",
            "logo": "https://halkarz.com/wp-content/uploads/2022/03/NETCD-2.jpg",
            "url": "https://halkarz.com/netcad-yazilim-a-s/",
            "price": "46,00 TL",
            "lotCount": "36.5 Milyon",
            "distributionType": "Eşit Dağıtım",
            "market": "Ana Pazar",
            "floatingRate": "%27,61",
            "slug": "netcad-yazilim-a-s"
        }
    ];

    // Filter existing
    const existing = data.active_ipos || [];
    const filtered = existing.filter(x =>
        x.company !== "Akhan Un Fabrikası ve Tarım Ürünleri Gıda Sanayi Tic. A.Ş." &&
        x.company !== "Netcad Yazılım A.Ş."
    );

    data.active_ipos = [...newItems, ...filtered];

    console.log(`New first item: ${data.active_ipos[0].company}`);
    console.log(`New second item: ${data.active_ipos[1].company}`);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Saved successfully.");

} catch (e) {
    console.error("Error:", e);
}
