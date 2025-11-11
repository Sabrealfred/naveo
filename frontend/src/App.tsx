import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dataProvider, liveProvider } from '@refinedev/supabase';
import { ConfigProvider, theme } from 'antd';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import { useTranslation } from 'react-i18next';
import { supabaseClient } from './services/supabaseClient';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './i18n'; // Initialize i18n

// Import portal components (will create these next)
import AdminOwnerPortal from './portals/admin-owner/AdminOwnerPortal';
import AdminClientPortal from './portals/admin-client/AdminClientPortal';
import InvestorPortal from './portals/investor/InvestorPortal';
import LoginPage from './pages/LoginPage';

// MiraLabs theme configuration
const miraLabsTheme = {
  token: {
    colorPrimary: '#2d2d2d',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#666666',
    colorTextBase: '#1a1a1a',
    colorBgBase: '#fafafa',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
  },
  components: {
    Layout: {
      colorBgHeader: '#ffffff',
      colorBgBody: '#fafafa',
    },
    Menu: {
      colorItemBg: '#2d2d2d',
      colorItemText: '#e5e5e5',
      colorItemTextSelected: '#ffffff',
      colorItemBgSelected: '#3d3d3d',
      colorItemTextHover: '#ffffff',
      colorItemBgHover: '#3d3d3d',
    },
    Card: {
      colorBgContainer: '#ffffff',
      borderRadiusLG: 8,
    },
    Button: {
      colorPrimary: '#2d2d2d',
      colorPrimaryHover: '#3d3d3d',
      borderRadius: 6,
    },
  },
};

// Inner component that uses theme hook
function AppContent() {
  const { i18n } = useTranslation();
  const { isDark } = useTheme();

  // Get Ant Design locale based on current language
  const getAntdLocale = () => {
    const currentLang = i18n.language || 'es';
    return currentLang.startsWith('en') ? enUS : esES;
  };

  // Merge MiraLabs theme with dark/light algorithm
  const appTheme = {
    ...miraLabsTheme,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      ...miraLabsTheme.token,
    },
    components: {
      ...miraLabsTheme.components,
      Layout: {
        ...miraLabsTheme.components.Layout,
        colorBgBody: isDark ? '#141414' : '#fafafa',
      },
      Card: {
        ...miraLabsTheme.components.Card,
        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
      },
    },
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={appTheme} locale={getAntdLocale()}>
          <Refine
            dataProvider={dataProvider(supabaseClient)}
            liveProvider={liveProvider(supabaseClient)}
            routerProvider={routerProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/admin-owner/*" element={<AdminOwnerPortal />} />
              <Route path="/admin-client/*" element={<AdminClientPortal />} />
              <Route path="/investor/*" element={<InvestorPortal />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <RefineKbar />
          </Refine>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
