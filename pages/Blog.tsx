import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Search, Tag } from 'lucide-react';
import { DIVIDEND_DATA } from '../data/dividendData';

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
        author: 'Volkan Eles',
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
      <h3>2026 Temettü Takvimi Neyi Gösterir?</h3>
      <p>2026 temettü takvimi; temettü ödeme tarihi, hisse başı brüt temettü, hisse başı net temettü ve temettü verimi gibi yatırım kararlarında kritik öneme sahip bilgileri içerir.</p>
      
      <div class="bg-blue-500/10 border-l-4 border-blue-500 p-4 my-4">
        <p class="text-sm text-blue-200">Not: Aşağıdaki tabloda yer alan veriler, temettü kararının açıklandığı gün oluşan hisse fiyatı baz alınarak hesaplanmıştır. Taksitli temettü ödeyen şirketlerde temettü verimi, toplam temettü tutarı üzerinden hesaplanmıştır.</p>
      </div>

      <h2>2026 Temettü Verecek Hisseler (Kesinleşenler)</h2>
      <h3>2026 Yılında Temettü Dağıtacak Şirketler</h3>
      <p>2026 yılı itibarıyla temettü dağıtımı kesinleşen şirketlerin listesi gün geçtikçe genişlemektedir. Bu liste, KAP’a yapılan resmi bildirimler doğrultusunda hazırlanmakta ve anlık olarak güncellenmektedir.</p>

      <div class="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 my-4">
        <p class="font-bold text-yellow-500 mb-2">📌 Önemli Not:</p>
        <ul class="list-disc pl-6 space-y-1 text-yellow-200 text-sm">
          <li>“Ödendi” ibaresi bulunan temettüler yatırımcı hesaplarına geçmiştir.</li>
          <li>Açıklanmadı olarak belirtilen temettü tarihleri, şirket tarafından henüz duyurulmamıştır.</li>
        </ul>
      </div>

      <h2>2026 Temettü Veren Hisseler Tablosu</h2>
      <p>🔽 Aşağıda yer alan tablo, 2026 yılına ait temettü dağıtımlarını; şirket adı, hisse kodu, brüt/net temettü, ödeme tarihi ve temettü verimi ile birlikte göstermektedir.</p>

      <h2>2026 Temettü Veren Hisseler Güvenilir mi?</h2>
      <p>Temettü listesinde yer alan tüm şirketler:</p>
      <ul class="list-disc pl-6 space-y-2 text-zinc-300 mb-6">
        <li>Borsa İstanbul’da işlem görmektedir</li>
        <li>SPK ve KAP mevzuatına tabidir</li>
        <li>Resmî genel kurul kararları ile temettü dağıtır</li>
      </ul>
      <p>Ancak unutulmamalıdır ki temettü yatırımında tek kriter verim değildir. Şirketin sürdürülebilir kârlılığı, borçluluk durumu ve sektörel riskler mutlaka değerlendirilmelidir.</p>

      <h2>2026 Temettü Yatırımı Yaparken Nelere Dikkat Edilmeli?</h2>
      <ul class="list-none space-y-2 text-zinc-300 mb-6">
        <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Düzenli Temettü Geçmişi</li>
        <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Şirketin Nakit Akışı</li>
        <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Temettü Verimi (Aşırı yüksek oranlara dikkat)</li>
        <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Taksitli / Tek seferlik ödeme yapısı</li>
        <li class="flex items-center gap-2"><span class="text-green-500">✔</span> Uzun vadeli büyüme potansiyeli</li>
      </ul>
    `,
        tableType: 'dividend',
        tableData: DIVIDEND_DATA,
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
        author: 'Volkan Eles',
        date: '24 Aralık 2025',
        image: '/temettu-2026.png',
        readTime: '12 dk'
    },

    {
        id: 3,
        slug: 'lot-sayisi-az-olan-hisseler-2026',
        title: 'Lot Sayısı Az Olan Hisseler 2026 | Borsa İstanbul Küçük Sermayeli Hisseler',
        excerpt: 'Borsada 2026 yılında lot sayısı az olan hisseler hangileri? Küçük sermayeli şirketler ve avantajları/dezavantajları hakkında detaylı analiz.',
        content: `
            <p>Borsa İstanbul’da yatırım yapan tasarruf sahiplerinin son dönemde ilgilendiği konulardan biri, ödenmiş sermayesi yani lot sayısı az olan hisse senetleri oluyor. Lot, bir hissenin bir seferde alınıp satılabilen en küçük miktarını ifade eder. Lot sayısı az olan hisselerin, lot sayısı fazla olan hisselere göre bazı avantajları ve dezavantajları vardır.</p>

            <p><strong>Lot sayısı az olan hisseler</strong>, yatırımcılara daha fazla kontrol sağlar. Bunun nedeni, daha az sayıda hisse bulunması ve bu nedenle yatırımcıların fiyat hareketlerini daha fazla etkileyebilmesidir. Bunun yanında lot sayısı az olan hisseler, genellikle daha düşük likiditeye sahiptir.</p>

            <h2>Ödenmiş Sermaye Nedir?</h2>
            <p>Ödenmiş sermaye, borsada şirketlerin ortakları tarafından taahhüt edilen sermayenin nakit olan kısmına denir. Şirketin ödenmiş sermayesi, toplam hisse sayısı ile hissenin nominal değerinin çarpımı ile bulunur. Borsada hisselerin nominal değerleri 1 TL olarak kullanıldığından bir lot hisse şirketin ödenmiş sermayesindeki 1 TL’ye karşılık gelir.</p>

            <h2>Borsada Lot Sayısı Az Olan Şirketler (2026)</h2>
            <p>Borsada yıl içerisinde birçok şirket, sermaye artırım yoluyla sermayelerini yükseltirken 2026 yılında lot sayısı az olan hisseler sıralamasında değişiklikler oldu. İşte lot sayısı az olan hisselerin güncel listesi:</p>

            <h3>Lot Sayısı Az Olan Hisselerin Avantajları</h3>
            <ul>
                <li><strong>Hızlı Fiyat Hareketleri:</strong> İşlem hacmi düşük olduğu için fiyat hareketleri daha hızlı ve belirgin olabilir.</li>
                <li><strong>Potansiyel Getiri:</strong> Düşük sermayeli şirketler büyüme potansiyeli taşıdığında hisse fiyatları agresif yükselebilir.</li>
            </ul>

            <h3>Lot Sayısı Az Olan Hisselerin Dezavantajları</h3>
            <ul>
                <li><strong>Düşük Likidite:</strong> Hisselerin hızlı ve kolay satılması zor olabilir.</li>
                <li><strong>Volatilite:</strong> Fiyatlamalar bazen mantıksız seviyelere ulaşabilir ve manipülasyona daha açıktır.</li>
            </ul>
        `,
        tableType: 'lot_count',
        tableData: [
            { name: 'Çimbeton Hazırbeton ve Prefabrik Yapı Elemanları Sanayi ve Ticaret A.Ş.', code: 'CMBTN', lot: '1.770.000' },
            { name: 'Lydia Yeşil Enerji Kaynakları A.Ş.', code: 'LYDYE', lot: '1.891.069' },
            { name: 'Ege Endüstri ve Ticaret A.Ş.', code: 'EGEEN', lot: '3.150.000' },
            { name: 'Politeknik Metal Sanayi ve Ticaret A.Ş.', code: 'POLTK', lot: '3.750.000' },
            { name: 'Kuştur Kuşadası Turizm Endüstri A.Ş.', code: 'KSTUR', lot: '4.244.586' },
            { name: 'Konya Çimento Sanayii A.Ş.', code: 'KONYA', lot: '4.873.440' },
            { name: 'Casa Emtia Petrol Kimyevi ve Türevleri Sanayi Ticaret A.Ş.', code: 'CASA', lot: '4.900.000' },
            { name: 'Eminiş Ambalaj Sanayi ve Ticaret A.Ş.', code: 'EMNIS', lot: '6.200.000' },
            { name: 'Sumaş Suni Tahta ve Mobilya Sanayi A.Ş.', code: 'SUMAS', lot: '6.224.400' },
            { name: 'Cosmos Yatırım Holding A.Ş.', code: 'COSMO', lot: '6.494.694' },
            { name: 'Marmaris Altınyunus Turistik Tesisler A.Ş.', code: 'MAALT', lot: '6.967.091' },
            { name: 'Burçelik Vana Sanayi ve Ticaret A.Ş.', code: 'BURVA', lot: '7.347.672' },
            { name: 'Pergamon Status Dış Ticaret A.Ş.', code: 'PSDTC', lot: '7.425.000' },
            { name: 'Otto Holding A.Ş.', code: 'OTTO', lot: '7.635.461' },
            { name: 'Senkron Güvenlik ve İletişim Sistemleri A.Ş.', code: 'SNKRN', lot: '7.849.206' },
            { name: 'İnnosa Teknoloji A.Ş.', code: 'INTEK', lot: '8.000.000' },
            { name: 'Ekiz Kimya Sanayi ve Ticaret A.Ş.', code: 'EKIZ', lot: '9.284.470' },
            { name: 'Skyalp Finansal Teknolojiler ve Danışmanlık A.Ş.', code: 'SKYLP', lot: '9.500.000' },
            { name: 'Diriteks Diriliş Tekstil Sanayi ve Ticaret A.Ş.', code: 'DIRIT', lot: '10.650.000' },
            { name: 'Acıselsan Acıpayam Selüloz Sanayi ve Ticaret A.Ş.', code: 'ACSEL', lot: '10.721.700' },
            { name: 'Alarko Carrier Sanayi ve Ticaret A.Ş.', code: 'ALCAR', lot: '10.800.000' },
            { name: 'Do & Co Aktiengesellschaft', code: 'DOCO', lot: '10.983.458' },
            { name: 'Marshall Boya ve Vernik Sanayii A.Ş.', code: 'MRSHL', lot: '10.994.134' },
            { name: 'Mmc Sanayi ve Ticari Yatırımlar A.Ş.', code: 'MMCAS', lot: '13.336.879' },
            { name: 'Balatacılar Balatacılık Sanayi ve Ticaret A.Ş.', code: 'BALAT', lot: '13.878.486' },
            { name: 'Temapol Polimer Plastik ve İnşaat Sanayi Ticaret A.Ş.', code: 'TMPOL', lot: '14.175.000' },
            { name: 'Yaprak Süt ve Besi Çiftlikleri Sanayi ve Ticaret A.Ş.', code: 'YAPRK', lot: '14.200.000' },
            { name: 'Federal-Mogul İzmit Piston ve Pim Üretim Tesisleri A.Ş.', code: 'FMIZP', lot: '14.276.790' },
            { name: 'Sodaş Sodyum Sanayii A.Ş.', code: 'SODSN', lot: '15.000.000' },
            { name: 'Yonga Mobilya Sanayi ve Ticaret A.Ş.', code: 'YONGA', lot: '16.800.000' },
            { name: 'İZ Yatırım Holding A.Ş', code: 'IZINV', lot: '17.512.456' },
            { name: 'Göltaş Göller Bölgesi Çimento Sanayi ve Ticaret A.Ş.', code: 'GOLTS', lot: '18.000.000' },
            { name: 'San-El Mühendislik Elektrik Taahhüt Sanayi ve Ticaret A.Ş.', code: 'SANEL', lot: '18.255.333' },
            { name: 'İntema İnşaat ve Tesisat Malzemeleri Yatırım ve Pazarlama A.Ş.', code: 'INTEM', lot: '19.440.000' },
            { name: 'Doğan Burda Dergi Yayıncılık ve Pazarlama A.Ş.', code: 'DOBUR', lot: '19.559.175' },
            { name: 'Kafein Yazılım Hizmetleri Ticaret A.Ş.', code: 'KFEIN', lot: '19.750.000' },
            { name: 'Euro Trend Yatırım Ortaklığı A.Ş.', code: 'ETYAT', lot: '20.000.000' },
            { name: 'Marka Yatırım Holding A.Ş.', code: 'MARKA', lot: '20.990.000' },
            { name: 'Tarkim Bitki Koruma Sanayi ve Ticaret A.Ş.', code: 'TARKM', lot: '21.000.000' },
            { name: 'Link Bilgisayar Sistemleri Yazılımı ve Donanımı Sanayi ve Ticaret A.Ş.', code: 'LINK', lot: '21.750.120' },
            { name: 'Selçuk Gıda Endüstri İhracat İthalat A.Ş.', code: 'SELGD', lot: '22.000.000' },
            { name: 'Plastikkart Akıllı Kart İletişim Sistemleri Sanayi ve Ticaret A.Ş.', code: 'PKART', lot: '22.750.000' },
            { name: 'Despec Bilgisayar Pazarlama ve Ticaret A.Ş.', code: 'DESPC', lot: '23.000.000' },
            { name: 'Oncosem Onkolojik Sistemler Sanayi ve Ticaret A.Ş.', code: 'ONCSM', lot: '23.850.000' },
            { name: 'Ingram Micro Bilişim Sistemleri A.Ş.', code: 'INGRM', lot: '24.000.000' },
            { name: 'Çelebi Hava Servisi A.Ş.', code: 'CLEBI', lot: '24.300.000' },
            { name: 'Petrokent Turizm A.Ş.', code: 'PKENT', lot: '24.883.200' },
            { name: 'Altın Yunus Çeşme Turistik Tesisler A.Ş.', code: 'AYCES', lot: '25.000.000' },
            { name: 'Akın Tekstil A.Ş.', code: 'ATEKS', lot: '25.200.000' },
            { name: 'Ulaşlar Turizm Yatırımları ve Dayanıklı Tüketim Malları Ticaret Pazarlama A.Ş.', code: 'ULAS', lot: '25.382.375' },
            { name: 'Orma Orman Mahsulleri Entegre Sanayi ve Ticaret A.Ş.', code: 'ORMA', lot: '27.200.000' },
            { name: 'Lüks Kadife Ticaret ve Sanayii A.Ş.', code: 'LUKSK', lot: '28.000.000' },
            { name: 'Borusan Yatırım ve Pazarlama A.Ş.', code: 'BRYAT', lot: '28.125.000' },
            { name: 'Rodrigo Tekstil Sanayi ve Ticaret A.Ş.', code: 'RODRG', lot: '28.340.000' },
            { name: 'Tera Finansal Yatırımlar Holding A.Ş.', code: 'TRHOL', lot: '30.000.000' },
            { name: 'Kuvva Gıda Ticaret ve Sanayi Yatırımları A.Ş.', code: 'KUVVA', lot: '31.042.007' },
            { name: 'Pamukova Yenilenebilir Elektrik Üretimi A.Ş.', code: 'PAMEL', lot: '31.095.331' },
            { name: 'Smartiks Yazılım A.Ş.', code: 'SMART', lot: '31.862.500' },
            { name: 'İşbir Holding A.Ş.', code: 'ISBIR', lot: '32.387.040' },
            { name: 'Karsu Tekstil Sanayii ve Ticaret A.Ş.', code: 'KRTEK', lot: '35.100.498' },
            { name: 'Safkar Ege Soğutmacılık Klima Soğuk Hava Tesisleri İhracat İthalat Sanayi ve Ticaret A.Ş.', code: 'SAFKR', lot: '35.250.000' },
            { name: 'Ersu Meyve ve Gıda Sanayi A.Ş.', code: 'ERSU', lot: '36.000.000' },
            { name: 'Saray Matbaacılık Kağıtçılık Kırtasiyecilik Ticaret ve Sanayi A.Ş.', code: 'SAMAT', lot: '36.600.000' },
            { name: 'Avrupa Yatırım Holding A.Ş.', code: 'AVHOL', lot: '37.250.000' },
            { name: 'Garanti Yatırım Ortaklığı A.Ş.', code: 'GRNYO', lot: '37.500.000' },
            { name: 'Bülbüloğlu Vinç Sanayi ve Ticaret A.Ş.', code: 'BVSAN', lot: '37.600.000' },
            { name: 'Alcatel Lucent Teletaş Telekomünikasyon A.Ş.', code: 'ALCTL', lot: '38.700.772' },
            { name: 'Gündoğdu Gıda Süt Ürünleri Sanayi ve Dış Ticaret A.Ş.', code: 'GUNDG', lot: '39.000.000' },
            { name: 'Kütahya Porselen Sanayi A.Ş.', code: 'KUTPO', lot: '39.916.800' },
            { name: 'Umpaş Holding A.Ş.', code: 'UMPAS', lot: '42.000.000' },
            { name: 'Ceo Event Medya A.Ş.', code: 'CEOEM', lot: '44.000.000' },
            { name: 'Birlik Mensucat Ticaret ve Sanayi İşletmesi A.Ş.', code: 'BRMEN', lot: '44.627.051' },
            { name: 'Silverline Endüstri ve Ticaret A.Ş.', code: 'SILVR', lot: '45.000.000' },
            { name: 'Obase Bilgisayar ve Danışmanlık Hizmetleri Ticaret A.Ş.', code: 'OBASE', lot: '45.500.000' },
            { name: 'Kütahya Şeker Fabrikası A.Ş.', code: 'KTSKR', lot: '46.000.000' },
            { name: 'Gediz Ambalaj Sanayi ve Ticaret A.Ş.', code: 'GEDZA', lot: '46.656.000' },
            { name: 'Ufuk Yatırım Yönetim ve Gayrimenkul A.Ş.', code: 'UFUK', lot: '46.846.881' },
            { name: 'Ata Gayrimenkul Yatırım Ortaklığı A.Ş.', code: 'ATAGY', lot: '47.500.000' },
            { name: 'Yayla Enerji Üretim Turizm ve İnşaat Ticaret A.Ş.', code: 'YAYLA', lot: '49.875.000' },
            { name: 'Verusatürk Girişim Sermayesi Yatırım Ortaklığı A.Ş.', code: 'VERTU', lot: '52.000.000' },
            { name: 'Sekuro Plastik Ambalaj Sanayi A.Ş.', code: 'SEKUR', lot: '53.611.826' },
            { name: 'Derimod Konfeksiyon Ayakkabı Deri Sanayi ve Ticaret A.Ş.', code: 'DERIM', lot: '54.000.000' },
            { name: 'A1 Yenilenebilir Enerji Üretim A.Ş.', code: 'A1YEN', lot: '55.000.000' },
            { name: 'Dofer Yapı Malzemeleri Sanayi ve Ticaret A.Ş.', code: 'DOFER', lot: '55.750.000' },
            { name: 'Birikim Varlık Yönetim A.Ş.', code: 'BRKVY', lot: '56.000.000' },
            { name: 'Bayrak Ebt Taban Sanayi ve Ticaret A.Ş.', code: 'BAYRK', lot: '56.465.188' },
            { name: 'SDT Uzay ve Savunma Teknolojileri A.Ş.', code: 'SDTTR', lot: '58.000.000' },
            { name: 'İzmir Fırça Sanayi ve Ticaret A.Ş.', code: 'IZFAS', lot: '59.062.500' },
            { name: 'Atlas Menkul Kıymetler Yatırım Ortaklığı A.Ş.', code: 'ATLAS', lot: '60.000.000' },
        ],
        seoKeywords: [
            'lot sayısı az olan hisseler 2026',
            'küçük sermayeli hisseler',
            'dolaşımdaki lot sayısı en az olan hisseler',
            'az lotlu hisseler',
            'borsa istanbul küçük sermayeli şirketler',
            'ödenmiş sermayesi düşük hisseler'
        ],
        category: 'Hisse Analiz',
        author: 'Volkan Eles',
        date: '27 Aralık 2025',
        image: '/lot-sayisi-az-hisseler-2026.png',
        readTime: '6 dk'
    },
    {
        id: 4,
        slug: 'halka-arz-furyasi-devam-edecek-mi',
        title: '2026 Yılında Halka Arz Furyası: Beklentiler ve Riskler',
        excerpt: 'Son dönemde artan halka arzların geleceği ne olacak? Yatırımcılar hangi sektörlere odaklanmalı?',
        content: '<p>İçerik hazırlanıyor...</p>',
        category: 'Halka Arz',
        author: 'Volkan Eles',
        date: '20 Aralık 2026',
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop',
        readTime: '4 dk'
    }
];

import SEO from '../components/SEO';

const Blog: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            <SEO
                title="Finans Blogu - Piyasa Analizleri ve Yatırım Stratejileri | YatırımX"
                description="Borsa İstanbul piyasa analizleri, 2026 yatırım stratejileri, bedelsiz sermaye artırımı takvimi, temettü tahminleri ve eğitici finans içerikleri."
                canonicalUrl="https://yatirimx.com/blog/"
                keywords="borsa blog, finans analizleri, yatırım stratejileri, hisse senedi yorumları, borsa eğitim"
            />

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
