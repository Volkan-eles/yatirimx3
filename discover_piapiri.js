
import fs from 'fs';
import https from 'https';

const url = "https://www.piapiri.com/halka-arz/";

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        fs.writeFileSync('piapiri_raw.html', data);
        console.log(`Saved ${data.length} bytes to piapiri_raw.html`);
    });

}).on('error', (err) => {
    console.error("Error:", err.message);
});
