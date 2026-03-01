const BASE = '/api';

let _token: string | null = localStorage.getItem('focusin_token');

export const setToken = (t: string | null) => {
  _token = t;
  if (t) localStorage.setItem('focusin_token', t);
  else localStorage.removeItem('focusin_token');
};

export const getToken = () => _token;

const h = () => ({
  'Content-Type': 'application/json',
  ...(_token ? { Authorization: `Bearer ${_token}` } : {}),
});

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
  auth: {
    signup: (d: { firstName: string; lastName: string; email: string; password: string; company?: string }) =>
      req('POST', '/auth/signup', d),
    signin: (d: { email: string; password: string }) =>
      req('POST', '/auth/signin', d),
    signout: () => req('POST', '/auth/signout'),
    me: () => req('GET', '/auth/me'),
  },
  kpis: {
    list: () => req('GET', '/kpis'),
    create: (d: any) => req('POST', '/kpis', d),
    update: (id: string, d: any) => req('PUT', `/kpis/${id}`, d),
    remove: (id: string) => req('DELETE', `/kpis/${id}`),
  },
  bsc: {
    list: () => req('GET', '/bsc'),
    create: (d: any) => req('POST', '/bsc', d),
    update: (id: string, d: any) => req('PUT', `/bsc/${id}`, d),
    remove: (id: string) => req('DELETE', `/bsc/${id}`),
  },
  initiatives: {
    list: () => req('GET', '/initiatives'),
    create: (d: any) => req('POST', '/initiatives', d),
    update: (id: string, d: any) => req('PUT', `/initiatives/${id}`, d),
    remove: (id: string) => req('DELETE', `/initiatives/${id}`),
  },
  strategies: {
    list: () => req('GET', '/strategies'),
    create: (d: any) => req('POST', '/strategies', d),
    update: (id: string, d: any) => req('PUT', `/strategies/${id}`, d),
    remove: (id: string) => req('DELETE', `/strategies/${id}`),
  },
  departments: {
    list: () => req('GET', '/departments'),
    create: (d: any) => req('POST', '/departments', d),
    update: (id: string, d: any) => req('PUT', `/departments/${id}`, d),
    remove: (id: string) => req('DELETE', `/departments/${id}`),
  },
  chat: (messages: { role: string; content: string }[]) =>
    req('POST', '/chat', { messages }),
  profile: {
    update: (d: { name: string; company: string }) =>
      req('PUT', '/auth/profile', d),
    changePassword: (d: { currentPassword: string; newPassword: string }) =>
      req('PUT', '/auth/password', d),
  },
};
