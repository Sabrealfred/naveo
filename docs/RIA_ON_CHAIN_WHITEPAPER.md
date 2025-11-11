# The On-Chain RIA – Hybrid Architecture (Resumen)

**Fuente:** `RIA - on chain - whitepaper.pdf`

---

## 1. Fundamentación Económica
- RIAs tradicionales = fricción operativa 30–50 bps AUM + onboarding 45–60 días.
- Opacidad genera riesgo agencia; tokenización crea contratos verificables.

## 2. Arquitectura Híbrida
| Capa | Función | Ledger | Implementación |
|------|---------|--------|----------------|
| Identity & Compliance | KYC/AML, clasificación | Permissioned | ONCHAINID, Hyperledger |
| Advisory Mandate Tokenization | ERC-3643 permisos | Público | Ethereum/Polygon L2 |
| Quant Vaults | Estrategias, NAV (ERC-4626) | Híbrido | Solidity + Python agents |
| Custodia MPC | Multi-party custody | Privado | Fireblocks/Copper |
| Oráculos & zk-Proofs | NAV y compliance proofs | Público | Chainlink, Circom |
| Anchoring & Audit | Merkle proofs, publicación | Público | Ethereum mainnet |

## 3. Requisitos Técnicos
- ERC-3643 + ERC-4626, OpenZeppelin governance.
- Quant bots Python/Rust + APIs.
- Feeds Pyth/Chainlink; BBDD cifradas para KYC.
- Gateway de compliance con zk-SNARKs.

## 4. Quant Layer
1. Vaults definen límites de exposición.
2. Agentes ejecutan en CEX/DEX.
3. NAV/PnL se reportan on-chain con pruebas.
4. Fee modules calculan management (1%) e incentive (10%).

## 5. Ecosistema
- Tokeny, Securitize, Polymath (tokenización/compliance).
- Fireblocks, Copper, Anchorage (custodia MPC).
- Enzyme, Sommelier, Drift (estrategias).
- EY, PwC, ConsenSys Diligence (auditoría). 
- Chainlink, Databricks, Vertex AI (data/AI).

## 6. Comparativa Tradicional vs Híbrido
| Métrica | Tradicional | On-chain |
|---------|-------------|----------|
| Operating Cost | 0.35% AUM | 0.10% AUM |
| Settlement | T+3/T+5 | Real-time |
| Transparency | Ex-post | Audit trail continuo |
| Liquidity | Ilíquida | Tokenizada |
| Compliance | Manual | Código |

## 7. Riesgos
- **Regulatorio:** wrappers específicos (US RIA, Lux, BVI).
- **Privacidad:** zk proofs + identidad permissioned.
- **Oráculos:** feeds redundantes.
- **Tech Governance:** multi-audit + formal verification.
- **Liquidez sintética:** límites de redención.

## 8. Beneficios Económicos
- Menos intermediación y más velocidad de capital.
- Transparencia en tiempo real → menor riesgo sistémico.
- Flujos programables (fees, buffers, compliance proofs).

---

## Requerimientos Pendientes para Naveo
1. **Ledger híbrido:** integrar capa permissioned (Hyperledger/ONCHAINID) para KYC/KYB.
2. **Stack ERC-3643/4626:** contratos reales de tokenización y vaults.
3. **Gateway de compliance con zk-proofs:** hoy solo policies/RLS.
4. **Quant execution layer:** agentes que interactúen con CEX/DEX y reporting de NAV.
5. **Custodia MPC institucional:** integrar Fireblocks/Copper/Anchorage.
6. **Proof-of-performance + fee modules:** automatizar management/performance fees.

Documentar estos pendientes en `docs/CODEX_TASKS_EXPANDED.md` (Sprints 11–12).
