import React from 'react';
import AnalyticsOverview from './AnalyticsOverview';
import InsightsDonut from './InsightsDonut';
import RiskVelocityTrend from './RiskVelocityTrend';
import TelemetryAuditLog from './TelemetryAuditLog';

function DashboardMainLayout({ 
  overview, 
  intents, 
  trends, 
  activeTrackingId 
}) {

  const launchSimulator = () => {
    window.open('/chat', '_blank', 'width=500,height=800,left=100,top=100');
  };

  return (
    <div className="h-screen bg-[#f8fafc] text-slate-900 font-sans flex overflow-hidden">
      
      {/* LEFT PANEL SYSTEM NAVIGATION BAR */}
      <aside className="w-64 bg-[#0b1329] text-slate-400 hidden md:flex flex-col shrink-0 border-r border-slate-900 h-full">
        
        {/* SCROLLABLE TOP AREA (Logo and Nav) */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800/60 sticky top-0 bg-[#0b1329] z-10">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
              Ω
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100 tracking-tight leading-none">AEGIS</span>
              <span className="text-[10px] text-slate-500 font-medium mt-1">AI Safety Guardian</span>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1.5">
            <div className="text-[10px] font-bold tracking-widest text-slate-500 px-3 uppercase mb-2 mt-2">Monitor</div>
            <button className="flex items-center gap-3 px-3 py-2 bg-indigo-600/10 text-indigo-400 font-semibold text-xs rounded-lg text-left">
              <span>📊</span> Dashboard
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 text-xs rounded-lg text-left transition-colors">
              <span>📉</span> Live Monitor
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800/40 text-xs rounded-lg text-left transition-colors">
              <span>💬</span> Conversations
            </button>
          </nav>
        </div>

        {/* FIXED BOTTOM AREA (Pinned Button) */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0b1329] shrink-0">
          <div className="px-3">
            <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-3">Testing</div>
            <button 
              onClick={launchSimulator}
              className="w-full flex items-center gap-3 px-3 py-3 bg-indigo-600 text-white font-bold text-[11px] rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
            >
              <span className="text-base">🚀</span>
              LAUNCH USER BOT
            </button>
          </div>
          
          <div className="px-3 mt-4 py-2 flex flex-col gap-1 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Operational
            </div>
            <span className="text-slate-600 font-mono text-[9px]">AEGIS v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* CORE FRAME CONTAINER VIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-20">
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900">Safety Overview</h1>
            <span className="text-[11px] text-slate-400 font-medium">Real-time monitoring and safety intelligence</span>
          </div>
          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600/10 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">TM</div>
            <div className="flex flex-col text-left whitespace-nowrap">
              <span className="text-xs font-bold text-slate-800 leading-none">Trisha Mondal</span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">System Administrator</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto max-w-[1600px] w-full mx-auto bg-slate-50/50">
          <div className="flex flex-col gap-6">
            <div className="w-full">
              <AnalyticsOverview overview={overview} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
              <div className="lg:col-span-8 flex flex-col gap-6 w-full">
                <div className="w-full">
                  <TelemetryAuditLog activeTrackingId={activeTrackingId} />
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6 w-full">
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 min-h-[300px]">
                  <RiskVelocityTrend trends={trends} />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-4 min-h-[300px]">
                  <InsightsDonut intents={intents} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardMainLayout;