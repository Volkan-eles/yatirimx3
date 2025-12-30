// Manuel karakter düzeltme - direkt dosyalarda
import fs from 'fs';

const files = ['public/halkarz_target_prices.json', 'public/temettu.json'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');

    // Tek tek tüm bozuk karakterleri değiştir
    content = content
        .replace(/Å\./g, 'Ş.')  // A.Å. -> A.Ş.
        .replace(/Å /g, 'Ş ')
        .replace(/Å"/g, 'Ş"')
        .replace(/Å,/g, 'Ş,');

    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✓ Fixed ${file}`);
});
