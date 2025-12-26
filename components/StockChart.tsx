import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StockChartProps {
  color?: string;
  data?: Array<{ Close: number; Volume: number; Date?: any }>;
}

const StockChart = ({ color = "#3b82f6", data }: StockChartProps) => {
  // Format data for chart with proper dates
  const chartData = data && data.length > 0
    ? data.map((item, index) => {
      // Create date label - show every 5th day
      const dayLabel = index % 5 === 0 ? `${index + 1}` : '';
      return {
        name: dayLabel,
        value: Number(item.Close) || 0,
        fullDay: `Gün ${index + 1}`
      };
    })
    : [
      { name: '', value: 0, fullDay: 'Veri yok' }
    ];

  // Calculate min and max for better Y-axis range
  const values = chartData.map(d => d.value).filter(v => v > 0);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 100;
  const padding = (maxValue - minValue) * 0.1; // 10% padding

  return (
    <div className="h-[350px] w-full select-none">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={color} floodOpacity="0.25" />
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="name"
            stroke="#52525b"
            tick={{ fontSize: 10, fill: '#71717a', fontWeight: 600 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            tickLine={false}
            dy={8}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#52525b"
            tick={{ fontSize: 11, fill: '#a1a1aa', fontFamily: 'monospace', fontWeight: 600 }}
            domain={[minValue - padding, maxValue + padding]}
            axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            tickLine={false}
            tickFormatter={(value) => `₺${value.toFixed(2)}`}
            width={65}
            tickCount={6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(9, 9, 11, 0.98)',
              borderColor: 'rgba(255,255,255,0.15)',
              color: '#fff',
              borderRadius: '14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
              padding: '14px 16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            itemStyle={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' }}
            labelStyle={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '6px', fontWeight: 600 }}
            cursor={{ stroke: color, strokeWidth: 2, strokeDasharray: '5 5', opacity: 0.5 }}
            formatter={(value: number, name: string, props: any) => [
              `₺${value.toFixed(2)}`,
              props.payload.fullDay
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={2.5}
            animationDuration={1200}
            filter="url(#shadow)"
            dot={false}
            activeDot={{
              r: 5,
              fill: color,
              stroke: '#fff',
              strokeWidth: 2,
              style: { filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.4))' }
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;