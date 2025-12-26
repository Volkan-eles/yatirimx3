import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, TrendingUp, TrendingDown, BarChart2, Filter, Activity, Clock } from 'lucide-react';
import { AreaChart, Area } from 'recharts';

interface StockData {
    code: string;
    name: string;
    price: number;
    changeRate: number;
    volume: string;
    sector: string;
}

// Fixed size sparkline for table rows
const TableSparkline = ({ data, color }: { data: any[], color: string }) => (
    <div style={{ width: 140, height: 40 }}>
        <AreaChart width={140} height={40} data={data}>
            <defs>
                <linearGradient id={`gradient-table-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-table-${color})`}
                isAnimationActive={false}
            />
        </AreaChart>
    </div>
);

// Mock data generator
const generateSparkData = (start: number, count: number) => {
    let current = start;
    return Array.from({ length: count }, (_, i) => {
        current = current * (1 + (Math.random() - 0.5) * 0.05);
        return { i, value: current };
    });
};

const Borsa: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'Tümü' | 'Yükselenler' | 'Düşenler' | 'Hacim'>('Tümü');
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch real-time BIST data
        fetch('/bist_live_data.json')
            .then(res => res.json())
            .then(data => {
                setStocks(data.stocks);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading BIST data:', err);
                setLoading(false);
            });
    }, []);

    // Filter and Sort Logic
    let displayedStocks = stocks.filter(stock =>
        stock.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeTab === 'Yükselenler') {
        displayedStocks = [...displayedStocks].sort((a, b) => b.changeRate - a.changeRate);
    } else if (activeTab === 'Düşenler') {
        displayedStocks = [...displayedStocks].sort((a, b) => a.changeRate - b.changeRate);
    } else if (activeTab === 'Hacim') {
        displayedStocks = [...displayedStocks].sort((a, b) => b.price - a.price);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 min-h-screen pb-20">

            {/* Hero / Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/20 via-zinc-900/50 to-zinc-950 border border-white/5 p-8 md:p-10 shadow-2xl shadow-black/40">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Piyasa Açık
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            Borsa İstanbul <span className="text-zinc-600">Veri Terminali</span>
                        </h1>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Yapay zeka destekli analizler, anlık veri akışı ve derinlikli piyasa takibi ile yatırımlarınıza yön verin.
                        </p>
                    </div>

                    {/* Key Metrics Mini Dashboard in Header */}
                    <div className="flex gap-4">
                        <div className="px-5 py-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm shadow-lg">
                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">BIST 100</div>
                            <div className="text-xl font-bold text-white tabular-nums">9,820.45</div>
                            <div className="text-xs text-rose-500 font-bold mt-1 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" /> %1.20
                            </div>
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm shadow-lg">
                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Hacim</div>
                            <div className="text-xl font-bold text-white tabular-nums">124.5 Mr₺</div>
                            <div className="text-xs text-emerald-500 font-bold mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> %5.4
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-50 pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl opacity-30 pointer-events-none mix-blend-screen"></div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6">

                {/* Toolbar & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-xl sticky top-20 z-20 shadow-xl shadow-black/20">

                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {['Tümü', 'Yükselenler', 'Düşenler', 'Hacim'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab
                                        ? 'bg-zinc-800 text-white shadow-lg ring-1 ring-white/10'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Sembol, Şirket veya Sektör ara..."
                                className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder-zinc-600 focus:bg-black/40 focus:ring-1 focus:ring-blue-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl shadow-black/40 bg-zinc-900/40">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-950/50 text-zinc-500 border-b border-white/5 text-[11px] uppercase tracking-wider font-bold">
                                    <th className="px-8 py-5 w-20">#</th>
                                    <th className="px-6 py-5">Şirket & Sembol</th>
                                    <th className="px-6 py-5 text-right">Fiyat</th>
                                    <th className="px-6 py-5 text-right">Günlük Fark</th>
                                    <th className="px-6 py-5 w-48">Trend</th>
                                    <th className="px-6 py-5 text-right">Hacim</th>
                                    <th className="px-6 py-5 text-right w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {displayedStocks.map((stock, idx) => {
                                    const isPositive = stock.changeRate >= 0;
                                    const sparkColor = isPositive ? '#10b981' : '#f43f5e';
                                    const sparkData = generateSparkData(stock.price, 20);

                                    return (
                                        <tr key={stock.code} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                                            <td className="px-8 py-5 text-zinc-600 font-mono text-sm">{idx + 1}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                        <span className={isPositive ? 'text-emerald-500' : 'text-rose-500'}>{stock.code.substring(0, 1)}</span>
                                                    </div>
                                                    <div>
                                                        <Link to={`/hisse/${stock.code}`} className="font-bold text-white text-base hover:text-blue-400 transition-colors block leading-tight mb-0.5">
                                                            {stock.code}
                                                        </Link>
                                                        <span className="text-xs text-zinc-500 font-medium">{stock.name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="font-mono text-white text-base font-bold tabular-nums tracking-tight">₺{stock.price.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold w-24 justify-end tabular-nums transition-colors ${isPositive
                                                        ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 group-hover:bg-emerald-500/10'
                                                        : 'text-rose-400 bg-rose-500/5 border border-rose-500/10 group-hover:bg-rose-500/10'
                                                    }`}>
                                                    {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                    %{Math.abs(stock.changeRate).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 opacity-70 group-hover:opacity-100 transition-opacity">
                                                <TableSparkline data={sparkData} color={sparkColor} />
                                            </td>
                                            <td className="px-6 py-5 text-zinc-400 font-mono text-sm text-right tabular-nums group-hover:text-zinc-200 transition-colors">
                                                {stock.volume}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link to={`/hisse/${stock.code}`} className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-600 text-zinc-400 hover:text-white transition-all inline-flex opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 duration-300">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination / Footer */}
                    <div className="p-5 border-t border-white/5 bg-zinc-950/30 flex justify-between items-center text-xs text-zinc-500 font-medium">
                        <div>
                            Toplam <span className="text-white">{displayedStocks.length}</span> hisse senedi listeleniyor
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 hover:bg-white/5 transition-colors disabled:opacity-50">Önceki</button>
                            <button className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 hover:bg-white/5 transition-colors">Sonraki</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Borsa;