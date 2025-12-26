const text = "25-26 Aralık 2025Halka Arz Fiyatı/Aralığı : 19,50 TLDağıtım Yöntemi : Eşit Dağıtım **Pay : 47,000,000 Lot";
const regex = /Halka\s*Arz\s*Fiyatı.*?(\d+[,.]\d{2})/i;
const match = text.match(regex);

if (match) {
    console.log("MATCH:", match[0]);
    console.log("GROUP 1:", match[1]);
} else {
    console.log("NO MATCH");
}
