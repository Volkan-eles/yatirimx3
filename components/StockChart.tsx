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
    <div className="h-[400px] w-full select-none -ml-4">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={color} floodOpacity="0.3" />
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="name"
            stroke="#52525b"
            tick={{ fontSize: 10, fill: '#52525b', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#52525b"
            tick={{ fontSize: 11, fill: '#71717a', fontFamily: 'JetBrains Mono', fontWeight: 500 }}
            domain={[minValue - padding, maxValue + padding]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₺${value.toFixed(2)}`}
            width={70}
            tickCount={6}
            orientation="right"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(9, 9, 11, 0.95)',
              borderColor: 'rgba(255,255,255,0.05)',
              color: '#fff',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
            itemStyle={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, fontFamily: 'Plus Jakarta Sans' }}
            labelStyle={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px', fontWeight: 500 }}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
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
            strokeWidth={3}
            animationDuration={1500}
            filter="url(#shadow)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#09090b',
              stroke: color,
              strokeWidth: 3,
              style: { filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))' }
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;