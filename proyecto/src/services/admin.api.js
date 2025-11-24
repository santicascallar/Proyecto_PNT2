const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, opts = {}) {
  const res = await fetch(BASE_URL + path, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const err = new Error((data && data.message) || res.statusText || "Request failed");
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

export async function fetchLeastReservationsReport(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request("/reports/least-reservations-tuesday", { method: "GET", headers });
}

export async function fetchTopRestaurantsReport(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return request("/reports/top-restaurants", { method: "GET", headers });
}

export default { fetchLeastReservationsReport, fetchTopRestaurantsReport };
