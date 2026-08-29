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

  private async handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 401) {
      localStorage.removeItem('capacita_auth_token');
      localStorage.removeItem('capacita_current_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    if (!res.ok) {
      let detail = '';
      try {
        const body = await res.json() as { detail?: string };
        detail = body.detail ? `: ${body.detail}` : '';
      } catch {
        // Keep the HTTP status when the server does not return JSON.
      }
      throw new Error(`API Error: ${res.status} ${res.statusText}${detail}`);
    }
    return await res.json();
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, val]) => url.searchParams.append(key, val));
    }

    const res = await fetch(url.toString(), {
      ...options,
      method: 'GET',
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });
    return this.handleResponse<T>(res);
  }

  async post<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        ...options.headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
    return this.handleResponse<T>(res);
  }

  async put<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        ...options.headers
      },
      body: data ? JSON.stringify(data) : undefined
    });
    return this.handleResponse<T>(res);
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });
    return this.handleResponse<T>(res);
  }
}

export const api = new ApiClient(APP_CONFIG.apiBaseUrl);
