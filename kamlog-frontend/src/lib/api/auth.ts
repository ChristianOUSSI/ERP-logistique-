// API Service for Auth Module

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface MFAVerification {
  code: string;
  method: 'sms' | 'email' | 'authenticator';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  mfaRequired: boolean;
}

class AuthAPI {
  private baseUrl = '/api/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  async verifyMFA(verification: MFAVerification): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/verify-mfa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verification),
    });
    if (!response.ok) throw new Error('MFA verification failed');
    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Token refresh failed');
    return response.json();
  }
}

export const authAPI = new AuthAPI();
