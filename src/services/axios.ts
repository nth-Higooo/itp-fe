import axios, { AxiosRequestConfig } from 'axios';
import TokenService from './token.service';
import { BaseResponse } from '../data/base-response.model';
import { doLogout } from './auth/auth.service';
import { CONFIG } from 'src/config-global';
import { toast } from 'src/components/snackbar';

const AxiosInstance = axios.create({
  baseURL: `${CONFIG.serverUrl}/api/v1`,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    const unAuthorizeUrls = ['/login', '/refresh', '/new-password', '/forgot-password'];

    if (token && config.url && !unAuthorizeUrls.includes(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const rememberMe = TokenService.getRememberMe();
    if ([401, 410].includes(error.response.status) && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        if (!rememberMe) {
          doLogout();
        }

        const response = await axios.post<BaseResponse<string | null>>(
          `${CONFIG.serverUrl}/api/v1/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          TokenService.setSession(response.data.session);

          return AxiosInstance(originalRequest);
        } else {
          return Promise.reject(response.data.message);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data ? error?.response?.data.message : error.message);
    } else {
      console.log(error);
      toast.error('Unknown error');
    }
    return Promise.reject(error);
  }
);

export const GET = (url: string, config?: AxiosRequestConfig<any> | undefined) => {
  return AxiosInstance.get(url, config);
};

export const POST = (url: string, body: any, config?: AxiosRequestConfig<any> | undefined) => {
  return AxiosInstance.post(url, body, config);
};

export const PATCH = (url: string, body: any) => {
  return AxiosInstance.patch(url, body);
};

export const PUT = (url: string, body: any) => {
  return AxiosInstance.put(url, body);
};

export const DELETE = (url: string, config?: AxiosRequestConfig<any> | undefined) => {
  return AxiosInstance.delete(url, config);
};

export const DOWNLOAD = (url: string, config?: AxiosRequestConfig<any> | undefined) => {
  return AxiosInstance.get(url, { ...config, responseType: 'blob' });
};

export default AxiosInstance;
