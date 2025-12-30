import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchDetails(link) {
    try {
        const response = await axios.get(link, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0' },
            timeout: 5000
        });
        const $ = cheerio.load(response.data);

        // Extract Details
        let code = '';
        let price = '';
        let dates = '';
        let distributionType = '';
        let lotCount = '';

        // Create regex for common patterns
        // "Fiyat: 50,00 TL" or "Halka Arz Fiyatı: 50 TL"
        const priceRegex = /(?:Halka Arz Fiyatı|Fiyat)\s*[:]?\s*([\d,.]+)\s*TL/i;
        const codeRegex = /\(([A-Z]{3,5})\)/;
        const dateRegex = /(?:Tarih|Talep Toplama)\s*[:]?\s*(\d{1,2}.*?\d{4})/;
        // Draft specific regex
        const draftDateRegex = /(?:Tahmini Halka Arz Takvimi)\s*[:]?\s*(.*?)(?:\n|$)/i;
        const lotRegex = /(?:Sermaye Artırımı|Ortak Satışı)\s*[:]?\s*([\d.]+\s*Lot)/i;

        // Find main content container to avoid sidebar noise
        const content = $('.entry-content, .post-content, article').first();
        if (content.length) {
            const text = content.text();

            // Extract Code
            const title = $('h1').first().text();
            const codeMatch = title.match(codeRegex);
            if (codeMatch) code = codeMatch[1];

            // Extract Price
            const priceMatch = text.match(priceRegex);
            if (priceMatch) price = priceMatch[1];

            // Extract Date (Try standard, then draft)
            const dateMatch = text.match(dateRegex);
            if (dateMatch) dates = dateMatch[1];
            else {
                const draftDateMatch = text.match(draftDateRegex);
                if (draftDateMatch) dates = draftDateMatch[1].trim(); // e.g. "2025 yılı içerisinde..."
            }

            // Extract Distribution (simple search)
            if (text.includes('Eşit Dağıtım')) distributionType = 'Eşit Dağıtım';
            else if (text.includes('Oransal Dağıtım')) distributionType = 'Oransal Dağıtım';

            // Extract Lot (searching for "Lot" pattern)
            const lotMatch = text.match(lotRegex);
            if (lotMatch) lotCount = lotMatch[1];
        } else {
            // Fallback to list search if content block not found
            $('li').each((i, el) => {
                const text = $(el).text();
                if (text.match(priceRegex)) price = text.match(priceRegex)[1];
                if (text.match(dateRegex)) dates = text.match(dateRegex)[1];
            });
        }

        return { code, price, dates, distributionType, lotCount };
    } catch (e) {
        console.error(`Error details for ${link}: ${e.message}`);
        return {};
    }
}

async function fetchIPOs() {
    const outputPath = 'public/halkarz_ipos.json';
    const activeIPOs = [];
    const draftIPOs = [];

    try {
        // 1. Fetch Active IPOs from Main Page (limited to top 6 to save time/bandwidth)
        console.log(`Fetching Main Page...`);
        const mainRes = await axios.get('https://halkarz.com/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $main = cheerio.load(mainRes.data);

        // Select potential IPO posts (adjust selector based on site)
        // Usually recent posts on home page
        const seenLinks = new Set();
        const activeLinks = [];

        $main('article, .post-item').each((i, el) => {
            const link = $main(el).find('a').attr('href');
            const title = $main(el).find('h2, h3').text().trim();

            if (link && link.includes('halkarz.com') && !seenLinks.has(link)) {
                if (title.includes('A.Ş.') || title.includes('Holding')) {
                    seenLinks.add(link);
                    activeLinks.push({ title, link });
                }
            }
        });

        console.log(`Found ${activeLinks.length} potential active IPOs. Processing top 4...`);

        for (const item of activeLinks.slice(0, 4)) {
            const details = await fetchDetails(item.link);
            activeIPOs.push({
                company: item.title,
                link: item.link,
                status: 'Yeni',
                code: details.code || '',
                price: details.price || 'Belirlenmedi',
                dates: details.dates || 'Tarih Yok',
                distributionType: details.distributionType || 'Bilinmiyor',
                lotCount: details.lotCount || 'Belirtilmedi'
            });
            // Be nice to server
            await new Promise(r => setTimeout(r, 500));
        }

        // 2. Fetch Draft IPOs from Category Page
        console.log(`Fetching Draft Page...`);
        const draftRes = await axios.get('https://halkarz.com/k/taslak/', {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $draft = cheerio.load(draftRes.data);

        const draftLinks = [];
        $draft('article, .post-item').each((i, el) => {
            const link = $draft(el).find('a').attr('href');
            const title = $draft(el).find('h2, h3').text().trim();

            if (link && title && !draftIPOs.some(d => d.link === link)) {
                draftLinks.push({ title, link });
            }
        });

        console.log(`Found ${draftLinks.length} Draft IPOs. Processing top 20...`);

        // Fetch details for top 20 drafts to ensure data isn't empty
        for (const item of draftLinks.slice(0, 20)) {
            const details = await fetchDetails(item.link);
            draftIPOs.push({
                company: item.title,
                link: item.link,
                status: 'Taslak',
                code: details.code || '',
                price: details.price || 'Belirlenmedi',
                dates: details.dates || 'Tarih Bekleniyor',
                distributionType: details.distributionType || 'Bilinmiyor',
                lotCount: details.lotCount || 'Belirtilmedi'
            });
            await new Promise(r => setTimeout(r, 500));
        }

        console.log(`Found ${draftIPOs.length} Draft IPOs.`);

        const finalOutput = {
            active_ipos: activeIPOs,
            draft_ipos: draftIPOs.slice(0, 50) // Limit drafts
        };

        fs.writeFileSync(path.resolve(outputPath), JSON.stringify(finalOutput, null, 2), 'utf-8');
        console.log(`✓ Saved ${activeIPOs.length} Active and ${draftIPOs.length} Draft IPOs`);

    } catch (err) {
        console.error('Error fetching IPOs:', err.message);
    }
}

fetchIPOs();
