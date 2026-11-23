const TOKEN_KEY = "thmind_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Server xatosi (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
