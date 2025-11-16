const BASE_URL = import.meta.env.VITE_API_URL;

// --- Función base de request ---
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

// --- RESTAURANTES ---
export const getRestaurants = async (params = {}) => {
 
  const query = new URLSearchParams(params).toString();
  return request(`/restaurants${query ? `?${query}` : ""}`);
};

export const getRestaurantById = (id) => request(`/restaurants/${id}`);

export const createRestaurant = (payload) =>
  request("/restaurants", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateRestaurant = (id, payload) =>
  request(`/restaurants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteRestaurant = (id) =>
  request(`/restaurants/${id}`, { method: "DELETE" });

// --- USUARIOS AUTH ---
export const register = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const login = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });


export default {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};