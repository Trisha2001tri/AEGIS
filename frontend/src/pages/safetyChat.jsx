import React, { useState, useEffect, useRef } from 'react';
import { postUserMessage } from '../config/api'; // Import your clean API helper

const SafetyChat = () => {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll logic to keep the latest message in view
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isJoined) scrollToBottom();
  }, [chatLog, isJoined]);

  useEffect(() => {
    if (isJoined) {
      // The bot starts the conversation as soon as the session begins
      setChatLog([
        { 
          text: `Hello ${nickname}, I'm here to listen. How has your day been so far?`, 
          type: 'system', 
          timestamp: new Date() 
        }
      ]);
    }
  }, [isJoined, nickname]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const currentMsg = message;
    setMessage('');
    setLoading(true);

    // 1. Optimistic Update: Add user message to UI immediately
    const userMessage = { 
      text: currentMsg, 
      type: 'user', 
      timestamp: new Date() 
    };
    setChatLog(prev => [...prev, userMessage]);

    try {
      // 2. 🛠️ Call Backend via your API wrapper
      await postUserMessage({ 
        nickname, 
        message: currentMsg 
      });

      // 3. Simulated System Acknowledgement 
      // In a real app, this might be a real-time response from your AI
      setTimeout(() => {
        setChatLog(prev => [...prev, { 
          text: "Message received. Our system is monitoring this session for your safety.", 
          type: 'system', 
          timestamp: new Date() 
        }]);
        setLoading(false);
      }, 800);

    } catch (err) {
      console.error("Transmission failed:", err);
      setChatLog(prev => [...prev, { 
        text: "Connection error. Your message might not have been logged.", 
        type: 'error' 
      }]);
      setLoading(false);
    }
  };

  // --- SCREEN 1: THE JOIN/NICKNAME SCREEN ---
  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1329] p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
              Ω
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Aegis Chat</h2>
            <p className="text-slate-500 text-sm mt-2">Enter a nickname to begin your secure session.</p>
          </div>
          
          <div className="space-y-4">
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
              placeholder="Your nickname..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && nickname && setIsJoined(true)}
            />
            <button 
              onClick={() => nickname && setIsJoined(true)}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: THE ACTUAL CHAT INTERFACE ---
  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full bg-white shadow-xl border-x border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-bold text-slate-800">Session: {nickname}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors"
          >
            End Session
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : msg.type === 'error'
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                <p className="leading-relaxed font-medium">{msg.text}</p>
                {msg.timestamp && (
                  <p className={`text-[9px] mt-2 opacity-50 font-bold ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-3 items-center">
          <input 
            className="flex-1 p-4 bg-slate-100 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Tell us how you're feeling..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={!message.trim() || loading}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-md"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="font-bold">➔</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SafetyChat;