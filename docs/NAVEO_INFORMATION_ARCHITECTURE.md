# NAVEO – Information Architecture & Link Tree

**Última actualización:** 2025-11-10  
**Propósito:** Documentar la jerarquía completa de portales, menús y páginas para coordinar el trabajo entre Codex y Gemini sin colisiones.

---

## 1. Portales Principales

| Portal | Descripción | Roles | Rutas base |
|--------|-------------|-------|------------|
| **Admin Owner** | Investment Banking / Platform Owner | `admin_owner` | `/admin-owner/*` |
| **Admin Client** | Fund Manager / Gestor institucional | `admin_client` | `/admin-client/*` |
| **Investor** | Inversionista final | `investor` | `/investor/*` |

---

## 2. Admin Owner Portal – Menú y Páginas

```
/admin-owner
├── Dashboard (DashboardPage.tsx) ✅
├── Asset Pipeline (AssetPipelinePage.tsx) ✅
├── Gestión de Fondos (FundsManagementPage.tsx) ✅
├── Gestión de Clientes (ClientsManagementPage.tsx) ✅
├── Usuarios & Permisos (UsersPermissionsPage.tsx) ✅
├── Integraciones
│   ├── KYC/KYB (IntegrationsKYCPage.tsx) ✅
│   ├── On/Off Ramp (IntegrationsOnRampPage.tsx) ✅
│   └── Blockchain (IntegrationsBlockchainPage.tsx) ✅
├── Compliance & Auditoría (CompliancePage.tsx) ✅
├── Reporting (ReportsPage.tsx) ✅
├── Audit Logs (AuditLogsPage.tsx) ✅
├── Notifications Center (NotificationsCenterPage.tsx) ✅
├── Configuración (ConfigurationPage.tsx) ✅
├── Platform Analytics (PlatformAnalyticsPage.tsx) ✅
├── Smart Contracts (SmartContractsPage.tsx) ✅
└── Fee Structure (FeeStructurePage.tsx) ✅
```

### Próximos módulos (Codex focus para coordinar con Gemini)
- **Due Diligence Tracker** (`DueDiligencePage.tsx`) – Sprint 3.2
- **Product Structuring Studio** (`ProductStructuringPage.tsx`) – Sprint 3.3
- **Regulatory Filings** (`RegulatoryFilingsPage.tsx`) – Sprint 10.1
- **Compliance Monitoring enhancements** – Sprint 10.2

---

## 3. Admin Client Portal – Menú y Páginas

```
/admin-client
├── Dashboard (DashboardPage.tsx) ✅
├── Activos del Fondo (AssetsManagementPage.tsx) ✅
├── Mi Portafolio (👷 Placeholder)
├── Sistema NAV (NAVSystemPage.tsx) ✅
├── Mis Inversionistas (👷 Placeholder)
├── Equipo & Permisos
│   ├── Traders (TradersManagementPage.tsx) ✅
│   ├── Officers (OfficersManagementPage.tsx) 👷
│   └── Sub-Admins (👷 Placeholder)
├── Transacciones (👷 Placeholder)
├── Compliance (👷 Placeholder)
└── Reportes (👷 Placeholder)
```

### Próximos módulos clave
- **Portfolio Allocation / Rebalancing** (Admin Client) – Sprint 6
- **Capital Calls / Subscription Calendar** – Sprint 5
- **Risk Dashboard** – Sprint 6

---

## 4. Investor Portal – Menú y Páginas

```
/investor
├── Dashboard (DashboardPage.tsx) ✅
├── Mi Portafolio (PortfolioPage.tsx) ✅
├── Marketplace (MarketplacePage.tsx) ✅
├── Transacciones (TransactionsPage.tsx) ✅
├── KYC Status (KYCStatusPage.tsx) ✅
├── Performance Analytics (PerformanceAnalyticsPage.tsx) ✅
├── Trading / Buy-Sell (BuySellModal.tsx) ✅
├── Notifications (👷)
├── Tax Center (TaxCenterPage.tsx) 🗓 Sprint 9.2
└── Statements / Reports (👷)
```

### Próximos módulos
- **Investor Onboarding Wizard** – Sprint 4
- **Suitability Questionnaire** – Sprint 4.1
- **Subscription Interface (Primary Market)** – Sprint 5
- **Secondary Trading Desk** – Sprint 7

---

## 5. Servicios & Infra

| Servicio | Archivo | Estado | Notas |
|----------|--------|--------|-------|
| Supabase Client | `src/services/supabaseClient.ts` | ✅ | Base para data provider |
| Admin Client API helpers | `src/services/adminClient.ts` | ✅ | `fetchAssets`, `fetchTraders`, `fetchUserPortfolios` |
| Shared Components | `src/components/common` / `src/components/modals` | En expansión | BuySellModal v2, StatCard, etc. |

---

## 6. Link Tree (Rutas Clave)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | `LoginPage.tsx` | Login/Demo + próximamente wallet connect |
| `/admin-owner` | DashboardOwner | KPIs globales |
| `/admin-owner/asset-pipeline` | AssetPipelinePage | Kanban de originación |
| `/admin-client/assets` | AssetsManagementPage | CRUD de activos de fondo |
| `/admin-client/traders` | TradersManagementPage | Operaciones de traders |
| `/investor/portfolio` | PortfolioPage | Holdings y performance |
| `/investor/marketplace` | MarketplacePage | Oferta primaria/secundaria |

_(Agregar nuevas rutas aquí a medida que se creen páginas)_

---

## 7. Coordinación Codex vs. Gemini

- **Codex foco inmediato:** Asset Pipeline (✅ hecho), Due Diligence, Structuring Studio, Seeds/Policies (Sprint 11).  
- **Gemini foco sugerido:** Portales Admin Client e Investor (Officers/Transactions/Compliance, Suitability, Subscription UI) para evitar choques.  
- **Regla:** Cada nueva página o menú debe agregarse primero en este documento y en `docs/CODEX_TASKS_EXPANDED.md` antes de implementarse.

---

> Mantener este archivo actualizado en cada batch para que ambos agentes compartan la misma arquitectura y puedan dividir tareas sin pisarse.
