import { APP_CONFIG } from '../utils/constants';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('capacita_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, val]) => url.searchParams.append(key, val));
    }

    try {
      const res = await fetch(url.toString(), {
        ...options,
        method: 'GET',
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });
      if (!res.ok) {
        throw new Error(`API GET Error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      // Fallback handled gracefully in individual domain services
      throw err;
    }
  }

  async post<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          ...options.headers
        },
        body: data ? JSON.stringify(data) : undefined
      });
      if (!res.ok) {
        throw new Error(`API POST Error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  async put<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        method: 'PUT',
        headers: {
          ...this.getHeaders(),
          ...options.headers
        },
        body: data ? JSON.stringify(data) : undefined
      });
      if (!res.ok) {
        throw new Error(`API PUT Error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        method: 'DELETE',
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });
      if (!res.ok) {
        throw new Error(`API DELETE Error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  }
}

export const api = new ApiClient(APP_CONFIG.apiBaseUrl);
