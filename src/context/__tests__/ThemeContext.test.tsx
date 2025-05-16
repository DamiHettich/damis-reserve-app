import { render, renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

describe('ThemeContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  const defaultColors = {
    primary: '#1a73e8',
    secondary: '#4285f4',
    accent: '#fbbc04',
  };

  const newColors = {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ff0000',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset CSS variables
    document.documentElement.style.removeProperty('--color-primary');
    document.documentElement.style.removeProperty('--color-secondary');
    document.documentElement.style.removeProperty('--color-accent');
  });

  it('provides default colors when no saved theme exists', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.colors).toEqual(defaultColors);
  });

  it('loads saved colors from localStorage', () => {
    localStorage.setItem('theme-colors', JSON.stringify(newColors));
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.colors).toEqual(newColors);
  });

  it('updates colors and saves to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateColors(newColors);
    });

    // Check if colors were updated in context
    expect(result.current.colors).toEqual(newColors);
    
    // Check if colors were saved to localStorage
    const savedColors = JSON.parse(localStorage.getItem('theme-colors') || '{}');
    expect(savedColors).toEqual(newColors);
  });

  it('updates CSS variables when colors change', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateColors(newColors);
    });

    const root = document.documentElement;
    expect(root.style.getPropertyValue('--color-primary')).toBe(newColors.primary);
    expect(root.style.getPropertyValue('--color-secondary')).toBe(newColors.secondary);
    expect(root.style.getPropertyValue('--color-accent')).toBe(newColors.accent);
  });

  it('throws error when useTheme is used outside of ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    
    consoleError.mockRestore();
  });

  it('maintains theme state across re-renders', () => {
    const { result, rerender } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.updateColors(newColors);
    });

    rerender();

    expect(result.current.colors).toEqual(newColors);
  });

  it('provides theme context to nested components', () => {
    const TestComponent = () => {
      const { colors } = useTheme();
      return <div data-testid="color">{colors.primary}</div>;
    };

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('color')).toHaveTextContent(defaultColors.primary);
  });

  it('handles invalid JSON in localStorage', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('theme-colors', 'invalid-json');
    
    const { result } = renderHook(() => useTheme(), { wrapper });
    
    // Should fall back to default colors
    expect(result.current.colors).toEqual(defaultColors);
  });

  it('handles multiple color updates', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    const intermediateColors = {
      primary: '#cccccc',
      secondary: '#dddddd',
      accent: '#eeeeee',
    };

    act(() => {
      result.current.updateColors(intermediateColors);
    });
    expect(result.current.colors).toEqual(intermediateColors);

    act(() => {
      result.current.updateColors(newColors);
    });
    expect(result.current.colors).toEqual(newColors);
  });
});
