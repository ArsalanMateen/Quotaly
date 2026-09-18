class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
const workspaceTokenKey = 'quotaly.workspaceToken';
const disconnectedKey = 'quotaly.disconnected';

export function hasWorkspaceToken() {
  return Boolean(sessionStorage.getItem(workspaceTokenKey));
}

export function isExplicitlyDisconnected() {
  return sessionStorage.getItem(disconnectedKey) === 'true';
}

export function markDisconnected() {
  sessionStorage.setItem(disconnectedKey, 'true');
}

export function markConnected() {
  sessionStorage.removeItem(disconnectedKey);
}

export function saveWorkspaceToken(token) {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('The workspace could not be opened.');
  sessionStorage.setItem(workspaceTokenKey, token);
  sessionStorage.removeItem(disconnectedKey);
}

export function clearWorkspaceToken() {
  sessionStorage.removeItem(workspaceTokenKey);
  sessionStorage.removeItem(disconnectedKey);
}

export async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const token = sessionStorage.getItem(workspaceTokenKey);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => {
    throw new ApiError('The server is unavailable. Please try again.', response.status);
  });
  if (!response.ok) {
    if (response.status === 401) clearWorkspaceToken();
    throw new ApiError(data.error?.message || 'The request could not be completed.', response.status);
  }
  return data;
}
