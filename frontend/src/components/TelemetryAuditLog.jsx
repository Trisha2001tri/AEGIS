import React, { useState, useEffect } from 'react';
import { getRecentConversations } from '../config/api'; 

function TelemetryAuditLog({ activeTrackingId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getRecentConversations();
      
      if (response?.data?.data) {
        setLogs(response.data.data);
      } else if (Array.isArray(response?.data)) {
        setLogs(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit telemetry logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, [activeTrackingId]);

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'ESCALATED': return 'bg-rose-50 border-rose-200 text-rose-600';
      case 'INTERVENED': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'COMPLETED':
      case 'PROCESSED': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  const getRiskStyles = (level) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'bg-rose-100 text-rose-700 font-bold';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 font-semibold';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // 🛠️ NEW: Styling for automated actions
  const getActionStyles = (action) => {
    switch (action?.toUpperCase()) {
      case 'ESCALATE': 
        return 'bg-rose-600 text-white shadow-sm';
      case 'GROUNDING': 
        return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
      case 'CLARIFY': 
        return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      default: 
        return 'bg-slate-50 text-slate-400 border border-slate-100';
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Conversations</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Live transactional safety ledger</p>
        </div>
        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              <th className="py-3 px-6">Tracking Identifier</th>
              <th className="py-3 px-6">Message Preview</th>
              <th className="py-3 px-6 text-center">Risk Level</th>
              <th className="py-3 px-6 text-center">Action Taken</th> {/* 🆕 Added Header */}
              <th className="py-3 px-6 text-center">Confidence</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 italic">
                  No tracking records discovered in the cluster.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={log._id || index} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-semibold text-indigo-600">
                    <span className="truncate block max-w-[150px]" title={log.tracking_id}>
                      {log.tracking_id || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 max-w-[280px] truncate text-slate-600 font-medium">
                    {log.message || 'Empty payload'}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2 py-0.5 text-[10px] rounded tracking-wide uppercase ${getRiskStyles(log.risk || 'LOW')}`}>
                      {log.risk || 'LOW'}
                    </span>
                  </td>
                  
                  {/* 🆕 Action Taken Column Implementation */}
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2.5 py-1 text-[9px] font-black rounded-md tracking-tighter uppercase transition-all ${getActionStyles(log.action)}`}>
                      {log.action || 'MONITOR'}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-center font-mono text-slate-900 font-semibold">
                    {typeof log.confidence === 'number' ? log.confidence.toFixed(2) : '0.00'}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`px-2 py-0.5 border text-[10px] font-bold rounded tracking-wide uppercase ${getStatusStyles(log.status)}`}>
                      {log.status || 'PROCESSED'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right text-slate-400 font-medium font-mono">
                    {log.createdAt 
                      ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
                      : '--:--'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TelemetryAuditLog;