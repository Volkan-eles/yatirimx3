
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, AreaSeries, CandlestickSeries } from 'lightweight-charts';

interface ChartProps {
    data: {
        time: string;
        open?: number;
        high?: number;
        low?: number;
        close?: number;
        value?: number; // fallback for line chart
    }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
    height?: number;
}

const TradingViewChart: React.FC<ChartProps> = ({
    data,
    colors = {
        backgroundColor: 'transparent',
        lineColor: '#2962FF',
        textColor: '#A1A1AA',
        areaTopColor: 'rgba(41, 98, 255, 0.3)',
        areaBottomColor: 'rgba(41, 98, 255, 0.0)',
    },
    height = 400
}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors.backgroundColor },
                textColor: colors.textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
            },
        });

        // Determine chart type based on data
        const isCandle = data.length > 0 && 'open' in data[0];

        try {
            if (isCandle) {
                const candlestickSeries = chart.addSeries(CandlestickSeries, {
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    borderVisible: false,
                    wickUpColor: '#26a69a',
                    wickDownColor: '#ef5350',
                });
                candlestickSeries.setData(data as any);
            } else {
                const areaSeries = chart.addSeries(AreaSeries, {
                    lineColor: colors.lineColor,
                    topColor: colors.areaTopColor,
                    bottomColor: colors.areaBottomColor,
                });

                // Ensure data is sorted and valid
                const sortedData = [...data]
                    .filter(d => d.time)
                    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                    .map(d => ({
                        time: d.time,
                        value: d.value !== undefined ? d.value : (d.close || 0)
                    }));

                if (sortedData.length > 0) {
                    areaSeries.setData(sortedData as any);
                }
            }
        } catch (err) {
            console.error("Layer series error", err);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, colors, height]);

    return (
        <div ref={chartContainerRef} className="w-full relative" />
    );
};

export default TradingViewChart;
