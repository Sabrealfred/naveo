-- 002_expanded_schema.sql
-- Expands the initial schema with KYC, notifications, reports, audit logs, and NAV history

-- =======================
-- KYC VERIFICATIONS TABLE
-- =======================
create table if not exists public.kyc_verifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    tier int default 1 check (tier in (1, 2, 3)), -- KYC tiers: 1 (basic), 2 (intermediate), 3 (advanced)
    status varchar(50) default 'pending' check (status in ('pending', 'approved', 'rejected', 'needs_review', 'expired')),
    verification_type varchar(50) default 'individual' check (verification_type in ('individual', 'entity')),
    submitted_at timestamptz default now(),
    reviewed_at timestamptz,
    reviewed_by uuid references auth.users(id),
    rejection_reason text,
    documents jsonb default '[]'::jsonb, -- array of document URLs/metadata
    persona_inquiry_id varchar(255), -- for future Persona API integration
    risk_score int check (risk_score between 0 and 100), -- 0-100 risk score
    pep_check boolean default false, -- Politically Exposed Person check
    sanctions_check boolean default false, -- Sanctions list check
    adverse_media_check boolean default false, -- Adverse media screening
    verification_level varchar(50), -- identity_only, enhanced_due_diligence, etc.
    expiry_date date, -- when KYC expires and needs renewal
    metadata jsonb default '{}'::jsonb, -- additional verification metadata
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.kyc_verifications enable row level security;

create index idx_kyc_user_status on public.kyc_verifications(user_id, status);
create index idx_kyc_status_tier on public.kyc_verifications(status, tier);
create index idx_kyc_reviewed_at on public.kyc_verifications(reviewed_at desc) where reviewed_at is not null;

comment on table public.kyc_verifications is 'KYC/KYB verification records for investors';
comment on column public.kyc_verifications.tier is '1=Basic, 2=Intermediate, 3=Advanced KYC';
comment on column public.kyc_verifications.risk_score is 'AML risk score 0-100 (0=lowest risk)';

-- =======================
-- NOTIFICATIONS TABLE
-- =======================
create table if not exists public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) on delete cascade not null,
    type varchar(50) not null check (type in ('transaction', 'kyc', 'compliance', 'nav', 'report', 'system', 'trade', 'performance')),
    category varchar(50), -- additional categorization
    priority varchar(20) default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
    title varchar(255) not null,
    message text not null,
    read boolean default false,
    link varchar(500), -- link to relevant page/resource
    action_required boolean default false,
    action_url varchar(500),
    metadata jsonb default '{}'::jsonb,
    expires_at timestamptz, -- optional expiration for time-sensitive notifications
    created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create index idx_notifications_user_read on public.notifications(user_id, read, created_at desc);
create index idx_notifications_type on public.notifications(type, created_at desc);
create index idx_notifications_priority on public.notifications(priority, created_at desc) where priority in ('high', 'critical');
create index idx_notifications_unread on public.notifications(user_id, created_at desc) where read = false;

comment on table public.notifications is 'User notifications and alerts';
comment on column public.notifications.action_required is 'Whether user action is required';

-- =======================
-- REPORTS TABLE
-- =======================
create table if not exists public.reports (
    id uuid primary key default uuid_generate_v4(),
    fund_id uuid references public.funds(id) on delete cascade,
    report_type varchar(50) not null check (report_type in ('monthly', 'quarterly', 'annual', 'custom', 'tax', 'performance', 'compliance')),
    report_name varchar(255) not null,
    period_start date not null,
    period_end date not null,
    generated_by uuid references auth.users(id),
    generated_at timestamptz default now(),
    file_url varchar(500), -- URL to generated PDF/Excel
    file_size bigint, -- file size in bytes
    file_format varchar(20) default 'pdf' check (file_format in ('pdf', 'excel', 'csv')),
    status varchar(50) default 'generating' check (status in ('generating', 'ready', 'sent', 'failed', 'archived')),
    sent_to uuid[], -- array of user IDs who received this report
    sent_at timestamptz,
    download_count int default 0,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.reports enable row level security;

create index idx_reports_fund on public.reports(fund_id, created_at desc);
create index idx_reports_type_period on public.reports(report_type, period_end desc);
create index idx_reports_status on public.reports(status, created_at desc);
create index idx_reports_generated_by on public.reports(generated_by, created_at desc);

comment on table public.reports is 'Generated fund reports and investor statements';
comment on column public.reports.sent_to is 'Array of user IDs who received the report';

-- =======================
-- SYSTEM EVENTS (Audit Log)
-- =======================
create table if not exists public.system_events (
    id uuid primary key default uuid_generate_v4(),
    event_type varchar(100) not null, -- e.g., user_login, transaction_created, nav_updated, kyc_approved
    event_category varchar(50), -- auth, transaction, compliance, fund_ops, etc.
    user_id uuid references auth.users(id),
    fund_id uuid references public.funds(id),
    resource_type varchar(50), -- type of resource affected
    resource_id uuid, -- ID of affected resource
    action varchar(50), -- create, update, delete, approve, reject, etc.
    status varchar(50) default 'success' check (status in ('success', 'failure', 'pending')),
    severity varchar(20) default 'info' check (severity in ('debug', 'info', 'warning', 'error', 'critical')),
    description text,
    metadata jsonb default '{}'::jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz default now()
);

-- Partition system_events by month for better performance (optional, commented out for now)
-- create table system_events_y2024m11 partition of system_events
--   for values from ('2024-11-01') to ('2024-12-01');

alter table public.system_events enable row level security;

create index idx_system_events_type on public.system_events(event_type, created_at desc);
create index idx_system_events_user on public.system_events(user_id, created_at desc) where user_id is not null;
create index idx_system_events_fund on public.system_events(fund_id, created_at desc) where fund_id is not null;
create index idx_system_events_category on public.system_events(event_category, created_at desc);
create index idx_system_events_severity on public.system_events(severity, created_at desc) where severity in ('error', 'critical');
create index idx_system_events_created_at on public.system_events(created_at desc);

comment on table public.system_events is 'Comprehensive audit log for all system activities';
comment on column public.system_events.event_type is 'Specific event type (e.g., user_login, kyc_approved)';
comment on column public.system_events.severity is 'Log severity level for filtering';

-- =======================
-- NAV HISTORY TABLE
-- =======================
create table if not exists public.nav_history (
    id uuid primary key default uuid_generate_v4(),
    fund_id uuid references public.funds(id) on delete cascade not null,
    nav numeric(18, 2) not null check (nav > 0),
    total_shares bigint not null check (total_shares >= 0),
    total_aum numeric(18, 2) not null check (total_aum >= 0),
    calculation_date date not null,
    calculation_method varchar(50) default 'manual', -- manual, automated, oracle_based
    calculated_by uuid references auth.users(id),
    verified boolean default false,
    verified_by uuid references auth.users(id),
    verified_at timestamptz,
    assets_snapshot jsonb, -- snapshot of fund assets at calculation time
    notes text,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    unique (fund_id, calculation_date) -- one NAV per fund per day
);

alter table public.nav_history enable row level security;

create index idx_nav_history_fund_date on public.nav_history(fund_id, calculation_date desc);
create index idx_nav_history_date on public.nav_history(calculation_date desc);
create index idx_nav_history_calculated_by on public.nav_history(calculated_by, created_at desc);

comment on table public.nav_history is 'Historical NAV (Net Asset Value) calculations per fund';
comment on column public.nav_history.calculation_date is 'Date for which NAV was calculated';
comment on column public.nav_history.assets_snapshot is 'JSONB snapshot of fund assets at calculation time';

-- =======================
-- ADDITIONAL INDICES FOR EXISTING TABLES
-- =======================

-- Improve performance on transactions queries
create index if not exists idx_transactions_fund_date on public.transactions(fund_id, created_at desc);
create index if not exists idx_transactions_user_date on public.transactions(user_id, created_at desc);
create index if not exists idx_transactions_type_status on public.transactions(type, status, created_at desc);
create index if not exists idx_transactions_status on public.transactions(status) where status = 'pending';

-- Improve performance on user_portfolios queries
create index if not exists idx_user_portfolios_user on public.user_portfolios(user_id);
create index if not exists idx_user_portfolios_fund on public.user_portfolios(fund_id);

-- Improve performance on assets queries
create index if not exists idx_assets_fund on public.assets(fund_id, created_at desc);
create index if not exists idx_assets_symbol on public.assets(symbol);
create index if not exists idx_assets_type on public.assets(type, fund_id);

-- Improve performance on traders queries
create index if not exists idx_traders_fund on public.traders(fund_id, status);
create index if not exists idx_traders_user on public.traders(user_id);
create index if not exists idx_traders_status on public.traders(status) where status = 'active';

-- =======================
-- GRANTS AND PERMISSIONS
-- =======================

-- Grant necessary permissions to authenticated users
grant usage on schema public to authenticated;
grant select, insert, update on public.kyc_verifications to authenticated;
grant select, insert, update on public.notifications to authenticated;
grant select on public.reports to authenticated;
grant select on public.system_events to authenticated;
grant select on public.nav_history to authenticated;

-- =======================
-- SUMMARY
-- =======================

-- New tables created:
-- 1. kyc_verifications (10 columns + metadata)
-- 2. notifications (14 columns)
-- 3. reports (17 columns)
-- 4. system_events (17 columns)
-- 5. nav_history (15 columns)

-- Total indices created: 24+ indices across all tables
-- All tables have RLS enabled
-- All tables have appropriate foreign key constraints
-- All tables have created_at/updated_at timestamps where applicable

comment on schema public is 'Naveo platform - Expanded schema with KYC, notifications, reports, audit logs, and NAV history';
