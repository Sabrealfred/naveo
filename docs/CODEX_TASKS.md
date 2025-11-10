# 🤖 CODEX - TAREAS ASIGNADAS

**Fecha de asignación:** 2025-11-10
**Proyecto:** Naveo - Plataforma Institucional Cripto
**Fase actual:** FASE 2 - Gestión de Activos

---

## 📋 CONTEXTO DEL PROYECTO

**Estado actual:**
- ✅ FASE 1 completada al 100%
- ✅ 3 Dashboards principales funcionando
- ✅ Sistema tipográfico implementado
- ✅ React Router configurado
- 🔄 37.5% del proyecto total completado

**Stack:**
- Frontend: React 18 + TypeScript + Vite
- UI: Ant Design + Refine
- Backend: Supabase (PostgreSQL)
- Rutas: React Router v7

**URLs de trabajo:**
- Frontend: http://172.23.3.62:5175/
- Supabase Studio: http://172.23.3.62:54323

---

## 🎯 SPRINT 2 - TAREAS PRIORITARIAS

### 📌 TAREA 0: Login Page + Demo Access
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 1 hora  
**Archivos a crear/modificar:**  
- `/frontend/src/pages/LoginPage.tsx`  
- `/frontend/src/App.tsx`

**Requisitos:**
1. **Pantalla de Login (landing principal)**
   - Fondo con gradiente ligero y tarjeta centrada
   - Formulario con campos: Email, Password, Rol (Admin Owner / Admin Client / Investor)
   - Validaciones básicas (email válido, password requerida, rol requerido)
   - Mostrar logotipo/branding de Naveo y mensaje corto
2. **Demo Login**
   - Botón(es) de “Demo Login” para entrar con un clic según el rol seleccionado
   - Enviar al portal correspondiente (`/admin-owner`, `/admin-client`, `/investor`) sin credenciales reales
   - Mostrar `message.success` indicando el rol con el que se autenticó
3. **Integración con router**
   - Ruta `/` debe renderizar el login
   - Mantener rutas existentes para los portales
   - Después de `login` o `demo login`, redirigir usando React Router (`useNavigate`)
4. **Extras opcionales**
   - Recuerdo de “Need help? Contact support”
   - Mostrar badges con estado alfa/beta

**Referencia visual:** ver `docs/COMPONENTS.md` sección landing (estilo hero minimalista).

### 📌 TAREA 1: Assets Management Page (Admin Client)
**Prioridad:** 🔴 CRÍTICA
**Tiempo estimado:** 2-3 horas
**Archivos a crear:**
- `/frontend/src/portals/admin-client/pages/AssetsManagementPage.tsx`

**Requisitos:**

#### Funcionalidades:
1. **Tabla de Assets del Fondo**
   - Columnas: Asset, Symbol, Quantity, Current Price, Total Value, % Portfolio, 24h Change, Actions
   - Sorting por todas las columnas
   - Búsqueda y filtros por tipo de asset (Crypto, Token, Stablecoin)

2. **Métricas Superiores (Cards)**
   - Total Assets
   - Total Portfolio Value
   - Best Performer (24h)
   - Worst Performer (24h)

3. **Acciones CRUD**
   - ✅ Botón "Add Asset" → Modal de creación
   - ✏️ Botón "Edit" por asset → Modal de edición
   - 🗑️ Botón "Remove" → Confirmación
   - 📊 Botón "View Details" → Modal con histórico

4. **Modals Requeridos**
   - **AddAssetModal:** Formulario con campos (Symbol, Name, Type, Quantity, Purchase Price, Purchase Date)
   - **EditAssetModal:** Mismo formulario pre-llenado
   - **AssetDetailsModal:** Gráfico de precio histórico, transacciones relacionadas

**Componentes a usar:**
```typescript
import { Table, Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import { StatCard } from '../../../components/common';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
```

**Datos Mock a usar:**
```typescript
const assetsData = [
  { symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', quantity: 15.5, price: 42150, value: 653325, change24h: 3.5 },
  { symbol: 'ETH', name: 'Ethereum', type: 'Crypto', quantity: 250, price: 2250, value: 562500, change24h: 5.2 },
  { symbol: 'USDC', name: 'USD Coin', type: 'Stablecoin', quantity: 125000, price: 1.00, value: 125000, change24h: 0.0 },
  // ... más assets
];
```

**Ruta a configurar:**
```typescript
// En /frontend/src/portals/admin-client/AdminClientPortal.tsx
<Route path="assets" element={<AssetsManagementPage />} />
```

**Referencias:**
- Similar a: `/admin-owner/pages/FundsManagementPage.tsx`
- Layout: Usar `DashboardLayout`

---

### 📌 TAREA 2: Portfolio Page (Investor)
**Prioridad:** 🔴 CRÍTICA
**Tiempo estimado:** 2 horas
**Archivos a crear:**
- `/frontend/src/portals/investor/pages/PortfolioPage.tsx`

**Requisitos:**

#### Funcionalidades:
1. **Header con Métricas Principales**
   - Total Portfolio Value
   - Total Invested
   - Total Return ($)
   - Total Return (%)
   - Available Balance

2. **Sección: My Holdings**
   - Tabla detallada con: Fund Name, Shares, Avg Buy Price, Current NAV, Current Value, P&L ($), P&L (%), Actions
   - Botones: Buy More, Sell, View History
   - Sorting por todas las columnas

3. **Sección: Performance Chart**
   - Gráfico de línea: Portfolio Value histórico (último año)
   - Selector de período: 1M, 3M, 6M, 1Y, All

4. **Sección: Asset Allocation**
   - Pie chart de distribución por fondo
   - Lista con porcentajes y valores

5. **Sección: Recent Activity**
   - Últimas 5 transacciones
   - Link "View All Transactions" → /investor/transactions

**Componentes a usar:**
```typescript
import { Card, Table, Button, Space, Tag, Tabs } from 'antd';
import { Line, Pie } from '@ant-design/charts';
import { StatCard } from '../../../components/common';
import {
  WalletOutlined,
  RiseOutlined,
  FallOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
```

**Datos Mock:**
```typescript
const holdings = [
  {
    fund: 'Alpha Growth Fund',
    shares: 350,
    avgPrice: 100,
    currentNav: 127.85,
    value: 44747.5,
    pnl: 9747.5,
    pnlPercent: 27.85
  },
  // ... más holdings
];

const performanceHistory = [
  { date: '2024-05', value: 95000 },
  { date: '2024-06', value: 100000 },
  // ... histórico completo
];
```

**Ruta:**
```typescript
// En /frontend/src/portals/investor/InvestorPortal.tsx
<Route path="portfolio" element={<PortfolioPage />} />
```

**Referencias:**
- Similar a: `/investor/pages/DashboardPage.tsx`
- Usar componentes existentes: `StatCard`, `Line`, `Pie`

---

### 📌 TAREA 3: Mejorar BuySellModal
**Prioridad:** 🟡 ALTA
**Tiempo estimado:** 1.5 horas
**Archivo a modificar:**
- `/frontend/src/components/modals/BuySellModal.tsx`

**Requisitos de mejora:**

#### Funcionalidades a agregar:
1. **Validaciones del formulario**
   - Amount debe ser > 0
   - Amount debe ser <= Available Balance (para Buy)
   - Amount debe ser <= Total Shares (para Sell)
   - Mostrar errores en tiempo real

2. **Cálculo automático**
   - Mostrar: "Total Cost = Amount × Current NAV"
   - Mostrar: "Fees = Total × 0.5%"
   - Mostrar: "Final Amount = Total + Fees"

3. **Confirmación de transacción**
   - Step 1: Formulario
   - Step 2: Review (mostrar resumen)
   - Step 3: Success (mensaje de confirmación)

4. **Diseño mejorado**
   - Card con fondo gris para resumen
   - Iconos para cada tipo de transacción
   - Loading state durante "procesamiento"

**Estructura sugerida:**
```typescript
interface BuySellModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  asset: {
    name: string;
    symbol: string;
    currentNav: number;
  };
  availableBalance?: number;
  totalShares?: number;
}

// Agregar Steps de Ant Design
import { Steps, Result } from 'antd';
const [currentStep, setCurrentStep] = useState(0);
```

**Validaciones con Ant Design Form:**
```typescript
<Form.Item
  name="amount"
  rules={[
    { required: true, message: 'Please enter amount' },
    {
      validator: async (_, value) => {
        if (type === 'buy' && value * currentNav > availableBalance) {
          throw new Error('Insufficient balance');
        }
        if (type === 'sell' && value > totalShares) {
          throw new Error('Insufficient shares');
        }
      }
    }
  ]}
>
  <InputNumber min={0.01} step={0.01} />
</Form.Item>
```

---

### 📌 TAREA 4: Traders Management Page (Admin Client)
**Prioridad:** 🟡 ALTA
**Tiempo estimado:** 2 horas
**Archivos a crear:**
- `/frontend/src/portals/admin-client/pages/TradersManagementPage.tsx`

**Requisitos:**

#### Funcionalidades:
1. **Tabla de Traders**
   - Columnas: Name, Email, Role, Total Trades, Volume, P&L, Win Rate, Status, Actions
   - Filtros: Status (Active, Suspended, Pending)
   - Búsqueda por nombre/email

2. **Métricas Superiores**
   - Total Traders
   - Active Traders
   - Total Trading Volume
   - Avg Win Rate

3. **Acciones**
   - ➕ "Add Trader" → Modal de invitación
   - 👁️ "View Performance" → Modal con estadísticas detalladas
   - ✏️ "Edit Permissions" → Modal de permisos
   - 🔒 "Suspend/Activate" → Toggle de estado

4. **Modal: Add Trader**
   - Campos: Email, Full Name, Role (Junior/Senior/Lead), Trading Limits
   - Enviar invitación por email (simulado)

5. **Modal: Trader Performance**
   - Gráfico de P&L histórico
   - Tabla de últimas 10 operaciones
   - Métricas: Total Trades, Win Rate, Best Trade, Worst Trade

**Componentes:**
```typescript
import { Table, Button, Tag, Modal, Form, Input, Select, Switch } from 'antd';
import { Column } from '@ant-design/charts';
import {
  UserAddOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
```

**Datos Mock:**
```typescript
const traders = [
  {
    id: 1,
    name: 'John Trader',
    email: 'john@fund.com',
    role: 'Senior',
    trades: 145,
    volume: 12500000,
    pnl: 245000,
    winRate: 68.5,
    status: 'active'
  },
  // ... más traders
];
```

**Ruta:**
```typescript
<Route path="traders" element={<TradersManagementPage />} />
```

---

### 📌 TAREA 5: Conectar con Supabase (Preparación)
**Prioridad:** 🟢 MEDIA
**Tiempo estimado:** 3 horas
**Archivos a crear:**
- `/supabase/migrations/001_initial_schema.sql`

**Requisitos:**

#### Crear esquema de base de datos:

**Tabla: funds**
```sql
CREATE TABLE funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES auth.users(id),
  current_nav DECIMAL(18, 2),
  total_aum DECIMAL(18, 2),
  total_shares BIGINT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabla: assets**
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'crypto', 'token', 'stablecoin'
  quantity DECIMAL(18, 8),
  purchase_price DECIMAL(18, 2),
  current_price DECIMAL(18, 2),
  purchase_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabla: transactions**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  fund_id UUID REFERENCES funds(id),
  type VARCHAR(50), -- 'buy', 'sell', 'deposit', 'withdraw'
  shares DECIMAL(18, 8),
  nav_at_time DECIMAL(18, 2),
  amount DECIMAL(18, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabla: user_portfolios**
```sql
CREATE TABLE user_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  fund_id UUID REFERENCES funds(id),
  shares DECIMAL(18, 8),
  avg_purchase_price DECIMAL(18, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fund_id)
);
```

**Tabla: traders**
```sql
CREATE TABLE traders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(50), -- 'junior', 'senior', 'lead'
  total_trades INT DEFAULT 0,
  total_volume DECIMAL(18, 2) DEFAULT 0,
  total_pnl DECIMAL(18, 2) DEFAULT 0,
  win_rate DECIMAL(5, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
```sql
-- Admin Owner puede ver todo
CREATE POLICY "admin_owner_all" ON funds
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin_owner'
  );

-- Fund Manager solo ve sus fondos
CREATE POLICY "fund_manager_own" ON funds
  FOR ALL USING (
    manager_id = auth.uid()
  );

-- Investors solo ven fondos donde tienen shares
CREATE POLICY "investor_view" ON funds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_portfolios
      WHERE fund_id = funds.id
      AND user_id = auth.uid()
    )
  );
```

**Ejecutar migración:**
```bash
cd /root/miralabs-projects/naveo
npx supabase db push
```


---

### 📌 TAREA 6: Internacionalización (i18n) - Inglés y Español
**Asignado a:** Gemini
**Prioridad:** 🟡 ALTA
**Tiempo estimado:** 4-6 horas
**Archivos a modificar/crear:**
- `/frontend/src/i18n.ts` (nuevo)
- `/frontend/src/components/common/LanguageSwitcher.tsx` (nuevo)
- `/frontend/src/locales/en.json` (nuevo)
- `/frontend/src/locales/es.json` (nuevo)
- Múltiples componentes en `/frontend/src/pages`, `/frontend/src/portals`, `/frontend/src/components`

**Requisitos:**

#### Funcionalidades:
1.  **Configuración de i18next**
    - Instalar `i18next`, `react-i18next` y `i18next-browser-languagedetector`.
    - Crear archivo de configuración `i18n.ts` para inicializar i18next.
    - Configurar detección de idioma del navegador y fallback a 'es'.

2.  **Creación de archivos de traducción**
    - Crear archivos `en.json` y `es.json` en `/frontend/srcsrc/locales`.
    - Extraer todas las cadenas de texto (labels, títulos, mensajes) de los componentes a estos archivos JSON.
    - Organizar las traducciones en una estructura anidada por componente o página.

3.  **Integración en Componentes React**
    - Usar el hook `useTranslation` de `react-i18next` en todos los componentes que contengan texto.
    - Reemplazar texto estático con la función `t('key')`.
    - Ejemplo: `<h1>Portfolio</h1>` se convierte en `<h1>{t('portfolio.title')}</h1>`.

4.  **Componente de cambio de idioma**
    - Crear un componente `LanguageSwitcher` con botones o un dropdown para seleccionar "English" o "Español".
    - Colocar este componente en un lugar accesible, como el header de la aplicación.
    - Al cambiar de idioma, la UI debe actualizarse instantáneamente sin recargar la página.

5.  **Adaptación de Ant Design**
    - Usar `ConfigProvider` de Ant Design para traducir los textos por defecto de sus componentes (paginación, modales, etc.).
    - Importar los locales `en_US` y `es_ES` de `antd/lib/locale`.

**Pasos de implementación:**
1.  Instalar dependencias: `npm install i18next react-i18next i18next-browser-languagedetector`
2.  Crear la configuración inicial de i1next.
3.  Comenzar con la página de Login y extraer las cadenas de texto.
4.  Crear el `LanguageSwitcher` y agregarlo al layout principal.
5.  Ir migrando componente por componente, portal por portal.

**Métricas de éxito:**
- Toda la interfaz de usuario es traducible.
- El cambio de idioma funciona en tiempo real.
- Los componentes de Ant Design también se traducen.

---

## 📊 MÉTRICAS DE ÉXITO

Para considerar estas tareas completadas:

✅ **TAREA 1:** Assets Management funciona con CRUD completo
✅ **TAREA 2:** Portfolio Page muestra holdings y performance
✅ **TAREA 3:** BuySellModal tiene validaciones y steps
✅ **TAREA 4:** Traders Management permite gestionar traders
✅ **TAREA 5:** Schema de BD creado y migrado

**Testing manual:**
- Todas las páginas cargan sin errores
- Navegación funciona correctamente
- Modals abren y cierran bien
- Formularios validan correctamente
- Datos mock se muestran correctamente

---

## 🔧 COMANDOS ÚTILES

**Levantar servidor:**
```bash
cd /root/miralabs-projects/naveo/frontend
npm run dev
```

**Verificar compilación:**
```bash
npm run build
```

**Acceder a Supabase Studio:**
```
http://172.23.3.62:54323
```

**Ver logs del servidor:**
```bash
# Frontend
tail -f /root/miralabs-projects/naveo/frontend/.vite/vite.log

# Supabase
cd /root/miralabs-projects/naveo
npx supabase status
```

---

## 📁 ESTRUCTURA DE ARCHIVOS A SEGUIR

```
/portals/{portal-name}/
├── {Portal}Portal.tsx (solo rutas)
├── pages/
│   ├── DashboardPage.tsx
│   ├── {Feature}Page.tsx
│   └── index.ts (exports)
```

**Patrón de código a seguir:**
```typescript
// Siempre importar así
import { Card, Table, Button } from 'antd';
import { Icon } from '@ant-design/icons';
import { Component } from '@/components/common';

// Usar TypeScript
interface PageProps {
  // ...
}

export default function PageName() {
  // Mock data
  const data = [...];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)' }}>Title</h1>
      {/* Content */}
    </div>
  );
}
```

---

## 📞 COMUNICACIÓN

**Al completar cada tarea:**
1. Actualizar `PROGRESS_UPDATE.md`
2. Marcar como completada en este archivo
3. Crear commit descriptivo
4. Notificar progreso

**En caso de bloqueadores:**
1. Documentar el problema
2. Intentar solución alternativa
3. Crear issue si es necesario

---

## 🎯 OBJETIVO FINAL DEL SPRINT 2

Al finalizar estas 5 tareas:
- ✅ Gestión completa de assets implementada
- ✅ Portfolio de inversionista funcional
- ✅ Sistema de compra/venta mejorado
- ✅ Gestión de traders operativa
- ✅ Base de datos configurada

**Progreso esperado:** 37.5% → 55% (+17.5%)

---

**Asignado a:** Codex
**Revisado por:** Claude Code
**Fecha de entrega esperada:** 2025-11-12

---

## ✅ CHECKLIST DE TAREAS

- [x] TAREA 0: Login + Demo Access
- [x] TAREA 1: Assets Management Page
- [x] TAREA 2: Portfolio Page
- [x] TAREA 3: Mejorar BuySellModal
- [x] TAREA 4: Traders Management Page
- [x] TAREA 5: Conectar con Supabase
- [x] TAREA 6: Internacionalización (i18n)

**¡Éxito en el desarrollo, Gemini! 🚀**

---

## 🧭 ROADMAP TOKENIZACIÓN (FASES 3-5)

> Basado en `docs/TOKENIZATION_WORKFLOW.md` y el comparativo `docs/NAVEO_VS_ONION.md`. Estas tareas extienden el backlog hacia una experiencia completa Investment Banking → Investor y deberán reflejarse también en `docs/CODEX_TASKS_EXPANDED.md`.

| Fase | Objetivo IB | Entregables Plataforma | Dependencias |
|------|-------------|------------------------|--------------|
| 1. Origination & DD | Capturar oportunidades, ejecutar due diligence | Asset Pipeline, Due Diligence Tracker, Valuation Dashboard | Admin Owner portal |
| 2. Structuring & Tokenization | Diseñar estructura legal y smart contracts | Token Factory (ERC-1400), Document vault, Workflows de aprobación | Supabase schema + Token Studio |
| 3. Regulatory & Compliance | Cumplir KYC/KYB/AML | KYC tiers, KYB emisores, auditoría, policies RLS | Integración Persona / Supabase |
| 4. Marketing & Distribution | Preparar oferta primaria | Launchpad landing, data rooms, whitelist | CMS + Marketplace |
| 5. Investor Onboarding | Convertir leads en inversores | Flujos demo/login + KYC + wallet binding | LoginPage, BuySellModal |
| 6. Primary Subscription | Venta primaria tokenizada | Subscription forms, payment rails, allocations | Launchpad + Custody |
| 7. Settlement & Custody | Custodia y emisión | Wallet/custody ops, mint/burn logs | Blockchain layer |
| 8. Active Management | NAV, reporting, corporate actions | Fund Ops dashboard, NAV calculator, notifications | Admin Client portal |
| 9. Secondary Trading | Liquidez post-primaria | Matching engine, order book, AMM/pools | Edge Functions + Markets UI |
| 10. Redemption & Exit | Liquidez final | Redemption workflows, burn audit | Custody + Compliance |
| 11. Reporting & Tax | Regulatorio y fiscal | Statements, tax packages, audit trails | Reporting service |

### Tareas Clave por Fase

1. **Asset Origination & DD**
   - `AssetPipelinePage` con vistas Kanban, scoring y asignación de analistas.
   - `DueDiligenceChecklist` con adjuntos, versionado y exportables.
   - `ValuationModelService` (tablas Supabase + storage para modelos y memos).
2. **Structuring & Tokenization**
   - Extender schema con `tokens`, `tokenized_assets`, `legal_documents`.
   - “Structuring Studio” para definir supply, tranches, vesting, firmas legales.
   - Generador de smart contracts (templates ERC-1400/1155) + auditoría.
3. **Regulatory & Compliance**
   - KYC/KYB multinivel (Persona+Org) y policies `kyc_verifications`.
   - `system_events`, `user_notifications`, alertas de riesgo en Admin Owner.
4. **Marketing & Distribution**
   - Launchpad CMS: data room, timeline, whitelist y métricas de leads.
   - Integración CRM/email para nurture y scoring.
5. **Investor Onboarding**
   - Wizard (wallet connect → KYC → risk profiling → suitability test).
   - Persistir resultados en `user_profiles` y habilitar permisos dinámicos.
6. **Primary Subscription**
   - Subscription modal con flujos de aprobación y firmas digitales.
   - Payment rails fiat/crypto y registro en `transactions` + `allocations`.
7. **Settlement & Custody**
   - Operaciones de mint/burn + reconciliación vs. custodios.
   - Custody dashboard con estado de wallets y alerts.
8. **Active Management**
   - Calculadora NAV automatizada (feeds/oracles) y corporate actions.
   - Notificaciones segmentadas (dividendos, votaciones, informes).
9. **Secondary Market Trading**
   - Matching engine (Edge Function `matchOrders`), order book y AMM opcional.
   - Tablas `orders`, `liquidity_pools`, `user_staking` para mercados.
10. **Redemption & Exit**
    - Workflows de buyback/redemption, pagos y burn logs.
    - Comunicación automática al inversionista y compliance.
11. **Reporting & Tax**
    - Generador de statements (PDF/CSV), paquetes fiscales y APIs regulatorias.
    - Scheduler para reportes periódicos y alertas push.

Cada sub-módulo debe registrarse con owner, esfuerzo estimado y dependencias cruzadas con wallet-opcion/onion para asegurar que ambos roadmaps evolucionen sincronizados.
