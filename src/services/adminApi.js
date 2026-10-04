const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://glowv-production-4b3e.up.railway.app')
).replace(/\/$/, '');
const DEMO_TOKEN = 'glowv-admin-demo';

function getAuthToken() {
  const token = localStorage.getItem('glowv_admin_token');
  return token || (localStorage.getItem('glowvai_auth') === 'true' ? DEMO_TOKEN : null);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || 'Request failed');
  }

  return payload;
}

const toDbOrderStatus = (status) => {
  const raw = String(status || '').trim();
  if (!raw) return 'CONFIRMED';

  const normalized = raw.toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'NEW':
      return 'CONFIRMED';
    case 'PENDING':
      return 'PENDING';
    case 'CONFIRMED':
      return 'CONFIRMED';
    case 'PACKED':
      return 'PACKED';
    case 'SHIPPED':
      return 'SHIPPED';
    case 'OUT_FOR_DELIVERY':
    case 'OUT FOR DELIVERY':
      return 'OUT_FOR_DELIVERY';
    case 'DELIVERED':
      return 'DELIVERED';
    case 'CANCELLED':
    case 'CANCELED':
      return 'CANCELLED';
    case 'RETURN_REQUESTED':
    case 'RETURN REQUESTED':
      return 'RETURN_REQUESTED';
    case 'RETURNED':
      return 'RETURNED';
    default:
      return 'CONFIRMED';
  }
};

export const adminApi = {
  async listProducts() {
    const response = await request('/api/admin/products');
    return response?.data || [];
  },

  async listCategories() {
    const response = await request('/api/products/categories');
    return response?.data || response || [];
  },

  async listOrders() {
    const response = await request('/api/admin/orders');
    return response?.data || [];
  },

  async getOrder(orderId) {
    const response = await request(`/api/admin/orders/${orderId}`);
    return response?.data || null;
  },

  async updateOrderStatus(orderId, status) {
    const response = await request(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: toDbOrderStatus(status) }),
    });
    return response?.data || null;
  },

  async createProduct(product) {
    const response = await request('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return response?.data;
  },

  async updateProduct(productId, product) {
    const response = await request(`/api/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return response?.data;
  },

  async updateStock(productId, quantity) {
    const response = await request(`/api/admin/products/${productId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
    return response?.data;
  },

  async deleteProduct(productId) {
    const response = await request(`/api/admin/products/${productId}`, {
      method: 'DELETE',
    });
    return response?.data;
  },
};
