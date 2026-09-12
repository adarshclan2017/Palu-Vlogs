/**
 * Client-side API fetch helpers for Palu Vlogs Next.js app
 */

const BASE = '/api';

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('palu_token') : null;
  const headers = { ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Vlogs
  getVlogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/vlogs${q ? `?${q}` : ''}`);
  },
  getVlogBySlug: (slug) => request(`/vlogs/${slug}`),
  createVlog: (data) => request('/vlogs', { method: 'POST', body: JSON.stringify(data) }),
  updateVlog: (id, data) => request(`/vlogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVlog: (id) => request(`/vlogs/${id}`, { method: 'DELETE' }),

  // Gallery
  getPhotos: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/gallery${q ? `?${q}` : ''}`);
  },
  getAlbums: () => request('/gallery/albums'),
  createPhoto: (formData) => request('/gallery', { method: 'POST', body: formData }),
  deletePhoto: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: () => request('/locations'),
  createLocation: (data) => request('/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id, data) => request(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocation: (id) => request(`/locations/${id}`, { method: 'DELETE' }),

  // Contact
  sendMessage: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: () => request('/contact'),
  toggleMessageRead: (id) => request(`/contact/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) => request(`/contact/${id}`, { method: 'DELETE' }),

  // Newsletter
  subscribeNewsletter: (email) =>
    request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getStats: () => request('/settings/stats'),

  // Upload
  uploadImage: (formData) => request('/upload', { method: 'POST', body: formData }),
};

export default api;
