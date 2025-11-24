const BASE_URL = import.meta.env.VITE_API_URL;

// --- Función base de request ---
async function request(path, options = {}) {
  const { token, headers = {}, body, method } = options;
  const h = { "Content-Type": "application/json", ...headers };
  if (token) h.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: method || (body ? "POST" : "GET"),
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

// --- RESERVAS ---
export const getReservations = async (params = {}, token) => {
  const query = new URLSearchParams(params).toString();
  return request(`/reservations${query ? `?${query}` : ""}`, { token });
};

export const getReservationById = (id, token) => request(`/reservations/${id}`, { token });

export const getReservationByUser = (userId, token) => request(`/reservations/user/${userId}`, { token });

export const createReservation = (payload, token) => request("/reservations", { method: "POST", body: payload, token });

export const updateReservation = (id, payload, token) => request(`/reservations/${id}`, { method: "PATCH", body: payload, token });

export const deleteReservation = (id, token) => request(`/reservations/${id}`, { method: "DELETE", token });

export default {
  getReservations,
  getReservationById,
  getReservationByUser,
  createReservation,
  updateReservation,
  deleteReservation,
};
