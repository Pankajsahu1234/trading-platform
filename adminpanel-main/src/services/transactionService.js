const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// helper for error handling (similar to other services)
const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    // role isn't used currently
    window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'API error');
  }
  return res.json();
};

export const transactionService = {
  /**
   * Retrieve transaction history from the server.
   * Supports pagination and filtering via options object.
   *
   * @param {{page?:number,limit?:number,type?:string}} [opts]
   */
  getHistory: async (opts = {}) => {
    const params = new URLSearchParams();
    if (opts.page != null) params.set('page', opts.page);
    if (opts.limit != null) params.set('limit', opts.limit);
    if (opts.type != null) params.set('type', opts.type);

    // backend path as shown in Postman screenshot
    const url = `${BASE_URL}/api/admin/transactions${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
