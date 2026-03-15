const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }
  return res.json();
};

export const adminDashboardService = {

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
      headers: authHeaders()
    });

    return handleResponse(res);
  }

};