import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { ArrowRight, Box } from 'lucide-react';

interface Stock {
    code: string;
    name: string;
    price: number;
    changeRate: number;
    volume: string;
    sector: string;
}

const MarketHeatmap: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/bist_live_data.json')
            .then(res => res.json())
            .then(data => {
                // Sort by volume (mock "market cap" size effect) or absolute change
                // For visual heatmap, usually sorted by Weight (Volume/Cap).
                // Here we just take top 20 active stocks for the visual.
                const sorted = data.stocks
                    .sort((a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume))
                    .slice(0, 30);
                setStocks(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error('Heatmap data error:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 animate-slide-up [animation-delay:200ms]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <Box className="w-5 h-5 text-blue-500" /> BIST 100 Isı Haritası
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1">Hacim liderlerinin anlık performans haritası</p>
                </div>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Yükseliş</span>
                    <span className="flex items-center gap-1 text-rose-500"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Düşüş</span>
                </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 auto-rows-[60px] md:auto-rows-[80px]">
                {stocks.map((stock, idx) => {
                    // Dynamic sizing mock: Top 5 stocks get bigger cells
                    const isBig = idx < 2;
                    const isMedium = idx >= 2 && idx < 6;

                    let colSpan = 'col-span-1';
                    let rowSpan = 'row-span-1';

                    if (isBig) {
                        colSpan = 'col-span-2 md:col-span-2';
                        rowSpan = 'row-span-2';
                    } else if (isMedium) {
                        colSpan = 'col-span-2';
                    }

                    // Color logic
                    let bgClass = 'bg-zinc-800';
                    if (stock.changeRate > 3) bgClass = 'bg-emerald-500';
                    else if (stock.changeRate > 0) bgClass = 'bg-emerald-500/60';
                    else if (stock.changeRate === 0) bgClass = 'bg-zinc-600';
                    else if (stock.changeRate > -3) bgClass = 'bg-rose-500/60';
                    else bgClass = 'bg-rose-500';

                    return (
                        <Link
                            to={`/hisse/${slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`)}/`}
                            key={stock.code}
                            className={`${colSpan} ${rowSpan} ${bgClass} rounded-xl p-3 flex flex-col justify-center items-center text-center hover:scale-[1.02] hover:z-10 transition-all border border-black/10 shadow-inner group relative overflow-hidden`}
                        >
                            <span className="text-white font-black text-xs md:text-sm tracking-tighter z-10">{stock.code}</span>
                            <span className="text-white/80 font-bold text-[10px] tabular-nums z-10">%{stock.changeRate.toFixed(2)}</span>

                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-4 text-center">
                <Link to="/piyasa" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                    Tüm Piyasayı Gör <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
};

export default MarketHeatmap;
