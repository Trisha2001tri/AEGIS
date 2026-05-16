import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

// Add this to your existing api.js
export const postUserMessage = async (payload) => {
  try {
    // This uses your global instance which now has withCredentials: true
    const response = await API.post('/v1/messages', payload);
    return response.data;
  } catch (error) {
    console.error("API Error - postUserMessage:", error);
    throw error;
  }
};

export const getSystemStats = () =>
  API.get('/v1/dashboard/stats');

export const getRecentConversations = (params) =>
  API.get('/v1/dashboard/conversations', { params });

export const getRiskTrends = () =>
  API.get('/v1/dashboard/trends');

export const dispatchSimulationMessage = (payload) =>
  API.post('/v1/messages', payload);

export default API;