import React, { useState } from 'react';
import { Send } from 'lucide-react';

function SimulationPayload({ onMessageSubmit, activeTrackingId }) {
  const [userId, setUserId] = useState('user_dev_trisha');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !userId.trim()) return;
    
    onMessageSubmit({ user_id: userId, message });
    setMessage(''); // Clear input box after submission
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-6 shadow-xl w-full h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-200 mb-4 tracking-wide">
          Queue Payload Injection Layer
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">
              Target User Identifier
            </label>
            <input 
              type="text" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="e.g., user_1234"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wider uppercase">
              Message Body Payload
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="Type an alert message to push through BullMQ..."
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Dynamic Status Tracking Subcard */}
      {activeTrackingId && (
        <div className="mt-6 flex items-center gap-3 bg-blue-500/5 border border-blue-500/10 rounded-lg p-3.5 text-xs text-blue-400">
          <div className="w-3.5 h-3.5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="font-medium tracking-wide">
            Pipeline processing: <code className="text-slate-300 ml-1 font-mono">{activeTrackingId.slice(0, 18)}...</code>
          </p>
        </div>
      )}
    </div>
  );
}

export default SimulationPayload;