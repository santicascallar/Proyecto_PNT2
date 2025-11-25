const BASE_URL = import.meta.env.VITE_API_URL;
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}
export const register = async (payload) => {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

export const login = async (payload) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};


export default {
  register,
  login,
};
