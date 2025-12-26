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
  // Format data for chart
  const chartData = data && data.length > 0
    ? data.map((item, index) => ({
      name: `Gün ${index + 1}`,
      value: item.Close
    }))
    : [
      { name: '1', value: 0 },
      { name: '2', value: 0 }
    ];

  return (
    <div className="h-[350px] w-full select-none">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <filter id="shadow" height="200%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor={color} floodOpacity="0.3" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#52525b"
            tick={{ fontSize: 10, fill: '#71717a', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fontSize: 11, fill: '#71717a', fontFamily: 'monospace' }}
            domain={['dataMin - 0.2', 'dataMax + 0.2']}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₺${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(9, 9, 11, 0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
              padding: '12px'
            }}
            itemStyle={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 600 }}
            labelStyle={{ color: '#a1a1aa', fontSize: '11px', marginBottom: '4px' }}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }}
            formatter={(value: number) => [`₺${value.toFixed(2)}`, 'Fiyat']}
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
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;