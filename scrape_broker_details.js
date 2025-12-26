import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeBrokerDetails() {
    console.log("Starting broker detail scraper (optimized)...");

    const brokersPath = path.join(__dirname, 'public', 'brokers_tefas.json');
    if (!fs.existsSync(brokersPath)) {
        console.error("brokers_tefas.json not found!");
        return;
    }

    const brokers = JSON.parse(fs.readFileSync(brokersPath, 'utf-8'));
    console.log(`Loaded ${brokers.length} brokers to scrape.`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        // Optimize: Block images/fonts/css to speed up
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        for (let i = 0; i < brokers.length; i++) {
            const broker = brokers[i];
            console.log(`[${i + 1}/${brokers.length}] Scraping ${broker.name}...`);

            try {
                // Use domcontentloaded for faster navigation
                await page.goto(broker.url, { waitUntil: 'domcontentloaded', timeout: 20000 });

                // Wait for at least one card or timeout quickly
                try {
                    await page.waitForSelector('div.rounded-lg.bg-card h3', { timeout: 4000 });
                } catch (e) {
                    // If timeout, maybe no reports or slower load, continue to evaluate
                }

                // Small buffer for rendering
                await new Promise(r => setTimeout(r, 1000));

                const recommendations = await page.evaluate(() => {
                    const results = [];
                    const cards = Array.from(document.querySelectorAll('div.rounded-lg.bg-card'));

                    cards.forEach(card => {
                        try {
                            const h3 = card.querySelector('h3');
                            if (!h3) return;

                            const symbol = h3.textContent.trim();

                            const dateP = card.querySelector('h3 ~ p') || card.querySelector('p.text-xs.text-muted-foreground');
                            const date = dateP ? dateP.textContent.trim() : null;

                            const recDiv = card.querySelector('div.rounded-full');
                            const recommendation = recDiv ? recDiv.textContent.trim() : null;

                            const targetDiv = card.querySelector('div.text-3xl.font-black');
                            const target_price = targetDiv ? targetDiv.textContent.replace(/\n/g, '').trim() : null;

                            if (symbol && target_price) {
                                results.push({
                                    symbol,
                                    date,
                                    recommendation,
                                    target_price
                                });
                            }
                        } catch (e) {
                            // ignore
                        }
                    });
                    return results;
                });

                // Deduplicate
                const uniqueRecs = [];
                const seen = new Set();
                recommendations.forEach(r => {
                    const key = `${r.symbol}-${r.date}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueRecs.push(r);
                    }
                });

                broker.recommendations = uniqueRecs;
                console.log(`  Found ${uniqueRecs.length} recommendations.`);

            } catch (err) {
                console.error(`  Error scraping ${broker.name}: ${err.message}`);
                broker.recommendations = [];
            }
        }

        fs.writeFileSync(brokersPath, JSON.stringify(brokers, null, 2), 'utf-8');
        console.log("Scraping complete. Updated data saved.");

    } catch (error) {
        console.error("Fatal error:", error);
    } finally {
        await browser.close();
    }
}

scrapeBrokerDetails();
