/**
 * Client-side API fetch helpers for Palu Vlogs Next.js app
 */

const BASE = '/api';

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('palu_token') : null;
  const headers = { ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  let body = options.body;
  if (body instanceof FormData) {
    // Let browser calculate multipart boundary
    delete headers['Content-Type'];
  } else if (body && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  } else if (body && typeof body === 'string') {
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
  }

  // Settings endpoint carries base64 images — needs a longer timeout
  const timeoutMs = endpoint.includes('/settings') ? 30000 : 12000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers,
      body,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your network and try again.');
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Vlogs
  getVlogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/vlogs${q ? `?${q}` : ''}`);
  },
  getVlogBySlug: (slug) => request(`/vlogs/${slug}`),
  createVlog: (data) => request('/vlogs', { method: 'POST', body: data }),
  updateVlog: (id, data) => request(`/vlogs/${id}`, { method: 'PUT', body: data }),
  deleteVlog: (id) => request(`/vlogs/${id}`, { method: 'DELETE' }),

  // Gallery
  getPhotos: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/gallery${q ? `?${q}` : ''}`);
  },
  getAlbums: () => request('/gallery/albums'),
  createPhoto: (data) => request('/gallery', { method: 'POST', body: data }),
  updatePhoto: (id, data) => request(`/gallery/${id}`, { method: 'PUT', body: data }),
  deletePhoto: (id) => request(`/gallery/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: () => request('/locations'),
  createLocation: (data) => request('/locations', { method: 'POST', body: data }),
  updateLocation: (id, data) => request(`/locations/${id}`, { method: 'PUT', body: data }),
  deleteLocation: (id) => request(`/locations/${id}`, { method: 'DELETE' }),

  // Contact
  sendMessage: (data) => request('/contact', { method: 'POST', body: data }),
  getMessages: () => request('/contact'),
  toggleMessageRead: (id) => request(`/contact/${id}`, { method: 'PUT' }),
  markAllMessagesAsRead: () => request('/contact', { method: 'PUT' }),
  deleteMessage: (id) => request(`/contact/${id}`, { method: 'DELETE' }),

  // Newsletter
  subscribeNewsletter: (email) =>
    request('/newsletter', { method: 'POST', body: { email } }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: data }),
  getStats: () => request('/settings/stats'),

  // Upload
  uploadImage: (formData) => request('/upload', { method: 'POST', body: formData }),
};

export default api;
