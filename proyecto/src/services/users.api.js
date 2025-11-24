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
export const getUsers = async (params = {}) => {
 
  const query = new URLSearchParams(params).toString();
  return request(`/users${query ? `?${query}` : ""}`);
};

export const getUserById = (id) => request(`/users/${id}`);

export const createUser = (payload) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateUser = (id, payload) =>
  request(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
export const updateUserWithToken = (id, payload, token) =>
  request(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" },
  });
export const deleteUser = (id) =>
  request(`/users/${id}`, { method: "DELETE" });


export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};