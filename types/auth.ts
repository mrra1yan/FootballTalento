// types/auth.ts
export interface User {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
  account_type: string;
  country: string;
  currency: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: number;
    username: string;
    email: string;
    display_name: string;
    account_type: string;
    country: string;
    currency: string;
    token: string;
    unverified?: boolean;
  };
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  accountType: string;
  country: string;
  currency: string;
  language: string;
  parentConsent?: boolean;
  website_url?: string; // Honeypot
}

export interface LoginData {
  emailUsername: string;
  password: string;
  remember?: boolean;
  website_url?: string; // Honeypot
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ApiError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}
