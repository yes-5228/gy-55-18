const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function extractErrorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
  if (data.message) return typeof data.message === "string" ? data.message : JSON.stringify(data.message);
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const value = data[firstKey];
    if (Array.isArray(value) && value.length) {
      const msg = value[0];
      return typeof msg === "string" ? msg : JSON.stringify(msg);
    }
    if (typeof value === "string") return value;
  }
  return JSON.stringify(data);
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = extractErrorMessage(data, response.statusText);
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
};
