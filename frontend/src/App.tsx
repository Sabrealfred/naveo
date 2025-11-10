import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { dataProvider, liveProvider } from '@refinedev/supabase';
import { ConfigProvider } from 'antd';
import { supabaseClient } from './services/supabaseClient';
import { useTranslation } from 'react-i18next';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import './i18n'; // Initialize i18n

// Import portal components (will create these next)
import AdminOwnerPortal from './portals/admin-owner/AdminOwnerPortal';
import AdminClientPortal from './portals/admin-client/AdminClientPortal';
import InvestorPortal from './portals/investor/InvestorPortal';
import LoginPage from './pages/LoginPage';

function App() {
  const { i18n } = useTranslation();

  // Get Ant Design locale based on current language
  const antdLocale = i18n.language === 'es' ? esES : enUS;

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider locale={antdLocale}>
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
