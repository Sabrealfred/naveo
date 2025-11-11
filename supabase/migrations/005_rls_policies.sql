-- =====================================================
-- Row Level Security (RLS) Policies
-- Implements comprehensive access control for all tables
-- =====================================================

-- =====================================================
-- User Roles (stored in auth.users metadata)
-- - admin_owner: Platform super admin (full access)
-- - admin_client: Fund manager (access to their fund's data)
-- - investor: End user (access to their own data)
-- =====================================================

-- Helper function to check if user is admin_owner
create or replace function public.is_admin_owner()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (auth.jwt()->>'user_role')::text = 'admin_owner',
    false
  );
$$;

-- Helper function to check if user is admin_client
create or replace function public.is_admin_client()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (auth.jwt()->>'user_role')::text = 'admin_client',
    false
  );
$$;

-- Helper function to check if user is investor
create or replace function public.is_investor()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (auth.jwt()->>'user_role')::text = 'investor',
    false
  );
$$;

-- Helper function to get user's fund_id (for admin_client)
create or replace function public.get_user_fund_id()
returns uuid
language sql
security definer
stable
as $$
  select (auth.jwt()->>'fund_id')::uuid;
$$;

-- =====================================================
-- FUNDS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_funds_all"
  on public.funds
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Read their own fund
create policy "admin_client_funds_read"
  on public.funds
  for select
  to authenticated
  using (
    is_admin_client() and
    id = get_user_fund_id()
  );

-- Admin Client: Update their own fund
create policy "admin_client_funds_update"
  on public.funds
  for update
  to authenticated
  using (
    is_admin_client() and
    id = get_user_fund_id()
  )
  with check (
    is_admin_client() and
    id = get_user_fund_id()
  );

-- Investors: Read active funds only
create policy "investor_funds_read"
  on public.funds
  for select
  to authenticated
  using (
    is_investor() and
    status = 'active'
  );

-- =====================================================
-- ASSETS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_assets_all"
  on public.assets
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Full access to their fund's assets
create policy "admin_client_assets_all"
  on public.assets
  for all
  to authenticated
  using (
    is_admin_client() and
    fund_id = get_user_fund_id()
  )
  with check (
    is_admin_client() and
    fund_id = get_user_fund_id()
  );

-- Investors: Read assets of funds they're invested in
create policy "investor_assets_read"
  on public.assets
  for select
  to authenticated
  using (
    is_investor() and
    fund_id in (
      select fund_id
      from public.user_portfolios
      where user_id = auth.uid()
    )
  );

-- =====================================================
-- TRANSACTIONS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_transactions_all"
  on public.transactions
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Read transactions for their fund
create policy "admin_client_transactions_read"
  on public.transactions
  for select
  to authenticated
  using (
    is_admin_client() and
    fund_id = get_user_fund_id()
  );

-- Investors: Full access to their own transactions
create policy "investor_transactions_all"
  on public.transactions
  for all
  to authenticated
  using (
    is_investor() and
    user_id = auth.uid()
  )
  with check (
    is_investor() and
    user_id = auth.uid()
  );

-- =====================================================
-- USER PORTFOLIOS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_portfolios_all"
  on public.user_portfolios
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Read portfolios for their fund
create policy "admin_client_portfolios_read"
  on public.user_portfolios
  for select
  to authenticated
  using (
    is_admin_client() and
    fund_id = get_user_fund_id()
  );

-- Investors: Full access to their own portfolios
create policy "investor_portfolios_all"
  on public.user_portfolios
  for all
  to authenticated
  using (
    is_investor() and
    user_id = auth.uid()
  )
  with check (
    is_investor() and
    user_id = auth.uid()
  );

-- =====================================================
-- TRADERS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_traders_all"
  on public.traders
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Full access to their fund's traders
create policy "admin_client_traders_all"
  on public.traders
  for all
  to authenticated
  using (
    is_admin_client() and
    fund_id = get_user_fund_id()
  )
  with check (
    is_admin_client() and
    fund_id = get_user_fund_id()
  );

-- Traders: Read their own trader record
create policy "trader_read_own"
  on public.traders
  for select
  to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- KYC VERIFICATIONS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_kyc_all"
  on public.kyc_verifications
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Read KYC for users invested in their fund
create policy "admin_client_kyc_read"
  on public.kyc_verifications
  for select
  to authenticated
  using (
    is_admin_client() and
    user_id in (
      select user_id
      from public.user_portfolios
      where fund_id = get_user_fund_id()
    )
  );

-- Users: Access their own KYC records
create policy "user_kyc_own"
  on public.kyc_verifications
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- =====================================================
-- NOTIFICATIONS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_notifications_all"
  on public.notifications
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Users: Full access to their own notifications
create policy "user_notifications_own"
  on public.notifications
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- =====================================================
-- REPORTS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_reports_all"
  on public.reports
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Full access to their fund's reports
create policy "admin_client_reports_all"
  on public.reports
  for all
  to authenticated
  using (
    is_admin_client() and
    fund_id = get_user_fund_id()
  )
  with check (
    is_admin_client() and
    fund_id = get_user_fund_id()
  );

-- Investors: Read reports for funds they're invested in
create policy "investor_reports_read"
  on public.reports
  for select
  to authenticated
  using (
    is_investor() and
    fund_id in (
      select fund_id
      from public.user_portfolios
      where user_id = auth.uid()
    )
  );

-- =====================================================
-- SYSTEM EVENTS TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_events_all"
  on public.system_events
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Read events related to their fund
create policy "admin_client_events_read"
  on public.system_events
  for select
  to authenticated
  using (
    is_admin_client() and
    (
      metadata->>'fund_id' = get_user_fund_id()::text or
      event_category = 'fund'
    )
  );

-- Users: Read their own events
create policy "user_events_own"
  on public.system_events
  for select
  to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- NAV HISTORY TABLE POLICIES
-- =====================================================

-- Admin Owner: Full access
create policy "admin_owner_nav_all"
  on public.nav_history
  for all
  to authenticated
  using (is_admin_owner())
  with check (is_admin_owner());

-- Admin Client: Full access to their fund's NAV history
create policy "admin_client_nav_all"
  on public.nav_history
  for all
  to authenticated
  using (
    is_admin_client() and
    fund_id = get_user_fund_id()
  )
  with check (
    is_admin_client() and
    fund_id = get_user_fund_id()
  );

-- Investors: Read NAV history for funds they're invested in or active funds
create policy "investor_nav_read"
  on public.nav_history
  for select
  to authenticated
  using (
    is_investor() and
    (
      fund_id in (
        select fund_id
        from public.user_portfolios
        where user_id = auth.uid()
      ) or
      fund_id in (
        select id
        from public.funds
        where status = 'active'
      )
    )
  );

-- =====================================================
-- VIEW PERMISSIONS
-- =====================================================

-- Grant access to views for authenticated users
grant select on public.portfolio_holdings_view to authenticated;
grant select on public.fund_performance_view to authenticated;

-- Views will inherit RLS from underlying tables
-- No additional policies needed

-- =====================================================
-- FUNCTION PERMISSIONS
-- =====================================================

-- Grant execute on public functions to authenticated users
grant execute on function public.calculate_portfolio_value(uuid) to authenticated;
grant execute on function public.get_nav_history(uuid, date, date, int) to authenticated;
grant execute on function public.get_user_notifications(uuid, int, boolean) to authenticated;
grant execute on function public.mark_notifications_as_read(uuid[]) to authenticated;
grant execute on function public.get_fund_analytics(uuid) to authenticated;
grant execute on function public.get_kyc_statistics() to authenticated;

-- Grant execute on helper functions
grant execute on function public.is_admin_owner() to authenticated;
grant execute on function public.is_admin_client() to authenticated;
grant execute on function public.is_investor() to authenticated;
grant execute on function public.get_user_fund_id() to authenticated;

-- =====================================================
-- COMMENTS
-- =====================================================

comment on function public.is_admin_owner is 'Helper function to check if current user has admin_owner role';
comment on function public.is_admin_client is 'Helper function to check if current user has admin_client role';
comment on function public.is_investor is 'Helper function to check if current user has investor role';
comment on function public.get_user_fund_id is 'Helper function to get the fund_id associated with admin_client user';

-- =====================================================
-- END OF RLS POLICIES
-- =====================================================
