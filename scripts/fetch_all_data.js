// Tüm verileri düzgün encoding ile çeker
import fs from 'fs';
import path from 'path';

async function fetchData(url, outputPath) {
    try {
        console.log(`Fetching: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Get as text first, then manually fix encoding
        let text = await response.text();

        // Fix common Windows-1254 -> UTF-8 mojibake
        text = text
            .replace(/Ã‡/g, 'Ç').replace(/Ã¼/g, 'ü').replace(/Ã§/g, 'ç')
            .replace(/ÄŸ/g, 'ğ').replace(/Ä±/g, 'ı').replace(/Ã¶/g, 'ö')
            .replace(/ÅŸ/g, 'ş').replace(/Ã–/g, 'Ö').replace(/Åž/g, 'Ş')
            .replace(/Ä°/g, 'İ').replace(/Ãœ/g, 'Ü').replace(/Äž/g, 'Ğ')
            .replace(/Â/g, '');

        const data = JSON.parse(text);

        // Extract array if wrapped
        let finalData = data;
        if (data.value && Array.isArray(data.value)) {
            finalData = data.value;
        }

        const filePath = path.resolve(outputPath);
        fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf-8');
        console.log(`✓ Saved: ${outputPath} (${finalData.length} items)`);
        return true;
    } catch (err) {
        console.error(`✗ Error (${outputPath}):`, err.message);
        return false;
    }
}

async function main() {
    console.log('='.repeat(50));
    console.log('VERİ ÇEKME BAŞLADI');
    console.log('='.repeat(50));

    const tasks = [
        {
            name: 'Hedef Fiyatlar',
            url: 'https://halkarz.com/api/hedef-fiyat',
            output: 'public/halkarz_target_prices.json'
        },
        {
            name: 'Temettüler',
            url: 'https://halkarz.com/api/temettu',
            output: 'public/temettu.json'
        }
    ];

    let success = 0;
    let failed = 0;

    for (const task of tasks) {
        console.log(`\n[${task.name}]`);
        const result = await fetchData(task.url, task.output);
        if (result) success++;
        else failed++;

        // Small delay between requests
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n' + '='.repeat(50));
    console.log(`TAMAMLANDI: ${success} başarılı, ${failed} hatalı`);
    console.log('='.repeat(50));

    process.exit(failed > 0 ? 1 : 0);
}

main();
