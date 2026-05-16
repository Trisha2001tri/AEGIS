import api from '../config/api';

export const dashboardService = {
  /**
   * Fetches high-level overview metrics and distribution arrays
   */
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Fetches chronological telemetry trend coordinates
   */
  getTrends: async () => {
    const response = await api.get('/dashboard/trends');
    return response.data;
  },

  /**
   * Injects a raw message payload straight into the BullMQ pipeline
   */
  injectPayload: async (messageData) => {
    return (await api.post('/messages', messageData)).data;
  },

  /**
   * Tracks individual worker message execution states via polling parameters
   */
  checkMessageStatus: async (trackingId) => {
    const response = await api.get(`/messages/${trackingId}`);
    return response.data?.status || response.data?.data?.status;
  }
};