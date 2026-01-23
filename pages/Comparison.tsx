
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Plus, X, BarChart2, TrendingUp, TrendingDown, Info, ArrowRight } from 'lucide-react';
import { slugify } from '../utils/slugify';

interface CompStock {
    code: string;
    name: string;
    price: number;
    change: number;
    pe: number;
    marketCap: string;
    score: number;
}

// Mock Data Source - In real app, fetch from API
const MOCK_STOCKS: Record<string, CompStock> = {
    'THYAO': { code: 'THYAO', name: 'Türk Hava Yolları', price: 285.50, change: 1.2, pe: 5.4, marketCap: '390Mld', score: 8.5 },
    'PGSUS': { code: 'PGSUS', name: 'Pegasus', price: 890.00, change: -0.5, pe: 7.2, marketCap: '120Mld', score: 7.8 },
    'ASELS': { code: 'ASELS', name: 'Aselsan', price: 62.40, change: 2.1, pe: 12.5, marketCap: '240Mld', score: 9.1 },
    'SAHOL': { code: 'SAHOL', name: 'Sabancı Holding', price: 98.10, change: 0.8, pe: 3.1, marketCap: '180Mld', score: 8.9 },
    'KCHOL': { code: 'KCHOL', name: 'Koç Holding', price: 185.30, change: 1.5, pe: 4.8, marketCap: '450Mld', score: 9.3 },
};

const Comparison = () => {
    const [selectedCodes, setSelectedCodes] = useState<string[]>(['THYAO', 'PGSUS']);
    const [items, setItems] = useState<CompStock[]>([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Simulate Fetch
        const data = selectedCodes.map(c => MOCK_STOCKS[c] || {
            code: c, name: 'Bilinmiyor', price: 0, change: 0, pe: 0, marketCap: '-', score: 0
        });
        setItems(data);
    }, [selectedCodes]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const code = query.toUpperCase();
        if (code && !selectedCodes.includes(code)) {
            setSelectedCodes([...selectedCodes, code]);
            setQuery('');
        }
    };

    const removeStock = (code: string) => {
        setSelectedCodes(selectedCodes.filter(c => c !== code));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 pb-24">

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <BarChart2 className="w-3 h-3" /> Hisse Karşılaştırma Aracı
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                    Hisseleri <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Yan Yana</span> Analiz Et
                </h1>
                <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
                    F/K, Piyasa Değeri, Getiri ve Yapay Zeka skorlarını tek tabloda görerek en doğru yatırım kararını ver.
                </p>
            </div>

            {/* Search Input */}
            <div className="max-w-md mx-auto mb-16 relative">
                <form onSubmit={handleAdd} className="relative z-10">
                    <input
                        type="text"
                        placeholder="Hisse Kodu Ekle (Örn: ASELS)..."
                        className="w-full h-14 pl-12 pr-4 bg-zinc-900/80 border border-white/10 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white font-bold transition-all shadow-2xl"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <button
                        type="submit"
                        disabled={!query}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-colors text-white"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </form>
                {/* Glow behind search */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-20 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
            </div>

            {/* Comparison Table/Grid */}
            {items.length > 0 ? (
                <div className="overflow-x-auto pb-4">
                    <div className="glass-panel border border-white/5 rounded-3xl min-w-[800px] overflow-hidden">

                        {/* Header Row */}
                        <div className="grid grid-cols-6 bg-white/[0.02] border-b border-white/5 p-4">
                            <div className="text-xs font-bold text-zinc-500 uppercase flex items-center">Hisse</div>
                            <div className="text-xs font-bold text-zinc-500 uppercase text-right">Fiyat</div>
                            <div className="text-xs font-bold text-zinc-500 uppercase text-right">Değişim</div>
                            <div className="text-xs font-bold text-zinc-500 uppercase text-right">F/K</div>
                            <div className="text-xs font-bold text-zinc-500 uppercase text-right">Piyasa Değ.</div>
                            <div className="text-xs font-bold text-zinc-500 uppercase text-right">YZ Skoru</div>
                        </div>

                        {/* Stock Rows */}
                        {items.map((stock) => (
                            <div key={stock.code} className="grid grid-cols-6 p-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors relative group">
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeStock(stock.code)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-3 pl-6">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-black text-white text-xs border border-white/5">
                                        {stock.code.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-lg">{stock.code}</div>
                                        <div className="text-xs text-zinc-500">{stock.name}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end font-bold text-white text-lg font-mono">
                                    ₺{stock.price.toFixed(2)}
                                </div>

                                <div className="flex items-center justify-end">
                                    <span className={`px-2.5 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${stock.change >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        %{Math.abs(stock.change).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-end font-bold text-zinc-300">
                                    {stock.pe}
                                </div>

                                <div className="flex items-center justify-end font-bold text-zinc-300">
                                    {stock.marketCap}
                                </div>

                                <div className="flex items-center justify-end">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-4 ${stock.score >= 8 ? 'border-emerald-500/20 text-emerald-500' : 'border-yellow-500/20 text-yellow-500'}`}>
                                        {stock.score}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-white/5 border-dashed">
                    <BarChart2 className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                    <p className="text-zinc-500 font-bold">Karşılaştırmak için yukarıdan hisse ekleyin.</p>
                </div>
            )}

            {/* Call to Action */}
            <div className="mt-12 text-center">
                <Link to="/piyasa" className="text-sm font-bold text-blue-500 hover:text-blue-400 flex items-center justify-center gap-2">
                    Tüm Hisseleri İncele <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default Comparison;
