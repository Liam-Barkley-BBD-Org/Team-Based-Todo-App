import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './tokenManager';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void; }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    interface RetryConfig extends InternalAxiosRequestConfig {
        _retry?: boolean;
    }
    const originalRequest: RetryConfig | undefined = error.config;

    if (!originalRequest) {
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Session expired. Attempting to refresh token...");
        const csrfResponse = await axios.get<{ csrfToken: string }>('/api/auth/csrf-token');
        const refreshResponse = await axios.post<{ jwt: string }>('/api/auth/refresh', {}, {
           headers: { 'X-CSRF-TOKEN': csrfResponse.data.csrfToken }
        });
        
        const newJwt = refreshResponse.data.jwt;
        tokenManager.setToken(newJwt);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newJwt}`;
        originalRequest.headers.Authorization = `Bearer ${newJwt}`;
        processQueue(null, newJwt);
        return apiClient(originalRequest);

      } catch (refreshError) {
        tokenManager.deleteToken();
        processQueue(refreshError as AxiosError, null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;