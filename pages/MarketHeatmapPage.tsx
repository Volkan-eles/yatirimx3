import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import SEO from '../components/SEO';
import MarketHeatmap from '../components/MarketHeatmap';

const MarketHeatmapPage: React.FC = () => {
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/bist_live_data.json')
            .then(res => res.json())
            .then(data => {
                setStocks(data.stocks || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading stocks:', err);
                setLoading(false);
            });
    }, []);

    const gainers = stocks.filter(s => s.changeRate > 0).length;
    const losers = stocks.filter(s => s.changeRate < 0).length;
    const neutral = stocks.length - gainers - losers;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <SEO
                title="Piyasa Haritası - BIST 100 Hisse Senedi Isı Haritası"
                description="Borsa İstanbul hisse senetlerinin performansını görsel ısı haritası ile takip edin. Sektörel analiz ve anlık fiyat hareketleri."
                canonicalUrl="https://yatirimx.com/piyasa-haritasi/"
                keywords="piyasa haritası, ısı haritası, hisse senedi haritası, bist 100 harita, sektör analizi"
            />

            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 via-zinc-900/50 to-zinc-950 border border-white/5 p-8 md:p-10">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                            <PieChart className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">Piyasa Haritası</h1>
                            <p className="text-zinc-400 text-sm mt-1">BIST 100 Görsel Performans Analizi</p>
                        </div>
                    </div>

                    <p className="text-zinc-400 max-w-2xl">
                        Borsa İstanbul'da işlem gören hisse senetlerinin performansını renk kodlu ısı haritası ile görselleştirin.
                        Yeşil tonlar yükselişi, kırmızı tonlar düşüşü temsil eder.
                    </p>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-zinc-500 text-sm font-bold mb-1">Yükselenler</div>
                            <div className="text-3xl font-bold text-emerald-400">{gainers}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-zinc-500 text-sm font-bold mb-1">Düşenler</div>
                            <div className="text-3xl font-bold text-rose-400">{losers}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/10">
                            <TrendingDown className="w-6 h-6 text-rose-400" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-zinc-500 text-sm font-bold mb-1">Değişmeyen</div>
                            <div className="text-3xl font-bold text-zinc-400">{neutral}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-500/10">
                            <PieChart className="w-6 h-6 text-zinc-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Heatmap */}
            <div className="glass-panel p-6 rounded-3xl border border-white/5">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-2">Isı Haritası</h2>
                    <p className="text-sm text-zinc-500">
                        Hisse boyutu piyasa değerini, renk yoğunluğu günlük değişim oranını gösterir
                    </p>
                </div>

                {loading ? (
                    <div className="h-[600px] flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <MarketHeatmap />
                )}

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-rose-500"></div>
                        <span className="text-xs text-zinc-400">Düşüş</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-zinc-700"></div>
                        <span className="text-xs text-zinc-400">Nötr</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-500"></div>
                        <span className="text-xs text-zinc-400">Yükseliş</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-blue-500/5">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span className="text-blue-400">ℹ️</span> Nasıl Kullanılır?
                </h3>
                <ul className="text-sm text-zinc-400 space-y-2">
                    <li>• <strong className="text-white">Renk:</strong> Yeşil yükseliş, kırmızı düşüş gösterir</li>
                    <li>• <strong className="text-white">Boyut:</strong> Büyük kareler yüksek piyasa değerini temsil eder</li>
                    <li>• <strong className="text-white">Tıklama:</strong> Hisse detayına gitmek için kutulara tıklayın</li>
                </ul>
            </div>
        </div>
    );
};

export default MarketHeatmapPage;
