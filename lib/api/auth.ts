// lib/api/auth.ts
import axios, { AxiosError } from 'axios';
import type { 
  AuthResponse, 
  RegisterData, 
  LoginData, 
  ForgotPasswordData, 
  ResetPasswordData,
  ApiError,
  User 
} from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://docstec.site/wp-json/footballtalento/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Register new user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/register', data);
    
    if (response.data.success && response.data.data?.token) {
      // Store token and user data
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        user_id: response.data.data.user_id,
        username: response.data.data.username,
        email: response.data.data.email,
        display_name: response.data.data.display_name,
        account_type: response.data.data.account_type,
        country: response.data.data.country,
        currency: response.data.data.currency,
      }));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Registration failed. Please try again.');
  }
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/login', data);
    
    if (response.data.success && response.data.data?.token) {
      // Store token and user data
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        user_id: response.data.data.user_id,
        username: response.data.data.username,
        email: response.data.data.email,
        display_name: response.data.data.display_name,
        account_type: response.data.data.account_type,
        country: response.data.data.country,
        currency: response.data.data.currency,
      }));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Login failed. Please try again.');
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (token) {
      await api.post('/logout', { token });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API call result
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

// Validate token
export const validateToken = async (token: string): Promise<{ success: boolean; data?: User }> => {
  try {
    const response = await api.post('/validate-token', { token });
    return response.data;
  } catch (error) {
    return { success: false };
  }
};

// Forgot password
export const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/forgot-password', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Failed to send reset email. Please try again.');
  }
};

// Reset password
export const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/reset-password', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error('Failed to reset password. Please try again.');
  }
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
};
