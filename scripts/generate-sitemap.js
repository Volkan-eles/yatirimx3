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
        { url: '', priority: '1.0', changefreq: 'daily' },
        { url: 'piyasa', priority: '0.9', changefreq: 'hourly' },
        { url: 'piyasa-haritasi', priority: '0.9', changefreq: 'hourly' },
        { url: 'izleme-listesi', priority: '0.8', changefreq: 'daily' },
        { url: 'karsilastir', priority: '0.8', changefreq: 'daily' },
        { url: 'temettu-takvimi-2026', priority: '0.9', changefreq: 'daily' },
        { url: 'halka-arz', priority: '0.8', changefreq: 'daily' },
        { url: 'hedef-fiyat', priority: '0.8', changefreq: 'daily' },
        { url: 'sermaye-artirimi', priority: '0.7', changefreq: 'weekly' },
        { url: 'araci-kurumlar', priority: '0.7', changefreq: 'weekly' },
        { url: 'blog', priority: '0.7', changefreq: 'weekly' },
        { url: 'hakkimizda', priority: '0.5', changefreq: 'monthly' },
        { url: 'iletisim', priority: '0.5', changefreq: 'monthly' },
        { url: 'gizlilik-politikasi', priority: '0.3', changefreq: 'yearly' },
        { url: 'kullanim-kosullari', priority: '0.3', changefreq: 'yearly' },
    ];

    staticPages.forEach(page => {
        xml += createUrlEntry(page.url, page.priority, page.changefreq);
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
    // ipoData is an object { active_ipos: [...], draft_ipos: [...] }
    const allIpos = [];
    if (ipoData) {
        if (Array.isArray(ipoData.active_ipos)) allIpos.push(...ipoData.active_ipos);
        if (Array.isArray(ipoData.draft_ipos)) allIpos.push(...ipoData.draft_ipos);
        // Fallback if it is just an array
        if (Array.isArray(ipoData)) allIpos.push(...ipoData);
    }

    if (allIpos.length > 0) {
        console.log(`Processing ${allIpos.length} IPOs...`);
        allIpos.forEach(ipo => {
            // Format: /halka-arz/[slug]/
            // If explicit slug exists, use it. Otherwise try to extract from link or slugify company name.
            let slug = ipo.slug;

            if (!slug && ipo.link) {
                // Extract from https://halkarz.com/slug-name/
                const matches = ipo.link.match(/halkarz\.com\/([^\/]+)\/?$/);
                if (matches && matches[1]) {
                    slug = matches[1];
                }
            }

            if (!slug && ipo.company) {
                slug = slugify(ipo.company);
            }

            if (slug) {
                // Ensure we use the full company name based slug if possible for better SEO, 
                // but if we extracted a slug from the link, that's usually good too.
                // We append the requested suffix.
                let baseSlug = slug;
                const suffix = '-halka-arzi-hakkinda-bilmeniz-gerekenler-2026';

                // Avoid double suffixing if run multiple times or if slug already has it
                if (!baseSlug.endsWith(suffix)) {
                    xml += createUrlEntry(`/halka-arz/${baseSlug}${suffix}`, '0.8', 'weekly');
                } else {
                    xml += createUrlEntry(`/halka-arz/${baseSlug}`, '0.8', 'weekly');
                }
            }
        });
    }

    // 4. Dynamic Dividends (/temettu/...)
    // Source: temettu.json
    const dividendData = loadJson('temettu.json');
    if (dividendData && Array.isArray(dividendData)) {
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
    if (targetData && Array.isArray(targetData)) {
        // Group by stock code since detail page is per stock
        const stocksWithTargets = new Set();
        targetData.forEach(item => {
            if (item.code) stocksWithTargets.add(item.code);
            else if (item.bistkodu) stocksWithTargets.add(item.bistkodu);
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
    if (brokerData && Array.isArray(brokerData)) {
        console.log(`Processing ${brokerData.length} brokers...`);
        brokerData.forEach(broker => {
            // Broker names might need slugification
            // Checking if broker has a name property
            const name = broker.name || broker.title || broker.kurum;
            if (name) {
                const longSlug = slugify(name);
                xml += createUrlEntry(`/araci-kurumlar/${longSlug}`, '0.7', 'weekly');
            }
        });
    }

    // 7. Dynamic Blog Posts (/blog/...)
    // Parse data/blogPosts.ts
    // Since we can't import TS directly easily, we'll read file and regex extraction
    console.log('Extracting blog posts from data/blogPosts.ts...');
    try {
        const blogPath = path.join(__dirname, '../data/blogPosts.ts');
        if (fs.existsSync(blogPath)) {
            const content = fs.readFileSync(blogPath, 'utf8');
            // Regex to find slug: 'some-slug'
            const slugRegex = /slug:\s*'([^']+)'/g;
            let match;
            let count = 0;
            while ((match = slugRegex.exec(content)) !== null) {
                if (match[1]) {
                    xml += createUrlEntry(`/blog/${match[1]}`, '0.8', 'weekly');
                    count++;
                }
            }
            console.log(`Processing ${count} blog posts...`);
        } else {
            console.warn('data/blogPosts.ts not found');
        }
    } catch (e) {
        console.error('Error parsing blog posts:', e.message);
    }

    xml += `
</urlset>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
    console.log(`Sitemap generated at ${path.join(publicDir, 'sitemap.xml')}`);
};

main();
