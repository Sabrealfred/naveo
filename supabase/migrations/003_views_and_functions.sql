-- 003_views_and_functions.sql
-- Database views and functions for portfolio calculations, fund performance, and NAV tracking

-- =======================
-- VIEW: portfolio_holdings_view
-- =======================
-- Comprehensive view of user portfolio holdings with current values and performance metrics
create or replace view public.portfolio_holdings_view as
select
    up.id as portfolio_id,
    up.user_id,
    up.fund_id,
    f.name as fund_name,
    f.manager_id as fund_manager_id,
    up.shares,
    up.avg_purchase_price,
    f.current_nav,
    (up.shares * f.current_nav) as current_value,
    (up.shares * up.avg_purchase_price) as invested_amount,
    ((up.shares * f.current_nav) - (up.shares * up.avg_purchase_price)) as unrealized_pnl,
    case
        when up.avg_purchase_price > 0 then
            (((f.current_nav - up.avg_purchase_price) / up.avg_purchase_price) * 100)
        else 0
    end as return_percentage,
    f.total_aum as fund_total_aum,
    f.total_shares as fund_total_shares,
    case
        when f.total_shares > 0 then
            ((up.shares / f.total_shares) * 100)
        else 0
    end as ownership_percentage,
    f.status as fund_status,
    up.created_at as investment_date,
    up.updated_at as last_updated
from public.user_portfolios up
inner join public.funds f on up.fund_id = f.id
where f.status = 'active';

comment on view public.portfolio_holdings_view is 'Comprehensive portfolio holdings with current values and performance metrics';

-- Grant access to authenticated users
grant select on public.portfolio_holdings_view to authenticated;

-- =======================
-- VIEW: fund_performance_view
-- =======================
-- Fund performance metrics including returns, AUM growth, and investor count
create or replace view public.fund_performance_view as
select
    f.id as fund_id,
    f.name as fund_name,
    f.manager_id,
    f.current_nav,
    f.total_aum,
    f.total_shares,
    f.status,

    -- Investor metrics
    count(distinct up.user_id) as total_investors,
    coalesce(sum(up.shares), 0) as total_invested_shares,

    -- Recent transaction metrics (last 30 days)
    count(distinct case when t.created_at >= now() - interval '30 days' then t.id end) as transactions_30d,
    coalesce(sum(case when t.created_at >= now() - interval '30 days' and t.type = 'buy' then t.amount else 0 end), 0) as inflow_30d,
    coalesce(sum(case when t.created_at >= now() - interval '30 days' and t.type = 'sell' then t.amount else 0 end), 0) as outflow_30d,

    -- NAV history metrics (most recent vs 30 days ago)
    (select nav from public.nav_history where fund_id = f.id order by calculation_date desc limit 1) as latest_nav,
    (select nav from public.nav_history where fund_id = f.id and calculation_date <= current_date - interval '30 days' order by calculation_date desc limit 1) as nav_30d_ago,
    (select nav from public.nav_history where fund_id = f.id and calculation_date <= current_date - interval '90 days' order by calculation_date desc limit 1) as nav_90d_ago,
    (select nav from public.nav_history where fund_id = f.id and calculation_date <= current_date - interval '365 days' order by calculation_date desc limit 1) as nav_1y_ago,

    -- Asset metrics
    count(distinct a.id) as total_assets,
    coalesce(sum(a.quantity * a.current_price), 0) as total_asset_value,

    -- Trader metrics
    count(distinct tr.id) filter (where tr.status = 'active') as active_traders,
    coalesce(sum(tr.total_trades), 0) as total_trades,
    coalesce(sum(tr.total_volume), 0) as total_trade_volume,
    coalesce(avg(tr.win_rate), 0) as avg_trader_win_rate,

    -- Timestamps
    f.created_at as fund_created_at,
    f.updated_at as last_updated

from public.funds f
left join public.user_portfolios up on f.id = up.fund_id
left join public.transactions t on f.id = t.fund_id and t.status in ('completed', 'settled')
left join public.assets a on f.id = a.fund_id
left join public.traders tr on f.id = tr.fund_id

group by f.id, f.name, f.manager_id, f.current_nav, f.total_aum, f.total_shares, f.status, f.created_at, f.updated_at;

comment on view public.fund_performance_view is 'Comprehensive fund performance metrics including returns, AUM, transactions, and trader statistics';

-- Grant access to authenticated users
grant select on public.fund_performance_view to authenticated;

-- =======================
-- FUNCTION: calculate_portfolio_value
-- =======================
-- Calculate the current total value of a user's portfolio across all funds
create or replace function public.calculate_portfolio_value(p_user_id uuid)
returns table (
    total_current_value numeric,
    total_invested_amount numeric,
    total_unrealized_pnl numeric,
    total_return_percentage numeric,
    fund_count int,
    last_updated timestamptz
)
language plpgsql
security definer
as $$
begin
    return query
    select
        coalesce(sum(up.shares * f.current_nav), 0)::numeric as total_current_value,
        coalesce(sum(up.shares * up.avg_purchase_price), 0)::numeric as total_invested_amount,
        coalesce(sum((up.shares * f.current_nav) - (up.shares * up.avg_purchase_price)), 0)::numeric as total_unrealized_pnl,
        case
            when sum(up.shares * up.avg_purchase_price) > 0 then
                ((sum(up.shares * f.current_nav) - sum(up.shares * up.avg_purchase_price)) / sum(up.shares * up.avg_purchase_price) * 100)::numeric
            else 0::numeric
        end as total_return_percentage,
        count(distinct up.fund_id)::int as fund_count,
        max(up.updated_at) as last_updated
    from public.user_portfolios up
    inner join public.funds f on up.fund_id = f.id
    where up.user_id = p_user_id
        and f.status = 'active'
        and up.shares > 0;
end;
$$;

comment on function public.calculate_portfolio_value is 'Calculate total portfolio value, invested amount, PnL, and returns for a user';

-- Grant execute to authenticated users
grant execute on function public.calculate_portfolio_value(uuid) to authenticated;

-- =======================
-- FUNCTION: get_nav_history
-- =======================
-- Retrieve NAV history for a fund with optional date range filtering
create or replace function public.get_nav_history(
    p_fund_id uuid,
    p_start_date date default null,
    p_end_date date default null,
    p_limit int default 365
)
returns table (
    id uuid,
    fund_id uuid,
    nav numeric,
    total_shares bigint,
    total_aum numeric,
    calculation_date date,
    calculation_method varchar,
    calculated_by uuid,
    verified boolean,
    verified_by uuid,
    verified_at timestamptz,
    notes text,
    created_at timestamptz
)
language plpgsql
security definer
as $$
begin
    return query
    select
        nh.id,
        nh.fund_id,
        nh.nav,
        nh.total_shares,
        nh.total_aum,
        nh.calculation_date,
        nh.calculation_method,
        nh.calculated_by,
        nh.verified,
        nh.verified_by,
        nh.verified_at,
        nh.notes,
        nh.created_at
    from public.nav_history nh
    where nh.fund_id = p_fund_id
        and (p_start_date is null or nh.calculation_date >= p_start_date)
        and (p_end_date is null or nh.calculation_date <= p_end_date)
    order by nh.calculation_date desc
    limit p_limit;
end;
$$;

comment on function public.get_nav_history is 'Retrieve NAV history for a fund with optional date range filtering';

-- Grant execute to authenticated users
grant execute on function public.get_nav_history(uuid, date, date, int) to authenticated;

-- =======================
-- FUNCTION: get_user_notifications
-- =======================
-- Retrieve notifications for a user with filtering options
create or replace function public.get_user_notifications(
    p_user_id uuid,
    p_read_status boolean default null,
    p_type varchar default null,
    p_priority varchar default null,
    p_limit int default 50
)
returns table (
    id uuid,
    type varchar,
    category varchar,
    priority varchar,
    title varchar,
    message text,
    read boolean,
    link varchar,
    action_required boolean,
    action_url varchar,
    metadata jsonb,
    expires_at timestamptz,
    created_at timestamptz
)
language plpgsql
security definer
as $$
begin
    return query
    select
        n.id,
        n.type,
        n.category,
        n.priority,
        n.title,
        n.message,
        n.read,
        n.link,
        n.action_required,
        n.action_url,
        n.metadata,
        n.expires_at,
        n.created_at
    from public.notifications n
    where n.user_id = p_user_id
        and (p_read_status is null or n.read = p_read_status)
        and (p_type is null or n.type = p_type)
        and (p_priority is null or n.priority = p_priority)
        and (n.expires_at is null or n.expires_at > now())
    order by
        case n.priority
            when 'critical' then 1
            when 'high' then 2
            when 'medium' then 3
            when 'low' then 4
        end,
        n.created_at desc
    limit p_limit;
end;
$$;

comment on function public.get_user_notifications is 'Retrieve notifications for a user with filtering by read status, type, and priority';

-- Grant execute to authenticated users
grant execute on function public.get_user_notifications(uuid, boolean, varchar, varchar, int) to authenticated;

-- =======================
-- FUNCTION: mark_notifications_as_read
-- =======================
-- Mark one or more notifications as read
create or replace function public.mark_notifications_as_read(
    p_user_id uuid,
    p_notification_ids uuid[]
)
returns int
language plpgsql
security definer
as $$
declare
    updated_count int;
begin
    update public.notifications
    set read = true
    where user_id = p_user_id
        and id = any(p_notification_ids)
        and read = false;

    get diagnostics updated_count = row_count;
    return updated_count;
end;
$$;

comment on function public.mark_notifications_as_read is 'Mark one or more notifications as read for a user';

-- Grant execute to authenticated users
grant execute on function public.mark_notifications_as_read(uuid, uuid[]) to authenticated;

-- =======================
-- FUNCTION: get_fund_analytics
-- =======================
-- Comprehensive fund analytics including performance, transactions, and investor metrics
create or replace function public.get_fund_analytics(
    p_fund_id uuid,
    p_period_days int default 30
)
returns table (
    fund_id uuid,
    fund_name varchar,
    current_nav numeric,
    total_aum numeric,
    total_shares bigint,
    total_investors bigint,

    -- Performance metrics
    nav_change_percentage numeric,
    aum_change_percentage numeric,

    -- Transaction metrics
    total_transactions bigint,
    total_inflows numeric,
    total_outflows numeric,
    net_flow numeric,

    -- Investor activity
    new_investors bigint,
    active_investors bigint,

    -- Asset metrics
    total_assets bigint,
    total_asset_value numeric
)
language plpgsql
security definer
as $$
declare
    v_start_date date;
    v_nav_start numeric;
    v_aum_start numeric;
begin
    v_start_date := current_date - p_period_days;

    -- Get NAV at start of period
    select nav into v_nav_start
    from public.nav_history
    where fund_id = p_fund_id
        and calculation_date <= v_start_date
    order by calculation_date desc
    limit 1;

    -- Get AUM at start of period
    select total_aum into v_aum_start
    from public.nav_history
    where fund_id = p_fund_id
        and calculation_date <= v_start_date
    order by calculation_date desc
    limit 1;

    return query
    select
        f.id as fund_id,
        f.name as fund_name,
        f.current_nav,
        f.total_aum,
        f.total_shares,
        count(distinct up.user_id) as total_investors,

        -- Performance metrics
        case
            when v_nav_start > 0 then ((f.current_nav - v_nav_start) / v_nav_start * 100)::numeric
            else 0::numeric
        end as nav_change_percentage,
        case
            when v_aum_start > 0 then ((f.total_aum - v_aum_start) / v_aum_start * 100)::numeric
            else 0::numeric
        end as aum_change_percentage,

        -- Transaction metrics
        count(distinct t.id) filter (where t.created_at >= v_start_date) as total_transactions,
        coalesce(sum(t.amount) filter (where t.type in ('buy', 'deposit') and t.created_at >= v_start_date and t.status in ('completed', 'settled')), 0)::numeric as total_inflows,
        coalesce(sum(t.amount) filter (where t.type in ('sell', 'withdraw') and t.created_at >= v_start_date and t.status in ('completed', 'settled')), 0)::numeric as total_outflows,
        coalesce(
            sum(t.amount) filter (where t.type in ('buy', 'deposit') and t.created_at >= v_start_date and t.status in ('completed', 'settled')) -
            sum(t.amount) filter (where t.type in ('sell', 'withdraw') and t.created_at >= v_start_date and t.status in ('completed', 'settled')),
            0
        )::numeric as net_flow,

        -- Investor activity
        count(distinct up.user_id) filter (where up.created_at >= v_start_date) as new_investors,
        count(distinct t.user_id) filter (where t.created_at >= v_start_date) as active_investors,

        -- Asset metrics
        count(distinct a.id) as total_assets,
        coalesce(sum(a.quantity * a.current_price), 0)::numeric as total_asset_value

    from public.funds f
    left join public.user_portfolios up on f.id = up.fund_id
    left join public.transactions t on f.id = t.fund_id
    left join public.assets a on f.id = a.fund_id
    where f.id = p_fund_id
    group by f.id, f.name, f.current_nav, f.total_aum, f.total_shares;
end;
$$;

comment on function public.get_fund_analytics is 'Comprehensive fund analytics including performance, transactions, and investor metrics for a specified period';

-- Grant execute to authenticated users
grant execute on function public.get_fund_analytics(uuid, int) to authenticated;

-- =======================
-- FUNCTION: get_kyc_statistics
-- =======================
-- Get KYC verification statistics by status and tier
create or replace function public.get_kyc_statistics()
returns table (
    total_verifications bigint,
    pending_count bigint,
    approved_count bigint,
    rejected_count bigint,
    needs_review_count bigint,
    expired_count bigint,
    tier1_count bigint,
    tier2_count bigint,
    tier3_count bigint,
    avg_processing_time_hours numeric,
    high_risk_count bigint
)
language plpgsql
security definer
as $$
begin
    return query
    select
        count(*)::bigint as total_verifications,
        count(*) filter (where status = 'pending')::bigint as pending_count,
        count(*) filter (where status = 'approved')::bigint as approved_count,
        count(*) filter (where status = 'rejected')::bigint as rejected_count,
        count(*) filter (where status = 'needs_review')::bigint as needs_review_count,
        count(*) filter (where status = 'expired')::bigint as expired_count,
        count(*) filter (where tier = 1)::bigint as tier1_count,
        count(*) filter (where tier = 2)::bigint as tier2_count,
        count(*) filter (where tier = 3)::bigint as tier3_count,
        coalesce(
            avg(extract(epoch from (reviewed_at - submitted_at)) / 3600) filter (where reviewed_at is not null),
            0
        )::numeric as avg_processing_time_hours,
        count(*) filter (where risk_score >= 70)::bigint as high_risk_count
    from public.kyc_verifications;
end;
$$;

comment on function public.get_kyc_statistics is 'Get comprehensive KYC verification statistics by status, tier, and risk level';

-- Grant execute to authenticated users (admin only in RLS)
grant execute on function public.get_kyc_statistics() to authenticated;

-- =======================
-- SUMMARY
-- =======================

-- Views created:
-- 1. portfolio_holdings_view - Comprehensive portfolio holdings with current values
-- 2. fund_performance_view - Fund performance metrics with investor and transaction data

-- Functions created:
-- 1. calculate_portfolio_value - Calculate user's total portfolio value and returns
-- 2. get_nav_history - Retrieve NAV history with date range filtering
-- 3. get_user_notifications - Retrieve user notifications with filtering
-- 4. mark_notifications_as_read - Mark notifications as read
-- 5. get_fund_analytics - Comprehensive fund analytics for specified period
-- 6. get_kyc_statistics - KYC verification statistics

comment on schema public is 'Naveo platform - Views and functions for portfolio calculations, analytics, and data aggregation';
