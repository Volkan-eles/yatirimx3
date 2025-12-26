import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

async function scrapeBrokers() {
    console.log("Starting broker scraper...");
    const url = "https://tefasfon.com/araci-kurumlar/";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Referer": "https://tefasfon.com/"
    };

    try {
        console.log(`Fetching data from ${url}...`);
        const response = await axios.get(url, { headers });
        console.log(`Response status: ${response.status}`);

        const $ = cheerio.load(response.data);
        const brokers = [];

        // Select the main list container - based on the text content seen in view_content_chunk, 
        // it seems to be a list of items. We need to find the specific selector.
        // Inspecting proper selectors usually requires view_source, but based on the text structure:
        // [İş Yatırım#2 Sırada...] indicates links or list items.
        // We will iterate over common containers.

        // Attempting to find list items that contain "Sırada" text or links to /araci-kurumlar/
        $('a[href*="/araci-kurumlar/"]').each((i, el) => {
            const href = $(el).attr('href');
            // Exclude the main page link itself if present
            if (href === "https://tefasfon.com/araci-kurumlar/" || href === "/araci-kurumlar/") return;

            const name = $(el).find('h3, h2, strong, span').first().text().trim() || $(el).text().trim();

            // Extract stats if available in text or children
            const text = $(el).text();
            const reportMatch = text.match(/Toplam Rapor\s*(\d+)/i);
            const reportCount = reportMatch ? parseInt(reportMatch[1]) : 0;

            // Only valid brokers likely have report counts
            if (reportCount > 0 || name.length > 0) {
                brokers.push({
                    name: name.split('#')[0].trim(), // Clean up if extraction gets messy
                    url: href.startsWith('http') ? href : `https://tefasfon.com${href}`,
                    total_reports: reportCount
                });
            }
        });

        // Remove duplicates based on URL
        const uniqueBrokers = Array.from(new Map(brokers.map(item => [item.url, item])).values());
        console.log(`Found ${uniqueBrokers.length} brokers.`);

        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        const outputPath = path.join(publicDir, 'brokers_tefas.json');
        fs.writeFileSync(outputPath, JSON.stringify(uniqueBrokers, null, 2), 'utf-8');

        console.log(`Successfully saved data to ${outputPath}`);

    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

scrapeBrokers();
