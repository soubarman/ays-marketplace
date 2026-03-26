const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = async (endpoint: string, { body, ...customConfig }: Omit<RequestInit, 'body'> & { body?: any } = {}) => {
  const token = localStorage.getItem('ays_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let finalEndpoint = endpoint;
  if (config.method === 'GET') {
    const separator = finalEndpoint.includes('?') ? '&' : '?';
    finalEndpoint = `${finalEndpoint}${separator}t=${Date.now()}`;
  }

  const response = await fetch(`${API_URL}${finalEndpoint}`, config);
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }
  if (response.ok) {
    return data;
  }
  throw new Error(data?.message || response.statusText || 'An error occurred');
};
