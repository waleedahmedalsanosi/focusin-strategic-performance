/**
 * api.ts – Typed HTTP client for the FocusIn backend.
 *
 * All requests are sent to /api/* which is proxied to the Express server
 * in development (via vite.config.ts), and served directly by Express
 * in production.
 *
 * Authentication:
 *   - The session token is stored in localStorage under 'focusin_token'.
 *   - Every request automatically adds an Authorization: Bearer <token> header
 *     when a token is present.
 *   - Call setToken(null) to clear the session (logout).
 */

const BASE = '/api';

/** In-memory token cache, initialized from localStorage on module load. */
let _token: string | null = localStorage.getItem('focusin_token');

/** Persist a new token (or clear it when null). */
export const setToken = (t: string | null) => {
  _token = t;
  if (t) localStorage.setItem('focusin_token', t);
  else localStorage.removeItem('focusin_token');
};

/** Read the current token (used for session restore on app load). */
export const getToken = () => _token;

/** Build request headers, injecting the Bearer token when available. */
const h = () => ({
  'Content-Type': 'application/json',
  ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
});

/**
 * Generic fetch wrapper.
 * Throws an Error with the server's error message on non-2xx responses.
 */
const req = async (method: string, path: string, body?: any) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: h(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  auth: {
    signup: (d: { firstName: string; lastName: string; email: string; password: string; company?: string }) =>
      req('POST', '/auth/signup', d),
    signin: (d: { email: string; password: string }) =>
      req('POST', '/auth/signin', d),
    signout: () => req('POST', '/auth/signout'),
    /** Returns the current user object; throws 401 if the token is invalid. */
    me: () => req('GET', '/auth/me'),
  },

  // ── KPIs ────────────────────────────────────────────────────────────────────
  kpis: {
    list: () => req('GET', '/kpis'),
    create: (d: any) => req('POST', '/kpis', d),
    update: (id: string, d: any) => req('PUT', `/kpis/${id}`, d),
    remove: (id: string) => req('DELETE', `/kpis/${id}`),
  },

  // ── Balanced Scorecard ──────────────────────────────────────────────────────
  bsc: {
    list: () => req('GET', '/bsc'),
    create: (d: any) => req('POST', '/bsc', d),
    update: (id: string, d: any) => req('PUT', `/bsc/${id}`, d),
    remove: (id: string) => req('DELETE', `/bsc/${id}`),
  },

  // ── Initiatives ─────────────────────────────────────────────────────────────
  initiatives: {
    list: () => req('GET', '/initiatives'),
    create: (d: any) => req('POST', '/initiatives', d),
    update: (id: string, d: any) => req('PUT', `/initiatives/${id}`, d),
    remove: (id: string) => req('DELETE', `/initiatives/${id}`),
  },

  // ── Strategies ──────────────────────────────────────────────────────────────
  strategies: {
    list: () => req('GET', '/strategies'),
    create: (d: any) => req('POST', '/strategies', d),
    update: (id: string, d: any) => req('PUT', `/strategies/${id}`, d),
    remove: (id: string) => req('DELETE', `/strategies/${id}`),
  },

  // ── Departments ─────────────────────────────────────────────────────────────
  departments: {
    list: () => req('GET', '/departments'),
    create: (d: any) => req('POST', '/departments', d),
    update: (id: string, d: any) => req('PUT', `/departments/${id}`, d),
    remove: (id: string) => req('DELETE', `/departments/${id}`),
  },

  // ── AI Chat ─────────────────────────────────────────────────────────────────
  /**
   * Send the full conversation history to the Gemini AI backend.
   * The server is stateless — the client passes all messages on every request.
   * @param messages Array of { role: 'user'|'model', content: string }
   */
  chat: (messages: { role: string; content: string }[]) =>
    req('POST', '/chat', { messages }),

  // ── Profile ─────────────────────────────────────────────────────────────────
  profile: {
    /** Update display name and company. Returns the updated user object. */
    update: (d: { name: string; company: string }) =>
      req('PUT', '/auth/profile', d),
    /** Change password — requires the current password for verification. */
    changePassword: (d: { currentPassword: string; newPassword: string }) =>
      req('PUT', '/auth/password', d),
  },
};
