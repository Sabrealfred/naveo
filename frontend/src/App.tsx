import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dataProvider, liveProvider } from '@refinedev/supabase';
import { ConfigProvider } from 'antd';
import { supabaseClient } from './services/supabaseClient';

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

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={miraLabsTheme}>
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

export default App;
