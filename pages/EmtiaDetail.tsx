import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, Shield, AlertCircle } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/emtia.json');
                if (response.ok) {
                    const jsonData: Commodity[] = await response.json();
                    // Find commodity by fuzzy matching the slug
                    const found = jsonData.find(item => slugify(item.name + ' fiyati') === slug || slugify(item.name) === slug);

                    if (found) {
                        setCommodity(found);
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

    // Custom Description Generator
    const generateDescription = () => {
        return `2026 ${commodity.name} güncel fiyatı, canlı alış satış grafiği ve ${commodity.name} hakkında son dakika yorumları YatırımX'te. Anlık ${commodity.buy_price} seviyesinden işlem gören ${commodity.name} günlük ${commodity.change_rate} değişim gösterdi.`;
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white pb-12">
            <SEO
                title={`${commodity.name} Fiyatı Ne Kadar? Canlı ${commodity.name} Alış Satış - 2026`}
                description={generateDescription()}
                keywords={`${commodity.name} fiyatı, canlı ${commodity.name}, ${commodity.name} ne kadar, altın fiyatları, emtia borsası`}
                url={`https://yatirimx.com/emtia/${slug}`}
            />

            {/* Breadcrumb */}
            <div className="bg-zinc-800/50 border-b border-white/5">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center text-sm text-zinc-400">
                        <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
                        <span className="mx-2">/</span>
                        <Link to="/emtia" className="hover:text-white transition-colors">Emtia</Link>
                        <span className="mx-2">/</span>
                        <span className="text-zinc-200">{commodity.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                                <Shield className="w-6 h-6 text-yellow-500" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">{commodity.name}</h1>
                        </div>
                        <p className="text-zinc-400">Canlı Piyasa Verileri • Son Güncelleme: {commodity.fetched_at}</p>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${isPositive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        <span className="font-bold text-lg">{commodity.change_rate}</span>
                    </div>
                </div>

                {/* Main Price Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Buy Card */}
                    <div className="bg-zinc-800/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-24 h-24" />
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Alış Fiyatı</h3>
                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            {commodity.buy_price}
                        </div>
                        <p className="text-sm text-zinc-500">Bankalar ve piyasa ortalaması alış fiyatıdır.</p>
                    </div>

                    {/* Sell Card */}
                    <div className="bg-zinc-800/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield className="w-24 h-24" />
                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Satış Fiyatı</h3>
                        <div className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            {commodity.sell_price}
                        </div>
                        <p className="text-sm text-zinc-500">Bankalar ve kuyumcuların satış fiyatıdır.</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-zinc-800/30 border border-white/5 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Piyasa Özeti ve Yorum
                        </h3>
                        <div className="prose prose-invert max-w-none text-zinc-300">
                            <p>
                                {commodity.name}, yatırımcılar için güvenli liman olma özelliğini koruyor.
                                2026 yılı itibarıyla {commodity.buy_price} seviyesinden işlem gören {commodity.name},
                                günlük bazda {commodity.change_rate} oranında bir değişim sergiliyor.
                            </p>
                            <p>
                                Küresel piyasalardaki gelişmeler, enflasyon verileri ve merkez bankalarının faiz kararları,
                                {commodity.name} fiyatları üzerinde belirleyici olmaya devam ediyor.
                                Analistler, özellikle orta ve uzun vadede portföy çeşitlendirmesi açısından emtiaların önemini vurguluyor.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/10 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4 text-blue-100">Neden Takip Etmelisin?</h3>
                        <ul className="space-y-3 text-sm text-blue-200/80">
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full"></span>
                                Enflasyona karşı koruma sağlar.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full"></span>
                                Portföy riskini dağıtır.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 mt-1.5 bg-blue-400 rounded-full"></span>
                                Global likiditesi yüksektir.
                            </li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Link to="/emtia" className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm">
                                Diğer Emtiaları İncele
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default EmtiaDetail;
