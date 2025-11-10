-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Funds table
create table if not exists public.funds (
    id uuid primary key default uuid_generate_v4(),
    name varchar(255) not null,
    description text,
    manager_id uuid references auth.users (id),
    current_nav numeric(18, 2),
    total_aum numeric(18, 2),
    total_shares bigint,
    status varchar(50) default 'active',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.funds enable row level security;

-- Assets table
create table if not exists public.assets (
    id uuid primary key default uuid_generate_v4(),
    fund_id uuid references public.funds (id) on delete cascade,
    symbol varchar(20) not null,
    name varchar(255) not null,
    type varchar(50),
    quantity numeric(18, 8),
    purchase_price numeric(18, 2),
    current_price numeric(18, 2),
    purchase_date date,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.assets enable row level security;

-- Transactions table
create table if not exists public.transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users (id),
    fund_id uuid references public.funds (id) on delete set null,
    type varchar(50),
    shares numeric(18, 8),
    nav_at_time numeric(18, 2),
    amount numeric(18, 2),
    status varchar(50) default 'pending',
    created_at timestamptz default now()
);

alter table public.transactions enable row level security;

-- User portfolios table
create table if not exists public.user_portfolios (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users (id),
    fund_id uuid references public.funds (id) on delete cascade,
    shares numeric(18, 8),
    avg_purchase_price numeric(18, 2),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (user_id, fund_id)
);

alter table public.user_portfolios enable row level security;

-- Traders table
create table if not exists public.traders (
    id uuid primary key default uuid_generate_v4(),
    fund_id uuid references public.funds (id) on delete cascade,
    user_id uuid references auth.users (id),
    role varchar(50),
    total_trades int default 0,
    total_volume numeric(18, 2) default 0,
    total_pnl numeric(18, 2) default 0,
    win_rate numeric(5, 2),
    status varchar(50) default 'active',
    created_at timestamptz default now()
);

alter table public.traders enable row level security;

-- Policies for funds visibility
drop policy if exists admin_owner_all on public.funds;
create policy admin_owner_all on public.funds
    for all
    using ((auth.jwt() ->> 'role') = 'admin_owner');

drop policy if exists fund_manager_own on public.funds;
create policy fund_manager_own on public.funds
    for all
    using (manager_id = auth.uid());

drop policy if exists investor_view on public.funds;
create policy investor_view on public.funds
    for select
    using (
        exists (
            select 1 from public.user_portfolios up
            where up.fund_id = funds.id
              and up.user_id = auth.uid()
        )
    );

-- Basic select policy for related tables mirroring funds visibility
drop policy if exists assets_fund_policy on public.assets;
create policy assets_fund_policy on public.assets
    for select
    using (
        exists (
            select 1 from public.funds f
            where f.id = assets.fund_id
              and (
                (auth.jwt() ->> 'role') = 'admin_owner'
                or f.manager_id = auth.uid()
                or exists (
                    select 1 from public.user_portfolios up
                    where up.fund_id = f.id
                      and up.user_id = auth.uid()
                )
              )
        )
    );

drop policy if exists transactions_view_policy on public.transactions;
create policy transactions_view_policy on public.transactions
    for select
    using (
        (auth.jwt() ->> 'role') = 'admin_owner'
        or user_id = auth.uid()
    );

drop policy if exists user_portfolios_policy on public.user_portfolios;
create policy user_portfolios_policy on public.user_portfolios
    for select
    using (
        (auth.jwt() ->> 'role') = 'admin_owner'
        or user_id = auth.uid()
    );

drop policy if exists traders_policy on public.traders;
create policy traders_policy on public.traders
    for select
    using (
        (auth.jwt() ->> 'role') = 'admin_owner'
        or exists (
            select 1 from public.funds f
            where f.id = traders.fund_id
              and f.manager_id = auth.uid()
        )
    );

comment on table public.funds is 'Funds managed within Naveo';
comment on table public.assets is 'Assets belonging to specific funds';
comment on table public.transactions is 'User transactions against funds';
comment on table public.user_portfolios is 'Investor holdings per fund';
comment on table public.traders is 'Trader assignments and stats';
