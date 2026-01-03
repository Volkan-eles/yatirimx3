const fs = require('fs');

// Pi apiri verilerini yükle
console.log('Piapiri verileri yükleniyor...');
const piapiriData = JSON.parse(fs.readFileSync('public/piapiri_ipos.json', 'utf8'));

console.log(`${piapiriData.length} halka arz verisi bulundu`);

// Dönüştür
const active_ipos = [];
const draft_ipos = [];

piapiriData.forEach((item, idx) => {
    const company = item.company || '';
    const status = item.status || 'Taslak';

    // Code çıkar
    let code = '';
    if (company.includes('(') && company.includes(')')) {
        code = company.split('(').pop().replace(')', '').trim();
    }

    const ipoItem = {
        code,
        company,
        dates: item.date || '',
        status: status || 'Taslak',
        price: item.price || 'Belirlenmedi',
        lotCount: 'Bilgi Yok',
        distributionType: 'Belirtilmemiş'
    };

    // Kategorize et
    if (['Talep Toplanıyor', 'Yeni', 'Onaylı', 'Başvuru Sürecinde'].includes(status)) {
        active_ipos.push(ipoItem);
    } else {
        draft_ipos.push(ipoItem);
    }

    if ((idx + 1) % 100 === 0) {
        console.log(`İşlenen: ${idx + 1}/${piapiriData.length}`);
    }
});

const result = {
    active_ipos,
    draft_ipos
};

// Kaydet
fs.writeFileSync('public/halkarz_ipos.json', JSON.stringify(result, null, 2), 'utf8');

console.log('\n✅ Tamamlandı!');
console.log(`Aktif: ${active_ipos.length}`);
console.log(`Taslak: ${draft_ipos.length}`);
console.log(`Toplam: ${piapiriData.length}`);
