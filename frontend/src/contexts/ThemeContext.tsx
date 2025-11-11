import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';

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
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          components: {
            Layout: {
              headerBg: theme === 'dark' ? '#141414' : '#ffffff',
              siderBg: theme === 'dark' ? '#1f1f1f' : '#001529',
              bodyBg: theme === 'dark' ? '#141414' : '#f0f2f5',
            },
            Menu: {
              darkItemBg: theme === 'dark' ? '#1f1f1f' : '#001529',
              darkSubMenuItemBg: theme === 'dark' ? '#141414' : '#000c17',
            },
            Card: {
              colorBgContainer: theme === 'dark' ? '#1f1f1f' : '#ffffff',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
