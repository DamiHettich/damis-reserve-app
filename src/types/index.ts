export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'provider' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
