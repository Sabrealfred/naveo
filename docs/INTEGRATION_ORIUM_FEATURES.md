# 🔄 INTEGRACIÓN DE FUNCIONALIDADES ORIUM → NAVEO

**Documento:** Roadmap de Integración Orium/Onion Features
**Fecha:** 2025-11-10
**Versión:** 1.0
**Base:** NAVEO_VS_ONION.md + TOKENIZATION_WORKFLOW.md

---

## 📋 RESUMEN EJECUTIVO

Este documento detalla cómo integrar las funcionalidades avanzadas de **Orium/Onion** (wallet & trading platform) en el flujo de **Naveo** (investment banking & tokenization platform).

### Módulos Clave a Integrar:
1. ✅ **KYC Progresivo** (Niveles 0-3) + MFA
2. ✅ **Gestión de Wallets** (Custodial/Non-custodial)
3. ✅ **Trading Engine** (Order Book, Matching, Settlement)
4. ✅ **Launchpad & Token Studio**
5. ✅ **Staking & Liquidity Pools**
6. ✅ **Sistema de Notificaciones Avanzado**

---

## 🎯 FASE 1: KYC PROGRESIVO & MFA

### Descripción
Orium tiene un sistema de KYC progresivo con 4 niveles (0-3), cada uno con límites de inversión crecientes y requisitos diferentes. Naveo actualmente solo tiene un KYC básico.

### Integración Propuesta

#### 1.1. KYC Levels Database Schema
```sql
-- Agregar a supabase/migrations/002_kyc_levels.sql

CREATE TABLE kyc_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level INT NOT NULL CHECK (level >= 0 AND level <= 3),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  investment_limit DECIMAL(18, 2),
  requirements JSONB NOT NULL,
  verification_method VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO kyc_levels (level, name, description, investment_limit, requirements, verification_method) VALUES
(0, 'Básico', 'Solo email verificado', 5000, '{"email": true}', 'email-only'),
(1, 'Estándar', 'ID + Prueba de domicilio', 50000, '{"id": true, "address_proof": true, "selfie": true}', 'document-verification'),
(2, 'Avanzado', 'KYC completo + Source of wealth', 500000, '{"all_level1": true, "source_of_wealth": true, "bank_statement": true}', 'enhanced-verification'),
(3, 'Institucional', 'KYB completo + Due Diligence', NULL, '{"kyb_documents": true, "beneficial_owners": true, "financial_statements": true, "legal_opinion": true}', 'institutional-verification');

CREATE TABLE kyc_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level INT NOT NULL REFERENCES kyc_levels(level),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-review', 'approved', 'rejected', 'expired')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  expiry_date TIMESTAMPTZ,
  documents JSONB,
  notes TEXT,
  rejection_reason TEXT,
  UNIQUE(user_id, level)
);

-- User's current KYC level
ALTER TABLE profiles ADD COLUMN kyc_level INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN kyc_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN kyc_expiry_date TIMESTAMPTZ;

-- Index for fast lookups
CREATE INDEX idx_kyc_user_level ON kyc_verifications(user_id, level);
CREATE INDEX idx_kyc_status ON kyc_verifications(status);
```

#### 1.2. Frontend: KYC Level Upgrade Flow
**Nueva página:** `/investor/kyc-upgrade`

```typescript
// /frontend/src/portals/investor/pages/KYCUpgradePage.tsx

interface KYCLevel {
  level: number;
  name: string;
  investmentLimit: number;
  requirements: string[];
  status: 'locked' | 'available' | 'pending' | 'approved';
}

export default function KYCUpgradePage() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const levels: KYCLevel[] = [
    {
      level: 0,
      name: 'Básico',
      investmentLimit: 5000,
      requirements: ['Email verificado'],
      status: 'approved'
    },
    {
      level: 1,
      name: 'Estándar',
      investmentLimit: 50000,
      requirements: ['ID oficial', 'Selfie', 'Comprobante de domicilio'],
      status: 'available'
    },
    {
      level: 2,
      name: 'Avanzado',
      investmentLimit: 500000,
      requirements: ['Todo nivel 1', 'Fuente de recursos', 'Estado de cuenta'],
      status: 'locked'
    },
    {
      level: 3,
      name: 'Institucional',
      investmentLimit: Infinity,
      requirements: ['KYB completo', 'Beneficiarios finales', 'Estados financieros'],
      status: 'locked'
    }
  ];

  return (
    <div>
      <Title level={2}>Verificación de Identidad - Niveles KYC</Title>

      {/* Progress Steps */}
      <Steps current={currentLevel} style={{ marginBottom: 40 }}>
        {levels.map((level) => (
          <Steps.Step
            key={level.level}
            title={level.name}
            description={`Hasta $${level.investmentLimit.toLocaleString()}`}
            status={
              level.status === 'approved' ? 'finish' :
              level.status === 'pending' ? 'process' :
              level.status === 'available' ? 'wait' :
              'wait'
            }
          />
        ))}
      </Steps>

      {/* Level Cards */}
      <Row gutter={[16, 16]}>
        {levels.map((level) => (
          <Col xs={24} md={12} lg={6} key={level.level}>
            <Card
              hoverable={level.status === 'available'}
              style={{
                borderColor: level.status === 'approved' ? '#52c41a' : undefined,
                opacity: level.status === 'locked' ? 0.6 : 1
              }}
              actions={[
                level.status === 'approved' ? (
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                ) : level.status === 'available' ? (
                  <Button type="primary" onClick={() => upgradeToLevel(level.level)}>
                    Upgrade
                  </Button>
                ) : level.status === 'pending' ? (
                  <LoadingOutlined />
                ) : (
                  <LockOutlined />
                )
              ]}
            >
              <Statistic
                title={level.name}
                value={level.investmentLimit}
                prefix="$"
                formatter={(value) => value === Infinity ? '∞' : value.toLocaleString()}
              />
              <Divider />
              <Text strong>Requisitos:</Text>
              <ul>
                {level.requirements.map((req, i) => (
                  <li key={i}><Text type="secondary">{req}</Text></li>
                ))}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Upgrade Modal */}
      <Modal
        title={`Upgrade a Nivel ${selectedLevel}`}
        visible={selectedLevel !== null}
        onCancel={() => setSelectedLevel(null)}
        width={800}
      >
        {/* Document upload form based on level */}
      </Modal>
    </div>
  );
}
```

#### 1.3. MFA (Multi-Factor Authentication)
**Integración con Supabase Auth**

```typescript
// /frontend/src/hooks/useMFA.ts

import { useSupabaseClient } from '@supabase/auth-helpers-react';

export function useMFA() {
  const supabase = useSupabaseClient();

  const enableMFA = async (method: 'sms' | 'totp' | 'email') => {
    if (method === 'totp') {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (data) {
        return {
          qrCode: data.totp.qr_code,
          secret: data.totp.secret,
          factorId: data.id,
        };
      }
    }
    // Similar for SMS and email
  };

  const verifyMFA = async (factorId: string, code: string) => {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      code,
    });
    return { success: !error };
  };

  return { enableMFA, verifyMFA };
}
```

**UI:** `/investor/security`
- Enable/Disable MFA
- Backup codes
- Recovery email

---

## 🎯 FASE 2: WALLET MANAGEMENT

### Descripción
Orium soporta tanto wallets custodiales (managed) como non-custodiales (self-custody). Naveo actualmente no tiene gestión de wallets.

### Integración Propuesta

#### 2.1. Database Schema
```sql
-- supabase/migrations/003_wallets.sql

CREATE TYPE wallet_type AS ENUM ('custodial', 'non_custodial');
CREATE TYPE wallet_status AS ENUM ('active', 'locked', 'suspended', 'archived');

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type wallet_type NOT NULL,
  address VARCHAR(255) NOT NULL,
  network VARCHAR(50) NOT NULL DEFAULT 'ethereum',
  label VARCHAR(100),
  is_primary BOOLEAN DEFAULT false,
  status wallet_status DEFAULT 'active',
  balance JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  UNIQUE(address, network)
);

-- Wallet metadata for custodial wallets
CREATE TABLE wallet_metadata (
  wallet_id UUID PRIMARY KEY REFERENCES wallets(id) ON DELETE CASCADE,
  encrypted_private_key TEXT, -- Only for custodial wallets
  encryption_iv TEXT,
  recovery_email VARCHAR(255),
  backup_phrase_hash TEXT,
  mfa_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallet balances (denormalized for performance)
CREATE TABLE wallet_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  token_symbol VARCHAR(20) NOT NULL,
  token_address VARCHAR(255),
  balance DECIMAL(36, 18) NOT NULL DEFAULT 0,
  usd_value DECIMAL(18, 2),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wallet_id, token_symbol)
);

CREATE INDEX idx_wallet_user ON wallets(user_id);
CREATE INDEX idx_wallet_address ON wallets(address);
CREATE INDEX idx_wallet_balances ON wallet_balances(wallet_id, token_symbol);
```

#### 2.2. Frontend: Wallet Management
**Nueva página:** `/investor/wallet`

```typescript
// /frontend/src/portals/investor/pages/WalletManagementPage.tsx

export default function WalletManagementPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={2}>Mis Wallets</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddWalletModalVisible(true)}
        >
          Agregar Wallet
        </Button>
      </div>

      {/* Wallet Cards */}
      <Row gutter={[16, 16]}>
        {wallets.map((wallet) => (
          <Col xs={24} lg={12} key={wallet.id}>
            <Card
              title={
                <Space>
                  {wallet.type === 'custodial' ? (
                    <ShieldOutlined />
                  ) : (
                    <WalletOutlined />
                  )}
                  <Text>{wallet.label || 'Wallet Principal'}</Text>
                  {wallet.is_primary && <Tag color="blue">Principal</Tag>}
                </Space>
              }
              extra={
                <Dropdown
                  menu={{
                    items: [
                      { key: 'view', label: 'Ver detalles', icon: <EyeOutlined /> },
                      { key: 'rename', label: 'Renombrar', icon: <EditOutlined /> },
                      { key: 'set-primary', label: 'Establecer como principal' },
                      { type: 'divider' },
                      { key: 'export', label: 'Exportar clave privada', danger: true },
                      { key: 'delete', label: 'Eliminar', danger: true },
                    ]
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              }
            >
              {/* Address */}
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Dirección:</Text>
                <br />
                <Text copyable code style={{ fontSize: 12 }}>
                  {wallet.address}
                </Text>
              </div>

              {/* Network */}
              <div style={{ marginBottom: 16 }}>
                <Tag color="geekblue">{wallet.network.toUpperCase()}</Tag>
                <Tag color={wallet.status === 'active' ? 'green' : 'red'}>
                  {wallet.status.toUpperCase()}
                </Tag>
              </div>

              {/* Balances */}
              <Divider>Balances</Divider>
              {wallet.balances.map((balance) => (
                <div
                  key={balance.symbol}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8
                  }}
                >
                  <Text>{balance.symbol}</Text>
                  <Space>
                    <Text strong>{balance.balance}</Text>
                    <Text type="secondary">${balance.usdValue.toLocaleString()}</Text>
                  </Space>
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Wallet Modal */}
      <Modal
        title="Agregar Wallet"
        visible={addWalletModalVisible}
        onCancel={() => setAddWalletModalVisible(false)}
        width={600}
      >
        <Tabs>
          <Tabs.TabPane tab="Crear Custodial" key="custodial">
            <CreateCustodialWalletForm />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Conectar Existente" key="connect">
            <ConnectWalletForm />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Importar Seed Phrase" key="import">
            <ImportWalletForm />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
}
```

---

## 🎯 FASE 3: TRADING ENGINE

### Descripción
Orium tiene un trading engine completo con order book, matching engine, y atomic settlement. Naveo necesita esto para el mercado secundario.

### Integración Propuesta

#### 3.1. Database Schema
```sql
-- supabase/migrations/004_trading.sql

CREATE TYPE order_type AS ENUM ('market', 'limit', 'stop', 'stop_limit');
CREATE TYPE order_side AS ENUM ('buy', 'sell');
CREATE TYPE order_status AS ENUM ('open', 'partial', 'filled', 'canceled', 'expired', 'rejected');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fund_id UUID REFERENCES funds(id),
  order_type order_type NOT NULL,
  side order_side NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL CHECK (quantity > 0),
  price DECIMAL(18, 2), -- NULL for market orders
  stop_price DECIMAL(18, 2), -- For stop orders
  filled_quantity DECIMAL(18, 8) DEFAULT 0,
  avg_fill_price DECIMAL(18, 2),
  status order_status DEFAULT 'open',
  time_in_force VARCHAR(10) DEFAULT 'GTC', -- GTC, GTD, IOC, FOK
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  canceled_at TIMESTAMPTZ,
  filled_at TIMESTAMPTZ
);

CREATE TABLE order_fills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  matched_order_id UUID REFERENCES orders(id),
  quantity DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 2) NOT NULL,
  fee DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settlement_tx_hash VARCHAR(255)
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id),
  fund_id UUID REFERENCES funds(id),
  type VARCHAR(50) NOT NULL, -- 'trade', 'deposit', 'withdrawal', 'subscription', 'redemption'
  quantity DECIMAL(18, 8) NOT NULL,
  price DECIMAL(18, 2),
  amount DECIMAL(18, 2) NOT NULL,
  fee DECIMAL(18, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

-- Indexes for order matching
CREATE INDEX idx_orders_fund_side_status ON orders(fund_id, side, status) WHERE status = 'open';
CREATE INDEX idx_orders_price ON orders(price) WHERE status = 'open';
CREATE INDEX idx_orders_created ON orders(created_at) WHERE status = 'open';

-- Triggers
CREATE OR REPLACE FUNCTION update_order_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.filled_quantity >= NEW.quantity THEN
    NEW.status := 'filled';
    NEW.filled_at := NOW();
  ELSIF NEW.filled_quantity > 0 THEN
    NEW.status := 'partial';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_status
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_status();
```

#### 3.2. Edge Function: Order Matching
```typescript
// supabase/functions/match-orders/index.ts

import { createClient } from '@supabase/supabase-js';

interface Order {
  id: string;
  user_id: string;
  fund_id: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  filled_quantity: number;
  created_at: string;
}

export async function matchOrders(newOrder: Order, supabase) {
  // Get opposite side orders sorted by price-time priority
  const oppositeSide = newOrder.side === 'buy' ? 'sell' : 'buy';

  const { data: matchingOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('fund_id', newOrder.fund_id)
    .eq('side', oppositeSide)
    .eq('status', 'open')
    .order('price', { ascending: newOrder.side === 'buy' }) // Buy: lowest ask first, Sell: highest bid first
    .order('created_at', { ascending: true }); // FIFO for same price

  let remainingQuantity = newOrder.quantity - newOrder.filled_quantity;
  const fills = [];

  for (const matchOrder of matchingOrders) {
    if (remainingQuantity <= 0) break;

    // Check if prices cross
    const priceMatch = newOrder.side === 'buy'
      ? !newOrder.price || newOrder.price >= matchOrder.price
      : !newOrder.price || newOrder.price <= matchOrder.price;

    if (!priceMatch) break;

    // Calculate fill quantity
    const matchRemainingQty = matchOrder.quantity - matchOrder.filled_quantity;
    const fillQuantity = Math.min(remainingQuantity, matchRemainingQty);
    const fillPrice = matchOrder.price; // Maker price

    // Create fill record
    fills.push({
      order_id: newOrder.id,
      matched_order_id: matchOrder.id,
      quantity: fillQuantity,
      price: fillPrice,
      fee: fillQuantity * fillPrice * 0.002, // 0.2% fee
    });

    // Update quantities
    remainingQuantity -= fillQuantity;

    // Update matched order
    await supabase
      .from('orders')
      .update({
        filled_quantity: matchOrder.filled_quantity + fillQuantity,
      })
      .eq('id', matchOrder.id);
  }

  // Insert fills
  if (fills.length > 0) {
    await supabase.from('order_fills').insert(fills);

    // Update new order
    const totalFilled = fills.reduce((sum, fill) => sum + fill.quantity, 0);
    const avgPrice = fills.reduce((sum, fill) => sum + fill.price * fill.quantity, 0) / totalFilled;

    await supabase
      .from('orders')
      .update({
        filled_quantity: newOrder.filled_quantity + totalFilled,
        avg_fill_price: avgPrice,
      })
      .eq('id', newOrder.id);
  }

  return fills;
}
```

#### 3.3. Frontend: Order Book & Trading
Ya documentado en CODEX_TASKS_EXPANDED.md Tarea 7.1

---

## 🎯 FASE 4: LAUNCHPAD & TOKEN STUDIO

### Descripción
Orium tiene un módulo completo de launchpad para nuevos tokens. Naveo puede usarlo para lanzar nuevos fondos tokenizados.

### Integración Propuesta

#### 4.1. Database Schema
```sql
-- supabase/migrations/005_launchpad.sql

CREATE TYPE launchpad_status AS ENUM (
  'draft',
  'due_diligence',
  'approved',
  'fundraising',
  'funded',
  'live',
  'closed',
  'rejected'
);

CREATE TABLE launchpad_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  creator_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status launchpad_status DEFAULT 'draft',

  -- Fundraising Terms
  target_raise DECIMAL(18, 2) NOT NULL,
  min_investment DECIMAL(18, 2) DEFAULT 1000,
  max_investment DECIMAL(18, 2),
  token_price DECIMAL(18, 2) NOT NULL,
  total_tokens BIGINT NOT NULL,

  -- Timeline
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  vesting_start TIMESTAMPTZ,
  vesting_duration_months INT,

  -- Progress
  amount_raised DECIMAL(18, 2) DEFAULT 0,
  num_investors INT DEFAULT 0,

  -- Documents
  pitch_deck_url TEXT,
  whitepaper_url TEXT,
  term_sheet_url TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  launched_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE TABLE launchpad_investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES launchpad_projects(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(18, 2) NOT NULL,
  tokens_allocated BIGINT NOT NULL,
  payment_method VARCHAR(50),
  payment_tx_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  vesting_schedule JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, investor_id)
);

CREATE TABLE due_diligence_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES launchpad_projects(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  item VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  documents JSONB
);
```

#### 4.2. Frontend: Launchpad Dashboard
**Nueva página:** `/admin-owner/launchpad`

```typescript
// Similar structure to Asset Pipeline
// Kanban board: Draft → Due Diligence → Approved → Fundraising → Live
// Con métricas de cada proyecto (progress, amount raised, etc.)
```

---

## 🎯 FASE 5: STAKING & LIQUIDITY POOLS

### Descripción
Orium tiene staking pools para generar yield. Naveo puede ofrecer esto a inversores.

### Integración Propuesta

#### 5.1. Database Schema
```sql
-- supabase/migrations/006_staking.sql

CREATE TABLE staking_pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID REFERENCES funds(id),
  name VARCHAR(255) NOT NULL,
  apy DECIMAL(5, 2) NOT NULL,
  min_stake DECIMAL(18, 8) DEFAULT 0,
  max_stake DECIMAL(18, 8),
  lock_period_days INT,
  total_staked DECIMAL(36, 18) DEFAULT 0,
  total_rewards_distributed DECIMAL(36, 18) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_staking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES staking_pools(id) ON DELETE CASCADE,
  amount_staked DECIMAL(36, 18) NOT NULL,
  rewards_earned DECIMAL(36, 18) DEFAULT 0,
  staked_at TIMESTAMPTZ DEFAULT NOW(),
  unlock_at TIMESTAMPTZ,
  unstaked_at TIMESTAMPTZ,
  UNIQUE(user_id, pool_id)
);

CREATE TABLE staking_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_staking_id UUID REFERENCES user_staking(id) ON DELETE CASCADE,
  amount DECIMAL(36, 18) NOT NULL,
  distributed_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.2. Frontend: Staking Page
**Nueva página:** `/investor/staking`

```typescript
// Display available staking pools
// Show APY, lock period, total staked
// Stake/Unstake actions
// Rewards tracker
```

---

## 🎯 FASE 6: SISTEMA DE NOTIFICACIONES AVANZADO

### Descripción
Orium tiene un sistema robusto de notificaciones con múltiples canales y preferencias granulares.

### Integración Propuesta

#### 6.1. Database Schema
```sql
-- supabase/migrations/007_notifications.sql

CREATE TYPE notification_type AS ENUM (
  'transaction',
  'kyc',
  'order',
  'system',
  'compliance',
  'marketing'
);

CREATE TYPE notification_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE notification_status AS ENUM ('unread', 'read', 'archived');

CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  priority notification_priority DEFAULT 'medium',
  status notification_status DEFAULT 'unread',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,

  -- Per-type preferences
  notify_transactions BOOLEAN DEFAULT true,
  notify_kyc BOOLEAN DEFAULT true,
  notify_orders BOOLEAN DEFAULT true,
  notify_system BOOLEAN DEFAULT false,
  notify_compliance BOOLEAN DEFAULT true,
  notify_marketing BOOLEAN DEFAULT false,

  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'UTC'
);

CREATE INDEX idx_notifications_user_status ON user_notifications(user_id, status);
CREATE INDEX idx_notifications_created ON user_notifications(created_at DESC);
```

#### 6.2. Real-time Notifications
```typescript
// /frontend/src/hooks/useNotifications.ts

import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export function useNotifications() {
  const supabase = useSupabaseClient();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Subscribe to real-time notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show toast notification
          notification.open({
            message: payload.new.title,
            description: payload.new.message,
            icon: getNotificationIcon(payload.new.type),
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { notifications, unreadCount };
}
```

---

## 📊 ROADMAP DE INTEGRACIÓN

### Q4 2024 (Sprint 3-4)
- ✅ KYC Progresivo (Niveles 0-3)
- ✅ MFA Implementation
- ✅ Wallet Management (Custodial)

### Q1 2025 (Sprint 5-8)
- ✅ Trading Engine (Order Book + Matching)
- ✅ Launchpad Module
- ✅ Sistema de Notificaciones

### Q2 2025 (Sprint 9-12)
- ✅ Staking Pools
- ✅ Liquidity Pools
- ✅ Non-custodial Wallets
- ✅ Advanced Analytics

### Q3 2025 (Sprint 13-16)
- ✅ Cross-chain Support
- ✅ DeFi Integrations
- ✅ Mobile App

---

## 🔧 STACK TÉCNICO ADICIONAL

```bash
# Blockchain & Web3
npm install ethers wagmi viem
npm install @web3-react/core @web3-react/injected-connector
npm install @rainbow-me/rainbowkit

# Wallet Management
npm install @solana/web3.js # Si soportamos Solana
npm install @metamask/sdk

# Notifications
npm install socket.io-client # Real-time
npm install firebase # Push notifications

# Staking & DeFi
npm install @uniswap/sdk
npm install @pancakeswap/sdk

# Charting (advanced)
npm install lightweight-charts
npm install tradingview-react
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

### Para cada módulo:
- [ ] Database schema migrado
- [ ] Seed data creado
- [ ] Edge Functions implementadas
- [ ] Frontend UI completada
- [ ] Testing end-to-end
- [ ] Documentación actualizada
- [ ] RLS policies configuradas
- [ ] Performance testing
- [ ] Security audit
- [ ] Deployment

---

**Creado por:** Claude Code
**Basado en:** NAVEO_VS_ONION.md + TOKENIZATION_WORKFLOW.md
**Fecha:** 2025-11-10
**Versión:** 1.0

🚀 **Este roadmap integra lo mejor de Orium en el flujo de investment banking de Naveo.**
