import { apiService } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'admin' | 'recruiter';
    profileComplete: boolean;
  };
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'admin' | 'recruiter';
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login', { email, password });
  }

  async register(userData: RegisterData): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/register', userData);
  }

  async getCurrentUser() {
    return apiService.get('/auth/me');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiService.post('/auth/reset-password', { token, password });
  }

  async updateProfile(userData: any) {
    return apiService.put('/auth/profile', userData);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return apiService.put('/auth/change-password', { currentPassword, newPassword });
  }
}

export const authService = new AuthService();