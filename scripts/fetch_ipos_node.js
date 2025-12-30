import fs from 'fs';
import path from 'path';

async function fetchIPOs() {
    const url = 'https://halkarz.com/api/halka-arz';
    const outputPath = 'public/halkarz_ipos.json';

    try {
        console.log(`Fetching from: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('Data fetched successfully');

        // Normalize data structure
        let cleanData = data;
        if (data.value) cleanData = data.value;
        else if (data.Content) cleanData = data.Content;

        // Map to our expected format
        // halkarz.com usually returns a list of IPO objects
        // We need { active_ipos: [], draft_ipos: [] }

        // Let's assume the fetched list are "active" IPOs by default
        // But the user wanted some mapping logic changes.
        // "First IPOs from halkaarz.com -> my site Halka arz" (Active)
        // "Taslak arzlari -> Taslak arzlar" (Draft) - Does the API afford this?
        // Let's dump whatever we get into active_ipos first, and if appropriate, draft.

        // If cleanData is an array, it's likely the list of IPOs
        const ipos = Array.isArray(cleanData) ? cleanData : (cleanData.active_ipos || []);

        // Fix encoding for fields if needed (Node.js fetch text() handling is usually good with UTF-8, 
        // but we apply our utility fix just in case if we were processing text, 
        // but here we parsed JSON directly. The JSON parser should handle UTF-8 correctly 
        // IF the response headers were correct. If not, might need manual text fix.)

        const finalOutput = {
            active_ipos: ipos,
            draft_ipos: [] // halkaarz.com API might not give drafts easily in the same endpoint
        };

        // Manually fix known encoding issues in specific fields if strictly necessary, 
        // but let's trust Node.js JSON parse first.

        fs.writeFileSync(path.resolve(outputPath), JSON.stringify(finalOutput, null, 2), 'utf-8');
        console.log(`✓ Saved ${ipos.length} IPOs to ${outputPath}`);

    } catch (err) {
        console.error('Error fetching IPOs:', err);
        // Don't overwrite with empty if failed, unless file doesn't exist
        if (!fs.existsSync(outputPath)) {
            fs.writeFileSync(path.resolve(outputPath), JSON.stringify({ active_ipos: [], draft_ipos: [] }, null, 2), 'utf-8');
        }
    }
}

fetchIPOs();
