import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Shield, AlertCircle, Calculator, Info, ChevronRight, BarChart2 } from 'lucide-react';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

// Interface for Commodity Data
interface Commodity {
    name: string;
    buy_price: string;
    sell_price: string;
    change_rate: string;
    fetched_at: string;
}

const EmtiaDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [commodity, setCommodity] = useState<Commodity | null>(null);
    const [relatedItems, setRelatedItems] = useState<Commodity[]>([]);
    const [allData, setAllData] = useState<Commodity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Calculator State
    const [calcAmount, setCalcAmount] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/emtia.json');
                if (response.ok) {
                    const jsonData: Commodity[] = await response.json();
                    setAllData(jsonData);

                    // Find commodity by fuzzy matching the slug
                    const found = jsonData.find(item => slugify(item.name + ' fiyati') === slug || slugify(item.name) === slug);

                    if (found) {
                        setCommodity(found);

                        // Suggest Related Items
                        const isGold = found.name.toLowerCase().includes('altın');
                        const others = jsonData.filter(item =>
                            item.name !== found.name &&
                            (isGold ? item.name.toLowerCase().includes('altın') : !item.name.toLowerCase().includes('altın'))
                        ).slice(0, 5);
                        setRelatedItems(others);
                    } else {
                        setError(true);
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching commodity data:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !commodity) {
        return (
            <div className="min-h-screen bg-zinc-900 text-white flex flex-col justify-center items-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Emtia Bulunamadı</h1>
                <p className="text-zinc-400 mb-6">Aradığınız emtia verisi şu an mevcut değil veya silinmiş olabilir.</p>
                <Link to="/emtia" className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                    Listeye Dön
                </Link>
            </div>
        );
    }

    const isPositive = commodity.change_rate && !commodity.change_rate.includes('-');

    // Helper to parse price
    const parsePrice = (priceStr: string) => {
        let clean = priceStr.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
        return parseFloat(clean) || 0;
    };

    const buyPrice = parsePrice(commodity.buy_price);
    const sellPrice = parsePrice(commodity.sell_price);

    // Spread Calculation
    const spread = sellPrice - buyPrice;
    const spreadPercent = (spread / buyPrice) * 100;

    // Calculator Calculation
    const totalBuy = buyPrice * calcAmount;
    const totalSell = sellPrice * calcAmount;

    // Formatting
    const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);

    // Dynamic FAQ Data
    const faqData = [
        {
            q: `2026 ${commodity.name} fiyatı ne kadar?`,
            a: `${commodity.name} güncel alış fiyatı ${commodity.buy_price}, satış fiyatı ise ${commodity.sell_price} seviyesindedir.`
        },
        {
            q: `${commodity.name} alınır mı?`,
            a: `Piyasa uzmanları, portföy çeşitlendirmesi için ${commodity.name} gibi emtiaların önemini vurgulamaktadır. Günlük değişim oranı ${commodity.change_rate} seviyesindedir.`
        },
        {
            q: `${commodity.name} bozdururken zarar eder miyim?`,
            a: `Alış ve satış arasında %${spreadPercent.toFixed(2)} oranında bir makas (fark) bulunmaktadır. Kısa vadeli al-sat işlemlerinde bu fark önemlidir.`
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-white pb-12">
            <SEO
                title={`${commodity.name} Fiyatı Ne Kadar? Canlı ${commodity.name} Yorumları 2026`}
                description={`2026 ${commodity.name} anlık alış satış fiyatı, canlı grafik ve piyasa yorumları. ${commodity.name} kaç TL? Günlük değişim ve uzman analizleri YatırımX'te.`}
                keywords={`${commodity.name}, ${commodity.name} fiyatı, canlı emtia, altın yorumları 2026, yatırım`}
                url={`https://yatirimx.com/emtia/${slug}/`}
            />

            {/* Breadcrumb */}
            <div className="bg-zinc-800/50 border-b border-white/5 backdrop-blur-md sticky top-16 z-30">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center text-xs md:text-sm text-zinc-400 overflow-x-auto whitespace-nowrap">
                        <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <Link to="/emtia" className="hover:text-white transition-colors">Emtia</Link>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="text-zinc-200 font-medium">{commodity.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN (Main Info) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Header Badge & Title */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase mb-4">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Canlı Piyasa
                            </div>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                                        {commodity.name}
                                    </h1>
                                    <p className="text-zinc-400 flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4" />
                                        Son Güncelleme: {commodity.fetched_at}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isPositive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                    {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                    <span className="font-black text-2xl">{commodity.change_rate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Alış Fiyatı</p>
                                <div className="text-3xl md:text-4xl font-bold text-white">{commodity.buy_price}</div>
                                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ArrowLeft className="w-20 h-20" />
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Satış Fiyatı</p>
                                <div className="text-3xl md:text-4xl font-bold text-yellow-400">{commodity.sell_price}</div>
                                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Shield className="w-20 h-20" />
                                </div>
                            </div>
                        </div>

                        {/* Spread Analysis Card */}
                        <div className="bg-zinc-800/30 border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-purple-400" />
                                Makas Analizi (Spread)
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Alış-Satış Farkı:</span>
                                    <span className="font-bold text-white">{formatCurrency(spread)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400">Makas Oranı:</span>
                                    <span className={`font-bold ${spreadPercent < 2 ? 'text-green-400' : 'text-orange-400'}`}>
                                        %{spreadPercent.toFixed(2)}
                                    </span>
                                </div>
                                {/* Visual Bar */}
                                <div className="h-3 bg-zinc-700 rounded-full overflow-hidden flex">
                                    <div className="bg-green-500 h-full" style={{ width: '50%' }} title="Alış"></div>
                                    <div className="bg-red-500 h-full" style={{ width: `${Math.min(spreadPercent * 10, 50)}%` }} title="Makas"></div>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    *Makas oranı ne kadar düşükse, emtianın likiditesi o kadar yüksektir ve al-sat için o kadar uygundur.
                                </p>
                            </div>
                        </div>

                        {/* SEO Text / Info */}
                        <div className="prose prose-invert max-w-none text-zinc-300 bg-zinc-800/20 p-6 rounded-xl border border-white/5">
                            <h3 className="text-white font-bold text-xl mb-4">{commodity.name} Hakkında</h3>
                            <p>
                                <strong>{commodity.name}</strong>, günümüz finans piyasalarında yatırımcıların en çok takip ettiği
                                enstrümanlardan biridir. 2026 yılı itibarıyla güncel piyasa koşullarında {commodity.buy_price} seviyelerinden
                                işlem gören {commodity.name}, özellikle enflasyondan korunma aracı olarak portföylerde yer almaktadır.
                            </p>
                            <p>
                                YatırımX üzerinden {commodity.name} fiyatlarını anlık olarak takip edebilir, alım ve satım fırsatlarını
                                değerlendirmek için makas aralığını analiz edebilirsiniz.
                            </p>
                        </div>

                        {/* FAQ Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-400" />
                                Sıkça Sorulan Sorular
                            </h3>
                            <div className="grid gap-3">
                                {faqData.map((item, idx) => (
                                    <div key={idx} className="bg-zinc-800/40 border border-white/5 rounded-xl p-4">
                                        <h4 className="font-bold text-zinc-200 mb-2">{item.q}</h4>
                                        <p className="text-sm text-zinc-400">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <div className="space-y-6">

                        {/* Contextual Calculator */}
                        <div className="bg-gradient-to-b from-yellow-900/20 to-zinc-900 border border-yellow-500/20 rounded-2xl p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Calculator className="w-5 h-5 text-yellow-500" />
                                </div>
                                <h3 className="font-bold text-lg text-yellow-100">Değer Hesapla</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Eldeki Miktar (Adet)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={calcAmount}
                                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                                        className="w-full bg-black/40 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-yellow-500 transition-colors"
                                    />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-zinc-400">Toplam Alış Değeri:</span>
                                        <span className="font-bold text-white text-lg">{formatCurrency(totalBuy)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-zinc-400">Toplam Satış Değeri:</span>
                                        <span className="font-bold text-yellow-400 text-xl">{formatCurrency(totalSell)}</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-500 text-center">
                                    *Hesaplamalar anlık kur üzerinden yapılmaktadır.
                                </p>
                            </div>
                        </div>

                        {/* Related Items Sidebar */}
                        <div className="bg-zinc-800/30 border border-white/5 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4">İlginizi Çekebilir</h3>
                            <div className="space-y-3">
                                {relatedItems.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        to={`/emtia/${slugify(item.name)}`}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                                    >
                                        <div>
                                            <div className="font-medium text-sm text-zinc-200 group-hover:text-blue-400 transition-colors">
                                                {item.name}
                                            </div>
                                            <div className="text-[10px] text-zinc-500">{item.fetched_at}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-white">{item.sell_price}</div>
                                            <div className={`text-[10px] font-bold ${item.change_rate.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
                                                {item.change_rate}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmtiaDetail;
