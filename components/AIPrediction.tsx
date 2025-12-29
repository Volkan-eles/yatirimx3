import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIPredictionProps {
    stockCode: string;
    currentPrice: number;
}

interface Prediction {
    timeframe: string;
    price: number;
    change: number;
    confidence: number;
}

interface Pattern {
    name: string;
    type: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    description: string;
}

const AIPrediction: React.FC<AIPredictionProps> = ({ stockCode, currentPrice }) => {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [patterns, setPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);
    const [modelAccuracy, setModelAccuracy] = useState(0);

    useEffect(() => {
        // Simulate AI model loading and prediction
        setTimeout(() => {
            // Mock predictions (replace with real AI model)
            const mockPredictions: Prediction[] = [
                {
                    timeframe: '1 Hafta',
                    price: currentPrice * 1.02,
                    change: 2.0,
                    confidence: 72,
                },
                {
                    timeframe: '1 Ay',
                    price: currentPrice * 1.05,
                    change: 5.0,
                    confidence: 68,
                },
                {
                    timeframe: '3 Ay',
                    price: currentPrice * 1.08,
                    change: 8.0,
                    confidence: 62,
                },
            ];

            const mockPatterns: Pattern[] = [
                {
                    name: 'Yükselen Üçgen',
                    type: 'bullish',
                    confidence: 78,
                    description: 'Fiyat yükselen bir üçgen formasyonu içinde',
                },
                {
                    name: 'Destek Seviyesi',
                    type: 'bullish',
                    confidence: 85,
                    description: `₺${(currentPrice * 0.95).toFixed(2)} seviyesinde güçlü destek`,
                },
                {
                    name: 'RSI Divergence',
                    type: 'bullish',
                    confidence: 65,
                    description: 'Pozitif RSI uyumsuzluğu tespit edildi',
                },
            ];

            setPredictions(mockPredictions);
            setPatterns(mockPatterns);
            setModelAccuracy(75);
            setLoading(false);
        }, 1500);
    }, [stockCode, currentPrice]);

    if (loading) {
        return (
            <div className="glass-panel p-8 rounded-2xl border border-white/5">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-zinc-400 text-sm">AI modeli analiz ediyor...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* AI Model Info */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <Brain className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">AI Fiyat Tahmini</h3>
                            <p className="text-xs text-zinc-500">LSTM Neural Network Model</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-zinc-500">Model Doğruluğu</div>
                        <div className="text-2xl font-bold text-emerald-400">{modelAccuracy}%</div>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-200">
                        <strong>Uyarı:</strong> Bu tahminler yapay zeka modeli tarafından oluşturulmuştur ve yatırım tavsiyesi değildir.
                        Kendi araştırmanızı yapın.
                    </div>
                </div>
            </div>

            {/* Price Predictions */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Fiyat Tahminleri
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {predictions.map((pred, index) => (
                        <motion.div
                            key={pred.timeframe}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/50 p-5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all"
                        >
                            <div className="text-xs text-zinc-500 mb-2">{pred.timeframe}</div>
                            <div className="text-2xl font-bold text-white mb-2">
                                ₺{pred.price.toFixed(2)}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className={`text-sm font-bold ${pred.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(1)}%
                                </div>
                                <div className="text-xs text-zinc-500">
                                    Güven: {pred.confidence}%
                                </div>
                            </div>

                            {/* Confidence Bar */}
                            <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                                    style={{ width: `${pred.confidence}%` }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Prediction Chart */}
                <div className="mt-6 p-4 bg-zinc-900/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-zinc-500">Tahmin Grafiği</span>
                        <span className="text-xs text-zinc-500">Mevcut: ₺{currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="h-32 flex items-end justify-between gap-2">
                        {predictions.map((pred, index) => {
                            const height = ((pred.price - currentPrice) / currentPrice) * 100 + 50;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="text-xs text-zinc-400">₺{pred.price.toFixed(0)}</div>
                                    <div
                                        className={`w-full rounded-t-lg transition-all ${pred.change >= 0 ? 'bg-emerald-500/50' : 'bg-rose-500/50'
                                            }`}
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    />
                                    <div className="text-xs text-zinc-500">{pred.timeframe}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pattern Recognition */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Tespit Edilen Formasyonlar
                </h4>

                <div className="space-y-3">
                    {patterns.map((pattern, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-lg ${pattern.type === 'bullish'
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : pattern.type === 'bearish'
                                                    ? 'bg-rose-500/10 text-rose-400'
                                                    : 'bg-zinc-500/10 text-zinc-400'
                                            }`}
                                    >
                                        {pattern.type === 'bullish' ? (
                                            <TrendingUp className="w-4 h-4" />
                                        ) : (
                                            <TrendingUp className="w-4 h-4 rotate-180" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{pattern.name}</div>
                                        <div className="text-xs text-zinc-500">{pattern.description}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-zinc-500">Güven</div>
                                    <div className="text-sm font-bold text-blue-400">{pattern.confidence}%</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Overall Signal */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-zinc-400 mb-1">Genel Sinyal</div>
                            <div className="text-xl font-bold text-emerald-400">SATIN AL 🟢</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-zinc-400 mb-1">Sinyal Gücü</div>
                            <div className="text-xl font-bold text-white">7.5/10</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPrediction;
