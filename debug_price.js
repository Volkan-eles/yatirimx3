import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const url = "https://halkarz.com/arf-bio-yenilenebilir-enerji-uretim-a-s/";

async function run() {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        const text = $('body').text();

        console.log("--- SEARCHING FOR PRICE ---");
        const priceRegex = /Halka\s*Arz\s*Fiyatı.*?(\d+[,.]\d{2})/i;
        const match = text.match(priceRegex);
        if (match) {
            console.log("RegEx Match:", match[0]);
            console.log("Captured Group:", match[1]);
        } else {
            console.log("No regex match found.");
        }

        console.log("--- CONTEXT 'Fiyatı' ---");
        const index = text.indexOf("Fiyatı");
        if (index !== -1) {
            console.log(text.substring(index - 50, index + 100).replace(/\n/g, ' '));
        }

        fs.writeFileSync('debug_page_text.txt', text);
        console.log("Text saved to debug_page_text.txt");

    } catch (e) {
        console.error(e);
    }
}

run();
