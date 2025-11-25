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

export const createRestaurant = async (payload) => {
  const token = localStorage.getItem("token");
  return request("/restaurants", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const updateRestaurant = (id, payload) => {
  const token = localStorage.getItem("token");
  request(`/restaurants/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });
};

export async function getLeastBookedRestaurant() {
  const res = await fetch(`${BASE_URL}/restaurants/least-booked`);
  if (!res.ok) throw new Error("Error obteniendo restaurante promocionado");
  return await res.json();
}
export const deleteRestaurant = (id, payload) => {
  const token = localStorage.getItem("token");
  request(`/restaurants/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const getLeastReservationsTuesday = async (limit = 5) => {
  return request(`/reports/least-reservations-tuesday?limit=${limit}`);
};

export const getTopRestaurants = async (period = 30, limit = 5) => {
  return request(`/reports/top-restaurants?period=${period}&limit=${limit}`);
};

export default {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getLeastReservationsTuesday,
  getTopRestaurants
};
