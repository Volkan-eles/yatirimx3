import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const publicDir = path.join(__dirname, '../public');
const archiveDir = path.join(publicDir, 'dividend_archives');
const versionsDir = path.join(publicDir, 'dividend_versions');

// Create directories if they don't exist
if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
}

if (!fs.existsSync(versionsDir)) {
    fs.mkdirSync(versionsDir, { recursive: true });
}

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

const saveJson = (filename, data) => {
    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const archiveDividends = () => {
    console.log('Starting dividend archiving...');

    const currentData = loadJson('temettu.json');
    if (!currentData || currentData.length === 0) {
        console.log('No dividend data found');
        return;
    }

    const today = new Date();
    const pastDividends = [];
    const activeDividends = [];

    // Separate past and active dividends
    currentData.forEach(dividend => {
        if (dividend.t_odemetarihi) {
            const paymentDate = new Date(dividend.t_odemetarihi);
            if (paymentDate < today) {
                pastDividends.push(dividend);
            } else {
                activeDividends.push(dividend);
            }
        } else {
            // No payment date = upcoming
            activeDividends.push(dividend);
        }
    });

    console.log(`Found ${pastDividends.length} past dividends, ${activeDividends.length} active dividends`);

    // Group past dividends by year
    const archive = {};
    pastDividends.forEach(dividend => {
        const year = dividend.t_odemetarihi ? new Date(dividend.t_odemetarihi).getFullYear() : 'unknown';
        if (!archive[year]) {
            archive[year] = [];
        }
        archive[year].push(dividend);
    });

    // Save each year's archive
    Object.entries(archive).forEach(([year, dividends]) => {
        const archiveFile = path.join(archiveDir, `temettu_${year}.json`);
        fs.writeFileSync(archiveFile, JSON.stringify(dividends, null, 2));
        console.log(`Archived ${dividends.length} dividends for year ${year}`);
    });

    // Update active dividends file
    saveJson('temettu.json', activeDividends);
    console.log(`Updated temettu.json with ${activeDividends.length} active dividends`);

    // Create index file
    const indexData = {
        lastUpdated: today.toISOString(),
        years: Object.keys(archive).sort((a, b) => b - a),
        totalArchived: pastDividends.length,
        totalActive: activeDividends.length,
    };

    const indexFile = path.join(archiveDir, 'index.json');
    fs.writeFileSync(indexFile, JSON.stringify(indexData, null, 2));
    console.log('Created archive index');

    // Create versioned backup
    const timestamp = today.toISOString().split('T')[0];
    const versionFile = path.join(versionsDir, `temettu_${timestamp}.json`);
    fs.writeFileSync(versionFile, JSON.stringify(currentData, null, 2));
    console.log(`Created version backup: ${timestamp}`);

    // Clean old versions (keep last 30 days)
    cleanOldVersions();
};

const cleanOldVersions = () => {
    const files = fs.readdirSync(versionsDir);
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    files.forEach(file => {
        if (file.startsWith('temettu_') && file.endsWith('.json')) {
            const dateStr = file.replace('temettu_', '').replace('.json', '');
            const fileDate = new Date(dateStr);

            if (fileDate < thirtyDaysAgo) {
                fs.unlinkSync(path.join(versionsDir, file));
                console.log(`Deleted old version: ${file}`);
            }
        }
    });
};

// Run archiving
archiveDividends();

console.log('Dividend archiving completed!');
