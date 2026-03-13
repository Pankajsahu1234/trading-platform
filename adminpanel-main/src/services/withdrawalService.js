const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "API error");
  }
  return res.json();
};

export const withdrawalService = {
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/api/withdrawals/stats`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  getAll: async ({ type, status } = {}) => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    const query = params.toString() ? `?${params}` : "";
    const res = await fetch(`${BASE_URL}/api/withdrawals${query}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  getById: async (withdrawalId) => {
    const res = await fetch(`${BASE_URL}/api/withdrawals/${withdrawalId}`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  cancel: async (withdrawalId) => {
    const res = await fetch(
      `${BASE_URL}/api/withdrawals/${withdrawalId}/cancel`,
      {
        method: "POST",
        headers: authHeaders(),
      },
    );
    return handleResponse(res);
  },

  processPrincipal: async () => {
    const res = await fetch(`${BASE_URL}/api/withdrawals/process-principal`, {
      method: "POST",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  getAdminPending: async () => {
    const res = await fetch(`${BASE_URL}/api/withdrawals/admin/pending`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  approveWithdrawal: async (withdrawalId) => {
    const res = await fetch(`${BASE_URL}/api/withdrawals/admin/${withdrawalId}/approve`, {
      method: "POST",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  rejectWithdrawal: async (withdrawalId) => {
    const res = await fetch(`${BASE_URL}/api/withdrawals/admin/${withdrawalId}/reject`, {
      method: "POST",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
