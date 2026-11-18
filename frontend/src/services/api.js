/**
 * Centralized API service for CarbonLess application.
 * Handles authentication headers, request formatting, and error handling.
 */

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('carbonless_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  demoLogin: () => request('/auth/demo-login', { method: 'POST' }),
  getMe: () => request('/auth/me'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Calculator
  getFactors: () => request('/calculator/factors'),
  calculate: (body) => request('/calculator/calculate', { method: 'POST', body: JSON.stringify(body) }),
  saveFootprint: (body) => request('/calculator/save', { method: 'POST', body: JSON.stringify(body) }),
  getHistory: () => request('/calculator/history'),

  // Dashboard
  getDashboardSummary: () => request('/dashboard/summary'),
  getDashboardTrends: (days = 30) => request(`/dashboard/trends?days=${days}`),

  // Recommendations
  getRecommendations: () => request('/recommendations'),
  adoptRecommendation: (recId) => request('/recommendations/adopt', { method: 'POST', body: JSON.stringify({ rec_id: recId }) }),

  // Challenges
  getChallenges: () => request('/challenges'),
  joinChallenge: (id) => request(`/challenges/${id}/join`, { method: 'POST' }),
  completeChallenge: (id) => request(`/challenges/${id}/complete`, { method: 'POST' }),

  // Rewards & Leaderboard
  getBadges: () => request('/rewards/badges'),
  getLeaderboard: () => request('/rewards/leaderboard'),

  // Reports
  getAnalytics: () => request('/reports/analytics'),
};
