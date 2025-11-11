-- Capital Partners and Distribution Network Tables
-- Created: 2025-11-11

-- Strategic Partners (Capital Partners, Lenders, Liquidity Providers, Leverage Partners)
create table if not exists public.strategic_partners (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null unique,
    type varchar(50) not null check (type in ('lender', 'liquidity', 'leverage')),
    region varchar(100) not null,
    ticket_size varchar(100),
    ltv_range varchar(50),
    focus_assets text[] default array[]::text[],
    status varchar(50) not null check (status in ('Active', 'Negotiation', 'Prospect')) default 'Prospect',
    notes text,

    -- Contact information
    primary_contact_name varchar(255),
    primary_contact_email varchar(255),
    primary_contact_phone varchar(50),
    website_url text,

    -- Integration details
    api_endpoint text,
    api_key_encrypted text,
    webhook_url text,
    integration_status varchar(50) check (integration_status in ('Live', 'Testing', 'Pending', 'Inactive')),
    last_sync_at timestamptz,

    -- CRM sync
    hubspot_deal_id varchar(100),
    notion_page_id varchar(100),

    -- Metadata
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references auth.users(id)
);

-- Distribution Platforms (Asset Distribution Network)
create table if not exists public.distribution_platforms (
    id uuid primary key default gen_random_uuid(),
    platform varchar(255) not null unique,
    region varchar(100) not null,
    coverage text not null,
    integration_status varchar(50) not null check (integration_status in ('Live', 'Sandbox', 'Planned')) default 'Planned',
    channels text[] default array[]::text[],

    -- Technical integration
    api_type varchar(50) check (api_type in ('REST', 'GraphQL', 'WebSocket', 'FTP', 'Manual')),
    api_endpoint text,
    api_key_encrypted text,
    webhook_url text,
    supported_formats text[] default array['JSON', 'XML', 'CSV']::text[],

    -- Contact information
    technical_contact_name varchar(255),
    technical_contact_email varchar(255),
    business_contact_name varchar(255),
    business_contact_email varchar(255),

    -- Performance metrics
    total_assets_under_distribution numeric(20, 2) default 0,
    total_investors int default 0,
    last_sync_at timestamptz,
    sync_frequency varchar(50) default 'Daily',

    -- Documentation
    documentation_url text,
    onboarding_requirements text[],
    compliance_notes text,

    -- Metadata
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    created_by uuid references auth.users(id)
);

-- Indexes for performance
create index idx_strategic_partners_type on public.strategic_partners(type);
create index idx_strategic_partners_status on public.strategic_partners(status);
create index idx_strategic_partners_region on public.strategic_partners(region);
create index idx_strategic_partners_created_at on public.strategic_partners(created_at desc);

create index idx_distribution_platforms_status on public.distribution_platforms(integration_status);
create index idx_distribution_platforms_region on public.distribution_platforms(region);
create index idx_distribution_platforms_created_at on public.distribution_platforms(created_at desc);

-- Enable Row Level Security
alter table public.strategic_partners enable row level security;
alter table public.distribution_platforms enable row level security;

-- RLS Policies for strategic_partners
-- Admin Owner: Full access
create policy "Admin owners have full access to strategic partners"
    on public.strategic_partners
    for all
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.id = auth.uid()
            and user_profiles.metadata->>'role' = 'admin_owner'
        )
    );

-- Admin Client: Read only
create policy "Admin clients can view strategic partners"
    on public.strategic_partners
    for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.id = auth.uid()
            and user_profiles.metadata->>'role' in ('admin_client', 'admin_owner')
        )
    );

-- Investors: No access to strategic partners (sensitive business data)
-- No policy needed, they have no access by default

-- RLS Policies for distribution_platforms
-- Admin Owner: Full access
create policy "Admin owners have full access to distribution platforms"
    on public.distribution_platforms
    for all
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.id = auth.uid()
            and user_profiles.metadata->>'role' = 'admin_owner'
        )
    );

-- Admin Client: Read only
create policy "Admin clients can view distribution platforms"
    on public.distribution_platforms
    for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.id = auth.uid()
            and user_profiles.metadata->>'role' in ('admin_client', 'admin_owner')
        )
    );

-- Investors: No access (sensitive business data)

-- Triggers for updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_strategic_partners_updated_at
    before update on public.strategic_partners
    for each row
    execute function public.update_updated_at_column();

create trigger update_distribution_platforms_updated_at
    before update on public.distribution_platforms
    for each row
    execute function public.update_updated_at_column();

-- Seed data for strategic_partners
insert into public.strategic_partners (name, type, region, ticket_size, ltv_range, focus_assets, status, notes) values
('Anchorage Lending Desk', 'lender', 'USA', '$10M - $75M', '50% - 70%', array['Tokenized credit', 'Stablecoin mandates'], 'Active', 'Provides segregated accounts, programmable LTV rules.'),
('Atlas Liquidity Network', 'liquidity', 'Europe & APAC', '$5M - $40M', null, array['RWA tokens', 'Yield vaults'], 'Negotiation', 'Requires daily NAV feed + proof-of-liquidity.'),
('Helios Prime Brokerage', 'leverage', 'LatAm / USA', '$15M - $100M', '40% - 65%', array['Lidya HFT', 'Quant portfolios'], 'Prospect', 'Interest in cross-margining vs on-chain collateral.'),
('Summit Stable Credit', 'lender', 'Middle East', '$20M - $60M', '55% - 75%', array['Securitized receivables', 'Energy infrastructure'], 'Active', 'Requests monthly audit package + ESG data.'),
('Omega Market Makers', 'liquidity', 'Global', '$2M - $15M', null, array['Secondary OTC', 'Structured notes'], 'Active', 'Needs API for inventory + settlement instructions.');

-- Seed data for distribution_platforms
insert into public.distribution_platforms (platform, region, coverage, integration_status, channels, api_type) values
('NavFund Services', 'Global', 'Fund administration, transfer agency, investor services', 'Live', array['RIA', 'Private banks'], 'REST'),
('Apex Digital Marketplace', 'EMEA / APAC', 'Secondary trading, SMA onboarding, custodial settlement', 'Sandbox', array['Family Offices', 'Institutional desks'], 'REST'),
('Carta Liquidity', 'USA', 'Cap table sync, investor comms, subscription flows', 'Planned', array['VC/PE funds', 'Accredited investors'], 'GraphQL'),
('Copper Connect', 'EMEA', 'MPC custody, OTC settlement, ref data', 'Live', array['Prime brokers', 'Market makers'], 'REST'),
('Securitize Markets', 'Americas', 'Primary launchpad + investor registry', 'Live', array['BD networks', 'Broker-dealers'], 'REST');

-- Comments for documentation
comment on table public.strategic_partners is 'Strategic capital partners including lenders, liquidity providers, and leverage partners';
comment on table public.distribution_platforms is 'Asset distribution platforms and networks for fund distribution';
comment on column public.strategic_partners.type is 'Type of capital partner: lender, liquidity, or leverage';
comment on column public.strategic_partners.ltv_range is 'Loan-to-value range for lending partners';
comment on column public.distribution_platforms.channels is 'Distribution channels covered by the platform';
