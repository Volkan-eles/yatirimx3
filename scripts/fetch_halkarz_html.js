import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchIPOs() {
    const url = 'https://halkarz.com/';
    const outputPath = 'public/halkarz_ipos.json';

    try {
        console.log(`Fetching HTML from: ${url}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);
        console.log('HTML fetched and parsed.');

        const activeIPOs = [];
        const draftIPOs = [];

        // Halka Arzlar usually in a specific container. 
        // Based on typical Wordpress/site structures, looking for lists or grid items.
        // The text showed "İlk Halka Arzlar" and "Taslak Arzlar".
        // Let's try to find headers and their following lists.

        // Strategy: specific known IPOs from the chunk to identify selectors.
        // "Menkul Değerler" often appears in draft list.
        // "Meysu Gıda" appears in active?

        /* 
           Structure Analysis (Hypothetical but common):
           The site likely has tabs or sections.
           We'll look for any anchor containing "halkarz.com/" that looks like an IPO page.
        */

        // Try to identify "Yeni Halka Arzlar" section (Active)
        // Often these are in a widget or main list.
        // Let's grab ALL links that look like IPOs and try to categorize them if possible,
        // or just grab the first N as active if we can't distinguish.

        // BUT, the user specifically mentioned "Taslak Arzlar" (Drafts).
        // Let's guess the structure based on "Taslak Arzlar" text.

        // Finding "Taslak Arzlar" header
        let draftHeader = $('h3:contains("Taslak Arzlar"), h2:contains("Taslak Arzlar"), h4:contains("Taslak Arzlar"), strong:contains("Taslak Arzlar")').first();

        // If header found, look for list items nearby
        if (draftHeader.length) {
            console.log('Found Draft IPOs header');
            // Traverse to next list
            let draftContainer = draftHeader.closest('div').find('ul').first();
            if (!draftContainer.length) {
                draftContainer = draftHeader.nextAll('ul').first();
            }

            if (draftContainer.length) {
                draftContainer.find('li').each((i, el) => {
                    const link = $(el).find('a');
                    if (link.length) {
                        const title = link.text().trim();
                        const href = link.attr('href');
                        if (title && href) {
                            draftIPOs.push({
                                company: title,
                                link: href,
                                status: 'Taslak',
                                code: ''
                            });
                        }
                    }
                });
            }
        }

        // If we can't pinpoint draft section easily, we might resort to parsing all links and filtering.
        // But let's try a more generic approach for "Active":
        // Usually the "Home" page lists active/new ones prominently.

        // Let's look for article tags or specific classes for posts
        $('.post-item, article').each((i, el) => {
            // This might catch blog posts too, but improved filtering needed.
            const titleEl = $(el).find('h2, h3, .title');
            const linkEl = $(el).find('a').first();
            const statusEl = $(el).find('.cat-links, .status'); // Hyp.

            const title = titleEl.text().trim() || linkEl.text().trim();
            const href = linkEl.attr('href');

            // Heuristic: specific keywords in IPO titles often contain "A.Ş." or "Halka Arz"
            if (href && href.includes('halkarz.com') && (title.includes('A.Ş.') || title.includes('Sanayi') || title.includes('Holding'))) {

                // Avoid duplicates if already in draft
                if (draftIPOs.some(d => d.link === href)) return;

                // Add to active (limit to top 10 recent)
                if (activeIPOs.length < 15) {
                    activeIPOs.push({
                        company: title,
                        link: href,
                        status: 'Aktif/Yeni', // hard to distinguish without more parsing
                        code: ''
                    });
                }
            }
        });

        // Fallback: If "Draft" header approach failed, try to find the "Taslak Arzlar" 195 link
        // The chunk said "İlk Halka Arzlar / Taslak Arzlar 195". Maybe it's a menu item?
        // If we can't find drafts, we'll leave it empty or map some 'active' ones there if requested.

        // Refined extraction logic:
        // Use the exact link structure if possible.

        const finalOutput = {
            active_ipos: activeIPOs,
            draft_ipos: draftIPOs
        };

        fs.writeFileSync(path.resolve(outputPath), JSON.stringify(finalOutput, null, 2), 'utf-8');
        console.log(`✓ Scraped ${activeIPOs.length} Active and ${draftIPOs.length} Draft IPOs`);

    } catch (err) {
        console.error('Error fetching HTML:', err.message);
    }
}

fetchIPOs();
