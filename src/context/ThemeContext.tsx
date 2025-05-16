import { createContext, useContext, useState, useEffect } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  updateColors: (newColors: ThemeColors) => void;
}

const defaultColors: ThemeColors = {
  primary: '#1a73e8',
  secondary: '#4285f4',
  accent: '#fbbc04',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(() => {
    try {
      // Try to load saved colors from localStorage during initialization
      const savedColors = localStorage.getItem('theme-colors');
      return savedColors ? JSON.parse(savedColors) : defaultColors;
    } catch (error) {
      // If JSON parsing fails, return default colors
      return defaultColors;
    }
  });

  useEffect(() => {
    // Update CSS variables when colors change
    const root = document.documentElement;
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
  }, [colors]);

  const updateColors = (newColors: ThemeColors) => {
    setColors(newColors);
    localStorage.setItem('theme-colors', JSON.stringify(newColors));
  };

  return (
    <ThemeContext.Provider value={{ colors, updateColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 