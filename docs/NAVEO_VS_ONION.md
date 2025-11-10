# Naveo vs. Orium (Onion) – Capability Comparison

**Fecha:** 2025-11-10  
**Propósito:** Identificar módulos reutilizables y brechas funcionales entre el stack multiportal de **Naveo** y la plataforma **Orium/onion** para integrarlos en el roadmap de wallet-opcion.

---

## 1. Resumen Ejecutivo

| Dominio | Naveo (estado actual) | Orium/Onion (documentación) | Observaciones |
|---------|----------------------|-----------------------------|---------------|
| **Onboarding & Roles** | Login con demo roles, portales Admin Owner/Admin Client/Investor, mock RBAC. | Registro/login completo, KYC progresivo (niveles 0-3), MFA, wallets custodias/no custodia. | Aprovechar el flujo KYC + MFA de Orium para robustecer el login demo de Naveo y adoptar la gestión de wallets para el portal Investor. |
| **Gestión de Fondos/Activos** | Assets Management Page con CRUD mock y métricas; Supabase schema `funds`, `assets`. | Tablas para tokens, tokenized_assets, portfolio_components; procesos de tokenización/end-to-end. | Mapear tablas de Orium (tokens/launchpad) a la nueva DB Naveo para soportar activos reales y emisión. |
| **Portfolio & Investor UX** | PortfolioPage con holdings/analytics, BuySellModal mejorado. | Portfolio viewing 60% complete, staking, OTPs planificados. | Integrar el roadmap de OTPs y staking para expandir el portal Investor de Naveo. |
| **Trading / Market** | Aún no implementado. | Libro de órdenes, tipos de órdenes, settlement atómico, Edge Functions `matchOrders`. | Reutilizar la lógica de trading y tablas `orders/transactions` para la futura mesa de inversión de Naveo. |
| **Launchpad & Token Studio** | No contemplado. | Roadmap completo: due diligence, launchpad_projects, emission manager, compliance center. | Añadir módulo Launchpad en Naveo usando las especificaciones de Onion para fondos tokenizados. |
| **Traders & Team Ops** | TradersManagementPage con KPIs, invitación, performance mock. | Trader roles indirectos vía portfolios y staking, pero sin UI específica. | Mantener UI de Naveo y conectar con los datos reales de Orium (por ejemplo `user_staking`, `tokenized_portfolios`). |
| **Compliance & Notifications** | RLS inicial + Supabase policies básicas. | Centro de cumplimiento, eventos/notifications tables, workflows KYC/KYB completos. | Migrar las tablas `system_events`, `user_notifications`, `kyc_verifications` para auditoría en Naveo. |
| **Liquidity / Staking** | No hay módulos aún. | Pools de liquidez, staking pools, user_staking, AMM logic. | Estas funciones alimentan la futura wallet; conviene priorizar su adopción en ambos proyectos. |

---

## 2. Oportunidades de Reuso Inmediato

1. **Base de Datos**  
   - Extender `supabase/migrations/001_initial_schema.sql` con tablas de `profiles`, `kyc_verifications`, `tokens`, `orders`, `staking_pools`, etc. descritas en `docs/DB_ARCHITECTURE.md` de Onion.  
   - Reusar políticas RLS y triggers (`update_balances_after_transaction`) definidos en `docs/BACKEND_TECHNICAL_REQUIREMENTS.md`.

2. **Procesos de Negocio**  
   - Integrar los flujos de tokenización/launchpad (`docs/BACKEND_BUSINESS_LOGIC.md:104-137`) para permitir que los fondos de Naveo creen emisiones directamente desde la UI Admin Owner.  
   - Adoptar las reglas de trading y settlement (tipos de órdenes, price-time priority, circuit breakers) cuando desarrollemos el módulo de mercado en Naveo.

3. **Frontend & UX**  
   - Aprovechar los wireframes/componentes documentados en `docs/APP_DEV_ROADMAP.md` (dashboard, onboarding, admin console) para completar las secciones “Coming Soon” del Admin Client portal de Naveo.  
   - Mapear el flujo de onboarding (wallet connect + KYC + tour) al nuevo LoginPage para ofrecer experiencia similar a Orium.

---

## 3. Brechas y Acciones Recomendadas

| Brecha | Acción propuesta | Responsable sugerido |
|--------|------------------|----------------------|
| Falta de datos reales en Naveo | Importar seeds de Onion (tokens, portfolios, launchpad) y actualizar hooks (`fetchAssets`, `fetchTraders`). | Codex – Sprint 3 |
| Compliance avanzado | Añadir tablas/policies de `kyc_verifications`, `system_events`, `user_notifications` en Naveo. | Backend |
| Trading engine | Implementar Edge Functions `matchOrders`, `validateOrder` usando blueprint de Onion. | Backend / Supabase |
| Liquidez & staking | Portar `staking_pools`, `liquidity_pools` y las UIs relacionadas a la wallet. | Wallet team |
| Integración roadmap wallet | Adjuntar este documento al roadmap de wallet-opcion/onion y definir prioridades cruzadas. | PM / CXO |

---

## 4. Próximos Pasos

1. **Naveo**:  
   - Completar `supabase/seed.sql` con datos sincronizados de Onion.  
   - Cablear Assets/Traders/Portfolio a Supabase.  
   - Planificar módulo Launchpad usando el material de Token Studio.

2. **Wallet-Opción / Onion**:  
   - Incluir este comparativo en `docs/ROADMAP.md` para alinear fases futuras.  
   - Identificar qué componentes UI/DB se compartirán como librerías internas (ej. BuySellModal v2).

3. **PMO**:  
   - Crear una matriz RACI para los módulos comunes (onboarding, trading, compliance).  
   - Definir milestones compartidos entre Naveo y Onion para Q4 2025.

---

## 5. VINCULACIÓN CON EL FLUJO DE TOKENIZACIÓN

- Cada módulo listado arriba se alinea con las 11 fases descritas en `docs/TOKENIZATION_WORKFLOW.md`.  
- Las tareas resultantes deben documentarse en `docs/CODEX_TASKS.md` (resumen) y `docs/CODEX_TASKS_EXPANDED.md` (detalle Investment Banking).  
- Cuando Naveo incorpore un nuevo bloque (ej. Launchpad, Trading Engine, Staking), actualizar este comparativo para reflejar qué parte proviene de Onion y qué parte es desarrollo net-new.  
- Seeds y policies de Supabase deben mantenerse en espejo (`supabase/migrations` + `seed.sql`) para que QA pueda levantar ambos entornos y validar el flujo extremo a extremo.

---

**Nota:** Este documento es la referencia para sincronizar los planes de producto. Actualizarlo cada vez que se cierre un módulo clave en cualquiera de los dos proyectos.
