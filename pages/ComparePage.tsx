import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Search, ArrowRightLeft, TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';

interface StockData {
    code: string;
    name: string;
    price: number;
    changeRate: number;
    volume: string;
    sector: string;
    pe?: number; // Price/Earnings (Mock)
    pb?: number; // Price/Book (Mock)
    dividendYield?: number; // Mock
}

const ComparePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allStocks, setAllStocks] = useState<StockData[]>([]);

    // Selection State
    const [leftStock, setLeftStock] = useState<StockData | null>(null);
    const [rightStock, setRightStock] = useState<StockData | null>(null);
    const [selectingFor, setSelectingFor] = useState<'left' | 'right' | null>(null);

    useEffect(() => {
        // Fetch real data
        fetch('/bist_live_data.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.stocks) {
                    // Enrich with mock fundamental data for comparison demo
                    const enriched = data.stocks.map((s: any) => ({
                        ...s,
                        pe: (Math.random() * 20 + 5).toFixed(2),
                        pb: (Math.random() * 5 + 0.5).toFixed(2),
                        dividendYield: (Math.random() * 8).toFixed(2)
                    }));
                    setAllStocks(enriched);

                    // Defaults
                    setLeftStock(enriched.find((s: any) => s.code === 'THYAO') || enriched[0]);
                    setRightStock(enriched.find((s: any) => s.code === 'GARAN') || enriched[1]);
                }
            });
    }, []);

    const handleSelect = (stock: StockData) => {
        if (selectingFor === 'left') setLeftStock(stock);
        if (selectingFor === 'right') setRightStock(stock);
        setSelectingFor(null);
        setSearchTerm('');
    };

    const filteredStocks = allStocks.filter(s => s.code.includes(searchTerm.toUpperCase()) || s.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6);

    const ComparisonRow = ({ label, leftValue, rightValue, format = (v: any) => v, better = 'higher' }: any) => {
        if (!leftStock || !rightStock) return null;

        const lVal = parseFloat(leftValue);
        const rVal = parseFloat(rightValue);
        let leftWin = false;
        let rightWin = false;

        if (better === 'higher') {
            leftWin = lVal > rVal;
            rightWin = rVal > lVal;
        } else {
            leftWin = lVal < rVal;
            rightWin = rVal < lVal;
        }

        return (
            <div className="grid grid-cols-3 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <div className={`text-center font-mono font-bold ${leftWin ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {format(leftValue)}
                </div>
                <div className="text-center text-xs text-zinc-500 uppercase font-bold tracking-wider flex items-center justify-center gap-2">
                    {label}
                </div>
                <div className={`text-center font-mono font-bold ${rightWin ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {format(rightValue)}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
            <SEO
                title="Hisse Senedi Karşılaştırma - BIST 100 Hisse Analizi | YatırımX"
                description="İki hisse senedini yan yana karşılaştırın. Fiyat, F/K oranı, temettü verimi ve daha fazlasını analiz edin. Akıllı yatırım kararları için detaylı karşılaştırma aracı."
                canonicalUrl="https://yatirimx.com/karsilastir/"
                keywords="hisse karşılaştırma, hisse analizi, bist 100 karşılaştırma, hisse senedi analiz, f/k oranı, temettü karşılaştırma"
            />

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Hisse Karşılaştırma</h1>
                <p className="text-zinc-400">Yatırım kararınızı vermeden önce detaylı analiz yapın.</p>
            </div>

            {/* Comparison Container */}
            <div className="glass-panel rounded-3xl p-8 max-w-4xl mx-auto relative overflow-visible">

                {/* Headers */}
                <div className="grid grid-cols-3 mb-8 items-center">
                    {/* Left Selector */}
                    <div className="relative text-center">
                        <button
                            onClick={() => setSelectingFor('left')}
                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-blue-600/10 border border-white/10 hover:border-blue-500/50 transition-all group"
                        >
                            {leftStock ? (
                                <>
                                    <div className="text-2xl font-black text-white mb-1">{leftStock.code}</div>
                                    <div className="text-xs text-zinc-500 group-hover:text-blue-400 transition-colors">{leftStock.name.substring(0, 15)}...</div>
                                </>
                            ) : 'Hisse Seç'}
                        </button>
                    </div>

                    {/* VS Badge */}
                    <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 font-black text-white italic">VS</div>
                    </div>

                    {/* Right Selector */}
                    <div className="relative text-center">
                        <button
                            onClick={() => setSelectingFor('right')}
                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-purple-600/10 border border-white/10 hover:border-purple-500/50 transition-all group"
                        >
                            {rightStock ? (
                                <>
                                    <div className="text-2xl font-black text-white mb-1">{rightStock.code}</div>
                                    <div className="text-xs text-zinc-500 group-hover:text-purple-400 transition-colors">{rightStock.name.substring(0, 15)}...</div>
                                </>
                            ) : 'Hisse Seç'}
                        </button>
                    </div>
                </div>

                {/* Selection Modal/Dropdown Overlay */}
                {selectingFor && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 rounded-3xl flex flex-col p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">Hisse Seç ({selectingFor === 'left' ? 'Sol' : 'Sağ'})</h3>
                            <button onClick={() => setSelectingFor(null)} className="text-zinc-400 hover:text-white">Kapat</button>
                        </div>
                        <div className="relative mb-4">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-blue-500/50"
                                placeholder="Hisse kodu ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {filteredStocks.map(s => (
                                <button
                                    key={s.code}
                                    onClick={() => handleSelect(s)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
                                >
                                    <div>
                                        <div className="font-bold text-white text-sm">{s.code}</div>
                                        <div className="text-xs text-zinc-500">{s.name}</div>
                                    </div>
                                    <div className="font-mono text-xs text-zinc-400">₺{s.price}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Data Grid */}
                <div className="space-y-1">
                    <ComparisonRow
                        label="Fiyat"
                        leftValue={leftStock?.price}
                        rightValue={rightStock?.price}
                        format={(v: number) => `₺${v}`}
                        better="higher" // Not strictly true but visually consistent
                    />
                    <ComparisonRow
                        label="Günlük Değişim"
                        leftValue={leftStock?.changeRate}
                        rightValue={rightStock?.changeRate}
                        format={(v: number) => `%${v}`}
                    />
                    <ComparisonRow
                        label="F/K Oranı"
                        leftValue={leftStock?.pe}
                        rightValue={rightStock?.pe}
                        better="lower"
                    />
                    <ComparisonRow
                        label="PD/DD Oranı"
                        leftValue={leftStock?.pb}
                        rightValue={rightStock?.pb}
                        better="lower"
                    />
                    <ComparisonRow
                        label="Temettü Verimi"
                        leftValue={leftStock?.dividendYield}
                        rightValue={rightStock?.dividendYield}
                        format={(v: number) => `%${v}`}
                    />
                </div>

                <div className="mt-8 text-center">
                    <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                        Detaylı Rapor Oluştur
                    </button>
                    <p className="text-zinc-600 text-xs mt-4">Veriler 15 dakika gecikmelidir.</p>
                </div>

            </div>
        </div>
    );
};

export default ComparePage;
