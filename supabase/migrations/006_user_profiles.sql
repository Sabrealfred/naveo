-- =====================================================
-- User Profiles Table
-- Extends auth.users with additional profile information
-- =====================================================

-- Create user_profiles table
create table if not exists public.user_profiles (
    id uuid primary key references auth.users(id) on delete cascade,

    -- Basic Information
    full_name varchar(255),
    display_name varchar(100),
    avatar_url text,
    phone varchar(50),
    date_of_birth date,

    -- Address Information
    street_address text,
    city varchar(100),
    state_province varchar(100),
    postal_code varchar(20),
    country varchar(100) default 'United States',

    -- Investor-specific fields
    investor_type varchar(50) check (investor_type in ('individual', 'corporate', 'institutional', 'trust', 'other')),
    risk_tolerance varchar(50) check (risk_tolerance in ('conservative', 'moderate', 'aggressive', 'very_aggressive')),
    investment_experience varchar(50) check (investment_experience in ('none', 'limited', 'intermediate', 'advanced', 'expert')),
    accredited_investor boolean default false,
    annual_income_range varchar(50),
    net_worth_range varchar(50),

    -- Admin-specific fields
    job_title varchar(150),
    department varchar(100),
    company_name varchar(200),
    professional_bio text,
    linkedin_url text,

    -- Preferences
    language varchar(10) default 'en',
    timezone varchar(50) default 'America/New_York',
    currency varchar(10) default 'USD',
    notification_preferences jsonb default '{
        "email": true,
        "sms": false,
        "push": true,
        "marketing": false
    }'::jsonb,

    -- KYC/Compliance
    tax_id varchar(50), -- SSN, EIN, etc (encrypted in production)
    passport_number varchar(50), -- encrypted in production
    id_document_type varchar(50),
    id_document_number varchar(100),
    id_document_expiry date,
    citizenship varchar(100),
    tax_residency varchar(100),

    -- Metadata
    onboarding_completed boolean default false,
    profile_completed_at timestamptz,
    last_login_at timestamptz,
    login_count int default 0,
    terms_accepted_at timestamptz,
    privacy_policy_accepted_at timestamptz,
    metadata jsonb default '{}'::jsonb,

    -- Timestamps
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Create indices for performance
create index if not exists idx_user_profiles_full_name on public.user_profiles(full_name);
create index if not exists idx_user_profiles_investor_type on public.user_profiles(investor_type);
create index if not exists idx_user_profiles_country on public.user_profiles(country);
create index if not exists idx_user_profiles_onboarding_completed on public.user_profiles(onboarding_completed);

-- Create updated_at trigger
create trigger update_user_profiles_updated_at
    before update on public.user_profiles
    for each row
    execute function public.update_updated_at_column();

-- Create function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
    insert into public.user_profiles (id, full_name, created_at)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.email),
        now()
    );
    return new;
end;
$$;

-- Trigger to create profile automatically on user signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- =====================================================
-- RLS POLICIES FOR USER_PROFILES
-- =====================================================

-- Admin Owner: Full access to all profiles
create policy "admin_owner_profiles_all"
    on public.user_profiles
    for all
    to authenticated
    using (public.is_admin_owner())
    with check (public.is_admin_owner());

-- Admin Client: Read profiles of investors in their fund
create policy "admin_client_profiles_read"
    on public.user_profiles
    for select
    to authenticated
    using (
        public.is_admin_client() and
        id in (
            select user_id
            from public.user_portfolios
            where fund_id = public.get_user_fund_id()
        )
    );

-- Users: Full access to their own profile
create policy "users_own_profile"
    on public.user_profiles
    for all
    to authenticated
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- =====================================================
-- COMMENTS
-- =====================================================

comment on table public.user_profiles is 'Extended user profile information for all users';
comment on column public.user_profiles.investor_type is 'Type of investor: individual, corporate, institutional, trust, other';
comment on column public.user_profiles.risk_tolerance is 'Investment risk tolerance level';
comment on column public.user_profiles.accredited_investor is 'Whether user meets accredited investor criteria';
comment on column public.user_profiles.notification_preferences is 'JSON object with notification preferences';
comment on column public.user_profiles.onboarding_completed is 'Whether user has completed onboarding process';

-- =====================================================
-- END OF USER_PROFILES MIGRATION
-- =====================================================
