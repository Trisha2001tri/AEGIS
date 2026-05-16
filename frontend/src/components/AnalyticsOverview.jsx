import React from 'react';

function AnalyticsOverview({ overview }) {
  // Pulling live metrics with your exact UI state defaults fallback
  const stats = [
    {
      id: 'total',
      label: 'Total Volumes',
      value: overview?.totalMessages || '0',
      change: '+ 12.5%',
      isPositive: true,
      bgIconClass: 'bg-blue-500/10 text-blue-500',
      icon: '💬',
    },
    {
      id: 'processed',
      label: 'Processed',
      value: overview?.processed || '0',
      change: '+ 11.3%',
      isPositive: true,
      bgIconClass: 'bg-emerald-500/10 text-emerald-500',
      icon: '✅',
    },
    {
      id: 'high-risk',
      label: 'High Risk Flag',
      value: overview?.highRisk || '0',
      change: '↑ 15.7%',
      isPositive: false,
      bgIconClass: 'bg-rose-500/10 text-rose-500',
      icon: '⚠️',
    },
    {
      id: 'escalated',
      label: 'SOS Escalated',
      value: overview?.escalated || '0',
      change: '↑ 18.6%',
      isPositive: false,
      bgIconClass: 'bg-amber-500/10 text-amber-500',
      icon: '🚨',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Optional Top Section Header Line to align with design specs */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          System Overview
        </h3>
        <button className="text-[10px] font-bold text-indigo-600 hover:underline">
          View All Metrics
        </button>
      </div>

      {/* GRID FIX: 
        - grid-cols-2: Side-by-side pairs on tight/medium viewports
        - xl:grid-cols-4: Spreads into a flat row when width expands
      */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 w-full">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Row 1: Label and Action Status Badge Element */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight truncate">
                {item.label}
              </span>
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${item.bgIconClass} shrink-0`}>
                {item.icon}
              </div>
            </div>

            {/* Row 2: Metric Data Int and Change Tracker Indicator */}
            <div className="flex items-baseline justify-between gap-1 mt-3">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                {item.value}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  item.isPositive
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-rose-600 bg-rose-50'
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsOverview;