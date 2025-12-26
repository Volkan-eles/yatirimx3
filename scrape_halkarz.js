import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = "https://halkarz.com/";

async function getSoup(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });
        return cheerio.load(data);
    } catch (e) {
        console.error(`Failed to fetch ${url}: ${e.message}`);
        return null;
    }
}

async function extractDetailData(detailUrl) {
    const $ = await getSoup(detailUrl);
    if (!$) return {};

    const fullText = $('body').text();
    const details = {
        price: 0,
        lotCount: "Bilinmiyor",
        distributionType: "Bilinmiyor",
        market: "Yıldız Pazar",
        floatingRate: "",
        discount: "",
        totalSize: "",
        lockup: [],
        fundUsage: [],
        broker: "Bilinmiyor",
        allocationGroups: [],
        estimatedDistribution: [],
        financialData: {},
        applicationHours: "",
        priceStability: "",
        slug: detailUrl.replace(/\/$/, '').split('/').pop()
    };

    // Price
    const priceMatch = fullText.match(/Halka\s*Arz\s*Fiyatı.*?(\d+[,.]\d{2})/i);
    if (priceMatch) {
        details.price = parseFloat(priceMatch[1].replace(',', '.'));
    }

    // Application Hours
    const hoursMatch = fullText.match(/(\d{2}:\d{2}-\d{2}:\d{2})/);
    if (hoursMatch) details.applicationHours = hoursMatch[1];

    // Market
    if (fullText.includes("Ana Pazar")) details.market = "Ana Pazar";
    else if (fullText.includes("Yıldız Pazar")) details.market = "Yıldız Pazar";

    // Distribution
    if (fullText.includes("Eşit Dağıtım")) details.distributionType = "Eşit Dağıtım";
    else if (fullText.includes("Oransal Dağıtım")) details.distributionType = "Oransal Dağıtım";

    // Broker
    const brokerMatch = fullText.match(/Aracı Kurum.*?:(.*?)(?:Bist Kodu|$)/is); // s flag for dotall
    if (brokerMatch) {
        const brokers = brokerMatch[1].split('\n')
            .map(s => s.trim())
            .filter(s => s.includes("A.Ş") && s.length < 100);
        if (brokers.length > 0) {
            details.broker = brokers.length === 1 ? brokers[0] : brokers.slice(0, 2).join(", ");
        }
    }

    // Floating Rate
    const floatMatch = fullText.match(/Halka\s*Açıklık\s*[:\-]\s*(%?[\d,\.]+)/i);
    if (floatMatch) details.floatingRate = floatMatch[1].trim();

    // Discount
    const discountMatch = fullText.match(/İskonto\s*[:\-]\s*(%?[\d,\.]+)/i);
    if (discountMatch) details.discount = discountMatch[1].trim();

    // Total Size
    const sizeMatch = fullText.match(/Büyüklüğü\s*[:\-～~]\s*([\d,\.]+ (?:Milyar|Milyon) TL)/i);
    if (sizeMatch) details.totalSize = sizeMatch[1].trim();

    // Lot Count
    const sermayeMatch = fullText.match(/Sermaye\s*Artırımı\s*:\s*([\d\.]+)\s*Lot/);
    const ortakMatch = fullText.match(/Ortak\s*Satışı\s*:\s*([\d\.]+)\s*Lot/);
    let totalLot = 0;
    if (sermayeMatch) totalLot += parseInt(sermayeMatch[1].replace(/\./g, ''));
    if (ortakMatch) totalLot += parseInt(ortakMatch[1].replace(/\./g, ''));

    if (totalLot > 0) {
        if (totalLot > 1000000) details.lotCount = `${(totalLot / 1000000).toFixed(1)} Milyon`;
        else details.lotCount = totalLot.toLocaleString('tr-TR');
    }

    // Parsing sections line by line (simplified)
    const lines = fullText.split('\n').map(l => l.trim()).filter(l => l);
    let mode = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("Fonun Kullanım Yeri")) mode = 'fund';
        else if (line.includes("Satmama Taahhüdü")) mode = 'lockup';
        else if (line.includes("Fiyat İstikrarı")) {
            // Peek next
            if (i + 1 < lines.length && lines[i + 1].startsWith('-')) {
                details.priceStability = lines[i + 1].replace(/^-\s*/, '');
            }
            mode = null;
        }
        else if (line.includes("Tahsisat Grupları")) mode = 'allocation';
        else if (line.includes("Dağıtılacak Pay Miktarı")) mode = 'dist';
        else if (line.includes("Finansal Tablo")) mode = 'financial';
        else if (["Bist", "Endeks", "Başvuru Yerleri", "Şirket Hakkında", "Ekler"].some(x => line.includes(x))) mode = null;
        else if (mode) {
            if (mode === 'fund' && (line.startsWith('-') || line.startsWith('•') || line.startsWith('%'))) {
                details.fundUsage.push(line.replace(/^[-•]\s*/, ''));
            } else if (mode === 'lockup' && (line.startsWith('-') || line.startsWith('•'))) {
                if (!line.includes("Bist")) details.lockup.push(line.replace(/^[-•]\s*/, ''));
            } else if (mode === 'allocation' && (line.startsWith('-') || line.includes("Lot"))) {
                if (!line.includes("Bist")) details.allocationGroups.push(line.replace(/^[-•]\s*/, ''));
            } else if (mode === 'dist' && (line.startsWith('-') || line.toLowerCase().includes("katılım"))) {
                details.estimatedDistribution.push(line.replace(/^[-•]\s*/, ''));
            } else if (mode === 'financial' && !line.startsWith('*')) {
                if (['Hasılat', 'Brüt Kâr', 'Milyon TL'].some(x => line.includes(x))) {
                    details.financialData.raw = (details.financialData.raw || "") + line + " ";
                }
            }
        }
    }

    return details;
}

async function scrape() {
    console.log("Starting Halkarz Scraper (Node.js)...");
    const $ = await getSoup(BASE_URL);
    if (!$) return;

    const tabItems = $('.tab_item');
    if (tabItems.length < 2) {
        console.log("Not enough tabs found");
        return;
    }

    const results = { active_ipos: [], draft_ipos: [] };

    // Active
    console.log("Scraping Active IPOs...");
    const activeArticles = $(tabItems[0]).find('article.index-list');
    for (let i = 0; i < activeArticles.length; i++) {
        const el = $(activeArticles[i]);
        const aTag = el.find('h3.il-halka-arz-sirket a');
        if (!aTag.length) continue;

        const name = aTag.text().trim();
        const link = aTag.attr('href');
        const code = el.find('span.il-bist-kod').text().trim() || "KOD_YOK";
        const dates = el.find('span.il-halka-arz-tarihi').text().trim();
        const status = el.find('div.il-badge').text().trim();
        const logo = el.find('img.slogo').attr('src');

        console.log(`Processing Active: ${name} (${code})`);
        const details = await extractDetailData(link);

        results.active_ipos.push({
            code, company: name, dates, status, logo, url: link,
            ...details
        });

        // Save incrementally
        if (i % 5 === 0) save(results);
    }

    // Draft
    console.log("Scraping Draft IPOs...");
    const draftArticles = $(tabItems[1]).find('article.index-list');
    for (let i = 0; i < draftArticles.length; i++) {
        const el = $(draftArticles[i]);
        const aTag = el.find('h3.il-halka-arz-sirket a');
        if (!aTag.length) continue;

        const name = aTag.text().trim();
        const link = aTag.attr('href');
        const logo = el.find('img.slogo').attr('src');
        console.log(`Processing Draft: ${name}`);

        // Basic Draft, usually no details link scrape needed or consistent
        // But let's verify if we need detailed scrape. Original script did it.
        const details = await extractDetailData(link);

        results.draft_ipos.push({
            company: name, logo, url: link,
            ...details
        });
        if (i % 5 === 0) save(results);
    }

    save(results);
    console.log("Done.");
}

function save(data) {
    fs.writeFileSync(path.join('public', 'halkarz_ipos.json'), JSON.stringify(data, null, 2));
}

scrape();
