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
    const cleanPath = ('/' + urlPath).replace(/\/\//g, '/');

    let url = `${BASE_URL}${cleanPath}`;

    // Logic to add trailing slash:
    // Add if it doesn't end with slash AND doesn't look like a file (has extension at the end)
    // We check the path part only for the dot to avoid matching the domain's dot.
    const isFile = cleanPath.split('/').pop().includes('.'); // Crude check, but works for .xml, .png etc.

    if (!url.endsWith('/') && !isFile) {
        url += '/';
    }

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
        { path: '/', priority: '1.0', freq: 'hourly' },
        { path: '/piyasa', priority: '0.9', freq: 'hourly' },
        { path: '/hedef-fiyat', priority: '0.9', freq: 'daily' },
        { path: '/temettu-takvimi-2026', priority: '0.9', freq: 'daily' },
        { path: '/halka-arz', priority: '0.9', freq: 'weekly' },
        { path: '/sermaye-artirimi', priority: '0.8', freq: 'weekly' },
        { path: '/araci-kurumlar', priority: '0.8', freq: 'weekly' },
        { path: '/blog', priority: '0.8', freq: 'daily' },
        { path: '/hakkimizda', priority: '0.6', freq: 'monthly' },
        { path: '/iletisim', priority: '0.6', freq: 'monthly' },
        { path: '/gizlilik-politikasi', priority: '0.5', freq: 'monthly' },
        { path: '/kullanim-kosullari', priority: '0.5', freq: 'monthly' },
    ];

    staticPages.forEach(page => {
        xml += createUrlEntry(page.path, page.priority, page.freq);
    });

    // 2. Dynamic Stocks (/hisse/...)
    // Source: bist_live_data.json
    const bistData = loadJson('bist_live_data.json');
    if (bistData && bistData.stocks) {
        console.log(`Processing ${bistData.stocks.length} stocks...`);
        bistData.stocks.forEach(stock => {
            // Format: /hisse/[CODE] Hisse Senedi Fiyatı Grafiği [CODE] Yorumu 2026/
            const longSlug = slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`);
            xml += createUrlEntry(`/hisse/${longSlug}`, '0.9', 'hourly');
        });
    }

    // 3. Dynamic IPOs (/halka-arz/...)
    // Source: halkarz_ipos.json
    const ipoData = loadJson('halkarz_ipos.json');
    if (ipoData && ipoData.length) {
        console.log(`Processing ${ipoData.length} IPOs...`);
        ipoData.forEach(ipo => {
            // Format: /halka-arz/[slug]/
            if (ipo.slug) {
                xml += createUrlEntry(`/halka-arz/${ipo.slug}`, '0.8', 'weekly');
            }
        });
    }

    // 4. Dynamic Dividends (/temettu/...)
    // Source: temettu.json
    const dividendData = loadJson('temettu.json');
    if (dividendData && dividendData.length) {
        console.log(`Processing ${dividendData.length} dividends...`);
        dividendData.forEach(item => {
            // Format: /temettu/[Code] Temettü Tarihi 2026 Ne Kadar Verecek/
            if (item.t_bistkod) {
                const longSlug = slugify(`${item.t_bistkod} Temettü Tarihi 2026 Ne Kadar Verecek`);
                xml += createUrlEntry(`/temettu/${longSlug}`, '0.8', 'weekly');
            }
        });
    }

    // 5. Dynamic Target Prices (/hedef-fiyat/...)
    // Source: halkarz_target_prices.json
    const targetData = loadJson('halkarz_target_prices.json');
    if (targetData && targetData.length) {
        // Group by stock code since detail page is per stock
        const stocksWithTargets = new Set();
        targetData.forEach(item => {
            stocksWithTargets.add(item.bistkodu);
        });
        console.log(`Processing ${stocksWithTargets.size} target prices...`);

        stocksWithTargets.forEach(code => {
            // Format: /hedef-fiyat/[Code] Hedef Fiyat 2026/
            const longSlug = slugify(`${code} Hedef Fiyat 2026`);
            xml += createUrlEntry(`/hedef-fiyat/${longSlug}`, '0.8', 'daily');
        });
    }

    // 6. Dynamic Brokers (/araci-kurumlar/...)
    // Source: brokers_tefas.json
    const brokerData = loadJson('brokers_tefas.json');
    if (brokerData && brokerData.length) {
        console.log(`Processing ${brokerData.length} brokers...`);
        brokerData.forEach(broker => {
            if (broker.name) {
                const longSlug = slugify(broker.name);
                xml += createUrlEntry(`/araci-kurumlar/${longSlug}`, '0.7', 'weekly');
            }
        });
    }

    // 7. Dynamic Blog Posts (/blog/...)
    // Mock data copy from Blog.tsx
    const BLOG_POSTS = [
        { slug: '2026-bedelsiz-verecek-hisseler' },
        { slug: '2026-temettu-verecek-hisseler' },
        { slug: 'lot-sayisi-az-olan-hisseler-2026' },
        { slug: 'halka-arz-furyasi-devam-edecek-mi' }
    ];
    console.log(`Processing ${BLOG_POSTS.length} blog posts...`);
    BLOG_POSTS.forEach(post => {
        xml += createUrlEntry(`/blog/${post.slug}`, '0.8', 'weekly');
    });

    xml += `
</urlset>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(`Sitemap generated at ${path.join(publicDir, 'sitemap.xml')}`);
};

main();
