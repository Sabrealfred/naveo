# Naveo - Plataforma Institucional Cripto: Tokenización, NAV System y Multiportal

## Stack Tecnológico

- **Frontend:** React + Refine Framework
- **Backend:** Supabase (Postgres + Auth + Storage + Realtime)
- **Integraciones:** Persona (KYC/KYB), Stripe/Transak (on/off ramp), Web3Modal, OneSignal, API CEX/DEX
- **Blockchain Ready:** EVM (Polygon/Ethereum, Diamond Proxy)

---

## Arquitectura Multiportal

### 1. Portal Admin (Dueño de Naveo)
- Visión total y control global de fondos/clientes
- Configuración integraciones, fees, usuarios y permisos
- Auditoría, logs y compliance globales
- Gestión de upgrades smart contract
- Reporting institucional/general

### 2. Portal Admin Cliente (Gestor del Fondo)
- Gestión fondos/portafolios propios, activos tokenizados
- Dashboards de NAV, reporting, compliance del fondo
- KYC/KYB y workflows internos de compliance
- Gestión de traders, officers y sub-admins fondo
- Exportaciones y reconciliación

### 3. Portal Cliente Final (Inversionista)
- Onboarding/KYC intuitivo
- Marketplace, portafolio personal
- Compra/venta activos tokenizados
- Visualización de NAV personal, histórico, notificaciones
- Descarga de reportes y estados de cuenta

---

## Funcionalidades Globales

- Onboarding multinivel
- Gestión de activos/tokenización
- Paneles de permisos y roles
- NAV y reporting segmentados
- Compliance y auditoría multinivel
- Notificaciones/alertas segmentadas

---

## Estructura Sugerida de Carpetas

- `/src/portals` (`admin-owner`, `admin-client`, `investor`)
- `/src/components`
- `/src/services`
- `/supabase/migrations`
- `/docs`

---

## Roadmap MVP

1. Roles y onboarding diferenciados
2. Dashboards multiportal
3. Gestión de activos y NAV por portal
4. Reporting e histórico por usuario/fondo
5. Auditoría, compliance y notificaciones

---

> Este README estructura “Naveo” para desplegar una solución institucional de cripto tokenización y gestión NAV avanzada, con jerarquía triple y enfoque profesional. Modular, escalable y listo para sprint sobre Refine + Supabase.
