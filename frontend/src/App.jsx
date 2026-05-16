import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardMainLayout from './components/DashboardMainLayout';
import SafetyChat from './pages/SafetyChat'; // Make sure the path is correct
import {
  getSystemStats,
  getRiskTrends,
  getRecentConversations
} from './config/api';

function App() {
  const [overviewData, setOverviewData] = useState({
    totalMessages: 0,
    processed: 0,
    highRisk: 0,
    escalated: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [intentData, setIntentData] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  // Fetches data for the Admin Dashboard
  const fetchLiveDashboardMetrics = async () => {
    try {
      const [overviewRes, trendsRes, messagesRes] = await Promise.all([
        getSystemStats(),
        getRiskTrends(),
        getRecentConversations()
      ]);

      // 1. Map Stats & Risk Distribution
      if (overviewRes?.data?.overview) {
        const { overview, intents } = overviewRes.data;
        setOverviewData({
          totalMessages: overview.totalMessages || 0,
          processed: overview.processed || 0,
          highRisk: overview.highRisk || 0,
          escalated: overview.escalated || 0
        });
        
        if (intents && Array.isArray(intents)) {
          setIntentData(intents.map(i => ({
            name: i.sentiment || 'Neutral',
            value: i.count || 0
          })));
        }
      }

      // 2. Map Risk Trend
      if (trendsRes?.data?.trends) {
        setTrendData(trendsRes.data.trends.map(t => ({
          name: t.date,
          highRisk: t.highRiskCount,
          total: t.totalCount
        })));
      }

      // 3. Map Recent Conversations
      if (messagesRes?.data?.data) {
        setRecentMessages(messagesRes.data.data);
      }

    } catch (error) {
      console.error("❌ Dashboard data mapping error:", error);
    }
  };

  useEffect(() => {
    fetchLiveDashboardMetrics();
    const liveTelemetryInterval = setInterval(fetchLiveDashboardMetrics, 4000);
    return () => clearInterval(liveTelemetryInterval);
  }, []);

  return (
    <Router>
      <Routes>
        {/* 💬 USER ROUTE: The chatbot interface */}
        <Route path="/chat" element={<SafetyChat />} />

        {/* 📊 ADMIN ROUTE: The monitoring dashboard */}
        <Route path="/dashboard" element={
          <DashboardMainLayout 
            overview={overviewData}
            trends={trendData}
            intents={intentData}
            messages={recentMessages}
          />
        } />

        {/* 🏠 DEFAULT: Send users to chat automatically */}
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}

export default App;