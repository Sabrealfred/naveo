import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem('naveo-theme');
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('naveo-theme', theme);

    // Update document root class for custom CSS
    document.documentElement.setAttribute('data-theme', theme);

    // Update body background color
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#141414';
    } else {
      document.body.style.backgroundColor = '#f0f2f5';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
