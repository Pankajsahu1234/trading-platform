const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// helper for error handling
const handleResponse = async (res) => {
  if (res.status === 401) {
    // unauthorized, clear token and reload to force login
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'API error');
  }
  return res.json();
};

export const userService = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/api/users`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  getById: async (userId) => {
    const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  update: async (userId, data) => {
    const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};
