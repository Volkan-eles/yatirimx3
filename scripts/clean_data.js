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
                console.log(`Cleaning ${file}... Extracted ${json.value.length} items from wrapper.`);
                dataToSave = json.value;
            } else if (Array.isArray(json)) {
                console.log(`Cleaning ${file}... Processing ${json.length} items.`);
                dataToSave = json;
            } else {
                console.log(`Warning: structure of ${file} is unknown.`);
            }

            if (dataToSave) {
                // Recursive string fix for all fields
                const fixStrings = (obj) => {
                    if (typeof obj === 'string') {
                        return obj
                            // Lowercase mappings
                            .replace(/Ã¼/g, 'ü')
                            .replace(/Ã§/g, 'ç')
                            .replace(/ÄŸ/g, 'ğ')
                            .replace(/Ä±/g, 'ı')
                            .replace(/Ã¶/g, 'ö')
                            .replace(/ÅŸ/g, 'ş')

                            // Uppercase mappings
                            .replace(/Ãœ/g, 'Ü')
                            .replace(/Ã‡/g, 'Ç')
                            .replace(/Äž/g, 'Ğ')
                            .replace(/Ä°/g, 'İ')
                            .replace(/Ã–/g, 'Ö')
                            .replace(/Åž/g, 'Ş')

                            // Common double-encoded sequences
                            .replace(/Å~/g, 'Ş')

                            // Specific words/patterns from user feedback
                            .replace(/A\.Åž\./g, 'A.Ş.')
                            .replace(/T\.A\.Åž\./g, 'T.A.Ş.')
                            .replace(/A\.Å\./g, 'A.Ş.')  // Also catch single Å
                            .replace(/YatÄ±rÄ±m/g, 'Yatırım')
                            .replace(/OrtaklÄ±ÄŸÄ±/g, 'Ortaklığı')
                            .replace(/Ä°nÅŸaat/g, 'İnşaat')
                            .replace(/DeÄŸerler/g, 'Değerler')
                            .replace(/San\./g, 'San.') // Just to be safe
                            .replace(/Tic\./g, 'Tic.')
                            .replace(/Ã‡imento/g, 'Çimento')
                            .replace(/ÃœstÃ¼/g, 'Üstü')
                            .replace(/NÃ¶tr/g, 'Nötr')
                            .replace(/SaÄŸlÄ±k/g, 'Sağlık')
                            .replace(/MaÄŸazalarÄ±/g, 'Mağazaları')
                            .replace(/DoÄŸuÅŸ/g, 'Doğuş')
                            .replace(/TaÅŸÄ±macÄ±lÄ±ÄŸÄ±/g, 'Taşımacılığı')
                            .replace(/Ä°letiÅŸim/g, 'İletişim')
                            .replace(/BeÅŸiktaÅŸ/g, 'Beşiktaş')
                            .replace(/BankasÄ±/g, 'Bankası')
                            .replace(/BirleÅŸik/g, 'Birleşik')
                            .replace(/TÄ±bbi/g, 'Tıbbi')
                            .replace(/GÃ¼bre/g, 'Gübre')
                            .replace(/DoÄŸu/g, 'Doğu')
                            .replace(/BatÄ±/g, 'Batı')
                            .replace(/SelÃ¼loz/g, 'Selüloz')
                            .replace(/GiriÅŸim/g, 'Girişim')
                            .replace(/AcÄ±selsan/g, 'Acıselsan')
                            .replace(/AcÄ±payam/g, 'Acıpayam')
                            .replace(/TÃ¼rk/g, 'Türk')
                            .replace(/TÃ¼rkiye/g, 'Türkiye')
                            .replace(/TÃ¼praÅŸ/g, 'Tüpraş')
                            .replace(/TofaÅŸ/g, 'Tofaş')
                            .replace(/EreÄŸli/g, 'Ereğli')
                            .replace(/Ãelik/g, 'Çelik')
                            .replace(/TraktÃ¶r/g, 'Traktör')
                            .replace(/Ãimsa/g, 'Çimsa')
                            .replace(/TelekomÃ¼nikasyon/g, 'Telekomünikasyon')
                            .replace(/HavalimanlarÄ±/g, 'Havalimanları')
                            .replace(/KoÃ§/g, 'Koç')
                            .replace(/ArÃ§elik/g, 'Arçelik')
                            .replace(/VakÄ±flar/g, 'Vakıflar')
                            .replace(/HacÄ±/g, 'Hacı')
                            .replace(/Ã–mer/g, 'Ömer')
                            .replace(/SabancÄ±/g, 'Sabancı')
                            .replace(/Åžok/g, 'Şok')
                            .replace(/Ã–zel/g, 'Özel')
                            .replace(/Ä°Ã§/g, 'İç')
                            .replace(/DÄ±ÅŸ/g, 'Dış')
                            .replace(/Ã–nÃ¼/g, 'Önü')
                            .replace(/KatÄ±lÄ±m/g, 'Katılım')
                            .replace(/Ãœretim/g, 'Üretim')
                            .replace(/SabancÄ±/g, 'Sabancı')
                            .replace(/EngÃ¼rÃ¼saÄŸ/g, 'Engürüsağ')
                            .replace(/TaahhÃ¼t/g, 'Taahhüt')
                            .replace(/AkÃ§ansa/g, 'Akçansa')
                            .replace(/Ä°ndeks/g, 'İndeks')
                            .replace(/MÃ¼hendislik/g, 'Mühendislik')
                            .replace(/DoÄŸan/g, 'Doğan')
                            .replace(/Sirketler/g, 'Şirketler')
                            .replace(/Ãœst/g, 'Üst')
                            .replace(/RÃ¶nesans/g, 'Rönesans')
                            .replace(/PoliÃ¼retan/g, 'Poliüretan')
                            .replace(/ÅžiÅŸe/g, 'Şişe')
                            .replace(/YazÄ±lÄ±m/g, 'Yazılım')
                            .replace(/Ã–zak/g, 'Özak')
                            .replace(/GÄ±da/g, 'Gıda')
                            .replace(/Ä°malat/g, 'İmalat')
                            .replace(/Ä°thalat/g, 'İthalat')
                            .replace(/Ä°hracat/g, 'İhracat')
                            .replace(/AkiÅŸ/g, 'Akiş')
                            .replace(/GayrÄ±menkul/g, 'Gayrimenkul')
                            .replace(/Ä°zdemir/g, 'İzdemir')
                            .replace(/BoÄŸaziÃ§i/g, 'Boğaziçi')
                            .replace(/KarabÃ¼k/g, 'Karabük')
                            .replace(/SelÃ§uk/g, 'Selçuk')
                            .replace(/BÃ¼yÃ¼k/g, 'Büyük')
                            .replace(/Åžefler/g, 'Şefler')
                            .replace(/DanÄ±ÅŸmanlÄ±k/g, 'Danışmanlık')
                            .replace(/EÄŸitim/g, 'Eğitim')
                            .replace(/VarlÄ±k/g, 'Varlık')
                            .replace(/YÃ¶netimi/g, 'Yönetimi')
                            .replace(/MaÄŸazacÄ±lÄ±k/g, 'Mağazacılık')
                            .replace(/Ãevre/g, 'Çevre')
                            .replace(/YatÄ±rÄ±mlarÄ±/g, 'Yatırımları')
                            .replace(/BÃ¼yÃ¼k/g, 'Büyük')
                            .replace(/Ä°Ã§ecek/g, 'İçecek')
                            .replace(/BiracÄ±lÄ±k/g, 'Biracılık')
                            .replace(/Ã›lker/g, 'Ülker')
                            .replace(/SÄ±nai/g, 'Sınai')
                            .replace(/KalkÄ±nma/g, 'Kalkınma')
                            .replace(/Ãzel/g, 'Özel')
                            .replace(/MaÃ§kolik/g, 'Maçkolik')
                            .replace(/Ä°Å\s/g, 'İş ')
                            .replace(/Ã/g, '') // Last resort: remove stray chars

                            // Cleanup phantom chars
                            .replace(/Â/g, '')
                            .replace(/Ã¢/g, 'a');
                    } else if (Array.isArray(obj)) {
                        return obj.map(fixStrings);
                    } else if (obj && typeof obj === 'object') {
                        Object.keys(obj).forEach(key => {
                            obj[key] = fixStrings(obj[key]);
                        });
                    }
                    return obj;
                };

                console.log(`Applying character fixes to ${file}...`);
                dataToSave = fixStrings(dataToSave);
                fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
                console.log(`✓ Fixed and saved ${file}`);
            }
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
    }
});
