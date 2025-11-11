-- seed.sql
-- Comprehensive seed data for Naveo platform development and testing

-- =======================
-- SETUP AND CLEANUP
-- =======================

-- Disable triggers temporarily to avoid cascading issues
set session_replication_role = replica;

-- Clean existing data (in reverse order of dependencies)
truncate table public.system_events cascade;
truncate table public.notifications cascade;
truncate table public.reports cascade;
truncate table public.nav_history cascade;
truncate table public.kyc_verifications cascade;
truncate table public.user_portfolios cascade;
truncate table public.transactions cascade;
truncate table public.traders cascade;
truncate table public.assets cascade;
truncate table public.funds cascade;

-- =======================
-- MOCK USERS (via auth.users)
-- =======================
-- Note: In production, users are created via Supabase Auth
-- For development, we'll reference user IDs that should exist in auth.users

-- Expected user IDs (these should be created in Supabase Auth):
-- Admin Owner: '00000000-0000-0000-0000-000000000001'
-- Admin Client 1: '00000000-0000-0000-0000-000000000002'
-- Admin Client 2: '00000000-0000-0000-0000-000000000003'
-- Investor 1: '10000000-0000-0000-0000-000000000001'
-- Investor 2: '10000000-0000-0000-0000-000000000002'
-- Investor 3: '10000000-0000-0000-0000-000000000003'
-- Investor 4: '10000000-0000-0000-0000-000000000004'
-- Investor 5: '10000000-0000-0000-0000-000000000005'
-- Trader 1: '20000000-0000-0000-0000-000000000001'
-- Trader 2: '20000000-0000-0000-0000-000000000002'
-- Trader 3: '20000000-0000-0000-0000-000000000003'

-- =======================
-- FUNDS
-- =======================

insert into public.funds (id, name, description, manager_id, current_nav, total_aum, total_shares, status, created_at, updated_at) values
(
    '11111111-1111-1111-1111-111111111111',
    'Naveo Digital Assets Fund',
    'A diversified fund focused on top-tier cryptocurrencies including Bitcoin, Ethereum, and emerging DeFi tokens. Conservative strategy with emphasis on blue-chip crypto assets.',
    '00000000-0000-0000-0000-000000000002', -- Admin Client 1
    125.50,
    2510000.00,
    20000,
    'active',
    now() - interval '18 months',
    now()
),
(
    '22222222-2222-2222-2222-222222222222',
    'Naveo DeFi Opportunities Fund',
    'Aggressive growth fund targeting high-yield DeFi protocols, liquidity mining, and governance tokens. Higher risk, higher potential returns.',
    '00000000-0000-0000-0000-000000000002', -- Admin Client 1
    98.75,
    1975000.00,
    20000,
    'active',
    now() - interval '12 months',
    now()
),
(
    '33333333-3333-3333-3333-333333333333',
    'Naveo Tokenized Securities Fund',
    'Innovative fund investing in tokenized real-world assets including real estate, commodities, and security tokens. Focus on regulatory-compliant tokenized securities.',
    '00000000-0000-0000-0000-000000000003', -- Admin Client 2
    110.25,
    1653750.00,
    15000,
    'active',
    now() - interval '8 months',
    now()
);

-- =======================
-- ASSETS
-- =======================

-- Digital Assets Fund holdings
insert into public.assets (id, fund_id, symbol, name, type, quantity, purchase_price, current_price, purchase_date, created_at) values
('a0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'BTC', 'Bitcoin', 'crypto', 25.5000, 42000.00, 68500.00, current_date - interval '15 months', now()),
('a0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'ETH', 'Ethereum', 'crypto', 450.7500, 2800.00, 3450.00, current_date - interval '14 months', now()),
('a0000003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'BNB', 'Binance Coin', 'crypto', 1200.0000, 320.00, 585.00, current_date - interval '12 months', now()),
('a0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'SOL', 'Solana', 'crypto', 3500.0000, 95.00, 145.00, current_date - interval '10 months', now()),
('a0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'USDC', 'USD Coin', 'stablecoin', 250000.0000, 1.00, 1.00, current_date - interval '8 months', now()),

-- DeFi Opportunities Fund holdings
('a0000006-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'UNI', 'Uniswap', 'token', 15000.0000, 18.50, 12.80, current_date - interval '11 months', now()),
('a0000007-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'AAVE', 'Aave', 'token', 2500.0000, 285.00, 165.00, current_date - interval '10 months', now()),
('a0000008-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'MKR', 'Maker', 'token', 180.0000, 2400.00, 2850.00, current_date - interval '9 months', now()),
('a0000009-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 'LINK', 'Chainlink', 'token', 8500.0000, 22.50, 18.75, current_date - interval '8 months', now()),
('a0000010-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'CRV', 'Curve DAO Token', 'token', 45000.0000, 3.20, 1.85, current_date - interval '7 months', now()),
('a0000011-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222222', 'LDO', 'Lido DAO', 'token', 12000.0000, 4.50, 3.25, current_date - interval '6 months', now()),
('a0000012-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222222', 'DAI', 'Dai Stablecoin', 'stablecoin', 180000.0000, 1.00, 1.00, current_date - interval '5 months', now()),

-- Tokenized Securities Fund holdings
('a0000013-0000-0000-0000-000000000013', '33333333-3333-3333-3333-333333333333', 'PAXG', 'Pax Gold', 'token', 85.0000, 1850.00, 2025.00, current_date - interval '7 months', now()),
('a0000014-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333333', 'RWA-RE01', 'Tokenized Real Estate Portfolio 1', 'token', 2500.0000, 250.00, 285.00, current_date - interval '6 months', now()),
('a0000015-0000-0000-0000-000000000015', '33333333-3333-3333-3333-333333333333', 'RWA-BOND', 'Tokenized Bond Fund', 'token', 5000.0000, 105.00, 108.50, current_date - interval '5 months', now()),
('a0000016-0000-0000-0000-000000000016', '33333333-3333-3333-3333-333333333333', 'MATIC', 'Polygon', 'crypto', 125000.0000, 0.85, 0.72, current_date - interval '4 months', now()),
('a0000017-0000-0000-0000-000000000017', '33333333-3333-3333-3333-333333333333', 'AVAX', 'Avalanche', 'crypto', 4500.0000, 32.00, 38.50, current_date - interval '3 months', now()),
('a0000018-0000-0000-0000-000000000018', '33333333-3333-3333-3333-333333333333', 'USDT', 'Tether', 'stablecoin', 150000.0000, 1.00, 1.00, current_date - interval '2 months', now());

-- =======================
-- TRADERS
-- =======================

insert into public.traders (id, fund_id, user_id, role, total_trades, total_volume, total_pnl, win_rate, status, created_at) values
('t0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000001', 'lead', 248, 12500000.00, 385000.00, 67.50, 'active', now() - interval '16 months'),
('t0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', '20000000-0000-0000-0000-000000000002', 'senior', 189, 8750000.00, 245000.00, 62.30, 'active', now() - interval '14 months'),
('t0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000001', 'lead', 312, 15800000.00, -125000.00, 58.20, 'active', now() - interval '11 months'),
('t0000004-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000003', 'junior', 156, 6200000.00, 85000.00, 55.80, 'active', now() - interval '9 months'),
('t0000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', '20000000-0000-0000-0000-000000000002', 'senior', 97, 4850000.00, 165000.00, 71.20, 'active', now() - interval '7 months');

-- =======================
-- USER PORTFOLIOS
-- =======================

insert into public.user_portfolios (id, user_id, fund_id, shares, avg_purchase_price, created_at, updated_at) values
-- Investor 1 portfolios
('p0000001-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 2500.00000000, 108.50, now() - interval '15 months', now()),
('p0000002-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 1800.00000000, 105.25, now() - interval '11 months', now()),

-- Investor 2 portfolios
('p0000003-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 3200.00000000, 112.00, now() - interval '14 months', now()),
('p0000004-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 2100.00000000, 102.50, now() - interval '7 months', now()),

-- Investor 3 portfolios
('p0000005-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 4500.00000000, 98.00, now() - interval '10 months', now()),
('p0000006-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 1650.00000000, 108.75, now() - interval '6 months', now()),

-- Investor 4 portfolios
('p0000007-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 5800.00000000, 95.50, now() - interval '16 months', now()),

-- Investor 5 portfolios
('p0000008-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 3200.00000000, 110.00, now() - interval '9 months', now()),
('p0000009-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 1850.00000000, 118.25, now() - interval '8 months', now());

-- =======================
-- TRANSACTIONS (80 transactions)
-- =======================

-- Fund 1 transactions
insert into public.transactions (id, user_id, fund_id, type, shares, nav_at_time, amount, status, created_at) values
-- Investor 1
('tx000001-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'buy', 1500.00000000, 105.00, 157500.00, 'completed', now() - interval '15 months'),
('tx000002-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'buy', 1000.00000000, 114.50, 114500.00, 'completed', now() - interval '10 months'),
('tx000003-0000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'buy', 1800.00000000, 105.25, 189450.00, 'completed', now() - interval '11 months'),

-- Investor 2
('tx000004-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'buy', 2000.00000000, 108.00, 216000.00, 'completed', now() - interval '14 months'),
('tx000005-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'buy', 1200.00000000, 118.00, 141600.00, 'completed', now() - interval '8 months'),
('tx000006-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'buy', 2100.00000000, 102.50, 215250.00, 'completed', now() - interval '7 months'),

-- Investor 3
('tx000007-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'buy', 3000.00000000, 95.00, 285000.00, 'completed', now() - interval '10 months'),
('tx000008-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'buy', 1500.00000000, 103.00, 154500.00, 'completed', now() - interval '7 months'),
('tx000009-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'buy', 1650.00000000, 108.75, 179437.50, 'completed', now() - interval '6 months'),

-- Investor 4
('tx000010-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'buy', 4000.00000000, 92.00, 368000.00, 'completed', now() - interval '16 months'),
('tx000011-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'buy', 1800.00000000, 102.50, 184500.00, 'completed', now() - interval '12 months'),

-- Investor 5
('tx000012-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'buy', 3200.00000000, 110.00, 352000.00, 'completed', now() - interval '9 months'),
('tx000013-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'buy', 1850.00000000, 118.25, 218762.50, 'completed', now() - interval '8 months'),

-- Recent transactions (last 30 days)
('tx000014-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'sell', 500.00000000, 125.50, 62750.00, 'completed', now() - interval '15 days'),
('tx000015-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'buy', 850.00000000, 98.75, 83937.50, 'completed', now() - interval '10 days'),
('tx000016-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'buy', 425.00000000, 110.25, 46856.25, 'pending', now() - interval '3 days'),
('tx000017-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'sell', 300.00000000, 125.50, 37650.00, 'completed', now() - interval '5 days');

-- Additional historical transactions (spread over time)
insert into public.transactions (user_id, fund_id, type, shares, nav_at_time, amount, status, created_at)
select
    case (random() * 4)::int
        when 0 then '10000000-0000-0000-0000-000000000001'
        when 1 then '10000000-0000-0000-0000-000000000002'
        when 2 then '10000000-0000-0000-0000-000000000003'
        when 3 then '10000000-0000-0000-0000-000000000004'
        else '10000000-0000-0000-0000-000000000005'
    end,
    case (random() * 2)::int
        when 0 then '11111111-1111-1111-1111-111111111111'
        when 1 then '22222222-2222-2222-2222-222222222222'
        else '33333333-3333-3333-3333-333333333333'
    end,
    case when random() < 0.8 then 'buy' else 'sell' end,
    (random() * 2000 + 100)::numeric(18, 8),
    (random() * 50 + 80)::numeric(18, 2),
    (random() * 100000 + 10000)::numeric(18, 2),
    case when random() < 0.9 then 'completed' else 'pending' end,
    now() - (random() * interval '12 months')
from generate_series(1, 63);

-- =======================
-- NAV HISTORY (12 months × 3 funds = 36 entries minimum)
-- =======================

-- Fund 1 NAV history (monthly for 18 months)
insert into public.nav_history (fund_id, nav, total_shares, total_aum, calculation_date, calculation_method, calculated_by, verified, verified_by, verified_at)
select
    '11111111-1111-1111-1111-111111111111',
    (85 + (gs.month_offset * 2.5))::numeric(18, 2),
    20000,
    (85 + (gs.month_offset * 2.5))::numeric(18, 2) * 20000,
    (current_date - interval '1 month' * (18 - gs.month_offset))::date,
    'automated',
    '00000000-0000-0000-0000-000000000002',
    true,
    '00000000-0000-0000-0000-000000000001',
    (current_date - interval '1 month' * (18 - gs.month_offset) + interval '1 day')::timestamptz
from generate_series(0, 17) as gs(month_offset);

-- Fund 2 NAV history (monthly for 12 months)
insert into public.nav_history (fund_id, nav, total_shares, total_aum, calculation_date, calculation_method, calculated_by, verified, verified_by, verified_at)
select
    '22222222-2222-2222-2222-222222222222',
    (120 - (gs.month_offset * 1.8))::numeric(18, 2),
    20000,
    (120 - (gs.month_offset * 1.8))::numeric(18, 2) * 20000,
    (current_date - interval '1 month' * (12 - gs.month_offset))::date,
    'automated',
    '00000000-0000-0000-0000-000000000002',
    true,
    '00000000-0000-0000-0000-000000000001',
    (current_date - interval '1 month' * (12 - gs.month_offset) + interval '1 day')::timestamptz
from generate_series(0, 11) as gs(month_offset);

-- Fund 3 NAV history (monthly for 8 months)
insert into public.nav_history (fund_id, nav, total_shares, total_aum, calculation_date, calculation_method, calculated_by, verified, verified_by, verified_at)
select
    '33333333-3333-3333-3333-333333333333',
    (100 + (gs.month_offset * 1.3))::numeric(18, 2),
    15000,
    (100 + (gs.month_offset * 1.3))::numeric(18, 2) * 15000,
    (current_date - interval '1 month' * (8 - gs.month_offset))::date,
    'manual',
    '00000000-0000-0000-0000-000000000003',
    true,
    '00000000-0000-0000-0000-000000000001',
    (current_date - interval '1 month' * (8 - gs.month_offset) + interval '2 days')::timestamptz
from generate_series(0, 7) as gs(month_offset);

-- =======================
-- KYC VERIFICATIONS (10 verifications)
-- =======================

insert into public.kyc_verifications (id, user_id, tier, status, verification_type, submitted_at, reviewed_at, reviewed_by, risk_score, pep_check, sanctions_check, adverse_media_check, verification_level, expiry_date, metadata) values
-- Approved verifications
('k0000001-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 3, 'approved', 'individual', now() - interval '15 months', now() - interval '15 months' + interval '2 days', '00000000-0000-0000-0000-000000000001', 15, false, false, false, 'advanced', current_date + interval '9 months', '{"documents_verified": 5, "manual_review": false}'),
('k0000002-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 2, 'approved', 'individual', now() - interval '14 months', now() - interval '14 months' + interval '1 day', '00000000-0000-0000-0000-000000000001', 22, false, false, false, 'intermediate', current_date + interval '10 months', '{"documents_verified": 3, "manual_review": false}'),
('k0000003-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 2, 'approved', 'entity', now() - interval '10 months', now() - interval '10 months' + interval '3 days', '00000000-0000-0000-0000-000000000001', 28, false, false, false, 'intermediate', current_date + interval '14 months', '{"documents_verified": 4, "manual_review": true}'),
('k0000004-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 3, 'approved', 'individual', now() - interval '16 months', now() - interval '16 months' + interval '1 day', '00000000-0000-0000-0000-000000000001', 12, false, false, false, 'advanced', current_date + interval '8 months', '{"documents_verified": 5, "manual_review": false}'),
('k0000005-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 2, 'approved', 'individual', now() - interval '9 months', now() - interval '9 months' + interval '2 days', '00000000-0000-0000-0000-000000000001', 19, false, false, false, 'intermediate', current_date + interval '15 months', '{"documents_verified": 3, "manual_review": false}'),

-- Pending verifications
('k0000006-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 1, 'pending', 'individual', now() - interval '2 days', null, null, null, null, null, null, null, null, '{"documents_submitted": 2}'),
('k0000007-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 1, 'pending', 'individual', now() - interval '5 days', null, null, null, null, null, null, null, null, '{"documents_submitted": 2}'),

-- Needs review
('k0000008-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', 3, 'needs_review', 'entity', now() - interval '8 days', null, null, 65, true, false, false, null, null, '{"documents_submitted": 5, "pep_match": "potential", "requires_enhanced_dd": true}'),

-- Rejected
('k0000009-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', 1, 'rejected', 'individual', now() - interval '20 days', now() - interval '18 days', '00000000-0000-0000-0000-000000000001', 85, false, true, false, null, null, '{"rejection_reason": "Sanctions list match", "documents_submitted": 2}'),

-- Expired
('k0000010-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000005', 2, 'expired', 'individual', now() - interval '25 months', now() - interval '25 months' + interval '1 day', '00000000-0000-0000-0000-000000000001', 18, false, false, false, 'intermediate', current_date - interval '1 month', '{"documents_verified": 3, "expired_on": "2024-10-15"}');

-- =======================
-- NOTIFICATIONS (40 notifications)
-- =======================

insert into public.notifications (user_id, type, category, priority, title, message, read, link, action_required, action_url, created_at) values
-- Critical notifications
('10000000-0000-0000-0000-000000000001', 'kyc', 'compliance', 'critical', 'KYC Verification Required', 'Your KYC verification has expired. Please resubmit your documents to continue investing.', false, '/compliance/kyc', true, '/compliance/kyc', now() - interval '1 day'),
('10000000-0000-0000-0000-000000000002', 'compliance', 'compliance', 'critical', 'Account Review Required', 'Your account requires additional compliance review. Please check your email for details.', false, '/compliance', true, '/compliance', now() - interval '2 days'),

-- High priority notifications
('10000000-0000-0000-0000-000000000001', 'transaction', 'portfolio', 'high', 'Transaction Completed', 'Your sell transaction of 500 shares in Naveo Digital Assets Fund has been completed.', true, '/transactions', false, null, now() - interval '15 days'),
('10000000-0000-0000-0000-000000000003', 'kyc', 'compliance', 'high', 'KYC Status Updated', 'Your Tier 3 KYC verification requires additional review. Our compliance team will contact you shortly.', false, '/compliance/kyc', true, '/compliance/kyc', now() - interval '8 days'),
('10000000-0000-0000-0000-000000000004', 'kyc', 'compliance', 'high', 'KYC Verification Rejected', 'Your KYC verification was rejected. Reason: Sanctions list match', true, '/compliance/kyc', true, '/compliance/kyc', now() - interval '18 days'),

-- Medium priority notifications
('10000000-0000-0000-0000-000000000002', 'transaction', 'portfolio', 'medium', 'Transaction Completed', 'Your buy transaction of 850 shares in Naveo DeFi Opportunities Fund has been completed.', true, '/transactions', false, null, now() - interval '10 days'),
('10000000-0000-0000-0000-000000000004', 'transaction', 'portfolio', 'medium', 'Transaction Completed', 'Your sell transaction of 300 shares in Naveo Digital Assets Fund has been completed.', true, '/transactions', false, null, now() - interval '5 days'),
('10000000-0000-0000-0000-000000000001', 'nav', 'portfolio', 'medium', 'NAV Update', 'Monthly NAV calculation completed for Naveo Digital Assets Fund. Current NAV: $125.50', true, '/portfolio', false, null, now() - interval '3 days'),
('10000000-0000-0000-0000-000000000002', 'nav', 'portfolio', 'medium', 'NAV Update', 'Monthly NAV calculation completed for your funds.', true, '/portfolio', false, null, now() - interval '3 days'),
('10000000-0000-0000-0000-000000000003', 'report', 'fund_ops', 'medium', 'Monthly Report Available', 'The monthly report for Naveo DeFi Opportunities Fund is now available.', false, '/reports', false, null, now() - interval '5 days'),

-- Low priority notifications
('10000000-0000-0000-0000-000000000005', 'system', 'system', 'low', 'Platform Maintenance', 'Scheduled maintenance will occur on Sunday 2:00 AM - 4:00 AM UTC.', false, null, false, null, now() - interval '4 days'),
('10000000-0000-0000-0000-000000000001', 'performance', 'portfolio', 'low', 'Portfolio Performance Update', 'Your portfolio gained 3.2% this month.', true, '/portfolio', false, null, now() - interval '7 days'),
('10000000-0000-0000-0000-000000000002', 'performance', 'portfolio', 'low', 'Portfolio Performance Update', 'Your portfolio gained 2.8% this month.', true, '/portfolio', false, null, now() - interval '7 days'),
('10000000-0000-0000-0000-000000000003', 'system', 'system', 'low', 'New Feature Available', 'Check out our new advanced analytics dashboard!', false, '/analytics', false, null, now() - interval '10 days'),
('10000000-0000-0000-0000-000000000004', 'trade', 'fund_ops', 'low', 'Trading Activity', 'Recent trading activity in Naveo Digital Assets Fund.', true, '/funds', false, null, now() - interval '12 days');

-- Additional notifications
insert into public.notifications (user_id, type, category, priority, title, message, read, created_at)
select
    case (random() * 4)::int
        when 0 then '10000000-0000-0000-0000-000000000001'
        when 1 then '10000000-0000-0000-0000-000000000002'
        when 2 then '10000000-0000-0000-0000-000000000003'
        when 3 then '10000000-0000-0000-0000-000000000004'
        else '10000000-0000-0000-0000-000000000005'
    end,
    (array['transaction', 'nav', 'performance', 'system', 'report'])[floor(random() * 5 + 1)],
    (array['portfolio', 'fund_ops', 'system'])[floor(random() * 3 + 1)],
    (array['low', 'medium'])[floor(random() * 2 + 1)],
    'System Notification',
    'This is an automated notification for testing purposes.',
    random() < 0.6,
    now() - (random() * interval '60 days')
from generate_series(1, 25);

-- =======================
-- SYSTEM EVENTS (120+ events)
-- =======================

-- Transaction events
insert into public.system_events (event_type, event_category, user_id, fund_id, resource_type, resource_id, action, status, severity, description, created_at) values
('transaction_create', 'transaction', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'transactions', 'tx000014-0000-0000-0000-000000000014', 'create', 'success', 'info', 'Transaction create: sell', now() - interval '15 days'),
('transaction_update', 'transaction', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'transactions', 'tx000014-0000-0000-0000-000000000014', 'update', 'success', 'info', 'Transaction update: sell', now() - interval '15 days' + interval '1 hour'),
('transaction_create', 'transaction', '10000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'transactions', 'tx000015-0000-0000-0000-000000000015', 'create', 'success', 'info', 'Transaction create: buy', now() - interval '10 days'),
('transaction_update', 'transaction', '10000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'transactions', 'tx000015-0000-0000-0000-000000000015', 'update', 'success', 'info', 'Transaction update: buy', now() - interval '10 days' + interval '1 hour');

-- KYC events
insert into public.system_events (event_type, event_category, user_id, resource_type, resource_id, action, status, severity, description, created_at) values
('kyc_verifications_create', 'compliance', '10000000-0000-0000-0000-000000000001', 'kyc_verifications', 'k0000006-0000-0000-0000-000000000006', 'create', 'success', 'info', 'KYC verification create: status pending', now() - interval '2 days'),
('kyc_verifications_create', 'compliance', '10000000-0000-0000-0000-000000000002', 'kyc_verifications', 'k0000007-0000-0000-0000-000000000007', 'create', 'success', 'info', 'KYC verification create: status pending', now() - interval '5 days'),
('kyc_verifications_update', 'compliance', '10000000-0000-0000-0000-000000000003', 'kyc_verifications', 'k0000008-0000-0000-0000-000000000008', 'update', 'success', 'warning', 'KYC verification update: status needs_review', now() - interval '8 days'),
('kyc_verifications_update', 'compliance', '10000000-0000-0000-0000-000000000004', 'kyc_verifications', 'k0000009-0000-0000-0000-000000000009', 'update', 'success', 'error', 'KYC verification update: status rejected', now() - interval '18 days');

-- NAV calculation events
insert into public.system_events (event_type, event_category, user_id, fund_id, resource_type, action, status, severity, description, created_at) values
('nav_history_create', 'fund_ops', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'nav_history', 'create', 'success', 'info', 'NAV calculation create for fund', now() - interval '1 day'),
('nav_history_create', 'fund_ops', '00000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'nav_history', 'create', 'success', 'info', 'NAV calculation create for fund', now() - interval '1 day'),
('nav_history_create', 'fund_ops', '00000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'nav_history', 'create', 'success', 'info', 'NAV calculation create for fund', now() - interval '1 day');

-- Fund events
insert into public.system_events (event_type, event_category, user_id, fund_id, resource_type, resource_id, action, status, severity, description, created_at) values
('funds_create', 'fund_ops', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'funds', '11111111-1111-1111-1111-111111111111', 'create', 'success', 'info', 'Fund create: Naveo Digital Assets Fund', now() - interval '18 months'),
('funds_create', 'fund_ops', '00000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'funds', '22222222-2222-2222-2222-222222222222', 'create', 'success', 'info', 'Fund create: Naveo DeFi Opportunities Fund', now() - interval '12 months'),
('funds_create', 'fund_ops', '00000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'funds', '33333333-3333-3333-3333-333333333333', 'create', 'success', 'info', 'Fund create: Naveo Tokenized Securities Fund', now() - interval '8 months');

-- Asset events
insert into public.system_events (event_type, event_category, fund_id, resource_type, resource_id, action, status, severity, description, created_at) values
('assets_create', 'fund_ops', '11111111-1111-1111-1111-111111111111', 'assets', 'a0000001-0000-0000-0000-000000000001', 'create', 'success', 'info', 'Asset create: BTC', now() - interval '15 months'),
('assets_create', 'fund_ops', '11111111-1111-1111-1111-111111111111', 'assets', 'a0000002-0000-0000-0000-000000000002', 'create', 'success', 'info', 'Asset create: ETH', now() - interval '14 months'),
('assets_create', 'fund_ops', '22222222-2222-2222-2222-222222222222', 'assets', 'a0000006-0000-0000-0000-000000000006', 'create', 'success', 'info', 'Asset create: UNI', now() - interval '11 months'),
('assets_create', 'fund_ops', '33333333-3333-3333-3333-333333333333', 'assets', 'a0000013-0000-0000-0000-000000000013', 'create', 'success', 'info', 'Asset create: PAXG', now() - interval '7 months');

-- Additional system events
insert into public.system_events (event_type, event_category, user_id, action, status, severity, description, created_at)
select
    (array['user_login', 'user_logout', 'password_change', 'profile_update', 'settings_change'])[floor(random() * 5 + 1)],
    'system',
    case (random() * 4)::int
        when 0 then '10000000-0000-0000-0000-000000000001'
        when 1 then '10000000-0000-0000-0000-000000000002'
        when 2 then '10000000-0000-0000-0000-000000000003'
        when 3 then '10000000-0000-0000-0000-000000000004'
        else '10000000-0000-0000-0000-000000000005'
    end,
    (array['create', 'update', 'delete'])[floor(random() * 3 + 1)],
    'success',
    (array['info', 'info', 'info', 'warning'])[floor(random() * 4 + 1)],
    'System event for audit trail',
    now() - (random() * interval '90 days')
from generate_series(1, 100);

-- =======================
-- REPORTS (8 reports)
-- =======================

insert into public.reports (id, fund_id, report_type, report_name, period_start, period_end, generated_by, generated_at, file_url, file_size, file_format, status, sent_to, sent_at, download_count) values
('r0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'monthly', 'Naveo Digital Assets Fund - October 2024', '2024-10-01', '2024-10-31', '00000000-0000-0000-0000-000000000002', now() - interval '10 days', 'https://storage.example.com/reports/ndaf-oct-2024.pdf', 2458000, 'pdf', 'sent', array['10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002']::uuid[], now() - interval '8 days', 15),
('r0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'monthly', 'Naveo DeFi Opportunities Fund - October 2024', '2024-10-01', '2024-10-31', '00000000-0000-0000-0000-000000000002', now() - interval '10 days', 'https://storage.example.com/reports/ndof-oct-2024.pdf', 2125000, 'pdf', 'sent', array['10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005']::uuid[], now() - interval '8 days', 12),
('r0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'monthly', 'Naveo Tokenized Securities Fund - October 2024', '2024-10-01', '2024-10-31', '00000000-0000-0000-0000-000000000003', now() - interval '10 days', 'https://storage.example.com/reports/ntsf-oct-2024.pdf', 1985000, 'pdf', 'ready', null, null, 8),
('r0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'quarterly', 'Naveo Digital Assets Fund - Q3 2024', '2024-07-01', '2024-09-30', '00000000-0000-0000-0000-000000000002', now() - interval '45 days', 'https://storage.example.com/reports/ndaf-q3-2024.pdf', 4850000, 'pdf', 'sent', array['10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004']::uuid[], now() - interval '42 days', 28),
('r0000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'quarterly', 'Naveo DeFi Opportunities Fund - Q3 2024', '2024-07-01', '2024-09-30', '00000000-0000-0000-0000-000000000002', now() - interval '45 days', 'https://storage.example.com/reports/ndof-q3-2024.pdf', 4125000, 'pdf', 'sent', array['10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000005']::uuid[], now() - interval '42 days', 22),
('r0000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'performance', 'NDAF Performance Analysis - 2024 YTD', '2024-01-01', '2024-10-31', '00000000-0000-0000-0000-000000000002', now() - interval '5 days', 'https://storage.example.com/reports/ndaf-perf-2024.pdf', 3250000, 'pdf', 'ready', null, null, 5),
('r0000007-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'performance', 'NDOF Performance Analysis - 2024 YTD', '2024-01-01', '2024-10-31', '00000000-0000-0000-0000-000000000002', now() - interval '5 days', 'https://storage.example.com/reports/ndof-perf-2024.pdf', 2980000, 'pdf', 'ready', null, null, 3),
('r0000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'compliance', 'NDAF Compliance Report - October 2024', '2024-10-01', '2024-10-31', '00000000-0000-0000-0000-000000000001', now() - interval '3 days', 'https://storage.example.com/reports/ndaf-comp-oct-2024.pdf', 1850000, 'pdf', 'ready', null, null, 2);

-- Re-enable triggers
set session_replication_role = default;

-- =======================
-- VERIFICATION QUERIES
-- =======================

-- Verify data counts
select 'funds' as table_name, count(*) as count from public.funds
union all
select 'assets', count(*) from public.assets
union all
select 'traders', count(*) from public.traders
union all
select 'user_portfolios', count(*) from public.user_portfolios
union all
select 'transactions', count(*) from public.transactions
union all
select 'nav_history', count(*) from public.nav_history
union all
select 'kyc_verifications', count(*) from public.kyc_verifications
union all
select 'notifications', count(*) from public.notifications
union all
select 'reports', count(*) from public.reports
union all
select 'system_events', count(*) from public.system_events
order by table_name;

-- =======================
-- SUMMARY
-- =======================
-- Seed data created:
-- - 3 funds (Digital Assets, DeFi Opportunities, Tokenized Securities)
-- - 18 assets (BTC, ETH, DeFi tokens, tokenized securities)
-- - 5 traders across all funds
-- - 9 user portfolios (5 investors across 3 funds)
-- - 80 transactions (buy, sell, completed, pending)
-- - 38 NAV history entries (18 months for Fund 1, 12 for Fund 2, 8 for Fund 3)
-- - 10 KYC verifications (approved, pending, needs_review, rejected, expired)
-- - 40 notifications (various types, priorities, read/unread)
-- - 8 reports (monthly, quarterly, performance, compliance)
-- - 120+ system events (comprehensive audit trail)

comment on schema public is 'Naveo platform - Comprehensive seed data for development and testing';
