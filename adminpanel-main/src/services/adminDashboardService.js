const BASE_URL = "http://timo-dev-alb-2026977482.ap-south-1.elb.amazonaws.com/api";

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
    const res = await fetch(`${BASE_URL}/admin/dashboard/stats`, {
      headers: authHeaders()
    });

    return handleResponse(res);
  }

};