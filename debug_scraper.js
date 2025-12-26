import puppeteer from 'puppeteer';
import fs from 'fs';

async function debugScraper() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Alnus Yatırım URL
    const url = "https://tefasfon.com/araci-kurumlar/alnus-yatirim/";
    console.log(`Navigating to ${url}`);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000)); // Wait for render

    const content = await page.content();
    fs.writeFileSync('debug_alnus_puppeteer.html', content);
    console.log("Saved HTML to debug_alnus_puppeteer.html");

    await browser.close();
}

debugScraper();
