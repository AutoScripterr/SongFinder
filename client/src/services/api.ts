import axios from 'axios';
import type { IdentifyResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout for video processing
});

export const api = {
  async identifySong(url: string): Promise<IdentifyResponse> {
    const response = await apiClient.post<IdentifyResponse>('/identify', { url });
    return response.data;
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
