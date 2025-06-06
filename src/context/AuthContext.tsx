import { createContext, useState, ReactNode, useEffect } from 'react';
import { AuthState, User } from '../types';

export interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      const fakeUser: User = { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'client' };
      login(fakeUser);
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (user: User) => {
    localStorage.setItem('authToken', 'fake-jwt-token');
    setAuthState({ 
      user: { ...user }, 
      isAuthenticated: true, 
      isLoading: false 
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
