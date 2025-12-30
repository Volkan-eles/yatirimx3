import fs from 'fs';

// Read and fix data files directly
const files = ['public/halkarz_target_prices.json', 'public/temettu.json'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');

    // Direct byte-level replacements
    const before = content.length;
    content = content
        .replace(/Å\./g, 'Ş.')
        .replace(/Å\s/g, 'Ş ')
        .replace(/Å"/g, 'Ş"')
        .replace(/Å,/g, 'Ş,')
        .replace(/Å\}/g, 'Ş}');

    const after = content.length;
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✓ ${file}: ${before - after} bytes changed`);
});

console.log('\n✓ DONE - All Å replaced with Ş');
