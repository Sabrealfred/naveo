# 🎯 MASTER - ASIGNACIÓN DE AGENTES

**Fecha de creación:** 2025-11-10 23:45 UTC
**Proyecto:** Naveo - Plataforma Institucional de Tokenización
**Estado actual:** Sprint 2 Completado (58% MVP) - Iniciando Sprint 3
**Branch:** `claude/complete-gemini-tasks-011CUzx22CXfSubMRA8zTH6L`

---

## 📋 VISIÓN GENERAL

Este documento define las responsabilidades y tareas específicas para **3 agentes especializados** que trabajarán en paralelo para completar el MVP de Naveo.

**Distribución:**
- **AGENTE 1 (UX/UI - Polish):** Frontend, i18n, componentes, UI/UX refinamiento
- **AGENTE 2 (UX/UI - Features):** Nuevas páginas, features complejas, flujos de usuario
- **AGENTE 3 (Backend - Data):** Supabase, APIs, base de datos, integración de datos

---

## 🎨 AGENTE 1: UX/UI POLISH SPECIALIST

**Nombre del agente:** Frontend-Polish
**Enfoque:** Refinamiento de UI/UX, internacionalización, componentes compartidos
**Prioridad:** 🔴 CRÍTICA
**Tiempo estimado:** 15-20 horas

---

### 📌 RESPONSABILIDADES PRINCIPALES

1. **Completar sistema de internacionalización (i18n)**
2. **Crear componentes compartidos reutilizables**
3. **Pulir UI/UX de páginas existentes**
4. **Implementar responsive design completo**
5. **Crear design system documentation**

---

### ✅ TAREAS ASIGNADAS

#### TAREA 1.1: Completar Internacionalización (i18n)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4-6 horas
**Estado actual:** 70% completado (dashboards principales listos)

**Archivos a modificar:**
- `/frontend/src/locales/en.json` (expandir)
- `/frontend/src/locales/es.json` (expandir)
- `/frontend/src/portals/admin-client/pages/AssetsManagementPage.tsx` (completar tabla y UI principal)
- `/frontend/src/portals/admin-client/pages/TradersManagementPage.tsx` (traducir completamente)
- `/frontend/src/portals/investor/pages/PortfolioPage.tsx` (completar traducciones)
- `/frontend/src/portals/investor/pages/MarketplacePage.tsx` (traducir)
- `/frontend/src/portals/investor/pages/TransactionsPage.tsx` (traducir)
- `/frontend/src/components/modals/BuySellModal.tsx` (traducir si falta)

**Requisitos:**
1. Traducir todas las páginas secundarias restantes
2. Añadir ~100+ nuevas claves de traducción para cubrir:
   - Tablas y columnas de AssetsManagementPage
   - TradersManagementPage completo
   - PortfolioPage completo
   - MarketplacePage
   - TransactionsPage
3. Asegurar que todos los mensajes de validación estén traducidos
4. Verificar interpolación de variables funciona en todos los contextos
5. Testear cambio de idioma en tiempo real en todas las páginas

**Checklist:**
- [ ] AssetsManagementPage: tabla y filtros traducidos
- [ ] TradersManagementPage: 100% traducido
- [ ] PortfolioPage: gráficos y tablas traducidos
- [ ] MarketplacePage: traducido
- [ ] TransactionsPage: traducido
- [ ] BuySellModal: traducido
- [ ] Validar en.json tiene ~350+ claves
- [ ] Validar es.json tiene ~350+ claves
- [ ] Test manual: cambiar idioma y verificar todas las páginas

---

#### TAREA 1.2: Componentes Compartidos Avanzados
**Prioridad:** 🟡 ALTA
**Tiempo:** 3-4 horas

**Archivos a crear:**
- `/frontend/src/components/common/AdvancedDataTable.tsx`
- `/frontend/src/components/common/FileUpload.tsx`
- `/frontend/src/components/common/MultiStepForm.tsx`
- `/frontend/src/components/cards/AssetCard.tsx`
- `/frontend/src/components/cards/FundCard.tsx`
- `/frontend/src/components/cards/PortfolioCard.tsx`

**Requisitos:**

**AdvancedDataTable:**
- Props: data, columns, filters, sorting, pagination
- Búsqueda global
- Filtros por columna
- Export to CSV/Excel
- Responsive design
- TypeScript types estrictos

**FileUpload:**
- Drag & drop
- Multiple files
- Preview (images, PDFs)
- Progress bar
- Validación de tipo y tamaño
- Integration con Supabase Storage

**MultiStepForm:**
- Generic multi-step wizard
- Progress indicator
- Validation por step
- Save & continue later
- Navegación next/prev/skip
- Mobile-friendly

**AssetCard/FundCard/PortfolioCard:**
- Visual cards para grid layouts
- Hover effects
- Quick actions
- Status badges
- Performance indicators
- Click to expand details

**Checklist:**
- [ ] AdvancedDataTable creado y documentado
- [ ] FileUpload creado con preview
- [ ] MultiStepForm funcional
- [ ] AssetCard, FundCard, PortfolioCard creados
- [ ] Exports en `/components/common/index.ts` y `/components/cards/index.ts`
- [ ] TypeScript types completos
- [ ] Storybook/ejemplos de uso (opcional)

---

#### TAREA 1.3: Responsive Design & Mobile Optimization
**Prioridad:** 🟡 ALTA
**Tiempo:** 3-4 horas

**Archivos a modificar:**
- Todos los archivos en `/frontend/src/portals/*/pages/*.tsx`
- `/frontend/src/components/layouts/DashboardLayout.tsx`
- `/frontend/src/index.css` (breakpoints)

**Requisitos:**
1. Verificar todas las páginas en breakpoints:
   - Mobile: 320px - 767px
   - Tablet: 768px - 1023px
   - Desktop: 1024px+
2. Ajustar grids de Ant Design (Row/Col) con responsive props
3. Ocultar/mostrar elementos según viewport
4. Menus colapsables en mobile
5. Tablas responsive (scroll horizontal o stacked cards)
6. Charts responsive (ajustar height/width)

**Páginas prioritarias:**
- DashboardPage (3 portales)
- AssetsManagementPage
- PortfolioPage
- MarketplacePage
- TradersManagementPage

**Checklist:**
- [ ] Sidebar colapsable en mobile
- [ ] Tablas con scroll horizontal < 768px
- [ ] Charts ajustados a viewport
- [ ] Buttons con tamaño apropiado para touch
- [ ] Forms con spacing adecuado en mobile
- [ ] Test en Chrome DevTools (mobile/tablet)

---

#### TAREA 1.4: UI Polish & Consistency
**Prioridad:** 🟡 ALTA
**Tiempo:** 2-3 horas

**Requisitos:**
1. **Spacing consistency:**
   - padding: 24px en todas las páginas
   - gutter: [16, 16] en todos los Row/Col
   - marginBottom: 24px entre secciones

2. **Typography:**
   - Headings: `fontFamily: 'var(--font-heading)'`
   - Body: sin override (usa Inter por defecto)
   - Monospace: código y addresses

3. **Colors:**
   - Usar variables de Ant Design theme
   - Success: green
   - Error: red
   - Warning: orange
   - Info: blue

4. **Loading States:**
   - Skeleton loaders en tablas
   - Spinning en modals
   - Disabled states consistentes

5. **Empty States:**
   - Empty component de Ant Design
   - Mensajes informativos
   - Call-to-action buttons

**Checklist:**
- [ ] Spacing consistency verificado
- [ ] Typography aplicado correctamente
- [ ] Loading states en todas las tablas
- [ ] Empty states en tablas sin datos
- [ ] Error boundaries implementados (opcional)

---

#### TAREA 1.5: Design System Documentation
**Prioridad:** 🟢 MEDIA
**Tiempo:** 2-3 horas

**Archivos a crear:**
- `/docs/DESIGN_SYSTEM.md`
- `/frontend/src/components/examples/` (carpeta con ejemplos)

**Contenido DESIGN_SYSTEM.md:**
1. **Typography Scale**
   - Headings (h1-h6)
   - Body text
   - Captions
   - Monospace

2. **Color Palette**
   - Primary colors
   - Semantic colors (success, error, warning)
   - Grays

3. **Spacing System**
   - 4px base unit
   - Spacing scale (8, 16, 24, 32, 48)

4. **Components Catalog**
   - StatCard
   - Charts
   - Tables
   - Modals
   - Forms
   - Cards

5. **Usage Guidelines**
   - When to use each component
   - Props documentation
   - Code examples

**Checklist:**
- [ ] DESIGN_SYSTEM.md creado
- [ ] Screenshots de componentes
- [ ] Ejemplos de código
- [ ] Guidelines de uso

---

### 📊 MÉTRICAS DE ÉXITO - AGENTE 1

Al completar todas las tareas:
- ✅ 100% de la UI traducida a inglés y español
- ✅ 6+ componentes compartidos reutilizables
- ✅ Responsive design en mobile/tablet/desktop
- ✅ UI consistente en todas las páginas
- ✅ Design system documentado

**Tiempo total estimado:** 15-20 horas
**Impacto en progreso:** +8-10% MVP

---

## 🎨 AGENTE 2: UX/UI FEATURES SPECIALIST

**Nombre del agente:** Frontend-Features
**Enfoque:** Nuevas páginas, flujos complejos, features de usuario
**Prioridad:** 🔴 CRÍTICA
**Tiempo estimado:** 20-25 horas

---

### 📌 RESPONSABILIDADES PRINCIPALES

1. **Implementar flujos de onboarding completos**
2. **Crear páginas de gestión KYC/KYB**
3. **Desarrollar dashboards de analytics**
4. **Implementar sistema de reportes**
5. **Crear centros de notificaciones**

---

### ✅ TAREAS ASIGNADAS

#### TAREA 2.1: Investor Onboarding Flow
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 5-6 horas
**Ref:** CODEX_TASKS_EXPANDED.md → TAREA 4.1

**Archivos a crear:**
- `/frontend/src/portals/investor/pages/OnboardingPage.tsx`
- `/frontend/src/components/onboarding/OnboardingWizard.tsx`
- `/frontend/src/components/onboarding/steps/AccountCreationStep.tsx`
- `/frontend/src/components/onboarding/steps/InvestorProfileStep.tsx`
- `/frontend/src/components/onboarding/steps/AccreditationStep.tsx`
- `/frontend/src/components/onboarding/steps/KYCVerificationStep.tsx`
- `/frontend/src/components/onboarding/steps/AMLScreeningStep.tsx`
- `/frontend/src/components/onboarding/steps/DocumentsStep.tsx`
- `/frontend/src/components/onboarding/steps/FundingSetupStep.tsx`

**Requisitos:**

**OnboardingWizard (7 pasos):**
1. Account Creation
2. Investor Profile (tipo de inversor, objetivos)
3. Accreditation Verification (income/net worth)
4. Identity Verification (KYC mock - simular Persona)
5. AML Screening (mock)
6. Subscription Documents (e-signature)
7. Funding Setup (payment methods)

**Features:**
- Progress tracker visual (Steps de Ant Design)
- % completion
- Save & continue later (localStorage)
- Validación por step
- Navigation prev/next
- Mobile-friendly
- Error handling
- Success screen al finalizar

**Mock KYC Integration:**
- Simular upload de ID
- Simular liveness check
- Auto-aprobar después de 3 segundos
- Guardar resultado en localStorage

**E-Signature:**
- Usar `react-signature-canvas`
- Capturar firma con mouse/touch
- Preview de documento
- Download PDF firmado (mock)

**Checklist:**
- [ ] OnboardingWizard con 7 steps funcional
- [ ] Cada step con validación
- [ ] Progress bar actualizado
- [ ] Save & continue later
- [ ] E-signature implementado
- [ ] Success screen
- [ ] Mobile responsive
- [ ] Integrado en `/investor/onboarding`

---

#### TAREA 2.2: KYC/AML Management (Admin Client)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 5-6 horas
**Ref:** CODEX_TASKS_EXPANDED.md → TAREA 4.3

**Archivos a crear:**
- `/frontend/src/portals/admin-client/pages/KYCAMLManagementPage.tsx`
- `/frontend/src/components/kyc/InvestorScreeningDashboard.tsx`
- `/frontend/src/components/kyc/KYCDetailsModal.tsx`
- `/frontend/src/components/kyc/AMLScreeningPanel.tsx`
- `/frontend/src/components/kyc/EDDWorkflow.tsx`

**Requisitos:**

**Investor Screening Dashboard:**
- Tabla de todos los KYC submissions
- Filtros: Status (Pending, Approved, Rejected, Needs Review)
- Filtros: Tier (1, 2, 3)
- Search por nombre/email
- Bulk actions (Approve/Reject multiple)

**KYC Details Modal:**
- Personal info display
- Document viewer (images/PDFs)
- Verification results
- AML screening results (mock)
- Decision buttons: Approve, Reject, Request More Info
- Comments section
- Activity timeline

**AML Screening (Mock):**
- PEP check (Politically Exposed Person)
- Sanctions lists (OFAC, UN, EU)
- Adverse media check
- Risk score calculation
- Visual risk indicator

**Enhanced Due Diligence (EDD):**
- Trigger rules (>$100k, PEP, High-risk country)
- Additional docs required checklist
- Manual review workflow
- Approval chain visualization

**Ongoing Monitoring:**
- Transaction monitoring rules
- Behavioral analysis (mock)
- Periodic review schedule
- Re-certification reminders

**Métricas Dashboard:**
- KYC completion rate
- Approval/rejection ratio
- Avg processing time
- Pending reviews count

**Checklist:**
- [ ] Screening dashboard con filtros
- [ ] KYC Details modal completo
- [ ] AML screening mock funcional
- [ ] EDD workflow implementado
- [ ] Métricas dashboard
- [ ] Bulk actions
- [ ] Activity timeline
- [ ] Integrado en `/admin-client/kyc-aml`

---

#### TAREA 2.3: Platform Analytics (Admin Owner)
**Prioridad:** 🟡 ALTA
**Tiempo:** 4-5 horas
**Ref:** STATUS_REPORT.md menciona que ya fue creado, pero necesita expansión

**Archivo a expandir:**
- `/frontend/src/portals/admin-owner/pages/PlatformAnalyticsPage.tsx`

**Requisitos de expansión:**

1. **Revenue Analytics:**
   - Revenue by fund
   - Revenue by fee type (management, performance, subscription)
   - MRR/ARR tracking
   - Revenue forecasting

2. **User Growth:**
   - New users trend
   - Active users (DAU/MAU)
   - User retention cohorts
   - Churn rate

3. **Transaction Analytics:**
   - Transaction volume trend
   - Average transaction size
   - Transaction by type breakdown
   - Failed transactions tracking

4. **Fund Performance:**
   - Best/worst performing funds
   - AUM distribution
   - NAV trends comparison
   - Investor concentration

5. **Compliance Metrics:**
   - KYC approval rate
   - Time to approval
   - Rejected submissions reasons
   - Pending reviews aging

6. **Filters Avanzados:**
   - Date range picker
   - Fund selector
   - Region filter
   - Export to PDF/Excel

**Checklist:**
- [ ] Revenue analytics charts
- [ ] User growth metrics
- [ ] Transaction analytics
- [ ] Fund performance comparison
- [ ] Compliance metrics
- [ ] Advanced filters
- [ ] Export functionality

---

#### TAREA 2.4: Investor Reporting Portal (Admin Client)
**Prioridad:** 🟡 ALTA
**Tiempo:** 4-5 horas
**Ref:** CODEX_TASKS_EXPANDED.md → TAREA 9.1

**Archivos a crear:**
- `/frontend/src/portals/admin-client/pages/InvestorReportingPage.tsx`
- `/frontend/src/components/reports/ReportGenerator.tsx`
- `/frontend/src/components/reports/ReportTemplateSelector.tsx`
- `/frontend/src/components/reports/DistributionManager.tsx`
- `/frontend/src/components/reports/ReportLibrary.tsx`

**Requisitos:**

**Report Generator:**
- Report type selector: Monthly Statement, Quarterly Letter, Annual Report, Custom
- Period selector (date range)
- Investor selector (All or specific investors)
- Template customization
- Preview before generate
- Generate button (mock PDF generation)

**Report Templates:**
- Monthly Statement template
- Quarterly Letter template
- Annual Report template
- Custom report builder (drag & drop sections)

**Distribution Manager:**
- Send via email (mock)
- Upload to investor portal
- Track delivery status (Sent, Opened, Downloaded)
- Resend option
- Bulk distribution

**Report Library:**
- All generated reports table
- Filter by type, period, investor
- Search functionality
- Download PDF
- Preview modal
- Delete old reports

**PDF Generation (Mock):**
- Use `jspdf` library
- Generate sample PDF with:
  - Cover page
  - Portfolio summary
  - Performance charts
  - Transaction history
  - Disclaimers

**Checklist:**
- [ ] Report generator con selectors
- [ ] Templates implementados
- [ ] Distribution manager
- [ ] Report library con filtros
- [ ] Mock PDF generation
- [ ] Email sending mock
- [ ] Delivery tracking
- [ ] Integrado en `/admin-client/reporting`

---

#### TAREA 2.5: Notifications Center (All Portals)
**Prioridad:** 🟢 MEDIA
**Tiempo:** 3-4 horas

**Archivos a crear:**
- `/frontend/src/components/notifications/NotificationsCenter.tsx`
- `/frontend/src/components/notifications/NotificationsList.tsx`
- `/frontend/src/components/notifications/NotificationItem.tsx`
- `/frontend/src/components/notifications/NotificationPreferences.tsx`

**Archivos a modificar:**
- `/frontend/src/components/layouts/DashboardLayout.tsx` (añadir bell icon)

**Requisitos:**

**NotificationsCenter:**
- Bell icon en header con badge count
- Dropdown panel al hacer click
- Lista de últimas 10 notificaciones
- "Mark all as read" button
- "View all" link → NotificationsList page

**NotificationsList Page:**
- Tabla de todas las notificaciones
- Filtros: Type, Status (Read/Unread), Date
- Mark as read/unread
- Bulk actions
- Delete notifications

**Notification Types:**
1. **Transacciones:**
   - "Buy order completed"
   - "Sell order completed"
   - "Deposit received"
   - "Withdrawal processed"

2. **KYC/Compliance:**
   - "KYC approved"
   - "KYC rejected"
   - "Additional documents required"
   - "Re-certification required"

3. **NAV Updates:**
   - "NAV updated"
   - "Monthly report available"

4. **System:**
   - "Maintenance scheduled"
   - "New feature available"

**NotificationPreferences:**
- Email notifications toggle
- Push notifications toggle (mock)
- Notification types preferences
- Frequency settings

**Mock Data:**
- Generate 20-30 mock notifications
- Mix of read/unread
- Different types and timestamps
- Store in localStorage

**Checklist:**
- [ ] Bell icon con badge en header
- [ ] Dropdown panel funcional
- [ ] NotificationsList page
- [ ] Filtros y búsqueda
- [ ] Mark as read/unread
- [ ] Notification preferences
- [ ] Mock data generator
- [ ] Integrado en DashboardLayout

---

### 📊 MÉTRICAS DE ÉXITO - AGENTE 2

Al completar todas las tareas:
- ✅ Onboarding flow completo para inversionistas
- ✅ Sistema KYC/AML management funcional
- ✅ Analytics expandido con 5+ secciones
- ✅ Investor reporting portal operativo
- ✅ Notifications center en todos los portales

**Tiempo total estimado:** 20-25 horas
**Impacto en progreso:** +12-15% MVP

---

## 🔧 AGENTE 3: BACKEND & DATA SPECIALIST

**Nombre del agente:** Backend-Data
**Enfoque:** Supabase, APIs, integración de datos, base de datos
**Prioridad:** 🔴 CRÍTICA
**Tiempo estimado:** 18-22 horas

---

### 📌 RESPONSABILIDADES PRINCIPALES

1. **Completar schema de Supabase**
2. **Crear seed data comprehensivo**
3. **Implementar servicios de API (supabaseClient)**
4. **Configurar RLS policies**
5. **Conectar páginas frontend con datos reales**

---

### ✅ TAREAS ASIGNADAS

#### TAREA 3.1: Completar Schema de Supabase
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4-5 horas
**Estado actual:** Schema inicial creado, necesita expansión

**Archivos a crear/modificar:**
- `/supabase/migrations/002_expanded_schema.sql`
- `/supabase/migrations/003_views_and_functions.sql`
- `/supabase/migrations/004_triggers_and_audit.sql`

**Requisitos 002_expanded_schema.sql:**

**Nuevas tablas:**

1. **kyc_verifications:**
```sql
CREATE TABLE kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  tier INT DEFAULT 1, -- 1, 2, 3
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, needs_review
  verification_type VARCHAR(50), -- individual, entity
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  documents JSONB, -- array of document URLs
  persona_inquiry_id VARCHAR(255), -- for Persona integration
  risk_score INT, -- 0-100
  pep_check BOOLEAN DEFAULT false,
  sanctions_check BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

2. **notifications:**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(50), -- transaction, kyc, nav, system
  title VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT false,
  link VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. **reports:**
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  report_type VARCHAR(50), -- monthly, quarterly, annual
  period_start DATE,
  period_end DATE,
  generated_by UUID REFERENCES auth.users(id),
  file_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'generating', -- generating, ready, sent
  sent_to UUID[], -- array of user IDs
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

4. **system_events (audit log):**
```sql
CREATE TABLE system_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100), -- user_login, transaction_created, nav_updated, etc.
  user_id UUID REFERENCES auth.users(id),
  fund_id UUID REFERENCES funds(id),
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

5. **nav_history:**
```sql
CREATE TABLE nav_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  nav DECIMAL(18, 2),
  total_shares BIGINT,
  total_aum DECIMAL(18, 2),
  calculation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Índices:**
```sql
CREATE INDEX idx_transactions_fund_date ON transactions(fund_id, created_at DESC);
CREATE INDEX idx_user_portfolios_user ON user_portfolios(user_id);
CREATE INDEX idx_assets_fund ON assets(fund_id);
CREATE INDEX idx_kyc_user_status ON kyc_verifications(user_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_nav_history_fund_date ON nav_history(fund_id, calculation_date DESC);
```

**Checklist 002:**
- [ ] kyc_verifications table
- [ ] notifications table
- [ ] reports table
- [ ] system_events table
- [ ] nav_history table
- [ ] Todos los índices creados
- [ ] Migration aplicada con `npx supabase db reset`

---

**Requisitos 003_views_and_functions.sql:**

**Views:**

1. **portfolio_holdings_view:**
```sql
CREATE VIEW portfolio_holdings_view AS
SELECT
  up.user_id,
  up.fund_id,
  f.name as fund_name,
  f.current_nav,
  up.shares,
  up.avg_purchase_price,
  (up.shares * f.current_nav) as current_value,
  ((f.current_nav - up.avg_purchase_price) / up.avg_purchase_price * 100) as return_percent
FROM user_portfolios up
JOIN funds f ON up.fund_id = f.id;
```

2. **fund_performance_view:**
```sql
CREATE VIEW fund_performance_view AS
SELECT
  f.id,
  f.name,
  f.current_nav,
  f.total_aum,
  COUNT(DISTINCT up.user_id) as total_investors,
  (SELECT COUNT(*) FROM transactions WHERE fund_id = f.id AND type = 'buy') as total_buy_transactions,
  (SELECT SUM(amount) FROM transactions WHERE fund_id = f.id) as total_transaction_volume
FROM funds f
LEFT JOIN user_portfolios up ON f.id = up.fund_id
GROUP BY f.id;
```

**Functions:**

1. **calculate_portfolio_value:**
```sql
CREATE OR REPLACE FUNCTION calculate_portfolio_value(p_user_id UUID)
RETURNS DECIMAL(18, 2) AS $$
  SELECT COALESCE(SUM(shares * current_nav), 0)
  FROM portfolio_holdings_view
  WHERE user_id = p_user_id;
$$ LANGUAGE SQL STABLE;
```

2. **get_nav_history:**
```sql
CREATE OR REPLACE FUNCTION get_nav_history(
  p_fund_id UUID,
  p_days INT DEFAULT 30
)
RETURNS TABLE (
  calculation_date DATE,
  nav DECIMAL(18, 2)
) AS $$
  SELECT calculation_date, nav
  FROM nav_history
  WHERE fund_id = p_fund_id
    AND calculation_date >= CURRENT_DATE - p_days
  ORDER BY calculation_date ASC;
$$ LANGUAGE SQL STABLE;
```

**Checklist 003:**
- [ ] portfolio_holdings_view
- [ ] fund_performance_view
- [ ] calculate_portfolio_value function
- [ ] get_nav_history function
- [ ] Migration aplicada

---

**Requisitos 004_triggers_and_audit.sql:**

**Triggers:**

1. **Audit log trigger:**
```sql
CREATE OR REPLACE FUNCTION log_system_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO system_events (event_type, user_id, fund_id, metadata)
  VALUES (
    TG_TABLE_NAME || '_' || TG_OP,
    NEW.user_id,
    NEW.fund_id,
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transactions_audit
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION log_system_event();
```

2. **Update timestamps:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER funds_updated_at
  BEFORE UPDATE ON funds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

3. **Update portfolio after transaction:**
```sql
CREATE OR REPLACE FUNCTION update_portfolio_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'buy' THEN
    INSERT INTO user_portfolios (user_id, fund_id, shares, avg_purchase_price)
    VALUES (NEW.user_id, NEW.fund_id, NEW.shares, NEW.nav_at_time)
    ON CONFLICT (user_id, fund_id) DO UPDATE
    SET
      shares = user_portfolios.shares + NEW.shares,
      avg_purchase_price = (
        (user_portfolios.shares * user_portfolios.avg_purchase_price + NEW.shares * NEW.nav_at_time) /
        (user_portfolios.shares + NEW.shares)
      );
  ELSIF NEW.type = 'sell' THEN
    UPDATE user_portfolios
    SET shares = shares - NEW.shares
    WHERE user_id = NEW.user_id AND fund_id = NEW.fund_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_update_portfolio
  AFTER INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_portfolio_after_transaction();
```

**Checklist 004:**
- [ ] log_system_event trigger
- [ ] update_updated_at triggers
- [ ] update_portfolio_after_transaction trigger
- [ ] Migration aplicada

---

#### TAREA 3.2: Seed Data Comprehensivo
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 3-4 horas

**Archivo a crear:**
- `/supabase/seed.sql`

**Requisitos:**

**1. Usuarios mock (usar auth.users):**
```sql
-- Admin Owner
-- Admin Client (2 fund managers)
-- Investors (10 usuarios)
-- Traders (5 usuarios)
```

**2. Fondos (3 fondos):**
```sql
-- Alpha Growth Fund (crypto focus)
-- Beta Stable Fund (stablecoin focus)
-- Gamma Yield Fund (DeFi focus)
```

**3. Assets (15-20 assets):**
```sql
-- BTC, ETH, USDC, USDT (stablecoins)
-- SOL, MATIC, LINK, UNI (altcoins)
-- Distribuidos entre los 3 fondos
```

**4. Traders (5 traders):**
```sql
-- Asignar a fondos
-- Con métricas: trades, volume, P&L, win_rate
```

**5. User Portfolios (10 inversionistas):**
```sql
-- Cada investor tiene holdings en 1-3 fondos
-- Shares variadas
-- Avg purchase price histórico
```

**6. Transactions (50-100 transacciones):**
```sql
-- Mix de buy, sell, deposit, withdraw
-- Distribuidas en últimos 6 meses
-- Status: completed y algunas pending
```

**7. NAV History (últimos 12 meses):**
```sql
-- Para cada fondo
-- 1 registro por día (últimos 365 días)
-- Tendencia creciente para Alpha, estable para Beta, volátil para Gamma
```

**8. KYC Verifications (10 registros):**
```sql
-- Para los 10 inversionistas
-- Mix de approved, pending, rejected
-- Diferentes tiers (1, 2, 3)
```

**9. Notifications (30-40 notificaciones):**
```sql
-- Para diferentes usuarios
-- Mix de read/unread
-- Diferentes tipos
```

**10. System Events (100+ eventos):**
```sql
-- Audit trail de actividades
-- user_login, transaction_created, nav_updated, etc.
```

**Script de ejecución:**
```bash
cd /home/user/naveo
npx supabase db reset --yes
# Migrations se aplican automáticamente
# Luego ejecutar seed:
psql $DATABASE_URL < supabase/seed.sql
```

**Checklist:**
- [ ] Usuarios mock creados
- [ ] 3 fondos creados
- [ ] 15-20 assets creados
- [ ] 5 traders creados
- [ ] 10 user portfolios
- [ ] 50-100 transactions
- [ ] NAV history (12 meses × 3 fondos)
- [ ] 10 KYC verifications
- [ ] 30-40 notifications
- [ ] 100+ system events
- [ ] Seed aplicado exitosamente

---

#### TAREA 3.3: Servicios de API (supabaseClient)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 5-6 horas

**Archivos a crear:**
- `/frontend/src/services/supabase.ts` (configuración)
- `/frontend/src/services/fundsService.ts`
- `/frontend/src/services/assetsService.ts`
- `/frontend/src/services/transactionsService.ts`
- `/frontend/src/services/portfolioService.ts`
- `/frontend/src/services/tradersService.ts`
- `/frontend/src/services/kycService.ts`
- `/frontend/src/services/notificationsService.ts`
- `/frontend/src/services/reportsService.ts`

**Requisitos supabase.ts:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Requisitos fundsService.ts:**
```typescript
export const fundsService = {
  getAll: async () => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
  create: async (data: CreateFundDto) => { /* ... */ },
  update: async (id: string, data: UpdateFundDto) => { /* ... */ },
  delete: async (id: string) => { /* ... */ },
  getPerformance: async (id: string) => { /* ... */ },
  getNAVHistory: async (id: string, days: number) => { /* ... */ },
};
```

**Requisitos assetsService.ts:**
```typescript
export const assetsService = {
  getByFund: async (fundId: string) => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
  create: async (data: CreateAssetDto) => { /* ... */ },
  update: async (id: string, data: UpdateAssetDto) => { /* ... */ },
  delete: async (id: string) => { /* ... */ },
  getPriceHistory: async (id: string) => { /* ... */ },
};
```

**Requisitos transactionsService.ts:**
```typescript
export const transactionsService = {
  getAll: async (filters?: TransactionFilters) => { /* ... */ },
  getByUser: async (userId: string) => { /* ... */ },
  getByFund: async (fundId: string) => { /* ... */ },
  create: async (data: CreateTransactionDto) => { /* ... */ },
  updateStatus: async (id: string, status: string) => { /* ... */ },
};
```

**Requisitos portfolioService.ts:**
```typescript
export const portfolioService = {
  getByUser: async (userId: string) => { /* ... */ },
  getHoldings: async (userId: string) => { /* ... */ },
  getTotalValue: async (userId: string) => { /* ... */ },
  getPerformance: async (userId: string, days: number) => { /* ... */ },
};
```

**Requisitos tradersService.ts:**
```typescript
export const tradersService = {
  getByFund: async (fundId: string) => { /* ... */ },
  getById: async (id: string) => { /* ... */ },
  create: async (data: CreateTraderDto) => { /* ... */ },
  update: async (id: string, data: UpdateTraderDto) => { /* ... */ },
  updateStatus: async (id: string, status: string) => { /* ... */ },
  getPerformance: async (id: string) => { /* ... */ },
};
```

**Requisitos kycService.ts:**
```typescript
export const kycService = {
  getAll: async (filters?: KYCFilters) => { /* ... */ },
  getByUser: async (userId: string) => { /* ... */ },
  create: async (data: CreateKYCDto) => { /* ... */ },
  approve: async (id: string, reviewedBy: string) => { /* ... */ },
  reject: async (id: string, reason: string, reviewedBy: string) => { /* ... */ },
  requestMoreInfo: async (id: string, message: string) => { /* ... */ },
};
```

**Requisitos notificationsService.ts:**
```typescript
export const notificationsService = {
  getByUser: async (userId: string) => { /* ... */ },
  markAsRead: async (id: string) => { /* ... */ },
  markAllAsRead: async (userId: string) => { /* ... */ },
  delete: async (id: string) => { /* ... */ },
  create: async (data: CreateNotificationDto) => { /* ... */ },
};
```

**Requisitos reportsService.ts:**
```typescript
export const reportsService = {
  getAll: async (filters?: ReportFilters) => { /* ... */ },
  getByFund: async (fundId: string) => { /* ... */ },
  create: async (data: CreateReportDto) => { /* ... */ },
  markAsSent: async (id: string, sentTo: string[]) => { /* ... */ },
};
```

**TypeScript Types:**
- Crear `/frontend/src/types/database.ts` con interfaces para todas las tablas
- Usar tipos generados de Supabase si es posible

**Error Handling:**
- Todas las funciones deben tener try/catch
- Retornar `{ data, error }` format
- Log errors a consola

**Checklist:**
- [ ] supabase.ts configurado
- [ ] fundsService completo
- [ ] assetsService completo
- [ ] transactionsService completo
- [ ] portfolioService completo
- [ ] tradersService completo
- [ ] kycService completo
- [ ] notificationsService completo
- [ ] reportsService completo
- [ ] Types en database.ts
- [ ] Error handling implementado

---

#### TAREA 3.4: Conectar Páginas con Datos Reales
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4-5 horas

**Páginas a conectar (orden de prioridad):**

1. **Admin Client Dashboard**
   - Usar `fundsService.getById()`
   - Usar `assetsService.getByFund()`
   - Usar `tradersService.getByFund()`
   - Usar `transactionsService.getByFund()`

2. **Investor Dashboard**
   - Usar `portfolioService.getByUser()`
   - Usar `portfolioService.getTotalValue()`
   - Usar `portfolioService.getPerformance()`
   - Usar `transactionsService.getByUser()`

3. **AssetsManagementPage**
   - Usar `assetsService.getByFund()`
   - Conectar CRUD operations a assetsService

4. **PortfolioPage**
   - Usar `portfolioService.getHoldings()`
   - Usar `portfolioService.getPerformance()`

5. **TradersManagementPage**
   - Usar `tradersService.getByFund()`
   - Conectar actions a tradersService

6. **TransactionsPage**
   - Usar `transactionsService.getByUser()` o `getByFund()`

**Patrón a seguir:**

```typescript
import { useEffect, useState } from 'react';
import { fundsService } from '../../../services/fundsService';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await fundsService.getById('fund-id');
    if (error) {
      setError(error);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  if (loading) return <Spin />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    // Render with real data
  );
}
```

**Checklist:**
- [ ] Admin Client Dashboard conectado
- [ ] Investor Dashboard conectado
- [ ] AssetsManagementPage conectado
- [ ] PortfolioPage conectado
- [ ] TradersManagementPage conectado
- [ ] TransactionsPage conectado
- [ ] Loading states implementados
- [ ] Error handling implementado
- [ ] No mock data restante en estas páginas

---

#### TAREA 3.5: RLS Policies Completas
**Prioridad:** 🟡 ALTA
**Tiempo:** 2-3 horas

**Archivo a crear:**
- `/supabase/migrations/005_complete_rls_policies.sql`

**Requisitos:**

**Políticas por tabla:**

1. **funds:**
```sql
-- Admin Owner puede ver todos
CREATE POLICY "admin_owner_funds_all" ON funds
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin_owner');

-- Fund Manager solo sus fondos
CREATE POLICY "fund_manager_own_funds" ON funds
  FOR ALL USING (manager_id = auth.uid());

-- Investors solo fondos donde tienen holdings
CREATE POLICY "investor_view_invested_funds" ON funds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_portfolios
      WHERE fund_id = funds.id AND user_id = auth.uid()
    )
  );
```

2. **assets:**
```sql
-- Admin Owner ve todos
CREATE POLICY "admin_owner_assets_all" ON assets
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin_owner');

-- Fund Manager ve assets de sus fondos
CREATE POLICY "fund_manager_own_assets" ON assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = assets.fund_id
      AND funds.manager_id = auth.uid()
    )
  );

-- Investors ven assets de fondos donde tienen holdings
CREATE POLICY "investor_view_assets" ON assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_portfolios
      WHERE fund_id = assets.fund_id AND user_id = auth.uid()
    )
  );
```

3. **transactions:**
```sql
-- Users ven solo sus transacciones
CREATE POLICY "users_own_transactions" ON transactions
  FOR ALL USING (user_id = auth.uid());

-- Fund Managers ven transacciones de sus fondos
CREATE POLICY "fund_manager_fund_transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = transactions.fund_id
      AND funds.manager_id = auth.uid()
    )
  );

-- Admin Owner ve todas
CREATE POLICY "admin_owner_transactions_all" ON transactions
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin_owner');
```

4. **user_portfolios:**
```sql
-- Users ven solo su portfolio
CREATE POLICY "users_own_portfolio" ON user_portfolios
  FOR ALL USING (user_id = auth.uid());

-- Fund Managers ven portfolios de sus fondos
CREATE POLICY "fund_manager_fund_portfolios" ON user_portfolios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = user_portfolios.fund_id
      AND funds.manager_id = auth.uid()
    )
  );

-- Admin Owner ve todos
CREATE POLICY "admin_owner_portfolios_all" ON user_portfolios
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin_owner');
```

5. **traders:**
```sql
-- Fund Managers gestionan sus traders
CREATE POLICY "fund_manager_own_traders" ON traders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = traders.fund_id
      AND funds.manager_id = auth.uid()
    )
  );

-- Admin Owner ve todos
CREATE POLICY "admin_owner_traders_all" ON traders
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin_owner');
```

6. **kyc_verifications:**
```sql
-- Users ven solo su KYC
CREATE POLICY "users_own_kyc" ON kyc_verifications
  FOR SELECT USING (user_id = auth.uid());

-- Admin Owner y Fund Managers pueden gestionar
CREATE POLICY "admin_kyc_management" ON kyc_verifications
  FOR ALL USING (
    auth.jwt() ->> 'role' IN ('admin_owner', 'admin_client')
  );
```

7. **notifications:**
```sql
-- Users ven solo sus notificaciones
CREATE POLICY "users_own_notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());
```

8. **reports:**
```sql
-- Fund Managers ven reportes de sus fondos
CREATE POLICY "fund_manager_own_reports" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM funds
      WHERE funds.id = reports.fund_id
      AND funds.manager_id = auth.uid()
    )
  );

-- Investors ven reportes de fondos donde tienen holdings
CREATE POLICY "investor_view_reports" ON reports
  FOR SELECT USING (
    auth.uid() = ANY(sent_to)
  );

-- Admin Owner ve todos
CREATE POLICY "admin_owner_reports_all" ON reports
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin_owner');
```

**Enable RLS:**
```sql
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE traders ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_history ENABLE ROW LEVEL SECURITY;
```

**Checklist:**
- [ ] Policies para funds
- [ ] Policies para assets
- [ ] Policies para transactions
- [ ] Policies para user_portfolios
- [ ] Policies para traders
- [ ] Policies para kyc_verifications
- [ ] Policies para notifications
- [ ] Policies para reports
- [ ] RLS enabled en todas las tablas
- [ ] Migration aplicada
- [ ] Testeo con diferentes roles

---

### 📊 MÉTRICAS DE ÉXITO - AGENTE 3

Al completar todas las tareas:
- ✅ Schema de BD completo con 10+ tablas
- ✅ Seed data con 100+ registros
- ✅ 9 servicios de API funcionando
- ✅ 6+ páginas conectadas a datos reales
- ✅ RLS policies completas y testeadas

**Tiempo total estimado:** 18-22 horas
**Impacto en progreso:** +15-18% MVP

---

## 🚀 EJECUCIÓN Y COORDINACIÓN

### Orden de Ejecución Recomendado

**SEMANA 1:**
- **Día 1-2:** AGENTE 3 (TAREA 3.1, 3.2, 3.5) - Setup de BD completo
- **Día 2-3:** AGENTE 1 (TAREA 1.1, 1.2) - i18n y componentes
- **Día 3-4:** AGENTE 2 (TAREA 2.1, 2.2) - Onboarding y KYC

**SEMANA 2:**
- **Día 1-2:** AGENTE 3 (TAREA 3.3, 3.4) - Servicios y conexión
- **Día 2-3:** AGENTE 1 (TAREA 1.3, 1.4, 1.5) - Responsive y polish
- **Día 3-4:** AGENTE 2 (TAREA 2.3, 2.4, 2.5) - Analytics y reporting

**TOTAL:** 10-12 días de desarrollo

---

### Dependencias entre Agentes

**AGENTE 2 depende de AGENTE 3:**
- TAREA 2.2 (KYC Management) necesita TAREA 3.1 (kyc_verifications table)
- TAREA 2.4 (Reporting) necesita TAREA 3.1 (reports table)
- TAREA 2.5 (Notifications) necesita TAREA 3.1 (notifications table)

**AGENTE 1 depende de AGENTE 2:**
- TAREA 1.1 (i18n) necesita que AGENTE 2 complete nuevas páginas para traducirlas

**Recomendación:** AGENTE 3 debe comenzar primero, luego AGENTE 2, y finalmente AGENTE 1 para polish.

---

### Comunicación y Sincronización

**Al completar cada tarea:**
1. Actualizar `docs/PROGRESS_UPDATE.md`
2. Crear commit con mensaje descriptivo
3. Push a branch `claude/complete-gemini-tasks-011CUzx22CXfSubMRA8zTH6L`
4. Notificar en este documento (añadir ✅ al checkbox)

**Reuniones de sincronización:**
- **Checkpoint 1:** Después de completar setup de BD (fin AGENTE 3 TAREA 3.1-3.2)
- **Checkpoint 2:** Después de conectar datos reales (fin AGENTE 3 TAREA 3.3-3.4)
- **Checkpoint 3:** Antes de deploy final

---

## 📊 MÉTRICAS GENERALES

### Estado Actual (Antes de iniciar)
- **Progreso MVP:** 58%
- **Páginas completadas:** 22/40 (55%)
- **i18n:** 70% completado
- **BD:** Schema inicial, sin seed data
- **Conexión a BD:** 0% (todo es mock data)

### Estado Esperado (Después de completar)
- **Progreso MVP:** 90-95%
- **Páginas completadas:** 35-38/40 (87-95%)
- **i18n:** 100% completado
- **BD:** Schema completo, seed data completo
- **Conexión a BD:** 80-90%

### Impacto por Agente
- **AGENTE 1:** +8-10% MVP
- **AGENTE 2:** +12-15% MVP
- **AGENTE 3:** +15-18% MVP
- **TOTAL:** +35-43% MVP

---

## ✅ CHECKLIST FINAL

**AGENTE 1 (UX/UI Polish):**
- [ ] i18n 100% completado (350+ claves)
- [ ] 6+ componentes compartidos creados
- [ ] Responsive design verificado
- [ ] UI consistency aplicado
- [ ] Design system documentado

**AGENTE 2 (UX/UI Features):**
- [ ] Onboarding flow completado
- [ ] KYC/AML management implementado
- [ ] Platform analytics expandido
- [ ] Investor reporting portal creado
- [ ] Notifications center en todos los portales

**AGENTE 3 (Backend Data):**
- [ ] 5 migrations aplicadas (002-006)
- [ ] Seed data con 200+ registros
- [ ] 9 servicios de API creados
- [ ] 6+ páginas conectadas a BD
- [ ] RLS policies completas

---

## 📝 NOTAS IMPORTANTES

### Para AGENTE 1 (Frontend-Polish):
- **Prioridad:** Calidad sobre velocidad
- **Foco:** Experiencia de usuario excepcional
- **Testing:** Probar en mobile, tablet y desktop
- **i18n:** Usar Figma/diseños como referencia si están disponibles

### Para AGENTE 2 (Frontend-Features):
- **Prioridad:** Features funcionales completas
- **Foco:** Flujos de usuario end-to-end
- **Testing:** Probar todos los steps de flujos multi-paso
- **UX:** Considerar edge cases y errores

### Para AGENTE 3 (Backend-Data):
- **Prioridad:** Integridad de datos
- **Foco:** Schema robusto y servicios confiables
- **Testing:** Probar con diferentes roles (RLS)
- **Performance:** Usar índices apropiados

---

## 🎯 OBJETIVO FINAL

**Al completar todas las tareas de los 3 agentes:**

✅ Naveo MVP estará 90-95% completado
✅ Todas las páginas principales estarán conectadas a datos reales
✅ Sistema de internacionalización completo (inglés/español)
✅ UI/UX pulido y responsive
✅ Flujos completos de onboarding, KYC, reporting
✅ Base de datos robusta con seed data
✅ RLS policies implementadas

**Resultado:** Plataforma lista para QA exhaustivo y demo a stakeholders.

---

**Documento creado por:** Claude Code
**Para:** Equipo de desarrollo Naveo
**Fecha:** 2025-11-10 23:45 UTC
**Versión:** 1.0

---

## 📍 UBICACIÓN DE ESTE DOCUMENTO

**Path:** `/home/user/naveo/docs/MASTER_AGENT_ASSIGNMENTS.md`

**Para asignar tareas a cada agente:**

```bash
# AGENTE 1 (Frontend-Polish)
cat /home/user/naveo/docs/MASTER_AGENT_ASSIGNMENTS.md | grep -A 200 "AGENTE 1: UX/UI POLISH"

# AGENTE 2 (Frontend-Features)
cat /home/user/naveo/docs/MASTER_AGENT_ASSIGNMENTS.md | grep -A 200 "AGENTE 2: UX/UI FEATURES"

# AGENTE 3 (Backend-Data)
cat /home/user/naveo/docs/MASTER_AGENT_ASSIGNMENTS.md | grep -A 200 "AGENTE 3: BACKEND & DATA"
```

🚀 **¡Listos para ejecutar!**
