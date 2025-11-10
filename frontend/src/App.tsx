import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/react-router';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { dataProvider, liveProvider } from '@refinedev/supabase';
import { ConfigProvider } from 'antd';
import { supabaseClient } from './services/supabaseClient';

// Import portal components (will create these next)
import AdminOwnerPortal from './portals/admin-owner/AdminOwnerPortal';
import AdminClientPortal from './portals/admin-client/AdminClientPortal';
import InvestorPortal from './portals/investor/InvestorPortal';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider>
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
              <Route path="/admin-owner/*" element={<AdminOwnerPortal />} />
              <Route path="/admin-client/*" element={<AdminClientPortal />} />
              <Route path="/investor/*" element={<InvestorPortal />} />
              <Route path="/" element={<div>
                <h1>Naveo - Plataforma Institucional Cripto</h1>
                <ul>
                  <li><a href="/admin-owner">Portal Admin Owner</a></li>
                  <li><a href="/admin-client">Portal Admin Client</a></li>
                  <li><a href="/investor">Portal Investor</a></li>
                </ul>
              </div>} />
            </Routes>
            <RefineKbar />
          </Refine>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
