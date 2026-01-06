import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

interface Commodity {
    name: string;
    buy_price: string;
    sell_price: string;
    change_rate: string;
    fetched_at: string;
}

const Emtia: React.FC = () => {
    const [data, setData] = useState<Commodity[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    // Filters and Search
    const [activeTab, setActiveTab] = useState<'Hepsi' | 'Altınlar' | 'Döviz & Emtia'>('Hepsi');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Commodity, direction: 'asc' | 'desc' } | null>(null);

    // Calculator State
    const [calcAmount, setCalcAmount] = useState<number>(1);
    const [calcType, setCalcType] = useState<string>('Gram Altın');
    const [calcResult, setCalcResult] = useState<{ buy: string; sell: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/emtia.json');
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                    if (jsonData.length > 0 && jsonData[0].fetched_at) {
                        setLastUpdated(jsonData[0].fetched_at);
                    }
                    // Initial Calculator Result
                    calculateGold(1, 'Gram Altın', jsonData);
                }
            } catch (error) {
                console.error('Error fetching commodity data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter Logic
    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isGold = item.name.toLowerCase().includes('altın') || item.name.includes('Bilezik');

        if (activeTab === 'Altınlar') return matchesSearch && isGold;
        if (activeTab === 'Döviz & Emtia') return matchesSearch && !isGold;
        return matchesSearch;
    });

    // Sort Logic
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: any = a[sortConfig.key];
        let bValue: any = b[sortConfig.key];

        // Parse numbers for price and rate
        if (sortConfig.key === 'buy_price' || sortConfig.key === 'sell_price') {
            aValue = parseFloat(aValue.replace(/[.,]/g, '').replace('TL', '').replace('$', '').trim()) || 0;
            bValue = parseFloat(bValue.replace(/[.,]/g, '').replace('TL', '').replace('$', '').trim()) || 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Commodity) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getChangeColor = (rate: string) => {
        if (!rate) return 'text-zinc-400';
        if (rate.includes('-')) return 'text-red-500';
        if (rate === '0,00%' || rate === '0%') return 'text-zinc-400';
        return 'text-green-500';
    };

    // Calculator Logic
    const calculateGold = (amount: number, typeName: string, dataset: Commodity[] = data) => {
        // Approximate matching
        const item = dataset.find(d =>
            d.name.toLowerCase().includes(typeName.toLowerCase()) ||
            (typeName === 'Gram Altın' && d.name === 'ALTIN/GR (TL)')
        );

        if (item) {
            const parsePrice = (priceStr: string) => {
                // Remove dots (thousands) and replace comma with dot (decimal)
                // Or simple approach: "2.500,50" -> 2500.50
                // This regex removes dots and replaces comma with dot
                let clean = priceStr.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '');
                return parseFloat(clean);
            };

            const buy = parsePrice(item.buy_price) * amount;
            const sell = parsePrice(item.sell_price) * amount;

            setCalcResult({
                buy: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(buy),
                sell: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(sell)
            });
        }
    };

    useEffect(() => {
        if (data.length > 0) calculateGold(calcAmount, calcType);
    }, [calcAmount, calcType, data]);

    return (
        <div className="min-h-screen bg-zinc-900 text-white pb-12">
            <SEO
                title="Canlı Emtia Fiyatları 2026 - Altın, Gümüş, Petrol ve Döviz | YatırımX"
                description="2026 güncel emtia fiyatları. Gram Altın, Ons Altın, Gümüş, Brent Petrol ve diğer emtiaların anlık alış satış fiyatları ve günlük değişim oranları."
                keywords="emtia fiyatları, canlı altın fiyatları, gümüş fiyatı, brent petrol fiyatı, emtia borsası 2026"
                url="https://yatirimx.com/emtia/"
            />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                            Canlı Piyasalar
                        </h1>
                        <p className="text-zinc-400">
                            Altın, döviz ve emtia fiyatlarını anlık takip edin.
                        </p>
                    </div>
                    {lastUpdated && (
                        <div className="text-sm bg-zinc-800 px-4 py-2 rounded-full text-zinc-400 border border-zinc-700">
                            Son Güncelleme: <span className="text-zinc-200 font-medium">{lastUpdated}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content (Table) */}
                    <div className="lg:col-span-3">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
                            <div className="flex bg-zinc-800 p-1 rounded-xl">
                                {(['Hepsi', 'Altınlar', 'Döviz & Emtia'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Emtia ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder-zinc-500 w-full sm:w-64"
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden backdrop-blur-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-zinc-800 border-b border-zinc-700 text-left">
                                                <th className="p-4 font-semibold text-zinc-300 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>Emtia</th>
                                                <th className="p-4 font-semibold text-zinc-300 cursor-pointer hover:text-white" onClick={() => handleSort('buy_price')}>Alış</th>
                                                <th className="p-4 font-semibold text-zinc-300 cursor-pointer hover:text-white" onClick={() => handleSort('sell_price')}>Satış</th>
                                                <th className="p-4 font-semibold text-zinc-300 text-right cursor-pointer hover:text-white" onClick={() => handleSort('change_rate')}>Değişim</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-700/50">
                                            {sortedData.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-zinc-700/30 transition-colors group"
                                                >
                                                    <td className="p-4">
                                                        <Link to={`/emtia/${slugify(item.name)}`} className="font-semibold text-lg text-white block group-hover:text-blue-400 transition-colors">
                                                            {item.name}
                                                        </Link>
                                                    </td>
                                                    <td className="p-4 font-medium text-zinc-200">{item.buy_price}</td>
                                                    <td className="p-4 font-medium text-zinc-200">{item.sell_price}</td>
                                                    <td className={`p-4 font-bold text-right ${getChangeColor(item.change_rate)}`}>
                                                        {item.change_rate}
                                                    </td>
                                                </tr>
                                            ))}
                                            {sortedData.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                                                        Sonuç bulunamadı.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Calculator */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Gold Calculator */}
                        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/10 border border-yellow-500/10 p-6 rounded-2xl sticky top-24">
                            <h3 className="text-xl font-bold text-yellow-100 mb-4 flex items-center gap-2">
                                💰 Altın Hesapla
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-yellow-500/70 mb-1 uppercase">Miktar</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={calcAmount}
                                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                                        className="w-full bg-black/20 border border-yellow-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-yellow-500/70 mb-1 uppercase">Tür</label>
                                    <select
                                        value={calcType}
                                        onChange={(e) => setCalcType(e.target.value)}
                                        className="w-full bg-black/20 border border-yellow-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50 appearance-none"
                                    >
                                        <option value="Gram Altın">Gram Altın</option>
                                        <option value="Çeyrek Altın">Çeyrek Altın</option>
                                        <option value="Yarım Altın">Yarım Altın</option>
                                        <option value="Tam Altın">Tam Altın</option>
                                        <option value="Cumhuriyet Altını">Cumhuriyet Altını</option>
                                        <option value="Ata Altın">Ata Altın</option>
                                        <option value="Reşat Altın">Reşat Altın</option>
                                        <option value="22 Ayar Bilezik Gramı">22 Ayar Bilezik</option>
                                    </select>
                                </div>

                                {calcResult && (
                                    <div className="mt-4 pt-4 border-t border-yellow-500/10 space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-400">Toplam Alış:</span>
                                            <span className="font-bold text-white">{calcResult.buy}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-400">Toplam Satış:</span>
                                            <span className="font-bold text-yellow-400 text-lg">{calcResult.sell}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-blue-900/10 border border-blue-500/10 rounded-xl text-xs text-blue-200/80 leading-relaxed">
                            💡 <b>İpucu:</b> Hesaplanan değerler anlık piyasa verilerine dayanmaktadır. Kuyumcu veya banka fiyatları farklılık gösterebilir.
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-zinc-800/50 text-xs text-center text-zinc-500 border-t border-zinc-700/50 rounded-xl">
                    Veriler 15 dakika gecikmeli olabilir. Kaynak: Midas. Yatırım tavsiyesi değildir.
                </div>
            </div>
        </div>
    );
};

export default Emtia;
