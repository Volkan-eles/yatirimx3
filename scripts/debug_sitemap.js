import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogPath = path.join(__dirname, '../data/blogPosts.ts');
console.log('Reading:', blogPath);

try {
    const content = fs.readFileSync(blogPath, 'utf8');
    console.log('File length:', content.length);

    console.log('--- Testing Regex ---');
    const slugRegex = /slug:\s*'([^']+)'/g;
    let match;
    let count = 0;
    while ((match = slugRegex.exec(content)) !== null) {
        console.log('Found slug:', match[1]);
        count++;
    }
    console.log('Total matches:', count);

} catch (e) {
    console.error(e);
}
