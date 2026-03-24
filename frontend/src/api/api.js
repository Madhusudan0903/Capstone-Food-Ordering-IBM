const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  };
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || 'Request failed');
  }
  return data;
}

export const authApi = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: { email, password } }),
  register: (data) => api('/auth/register', { method: 'POST', body: data }),
};

export const restaurantApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/restaurants${q ? `?${q}` : ''}`);
  },
  getById: (id) => api(`/restaurants/${id}`),
};

export const menuApi = {
  getByRestaurant: (id) => api(`/menu/restaurant/${id}`),
  getItem: (id) => api(`/menu/item/${id}`),
};

export const cartApi = {
  get: () => api('/cart'),
  add: (menuItemId, quantity, notes) =>
    api('/cart/add', { method: 'POST', body: { menuItemId, quantity, notes } }),
  updateItem: (id, quantity, notes) =>
    api(`/cart/item/${id}`, { method: 'PUT', body: { quantity, notes } }),
  removeItem: (id) => api(`/cart/item/${id}`, { method: 'DELETE' }),
  clear: () => api('/cart/clear', { method: 'DELETE' }),
};

export const orderApi = {
  create: (addressId, couponCode, notes, payment) =>
    api('/orders', { method: 'POST', body: { addressId, couponCode, notes, payment } }),
  getAll: () => api('/orders'),
  getById: (id) => api(`/orders/${id}`),
};

export const couponApi = {
  validate: (code, subtotal) =>
    api('/coupons/validate', { method: 'POST', body: { code, subtotal } }),
};

export const reviewApi = {
  getByRestaurant: (id) => api(`/reviews/restaurant/${id}`),
  create: (restaurantId, orderId, rating, comment) => {
    const body = { restaurantId, rating, comment };
    if (orderId !== null && orderId !== undefined) {
      body.orderId = orderId;
    }
    return api('/reviews', {
      method: 'POST',
      body,
    });
  },
};

export const userApi = {
  getProfile: () => api('/users/profile'),
  getAddresses: () => api('/users/addresses'),
  addAddress: (data) => api('/users/addresses', { method: 'POST', body: data }),
  updateAddress: (id, data) => api(`/users/addresses/${id}`, { method: 'PUT', body: data }),
  deleteAddress: (id) => api(`/users/addresses/${id}`, { method: 'DELETE' }),
};
