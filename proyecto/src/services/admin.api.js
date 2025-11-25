// admin.api.js removed — keep a minimal shim so imports don't break
export async function fetchLeastReservationsReport() {
  throw new Error("Reports API removed");
}

export async function fetchTopRestaurantsReport() {
  throw new Error("Reports API removed");
}

export default { fetchLeastReservationsReport, fetchTopRestaurantsReport };
