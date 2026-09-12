/**
 * API Service Client for Palu Vlogs
 */

const API_BASE = '/api';

// Helper for making authenticated requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('palu_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, set Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Vlogs
  getVlogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vlogs${query ? `?${query}` : ''}`);
  },
  getVlogBySlug: (slug) => request(`/vlogs/${slug}`),
  createVlog: (vlogData) =>
    request('/vlogs', {
      method: 'POST',
      body: JSON.stringify(vlogData)
    }),
  updateVlog: (id, vlogData) =>
    request(`/vlogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vlogData)
    }),
  deleteVlog: (id) =>
    request(`/vlogs/${id}`, {
      method: 'DELETE'
    }),

  // Gallery
  getPhotos: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/gallery${query ? `?${query}` : ''}`);
  },
  getAlbums: () => request('/gallery/albums'),
  createPhoto: (formData) =>
    request('/gallery', {
      method: 'POST',
      body: formData
    }),
  deletePhoto: (id) =>
    request(`/gallery/${id}`, {
      method: 'DELETE'
    }),

  // Locations
  getLocations: () => request('/locations'),
  createLocation: (formData) =>
    request('/locations', {
      method: 'POST',
      body: formData
    }),
  updateLocation: (id, formData) =>
    request(`/locations/${id}`, {
      method: 'PUT',
      body: formData
    }),
  deleteLocation: (id) =>
    request(`/locations/${id}`, {
      method: 'DELETE'
    }),

  // Contact
  sendMessage: (msgData) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(msgData)
    }),
  getMessages: () => request('/contact'),
  toggleMessageRead: (id) =>
    request(`/contact/${id}/read`, {
      method: 'PUT'
    }),
  deleteMessage: (id) =>
    request(`/contact/${id}`, {
      method: 'DELETE'
    }),

  // Newsletter
  subscribeNewsletter: (email) =>
    request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
  getSubscribers: () => request('/newsletter/subscribers'),

  // Settings & Dashboard Stats
  getSettings: () => request('/settings'),
  updateSettings: (settingsData) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData)
    }),
  getStats: () => request('/settings/stats'),

  // File Upload
  uploadImage: (formData) =>
    request('/upload', {
      method: 'POST',
      body: formData
    })
};

export default api;
