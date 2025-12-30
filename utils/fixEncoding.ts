// Türkçe karakter düzeltici utility
export function fixTurkishChars(text: string): string {
    if (!text) return text;

    return text
        .replace(/Ã‡/g, 'Ç')
        .replace(/Ã¼/g, 'ü')
        .replace(/Ã§/g, 'ç')
        .replace(/ÄŸ/g, 'ğ')
        .replace(/Ä±/g, 'ı')
        .replace(/Ã¶/g, 'ö')
        .replace(/ÅŸ/g, 'ş')
        .replace(/Ã–/g, 'Ö')
        .replace(/Åž/g, 'Ş')
        .replace(/Ä°/g, 'İ')
        .replace(/Ãœ/g, 'Ü')
        .replace(/Äž/g, 'Ğ')
        .replace(/Â/g, '')
        // Özel durumlar
        .replace(/A\.Å\./g, 'A.Ş.')
        .replace(/T\.A\.Å\./g, 'T.A.Ş.')
        .replace(/Å\./g, 'Ş.')
        .replace(/Å\s/g, 'Ş ')
        .replace(/Å"/g, 'Ş"')
        .replace(/Å,/g, 'Ş,');
}
