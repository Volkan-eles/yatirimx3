
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, ChevronRight, Target, ShieldCheck, PieChart, Info, Calendar, Loader2 } from 'lucide-react';
import SEO from '../components/SEO';
import FAQItem from '../components/FAQItem';

interface Recommendation {
    symbol: string;
    date: string;
    recommendation: string;
    target_price: string;
    potential?: string;
}

interface Broker {
    name: string;
    url: string;
    total_reports: number;
    recommendations: Recommendation[];
}

const StatCard = ({ label, value, subValue, trend, icon: Icon }: any) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-zinc-900 rounded-xl border border-white/10 text-zinc-400 group-hover:text-white group-hover:bg-blue-600/20 transition-all">
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`text-xs font-bold flex items-center gap-1 ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {subValue}
                </div>
            )}
        </div>
        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
    </div>
);

const BrokerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // 'id' contains the slug here
    const [broker, setBroker] = useState<Broker | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBroker = async () => {
            try {
                const response = await fetch('/brokers_tefas.json');
                if (response.ok) {
                    const data: Broker[] = await response.json();
                    // Find broker by slug matching
                    const found = data.find(b =>
                        b.name.toLowerCase().replace(/\s+/g, '-') === id
                    );
                    setBroker(found || null);
                }
            } catch (error) {
                console.error("Error fetching broker detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBroker();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <p>Veriler yükleniyor...</p>
            </div>
        );
    }

    if (!broker) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500">
                <div className="p-4 bg-zinc-900 rounded-full mb-4">
                    <Info className="w-12 h-12 text-zinc-700" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Kurum Kaydı Bulunamadı</h2>
                <Link to="/araci-kurumlar" className="text-blue-400 hover:underline">Kurumlar Listesine Dön</Link>
            </div>
        );
    }

    // Derived Stats
    const totalRecs = broker.recommendations?.length || 0;
    const buyRecs = broker.recommendations?.filter(r => r.recommendation.toLowerCase().includes('al')).length || 0;
    const holdRecs = broker.recommendations?.filter(r => r.recommendation.toLowerCase().includes('tut') || r.recommendation.toLowerCase().includes('nötr')).length || 0;
    const sellRecs = broker.recommendations?.filter(r => r.recommendation.toLowerCase().includes('sat')).length || 0;

    const buyPct = totalRecs > 0 ? Math.round((buyRecs / totalRecs) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-7xl mx-auto">
            {broker && (
                <SEO
                    title={`${broker.name} Hedef Fiyatlar ve Hisse Önerileri 2026 | YatirimX`}
                    description={`${broker.name} 2026 hedef fiyat tahminleri, hisse önerileri, model portföyü ve şirket analiz raporları. ${broker.name} al/sat tavsiyeleri.`}
                    keywords={`${broker.name}, ${broker.name} hedef fiyat, ${broker.name} hisse önerileri, 2026 borsa, aracı kurum raporları`}
                />
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <Link to="/araci-kurumlar" className="p-3 bg-zinc-900 border border-white/10 rounded-2xl text-zinc-500 hover:text-white transition-all shadow-lg">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold text-white tracking-tight">{broker.name}</h1>
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                SPK LİSANSLI
                            </span>
                        </div>
                        <p className="text-zinc-400 max-w-md leading-relaxed">
                            Sermaye piyasalarında kurumsal araştırma raporları ve hedef fiyat tahminleri.
                        </p>
                        <a href={broker.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs hover:underline mt-2 inline-block">
                            Resmi Web Sitesi
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Analysis Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column (8 units) */}
                <div className="lg:col-span-8 space-y-8">

                    {/* KPI Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard label="Toplam Rapor" value={totalRecs} trend="up" icon={Activity} />
                        <StatCard label="Al Önerisi" value={buyRecs} subValue={`%${buyPct}`} trend="up" icon={TrendingUp} />
                        <StatCard label="Tut/Nötr" value={holdRecs} trend="up" icon={ShieldCheck} />
                        <StatCard label="Sat" value={sellRecs} trend={sellRecs > 0 ? 'down' : undefined} icon={TrendingDown} />
                    </div>

                    {/* Recommendations List */}
                    <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Target className="w-5 h-5 text-orange-500" /> Hedef Fiyatlar & Öneriler
                            </h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {broker.recommendations && broker.recommendations.length > 0 ? (
                                broker.recommendations.map((rec, i) => (
                                    <div key={i} className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-6">
                                            <Link to={`/hisse/${rec.symbol}`} className="w-14 h-14 rounded-xl bg-zinc-900 border border-white/10 flex flex-col items-center justify-center group-hover:bg-blue-900/20 group-hover:border-blue-500/30 transition-all">
                                                <span className="font-black text-sm text-white">{rec.symbol}</span>
                                            </Link>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight ${rec.recommendation.toLowerCase() === 'al' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        rec.recommendation.toLowerCase() === 'sat' ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-500/10 text-zinc-400'
                                                        }`}>
                                                        {rec.recommendation}
                                                    </span>
                                                    <span className="text-sm font-bold text-white tabular-nums">{rec.target_price}</span>
                                                </div>
                                                <div className="text-xs text-zinc-500 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{rec.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={`/hisse/${rec.symbol}`}>
                                            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-zinc-500">
                                    Henüz rapor bulunmamaktadır.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (4 units) */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Recommendation Distribution Widget */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-zinc-900/20">
                        <h3 className="text-lg font-bold text-white mb-8">Öneri Dağılımı</h3>
                        <div className="flex items-end justify-between h-32 gap-4 mb-6">
                            {[
                                { label: 'Al', val: buyRecs, color: 'bg-emerald-500' },
                                { label: 'Tut', val: holdRecs, color: 'bg-zinc-600' },
                                { label: 'Sat', val: sellRecs, color: 'bg-rose-500' }
                            ].map((d, i) => {
                                const total = totalRecs;
                                const pct = total > 0 ? (d.val / total) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="text-[10px] text-zinc-500 font-bold tabular-nums">{d.val}</div>
                                        <div className={`w-full ${d.color} rounded-t-lg transition-all duration-1000`} style={{ height: `${pct > 0 ? pct : 2}%` }}></div>
                                        <div className="text-[10px] text-zinc-400 font-bold uppercase">{d.label}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed text-center italic">
                            Analist raporlarının toplam dağılımı kurumun genel piyasa duyarlılığını yansıtmaktadır.
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5">
                        <div className="flex gap-4">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Hedef fiyatlar ve öneriler, ilgili aracı kurumun kendi analistleri tarafından yayınlanan raporlardan derlenmiştir. Yatırım kararı almadan önce kurumun orijinal raporunu incelemeniz önerilir.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* FAQ Section */}
            <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 mt-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    {broker.name} Hakkında Sıkça Sorulan Sorular (2026)
                </h2>

                <div className="space-y-4">
                    <FAQItem
                        question={`${broker.name} 2026 Hedef Fiyatları Güvenilir mi?`}
                        answer={`${broker.name}, SPK lisanslı ve sektörde saygınlığı olan bir aracı kurumdur. Yayınladıkları 2026 hedef fiyatları ve hisse önerileri, uzman analist kadrosu tarafından detaylı piyasa araştırmaları ve şirket değerlemeleri sonucunda hazırlanmaktadır. Ancak her yatırım tavsiyesi risk içerir ve piyasa koşullarına göre değişebilir.`}
                    />
                    <FAQItem
                        question={`${broker.name} Hangi Hisseler İçin "AL" Önerisi Veriyor?`}
                        answer={`${broker.name} tarafından yayınlanan güncel raporlarda ${buyRecs} adet hisse için "AL" önerisi bulunmaktadır (Yukarıdaki istatistiklerden dağılımı inceleyebilirsiniz). Kurum, genellikle büyüme potansiyeli yüksek ve 2026 vizyonu güçlü şirketleri model portföyüne eklemektedir.`}
                    />
                    <FAQItem
                        question={`${broker.name} Raporlarına ve Model Portföyüne Nasıl Ulaşırım?`}
                        answer={`YatirimX üzerinde ${broker.name} tarafından yayınlanmış en güncel hedef fiyatları ve hisse analizlerini ücretsiz olarak takip edebilirsiniz. Kurumun tüm detaylı raporlarına ise kendi resmi web sitesi veya yatırımcı portalı üzerinden erişim sağlayabilirsiniz.`}
                    />
                    <FAQItem
                        question={`2026 Yılında ${broker.name} Beklentileri Neler?`}
                        answer={`${broker.name} strateji raporlarına göre, 2026 yılında özellikle enflasyon muhasebesinin etkileri, ihracatçı şirketlerin performansı ve faiz indirim döngüleri piyasa yönünü belirleyecektir. Kurumun hisse seçimleri de bu makro beklentiler doğrultusunda şekillenmektedir.`}
                    />
                </div>
            </div>

        </div>
    );
};

export default BrokerDetail;
