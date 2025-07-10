
import { ApiException, RequestOptions, ApiResponse } from '@/types/api';

class TypeSafeApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const user = localStorage.getItem('auth_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return {
          Authorization: `Bearer ${userData.token || 'mock-token'}`,
        };
      } catch (error) {
        console.warn('Failed to parse auth user:', error);
      }
    }
    return {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultTimeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiException(
          `API Error: ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      if (error.name === 'AbortError') {
        throw new ApiException('Request timeout', 'TIMEOUT_ERROR');
      }
      throw new ApiException('Network error occurred', 'NETWORK_ERROR');
    }
  }

  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  async put<T>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new TypeSafeApiClient();
