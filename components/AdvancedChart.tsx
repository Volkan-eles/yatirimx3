import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { TrendingUp, TrendingDown, Maximize2, Settings } from 'lucide-react';

interface AdvancedChartProps {
    stockCode: string;
    data?: any[];
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({ stockCode, data = [] }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
    const [indicators, setIndicators] = useState({
        ma20: true,
        ma50: false,
        ma200: false,
        rsi: false,
        macd: false,
        bollinger: false,
    });
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: {
                background: { color: '#0a0a0a' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: '#1f1f1f' },
                horzLines: { color: '#1f1f1f' },
            },
            crosshair: {
                mode: 1,
            },
            rightPriceScale: {
                borderColor: '#2a2a2a',
            },
            timeScale: {
                borderColor: '#2a2a2a',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        chartRef.current = chart;

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        candlestickSeriesRef.current = candlestickSeries;

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
            color: '#3b82f6',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
        });

        volumeSeriesRef.current = volumeSeries;

        // Generate mock data (replace with real data)
        const mockData = generateMockData(100);
        candlestickSeries.setData(mockData.candles);
        volumeSeries.setData(mockData.volume);

        // Add MA indicators
        if (indicators.ma20) {
            const ma20Data = calculateMA(mockData.candles, 20);
            const ma20Series = chart.addLineSeries({
                color: '#3b82f6',
                lineWidth: 2,
                title: 'MA 20',
            });
            ma20Series.setData(ma20Data);
        }

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [indicators, timeRange]);

    const generateMockData = (days: number) => {
        const candles: CandlestickData[] = [];
        const volume: any[] = [];
        let basePrice = 230;
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const time = Math.floor(date.getTime() / 1000) as Time;

            const open = basePrice + (Math.random() - 0.5) * 10;
            const close = open + (Math.random() - 0.5) * 15;
            const high = Math.max(open, close) + Math.random() * 5;
            const low = Math.min(open, close) - Math.random() * 5;

            candles.push({
                time,
                open,
                high,
                low,
                close,
            });

            volume.push({
                time,
                value: Math.random() * 1000000,
                color: close > open ? '#10b98180' : '#ef444480',
            });

            basePrice = close;
        }

        return { candles, volume };
    };

    const calculateMA = (data: CandlestickData[], period: number) => {
        const ma: any[] = [];
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            ma.push({
                time: data[i].time,
                value: sum / period,
            });
        }
        return ma;
    };

    const toggleFullscreen = () => {
        if (!chartContainerRef.current) return;

        if (!document.fullscreenElement) {
            chartContainerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Chart Controls */}
            <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                {/* Time Range Selector */}
                <div className="flex gap-2">
                    {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>

                {/* Indicator Toggles */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIndicators({ ...indicators, ma20: !indicators.ma20 })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${indicators.ma20 ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400'
                            }`}
                    >
                        MA 20
                    </button>
                    <button
                        onClick={() => setIndicators({ ...indicators, ma50: !indicators.ma50 })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${indicators.ma50 ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400'
                            }`}
                    >
                        MA 50
                    </button>
                    <button
                        onClick={() => setIndicators({ ...indicators, rsi: !indicators.rsi })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${indicators.rsi ? 'bg-orange-600 text-white' : 'bg-white/5 text-zinc-400'
                            }`}
                    >
                        RSI
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                        title="Tam Ekran"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chart Container */}
            <div
                ref={chartContainerRef}
                className="rounded-xl overflow-hidden border border-white/5 bg-zinc-950"
                style={{ height: isFullscreen ? '100vh' : '500px' }}
            />

            {/* Chart Info */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-zinc-500 mb-1">Açılış</div>
                    <div className="text-lg font-bold text-white">₺234.50</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-zinc-500 mb-1">En Yüksek</div>
                    <div className="text-lg font-bold text-emerald-400">₺238.20</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-zinc-500 mb-1">En Düşük</div>
                    <div className="text-lg font-bold text-rose-400">₺232.10</div>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-zinc-500 mb-1">Kapanış</div>
                    <div className="text-lg font-bold text-white">₺236.80</div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedChart;
