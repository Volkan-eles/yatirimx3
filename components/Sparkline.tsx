import React, { useMemo } from 'react';

interface SparklineProps {
    data?: number[];
    color?: string;
    width?: number;
    height?: number;
    isPositive?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
    width = 100,
    height = 30,
    isPositive = true
}) => {
    // Generate deterministic mock data based on "trend"
    const points = useMemo(() => {
        const data = [];
        let current = 50;
        for (let i = 0; i < 20; i++) {
            // Bias towards the final direction
            const trend = isPositive ? 2 : -2;
            const noise = (Math.random() - 0.5) * 10;
            current += trend + noise;
            data.push(current);
        }
        return data;
    }, [isPositive]);

    // Normalize data to fit SVG
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min;

    const polylineMap = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#10b981' : '#f43f5e'; // emerald-500 : rose-500
    const fillColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Fill Area (Optional, adds professional touch) */}
            <path
                d={`M 0 ${height} L ${polylineMap.split(' ')[0]} L ${polylineMap} L ${width} ${height} Z`}
                fill={fillColor}
                stroke="none"
            />
            {/* Trend Line */}
            <polyline
                points={polylineMap}
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* End Dot */}
            <circle
                cx={width}
                cy={height - ((points[points.length - 1] - min) / range) * height}
                r="2"
                fill={strokeColor}
            />
        </svg>
    );
};
