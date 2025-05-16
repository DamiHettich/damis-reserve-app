import { render, screen, renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { User } from '../../types';

describe('AuthContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'client',
  };

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('updates auth state on login', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it('clears auth state on logout', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    act(() => {
      result.current.login(mockUser);
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('throws error when useAuth is used outside of AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
    
    consoleError.mockRestore();
  });

  it('provides auth context to nested components', () => {
    const TestComponent = () => {
      const { isAuthenticated, user } = useAuth();
      return (
        <div>
          <span>Authenticated: {String(isAuthenticated)}</span>
          <span>User: {user?.name || 'none'}</span>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Authenticated: false')).toBeInTheDocument();
    expect(screen.getByText('User: none')).toBeInTheDocument();
  });

  it('maintains auth state across re-renders', () => {
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(mockUser);
    });

    rerender();

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles multiple login/logout cycles', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // First cycle
    act(() => {
      result.current.login(mockUser);
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);

    // Second cycle
    act(() => {
      result.current.login(mockUser);
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('preserves user data integrity', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.user).not.toBe(mockUser); // Ensure it's a new object
  });
});
