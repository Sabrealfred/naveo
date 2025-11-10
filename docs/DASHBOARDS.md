# Naveo - Documentación de Dashboards

## Resumen

Los dashboards de Naveo están completamente desarrollados con componentes profesionales, gráficos interactivos, tablas de datos y navegación completa. Cada portal tiene funcionalidades específicas según el rol del usuario.

---

## 1. Portal Admin Owner (Super Admin)

**URL:** `http://localhost:5173/admin-owner`

### Características Principales

#### Métricas en Tiempo Real
- **AUM Total:** $105M con tendencia +12.5%
- **Fondos Activos:** 24 fondos con tendencia +8.3%
- **Clientes Totales:** 1,247 usuarios con tendencia +5.2%
- **Volumen 30 días:** $45.2M con tendencia +18.7%

#### Visualizaciones
- **Gráfico de Línea:** Evolución del AUM Total (11 meses)
- **Gráfico de Pie:** Distribución de Activos por tipo (BTC, ETH, Tokens, Stablecoins, Otros)

#### Tablas Interactivas
- **Fondos Activos:**
  - Columnas: Fondo, Gestor, AUM, NAV, Rendimiento 30d, Estado, Acciones
  - Funcionalidades: Ordenamiento, Ver detalles, Editar
  - 5 fondos de ejemplo con datos realistas

#### Panel de Actividad Reciente
- Registro de nuevos fondos
- Transacciones de alto volumen
- Actualizaciones de compliance
- Depósitos institucionales

#### Navegación Lateral
- Dashboard
- Gestión de Fondos
- Gestión de Clientes
- Usuarios y Permisos
- Integraciones (KYC/KYB, On/Off Ramp, Blockchain)
- Compliance y Auditoría
- Reporting
- Configuración

---

## 2. Portal Admin Client (Gestor de Fondo)

**URL:** `http://localhost:5173/admin-client`

### Características Principales

#### Métricas del Fondo
- **AUM:** $25.5M con tendencia +8.3%
- **NAV por Unidad:** $135.45 con tendencia +2.8%
- **Inversionistas:** 247 con tendencia +5.1%
- **Rendimiento YTD:** 35.45% con tendencia +12.3%

#### Alertas y Notificaciones
- Panel de alertas importantes (ej: 3 inversionistas pendientes de KYC)
- Botones de acción rápida

#### Visualizaciones
- **Evolución del NAV:** Gráfico de línea con 11 meses de datos
- **Distribución de Portafolio:** Pie chart (Bitcoin 40%, Ethereum 30%, DeFi 15%, Stablecoins 10%, NFTs 5%)

#### Top Holdings
Tabla detallada con:
- Avatar de color por activo
- Cantidad y precio actual
- Valor total en USD
- Porcentaje del portafolio con barra de progreso
- P&L 24h con indicadores visuales (subida/bajada)

Activos incluidos:
1. Bitcoin: 15.5 BTC ($653K, 40%, +3.5%)
2. Ethereum: 250 ETH ($562K, 30%, +5.2%)
3. Chainlink: 8,500 LINK ($131K, 15%, -1.8%)
4. USDC: 125,000 USDC ($125K, 10%, 0%)
5. Aave: 750 AAVE ($71K, 5%, +2.1%)

#### Nuevos Inversionistas
- Tabla con inversionistas recientes
- Información de inversión, NAV units, Estado KYC, Fecha
- Tags de estado con colores (Approved/Pending/Rejected)

#### Navegación
- Dashboard
- Mi Portafolio
- Sistema NAV
- Mis Inversionistas
- Equipo y Permisos (Traders, Compliance Officers, Sub-Admins)
- Transacciones
- Compliance
- Reportes

---

## 3. Portal Investor (Cliente Final)

**URL:** `http://localhost:5173/investor`

### Características Principales

#### Métricas Personales
- **Valor Total del Portafolio:** $150,000 con tendencia +15.5%
- **Ganancia Total:** $7,486.90 con tendencia +8.2%
- **Inversión Inicial:** $127,700
- **Rendimiento Total:** 17.8% con tendencia +3.2%

#### Acciones Rápidas
Botones prominentes para:
- Comprar Tokens
- Vender
- Depositar Fondos
- Ver Reportes

#### Visualizaciones
- **Evolución del Portafolio:** Gráfico de línea mostrando crecimiento de $100K a $150K
- **Distribución de Activos:** Pie chart con fondos y tokens

#### Mis Holdings
Tabla completa con:
- Avatar y tipo de activo (Fund Token / Asset Token)
- NAV Units y NAV Price
- Valor Total y Costo Base
- P&L en dólares y porcentaje con colores

Holdings incluidos:
1. Alpha Capital Fund: 450 units ($60.9K, +7.5%)
2. Beta Investments: 320 units ($31.5K, +5.0%)
3. Gamma Token: 1,200 units ($22.5K, +12.5%)
4. Delta Token: 800 units ($20.2K, -3.6%)

#### Marketplace
Lista de tokens disponibles para invertir:
- Epsilon Ventures: DeFi Fund (NAV $156.23, Min $10K, +18.5%, Riesgo Alto)
- Zeta Real Estate: Tokenized RE (NAV $203.67, Min $25K, +12.3%, Riesgo Medio)
- Theta Stable Fund: Conservative (NAV $76.14, Min $5K, +5.2%, Riesgo Bajo)

Cada token incluye:
- Avatar y descripción
- NAV y mínimo de inversión
- Performance y nivel de riesgo
- Botones "Invertir" y "Ver Detalles"

#### Navegación
- Dashboard
- Mi Portafolio
- Marketplace
- Transacciones (Comprar, Vender, Historial)
- Performance
- Reportes y Estados
- Mi Perfil

---

## Componentes Compartidos Creados

### 1. DashboardLayout
- Sidebar colapsable con logo Naveo
- Header con botón de colapsar, notificaciones (badge), y menú de usuario
- Soporte para menús multinivel
- Responsive design
- Usuario y rol en el header

### 2. StatCard
- Tarjeta de estadística con:
  - Título y valor
  - Prefijo/sufijo opcionales ($, %)
  - Tendencia (arriba/abajo) con porcentaje vs mes anterior
  - Icono personalizable con color
  - Loading state

### 3. PerformanceChart
- Gráfico de línea usando Ant Design Charts
- Área con gradiente
- Animaciones suaves
- Puntos interactivos
- Altura configurable

### 4. AssetDistribution
- Gráfico de dona (donut chart)
- Etiquetas internas con valores
- Estadística central
- Interacciones (hover, click)
- Colores automáticos

### 5. RecentActivity
- Lista de actividades con:
  - Avatares con iconos según tipo
  - Título y descripción
  - Timestamp relativo
  - Tags de estado (success/pending/failed)
  - Montos opcionales

---

## Stack Tecnológico Utilizado

### Core
- **React 18** - Framework principal
- **TypeScript** - Type safety
- **Vite** - Build tool y dev server
- **Ant Design 5** - UI Component library

### Visualizaciones
- **@ant-design/charts** - Gráficos (basado en G2Plot)
- **@ant-design/icons** - Iconografía completa
- **@ant-design/pro-components** - Componentes avanzados

### Navegación y Estado
- **React Router v6** - Routing
- **Refine** - Admin framework
- **@refinedev/supabase** - Data provider

---

## Características Implementadas

### Diseño
- ✅ Layout responsivo (mobile-first)
- ✅ Sidebar colapsable
- ✅ Tema consistente de colores
- ✅ Animaciones suaves
- ✅ Scrollbar personalizado
- ✅ Dark mode ready (estructura preparada)

### UX
- ✅ Hot Module Replacement (HMR)
- ✅ Loading states
- ✅ Tooltips informativos
- ✅ Badges y notificaciones
- ✅ Menús contextuales
- ✅ Dropdown de usuario

### Datos
- ✅ Tablas con ordenamiento
- ✅ Filtros y búsqueda (estructura)
- ✅ Paginación
- ✅ Métricas con tendencias
- ✅ Formatos de moneda
- ✅ Porcentajes y P&L

### Navegación
- ✅ Menús multinivel
- ✅ Active state en rutas
- ✅ Breadcrumbs ready
- ✅ Links internos
- ✅ Acciones rápidas

---

## Próximos Pasos Sugeridos

### Backend Integration
1. Conectar con Supabase real-time
2. Implementar autenticación por roles
3. Row Level Security (RLS) policies
4. API para cálculo de NAV
5. Webhooks para notificaciones

### Features Adicionales
1. **Modo oscuro:** Toggle theme
2. **Exportación:** PDF/Excel de reportes
3. **Gráficos avanzados:** Candlestick, heatmaps
4. **Filtros dinámicos:** Por fecha, activo, estado
5. **Búsqueda global:** Cmd+K / Ctrl+K
6. **Notificaciones real-time:** Socket.io o Supabase Realtime

### Integraciones
1. **KYC/KYB:** Persona API
2. **On/Off Ramp:** Stripe Connect, Transak
3. **Blockchain:** Web3Modal, Wagmi, Viem
4. **Notificaciones:** OneSignal push notifications
5. **Analytics:** Mixpanel o Amplitude

### Performance
1. Code splitting por portal
2. Lazy loading de componentes
3. Virtual scrolling para tablas grandes
4. Cache de consultas con React Query
5. Optimización de imágenes

---

## Comandos de Desarrollo

```bash
# Iniciar frontend
npm run dev:frontend

# Build para producción
cd frontend && npm run build

# Preview del build
cd frontend && npm run preview

# Lint
cd frontend && npm run lint
```

---

## Estructura de Archivos

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── StatCard.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── AssetDistribution.tsx
│   │   ├── RecentActivity.tsx
│   │   └── index.ts
│   └── layouts/
│       ├── DashboardLayout.tsx
│       └── index.ts
├── portals/
│   ├── admin-owner/
│   │   └── AdminOwnerPortal.tsx
│   ├── admin-client/
│   │   └── AdminClientPortal.tsx
│   └── investor/
│       └── InvestorPortal.tsx
├── services/
│   └── supabaseClient.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Soporte

Para preguntas o issues:
- Revisar la documentación de Ant Design: https://ant.design
- Revisar la documentación de Refine: https://refine.dev
- Logs del browser console para debugging
