import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';
import { motion, AnimatePresence } from 'framer-motion';

interface Stock {
    code: string;
    name: string;
    price: number;
    changeRate: number;
}

const TrendingWidget: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendingStocks();
        const interval = setInterval(loadTrendingStocks, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    const loadTrendingStocks = async () => {
        try {
            const response = await fetch('/bist_live_data.json');
            const data = await response.json();

            const sorted = [...data.stocks].sort((a, b) => b.changeRate - a.changeRate);
            setStocks(sorted);
            setLoading(false);
        } catch (error) {
            console.error('Error loading trending stocks:', error);
            setLoading(false);
        }
    };

    const topGainers = stocks.slice(0, 5);
    const topLosers = stocks.slice(-5).reverse();
    const displayStocks = activeTab === 'gainers' ? topGainers : topLosers;

    if (loading) {
        return (
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-white/5 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl border border-white/5"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h3 className="text-white font-bold">Trend Hisseler</h3>
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('gainers')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'gainers'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                        }`}
                >
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Yükselenler
                </button>
                <button
                    onClick={() => setActiveTab('losers')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'losers'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                        }`}
                >
                    <TrendingDown className="w-3 h-3 inline mr-1" />
                    Düşenler
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'gainers' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'gainers' ? 20 : -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                >
                    {displayStocks.map((stock, index) => (
                        <Link
                            key={stock.code}
                            to={`/hisse/${slugify(`${stock.code} Hisse Senedi Fiyatı Grafiği ${stock.code} Yorumu 2026`)}`}
                            className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-zinc-600 w-4">#{index + 1}</span>
                                    <div>
                                        <div className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">
                                            {stock.code}
                                        </div>
                                        <div className="text-zinc-500 text-xs truncate max-w-[120px]">
                                            {stock.name}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-mono text-sm">₺{stock.price.toFixed(2)}</div>
                                    <div
                                        className={`text-xs font-bold ${stock.changeRate >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                            }`}
                                    >
                                        {stock.changeRate >= 0 ? '+' : ''}
                                        {stock.changeRate.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default TrendingWidget;
