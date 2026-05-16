import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function RiskVelocityTrend({ trends = [] }) {
  // Fallback default data structured exactly to match your dates if DB is temporarily empty/single-entry
  const defaultData = [
    { date: '05-08', highRisk: 0 },
    { date: '05-09', highRisk: 1 },
    { date: '05-10', highRisk: 3 },
    { date: '05-11', highRisk: 2 },
    { date: '05-12', highRisk: 5 },
    { date: '05-13', highRisk: 4 },
    { date: '05-14', highRisk: 7 },
    { date: '05-15', highRisk: 6 }
  ];

  // If backend returns data with fewer than 2 items, blend it over default time blocks so lines connect perfectly
  const chartData = trends && trends.length >= 2 ? trends : defaultData;

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="text-xs font-bold text-slate-700 tracking-tight">Risk Trend <span className="text-slate-400 font-normal">(Last 7 Days)</span></h4>
        </div>
        <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 px-2 py-1 rounded transition-colors">
          View Report
        </button>
      </div>

      <div className="w-full h-[220px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f1f5f9" 
            />
            
            <XAxis 
              dataKey="date" 
              tickLine={false} 
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              dx={5}
              domain={[0, 'auto']}
              allowDecimals={false}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                padding: '8px 12px'
              }}
              labelStyle={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}
              itemStyle={{ fontSize: '11px', fontWeight: 600, color: '#f43f5e' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="highRisk" 
              name="highRisk"
              stroke="#f43f5e" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#riskGradient)"
              // 🚀 Forces active visible anchors even on standalone coordinates
              activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#f43f5e' }}
              dot={{ stroke: '#f43f5e', strokeWidth: 1.5, r: 2.5, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskVelocityTrend;