const BASE_URL = import.meta.env.VITE_API_URL ;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message || 'Error en la solicitud');

  return data;
};
