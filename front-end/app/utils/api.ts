import { getToken } from './secureStorage';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.BASE_URL;

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Make an authenticated API request
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add authorization token if required
  if (requiresAuth) {
    const token = await getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = async (endpoint: string, requiresAuth = true): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'GET',
    requiresAuth,
  });

  return response.json();
};

/**
 * POST request
 */
export const post = async (
  endpoint: string,
  data: any,
  requiresAuth = true
): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth,
  });

  return response.json();
};

/**
 * PUT request
 */
export const put = async (
  endpoint: string,
  data: any,
  requiresAuth = true
): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    requiresAuth,
  });

  return response.json();
};

/**
 * DELETE request
 */
export const del = async (endpoint: string, requiresAuth = true): Promise<any> => {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
    requiresAuth,
  });

  return response.json();
};

export default {
  apiRequest,
  get,
  post,
  put,
  delete: del,
};
