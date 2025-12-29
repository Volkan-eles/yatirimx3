import React, { useState } from 'react';
import { Calculator, Info, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface DividendCalculatorProps {
    stockCode?: string;
    stockPrice?: number;
    dividendAmount?: number;
}

const DividendCalculator: React.FC<DividendCalculatorProps> = ({
    stockCode: initialStockCode = '',
    stockPrice: initialPrice = 0,
    dividendAmount: initialDividend = 0,
}) => {
    const [stockCode, setStockCode] = useState(initialStockCode);
    const [shares, setShares] = useState(1000);
    const [purchasePrice, setPurchasePrice] = useState(initialPrice || 100);
    const [dividend, setDividend] = useState(initialDividend || 2.5);
    const [holdingYears, setHoldingYears] = useState(0);

    // Calculations
    const grossDividend = shares * dividend;
    const taxRate = holdingYears >= 2 ? 0 : 0.15; // 2+ years = tax exempt
    const taxAmount = grossDividend * taxRate;
    const netDividend = grossDividend - taxAmount;
    const totalInvestment = shares * purchasePrice;
    const yieldPercent = (netDividend / totalInvestment) * 100;
    const annualYield = yieldPercent * 4; // Assuming quarterly

    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Calculator className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold">Temettü Hesaplayıcı</h3>
                    <p className="text-xs text-zinc-500">Net kazancınızı hesaplayın</p>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs text-zinc-400 mb-2">Hisse Kodu</label>
                    <input
                        type="text"
                        value={stockCode}
                        onChange={(e) => setStockCode(e.target.value.toUpperCase())}
                        placeholder="THYAO"
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500/50 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-zinc-400 mb-2">Sahip Olduğunuz Adet</label>
                    <input
                        type="number"
                        value={shares}
                        onChange={(e) => setShares(Number(e.target.value))}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500/50 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-zinc-400 mb-2">Alış Fiyatı (₺)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Number(e.target.value))}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500/50 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-xs text-zinc-400 mb-2">Temettü Tutarı (₺)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={dividend}
                        onChange={(e) => setDividend(Number(e.target.value))}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500/50 focus:outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs text-zinc-400 mb-2">
                        Elde Tutma Süresi (Yıl) - Stopaj Muafiyeti için
                    </label>
                    <input
                        type="number"
                        value={holdingYears}
                        onChange={(e) => setHoldingYears(Number(e.target.value))}
                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500/50 focus:outline-none"
                    />
                </div>
            </div>

            {/* Results */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
            >
                <div className="bg-zinc-900/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-zinc-400">Brüt Temettü</span>
                        <span className="text-lg font-bold text-white">₺{grossDividend.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="bg-zinc-900/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-zinc-400">
                            Stopaj ({(taxRate * 100).toFixed(0)}%)
                            {holdingYears >= 2 && <span className="ml-2 text-xs text-emerald-400">✓ Muaf</span>}
                        </span>
                        <span className="text-lg font-bold text-rose-400">-₺{taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-emerald-400 font-bold">Net Temettü</span>
                        <span className="text-2xl font-black text-emerald-400">₺{netDividend.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-900/30 p-4 rounded-xl">
                        <div className="text-xs text-zinc-500 mb-1">Getiri Oranı</div>
                        <div className="text-xl font-bold text-blue-400">{yieldPercent.toFixed(2)}%</div>
                    </div>

                    <div className="bg-zinc-900/30 p-4 rounded-xl">
                        <div className="text-xs text-zinc-500 mb-1">Yıllık Getiri (Tahmini)</div>
                        <div className="text-xl font-bold text-purple-400">{annualYield.toFixed(2)}%</div>
                    </div>
                </div>

                <div className="bg-zinc-900/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400">Toplam Yatırım</span>
                        <span className="text-lg font-bold text-white">₺{totalInvestment.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </motion.div>

            {/* Info */}
            <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                    <strong>Stopaj Muafiyeti:</strong> 2 yıldan fazla elde tutulan hisseler stopaj kesintisinden muaftır.
                    Hesaplama tahminidir, kesin bilgi için mali müşavirinize danışın.
                </div>
            </div>
        </div>
    );
};

export default DividendCalculator;
