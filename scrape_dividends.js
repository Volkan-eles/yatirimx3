import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function scrapeDividends() {
    console.log("Starting scraper...");
    const url = "https://halkarz.com/wp-content/themes/halkarz/json/temettu.json";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://halkarz.com/temettu-takvimi/"
    };

    try {
        console.log(`Fetching data from ${url}...`);
        const response = await axios.get(url, { headers });
        console.log(`Response status: ${response.status}`);

        const data = response.data;
        console.log(`Fetched ${data.length} records.`);

        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        const outputPath = path.join(publicDir, 'temettu.json');
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');

        console.log(`Successfully saved data to ${outputPath}`);

    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

scrapeDividends();
