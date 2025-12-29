import React from 'react';
import { Calendar, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';

interface DividendCardProps {
    dividend: {
        t_bistkod: string;
        t_sirketadi?: string;
        t_nakit?: number;
        t_bedelsiz?: number;
        t_hakedistarih?: string;
        t_odemetarihi?: string;
        t_getiri?: number;
    };
    index?: number;
}

const DividendCard: React.FC<DividendCardProps> = ({ dividend, index = 0 }) => {
    const stockCode = dividend.t_bistkod;
    const companyName = dividend.t_sirketadi || stockCode;
    const cashDividend = dividend.t_nakit || 0;
    const bonusDividend = dividend.t_bedelsiz || 0;
    const exDate = dividend.t_hakedistarih;
    const paymentDate = dividend.t_odemetarihi;
    const yieldPercent = dividend.t_getiri || 0;

    const dividendType = cashDividend > 0 && bonusDividend > 0
        ? 'karma'
        : cashDividend > 0
            ? 'nakit'
            : 'bedelsiz';

    const typeColors = {
        nakit: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        bedelsiz: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        karma: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    };

    const typeLabels = {
        nakit: 'Nakit',
        bedelsiz: 'Bedelsiz',
        karma: 'Karma',
    };

    const isPaid = paymentDate && new Date(paymentDate) < new Date();

    const slug = slugify(`${stockCode} Temettü Tarihi 2026 Ne Kadar Verecek`);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel p-5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <Link
                        to={`/temettu/${slug}`}
                        className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
                    >
                        {stockCode}
                    </Link>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{companyName}</p>
                </div>
                <div className={`px-3 py-1 rounded-lg border text-xs font-bold ${typeColors[dividendType]}`}>
                    {typeLabels[dividendType]}
                </div>
            </div>

            {/* Amount */}
            <div className="mb-4">
                {cashDividend > 0 && (
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-400">
                            ₺{cashDividend.toFixed(2)}
                        </span>
                        {yieldPercent > 0 && (
                            <span className="text-sm text-zinc-500">
                                %{yieldPercent.toFixed(2)} getiri
                            </span>
                        )}
                    </div>
                )}
                {bonusDividend > 0 && (
                    <div className="text-lg font-bold text-blue-400">
                        %{(bonusDividend * 100).toFixed(0)} Bedelsiz
                    </div>
                )}
            </div>

            {/* Dates */}
            <div className="space-y-2 mb-4">
                {exDate && (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-zinc-500">Hak Ediş:</span>
                        <span className="text-white font-bold">
                            {new Date(exDate).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                )}
                {paymentDate && (
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span className="text-zinc-500">Ödeme:</span>
                        <span className="text-white font-bold">
                            {new Date(paymentDate).toLocaleDateString('tr-TR')}
                        </span>
                    </div>
                )}
            </div>

            {/* Status */}
            {isPaid && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400 font-bold">Ödendi</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <Link
                    to={`/temettu/${slug}`}
                    className="flex-1 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center text-sm font-bold text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                    Detay
                </Link>
                <button className="flex-1 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all">
                    Hesapla
                </button>
            </div>
        </motion.div>
    );
};

export default DividendCard;
