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
                }
            } catch (error) {
                console.error('Error fetching commodity data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getChangeColor = (rate: string) => {
        if (!rate) return 'text-zinc-400';
        if (rate.includes('-')) return 'text-red-500';
        if (rate === '0,00%' || rate === '0%') return 'text-zinc-400';
        return 'text-green-500';
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white pb-12">
            <SEO
                title="Canlı Emtia Fiyatları 2026 - Altın, Gümüş, Petrol ve Döviz | YatırımX"
                description="2026 güncel emtia fiyatları. Gram Altın, Ons Altın, Gümüş, Brent Petrol ve diğer emtiaların anlık alış satış fiyatları ve günlük değişim oranları."
                keywords="emtia fiyatları, canlı altın fiyatları, gümüş fiyatı, brent petrol fiyatı, emtia borsası 2026"
                url="https://yatirimx.com/emtia"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                        Canlı Emtia Fiyatları
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Küresel piyasalardaki son emtia fiyatlarını, alış-satış değerlerini ve günlük değişimleri buradan takip edebilirsiniz.
                    </p>
                    {lastUpdated && (
                        <div className="mt-4 text-sm text-zinc-500">
                            Son Güncelleme: <span className="text-zinc-300">{lastUpdated}</span>
                        </div>
                    )}
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
                                        <th className="p-4 font-semibold text-zinc-300">Emtia</th>
                                        <th className="p-4 font-semibold text-zinc-300">Alış</th>
                                        <th className="p-4 font-semibold text-zinc-300">Satış</th>
                                        <th className="p-4 font-semibold text-zinc-300 text-right">Değişim</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-700/50">
                                    {data.map((item, index) => (
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
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 bg-zinc-800/50 text-xs text-center text-zinc-500 border-t border-zinc-700/50">
                            Veriler 15 dakika gecikmeli olabilir. Kaynak: Midas
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Emtia;
