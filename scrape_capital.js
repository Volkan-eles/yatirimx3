import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

async function scrapeCapitalIncreases() {
    console.log("Starting scraper...");
    const url = "https://halkarz.com/sermaye-artirimi/";
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };

    try {
        console.log(`Requesting ${url}`);
        const response = await axios.get(url, { headers });
        console.log(`Response status: ${response.status}`);

        const $ = cheerio.load(response.data);

        const capitalIncreases = [];
        const tables = $('table');
        console.log(`Found ${tables.length} tables`);

        tables.each((i, table) => {
            // Find type by looking at previous headers
            let sectionType = "Bilinmiyor";

            // Look at all previous siblings to find the nearest header
            let prev = $(table).prevAll('h2, h3, h4').first();
            if (prev.length) {
                const headerText = prev.text().trim().toLowerCase();
                if (headerText.includes('bedelsiz')) sectionType = "Bedelsiz";
                else if (headerText.includes('bedelli')) sectionType = "Bedelli";
                else if (headerText.includes('tahsisli')) sectionType = "Tahsisli";
            }

            // If still unknown, try checking the table caption or preceding text nodes
            if (sectionType === "Bilinmiyor") {
                // Fallback: Check if the table contains specific headers that might indicate type
                // Or check the container id
                const containerId = $(table).closest('div').attr('id');
                if (containerId) {
                    if (containerId.includes('bedelsiz')) sectionType = "Bedelsiz";
                    else if (containerId.includes('bedelli')) sectionType = "Bedelli";
                }
            }

            console.log(`Table ${i} Type: ${sectionType}`);

            // Map columns based on headers if possible
            const headers = $(table).find('th');
            let statusColIndex = -1;
            let dateColIndex = -1;

            headers.each((j, th) => {
                const text = $(th).text().toLowerCase();
                if (text.includes('durum') || text.includes('süreç')) statusColIndex = j;
                if (text.includes('tarih')) dateColIndex = j;
            });

            const rows = $(table).find('tr');
            rows.each((rowIndex, row) => {
                if ($(row).find('th').length > 0) return; // Skip header row

                const cols = $(row).find('td');
                if (cols.length === 0) return;

                try {
                    const company = $(cols[0]).text().trim();
                    // Code extraction
                    let code = "";
                    // Look for code in specific b/strong tags or regex
                    const codeEl = $(cols[0]).find('strong, b');
                    if (codeEl.length) code = codeEl.text().trim();
                    else {
                        const codeMatch = company.match(/([A-Z]{3,5})/);
                        if (codeMatch) code = codeMatch[1];
                        else code = company.substring(0, 5).toUpperCase();
                    }

                    let rate = "";
                    // Heuristic: Col 1 is usually Rate.
                    if (cols.length > 1) rate = $(cols[1]).text().trim();

                    let date = "";
                    let status = "Bekleniyor";

                    // Use identified indices if available, else fallback
                    if (dateColIndex > -1 && cols.length > dateColIndex) {
                        date = $(cols[dateColIndex]).text().trim();
                    } else if (cols.length > 2) {
                        // Fallback: Check if col 2 looks like a date
                        const txt = $(cols[2]).text().trim();
                        if (txt.match(/\d{2}\.\d{2}\.\d{4}/)) date = txt;
                        // Else maybe it's money?
                    }

                    if (statusColIndex > -1 && cols.length > statusColIndex) {
                        const statusText = $(cols[statusColIndex]).text().trim();
                        status = statusText;
                    } else if (cols.length > 3) {
                        // Fallback: Col 3 might be status or date
                        const txt = $(cols[3]).text().trim();
                        if (txt.includes("Onay") || txt.includes("SPK") || txt.includes("Taslak")) status = txt;
                        else if (txt.match(/\d{2}\.\d{2}\.\d{4}/)) date = txt; // Actually a date?
                    }

                    if (sectionType === "Bilinmiyor") {
                        // Try to guess type from rate? No.
                        // Default to Bedelsiz if rate is high? No.
                        // If we fail to detect type, we can't show it correctly.
                        // Let's assume Bedelsiz for first table, Bedelli for second?
                        if (i === 0) sectionType = "Bedelsiz";
                        else if (i === 1) sectionType = "Bedelli";
                        else if (i === 2) sectionType = "Tahsisli";
                    }

                    capitalIncreases.push({
                        code,
                        company,
                        type: sectionType,
                        rate,
                        date,
                        status,
                        description: ""
                    });

                } catch (e) {
                    console.error(`Error parsing row: ${e}`);
                }
            });
        });

        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        const outputPath = path.join(publicDir, 'sermaye_artirimi.json');
        fs.writeFileSync(outputPath, JSON.stringify(capitalIncreases, null, 2), 'utf-8');

        console.log(`Successfully scraped ${capitalIncreases.length} records to ${outputPath}`);

    } catch (error) {
        console.error(`An error occurred: ${error}`);
    }
}

scrapeCapitalIncreases();
