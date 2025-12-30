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

            // Fix encoding issues (Mojibake fix)
            // This maps common UTF-8 byte sequences interpreted as Windows-1252/ISO-8859-1 back to Turkish chars
            content = content
                .replace(/Ã‡/g, 'Ç')
                .replace(/Ã¼/g, 'ü')
                .replace(/Ã§/g, 'ç')
                .replace(/ÄŸ/g, 'ğ')
                .replace(/Ä±/g, 'ı')
                .replace(/Ã¶/g, 'ö')
                .replace(/ÅŸ/g, 'ş')
                .replace(/Ã–/g, 'Ö')
                .replace(/Åž/g, 'Ş')
                .replace(/Ä°/g, 'İ')
                .replace(/Ãœ/g, 'Ü')
                .replace(/Â/g, ''); // Remove phantom 'Â' char often appearing with spaces

            const json = JSON.parse(content);

            let dataToSave = null;

            if (json.value && Array.isArray(json.value)) {
                console.log(`Cleaning ${file}... Extracted ${json.value.length} items.`);
                dataToSave = json.value;
            } else if (Array.isArray(json)) {
                console.log(`${file} is already an array.`);
                dataToSave = json;
            } else {
                console.log(`Warning: structure of ${file} is unknown.`);
            }

            if (dataToSave) {
                // Recursive string fix for all fields
                const fixStrings = (obj) => {
                    if (typeof obj === 'string') {
                        return obj.replace(/Ã‡/g, 'Ç').replace(/Ã¼/g, 'ü').replace(/Ã§/g, 'ç')
                            .replace(/ÄŸ/g, 'ğ').replace(/Ä±/g, 'ı').replace(/Ã¶/g, 'ö')
                            .replace(/ÅŸ/g, 'ş').replace(/Ã–/g, 'Ö').replace(/Åž/g, 'Ş')
                            .replace(/Ä°/g, 'İ').replace(/Ãœ/g, 'Ü').replace(/Â/g, '');
                    } else if (Array.isArray(obj)) {
                        return obj.map(fixStrings);
                    } else if (obj && typeof obj === 'object') {
                        Object.keys(obj).forEach(key => {
                            obj[key] = fixStrings(obj[key]);
                        });
                    }
                    return obj;
                };

                dataToSave = fixStrings(dataToSave);
                fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
            }
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
    }
});
```
