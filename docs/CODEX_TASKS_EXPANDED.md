# 🤖 CODEX - TAREAS EXPANDIDAS (Investment Banking Flow)

**Documento base:** TOKENIZATION_WORKFLOW.md
**Fecha:** 2025-11-10
**Versión:** 2.0 - Flujo Completo de Tokenización

---

## 📋 CONTEXTO

Basado en el flujo completo de investment banking para tokenización, estas son las tareas priorizadas para implementar el sistema end-to-end.

**Stack Técnico:**
- Frontend: React 18 + TypeScript + Vite + Ant Design
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Blockchain: Ethereum/Polygon (Smart Contracts)
- Charts: @ant-design/charts
- Forms: Ant Design + React Hook Form

---

## 🎯 SPRINT 3: ASSET ORIGINATION & STRUCTURING

### TAREA 3.1: Asset Pipeline Dashboard (Admin Owner)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 3 horas
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/AssetPipelinePage.tsx`

**Funcionalidades:**

1. **Kanban Board de Oportunidades**
   - Columnas: Sourcing → Evaluation → Due Diligence → Approved → Rejected
   - Drag & drop entre etapas
   - Color coding por priority (High, Medium, Low)

2. **Asset Cards**
   - Asset name, class, estimated value
   - Source channel tag
   - Assigned analyst avatar
   - Target closing date
   - Quick actions: View Details, Assign, Move Stage

3. **Filtros y Búsqueda**
   - Por asset class
   - Por stage
   - Por analyst
   - Por priority
   - Date range

4. **Métricas Dashboard**
   - Total opportunities
   - Avg time per stage
   - Conversion rate
   - Value in pipeline

5. **Modal: Asset Details**
   - Full information form
   - Document attachments
   - Activity timeline
   - Comments section

**Data Model:**
```typescript
interface AssetOpportunity {
  id: string;
  name: string;
  assetClass: 'crypto' | 'real-estate' | 'commodities' | 'securities';
  sourceChannel: 'broker' | 'direct' | 'marketplace' | 'referral';
  estimatedValue: number;
  potentialYield: number;
  stage: 'sourcing' | 'evaluation' | 'due-diligence' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  assignedAnalyst: string;
  sourcingDate: Date;
  targetClosing: Date;
  documents: string[];
  notes: string;
}
```

---

### TAREA 3.2: Due Diligence Tracker (Admin Owner)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/DueDiligencePage.tsx`

**Funcionalidades:**

1. **DD Checklist System**
   - Hierarchical checklist (Categories → Items)
   - Progress tracking per category
   - Assignee per item
   - Due dates
   - Status: Not Started, In Progress, Completed, Blocked

2. **Categories:**
   - Financial Analysis (10 items)
   - Legal Review (8 items)
   - Technical Assessment (6 items)
   - Market Analysis (7 items)
   - Operational DD (5 items)

3. **Document Repository**
   - Upload documents per checklist item
   - Version control
   - Preview (PDF, Excel)
   - Download all as ZIP

4. **Risk Assessment Matrix**
   - Risk categories (Financial, Legal, Market, Operational, Technical)
   - Risk rating (Low, Medium, High, Critical)
   - Mitigation strategies
   - Overall risk score calculation

5. **DD Report Generator**
   - Auto-generate PDF report
   - Include all completed items
   - Risk summary
   - Recommendations
   - Sign-off section

**Components:**
```typescript
import { Checkbox, Progress, Upload, Tag, Timeline, Table } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
```

---

### TAREA 3.3: Product Structuring Studio (Admin Owner)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 5 horas
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/ProductStructuringPage.tsx`

**Funcionalidades:**

1. **Product Type Selector**
   - Fund (Open-end, Closed-end)
   - SPV (Special Purpose Vehicle)
   - Note (Debt instrument)
   - Direct Token

2. **Terms Builder (Multi-step Form)**
   - Step 1: Basic Info (Name, Description, Type)
   - Step 2: Economic Terms (Min/Max investment, Target raise, Hard cap)
   - Step 3: Fee Structure
   - Step 4: Waterfall Structure
   - Step 5: Liquidity Terms
   - Step 6: Governance

3. **Fee Structure Configurator**
   - Management fee slider (0-3% annual)
   - Performance fee slider (0-30%)
   - Hurdle rate input
   - High water mark toggle
   - Subscription/Redemption fees
   - Early redemption penalty

4. **Waterfall Builder**
   - Visual tier builder
   - Drag & drop tiers
   - LP/GP share allocation per tier
   - Auto-calculate based on returns
   - Waterfall simulation chart

5. **Document Generator**
   - Generate Term Sheet (PDF)
   - Generate PPM outline
   - Generate Subscription Agreement template
   - Download all as package

**Advanced Features:**
- Comparison tool (compare 2-3 structures side-by-side)
- Templates library (save and reuse structures)
- Scenario modeling (show investor returns under different scenarios)

---

### TAREA 3.4: Smart Contract Factory (Admin Owner)
**Prioridad:** 🟡 ALTA
**Tiempo:** 6 horas (complejo)
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/SmartContractFactoryPage.tsx`

**Funcionalidades:**

1. **Template Selector**
   - ERC-20 (Basic fungible token)
   - ERC-1400 (Security token with partitions)
   - ERC-3643 (T-REX - Permissioned transfer)
   - Custom template

2. **Contract Parameters Form**
   - Token name
   - Token symbol
   - Decimals
   - Max supply
   - Issuer address
   - Compliance module address
   - Transfer restrictions

3. **Transfer Restrictions Builder**
   - Whitelist management
   - Lock-up periods
   - Transfer limits
   - Geographic restrictions
   - Accreditation requirements

4. **Code Preview**
   - Live Solidity code preview
   - Syntax highlighting
   - Copy to clipboard
   - Download .sol file

5. **Testing Suite**
   - Deploy to testnet
   - Mint test tokens
   - Test transfers
   - Test restrictions
   - View events

6. **Audit Request**
   - Submit to auditor (Certik, Quantstamp, OpenZeppelin)
   - Track audit status
   - View audit report
   - Fix vulnerabilities

**Technical:**
```typescript
// Use CodeMirror for code editing
import CodeMirror from '@uiw/react-codemirror';
import { solidity } from '@replit/codemirror-lang-solidity';

// Web3 for deployment
import { useWeb3React } from '@web3-react/core';
```

---

## 🎯 SPRINT 4: INVESTOR ONBOARDING & KYC

### TAREA 4.1: Investor Onboarding Flow (Investor Portal)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/investor/pages/OnboardingPage.tsx`

**Funcionalidades:**

1. **Multi-Step Wizard (7 steps)**
   - Step 1: Account Creation
   - Step 2: Investor Profile
   - Step 3: Accreditation Verification
   - Step 4: Identity Verification (KYC)
   - Step 5: AML Screening
   - Step 6: Subscription Documents
   - Step 7: Funding Setup

2. **Progress Tracker**
   - Visual stepper showing current step
   - % completion
   - Estimated time remaining
   - Save & continue later

3. **Step 3: Accreditation Verification**
   - Radio buttons for accreditation type:
     - Income-based ($200k+ individual)
     - Net worth-based ($1M+)
     - Professional certification
     - Entity-based
   - Document upload per type
   - Verification status

4. **Step 4: KYC Integration**
   - Iframe embed of Persona verification
   - Real-time status updates
   - ID document capture
   - Liveness check
   - Address proof upload

5. **Step 6: E-Signature**
   - Document preview
   - E-signature capture (mouse/touch)
   - Download signed documents
   - Timestamp and IP logging

**Components:**
```typescript
import { Steps, Form, Upload, Radio, Button, Result } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';
```

---

### TAREA 4.2: Suitability Questionnaire (Investor Portal)
**Prioridad:** 🟡 ALTA
**Tiempo:** 2 horas
**Archivos:**
- `/frontend/src/portals/investor/pages/SuitabilityQuestionnairePage.tsx`

**Funcionalidades:**

1. **Risk Tolerance Quiz (10 questions)**
   - Multiple choice questions
   - Scenario-based questions
   - Auto-score calculation
   - Risk category assignment

2. **Investment Experience Section**
   - Years investing
   - Asset classes experienced
   - Derivatives knowledge
   - Professional experience

3. **Financial Situation Form**
   - Annual income range
   - Net worth range
   - Liquid net worth
   - Investment objective
   - Investment horizon
   - Liquidity needs

4. **Scoring Engine**
   - Weighted scoring algorithm
   - Suitability score (0-100)
   - Category: Conservative, Moderate, Aggressive

5. **Recommendations**
   - Suitable products highlighted
   - Max allocation percentage
   - Risk warnings
   - Required disclosures

6. **PDF Report Generation**
   - Generate suitability report
   - Include all answers
   - Score and recommendations
   - E-signature

---

### TAREA 4.3: KYC/AML Management System (Admin Owner)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 5 horas
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/KYCAMLManagementPage.tsx`

**Funcionalidades:**

1. **Investor Screening Dashboard**
   - List of all investor KYC submissions
   - Status filter (Pending, Approved, Rejected, Needs Review)
   - Tier filter (Tier 1, 2, 3)
   - Search by name/email

2. **KYC Details Modal**
   - Personal information
   - ID documents viewer
   - Verification results
   - AML screening results
   - Decision buttons (Approve, Reject, Request More Info)

3. **AML Screening Integration**
   - PEP (Politically Exposed Person) check
   - Sanctions list check (OFAC, UN, EU)
   - Adverse media check
   - Source of wealth verification

4. **Enhanced Due Diligence (EDD)**
   - Trigger criteria (> $100k, PEP, High-risk country)
   - Additional documents required
   - Manual review workflow
   - Approval chain

5. **Ongoing Monitoring**
   - Transaction monitoring rules
   - Behavioral analysis
   - Periodic review schedule (12 months)
   - Re-certification reminders

6. **Reports**
   - KYC completion rate
   - Approval/rejection ratio
   - Avg processing time
   - Compliance audit trail

**Integration:**
```typescript
// Mock API calls to KYC provider
const checkPEP = async (name: string) => { /* ... */ };
const checkSanctions = async (name: string) => { /* ... */ };
const verifyDocument = async (documentId: string) => { /* ... */ };
```

---

## 🎯 SPRINT 5: PRIMARY MARKET & SUBSCRIPTION

### TAREA 5.1: Subscription Workflow (Investor Portal)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/investor/pages/SubscriptionWorkflowPage.tsx`

**Funcionalidades:**

1. **Fund Selection**
   - Browse available funds
   - Fund details modal
   - Compare funds side-by-side
   - Add to cart

2. **Investment Calculator**
   - Amount input
   - Share class selector (A, B, C)
   - Auto-calculate:
     - Gross amount
     - Subscription fee
     - Net amount
     - Estimated shares
     - Estimated tokens

3. **Payment Method Selection**
   - Wire transfer
   - Crypto transfer (USDC, USDT, ETH)
   - Show instructions based on selection

4. **Wire Transfer Flow**
   - Display bank details
   - Unique reference number
   - Copy to clipboard buttons
   - Upload proof of transfer
   - Track payment status

5. **Crypto Transfer Flow**
   - Generate deposit address (QR code)
   - Show network (Ethereum/Polygon)
   - Minimum confirmations required
   - Real-time confirmation tracker
   - Automatic detection on-chain

6. **Status Tracking**
   - Step 1: Payment Pending
   - Step 2: Payment Received
   - Step 3: NAV Strike
   - Step 4: Token Issuance
   - Step 5: Completed

7. **Confirmation**
   - Confirmation number
   - Final shares allocated
   - Final tokens received
   - Download confirmation PDF
   - View in portfolio

**Real-time Updates:**
```typescript
// WebSocket or polling for status updates
useEffect(() => {
  const interval = setInterval(() => {
    checkSubscriptionStatus(subscriptionId);
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

---

### TAREA 5.2: Subscription Calendar & Windows (Admin Client)
**Prioridad:** 🟡 ALTA
**Tiempo:** 2 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/SubscriptionCalendarPage.tsx`

**Funcionalidades:**

1. **Calendar View**
   - Month/Week view
   - Highlight subscription windows
   - Color coding (Open, Closed, Upcoming)
   - Click date for details

2. **Upcoming Deadlines**
   - Next subscription deadline
   - Next NAV strike date
   - Next settlement date
   - Next redemption deadline

3. **Subscription Window Configuration**
   - Frequency (Daily, Weekly, Monthly, Quarterly)
   - Cutoff time
   - NAV calculation time
   - Settlement period (T+2, T+3)

4. **Market Holidays Calendar**
   - US market holidays
   - Custom fund holidays
   - Auto-adjust subscription dates

5. **Notifications**
   - Email reminders before deadlines
   - SMS alerts
   - In-app notifications

---

### TAREA 5.3: Capital Call Management (Admin Client)
**Prioridad:** 🟡 ALTA (para Closed-End Funds)
**Tiempo:** 3 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/CapitalCallPage.tsx`

**Funcionalidades:**

1. **Create Capital Call**
   - Call number (auto-increment)
   - Call date
   - Due date
   - Purpose
   - Total amount to call
   - % of commitment

2. **Investor Allocations**
   - Auto-calculate per investor based on commitment
   - Editable allocations
   - Preview table before sending

3. **Send Capital Call Notices**
   - Bulk email to all investors
   - PDF notice generation
   - Wire instructions included

4. **Payment Tracking**
   - Mark as paid
   - Upload payment proof
   - Track defaults
   - Calculate penalties

5. **Dashboard Metrics**
   - Total due
   - Total received
   - % collected
   - Outstanding amount
   - Default rate

---

## 🎯 SPRINT 6: ACTIVE MANAGEMENT & NAV

### TAREA 6.1: NAV Calculation Engine (Admin Client) ✅
**Status:** YA COMPLETADO por Claude
**Página:** `/admin-client/pages/NAVSystemPage.tsx`

---

### TAREA 6.2: Portfolio Rebalancing Manager (Admin Client)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/RebalancingPage.tsx`

**Funcionalidades:**

1. **Target Allocation Setup**
   - Define target weights per asset
   - Set min/max bounds
   - Save allocation models

2. **Current vs Target Comparison**
   - Table showing:
     - Asset
     - Target weight
     - Current weight
     - Drift
     - Current value
   - Color coding (Green in range, Red out of bounds)

3. **Drift Monitor**
   - Real-time drift calculation
   - Alert when drift > threshold
   - Historical drift chart

4. **Rebalancing Calculator**
   - Calculate required trades
   - Show buy/sell quantities
   - Estimated costs
   - Simulate new allocation after rebalancing

5. **Trade Order Generation**
   - Auto-generate trade orders
   - Review before execution
   - Send to OMS (Order Management System)

6. **Transaction Cost Analysis (TCA)**
   - Estimated slippage
   - Estimated fees
   - Market impact
   - Total cost vs benefit

7. **Execution Tracking**
   - Track order fills
   - Actual vs estimated prices
   - Performance vs benchmark

**Charts:**
```typescript
import { Pie, Column } from '@ant-design/charts';

// Current vs Target Allocation
const allocationComparison = {
  data: [
    { asset: 'BTC', type: 'Current', value: 45 },
    { asset: 'BTC', type: 'Target', value: 40 },
    // ...
  ],
  xField: 'asset',
  yField: 'value',
  seriesField: 'type',
  isGroup: true,
};
```

---

### TAREA 6.3: Trading Dashboard (OMS/EMS) (Admin Client)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 6 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/TradingDashboardPage.tsx`

**Funcionalidades:**

1. **Order Entry Form**
   - Asset selector
   - Side (Buy/Sell)
   - Order type (Market, Limit, Stop, Stop-Limit)
   - Quantity
   - Limit price (if applicable)
   - Time in force (GTC, GTD, IOC, FOK)
   - Destination exchange

2. **Pre-Trade Compliance**
   - Automatic checks before order submission:
     - Position limit check
     - Concentration limit
     - Restricted list
     - Available cash
   - Show warnings/errors
   - Require override for violations

3. **Order Blotter**
   - Table of all orders
   - Columns: Order ID, Time, Asset, Side, Type, Quantity, Price, Status
   - Status filter (Open, Partial, Filled, Canceled)
   - Cancel order action

4. **Execution Management**
   - Real-time order fills
   - Partial fill tracking
   - Average execution price
   - Link to exchange confirmation

5. **Best Execution Monitoring**
   - Benchmark selection (Arrival price, VWAP, TWAP)
   - Slippage calculation (bps)
   - Execution quality score
   - Alert if execution quality is poor

6. **Position Management**
   - Current positions table
   - P&L per position
   - Unrealized gain/loss
   - Close position button

7. **Trade History**
   - All executed trades
   - Filter by date, asset, trader
   - Export to CSV
   - Generate trade report

**Real-time Updates:**
```typescript
// WebSocket connection to exchange
const ws = new WebSocket('wss://exchange.com/ws');
ws.onmessage = (event) => {
  const fill = JSON.parse(event.data);
  updateOrderStatus(fill);
};
```

---

### TAREA 6.4: Risk Dashboard (Admin Client)
**Prioridad:** 🟡 ALTA
**Tiempo:** 5 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/RiskDashboardPage.tsx`

**Funcionalidades:**

1. **Market Risk Metrics**
   - Value at Risk (VaR)
     - Method selector (Historical, Parametric, Monte Carlo)
     - Confidence level (95%, 99%)
     - Time horizon (1-day, 10-day)
     - VaR chart
   - Conditional VaR (CVaR)
   - Beta vs benchmark
   - Volatility (annualized)
   - Sharpe ratio
   - Max drawdown

2. **VaR Calculation**
   - Historical simulation (use past returns)
   - Parametric (assume normal distribution)
   - Monte Carlo (simulate future scenarios)
   - Show VaR breakdown by asset

3. **Stress Testing**
   - Scenario selector:
     - Market crash (-20%)
     - Interest rate spike (+200bps)
     - Crypto winter (-50%)
     - Custom scenario
   - Show portfolio impact
   - Identify vulnerabilities

4. **Concentration Risk**
   - Largest position card
   - Top 5 holdings weight
   - Herfindahl index
   - Concentration limit breaches

5. **Liquidity Risk**
   - Liquid assets % (can sell in 1 day)
   - Liquidity ratio
   - Days to liquidate 100%
   - Redemption coverage (days)

6. **Limit Monitoring**
   - All risk limits in one table:
     - Limit name
     - Current value
     - Limit threshold
     - % utilized
     - Status (OK, Warning, Breach)
   - Alert system

7. **Risk Reports**
   - Daily risk report (PDF)
   - Weekly summary
   - Monthly detailed report
   - Export data

**Charts:**
```typescript
import { Line, Histogram } from '@ant-design/charts';

// VaR Distribution
const varDistribution = {
  data: historicalReturns,
  binWidth: 0.5,
  annotations: [
    {
      type: 'line',
      start: ['95th percentile', 0],
      end: ['95th percentile', 'max'],
      style: { stroke: 'red', lineDash: [4, 4] },
    },
  ],
};
```

---

## 🎯 SPRINT 7: SECONDARY MARKET & TRADING

### TAREA 7.1: Trading Platform (Investor Portal)
**Prioridad:** 🟡 ALTA
**Tiempo:** 5 horas
**Archivos:**
- `/frontend/src/portals/investor/pages/TradingPlatformPage.tsx`

**Funcionalidades:**

1. **Order Book Visualization**
   - Bids (buy orders) - Green
   - Asks (sell orders) - Red
   - Depth chart
   - Spread indicator
   - Last traded price

2. **Order Entry (Simple for Investors)**
   - Buy/Sell toggle
   - Order type (Market, Limit)
   - Quantity input
   - Limit price (for limit orders)
   - Estimated total cost
   - Submit order button

3. **My Orders Table**
   - Open orders
   - Order history
   - Cancel order option
   - Filter by status

4. **Recent Trades**
   - Real-time trade feed
   - Price, quantity, time
   - Buy/sell indicator

5. **Price Chart**
   - Candlestick chart
   - Volume bars
   - Time period selector (1D, 1W, 1M, 3M, 1Y)

6. **Trading Rules & Limits**
   - Display any trading restrictions
   - Min/max order size
   - Daily trading limit
   - Lock-up restrictions

**Components:**
```typescript
import { TradingView } from 'react-tradingview-embed'; // For advanced charts
// Or use @ant-design/charts for simpler charts
```

---

### TAREA 7.2: Market Maker Dashboard (Admin Owner)
**Prioridad:** 🟢 MEDIA (Opcional)
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/MarketMakerPage.tsx`

**Funcionalidades:**

1. **Quoting Strategy Configurator**
   - Spread (bps)
   - Quote size
   - Number of levels
   - Skew factor

2. **Inventory Management**
   - Current position
   - Target position (usually 0)
   - Max position limit
   - Position skew indicator

3. **Auto-Quoting Engine**
   - Enable/disable auto-quoting
   - Dynamic spread adjustment
   - Inventory-based skewing
   - Volatility-based adjustment

4. **P&L Tracker**
   - Real-time P&L
   - Daily P&L
   - Cumulative P&L
   - P&L chart

5. **Risk Limits**
   - Max daily loss
   - Position limit
   - Pause trading if limits breached

---

## 🎯 SPRINT 8: REDEMPTION & EXIT

### TAREA 8.1: Redemption Management (Investor Portal)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 3 horas
**Archivos:**
- `/frontend/src/portals/investor/pages/RedemptionPage.tsx`

**Funcionalidades:**

1. **Redemption Request Form**
   - Fund selector
   - Redemption type (Full, Partial)
   - Shares to redeem (slider or input)
   - % to redeem
   - Payment method (Wire, Crypto)

2. **Eligibility Checker**
   - Lock-up check
   - Notice period check
   - Min holding period
   - Show warnings if not eligible

3. **Fee Calculator**
   - Redemption fee
   - Early redemption penalty (if applicable)
   - Tax withholding estimate
   - Net proceeds estimate

4. **Redemption Schedule**
   - Show redemption date
   - NAV strike date
   - Payment date
   - Calendar integration

5. **Gate Information**
   - Show if gate is active
   - Monthly redemption limit
   - Current month redemptions
   - Remaining capacity
   - Queue position (if applicable)

6. **Confirmation**
   - Review all details
   - E-signature
   - Submit request
   - Confirmation number

---

### TAREA 8.2: Gate Management (Admin Client)
**Prioridad:** 🟡 ALTA
**Tiempo:** 3 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/GateManagementPage.tsx`

**Funcionalidades:**

1. **Gate Activation**
   - Activate/deactivate gate
   - Reason for activation
   - Monthly/quarterly limit setting

2. **Redemption Queue**
   - List of all redemption requests
   - FIFO or Pro-rata processing
   - Queue position
   - Process next in queue button

3. **Pro-Rata Calculator**
   - Total requested
   - Available capacity
   - Pro-rata percentage
   - Allocation per investor

4. **Historical Gates**
   - Past gate activations
   - Duration
   - Impact metrics

---

## 🎯 SPRINT 9: REPORTING & TAX

### TAREA 9.1: Investor Reporting Portal (Admin Client)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/admin-client/pages/InvestorReportingPage.tsx`

**Funcionalidades:**

1. **Report Generator**
   - Report type selector (Monthly, Quarterly, Annual)
   - Period selector
   - Investor selector (All or specific)
   - Generate button

2. **Report Templates**
   - Monthly statement
   - Quarterly letter
   - Annual report
   - Custom report builder

3. **Distribution Manager**
   - Send via email
   - Upload to investor portal
   - Track delivery status
   - Resend option

4. **Report Library**
   - All generated reports
   - Filter by type, period
   - Download PDF
   - Preview

---

### TAREA 9.2: Tax Center (Investor Portal)
**Prioridad:** 🔴 CRÍTICA
**Tiempo:** 4 horas
**Archivos:**
- `/frontend/src/portals/investor/pages/TaxCenterPage.tsx`

**Funcionalidades:**

1. **Tax Documents Dashboard**
   - 1099-DIV
   - K-1 (if partnership)
   - Realized gains/losses report
   - Cost basis report

2. **Tax Year Selector**
   - Select tax year
   - Show all documents for that year
   - Download all as ZIP

3. **Realized Gains/Losses Table**
   - Date acquired
   - Date sold
   - Proceeds
   - Cost basis
   - Gain/loss
   - Term (short/long)
   - Wash sale indicator

4. **Cost Basis Tracking**
   - Method selector (FIFO, LIFO, SpecID, AvgCost)
   - Lot-level details
   - Unrealized gains per lot

5. **Tax Optimization Tools**
   - Tax loss harvesting suggestions
   - What-if scenarios
   - Estimate tax liability

---

## 🎯 SPRINT 10: REGULATORY & COMPLIANCE

### TAREA 10.1: Regulatory Filings Dashboard (Admin Owner)
**Prioridad:** 🟡 ALTA
**Tiempo:** 3 horas
**Archivos:**
- `/frontend/src/portals/admin-owner/pages/RegulatoryFilingsPage.tsx`

**Funcionalidades:**

1. **Filings Calendar**
   - All filing deadlines
   - Form type (Form D, Form PF, ADV)
   - Status (Pending, Filed, Overdue)
   - Reminders

2. **Form Generator**
   - Form D (New issue, Amendment)
   - Form PF (Sections 1-4)
   - Form ADV updates
   - Auto-populate from system data

3. **Submission Tracker**
   - Track submission status
   - Confirmation numbers
   - View filed documents

4. **Jurisdiction Manager**
   - Multi-jurisdiction filings
   - Blue Sky filings (per state)
   - EU passporting

---

### TAREA 10.2: Compliance Monitoring Dashboard (Admin Owner) ✅
**Status:** YA COMPLETADO - Similar a Audit Logs
**Página:** `/admin-owner/pages/AuditLogsPage.tsx`

**Mejoras sugeridas:**
- Agregar transaction monitoring rules
- Agregar suspicious activity detection
- Agregar regulatory alerts

---

## 🎯 SPRINT 11: DATA PARITY & SHARED INFRA (NAVEO ↔ ONION)

### TAREA 11.1: Supabase Seed & Migration Sync
**Prioridad:** 🟡 ALTA  
**Tiempo:** 3 horas  
**Archivos:**  
- `/supabase/migrations/00x_*`  
- `/supabase/seed.sql`

**Objetivo:** Tener el mismo set de tablas y datos demo entre Naveo y wallet-opcion/onion para QA cruzado.

**Requisitos:**
1. Replicar tablas clave del doc `wallet-opcion/onion/docs/DB_ARCHITECTURE.md` (profiles, kyc_verifications, tokens, tokenized_assets, orders, liquidity_pools, user_staking).
2. Crear `seed.sql` con:
   - 3 fondos (equity, real-estate, defi) + NAV history.
   - 10 assets (BTC, ETH, USDC, RWA tokens) asignados a fondos.
   - 5 traders, 10 inversionistas y 2 emisores KYB.
3. Scripts para sincronizar seeds (`npm run db:seed-sync`) y documentación en README.

---

### TAREA 11.2: Policies & Audit Parity
**Prioridad:** 🟡 ALTA  
**Tiempo:** 2 horas  
**Descripción:** Implementar las policies `kyc_verifications`, `system_events`, `user_notifications` y triggers `update_balances_after_transaction` descritas en `docs/NAVEO_VS_ONION.md` para alinear controles de compliance.

**Checklist:**
- [ ] Añadir policies con `drop policy` + `create policy` (igual que en Onion).
- [ ] Crear trigger `system_event_log` para operaciones críticas (mint/burn, orders, subscriptions).
- [ ] Dashboard Admin Owner → “Compliance Monitoring” (mejoras sugeridas) mostrando estas auditorías.

---

### TAREA 11.3: Shared Component Library
**Prioridad:** 🟡 ALTA  
**Tiempo:** 4 horas  
**Archivos:**  
- `/frontend/src/components/shared/`  
- `/frontend/src/pages/LoginPage.tsx`

**Objetivo:** Empaquetar componentes clave que ambos proyectos necesitan.

**Componentes:**
1. `BuySellModal v2` (ya hecho) → publicar como módulo compartido.
2. `OnboardingWizard` (wallet connect + KYC + suitability) – stub inicial.
3. `AssetPipelineBoard` – reutilizable en Naveo/Onion.

**Acciones:**
- Exportar desde `@/components/shared/index.ts`.
- Documentar props en `docs/COMPONENTS.md`.
- Preparar guía para importarlo en wallet-opcion/onion.

---

## 🎯 SPRINT 12: ROADMAP ALIGNMENT & API INTEGRATIONS

### TAREA 12.1: Roadmap Mirror & RACI
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 2 horas  
**Descripción:** Reflejar `docs/NAVEO_VS_ONION.md` + nueva sección de integración en `wallet-opcion/onion/docs/ROADMAP.md` y crear RACI para cada fase.

**Entregables:**
- Tabla RACI (Owner, QA, PM) por módulo.
- Issues cross-project para fases críticas (Origination, Launchpad, Trading).

---

### TAREA 12.2: API & Data Connectors
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 3 horas  
**Objetivo:** Diseñar endpoints compartidos (Supabase REST / Edge Functions) para que la wallet consuma datos de Naveo.

**Endpoints iniciales:**
1. `/api/funds/:id/metrics` – NAV, AUM, performance.
2. `/api/assets/:id/history` – precios y posición.
3. `/api/offers/:id/subscriptions` – estado de la oferta primaria.

**Requisitos:**
- Definir contratos JSON en `docs/API_CONTRACTS.md`.
- Añadir tests básicos usando `supabase functions serve`.
- Documentar autenticación (JWT roles `admin_owner`, `admin_client`, `investor`).

---

### TAREA 12.3: Wallet Binding & Role Persistence
**Prioridad:** 🟢 MEDIA  
**Tiempo:** 3 horas  
**Descripción:** Extender `LoginPage` para guardar el rol demo en localStorage y soportar wallets reales (MetaMask).

**Pasos:**
1. Integrar `@web3modal/ethereum` con botón “Connect Wallet”.
2. Guardar `selectedRole`, `walletAddress`, `kycLevel` en `localStorage`.
3. Middleware en `DashboardLayout` para leer estos datos y mostrar banners (ej. “Completa KYC nivel 2”).

---

## 📊 PRIORIZACIÓN GENERAL

### FASE 1 (Crítico - Build First) ✅ COMPLETADO
- Login + Demo ✅
- Asset Management ✅
- Portfolio Page ✅
- BuySellModal ✅
- Traders Management ✅
- NAV System ✅
- Supabase Schema ✅

### FASE 2 (Alta Prioridad - Q1 2025)
- Asset Pipeline Dashboard
- Due Diligence Tracker
- Product Structuring Studio
- Investor Onboarding Flow
- KYC/AML Management
- Subscription Workflow
- Trading Dashboard (OMS/EMS)
- Risk Dashboard
- Redemption Management

### FASE 3 (Media Prioridad - Q2 2025)
- Smart Contract Factory
- Suitability Questionnaire
- Subscription Calendar
- Capital Call Management
- Portfolio Rebalancing
- Trading Platform (Investor)
- Gate Management
- Investor Reporting

### FASE 4 (Baja Prioridad - Q3 2025)
- Market Maker Dashboard
- Tax Center
- Regulatory Filings
- Advanced Analytics

---

## 🔧 STACK TÉCNICO POR MÓDULO

### Charts & Visualizations
```bash
npm install @ant-design/charts
npm install @ant-design/plots
npm install recharts # Alternativa
```

### Forms & Validation
```bash
npm install react-hook-form
npm install zod # Schema validation
npm install @hookform/resolvers
```

### Blockchain Integration
```bash
npm install ethers # Ethereum library
npm install @web3-react/core # React hooks for Web3
npm install @web3-react/injected-connector # MetaMask
```

### PDF Generation
```bash
npm install jspdf
npm install html2canvas
npm install @react-pdf/renderer
```

### File Upload
```bash
npm install react-dropzone
# Ant Design Upload ya incluido
```

### Date Handling
```bash
npm install dayjs # Ya instalado
npm install date-fns # Alternativa
```

### Code Editor (para Smart Contract Factory)
```bash
npm install @uiw/react-codemirror
npm install @replit/codemirror-lang-solidity
```

### E-Signature
```bash
npm install react-signature-canvas
```

### Calendar
```bash
npm install react-big-calendar
npm install @fullcalendar/react
```

---

## 📝 ORDEN DE IMPLEMENTACIÓN SUGERIDO

### Semana 1-2: Foundation
1. Asset Pipeline Dashboard
2. Due Diligence Tracker
3. Product Structuring Studio (basic)

### Semana 3-4: Investor Acquisition
4. Investor Onboarding Flow
5. KYC/AML Management
6. Suitability Questionnaire

### Semana 5-6: Subscription
7. Subscription Workflow
8. Subscription Calendar
9. Capital Call Management

### Semana 7-8: Active Management
10. Portfolio Rebalancing
11. Trading Dashboard
12. Risk Dashboard

### Semana 9-10: Exit & Reporting
13. Redemption Management
14. Gate Management
15. Investor Reporting
16. Tax Center

### Semana 11-12: Advanced
17. Trading Platform (Secondary)
18. Smart Contract Factory
19. Regulatory Filings
20. Polish & Testing

---

## ✅ DEFINITION OF DONE

Cada tarea se considera completada cuando:

1. ✅ Página renderiza sin errores
2. ✅ TypeScript types correctos (no `any`)
3. ✅ Responsive design (mobile, tablet, desktop)
4. ✅ Forms con validación
5. ✅ Loading states implementados
6. ✅ Error handling
7. ✅ Mock data funcional
8. ✅ Routing configurado
9. ✅ Exports actualizados
10. ✅ Documentación básica
11. ✅ Screenshots tomados
12. ✅ Tested manualmente

---

**Creado por:** Claude Code
**Para:** Codex
**Fecha:** 2025-11-10
**Versión:** 2.0

🚀 **Este roadmap cubre el 100% del flujo de tokenización end-to-end desde la perspectiva de Investment Banking.**
