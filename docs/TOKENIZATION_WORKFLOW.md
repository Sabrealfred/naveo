# 🏦 NAVEO - FLUJO COMPLETO DE TOKENIZACIÓN DE ACTIVOS
## Investment Banking Digital Workflow

**Documento:** Flujo End-to-End de Tokenización
**Fecha:** 2025-11-10
**Versión:** 1.0
**Perspectiva:** Investment Banking + Asset Management

---

## 📋 TABLA DE CONTENIDOS

1. [Fase 1: Asset Origination & Due Diligence](#fase-1-asset-origination--due-diligence)
2. [Fase 2: Structuring & Tokenization](#fase-2-structuring--tokenization)
3. [Fase 3: Regulatory & Compliance](#fase-3-regulatory--compliance)
4. [Fase 4: Marketing & Distribution](#fase-4-marketing--distribution)
5. [Fase 5: Investor Onboarding](#fase-5-investor-onboarding)
6. [Fase 6: Primary Market - Subscription](#fase-6-primary-market---subscription)
7. [Fase 7: Settlement & Custody](#fase-7-settlement--custody)
8. [Fase 8: Active Management](#fase-8-active-management)
9. [Fase 9: Secondary Market Trading](#fase-9-secondary-market-trading)
10. [Fase 10: Redemption & Exit](#fase-10-redemption--exit)
11. [Fase 11: Reporting & Tax](#fase-11-reporting--tax)

---

## FASE 1: Asset Origination & Due Diligence

### 🎯 Objetivo
Identificar, evaluar y adquirir activos digitales de calidad institucional para tokenización.

### 👥 Actores
- **Investment Banking Team** (Admin Owner)
- **Research Analysts** (Admin Owner)
- **Legal Team** (Admin Owner)
- **Third-party Auditors**

### 📊 Procesos

#### 1.1. Asset Sourcing
**Dashboard necesario:** Asset Pipeline Dashboard

**Funcionalidades:**
- Lista de activos potenciales (pipeline)
- Scoring de oportunidades
- Tracking de sourcing channels
- Deal flow analytics

**Data points:**
```typescript
interface AssetPipeline {
  id: string;
  assetName: string;
  assetClass: 'crypto' | 'real-estate' | 'commodities' | 'securities';
  sourceChannel: 'broker' | 'direct' | 'marketplace' | 'referral';
  estimatedValue: number;
  potentialYield: number;
  stage: 'sourcing' | 'evaluation' | 'due-diligence' | 'approved' | 'rejected';
  assignedAnalyst: string;
  sourcingDate: Date;
  targetClosing: Date;
  priority: 'high' | 'medium' | 'low';
}
```

**Workflows:**
1. Registro de nueva oportunidad
2. Asignación a analista
3. Preliminary screening
4. Decision: Proceed to DD or Reject

---

#### 1.2. Due Diligence Process
**Dashboard necesario:** Due Diligence Tracker

**Funcionalidades:**
- Checklist de DD items
- Document repository
- Risk assessment matrix
- DD report generation

**Checklist items:**
- [ ] Financial Analysis
  - Historical performance
  - Cash flows
  - Valuation multiples
  - Stress testing
- [ ] Legal Review
  - Title/ownership verification
  - Regulatory compliance
  - Contract review
  - Litigation check
- [ ] Technical Assessment
  - Smart contract audit (si aplica)
  - Blockchain compatibility
  - Custody solution
  - Oracle integration
- [ ] Market Analysis
  - Liquidity assessment
  - Price discovery mechanism
  - Comparable analysis
  - Market sizing
- [ ] Operational DD
  - Custodian evaluation
  - Service provider check
  - Operational risk assessment

**Outputs:**
- Due Diligence Report (PDF)
- Risk Rating (A-E scale)
- Investment Memo
- Valuation Report

---

#### 1.3. Valuation & Pricing
**Dashboard necesario:** Valuation Model Dashboard

**Funcionalidades:**
- Multiple valuation methods
- DCF calculator
- Comparable analysis
- Monte Carlo simulation
- Sensitivity analysis

**Models:**
```typescript
interface ValuationModel {
  assetId: string;
  method: 'DCF' | 'comparable' | 'market' | 'NAV';
  baseValue: number;
  discountRate: number;
  growthRate: number;
  terminalValue: number;
  fairValue: number;
  confidence: number; // 0-100%
  assumptions: string[];
  sensitivityScenarios: {
    best: number;
    base: number;
    worst: number;
  };
}
```

---

#### 1.4. Investment Committee Approval
**Dashboard necesario:** IC Approval Workflow

**Funcionalidades:**
- IC presentation builder
- Voting system
- Comments & feedback
- Conditional approval tracking

**Workflow:**
1. Analyst prepares IC memo
2. Submit to Investment Committee
3. IC reviews (async/sync meeting)
4. Vote: Approve / Reject / Conditional
5. If approved → Move to Structuring
6. If conditional → Address items → Re-submit

---

## FASE 2: Structuring & Tokenization

### 🎯 Objetivo
Estructurar el producto financiero y crear la representación tokenizada del activo.

### 👥 Actores
- **Structuring Team** (Admin Owner)
- **Smart Contract Developers** (Admin Owner)
- **Legal Counsel** (Admin Owner)

### 📊 Procesos

#### 2.1. Product Structuring
**Dashboard necesario:** Product Structuring Studio

**Funcionalidades:**
- Product type selector (Fund, SPV, Note, Direct)
- Terms & conditions builder
- Fee structure configurator
- Waterfall modeler
- Document generator

**Product Configuration:**
```typescript
interface ProductStructure {
  productType: 'fund' | 'spv' | 'note' | 'direct-token';
  name: string;
  description: string;

  // Economic Terms
  minimumInvestment: number;
  maximumInvestment: number;
  targetRaise: number;
  hardCap: number;

  // Fee Structure
  fees: {
    managementFee: number; // Annual %
    performanceFee: number; // % of profits
    hurdle: number; // Min return before perf fee
    highWaterMark: boolean;
    subscriptionFee: number;
    redemptionFee: number;
    earlyRedemptionPenalty: number; // If within lock-up
  };

  // Waterfall
  waterfall: {
    tier: number;
    threshold: number;
    lpShare: number;
    gpShare: number;
  }[];

  // Liquidity Terms
  lockUpPeriod: number; // months
  redemptionFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  redemptionNotice: number; // days
  gateProvisions: {
    enabled: boolean;
    monthlyLimit: number; // % of NAV
    queueMechanism: 'FIFO' | 'pro-rata';
  };

  // Governance
  votingRights: boolean;
  majorDecisionsThreshold: number; // % of votes needed
  lpac: boolean; // LP Advisory Committee
}
```

**Document Outputs:**
- Term Sheet
- Private Placement Memorandum (PPM)
- Subscription Agreement
- Operating Agreement / Fund Docs
- Risk Disclosures

---

#### 2.2. Smart Contract Development
**Dashboard necesario:** Smart Contract Factory

**Funcionalidades:**
- Template selector (ERC-20, ERC-1400, ERC-3643)
- Contract parameter configurator
- Code generator
- Testing suite
- Audit request system

**Contract Specs:**
```solidity
// Example: Security Token (ERC-1400 compliant)
contract NaveoSecurityToken {
  // Token Metadata
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  // Issuance
  address public issuer; // Fund Manager
  uint256 public maxSupply;

  // Transfer Restrictions
  mapping(address => bool) public whitelisted;
  mapping(address => uint256) public lockUntil;

  // Compliance
  address public complianceModule;

  // Corporate Actions
  struct Dividend {
    uint256 amount;
    uint256 recordDate;
    uint256 paymentDate;
    bool paid;
  }

  // NAV Oracle
  address public navOracle;
  uint256 public currentNAV;

  // Functions
  function issue(address to, uint256 amount) external;
  function redeem(uint256 amount) external;
  function transfer(address to, uint256 amount) external;
  function distributeDividend() external;
  function updateNAV(uint256 newNAV) external;
}
```

**Smart Contract Modules:**
1. **Token Contract** (Core ERC standard)
2. **Compliance Module** (KYC/AML checks)
3. **NAV Oracle** (Price feed)
4. **Transfer Agent** (Handles transfers)
5. **Corporate Actions** (Dividends, splits)
6. **Redemption Module** (Buy-back mechanism)
7. **Governance** (Voting if applicable)

---

#### 2.3. Tokenization Parameters
**Dashboard necesario:** Tokenomics Dashboard

**Funcionalidades:**
- Token supply calculator
- Share class configurator
- Vesting schedule builder
- Token allocation visualizer

**Tokenomics:**
```typescript
interface Tokenomics {
  // Supply
  totalTokens: number;
  tokenPerShare: number; // 1:1, 1:100, etc.
  decimals: number;

  // Allocation
  allocation: {
    retail: number; // %
    institutional: number;
    team: number;
    reserve: number;
  };

  // Vesting (for team/founders)
  vesting: {
    beneficiary: string;
    amount: number;
    cliff: number; // months
    duration: number; // months
    startDate: Date;
  }[];

  // Share Classes
  shareClasses: {
    class: 'A' | 'B' | 'C';
    minInvestment: number;
    feeDiscount: number;
    votingPower: number;
    priority: number; // in waterfall
  }[];
}
```

---

#### 2.4. Custody Setup
**Dashboard necesario:** Custody Configuration

**Funcionalidades:**
- Custodian selection
- Wallet generation (multi-sig)
- Insurance setup
- Cold storage allocation

**Custody Architecture:**
```typescript
interface CustodySetup {
  // Custodian
  custodian: 'fireblocks' | 'anchorage' | 'coinbase-custody' | 'self-custody';
  insuranceCoverage: number;

  // Wallet Structure
  wallets: {
    purpose: 'operational' | 'cold-storage' | 'investor-deposits';
    type: 'hot' | 'warm' | 'cold';
    signatories: string[];
    threshold: number; // M-of-N multisig
    address: string;
    balance: number;
  }[];

  // Security Policies
  policies: {
    dailyWithdrawalLimit: number;
    requiredApprovals: number;
    whitelistedAddresses: string[];
    blacklistedAddresses: string[];
  };
}
```

---

## FASE 3: Regulatory & Compliance

### 🎯 Objetivo
Asegurar compliance con regulaciones securities, AML/KYC, y jurisdiccionales.

### 👥 Actores
- **Compliance Officer** (Admin Owner)
- **Legal Counsel** (Admin Owner)
- **KYC Provider** (Persona, Sumsub, etc.)

### 📊 Procesos

#### 3.1. Regulatory Filing
**Dashboard necesario:** Regulatory Filings Dashboard

**Funcionalidades:**
- Jurisdiction selector
- Exemption calculator (Reg D, Reg S, Reg CF, Reg A+)
- Filing generator
- Submission tracker
- Renewal reminders

**Regulatory Matrix:**
```typescript
interface RegulatoryFiling {
  jurisdiction: 'US' | 'EU' | 'UK' | 'Singapore' | 'Switzerland';

  // US-specific
  us: {
    exemption: 'Reg D 506(b)' | 'Reg D 506(c)' | 'Reg S' | 'Reg A+' | 'Reg CF';
    formD: {
      filed: boolean;
      filingDate: Date;
      crd: string;
    };
    blueSkyFilings: {
      state: string;
      status: 'filed' | 'approved' | 'pending';
    }[];
    accreditedInvestorOnly: boolean;
  };

  // EU-specific
  eu: {
    prospectusRequired: boolean;
    passporting: string[]; // EU countries
    mifid2Compliant: boolean;
  };

  // Ongoing Compliance
  ongoingReporting: {
    frequency: 'annual' | 'semi-annual' | 'quarterly';
    nextDeadline: Date;
  };
}
```

---

#### 3.2. KYC/AML Framework
**Dashboard necesario:** KYC/AML Management System

**Funcionalidades:**
- Investor screening
- Document verification
- PEP/Sanctions check
- Enhanced DD trigger
- Ongoing monitoring

**KYC Tiers:**
```typescript
interface KYCFramework {
  // Tier 1: Basic (< $10k)
  tier1: {
    requirements: ['email', 'name', 'country'];
    verificationType: 'email-only';
    investmentLimit: 10000;
  };

  // Tier 2: Standard ($10k - $100k)
  tier2: {
    requirements: ['ID', 'address-proof', 'selfie'];
    verificationType: 'document + liveness';
    investmentLimit: 100000;
    amlCheck: true;
  };

  // Tier 3: Enhanced (> $100k or PEP)
  tier3: {
    requirements: ['all-tier2', 'source-of-wealth', 'bank-statement'];
    verificationType: 'manual-review';
    investmentLimit: Infinity;
    amlCheck: true;
    eddRequired: true;
  };

  // Ongoing Monitoring
  monitoring: {
    transactionMonitoring: boolean;
    behavioralAnalysis: boolean;
    periodicReview: number; // months
  };
}
```

---

#### 3.3. Compliance Monitoring
**Dashboard necesario:** Compliance Monitoring Dashboard

**Funcionalidades:**
- Real-time transaction monitoring
- Suspicious activity alerts
- Regulatory change tracker
- Audit trail
- Incident management

**Monitoring Rules:**
```typescript
interface ComplianceRules {
  // Transaction Monitoring
  rules: {
    id: string;
    name: string;
    type: 'threshold' | 'velocity' | 'pattern' | 'geography';
    parameters: {
      threshold?: number;
      timeWindow?: number;
      suspiciousPattern?: string[];
      blockedCountries?: string[];
    };
    action: 'block' | 'flag' | 'review';
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];

  // Examples
  exampleRules: [
    {
      name: 'Large Single Transaction',
      type: 'threshold',
      parameters: { threshold: 100000 },
      action: 'flag'
    },
    {
      name: 'High Frequency Trading',
      type: 'velocity',
      parameters: { threshold: 10, timeWindow: 3600 },
      action: 'review'
    },
    {
      name: 'Sanctioned Country',
      type: 'geography',
      parameters: { blockedCountries: ['KP', 'IR', 'SY'] },
      action: 'block'
    }
  ];
}
```

---

## FASE 4: Marketing & Distribution

### 🎯 Objetivo
Comercializar el producto tokenizado a inversores calificados.

### 👥 Actores
- **Capital Markets Team** (Admin Owner)
- **Marketing Team** (Admin Owner)
- **Distribution Partners** (External)

### 📊 Procesos

#### 4.1. Marketing Materials
**Dashboard necesario:** Marketing Materials Studio

**Funcionalidades:**
- Pitch deck builder
- Factsheet generator
- Performance attribution
- Tear sheet creator
- Email campaign manager

**Marketing Assets:**
```typescript
interface MarketingMaterials {
  // Core Documents
  documents: {
    pitchDeck: string; // URL to PDF
    factsheet: string;
    tearSheet: string;
    videoPresentation: string;
  };

  // Factsheet Contents
  factsheet: {
    fundName: string;
    objective: string;
    strategy: string;
    keyMetrics: {
      aum: number;
      nav: number;
      ytdReturn: number;
      inception: Date;
      minInvestment: number;
    };
    performanceChart: ChartData;
    topHoldings: {
      asset: string;
      weight: number;
    }[];
    feeStructure: FeeStructure;
    riskRating: string;
  };

  // Distribution Channels
  channels: {
    website: boolean;
    email: boolean;
    webinar: boolean;
    roadshow: boolean;
    socialMedia: boolean;
  };
}
```

---

#### 4.2. Investor Targeting
**Dashboard necesario:** CRM & Lead Management

**Funcionalidades:**
- Investor database
- Segmentation engine
- Lead scoring
- Pipeline tracking
- Communication history

**Investor Segmentation:**
```typescript
interface InvestorSegment {
  // Demographics
  investorType: 'retail-accredited' | 'family-office' | 'institution' | 'fund-of-funds';
  geography: string;
  aum: number;

  // Investment Profile
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: number; // years
  assetClasses: string[];
  avgCheckSize: number;

  // Engagement
  engagementScore: number; // 0-100
  touchpoints: {
    date: Date;
    type: 'email' | 'call' | 'meeting' | 'webinar';
    outcome: string;
  }[];

  // Status
  stage: 'lead' | 'qualified' | 'pitch' | 'due-diligence' | 'committed' | 'closed' | 'lost';
  assignedRM: string; // Relationship Manager
}
```

---

#### 4.3. Roadshow & Presentations
**Dashboard necesario:** Roadshow Management

**Funcionalidades:**
- Event scheduler
- Presentation tracker
- Follow-up automation
- Feedback collector
- ROI calculator

**Roadshow Planning:**
```typescript
interface RoadshowEvent {
  id: string;
  type: 'one-on-one' | 'small-group' | 'webinar' | 'conference';
  date: Date;
  location: string;
  attendees: {
    investorId: string;
    firm: string;
    title: string;
    confirmed: boolean;
  }[];
  presenter: string;
  materials: string[];
  followUpTasks: {
    assignee: string;
    task: string;
    deadline: Date;
  }[];
  outcome: {
    interestLevel: 'high' | 'medium' | 'low';
    nextSteps: string;
    estimatedCommitment: number;
  };
}
```

---

## FASE 5: Investor Onboarding

### 🎯 Objetivo
Onboardear inversores desde expresión de interés hasta cuenta lista para invertir.

### 👥 Actores
- **Investor Relations** (Admin Client)
- **Compliance Team** (Admin Client)
- **Investor** (End User)

### 📊 Procesos

#### 5.1. Investor Registration
**Dashboard necesario:** Investor Portal - Onboarding Flow

**Funcionalidades:**
- Multi-step registration form
- Progress tracker
- Document upload
- E-signature
- Status dashboard

**Onboarding Steps:**
```typescript
interface OnboardingFlow {
  steps: [
    {
      step: 1,
      name: 'Account Creation',
      fields: ['email', 'password', 'fullName', 'country'],
      validation: 'email-verification',
      status: 'completed'
    },
    {
      step: 2,
      name: 'Investor Profile',
      fields: ['investorType', 'taxResidence', 'occupation', 'employerName'],
      validation: 'form-completion',
      status: 'completed'
    },
    {
      step: 3,
      name: 'Accreditation Verification',
      options: [
        'Income-based ($200k+ individual, $300k+ joint)',
        'Net-worth based ($1M+ excluding primary residence)',
        'Professional certification (Series 7, 65, 82)',
        'Entity-based (Trust with $5M+)'
      ],
      documents: ['tax-return', 'bank-statement', 'financial-advisor-letter'],
      validation: 'manual-review',
      status: 'in-review'
    },
    {
      step: 4,
      name: 'Identity Verification (KYC)',
      provider: 'Persona',
      verification: {
        idDocument: 'pending',
        liveness: 'pending',
        addressProof: 'pending'
      },
      status: 'pending'
    },
    {
      step: 5,
      name: 'AML Screening',
      checks: ['PEP', 'sanctions', 'adverse-media'],
      status: 'pending'
    },
    {
      step: 6,
      name: 'Subscription Documents',
      documents: [
        'Subscription Agreement',
        'Operating Agreement',
        'PPM Acknowledgment',
        'Risk Disclosures',
        'W-9/W-8BEN'
      ],
      signature: 'e-sign',
      status: 'pending'
    },
    {
      step: 7,
      name: 'Funding Setup',
      options: ['bank-wire', 'crypto-transfer'],
      bankDetails: {
        accountName: '',
        accountNumber: '',
        routingNumber: '',
        bankName: ''
      },
      cryptoWallet: {
        address: '',
        network: 'ethereum'
      },
      status: 'pending'
    }
  ]
}
```

---

#### 5.2. Suitability Assessment
**Dashboard necesario:** Suitability Questionnaire

**Funcionalidades:**
- Risk tolerance questionnaire
- Investment experience quiz
- Financial situation assessment
- Suitability score calculator
- Recommendations engine

**Suitability Assessment:**
```typescript
interface SuitabilityAssessment {
  // Risk Tolerance
  riskTolerance: {
    questionnaire: {
      q1: 'If your investment lost 20% in a month, you would:',
      a1: 'sell-all' | 'sell-some' | 'hold' | 'buy-more';
      // ... more questions
    };
    score: number; // 0-100
    category: 'conservative' | 'moderate' | 'aggressive';
  };

  // Investment Experience
  experience: {
    yearsInvesting: number;
    assetClassExposure: {
      stocks: boolean;
      bonds: boolean;
      crypto: boolean;
      alternatives: boolean;
    };
    derivativesExperience: boolean;
    professionalExperience: boolean;
  };

  // Financial Situation
  financialProfile: {
    annualIncome: number;
    netWorth: number;
    liquidNetWorth: number;
    investmentObjective: 'income' | 'growth' | 'speculation' | 'preservation';
    investmentHorizon: number; // years
    liquidityNeeds: 'high' | 'medium' | 'low';
  };

  // Recommendation
  suitabilityScore: number; // 0-100
  recommendation: {
    suitable: boolean;
    maxAllocation: number; // % of portfolio
    warnings: string[];
    requiredDisclosures: string[];
  };
}
```

---

#### 5.3. Wallet Setup
**Dashboard necesario:** Wallet Onboarding

**Funcionalidades:**
- Wallet provider selector
- Wallet creation wizard
- Backup phrase management
- Test transaction
- Integration verification

**Wallet Options:**
```typescript
interface WalletSetup {
  // Option 1: Custodial (Platform-managed)
  custodial: {
    provider: 'Naveo Custody';
    setup: 'automatic';
    recovery: 'email + 2FA';
    pros: ['Easy', 'No seed phrase', 'Support'];
    cons: ['Not self-custody', 'Platform risk'];
  };

  // Option 2: Non-custodial (Self-managed)
  nonCustodial: {
    provider: 'MetaMask' | 'Ledger' | 'Trezor';
    setup: {
      steps: [
        'Install wallet',
        'Create account',
        'Backup seed phrase',
        'Connect to Naveo',
        'Verify connection'
      ];
    };
    recovery: 'seed-phrase-only';
    pros: ['Full control', 'True ownership'];
    cons: ['User responsible', 'Can lose access'];
  };

  // Wallet Details
  walletInfo: {
    address: string;
    network: 'ethereum' | 'polygon' | 'base';
    verified: boolean;
    testTransactionComplete: boolean;
  };
}
```

---

## FASE 6: Primary Market - Subscription

### 🎯 Objetivo
Ejecutar la subscripción inicial del inversionista al producto tokenizado.

### 👥 Actores
- **Investor** (Investor Portal)
- **Transfer Agent** (Admin Client)
- **Finance Team** (Admin Client)

### 📊 Procesos

#### 6.1. Subscription Process
**Dashboard necesario:** Subscription Workflow

**Funcionalidades:**
- Investment amount calculator
- Share/token calculator
- Subscription form
- Payment instructions
- Status tracking

**Subscription Flow:**
```typescript
interface SubscriptionProcess {
  // Step 1: Investment Details
  investmentDetails: {
    fundId: string;
    shareClass: 'A' | 'B' | 'C';
    investmentAmount: number;
    paymentMethod: 'wire' | 'crypto';

    // Calculations
    calculations: {
      grossAmount: number;
      subscriptionFee: number;
      netAmount: number;
      estimatedShares: number; // Will be finalized at NAV strike
      estimatedTokens: number;
    };
  };

  // Step 2: Payment
  payment: {
    method: 'wire' | 'crypto';

    // Wire Transfer
    wireInstructions?: {
      beneficiaryName: string;
      bankName: string;
      accountNumber: string;
      routingNumber: string;
      swiftCode: string;
      reference: string; // Unique subscription ID
    };

    // Crypto Transfer
    cryptoInstructions?: {
      asset: 'USDC' | 'USDT' | 'ETH';
      network: 'ethereum' | 'polygon';
      depositAddress: string;
      memo: string;
      minConfirmations: number;
    };

    // Payment Status
    status: 'pending' | 'received' | 'confirmed' | 'failed';
    receivedAmount: number;
    receivedDate: Date;
    confirmations: number;
  };

  // Step 3: NAV Strike
  navStrike: {
    strikeDate: Date; // Next business day or next NAV calculation date
    nav: number;
    finalShares: number;
    finalTokens: number;
  };

  // Step 4: Token Issuance
  tokenIssuance: {
    txHash: string;
    blockNumber: number;
    tokenContract: string;
    tokensIssued: number;
    recipientAddress: string;
    issuanceDate: Date;
  };

  // Step 5: Confirmation
  confirmation: {
    confirmationNumber: string;
    confirmationDocument: string; // PDF URL
    deliveryMethod: 'email' | 'portal';
    sentDate: Date;
  };
}
```

---

#### 6.2. Subscription Calendar
**Dashboard necesario:** Subscription Calendar

**Funcionalidades:**
- Subscription windows calendar
- Cutoff time tracker
- NAV strike schedule
- Settlement calendar
- Holiday calendar

**Subscription Windows:**
```typescript
interface SubscriptionCalendar {
  // Frequency
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';

  // Daily Example
  daily: {
    cutoffTime: '16:00 EST';
    navCalculation: '18:00 EST';
    navPublication: '20:00 EST';
    settlement: 'T+2';
  };

  // Monthly Example
  monthly: {
    subscriptionWindow: 'First 5 business days';
    cutoffDate: '5th of month';
    navStrikeDate: 'Last business day';
    settlementDate: '3rd business day of next month';
  };

  // Important Dates
  upcomingDates: {
    nextSubscriptionDeadline: Date;
    nextNavStrike: Date;
    nextSettlement: Date;
    nextRedemptionDeadline: Date;
  };

  // Holidays
  marketHolidays: Date[];
}
```

---

#### 6.3. Capital Call (if applicable)
**Dashboard necesario:** Capital Call Management

**Funcionalidades:**
- Capital call scheduler
- Investor allocation
- Payment tracking
- Default management
- Waterfall distribution

**Capital Call Process:**
```typescript
interface CapitalCall {
  id: string;
  callNumber: number;
  fundId: string;

  // Call Details
  callDetails: {
    callDate: Date;
    dueDate: Date;
    purpose: string;
    totalAmountCalled: number;
    utilizationOfProceeds: string;
  };

  // Investor Allocations
  allocations: {
    investorId: string;
    committedCapital: number;
    capitalCalled: number;
    percentageCalled: number; // % of commitment
    amountDue: number;
    paid: boolean;
    paidDate: Date;
    paidAmount: number;
  }[];

  // Payment Tracking
  tracking: {
    totalDue: number;
    totalReceived: number;
    percentageCollected: number;
    outstandingAmount: number;
    defaults: {
      investorId: string;
      amountDefaulted: number;
      penaltyApplied: boolean;
    }[];
  };
}
```

---

## FASE 7: Settlement & Custody

### 🎯 Objetivo
Liquidar transacciones y custodiar activos de manera segura.

### 👥 Actores
- **Transfer Agent** (Admin Client)
- **Custodian** (External/Internal)
- **Blockchain Network** (Infrastructure)

### 📊 Procesos

#### 7.1. Settlement Process
**Dashboard necesario:** Settlement Dashboard

**Funcionalidades:**
- Settlement queue
- DVP (Delivery vs Payment) manager
- Failed settlement resolution
- Reconciliation tools
- Settlement reporting

**Settlement Workflow:**
```typescript
interface SettlementProcess {
  // Trade Details
  trade: {
    tradeId: string;
    tradeDate: Date;
    settlementDate: Date;
    buyer: string;
    seller: string;
    asset: string;
    quantity: number;
    price: number;
    grossAmount: number;
  };

  // Settlement Method
  method: 'DVP' | 'FOP'; // Delivery vs Payment or Free of Payment

  // DVP Workflow (Atomic Swap)
  dvp: {
    paymentLeg: {
      from: string;
      to: string;
      asset: 'USDC';
      amount: number;
      txHash: string;
      status: 'pending' | 'confirmed' | 'failed';
    };
    deliveryLeg: {
      from: string;
      to: string;
      asset: string; // Token symbol
      quantity: number;
      txHash: string;
      status: 'pending' | 'confirmed' | 'failed';
    };
    atomicity: 'guaranteed'; // Both legs succeed or both fail
  };

  // Settlement Status
  status: 'pending' | 'matched' | 'settled' | 'failed';

  // Failed Settlement
  failedReason?: string;
  failureHandling: {
    buyIn: boolean; // Force close position
    penalty: number;
    resolution: string;
  };
}
```

---

#### 7.2. Custody Operations
**Dashboard necesario:** Custody Management

**Funcionalidades:**
- Asset inventory
- Custody reconciliation
- Corporate actions processing
- Income collection
- Custody reporting

**Custody Structure:**
```typescript
interface CustodyOperations {
  // Omnibus Account (Fund Level)
  omnibusAccount: {
    custodian: string;
    accountNumber: string;
    assets: {
      symbol: string;
      quantity: number;
      value: number;
      blockchain: string;
      contractAddress: string;
    }[];
    totalValue: number;
  };

  // Investor Sub-Accounts (Token Ledger)
  investorLedger: {
    investorId: string;
    tokenBalance: number;
    underlyingAssetEquivalent: number; // Based on NAV
    vestingSchedule?: {
      totalVested: number;
      totalUnvested: number;
      nextVestDate: Date;
    };
  }[];

  // Reconciliation
  reconciliation: {
    frequency: 'daily';
    lastReconciliation: Date;
    blockchainBalance: number;
    ledgerBalance: number;
    difference: number;
    status: 'matched' | 'discrepancy';
  };

  // Corporate Actions
  corporateActions: {
    type: 'dividend' | 'split' | 'reverse-split' | 'merger';
    effectiveDate: Date;
    recordDate: Date;
    paymentDate: Date;
    details: any;
  }[];
}
```

---

#### 7.3. Blockchain Confirmations
**Dashboard necesario:** Blockchain Monitor

**Funcionalidades:**
- Transaction tracker
- Block explorer integration
- Confirmation counter
- Failed tx analyzer
- Gas optimizer

**Blockchain Tracking:**
```typescript
interface BlockchainTracking {
  // Network Status
  network: {
    name: 'Ethereum' | 'Polygon' | 'Base';
    blockHeight: number;
    gasPrice: number;
    congestion: 'low' | 'medium' | 'high';
  };

  // Transaction Monitoring
  transactions: {
    txHash: string;
    type: 'mint' | 'transfer' | 'burn' | 'approve';
    from: string;
    to: string;
    amount: number;
    gasUsed: number;
    gasFee: number;
    confirmations: number;
    requiredConfirmations: number;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: Date;
    blockNumber: number;
  }[];

  // Event Logs
  events: {
    event: 'Transfer' | 'Approval' | 'Mint' | 'Burn';
    args: any;
    blockNumber: number;
    txHash: string;
  }[];
}
```

---

## FASE 8: Active Management

### 🎯 Objetivo
Gestionar activamente el portafolio y calcular NAV regularmente.

### 👥 Actores
- **Portfolio Manager** (Admin Client)
- **Traders** (Admin Client)
- **NAV Administrator** (Admin Client)

### 📊 Procesos

#### 8.1. NAV Calculation
**Dashboard necesario:** NAV Calculation Engine

**Funcionalidades:**
- Real-time asset pricing
- Accrual calculations
- Expense allocation
- NAV calculator
- NAV history & waterfall

**NAV Formula:**
```typescript
interface NAVCalculation {
  // Assets
  assets: {
    marketableSecurities: number; // Mark-to-market
    cash: number;
    cryptoAssets: number;
    receivables: number;
    other: number;
    totalAssets: number;
  };

  // Liabilities
  liabilities: {
    payables: number;
    accruedFees: number;
    accruedExpenses: number;
    deferredRevenue: number;
    other: number;
    totalLiabilities: number;
  };

  // NAV Calculation
  navCalculation: {
    grossAssetValue: number; // Total Assets
    totalLiabilities: number;
    netAssetValue: number; // GAV - Liabilities
    sharesOutstanding: number;
    navPerShare: number; // NAV / Shares Outstanding
  };

  // Per Share Class
  shareClasses: {
    class: 'A' | 'B' | 'C';
    sharesOutstanding: number;
    adjustmentFactor: number; // For different fee structures
    navPerShare: number;
  }[];

  // Historical
  priorNav: number;
  navChange: number;
  navChangePercent: number;

  // Publication
  calculationDate: Date;
  calculationTime: string;
  publishedDate: Date;
  auditor: string;
  approved: boolean;
}
```

---

#### 8.2. Portfolio Rebalancing
**Dashboard necesario:** Rebalancing Manager

**Funcionalidades:**
- Target allocation setter
- Drift monitor
- Rebalancing calculator
- Trade order generator
- Execution tracker

**Rebalancing Process:**
```typescript
interface RebalancingProcess {
  // Target Allocation
  targetAllocation: {
    asset: string;
    targetWeight: number; // %
    minWeight: number;
    maxWeight: number;
  }[];

  // Current Allocation
  currentAllocation: {
    asset: string;
    currentValue: number;
    currentWeight: number;
    drift: number; // Difference from target
  }[];

  // Rebalancing Triggers
  triggers: {
    scheduledRebalancing: {
      frequency: 'monthly' | 'quarterly';
      nextDate: Date;
    };
    thresholdRebalancing: {
      driftThreshold: number; // % deviation from target
      triggered: boolean;
    };
  };

  // Proposed Trades
  proposedTrades: {
    asset: string;
    action: 'buy' | 'sell';
    quantity: number;
    estimatedPrice: number;
    estimatedCost: number;
    reason: string;
  }[];

  // Transaction Cost Analysis
  tca: {
    estimatedSlippage: number;
    estimatedFees: number;
    marketImpact: number;
    totalCost: number;
    netBenefit: number;
  };

  // Execution
  execution: {
    approved: boolean;
    approver: string;
    executionDate: Date;
    actualTrades: {
      asset: string;
      quantity: number;
      avgPrice: number;
      totalCost: number;
      variance: number; // vs estimated
    }[];
  };
}
```

---

#### 8.3. Trading Operations
**Dashboard necesario:** Trading Dashboard

**Funcionalidades:**
- Order management system (OMS)
- Execution management system (EMS)
- Best execution tracker
- Pre-trade compliance
- Post-trade allocation

**Trading Workflow:**
```typescript
interface TradingOperations {
  // Order Entry
  order: {
    orderId: string;
    fundId: string;
    trader: string;
    orderType: 'market' | 'limit' | 'stop' | 'stop-limit';
    side: 'buy' | 'sell';
    asset: string;
    quantity: number;
    limitPrice?: number;
    stopPrice?: number;
    timeInForce: 'GTC' | 'GTD' | 'IOC' | 'FOK';
    destination: 'Coinbase' | 'Binance' | 'OTC' | 'DEX';
  };

  // Pre-Trade Compliance
  preTrade: {
    checks: [
      { rule: 'Position limit', passed: boolean },
      { rule: 'Concentration limit', passed: boolean },
      { rule: 'Restricted list', passed: boolean },
      { rule: 'Available cash', passed: boolean }
    ];
    approved: boolean;
  };

  // Execution
  execution: {
    executionId: string;
    executions: {
      time: Date;
      quantity: number;
      price: number;
      venue: string;
      commission: number;
    }[];
    avgExecutionPrice: number;
    totalQuantityFilled: number;
    status: 'open' | 'partial' | 'filled' | 'canceled';
  };

  // Best Execution Analysis
  bestExecution: {
    benchmark: 'arrival-price' | 'VWAP' | 'TWAP';
    benchmarkPrice: number;
    executionPrice: number;
    slippage: number; // bps
    executionQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
  };

  // Post-Trade Allocation
  allocation: {
    totalQuantity: number;
    allocations: {
      fundId: string;
      allocationPercent: number;
      allocatedQuantity: number;
      allocatedValue: number;
    }[];
  };
}
```

---

#### 8.4. Risk Management
**Dashboard necesario:** Risk Dashboard

**Funcionalidades:**
- VaR calculator
- Stress testing
- Scenario analysis
- Limit monitoring
- Risk reporting

**Risk Metrics:**
```typescript
interface RiskManagement {
  // Market Risk
  marketRisk: {
    var: {
      method: 'historical' | 'parametric' | 'monte-carlo';
      confidenceLevel: 0.95 | 0.99;
      timeHorizon: 1 | 10; // days
      value: number; // $ at risk
      percentage: number; // % of NAV
    };
    cvar: number; // Conditional VaR (expected loss beyond VaR)
    beta: number; // vs benchmark
    volatility: number; // annualized
    sharpeRatio: number;
    maxDrawdown: number;
  };

  // Concentration Risk
  concentrationRisk: {
    largestPosition: {
      asset: string;
      weight: number;
      limit: number;
      breach: boolean;
    };
    top5Concentration: number; // % in top 5 holdings
    herfindahlIndex: number; // Concentration index
  };

  // Liquidity Risk
  liquidityRisk: {
    liquidAssets: number; // % that can be sold in 1 day
    liquidityRatio: number;
    estimatedLiquidationTime: number; // days to liquidate 100%
    redemptionsCovered: number; // days of redemptions covered by liquid assets
  };

  // Counterparty Risk
  counterpartyRisk: {
    exposures: {
      counterparty: string;
      exposure: number;
      creditRating: string;
      limit: number;
      utilization: number;
    }[];
  };

  // Operational Risk
  operationalRisk: {
    incidents: {
      date: Date;
      type: string;
      severity: 'low' | 'medium' | 'high';
      impact: number;
      resolved: boolean;
    }[];
  };
}
```

---

## FASE 9: Secondary Market Trading

### 🎯 Objetivo
Facilitar trading entre inversores y proveer liquidez.

### 👥 Actores
- **Investors** (Buyer & Seller)
- **Market Maker** (Admin Owner/External)
- **Exchange** (Internal/External Platform)

### 📊 Procesos

#### 9.1. Order Book Management
**Dashboard necesario:** Trading Platform

**Funcionalidades:**
- Order book visualization
- Limit order placement
- Market order execution
- Order matching engine
- Trading history

**Order Book:**
```typescript
interface OrderBook {
  asset: string;

  // Bids (Buy Orders)
  bids: {
    price: number;
    quantity: number;
    totalValue: number;
    numOrders: number;
  }[];

  // Asks (Sell Orders)
  asks: {
    price: number;
    quantity: number;
    totalValue: number;
    numOrders: number;
  }[];

  // Spread
  spread: {
    bestBid: number;
    bestAsk: number;
    spreadBps: number;
    midPrice: number;
  };

  // Market Depth
  depth: {
    bidsDepth: number; // Total $ on bid side
    asksDepth: number;
    depthRatio: number;
  };

  // Recent Trades
  recentTrades: {
    timestamp: Date;
    price: number;
    quantity: number;
    side: 'buy' | 'sell';
    aggressor: 'buyer' | 'seller';
  }[];
}
```

---

#### 9.2. Market Making
**Dashboard necesario:** Market Maker Dashboard

**Funcionalidades:**
- Spread configurator
- Inventory management
- Quote generator
- P&L tracker
- Risk limits

**Market Making Strategy:**
```typescript
interface MarketMakingStrategy {
  // Quoting Strategy
  quoting: {
    spreadBps: number; // Spread in basis points
    quoteSize: number; // Size per level
    numLevels: number; // Number of price levels
    skewFactor: number; // Adjust based on inventory

    // Dynamic Spread
    dynamicSpread: {
      baseSpread: number;
      volatilityAdjustment: number;
      inventoryAdjustment: number;
      finalSpread: number;
    };
  };

  // Inventory Management
  inventory: {
    currentPosition: number;
    targetPosition: number; // Usually 0 (market neutral)
    maxPosition: number; // Risk limit
    positionLimit: number;

    // Inventory Skew
    skew: number; // If long, widen asks and tighten bids
  };

  // Risk Management
  riskLimits: {
    maxDailyLoss: number;
    currentDailyPnl: number;
    pauseThreshold: number; // Stop quoting if loss exceeds
    positionLimit: number;
    concentrationLimit: number;
  };

  // Performance
  performance: {
    totalTrades: number;
    grossPnl: number;
    tradingFees: number;
    netPnl: number;
    returnOnCapital: number;
    sharpeRatio: number;
  };
}
```

---

#### 9.3. Price Discovery
**Dashboard necesario:** Price Discovery Analytics

**Funcionalidades:**
- NAV vs Market Price tracker
- Premium/Discount monitor
- Fair value calculator
- Arbitrage detector
- Price impact simulator

**Price Discovery:**
```typescript
interface PriceDiscovery {
  // Reference Prices
  prices: {
    nav: number; // Official NAV
    lastTrade: number; // Last traded price
    bidPrice: number;
    askPrice: number;
    midPrice: number;
    vwap: number; // Volume-weighted avg price
    twap: number; // Time-weighted avg price
  };

  // Premium/Discount
  premiumDiscount: {
    vsNav: number; // % premium/discount to NAV
    vsHistoricalAvg: number;
    inRange: boolean;

    // Arbitrage Opportunity
    arbitrage: {
      opportunity: boolean;
      potentialProfit: number;
      mechanism: 'creation-redemption' | 'market-buy-redeem';
    };
  };

  // Price Impact
  priceImpact: {
    buyImpact: {
      size: number;
      estimatedPrice: number;
      slippageBps: number;
    };
    sellImpact: {
      size: number;
      estimatedPrice: number;
      slippageBps: number;
    };
  };

  // Liquidity Metrics
  liquidity: {
    dailyVolume: number;
    avgDailyVolume: number; // 30-day avg
    bidAskSpreadBps: number;
    liquidityScore: number; // 0-100
  };
}
```

---

## FASE 10: Redemption & Exit

### 🎯 Objetivo
Procesar solicitudes de redemption y exits de inversores.

### 👥 Actores
- **Investor** (Initiator)
- **Transfer Agent** (Admin Client)
- **Finance Team** (Admin Client)

### 📊 Procesos

#### 10.1. Redemption Request
**Dashboard necesario:** Redemption Management

**Funcionalidades:**
- Redemption request form
- Lock-up checker
- Fee calculator
- Queue management
- Status tracker

**Redemption Workflow:**
```typescript
interface RedemptionProcess {
  // Request Details
  request: {
    requestId: string;
    investorId: string;
    fundId: string;
    requestDate: Date;

    // Redemption Type
    type: 'full' | 'partial';
    sharesRedeeming: number;
    percentageRedeeming: number;

    // Eligibility Check
    eligibility: {
      lockUpExpired: boolean;
      lockUpExpiryDate: Date;
      minHoldingPeriod: boolean;
      noticePeriodMet: boolean;
      noticeDeadline: Date;
    };
  };

  // Redemption Terms
  terms: {
    redemptionFrequency: 'monthly' | 'quarterly';
    noticePeriod: number; // days
    redemptionFee: number; // %
    earlyRedemptionPenalty: number; // % if within lock-up

    // Gate Provisions
    gate: {
      active: boolean;
      monthlyLimit: number; // % of NAV
      currentMonthRedemptions: number;
      available: number;
      queuePosition?: number;
    };
  };

  // Calculations
  calculations: {
    sharesRedeeming: number;
    navAtRedemption: number; // Will be determined at redemption date
    grossProceeds: number;
    redemptionFee: number;
    earlyPenalty: number;
    taxWithholding: number;
    netProceeds: number;
  };

  // Schedule
  schedule: {
    requestDate: Date;
    redemptionDate: Date; // Next redemption window
    navStrikeDate: Date;
    paymentDate: Date; // T+3 or as per terms
  };

  // Status
  status: 'submitted' | 'queued' | 'approved' | 'processing' | 'completed' | 'rejected';

  // Payment
  payment: {
    method: 'wire' | 'crypto';
    wireDetails?: {
      accountNumber: string;
      routingNumber: string;
    };
    cryptoDetails?: {
      address: string;
      network: string;
    };
    txHash?: string;
    paidDate?: Date;
  };
}
```

---

#### 10.2. In-Kind Redemption
**Dashboard necesario:** In-Kind Redemption Manager

**Funcionalidades:**
- Asset selector
- In-kind basket builder
- Valuation calculator
- Transfer coordinator
- Tax optimizer

**In-Kind Redemption:**
```typescript
interface InKindRedemption {
  // Redemption Details
  redemption: {
    investorId: string;
    sharesRedeeming: number;
    navValue: number;
  };

  // In-Kind Basket
  basket: {
    assets: {
      symbol: string;
      quantity: number;
      price: number;
      value: number;
      percentOfBasket: number;
    }[];
    totalValue: number;
    cashBalancing: number; // Small cash amount to exactly match NAV
  };

  // Transfer Details
  transfers: {
    asset: string;
    fromAddress: string; // Fund custody
    toAddress: string; // Investor wallet
    quantity: number;
    txHash: string;
    status: 'pending' | 'confirmed';
  }[];

  // Tax Implications
  taxImplications: {
    costBasis: number;
    fairMarketValue: number;
    gainLoss: number;
    capitalGainsTreatment: 'short-term' | 'long-term';
  };
}
```

---

#### 10.3. Redemption Gates & Queues
**Dashboard necesario:** Gate Management

**Funcionalidades:**
- Gate activation
- Queue manager
- Pro-rata calculator
- Investor communication
- Historical gates tracker

**Gate Management:**
```typescript
interface GateManagement {
  // Gate Status
  gate: {
    active: boolean;
    reason: string;
    activationDate: Date;

    // Limits
    monthlyLimit: number; // % of NAV
    quarterlyLimit: number;

    // Current Period
    currentPeriod: {
      periodStart: Date;
      periodEnd: Date;
      totalRequested: number;
      totalApproved: number;
      remaining: number;
    };
  };

  // Redemption Queue
  queue: {
    requests: {
      requestId: string;
      investorId: string;
      requestDate: Date;
      amount: number;
      priority: number; // FIFO
      status: 'queued' | 'partially-filled' | 'filled';
    }[];

    // Queue Processing
    processing: 'FIFO' | 'pro-rata';

    // Pro-Rata Allocation
    proRata: {
      totalRequested: number;
      availableCapacity: number;
      proRataPercent: number;

      allocations: {
        investorId: string;
        requested: number;
        allocated: number;
        queued: number;
      }[];
    };
  };

  // Historical Gates
  history: {
    date: Date;
    duration: number; // days
    totalRedemptionsBlocked: number;
    averageQueueTime: number;
    investorsAffected: number;
  }[];
}
```

---

## FASE 11: Reporting & Tax

### 🎯 Objetivo
Generar reportes financieros y documentos fiscales para stakeholders.

### 👥 Actores
- **Fund Administrator** (Admin Client)
- **Accountant** (Admin Owner)
- **Auditor** (External)
- **Investor** (Recipient)

### 📊 Procesos

#### 11.1. Investor Reporting
**Dashboard necesario:** Investor Reporting Portal

**Funcionalidades:**
- Report generator
- Report scheduler
- Distribution manager
- Report library
- Custom report builder

**Report Types:**
```typescript
interface InvestorReporting {
  // Monthly Statements
  monthlyStatement: {
    period: string; // 'YYYY-MM'

    // Account Summary
    summary: {
      beginningBalance: number;
      contributions: number;
      redemptions: number;
      gainLoss: number;
      fees: number;
      endingBalance: number;
    };

    // Performance
    performance: {
      monthReturn: number;
      ytdReturn: number;
      inceptionReturn: number;
      benchmarkReturn: number;
      alpha: number;
    };

    // Holdings
    holdings: {
      asset: string;
      shares: number;
      price: number;
      value: number;
      weight: number;
    }[];

    // Transactions
    transactions: {
      date: Date;
      type: string;
      description: string;
      shares: number;
      price: number;
      amount: number;
    }[];
  };

  // Quarterly Reports
  quarterlyReport: {
    period: string; // 'Q1 2024'

    // Management Commentary
    commentary: {
      marketOutlook: string;
      portfolioStrategy: string;
      performanceAttribution: string;
      riskManagement: string;
    };

    // Detailed Performance
    performanceAttribution: {
      source: string;
      contribution: number;
    }[];

    // Risk Metrics
    riskMetrics: {
      volatility: number;
      sharpe: number;
      sortino: number;
      maxDrawdown: number;
      beta: number;
    };
  };

  // Annual Reports
  annualReport: {
    year: number;

    // Audited Financials
    financials: {
      balanceSheet: any;
      incomeStatement: any;
      cashFlowStatement: any;
      notesToFinancials: string[];
    };

    // Auditor Opinion
    auditorOpinion: {
      auditor: string;
      opinion: 'unqualified' | 'qualified' | 'adverse';
      report: string;
    };
  };

  // Ad-Hoc Reports
  adHocReports: {
    type: 'capital-call' | 'distribution' | 'corporate-action' | 'tax';
    date: Date;
    content: any;
  }[];
}
```

---

#### 11.2. Tax Reporting
**Dashboard necesario:** Tax Center

**Funcionalidades:**
- Tax document generator
- 1099 creator (US)
- K-1 generator (for partnerships)
- Tax lot tracker
- Wash sale calculator
- Tax optimization tools

**Tax Documents:**
```typescript
interface TaxReporting {
  // Form 1099-DIV (Dividends)
  form1099DIV: {
    year: number;
    payerTIN: string;
    recipientTIN: string;

    box1a_ordinaryDividends: number;
    box1b_qualifiedDividends: number;
    box2a_totalCapitalGain: number;
    box3_nondividendDistributions: number;

    foreignTaxPaid: number;
  };

  // Schedule K-1 (Partnership)
  scheduleK1: {
    year: number;
    partnershipEIN: string;
    partnerTIN: string;

    // Income
    ordinaryIncome: number;
    rentalIncome: number;
    interestIncome: number;
    dividendIncome: number;

    // Gains/Losses
    shortTermCapitalGain: number;
    longTermCapitalGain: number;
    section1231Gain: number;

    // Deductions
    charitableContributions: number;

    // Credits
    foreignTaxCredit: number;

    // Other
    amtAdjustments: number;
  };

  // Realized Gains/Losses
  capitalGainsReport: {
    transactions: {
      dateAcquired: Date;
      dateSold: Date;
      description: string;
      quantity: number;
      costBasis: number;
      proceeds: number;
      gainLoss: number;
      term: 'short' | 'long';
      washSale: boolean;
    }[];

    summary: {
      shortTermGain: number;
      longTermGain: number;
      totalGain: number;
    };
  };

  // Cost Basis Tracking
  costBasis: {
    method: 'FIFO' | 'LIFO' | 'SpecID' | 'AvgCost';

    lots: {
      lotId: string;
      asset: string;
      acquiredDate: Date;
      quantity: number;
      costBasis: number;
      currentValue: number;
      unrealizedGain: number;
    }[];
  };
}
```

---

#### 11.3. Regulatory Reporting
**Dashboard necesario:** Regulatory Filings

**Funcionalidades:**
- Form PF generator (Private Fund)
- Form D updates
- Form ADV updates
- SAR filing (Suspicious Activity)
- CTR filing (Currency Transaction)

**Regulatory Filings:**
```typescript
interface RegulatoryReporting {
  // Form PF (Private Fund Reporting)
  formPF: {
    filingType: 'annual' | 'quarterly';
    fiscalYearEnd: Date;

    // Section 1: Reporting Fund Information
    section1: {
      grossAssetValue: number;
      netAssetValue: number;
      percentageOwnership: number;
      investorCount: number;

      // Beneficial Ownership
      beneficialOwners: {
        name: string;
        ownership: number;
      }[];
    };

    // Section 2: Fund Strategy
    section2: {
      primaryStrategy: string;
      leverage: number;
      derivatives: boolean;
      shortSelling: boolean;
    };

    // Section 3: Exposures
    section3: {
      longExposure: number;
      shortExposure: number;
      netEquityExposure: number;
      grossNotional: number;
    };

    // Section 4: Liquidity
    section4: {
      liquidAssets: number;
      illiquidAssets: number;
      redemptionFrequency: string;
      lockUpProvisions: string;
    };
  };

  // SAR (Suspicious Activity Report)
  sar: {
    filingDate: Date;
    suspiciousActivity: {
      dateOfActivity: Date;
      subject: string;
      amountInvolved: number;
      description: string;
      redFlags: string[];
    };
    lawEnforcementContact: boolean;
  };

  // Form D Updates
  formD: {
    amendment: boolean;
    dateOfFirstSale: Date;

    totalOfferingAmount: number;
    totalAmountSold: number;
    totalRemaining: number;

    numberOfInvestors: number;
  };
}
```

---

## 🔄 PROCESOS TRANSVERSALES

### Audit Trail
**Todo debe quedar registrado:**
```typescript
interface AuditTrail {
  eventId: string;
  timestamp: Date;
  actor: string; // User ID
  action: string; // 'create', 'update', 'delete', 'approve', 'reject'
  resource: string; // 'fund', 'transaction', 'investor', etc.
  resourceId: string;
  before: any; // State before action
  after: any; // State after action
  ipAddress: string;
  userAgent: string;
  metadata: {
    reason?: string;
    approvalLevel?: string;
    complianceChecks?: string[];
  };
}
```

### Notifications System
```typescript
interface NotificationSystem {
  // Notification Types
  types: {
    transactional: ['subscription-confirmed', 'redemption-processed', 'dividend-paid'];
    informational: ['nav-published', 'report-available', 'deadline-reminder'];
    alerts: ['compliance-issue', 'risk-limit-breach', 'system-downtime'];
  };

  // Channels
  channels: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    push: boolean;
  };

  // User Preferences
  preferences: {
    userId: string;
    subscriptions: {
      type: string;
      enabled: boolean;
      channels: string[];
    }[];
  };
}
```

### Workflow Engine
```typescript
interface WorkflowEngine {
  // Approval Workflows
  workflows: {
    name: string;
    trigger: string; // Event that starts workflow

    steps: {
      stepId: number;
      name: string;
      type: 'approval' | 'notification' | 'action' | 'condition';

      // Approval Step
      approvers?: string[]; // User IDs or roles
      approvalType?: 'any' | 'all' | 'majority';

      // Condition Step
      condition?: string; // Expression to evaluate
      ifTrue?: number; // Next step if true
      ifFalse?: number; // Next step if false

      // Action Step
      action?: string; // Function to execute
      parameters?: any;
    }[];
  }[];

  // Example: Large Redemption Approval
  exampleWorkflow: {
    name: 'Large Redemption Approval';
    trigger: 'redemption_request_created';

    steps: [
      {
        stepId: 1;
        type: 'condition';
        condition: 'amount > 1000000';
        ifTrue: 2;
        ifFalse: 5; // Auto-approve if < $1M
      },
      {
        stepId: 2;
        type: 'approval';
        name: 'Fund Manager Approval';
        approvers: ['fund-manager'];
        approvalType: 'any';
      },
      {
        stepId: 3;
        type: 'approval';
        name: 'Risk Officer Approval';
        approvers: ['risk-officer'];
        approvalType: 'any';
      },
      {
        stepId: 4;
        type: 'approval';
        name: 'CFO Approval';
        approvers: ['cfo'];
        approvalType: 'any';
      },
      {
        stepId: 5;
        type: 'action';
        action: 'process_redemption';
        parameters: { autoExecute: true };
      }
    ];
  };
}
```

---

## 📊 MÉTRICAS DE NEGOCIO

### KPIs para Admin Owner
```typescript
interface PlatformKPIs {
  // Business Metrics
  business: {
    totalAUM: number;
    totalFunds: number;
    totalInvestors: number;
    totalRevenue: number;

    // Growth
    aumGrowth: number; // MoM %
    investorGrowth: number;
    fundLaunches: number;
  };

  // Revenue Metrics
  revenue: {
    managementFees: number;
    performanceFees: number;
    subscriptionFees: number;
    otherRevenue: number;
    totalRevenue: number;

    revenueByFund: {
      fundId: string;
      revenue: number;
    }[];
  };

  // Operational Efficiency
  efficiency: {
    costToIncome: number; // Operating costs / Revenue
    aumPerEmployee: number;
    averageTransactionCost: number;
    automationRate: number; // % of transactions automated
  };

  // Technology Metrics
  technology: {
    systemUptime: number; // %
    avgResponseTime: number; // ms
    transactionsPerDay: number;
    blockchainGasCosts: number;
  };
}
```

### KPIs para Admin Client (Fund Manager)
```typescript
interface FundKPIs {
  // Performance
  performance: {
    mtdReturn: number;
    qtdReturn: number;
    ytdReturn: number;
    inceptionReturn: number;

    // Risk-Adjusted
    sharpe: number;
    sortino: number;
    alpha: number;
    beta: number;
  };

  // Flows
  flows: {
    subscriptions: number;
    redemptions: number;
    netFlows: number;
    redemptionRate: number; // % of AUM
  };

  // Investor Metrics
  investors: {
    totalInvestors: number;
    activeInvestors: number;
    averageAccountSize: number;
    investorRetention: number; // % retained YoY
  };

  // Trading
  trading: {
    totalTrades: number;
    avgTradeSize: number;
    winRate: number;
    profitFactor: number;
  };
}
```

### KPIs para Investor
```typescript
interface InvestorKPIs {
  // Personal Performance
  performance: {
    totalReturn: number; // $
    totalReturnPercent: number; // %
    ytdReturn: number;

    // Benchmarking
    vsBenchmark: number;
    ranking: number; // Percentile among investors
  };

  // Portfolio
  portfolio: {
    totalValue: number;
    totalInvested: number;
    unrealizedGain: number;
    realizedGain: number;

    diversification: number; // Number of funds
  };

  // Activity
  activity: {
    numberOfTransactions: number;
    averageTransactionSize: number;
    lastTransactionDate: Date;
    accountAge: number; // days
  };
}
```

---

## 🎯 RESUMEN DE DASHBOARDS NECESARIOS

### Admin Owner Portal (15 dashboards)
1. Asset Pipeline Dashboard
2. Due Diligence Tracker
3. Valuation Model Dashboard
4. IC Approval Workflow
5. Product Structuring Studio
6. Smart Contract Factory
7. Custody Configuration
8. Regulatory Filings Dashboard
9. KYC/AML Management System
10. Compliance Monitoring Dashboard
11. Marketing Materials Studio
12. CRM & Lead Management
13. Roadshow Management
14. Platform KPIs Dashboard
15. Audit Logs Viewer ✅

### Admin Client Portal (13 dashboards)
1. NAV Calculation Engine ✅
2. Rebalancing Manager
3. Trading Dashboard (OMS/EMS)
4. Risk Dashboard
5. Subscription Workflow
6. Subscription Calendar
7. Capital Call Management
8. Settlement Dashboard
9. Custody Management
10. Redemption Management
11. Gate Management
12. Investor Reporting Portal
13. Tax Center

### Investor Portal (8 dashboards)
1. Onboarding Flow
2. Suitability Questionnaire
3. Wallet Onboarding
4. Portfolio Overview ✅
5. Performance Analytics ✅
6. Trading Platform (Order Entry)
7. Subscription Interface
8. Tax Documents Center

**Total:** 36 dashboards especializados

---

## 🔗 INTEGRACIÓN NAVEO ↔ ORIUM (ONION)

Para asegurar que el flujo descrito aquí evolucione en paralelo al roadmap de wallet-opcion/onion:

1. **Mapeo de dominios**  
   - Origination, Structuring y Compliance → usar los módulos descritos en `docs/NAVEO_VS_ONION.md` para heredar Launchpad, Token Studio y KYC multinivel.  
   - Trading y Liquidez → reutilizar `orders`, `transactions`, `liquidity_pools`, `user_staking` definidos en `wallet-opcion/onion/docs/DB_ARCHITECTURE.md`.
2. **Tareas cruzadas**  
   - Registrar en `docs/CODEX_TASKS_EXPANDED.md` un owner compartido (Codex + Wallet Team) para cada fase 1–11.  
   - Sincronizar seeds (`supabase/seed.sql`) entre ambos proyectos para probar el flujo end-to-end.
3. **Dashboards compartidos**  
   - Admin Owner: Asset Pipeline, Due Diligence, Structuring Studio.  
   - Admin Client: Launchpad Ops, NAV Ops, Traders Desk.  
   - Investor: Onboarding Wizard, Subscription Center, Secondary Trading.
4. **Políticas y RLS**  
   - Importar policies (`kyc_verifications`, `system_events`, `user_notifications`) al schema actual de Naveo para habilitar la trazabilidad requerida por la plataforma wallet.
5. **Entrega coordinada**  
   - Cada release mayor debe incluir: tabla Supabase + UI + tareas en `docs/CODEX_TASKS.md` + actualización del comparativo `docs/NAVEO_VS_ONION.md`.

Este anexo debe actualizarse cada vez que el documento comparativo cambie, de modo que ambos equipos compartan la misma visión de módulos y dependencias.

---

## 📝 PRÓXIMOS PASOS

1. **Priorizar dashboards** según impacto en el flujo
2. **Crear wireframes** para cada dashboard
3. **Implementar backend** (Supabase schema para cada fase)
4. **Desarrollar frontend** página por página
5. **Integrar smart contracts** (cuando sea aplicable)
6. **Testing end-to-end** del flujo completo
7. **Documentación** para usuarios

---

**Documento creado:** 2025-11-10
**Última actualización:** 2025-11-10
**Versión:** 1.0
**Autor:** Claude Code

🚀 **Este es el roadmap completo para construir una plataforma institucional de tokenización de activos de nivel Investment Banking.**
