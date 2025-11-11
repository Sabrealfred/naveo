-- =====================================================
-- 006_advanced_kyc_kyb.sql
-- Phase 3: Regulatory & Compliance - Advanced KYC/KYB
-- =====================================================

-- =======================
-- 1. MODIFY KYC_VERIFICATIONS TO SUPPORT TIER 0
-- =======================

-- Drop existing tier constraint and add tier 0
alter table public.kyc_verifications
drop constraint if exists kyc_verifications_tier_check;

alter table public.kyc_verifications
add constraint kyc_verifications_tier_check
check (tier in (0, 1, 2, 3));

-- Update comment to reflect tier 0
comment on column public.kyc_verifications.tier is '0=Unverified, 1=Basic, 2=Intermediate, 3=Advanced KYC';

-- =======================
-- 2. KYB (KNOW YOUR BUSINESS) FOR ORGANIZATIONS
-- =======================
create table if not exists public.kyb_verifications (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null, -- reference to organization (could be fund or entity)
    organization_name varchar(255) not null,
    organization_type varchar(100) check (organization_type in ('fund', 'corporation', 'llc', 'partnership', 'trust', 'other')),
    jurisdiction varchar(100), -- country/state of incorporation
    registration_number varchar(100), -- business registration number
    tax_id varchar(100), -- EIN, VAT, etc.
    incorporation_date date,

    -- Verification status
    tier int default 1 check (tier in (0, 1, 2, 3)),
    status varchar(50) default 'pending' check (status in ('pending', 'approved', 'rejected', 'needs_review', 'expired')),

    -- Business verification
    business_license_verified boolean default false,
    articles_of_incorporation boolean default false,
    proof_of_address boolean default false,
    shareholder_disclosure boolean default false,
    ubo_verification boolean default false, -- Ultimate Beneficial Owner

    -- Enhanced Due Diligence (EDD)
    aml_screening_passed boolean default false,
    sanctions_screening_passed boolean default false,
    adverse_media_screening boolean default false,
    source_of_funds_verified boolean default false,

    -- Documents
    documents jsonb default '[]'::jsonb, -- array of document URLs/metadata

    -- Risk assessment
    risk_score int check (risk_score between 0 and 100),
    risk_level varchar(20) check (risk_level in ('low', 'medium', 'high', 'critical')),
    risk_factors jsonb default '[]'::jsonb, -- array of identified risk factors

    -- Review tracking
    submitted_at timestamptz default now(),
    reviewed_at timestamptz,
    reviewed_by uuid references auth.users(id),
    rejection_reason text,
    expiry_date date,

    -- Metadata
    primary_contact_user_id uuid references auth.users(id),
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.kyb_verifications enable row level security;

create index idx_kyb_org on public.kyb_verifications(organization_id);
create index idx_kyb_status_tier on public.kyb_verifications(status, tier);
create index idx_kyb_risk on public.kyb_verifications(risk_level, risk_score desc);
create index idx_kyb_expiry on public.kyb_verifications(expiry_date) where expiry_date is not null;

comment on table public.kyb_verifications is 'KYB (Know Your Business) verification for organizations and entities';
comment on column public.kyb_verifications.ubo_verification is 'Ultimate Beneficial Owner verification completed';

-- =======================
-- 3. SYSTEM EVENTS (AUDIT TRAIL)
-- =======================
create table if not exists public.system_events (
    id uuid primary key default uuid_generate_v4(),
    event_type varchar(100) not null, -- kyc_submitted, kyc_approved, transaction_executed, etc.
    event_category varchar(50) not null check (event_category in ('kyc', 'kyb', 'transaction', 'compliance', 'trading', 'admin', 'security', 'system')),
    severity varchar(20) default 'info' check (severity in ('info', 'warning', 'error', 'critical')),

    -- Actor information
    user_id uuid references auth.users(id), -- who performed the action
    user_role varchar(50), -- role at time of action
    user_ip inet, -- IP address
    user_agent text, -- browser/client info

    -- Event details
    title varchar(255) not null,
    description text,
    entity_type varchar(50), -- type of entity affected (user, fund, transaction, etc.)
    entity_id uuid, -- ID of affected entity

    -- Before/After for audit
    old_value jsonb, -- state before change
    new_value jsonb, -- state after change
    changes jsonb, -- specific changes made

    -- Metadata
    metadata jsonb default '{}'::jsonb,
    tags varchar(50)[], -- searchable tags
    created_at timestamptz default now()
);

alter table public.system_events enable row level security;

create index idx_events_type on public.system_events(event_type, created_at desc);
create index idx_events_category on public.system_events(event_category, created_at desc);
create index idx_events_user on public.system_events(user_id, created_at desc);
create index idx_events_entity on public.system_events(entity_type, entity_id, created_at desc);
create index idx_events_severity on public.system_events(severity, created_at desc) where severity in ('error', 'critical');
create index idx_events_created on public.system_events(created_at desc);

comment on table public.system_events is 'Complete audit trail of all system events and actions';
comment on column public.system_events.changes is 'Detailed JSON of what changed (field-by-field)';

-- =======================
-- 4. COMPLIANCE RULES
-- =======================
create table if not exists public.compliance_rules (
    id uuid primary key default uuid_generate_v4(),
    rule_code varchar(50) unique not null, -- e.g., 'KYC_TIER_MIN', 'MAX_INVESTMENT_UNVERIFIED'
    rule_name varchar(255) not null,
    rule_description text,
    rule_type varchar(50) check (rule_type in ('kyc', 'kyb', 'investment_limit', 'transaction', 'geographic', 'aml', 'other')),

    -- Rule configuration
    enabled boolean default true,
    severity varchar(20) default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
    enforcement varchar(50) default 'block' check (enforcement in ('block', 'warn', 'audit')), -- how to enforce

    -- Rule parameters (flexible JSON)
    parameters jsonb default '{}'::jsonb, -- e.g., {"min_tier": 2, "max_amount": 10000}

    -- Applicable to
    applies_to varchar(50)[] default ARRAY['investor']::varchar[], -- roles this applies to
    jurisdictions varchar(100)[], -- specific jurisdictions (null = all)

    -- Metadata
    created_by uuid references auth.users(id),
    last_modified_by uuid references auth.users(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.compliance_rules enable row level security;

create index idx_compliance_enabled on public.compliance_rules(enabled, rule_type);
create index idx_compliance_severity on public.compliance_rules(severity);
create unique index idx_compliance_code on public.compliance_rules(rule_code);

comment on table public.compliance_rules is 'Configurable compliance rules and policies';
comment on column public.compliance_rules.enforcement is 'How to enforce: block (prevent action), warn (alert only), audit (log only)';

-- =======================
-- 5. RISK ALERTS
-- =======================
create table if not exists public.risk_alerts (
    id uuid primary key default uuid_generate_v4(),
    alert_type varchar(100) not null, -- kyc_expired, high_risk_transaction, sanctions_hit, etc.
    alert_category varchar(50) check (alert_category in ('kyc', 'kyb', 'aml', 'transaction', 'behavioral', 'system')),
    severity varchar(20) default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
    status varchar(50) default 'open' check (status in ('open', 'investigating', 'resolved', 'false_positive', 'escalated')),

    -- Alert details
    title varchar(255) not null,
    description text,
    risk_score int check (risk_score between 0 and 100),

    -- Related entities
    user_id uuid references auth.users(id), -- user related to alert
    related_entity_type varchar(50), -- transaction, fund, etc.
    related_entity_id uuid,

    -- Resolution
    resolved_at timestamptz,
    resolved_by uuid references auth.users(id),
    resolution_notes text,
    false_positive boolean default false,

    -- Actions taken
    actions_taken jsonb default '[]'::jsonb, -- array of actions
    requires_action boolean default true,
    assigned_to uuid references auth.users(id), -- compliance officer assigned

    -- Notification
    notified_users uuid[], -- users who were notified
    escalated boolean default false,
    escalated_at timestamptz,
    escalated_to uuid references auth.users(id),

    -- Metadata
    triggered_by varchar(100), -- what triggered this alert (rule_code, system, manual)
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.risk_alerts enable row level security;

create index idx_alerts_status on public.risk_alerts(status, created_at desc);
create index idx_alerts_severity on public.risk_alerts(severity, created_at desc);
create index idx_alerts_user on public.risk_alerts(user_id, status);
create index idx_alerts_assigned on public.risk_alerts(assigned_to, status) where assigned_to is not null;
create index idx_alerts_open on public.risk_alerts(created_at desc) where status = 'open';
create index idx_alerts_escalated on public.risk_alerts(escalated_at desc) where escalated = true;

comment on table public.risk_alerts is 'Risk and compliance alerts requiring attention';
comment on column public.risk_alerts.escalated is 'Whether alert has been escalated to higher authority';

-- =======================
-- 6. KYC/KYB TIER LIMITS
-- =======================
create table if not exists public.tier_limits (
    id uuid primary key default uuid_generate_v4(),
    tier int not null check (tier in (0, 1, 2, 3)),
    verification_type varchar(50) not null check (verification_type in ('kyc', 'kyb')),

    -- Investment limits
    max_single_investment decimal(18, 2), -- max per transaction
    max_monthly_investment decimal(18, 2), -- max per month
    max_total_investment decimal(18, 2), -- max total portfolio value

    -- Feature access
    can_trade boolean default false,
    can_withdraw boolean default false,
    can_invest_international boolean default false,
    can_access_secondary_market boolean default false,

    -- Restrictions
    restricted_fund_types varchar(100)[], -- which fund types are restricted
    allowed_jurisdictions varchar(100)[], -- which jurisdictions allowed (null = all)

    -- Requirements
    required_documents varchar(100)[], -- which documents required
    verification_requirements jsonb default '{}'::jsonb,

    -- Metadata
    tier_name varchar(100),
    tier_description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.tier_limits enable row level security;

create unique index idx_tier_limits_unique on public.tier_limits(tier, verification_type);

comment on table public.tier_limits is 'Investment limits and access rights per KYC/KYB tier';

-- =======================
-- 7. SEED DEFAULT TIER LIMITS
-- =======================
insert into public.tier_limits (tier, verification_type, tier_name, tier_description, max_single_investment, max_monthly_investment, max_total_investment, can_trade, can_withdraw, can_invest_international, can_access_secondary_market)
values
    (0, 'kyc', 'Unverified', 'No KYC verification completed', 0, 0, 0, false, false, false, false),
    (1, 'kyc', 'Basic KYC', 'Basic identity verification', 10000, 25000, 50000, false, true, false, false),
    (2, 'kyc', 'Intermediate KYC', 'Enhanced due diligence', 50000, 100000, 250000, true, true, false, true),
    (3, 'kyc', 'Advanced KYC', 'Full verification with accredited investor status', NULL, NULL, NULL, true, true, true, true),
    (0, 'kyb', 'Unverified Entity', 'No business verification', 0, 0, 0, false, false, false, false),
    (1, 'kyb', 'Basic KYB', 'Basic business verification', 100000, 250000, 500000, false, true, false, false),
    (2, 'kyb', 'Intermediate KYB', 'Enhanced business due diligence', 500000, 1000000, 5000000, true, true, false, true),
    (3, 'kyb', 'Advanced KYB', 'Full institutional verification', NULL, NULL, NULL, true, true, true, true)
on conflict (tier, verification_type) do nothing;

-- =======================
-- 8. SEED DEFAULT COMPLIANCE RULES
-- =======================
insert into public.compliance_rules (rule_code, rule_name, rule_description, rule_type, severity, enforcement, parameters)
values
    ('KYC_REQUIRED', 'KYC Required for Investment', 'Users must complete KYC before investing', 'kyc', 'critical', 'block', '{"min_tier": 1}'::jsonb),
    ('MAX_UNVERIFIED_INVESTMENT', 'Max Investment for Unverified Users', 'Tier 0 users cannot invest', 'investment_limit', 'high', 'block', '{"tier": 0, "max_amount": 0}'::jsonb),
    ('KYC_EXPIRY_WARNING', 'KYC Expiry Warning', 'Alert users when KYC is about to expire', 'kyc', 'medium', 'warn', '{"days_before_expiry": 30}'::jsonb),
    ('HIGH_VALUE_TRANSACTION', 'High Value Transaction Review', 'Transactions over threshold require review', 'transaction', 'high', 'audit', '{"threshold": 100000}'::jsonb),
    ('PEP_CHECK_REQUIRED', 'PEP Check Required', 'Politically Exposed Persons require enhanced screening', 'aml', 'critical', 'block', '{"enhanced_dd_required": true}'::jsonb),
    ('SANCTIONS_CHECK', 'Sanctions Screening', 'Check against sanctions lists', 'aml', 'critical', 'block', '{}'::jsonb),
    ('GEOGRAPHIC_RESTRICTION', 'Geographic Restrictions', 'Certain jurisdictions are restricted', 'geographic', 'high', 'block', '{"blocked_countries": ["IR", "KP", "SY"]}'::jsonb)
on conflict (rule_code) do nothing;

-- =======================
-- 9. FUNCTIONS FOR COMPLIANCE CHECKS
-- =======================

-- Function to check if user meets minimum KYC tier
create or replace function public.check_kyc_tier(
    p_user_id uuid,
    p_required_tier int
)
returns boolean
language plpgsql
security definer
stable
as $$
declare
    v_current_tier int;
    v_status varchar;
begin
    -- Get user's current KYC tier
    select tier, status into v_current_tier, v_status
    from public.kyc_verifications
    where user_id = p_user_id
    and status = 'approved'
    order by tier desc
    limit 1;

    -- Return true if meets requirement
    return coalesce(v_current_tier >= p_required_tier, false);
end;
$$;

comment on function public.check_kyc_tier is 'Check if user meets minimum KYC tier requirement';

-- Function to get user's investment limits
create or replace function public.get_investment_limits(p_user_id uuid)
returns table (
    max_single decimal,
    max_monthly decimal,
    max_total decimal,
    can_trade boolean,
    can_withdraw boolean,
    tier_level int
)
language plpgsql
security definer
stable
as $$
declare
    v_tier int;
begin
    -- Get user's highest approved KYC tier
    select k.tier into v_tier
    from public.kyc_verifications k
    where k.user_id = p_user_id
    and k.status = 'approved'
    order by k.tier desc
    limit 1;

    -- Default to tier 0 if no KYC
    v_tier := coalesce(v_tier, 0);

    -- Return limits for that tier
    return query
    select
        tl.max_single_investment,
        tl.max_monthly_investment,
        tl.max_total_investment,
        tl.can_trade,
        tl.can_withdraw,
        v_tier
    from public.tier_limits tl
    where tl.tier = v_tier
    and tl.verification_type = 'kyc'
    limit 1;
end;
$$;

comment on function public.get_investment_limits is 'Get investment limits for a user based on their KYC tier';

-- Function to create risk alert
create or replace function public.create_risk_alert(
    p_alert_type varchar,
    p_category varchar,
    p_severity varchar,
    p_title varchar,
    p_description text,
    p_user_id uuid default null,
    p_risk_score int default null,
    p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
    v_alert_id uuid;
begin
    insert into public.risk_alerts (
        alert_type,
        alert_category,
        severity,
        title,
        description,
        user_id,
        risk_score,
        metadata,
        status
    )
    values (
        p_alert_type,
        p_category,
        p_severity,
        p_title,
        p_description,
        p_user_id,
        p_risk_score,
        p_metadata,
        'open'
    )
    returning id into v_alert_id;

    return v_alert_id;
end;
$$;

comment on function public.create_risk_alert is 'Create a new risk alert for compliance team';

-- =======================
-- 10. TRIGGERS FOR AUTOMATIC ALERTS
-- =======================

-- Trigger to create alert when KYC is about to expire
create or replace function public.trigger_kyc_expiry_alert()
returns trigger
language plpgsql
security definer
as $$
begin
    -- If KYC is approved and expires in 30 days or less
    if NEW.status = 'approved' and NEW.expiry_date is not null then
        if NEW.expiry_date <= current_date + interval '30 days' then
            perform public.create_risk_alert(
                'kyc_expiring',
                'kyc',
                'medium',
                'KYC Verification Expiring Soon',
                format('KYC verification for user expires on %s', NEW.expiry_date),
                NEW.user_id,
                40,
                jsonb_build_object('expiry_date', NEW.expiry_date, 'tier', NEW.tier)
            );
        end if;
    end if;

    return NEW;
end;
$$;

create trigger tr_kyc_expiry_check
    after insert or update on public.kyc_verifications
    for each row
    execute function public.trigger_kyc_expiry_alert();

-- Trigger to create alert for high-risk KYC applications
create or replace function public.trigger_high_risk_kyc_alert()
returns trigger
language plpgsql
security definer
as $$
begin
    -- If risk score is high (> 70) or PEP/sanctions flags
    if NEW.risk_score > 70 or NEW.pep_check = true or NEW.sanctions_check = true then
        perform public.create_risk_alert(
            'high_risk_kyc',
            'aml',
            'high',
            'High Risk KYC Application',
            format('KYC application requires enhanced due diligence. Risk Score: %s', NEW.risk_score),
            NEW.user_id,
            NEW.risk_score,
            jsonb_build_object(
                'pep_check', NEW.pep_check,
                'sanctions_check', NEW.sanctions_check,
                'adverse_media_check', NEW.adverse_media_check,
                'tier', NEW.tier
            )
        );
    end if;

    return NEW;
end;
$$;

create trigger tr_high_risk_kyc
    after insert or update on public.kyc_verifications
    for each row
    execute function public.trigger_high_risk_kyc_alert();

-- =======================
-- 11. RLS POLICIES FOR NEW TABLES
-- =======================

-- KYB Verifications: Admin owners see all, admin clients see their org, others see nothing
create policy "Admin owners can view all KYB"
    on public.kyb_verifications for select
    using (public.is_admin_owner());

create policy "Admin owners can manage KYB"
    on public.kyb_verifications for all
    using (public.is_admin_owner());

-- System Events: Admin owners see all, users see their own
create policy "Admin owners can view all events"
    on public.system_events for select
    using (public.is_admin_owner());

create policy "Users can view their own events"
    on public.system_events for select
    using (user_id = auth.uid());

create policy "System can insert events"
    on public.system_events for insert
    with check (true); -- Allow system to log events

-- Compliance Rules: Admin owners manage, others view
create policy "Everyone can view compliance rules"
    on public.compliance_rules for select
    using (enabled = true);

create policy "Admin owners can manage compliance rules"
    on public.compliance_rules for all
    using (public.is_admin_owner());

-- Risk Alerts: Admin owners and assigned compliance officers see
create policy "Admin owners can view all alerts"
    on public.risk_alerts for select
    using (public.is_admin_owner());

create policy "Assigned officers can view their alerts"
    on public.risk_alerts for select
    using (assigned_to = auth.uid());

create policy "Admin owners can manage alerts"
    on public.risk_alerts for all
    using (public.is_admin_owner());

-- Tier Limits: Everyone can view
create policy "Everyone can view tier limits"
    on public.tier_limits for select
    using (true);

create policy "Admin owners can manage tier limits"
    on public.tier_limits for all
    using (public.is_admin_owner());

-- =======================
-- COMPLETE!
-- =======================
