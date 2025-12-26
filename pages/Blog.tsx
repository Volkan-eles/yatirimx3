import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Search, Tag } from 'lucide-react';

// Mock Data for Blog Posts
export const BLOG_POSTS = [
    {
        id: 1,
        slug: '2026-bedelsiz-verecek-hisseler',
        title: '2026 Bedelsiz Verecek Hisseler | Güncel SPK Bedelsiz Takvimi',
        excerpt: '2026 yılında bedelsiz sermaye artırımı yapması beklenen hisseler, bedelsiz oranları, karar tarihleri ve SPK başvuru tarihleri. Güncel 2026 bedelsiz takvimi burada.',
        content: `
      <p>Borsa İstanbul’da 2026 yılı, yatırımcılar açısından bedelsiz sermaye artırımı bakımından oldukça hareketli geçti. Yılın sonuna yaklaşılırken yatırımcıların odağı, 2027 yılında bedelsiz sermaye artırımı yapması beklenen hisselere çevrilmiş durumda.</p>
      <p>Bu içerikte; SPK bedelsiz onayı bekleyen şirketler, bedelsiz oranları, karar tarihleri ve SPK başvuru tarihleri detaylı şekilde yer almaktadır. İçerik düzenli olarak güncellenmektedir.</p>

      <h2>2026 Bedelsiz Sermaye Artırımı Nedir?</h2>
      <h3>Bedelsiz Sermaye Artırımı Ne Anlama Gelir?</h3>
      <p>Bedelsiz sermaye artırımı, şirketlerin iç kaynaklarını (kâr yedekleri, emisyon primi vb.) kullanarak sermayelerini artırmalarıdır. Bu işlem sonucunda yatırımcılar ek bir ödeme yapmadan pay sahibi olmaya devam eder.</p>

      <h3>Bedelsiz Hisseler Hisse Fiyatını Nasıl Etkiler?</h3>
      <ul>
        <li>Hisse adedi artar</li>
        <li>Teorik hisse fiyatı bölünme oranına göre düşer</li>
        <li>Şirketin piyasa değeri değişmez</li>
      </ul>

      <h2>2026’da Bedelsiz Verecek Hisseler Ne Zaman Bölünecek?</h2>
      <p>Sermaye Piyasası Kurulu (SPK), önümüzdeki dönemde birçok şirketin bedelsiz sermaye artırımı başvurusunu değerlendirecektir. Bu nedenle aşağıda yer alan şirketlerin bazıları 2026 yılı içinde onay alabileceği gibi, bölünme işlemleri 2027 yılına da sarkabilir.</p>
      
      <div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-4">
        <p class="text-sm text-yellow-200">Not: Listede yer alan şirketler, resmi KAP açıklamaları ve SPK başvuruları esas alınarak hazırlanmıştır.</p>
      </div>

      <h2>SPK Bedelsiz Onayı Bekleyen Şirketler (2026)</h2>
      <p>Aşağıda, 2027 yılında bedelsiz sermaye artırımı yapması beklenen hisseler, bedelsiz oranları ve ilgili tarihler yer almaktadır.</p>
    `,
        tableData: [
            { code: 'CASA', name: 'Casa Emtia Petrol Kimyevi ve Türevleri A.Ş.', ratio: '%1000', decisionDate: '22 Eylül 2023', appDate: '–' },
            { code: 'MPARK', name: 'MLP Sağlık Hizmetleri A.Ş.', ratio: '%200', decisionDate: '3 Kasım 2023', appDate: '3 Kasım 2023' },
            { code: 'AGROT', name: 'Agrotech Yüksek Teknoloji ve Yatırım A.Ş.', ratio: '%100', decisionDate: '26 Kasım 2024', appDate: '3 Aralık 2024' },
            { code: 'QNBTR', name: 'QNB Bank A.Ş.', ratio: '%64,17910', decisionDate: '14 Mart 2025 (Revize)', appDate: '26 Kasım 2025' },
            { code: 'REEDR', name: 'Reeder Teknoloji A.Ş.', ratio: '%300', decisionDate: '3 Haziran 2025 (Revize)', appDate: '19 Eylül 2025' },
            { code: 'SODSN', name: 'Sodaş Sodyum Sanayii A.Ş.', ratio: '%700', decisionDate: '20 Haziran 2025', appDate: '11 Temmuz 2025' },
            { code: 'GENIL', name: 'Gen İlaç ve Sağlık Ürünleri A.Ş.', ratio: '%1400', decisionDate: '14 Temmuz 2025', appDate: '11 Ağustos 2025' },
            { code: 'ALVES', name: 'Alves Kablo A.Ş.', ratio: '%900', decisionDate: '15 Ağustos 2025', appDate: '5 Eylül 2025' },
            { code: 'LINK', name: 'Link Bilgisayar A.Ş.', ratio: '%4000', decisionDate: '18 Ağustos 2025', appDate: '26 Ağustos 2025' },
            { code: 'EUYO', name: 'Euro Menkul Kıymet YO', ratio: '%200', decisionDate: '1 Eylül 2025', appDate: '3 Eylül 2025' },
            { code: 'ETYAT', name: 'Euro Trend YO', ratio: '%200', decisionDate: '1 Eylül 2025', appDate: '3 Eylül 2025' },
            { code: 'EUKYO', name: 'Euro Kapital YO', ratio: '%200', decisionDate: '1 Eylül 2025', appDate: '3 Eylül 2025' },
            { code: 'ENTRA', name: 'IC Enterra Yenilenebilir Enerji A.Ş.', ratio: '%100', decisionDate: '23 Eylül 2025', appDate: '25 Eylül 2025' },
            { code: 'KZBGY', name: 'Kızılbük GYO', ratio: '%233,33', decisionDate: '8 Ekim 2025', appDate: '11 Kasım 2025' },
            { code: 'RYSAS', name: 'Reysaş Taşımacılık A.Ş.', ratio: '%50', decisionDate: '31 Ekim 2025', appDate: '31 Ekim 2025' },
            { code: 'GZNMI', name: 'Gezinomi Turizm A.Ş.', ratio: '%1000', decisionDate: '5 Kasım 2025', appDate: '7 Kasım 2025' },
            { code: 'KAYSE', name: 'Kayseri Şeker Fabrikası A.Ş.', ratio: '%324,92', decisionDate: '7 Kasım 2025', appDate: '20 Kasım 2025' },
            { code: 'LIDFA', name: 'Lider Faktoring A.Ş.', ratio: '%95', decisionDate: '19 Kasım 2025', appDate: '–' },
            { code: 'GMTAS', name: 'Gimat Mağazacılık A.Ş.', ratio: '%101,07', decisionDate: '19 Kasım 2025', appDate: '21 Kasım 2025' },
            { code: 'RYGYO', name: 'Reysaş GYO', ratio: '%100', decisionDate: '20 Kasım 2025', appDate: '20 Kasım 2025' },
            { code: 'TRHOL', name: 'Tera Finansal Yatırımlar Holding A.Ş.', ratio: '%100', decisionDate: '21 Kasım 2025', appDate: '21 Kasım 2025' },
            { code: 'RNPOL', name: 'Rainbow Polikarbonat A.Ş.', ratio: '%1900', decisionDate: '25 Kasım 2025', appDate: '1 Aralık 2025' },
            { code: 'YAPRK', name: 'Yaprak Süt A.Ş.', ratio: '%2000', decisionDate: '8 Aralık 2025', appDate: '16 Aralık 2025' },
            { code: 'SMRTG', name: 'Smart Güneş Enerjisi A.Ş.', ratio: '%200', decisionDate: '9 Aralık 2025', appDate: '–' },
            { code: 'BIGCH', name: 'BigChefs Gıda A.Ş.', ratio: '%400', decisionDate: '9 Aralık 2025', appDate: '24 Aralık 2025' },
            { code: 'ATEKS', name: 'Akın Tekstil A.Ş.', ratio: '%2023,80', decisionDate: '16 Aralık 2025', appDate: '–' },
            { code: 'SMRVA', name: 'Sümer Varlık Yönetim A.Ş.', ratio: '%408,47', decisionDate: '23 Aralık 2025', appDate: '–' }
        ],
        seoKeywords: [
            '2026 bedelsiz takvimi',
            'SPK bedelsiz onayı bekleyen hisseler',
            'Bedelsiz sermaye artırımı 2026',
            'Borsa İstanbul bedelsiz hisseler',
            'Bedelsiz bölünecek hisseler',
            '2026 bedelsiz hisseler listesi',
            'Hangi hisseler bedelsiz verecek'
        ],
        category: 'Sermaye Artırımı',
        author: 'Volkan Keleş',
        date: '26 Aralık 2026',
        image: '/bedelsiz-2026.png',
        readTime: '8 dk'
    },
    {
        id: 2,
        slug: '2026-temettu-verecek-hisseler',
        title: '2026 Temettü Verecek Hisseler ve Temettü Tarihleri (Güncel Liste)',
        excerpt: '2026 yılında temettü verecek hisseler, temettü tarihleri, hisse başı brüt ve net temettü tutarları ile güncel 2026 temettü takvimi.',
        content: `
      <p>Borsa İstanbul’da yatırımcıların en çok takip ettiği konuların başında temettü veren hisseler geliyor. 2025 yılında onlarca şirketin yatırımcılarına nakit temettü dağıtmasının ardından, gözler 2026 temettü verecek hisseler ve ödeme tarihlerine çevrilmiş durumda.</p>
      <p>Temettü geliri odaklı yatırım yapanlar için hazırlanan bu içerikte; 2026 yılında temettü dağıtması kesinleşen şirketler, hisse başı brüt ve net temettü tutarları, temettü ödeme tarihleri ve temettü verimleri detaylı şekilde yer almaktadır.</p>

      <h2>2026 Temettü Nedir? Temettü Yatırımı Ne Anlama Gelir?</h2>
      <h3>Temettü Nedir?</h3>
      <p>Temettü, şirketlerin elde ettikleri kârın bir kısmını ortaklarına nakit veya pay şeklinde dağıtmasıdır. Türkiye’de halka açık şirketler, temettü kararlarını KAP (Kamuyu Aydınlatma Platformu) üzerinden duyurur.</p>

      <h3>2026 Yılında Temettü Dağıtımı Nasıl Belirlenir?</h3>
      <p>2026 temettüleri, şirketlerin 2025 yılı finansal tabloları ve genel kurul kararları doğrultusunda belirlenmektedir. Özellikle düzenli temettü ödeyen şirketler, her yıl yatırımcıların radarında yer alır.</p>

      <h2>2026 Temettü Takvimi</h2>
      <p>2026 temettü takvimi; temettü ödeme tarihi, hisse başı brüt temettü, hisse başı net temettü ve temettü verimi gibi yatırım kararlarında kritik öneme sahip bilgileri içerir.</p>
      <div class="bg-blue-500/10 border-l-4 border-blue-500 p-4 my-4">
        <p class="text-sm text-blue-200">Not: Aşağıdaki tabloda yer alan veriler, temettü kararının açıklandığı gün oluşan hisse fiyatı baz alınarak hesaplanmıştır. Taksitli temettü ödeyen şirketlerde temettü verimi, toplam temettü tutarı üzerinden hesaplanmıştır.</p>
      </div>

      <h2>2026 Temettü Verecek Hisseler (Kesinleşenler)</h2>
      <p>2026 yılı itibarıyla temettü dağıtımı kesinleşen şirketlerin listesi gün geçtikçe genişlemektedir. Bu liste, KAP’a yapılan resmi bildirimler doğrultusunda hazırlanmakta ve anlık olarak güncellenmektedir.</p>

      <ul class="list-disc pl-6 space-y-2 text-zinc-300 mb-6">
        <li><strong class="text-white">“Ödendi”</strong> ibaresi bulunan temettüler yatırımcı hesaplarına geçmiştir.</li>
        <li><strong class="text-white">Açıklanmadı</strong> olarak belirtilen temettü tarihleri, şirket tarafından henüz duyurulmamıştır.</li>
      </ul>

      <h2>2026 Temettü Veren Hisseler Tablosu</h2>
      <p>Aşağıda yer alan tablo, 2026 yılına ait temettü dağıtımlarını; şirket adı, hisse kodu, brüt/net temettü, ödeme tarihi ve temettü verimi ile birlikte göstermektedir.</p>
    `,
        tableType: 'dividend',
        tableData: [
            { name: 'Nuh Çimento Sanayi A.Ş.', code: 'NUHCM', gross: '2,90 TL', net: '2,465 TL', date: '6 Ocak 2025 (Ödendi)', yield: '%0,94' },
            { name: 'Mistral GYO (2. Taksit)', code: 'MSGYO', gross: '0,24 TL', net: '0,24 TL', date: '22 Ocak 2025 (Ödendi)', yield: '%6,25' },
            { name: 'Osmanlı Yatırım', code: 'OSMEN', gross: '0,0875 TL', net: '0,0743 TL', date: '29 Ocak 2025 (Ödendi)', yield: '%1,05' },
            { name: 'Mistral GYO (3. Taksit)', code: 'MSGYO', gross: '0,24 TL', net: '0,24 TL', date: '18 Mart 2025 (Ödendi)', yield: '%6,25' },
            { name: 'Akçansa', code: 'AKCNS', gross: '6,26 TL', net: '5,32 TL', date: '24 Mart 2025 (Ödendi)', yield: '%3,48' },
            { name: 'Nuh Çimento', code: 'NUHCM', gross: '10,10 TL', net: '8,58 TL', date: '25 Mart 2025 (Ödendi)', yield: '%3,93' },
            { name: 'Agesa Hayat', code: 'AGESA', gross: '5,55 TL', net: '4,72 TL', date: '26 Mart 2025 (Ödendi)', yield: '%3,94' },
            { name: 'Akbank', code: 'AKBNK', gross: '1,22 TL', net: '1,03 TL', date: '26 Mart 2025 (Ödendi)', yield: '%1,81' },
            { name: 'Anadolu Hayat', code: 'ANHYT', gross: '5,81 TL', net: '4,94 TL', date: '26 Mart 2025 (Ödendi)', yield: '%5,63' },
            { name: 'Brisa', code: 'BRISA', gross: '2,12 TL', net: '1,81 TL', date: '28 Mart 2025 (Ödendi)', yield: '%2,68' },
            { name: 'İş Yatırım', code: 'ISMEN', gross: '5,66 TL', net: '4,81 TL', date: '28 Mart 2025 (Ödendi)', yield: '%13,14' },
            { name: 'Ege Endüstri', code: 'EGEEN', gross: '53 TL', net: '45,05 TL', date: '28 Mart 2025 (Ödendi)', yield: '%0,59' },
            { name: 'Anadolu Sigorta', code: 'ANSGR', gross: '4,20 TL', net: '3,57 TL', date: '28 Mart 2025 (Ödendi)', yield: '%3,89' },
            { name: 'Garanti BBVA', code: 'GARAN', gross: '4,38 TL', net: '3,73 TL', date: '28 Mart 2025 (Ödendi)', yield: '%3,14' },
            { name: 'Tüpraş (1. Taksit)', code: 'TUPRS', gross: '7,78 TL', net: '6,61 TL', date: '28 Mart 2025 (Ödendi)', yield: '%11,40' },
            { name: 'İş Bankası (C)', code: 'ISCTR', gross: '0,18 TL', net: '0,15 TL', date: '28 Mart 2025 (Ödendi)', yield: '%0,97' },
            { name: 'Türk Traktör', code: 'TTRAK', gross: '48,46 TL', net: '41,19 TL', date: '2 Nisan 2025 (Ödendi)', yield: '%7,24' },
            { name: 'Çimsa', code: 'CIMSA', gross: '0,63 TL', net: '0,53 TL', date: '2 Nisan 2025 (Ödendi)', yield: '%1,33' },
            { name: 'Sabancı Holding', code: 'SAHOL', gross: '3,00 TL', net: '2,55 TL', date: '2 Nisan 2025 (Ödendi)', yield: '%2,98' },
            { name: 'Aygaz', code: 'AYGAZ', gross: '12,55 TL', net: '10,66 TL', date: '2 Nisan 2025 (Ödendi)', yield: '%8,68' },
            { name: 'Tofaş', code: 'TOASO', gross: '12 TL', net: '10,20 TL', date: '3 Nisan 2025 (Ödendi)', yield: '%6,08' },
            { name: 'Ford Otosan', code: 'FROTO', gross: '17,10 TL', net: '14,53 TL', date: '3 Nisan 2025 (Ödendi)', yield: '%1,93' },
            { name: 'Koç Holding', code: 'KCHOL', gross: '6,88 TL', net: '5,84 TL', date: '10 Nisan 2025 (Ödendi)', yield: '%4,06' },
            { name: 'Alarko Holding', code: 'ALARK', gross: '2,60 TL', net: '2,25 TL', date: '17 Nisan 2025 (Ödendi)', yield: '%3,05' },
            { name: 'Enerjisa', code: 'ENJSA', gross: '2,87 TL', net: '2,43 TL', date: '21 Nisan 2025 (Ödendi)', yield: '%4,95' },
            { name: 'Doğuş Otomotiv', code: 'DOAS', gross: '27,27 TL', net: '23,18 TL', date: '20 Mayıs 2025 (Ödendi)', yield: '%15,77' },
            { name: 'Coca-Cola', code: 'CCOLA', gross: '1,07 TL', net: '0,91 TL', date: '26 Mayıs 2025 (Ödendi)', yield: '%1,99' },
            { name: 'Mavi Giyim', code: 'MAVI', gross: '1,17 TL', net: '0,99 TL', date: '26 Mayıs 2025 (Ödendi)', yield: '%3,58' },
            { name: 'Anadolu Efes', code: 'AEFES', gross: '1,27 TL', net: '1,08 TL', date: '27 Mayıs 2025 (Ödendi)', yield: '%0,72' },
            { name: 'Migros', code: 'MGROS', gross: '6,90 TL', net: '5,86 TL', date: '28 Mayıs 2025 (Ödendi)', yield: '%1,48' },
            { name: 'Şişecam', code: 'SISE', gross: '0,65 TL', net: '0,55 TL', date: '30 Mayıs 2025 (Ödendi)', yield: '%1,83' },
            { name: 'THY (1. Taksit)', code: 'THYAO', gross: '3,44 TL', net: '2,92 TL', date: '16 Haziran 2025 (Ödendi)', yield: '%1,85' },
            { name: 'BİM (1. Taksit)', code: 'BIMAS', gross: '4,00 TL', net: '3,40 TL', date: '18 Haziran 2025 (Ödendi)', yield: '%2,77' },
            { name: 'Turkcell (1. Taksit)', code: 'TCELL', gross: '1,81 TL', net: '1,54 TL', date: '20 Haziran 2025 (Ödendi)', yield: '%3,83' },
            { name: 'Ereğli Demir Çelik', code: 'EREGL', gross: '0,25 TL', net: '0,21 TL', date: '2 Temmuz 2025 (Ödendi)', yield: '%1,11' },
            { name: 'İskenderun Demir Çelik', code: 'ISDMR', gross: '0,25 TL', net: '0,21 TL', date: '2 Temmuz 2025 (Ödendi)', yield: '%0,65' },
            { name: 'Kontrolmatik', code: 'KONTR', gross: '0,03 TL', net: '0,026 TL', date: '8 Temmuz 2025 (Ödendi)', yield: '%0,11' },
            { name: 'Astor Enerji', code: 'ASTOR', gross: '1,51 TL', net: '1,28 TL', date: '18 Ağustos 2025 (Ödendi)', yield: '%1,64' },
            { name: 'THY (2. Taksit)', code: 'THYAO', gross: '3,44 TL', net: '2,92 TL', date: '2 Eylül 2025 (Ödendi)', yield: '%1,85' },
            { name: 'BİM (2. Taksit)', code: 'BIMAS', gross: '4,00 TL', net: '3,40 TL', date: '17 Eylül 2025 (Ödendi)', yield: '%2,77' },
            { name: 'Tüpraş (2. Taksit)', code: 'TUPRS', gross: '7,42 TL', net: '6,30 TL', date: '30 Eylül 2025 (Ödendi)', yield: '%11,40' },
            { name: 'Aselsan', code: 'ASELS', gross: '0,23 TL', net: '0,19 TL', date: '25 Kasım 2025 (Ödendi)', yield: '%0,17' },
            { name: 'BİM (3. Taksit)', code: 'BIMAS', gross: '5,00 TL', net: '4,25 TL', date: '17 Aralık 2025 (Ödendi)', yield: '%2,77' },
            { name: 'Turkcell (2. Taksit)', code: 'TCELL', gross: '1,81 TL', net: '1,54 TL', date: '26 Aralık 2025', yield: '%3,83' },
            { name: 'Enka İnşaat', code: 'ENKAI', gross: '0,83 TL', net: '0,70 TL', date: '14 Ocak 2026', yield: '%1,06' }
        ],
        seoKeywords: [
            '2026 temettü verecek hisseler',
            '2026 temettü takvimi',
            'temettü veren hisseler 2026',
            'Borsa İstanbul temettü listesi',
            'en yüksek temettü veren hisseler 2026',
            'BIST temettü hisseleri',
            'hisse başı temettü',
            'nakit temettü 2026'
        ],
        category: 'Temettü',
        author: 'Volkan Keleş',
        date: '24 Aralık 2025',
        image: '/temettu-2026.png',
        readTime: '12 dk'
    },
    {
        id: 3,
        slug: 'halka-arz-furyasi-devam-edecek-mi',
        title: '2026 Yılında Halka Arz Furyası: Beklentiler ve Riskler',
        excerpt: 'Son dönemde artan halka arzların geleceği ne olacak? Yatırımcılar hangi sektörlere odaklanmalı?',
        content: '<p>İçerik hazırlanıyor...</p>',
        category: 'Halka Arz',
        author: 'Volkan Keleş',
        date: '20 Aralık 2026',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
        readTime: '4 dk'
    }
];

const Blog: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-4 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-500" /> Finans Blogu
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl">
                        Piyasa analizleri, yatırım stratejileri ve finans dünyasından en güncel haberler.
                    </p>
                </div>

                <div className="relative group w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Yazı ara..."
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 focus:bg-zinc-900 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Featured Post (First one) */}
            <div className="mb-16">
                <Link to={`/blog/${BLOG_POSTS[0].slug}`} className="group relative block overflow-hidden rounded-[2.5rem] border border-white/5">
                    <div className="absolute inset-0">
                        <img
                            src={BLOG_POSTS[0].image}
                            alt={BLOG_POSTS[0].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                    </div>

                    <div className="relative p-8 md:p-12 flex flex-col justify-end h-[500px]">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                                {BLOG_POSTS[0].category}
                            </span>
                            <span className="text-zinc-300 text-xs font-mono font-medium flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {BLOG_POSTS[0].date}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                            {BLOG_POSTS[0].title}
                        </h2>

                        <p className="text-zinc-300 text-lg max-w-3xl line-clamp-2 md:line-clamp-none mb-6">
                            {BLOG_POSTS[0].excerpt}
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white font-medium text-sm">{BLOG_POSTS[0].author}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                            <span className="text-zinc-400 text-sm">{BLOG_POSTS[0].readTime} okuma</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Posts Grid */}
            <h3 className="text-2xl font-bold text-white mb-6">Son Yazılar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.slice(1).map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col glass-panel rounded-3xl border border-white/5 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                        <div className="h-56 relative overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-3">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>{post.readTime} okuma</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                {post.title}
                            </h3>

                            <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-zinc-400" />
                                    <span className="text-xs text-zinc-400">{post.author}</span>
                                </div>
                                <span className="flex items-center gap-1 text-sm font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                                    Oku <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default Blog;
