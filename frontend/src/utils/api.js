/**
 * AquaWatch API utility
 * All API calls to the FastAPI backend
 */
import axios from 'axios'

const BASE = '/api'

export const api = {
  // Analysis
  analyzeImage: (formData) => axios.post(`${BASE}/analyze-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  loadDemo: (name = 'river_ganga_sample.jpg') => axios.post(`${BASE}/load-demo?demo_name=${encodeURIComponent(name)}`),
  listSampleImages: () => axios.get(`${BASE}/sample-images`),
  downloadReport: () => `${BASE}/download-report`,

  // Sites
  getSites: () => axios.get(`${BASE}/sites`),
  getSite: (id) => axios.get(`${BASE}/site/${id}`),

  // History
  getHistory: (siteId, days = 90) => axios.get(`${BASE}/history/${siteId}?days=${days}`),
  getHistoryChart: (siteId, days = 60) => axios.get(`${BASE}/history/${siteId}/chart?days=${days}`),

  // Forecast
  getForecast: (siteId) => axios.get(`${BASE}/forecast/${siteId}`),

  // Alerts
  getAlerts: () => axios.get(`${BASE}/alerts`),
  getAlertSummary: () => axios.get(`${BASE}/alerts/summary`),
  acknowledgeAlert: (id) => axios.post(`${BASE}/alerts/${id}/ack`),
}

export function formatNumber(val, decimals = 1) {
  if (val == null || isNaN(val)) return '—'
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
  return Number(val).toFixed(decimals)
}

export function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function floodRiskColor(level) {
  const map = { Low: 'success', Moderate: 'warning', High: 'danger' }
  return map[level] || 'info'
}

export function turbidityColor(score) {
  if (score < 25) return '#22c55e'
  if (score < 55) return '#f59e0b'
  if (score < 75) return '#f97316'
  return '#ef4444'
}
