// Tüm piapiri verilerini halkarz formatına dönüştür
const fs = require('fs');

console.log('='.repeat(60));
console.log('Piapiri -> Halkarz Dönüştürme');
console.log('='.repeat(60));

// Verileri yükle
const piapiri = JSON.parse(fs.readFileSync('./public/piapiri_ipos.json', 'utf8'));
console.log(`\nToplam ${piapiri.length} kayıt bulundu`);

const active_ipos = [];
const draft_ipos = [];

// Her kaydı işle
piapiri.forEach((item, idx) => {
    const company = item.company || '';
    const status = item.status || 'Taslak';

    // Code çıkar
    let code = '';
    const match = company.match(/\(([^)]+)\)$/);
    if (match) code = match[1].trim();

    const ipo = {
        code,
        company,
        dates: item.date || '',
        status,
        price: item.price || 'Belirlenmedi',
        lotCount: 'Bilgi Yok',
        distributionType: 'Belirtilmemiş'
    };

    // Kategorize et
    const activeStatuses = ['Talep Toplanıyor', 'Yeni', 'Onaylı', 'Başvuru Sürecinde'];
    if (activeStatuses.includes(status)) {
        active_ipos.push(ipo);
    } else {
        draft_ipos.push(ipo);
    }

    if ((idx + 1) % 100 === 0) {
        console.log(`İşlenen: ${idx + 1}/${piapiri.length}`);
    }
});

console.log(`\nAktif: ${active_ipos.length}`);
console.log(`Taslak: ${draft_ipos.length}`);

// Kaydet
const result = { active_ipos, draft_ipos };
fs.writeFileSync('./public/halkarz_ipos.json', JSON.stringify(result, null, 2), 'utf8');

console.log('\n✅ Başarıyla kaydedildi: public/halkarz_ipos.json');
console.log('='.repeat(60));
