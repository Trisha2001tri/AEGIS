import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Light-themed semantic palette matching your reference image
const INTENT_COLORS = {
  'self-harm intent': '#ef4444',  // Red
  'hopelessness': '#f97316',      // Orange
  'severe anxiety': '#3b82f6',    // Blue
  'emotional distress': '#64748b' // Slate
};

function InsightsDonut({ intents = [] }) {
  // Map incoming database counts or fallback to reference preview values if empty
  const chartData = intents.length > 0
  ? intents.map(item => ({
      name: item.name || 'unknown',
      value: item.value || 0
    }))
    : [
        { name: 'self-harm intent', value: 42 },
        { name: 'hopelessness', value: 28 },
        { name: 'severe anxiety', value: 18 },
        { name: 'emotional distress', value: 12 }
      ];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Risk Distribution</h3>
      </div>
      
      <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-2 items-center min-h-[220px]">
        {/* Chart Graphical Wheel Area */}
        <div className="sm:col-span-6 h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={INTENT_COLORS[entry.name] || '#a855f7'} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                itemStyle={{ fontSize: '12px', color: '#1e293b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Legend Indicators Text Column */}
        <div className="sm:col-span-6 flex flex-col gap-2 pl-2">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: INTENT_COLORS[entry.name] || '#a855f7' }}
                />
                <span className="capitalize text-slate-600 font-medium">{entry.name}</span>
              </div>
              <span className="font-bold text-slate-800">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InsightsDonut;