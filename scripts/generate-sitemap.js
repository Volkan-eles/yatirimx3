import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Helper Functions ---

const slugify = (text) => {
    if (!text) return '';
    const trMap = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
        'İ': 'i', 'ı': 'i',
        'ö': 'o', 'Ö': 'o'
    };
    return text
        .replace(/[çÇğĞşŞüÜİıöÖ]/g, (char) => trMap[char] || char)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Remove duplicate hyphens
        .replace(/^-+|-+$/g, '');     // Trim hyphens
};

const BASE_URL = 'https://yatirimx.com';
const TODAY = new Date().toISOString().split('T')[0];

const createUrlEntry = (urlPath, priority = '0.8', changefreq = 'daily') => {
    // Ensure path starts with / and clean duplicate slashes
    let cleanPath = ('/' + urlPath).replace(/\/\//g, '/');

    // Default: Add trailing slash if it's not a file
    // We assume anything with a dot in the last segment is a file (e.g., sitemap.xml, robot.txt)
    const lastSegment = cleanPath.split('/').pop();
    const isFile = lastSegment.includes('.') && lastSegment.length > 1; // Basic file check

    if (!isFile && !cleanPath.endsWith('/')) {
        cleanPath += '/';
    }

    const url = `${BASE_URL}${cleanPath}`;

    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

// --- Data Loading ---
const publicDir = path.join(__dirname, '../public');

const loadJson = (filename) => {
    try {
        const filePath = path.join(publicDir, filename);
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (err) {
        console.error(`Error loading ${filename}:`, err.message);
    }
    return [];
};

// --- Main Execution ---

const main = () => {
    console.log('Generating sitemap...');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 1. Static Pages
    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/piyasa/', priority: '0.9', changefreq: 'hourly' },
        { url: '/piyasa-haritasi/', priority: '0.9', changefreq: 'hourly' },
        { url: '/izleme-listesi/', priority: '0.8', changefreq: 'daily' },
        { url: '/karsilastir/', priority: '0.8', changefreq: 'daily' },
        { url: '/temettu-takvimi-2026/', priority: '0.9', changefreq: 'daily' },
        { url: '/halka-arz/', priority: '0.8', changefreq: 'daily' },
        { url: '/hedef-fiyat/', priority: '0.8', changefreq: 'daily' },
        { url: '/sermaye-artirimi/', priority: '0.7', changefreq: 'weekly' },
        { url: '/araci-kurumlar/', priority: '0.7', changefreq: 'weekly' },
        { url: '/blog/', priority: '0.7', changefreq: 'weekly' },
        { url: '/hakkimizda/', priority: '0.5', changefreq: 'monthly' },
        { url: '/iletisim/', priority: '0.5', changefreq: 'monthly' },
        { url: '/gizlilik-politikasi/', priority: '0.3', changefreq: 'yearly' },
        { url: '/kullanim-kosullari/', priority: '0.3', changefreq: 'yearly' },
        { url: '/cerez-politikasi/', priority: '0.3', changefreq: 'yearly' },
    ];

    staticPages.forEach(page => {
        xml += createUrlEntry(page.url, page.priority, page.changefreq);
    });

    // 2. Dynamic Stocks (/hisse/...)
    const processedStocks = new Set();

    // Source: bist_live_data.json
    const bistData = loadJson('bist_live_data.json');
    if (bistData && bistData.stocks) {
        console.log(`Processing ${bistData.stocks.length} stocks from BIST data...`);
        bistData.stocks.forEach(stock => {
            // Format: /hisse/[CODE] Hisse Senedi Fiyatı Grafiği [CODE] Yorumu 2026/
            const longSlug = slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`);
            xml += createUrlEntry(`/hisse/${longSlug}/`, '0.9', 'hourly');
            processedStocks.add(stock.code);
        });
    }

    // Source: sermaye_artirimi.json (Ensure these stocks are also covered)
    const capData = loadJson('sermaye_artirimi.json');
    if (capData && Array.isArray(capData)) {
        let addedCount = 0;
        capData.forEach(item => {
            if (item.code && !processedStocks.has(item.code)) {
                // Same URL format
                const longSlug = slugify(`${item.code} Hisse Senedi Fiyatı Grafiği ${item.code} Yorumu 2026`);
                xml += createUrlEntry(`/hisse/${longSlug}/`, '0.8', 'weekly');
                processedStocks.add(item.code);
                addedCount++;
            }
        });
        if (addedCount > 0) console.log(`Added ${addedCount} additional stocks from Capital Increase data.`);
    }

    // 3. Dynamic IPOs (/halka-arz/...)
    const ipoData = loadJson('halkarz_ipos.json');
    const allIpos = [];
    if (ipoData) {
        if (Array.isArray(ipoData.active_ipos)) allIpos.push(...ipoData.active_ipos);
        if (Array.isArray(ipoData.draft_ipos)) allIpos.push(...ipoData.draft_ipos);
        if (Array.isArray(ipoData)) allIpos.push(...ipoData);
    }

    if (allIpos.length > 0) {
        console.log(`Processing ${allIpos.length} IPOs...`);
        allIpos.forEach(ipo => {
            let slug = ipo.slug;

            if (!slug && ipo.link) {
                const matches = ipo.link.match(/halkarz\.com\/([^\/]+)\/?$/);
                if (matches && matches[1]) {
                    slug = matches[1];
                }
            }

            if (!slug && ipo.company) {
                slug = slugify(ipo.company);
            }

            if (slug) {
                let baseSlug = slug;
                const suffix = '-halka-arzi-hakkinda-bilmeniz-gerekenler-2026';

                if (!baseSlug.endsWith(suffix)) {
                    xml += createUrlEntry(`/halka-arz/${baseSlug}${suffix}/`, '0.8', 'weekly');
                } else {
                    xml += createUrlEntry(`/halka-arz/${baseSlug}/`, '0.8', 'weekly');
                }
            }
        });
    }

    // 4. Dynamic Dividends (/temettu/...)
    const dividendData = loadJson('temettu.json');
    if (dividendData && Array.isArray(dividendData)) {
        console.log(`Processing ${dividendData.length} dividends...`);
        dividendData.forEach(item => {
            if (item.t_bistkod) {
                const longSlug = slugify(`${item.t_bistkod} Temettü Tarihi 2026 Ne Kadar Verecek`);
                xml += createUrlEntry(`/temettu/${longSlug}/`, '0.8', 'weekly');
            }
        });
    }

    // 5. Dynamic Target Prices (/hedef-fiyat/...)
    const targetData = loadJson('halkarz_target_prices.json');
    if (targetData && Array.isArray(targetData)) {
        const stocksWithTargets = new Set();
        targetData.forEach(item => {
            if (item.code) stocksWithTargets.add(item.code);
            else if (item.bistkodu) stocksWithTargets.add(item.bistkodu);
        });
        console.log(`Processing ${stocksWithTargets.size} target prices...`);

        stocksWithTargets.forEach(code => {
            const longSlug = slugify(`${code} Hedef Fiyat 2026`);
            xml += createUrlEntry(`/hedef-fiyat/${longSlug}/`, '0.8', 'daily');
        });
    }

    // 6. Dynamic Brokers (/araci-kurumlar/...)
    const brokerData = loadJson('brokers_tefas.json');
    if (brokerData && Array.isArray(brokerData)) {
        console.log(`Processing ${brokerData.length} brokers...`);
        brokerData.forEach(broker => {
            const name = broker.name || broker.title || broker.kurum;
            if (name) {
                const longSlug = slugify(name);
                xml += createUrlEntry(`/araci-kurumlar/${longSlug}/`, '0.7', 'weekly');
            }
        });
    }

    // 7. Dynamic Blog Posts (/blog/...)
    console.log('Adding blog posts...');
    const blogSlugs = [
        'halka-arz-takvimi-2026-taslak',
        'halka-arz-takvimi-2026-yeni',
        'bedelsiz-sermaye-artirimi-nedir',
        'temettu-nedir-nasil-alinir',
        'lot-sayisi-az-olan-hisseler-2026',
        '2026-katilim-endeksine-uygun-hisseler',
        'gelecegin-sektorleri-2026-cip-enerji'
    ];

    blogSlugs.forEach(slug => {
        xml += createUrlEntry(`/blog/${slug}/`, '0.8', 'weekly');
    });

    // 8. Dynamic Commodities (/emtia/...)
    const emtiaData = loadJson('emtia.json');
    if (emtiaData && Array.isArray(emtiaData)) {
        console.log(`Processing ${emtiaData.length} commodities...`);
        emtiaData.forEach(item => {
            if (item.name) {
                const slug = slugify(item.name);
                xml += createUrlEntry(`/emtia/${slug}/`, '0.9', 'hourly');
            }
        });
    }

    xml += `
</urlset>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(`Sitemap generated at ${path.join(publicDir, 'sitemap.xml')}`);
};

main();
