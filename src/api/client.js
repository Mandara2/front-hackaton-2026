/**
 * Cliente API: baseURL = VITE_API_URL.
 * Si VITE_API_URL no está definida, usa mock (drop-in replacement).
 * Todos los fetch del frontend pasan por este cliente.
 */

const baseURL = import.meta.env.VITE_API_URL ?? "";
const useMock = !baseURL || baseURL.trim() === "";

async function request(method, path, body = undefined) {
  const url = path.startsWith("http") ? path : `${baseURL.replace(/\/$/, "")}${path}`;
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.error || res.statusText), { status: res.status, data });
  }
  return data;
}

export async function getProperties() {
  if (useMock) {
    const mock = await import("./mock.js");
    return mock.getProperties();
  }
  return request("GET", "/properties");
}

export async function getPropertyById(id) {
  if (useMock) {
    const mock = await import("./mock.js");
    return mock.getPropertyById(id);
  }
  return request("GET", `/properties/${id}`);
}

/**
 * Reservas siempre se envían al backend para que se guarden y se puedan consultar en Telegram.
 * Si no hay VITE_API_URL, usa http://localhost:8000 para que el campesino vea las reservas en el bot.
 */
export async function postBookings(payload) {
  const bookingBaseURL = baseURL?.trim() || "http://localhost:8000";
  const url = `${bookingBaseURL.replace(/\/$/, "")}/bookings`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.detail || data.error || res.statusText), { status: res.status, data });
  }
  return data;
}

/**
 * Galería dinámica (fotos/videos que agrega el campesino desde Telegram).
 * GET /api/properties/:id/media. Sin API devuelve { items: [] }.
 */
export async function getPropertyMedia(propertyId) {
  if (useMock || !baseURL?.trim()) {
    return { items: [] };
  }
  try {
    return await request("GET", `/api/properties/${propertyId}/media`);
  } catch {
    return { items: [] };
  }
}

/**
 * Búsqueda con IA (Gemini). Siempre usa la API real; requiere VITE_API_URL en .env
 * POST /api/search body: { user_query, lang }
 */
export async function postSearch(userQuery, lang = "es") {
  const url = (baseURL || "http://localhost:8000").replace(/\/$/, "");
  const fullUrl = `${url}/api/search`;
  const res = await fetch(fullUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_query: String(userQuery).trim(), lang }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}
