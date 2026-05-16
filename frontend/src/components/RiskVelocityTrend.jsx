import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RiskVelocityTrend({ trends = [] }) {
  // Use streamed backend trends, or use the last 7 days from your reference image
  const chartData = trends.length > 0
    ? trends.map(item => ({
        // Extracts '05-15' from '2026-05-15'
        date: item.name?.substring(5) || item.date?.substring(5) || '',
        highRisk: item.highRisk || item.highRiskCount || 0
      }))
    : [
        { date: 'May 12', 'High Risk': 450 },
        { date: 'May 13', 'High Risk': 820 },
        { date: 'May 14', 'High Risk': 1100 },
        { date: 'May 15', 'High Risk': 900 },
        { date: 'May 16', 'High Risk': 1247 },
        { date: 'May 17', 'High Risk': 850 },
        { date: 'May 18', 'High Risk': 980 }
      ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Risk Trend <span className="text-xs text-slate-400 font-normal">(Last 7 Days)</span></h3>
        </div>
        <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
          View Report
        </button>
      </div>

      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '10px', fontWeight: '500' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '10px' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="highRisk" 
              stroke="#ef4444" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#trendGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskVelocityTrend;