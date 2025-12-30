import fs from 'fs';
import path from 'path';
import axios from 'axios';

async function fetchIPOs() {
    const url = 'https://halkarz.com/api/halka-arz';
    const outputPath = 'public/halkarz_ipos.json';

    try {
        console.log(`Fetching from: ${url}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const data = response.data;
        console.log('Data fetched successfully');
        console.log('Data keys:', Object.keys(data));

        // Normalize data structure
        let cleanData = data;
        if (data.value) cleanData = data.value;
        else if (data.Content) cleanData = data.Content;

        let activeIPOs = [];
        let draftIPOs = []; // API might not afford this, but let's check structure

        if (Array.isArray(cleanData)) {
            // Assume these are the 'active' ones
            activeIPOs = cleanData;
        } else if (cleanData && typeof cleanData === 'object') {
            // Maybe it has keys like 'active', 'draft'?
            // Let's inspect active fields
            if (cleanData.active_ipos) activeIPOs = cleanData.active_ipos;
            if (cleanData.draft_ipos) draftIPOs = cleanData.draft_ipos;
        }

        // Use user logic:
        // "halkaarz.com da ilk halka arzları benim sitemde Halka arz" -> Active goes to Active
        // "taslak arzları da taslak arzlara çek" -> Draft goes to Draft

        // If the API only gives one list, maybe we populate *both* or just Active?
        // Let's populate Active with what we got.
        // If API has draft_ipos, populate Draft.

        // IMPORTANT: The user said "taslak arzları da taslak arzlara çek".
        // This implies `halkarz.com` has drafts.
        // If `cleanData` is just an array, we might not have drafts.

        const finalOutput = {
            active_ipos: activeIPOs,
            draft_ipos: draftIPOs
        };

        fs.writeFileSync(path.resolve(outputPath), JSON.stringify(finalOutput, null, 2), 'utf-8');
        console.log(`✓ Saved ${activeIPOs.length} Active and ${draftIPOs.length} Draft IPOs to ${outputPath}`);
        console.log('Sample Active:', activeIPOs[0] ? activeIPOs[0].company : 'None');

    } catch (err) {
        console.error('Error fetching IPOs:', err.message);
    }
}

fetchIPOs();
