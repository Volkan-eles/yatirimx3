// scripts/clean_data.js
import fs from 'fs';
import path from 'path';

const files = [
    'public/halkarz_target_prices.json',
    'public/temettu.json'
];

files.forEach(file => {
    try {
        const filePath = path.resolve(file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            // Remove BOM if exists
            content = content.replace(/^\uFEFF/, '');

            const json = JSON.parse(content);

            if (json.value && Array.isArray(json.value)) {
                console.log(`Cleaning ${file}... Extracted ${json.value.length} items.`);
                fs.writeFileSync(filePath, JSON.stringify(json.value, null, 2), 'utf-8');
            } else if (Array.isArray(json)) {
                console.log(`${file} is already an array.`);
            } else {
                console.log(`Warning: structure of ${file} is unknown.`);
            }
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
    }
});
