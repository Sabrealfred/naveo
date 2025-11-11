# MIRALABS – High Level Product & Technical Roadmap (Resumen)

**Fuente:** `MIRALabs_Product-Techincal-Roadmap.pdf`  
**Periodo:** Q4 2025 – Q4 2027

---

## North-Star Outcomes
- **AUM Portability:** migrar cuentas legacy a mandatos tokenizados con custodia Anchorage.
- **Auditabilidad con Discreción:** mantener verificación on-chain sin exponer PII.
- **Strategy Velocity:** lanzar y escalar estrategias cuantitativas (Lidya, Quant Studio) como una “product factory”.
- **Unit Economics:** reducir OPEX automatizando subs/redemptions, reporting, compliance y rebalanceos.

### Macro Timeline
| Ventana | Hito |
|---------|------|
| Q4’25–Q1’26 | Fase I POC (Plume/Nest issuance + Securitize KYC, subs/redemptions, investor portal v0) |
| Q1–Q2’26 | Privacidad: zero-PII on-chain, attestations, auditoría externa |
| Q2–Q4’26 | Quant Studio + 3–5 estrategias, expansión Lidya |
| Q3’26–Q1’27 | SMA allocator, tax lots, client portal v1 |
| Q1–Q3’27 | Tokenización in-house v1, migración de un producto real |
| Q2–Q4’27 | AI rebalancer con rollout por fases |

### Presupuesto (Capex aproximado)
Total 2 años: **$3.19–5.70M** (incluye $0.74–1.34M para security/compliance/infra).  
Cada fase oscila entre $0.30M y $1.16M dependiendo de alcance.

---

## Roadmap por Fase

### Phase I – POC Rythm ⇄ Lidya RWA
- Integraciones: Anchorage (custody), Plume/Nest (issuance), Securitize (KYC/AML).
- Contratos: token permissioned, módulo subs/redemptions, oráculo NAV diario.
- KPI inicial: tiempo de funding ≤3 días (objetivo same-day), reconciliación T+0/T+1.

### Phase II – Privacy & Compliance Automation
- Zero-PII, privacy attestations, pruebas criptográficas de compliance.
- Reporting automatizado y reconciliaciones con firmas digitales.

### Phase III – Quant Studio & Strategy Velocity
- Launchpad para 3–5 estrategias cuant, adaptadores Lidya HFT.
- Pipelines de datos y monitoreo de risk/performance.

### Phase IV – SMA Allocator & Tax Lots
- Policy engine para cuentas segregadas (Anchorage).
- Motor de tax lots, rebalanceo drift-based, bulk ops vía API.

### Phase V – In-House Tokenization Stack
- Protocolos propios (permissioned token, transfer controls, corp actions).
- Registrar on/off-chain, issuer console, migración sin downtime.

### Phase VI – AI Rebalancer
- Señales multi-fuente (market, custody, macro, on-chain).
- Backtesting + inferencia online con control humano.
- KPIs: tracking error ↓≥20%, coste efectivo ↓≥15%.

### Workstreams Transversales
- Seguridad/auditorías continuas, legal/compliance multijurisdicción, SRE/observabilidad.

---

## Requerimientos Pendientes para Naveo
1. **Privacy attestations & zero-PII** – falta módulo de pruebas criptográficas.
2. **Quant Studio / Strategy Factory** – se necesita UI/backend para múltiples estrategias y adaptadores HFT.
3. **SMA scheduler + tax lot engine** – Admin Client carece de asignador SMA y cálculo fiscal.
4. **In-house tokenization** – ausencia de protocolo propio y consola de issuer.
5. **AI rebalancer** – no existe motor ML ni integración de señales.
6. **Security/compliance automation** – faltan pipelines de threat modeling, formal verification y runbooks.

> Registrar estos gaps en `docs/CODEX_TASKS_EXPANDED.md` (Sprints 11+).
