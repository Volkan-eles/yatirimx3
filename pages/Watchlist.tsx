import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowUpRight, ArrowDownRight, LayoutGrid, Loader2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import SEO from '../components/SEO';
import { slugify } from '../utils/slugify';

const Watchlist: React.FC = () => {
    const { watchlist, toggleWatchlist } = useWatchlist();
    const [stocks, setStocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/bist_live_data.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.stocks) {
                    const watchedStocks = data.stocks.filter((s: any) => watchlist.includes(s.code));
                    setStocks(watchedStocks);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading watchlist data:', err);
                setLoading(false);
            });
    }, [watchlist]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen animate-in fade-in duration-500 pb-20">
            <SEO
                title="İzleme Listesi - Favori Hisselerim | YatırımX"
                description="Takip ettiğiniz hisse senetlerinin güncel fiyatları, performansları ve anlık değişimlerini izleyin. Kişisel portföy takip aracı."
                canonicalUrl="https://yatirimx.com/izleme-listesi/"
                keywords="izleme listesi, favori hisseler, portföy takip, hisse senedi takibi, borsa takip, watchlist"
            />

            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white">İzleme Listem</h1>
                    <p className="text-zinc-400 text-sm">Takip ettiğiniz {watchlist.length} hisse senedi bulunuyor.</p>
                </div>
            </div>

            {watchlist.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Listeniz Henüz Boş</h2>
                    <p className="text-zinc-500 mb-6">İlgilendiğiniz hisse senetlerini yıldız ikonuna tıklayarak buraya ekleyebilirsiniz.</p>
                    <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors inline-block">
                        Hisseleri Keşfet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stocks.map((stock) => (
                        <div key={stock.code} className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group relative">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleWatchlist(stock.code);
                                }}
                                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-red-500 transition-colors z-10"
                                title="Listeden Çıkar"
                            >
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            </button>

                            <Link to={`/hisse/${slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`)}`} className="block">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-black text-xl text-white mb-0.5 group-hover:text-blue-400 transition-colors">{stock.code}</div>
                                        <div className="text-xs text-zinc-500">{stock.name}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Fiyat</div>
                                        <div className="text-xl font-black text-white">₺{stock.price.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Değişim</div>
                                        <div className={`text-xl font-black flex items-center gap-1 ${stock.changeRate >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {stock.changeRate >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            %{Math.abs(stock.changeRate).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Watchlist;
