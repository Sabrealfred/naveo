-- 004_triggers_and_audit.sql
-- Database triggers for audit logging, timestamp updates, and automated portfolio management

-- =======================
-- TRIGGER FUNCTION: update_updated_at
-- =======================
-- Automatically update the updated_at timestamp whenever a row is modified
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

comment on function public.update_updated_at is 'Trigger function to automatically update updated_at timestamp on row modifications';

-- =======================
-- TRIGGER FUNCTION: log_system_event
-- =======================
-- Automatically log system events for audit trail
create or replace function public.log_system_event()
returns trigger
language plpgsql
security definer
as $$
declare
    v_event_type varchar(100);
    v_event_category varchar(50);
    v_action varchar(50);
    v_description text;
    v_user_id uuid;
    v_fund_id uuid;
begin
    -- Determine the action
    if (TG_OP = 'INSERT') then
        v_action := 'create';
    elsif (TG_OP = 'UPDATE') then
        v_action := 'update';
    elsif (TG_OP = 'DELETE') then
        v_action := 'delete';
    end if;

    -- Set event type and category based on table
    v_event_type := TG_TABLE_NAME || '_' || lower(v_action);

    case TG_TABLE_NAME
        when 'transactions' then
            v_event_category := 'transaction';
            v_user_id := coalesce(new.user_id, old.user_id);
            v_fund_id := coalesce(new.fund_id, old.fund_id);
            v_description := format('Transaction %s: %s', v_action, coalesce(new.type, old.type));
        when 'kyc_verifications' then
            v_event_category := 'compliance';
            v_user_id := coalesce(new.user_id, old.user_id);
            v_description := format('KYC verification %s: status %s', v_action, coalesce(new.status, old.status));
        when 'nav_history' then
            v_event_category := 'fund_ops';
            v_user_id := coalesce(new.calculated_by, old.calculated_by);
            v_fund_id := coalesce(new.fund_id, old.fund_id);
            v_description := format('NAV calculation %s for fund', v_action);
        when 'funds' then
            v_event_category := 'fund_ops';
            v_user_id := coalesce(new.manager_id, old.manager_id);
            v_fund_id := coalesce(new.id, old.id);
            v_description := format('Fund %s: %s', v_action, coalesce(new.name, old.name));
        when 'assets' then
            v_event_category := 'fund_ops';
            v_fund_id := coalesce(new.fund_id, old.fund_id);
            v_description := format('Asset %s: %s', v_action, coalesce(new.symbol, old.symbol));
        when 'traders' then
            v_event_category := 'team';
            v_user_id := coalesce(new.user_id, old.user_id);
            v_fund_id := coalesce(new.fund_id, old.fund_id);
            v_description := format('Trader %s', v_action);
        when 'user_portfolios' then
            v_event_category := 'portfolio';
            v_user_id := coalesce(new.user_id, old.user_id);
            v_fund_id := coalesce(new.fund_id, old.fund_id);
            v_description := format('Portfolio %s', v_action);
        else
            v_event_category := 'system';
            v_description := format('%s %s', TG_TABLE_NAME, v_action);
    end case;

    -- Insert the audit log entry
    insert into public.system_events (
        event_type,
        event_category,
        user_id,
        fund_id,
        resource_type,
        resource_id,
        action,
        status,
        severity,
        description,
        metadata
    ) values (
        v_event_type,
        v_event_category,
        v_user_id,
        v_fund_id,
        TG_TABLE_NAME,
        coalesce(new.id, old.id),
        v_action,
        'success',
        'info',
        v_description,
        case
            when TG_OP = 'UPDATE' then
                jsonb_build_object(
                    'old', row_to_json(old),
                    'new', row_to_json(new)
                )
            when TG_OP = 'INSERT' then
                jsonb_build_object('new', row_to_json(new))
            when TG_OP = 'DELETE' then
                jsonb_build_object('old', row_to_json(old))
        end
    );

    if TG_OP = 'DELETE' then
        return old;
    else
        return new;
    end if;
end;
$$;

comment on function public.log_system_event is 'Trigger function to automatically log system events for audit trail';

-- =======================
-- TRIGGER FUNCTION: update_portfolio_after_transaction
-- =======================
-- Automatically update user portfolio when a transaction is completed
create or replace function public.update_portfolio_after_transaction()
returns trigger
language plpgsql
security definer
as $$
declare
    v_portfolio_exists boolean;
    v_current_shares numeric(18, 8);
    v_current_avg_price numeric(18, 2);
    v_new_total_cost numeric(18, 2);
    v_new_shares numeric(18, 8);
begin
    -- Only process completed or settled transactions
    if new.status not in ('completed', 'settled') then
        return new;
    end if;

    -- Only process if status just changed to completed/settled
    if old.status = new.status then
        return new;
    end if;

    -- Check if portfolio exists
    select exists(
        select 1 from public.user_portfolios
        where user_id = new.user_id and fund_id = new.fund_id
    ) into v_portfolio_exists;

    -- Get current portfolio values if exists
    if v_portfolio_exists then
        select shares, avg_purchase_price
        into v_current_shares, v_current_avg_price
        from public.user_portfolios
        where user_id = new.user_id and fund_id = new.fund_id;
    else
        v_current_shares := 0;
        v_current_avg_price := 0;
    end if;

    -- Calculate new values based on transaction type
    if new.type in ('buy', 'deposit') then
        v_new_shares := v_current_shares + new.shares;
        v_new_total_cost := (v_current_shares * v_current_avg_price) + new.amount;

        -- Insert or update portfolio
        insert into public.user_portfolios (user_id, fund_id, shares, avg_purchase_price)
        values (new.user_id, new.fund_id, v_new_shares, v_new_total_cost / v_new_shares)
        on conflict (user_id, fund_id)
        do update set
            shares = excluded.shares,
            avg_purchase_price = excluded.avg_purchase_price,
            updated_at = now();

    elsif new.type in ('sell', 'withdraw') then
        v_new_shares := v_current_shares - new.shares;

        if v_new_shares <= 0 then
            -- Delete portfolio entry if all shares sold
            delete from public.user_portfolios
            where user_id = new.user_id and fund_id = new.fund_id;
        else
            -- Update with remaining shares (keep same avg price)
            update public.user_portfolios
            set shares = v_new_shares,
                updated_at = now()
            where user_id = new.user_id and fund_id = new.fund_id;
        end if;
    end if;

    return new;
end;
$$;

comment on function public.update_portfolio_after_transaction is 'Trigger function to automatically update user portfolio when transaction is completed';

-- =======================
-- TRIGGER FUNCTION: update_fund_totals
-- =======================
-- Update fund totals (total_shares, total_aum) when portfolios change
create or replace function public.update_fund_totals()
returns trigger
language plpgsql
security definer
as $$
declare
    v_fund_id uuid;
    v_total_shares bigint;
    v_total_aum numeric(18, 2);
    v_current_nav numeric(18, 2);
begin
    -- Determine which fund to update
    v_fund_id := coalesce(new.fund_id, old.fund_id);

    -- Get current NAV for the fund
    select current_nav into v_current_nav
    from public.funds
    where id = v_fund_id;

    -- Calculate new totals
    select
        coalesce(sum(shares), 0),
        coalesce(sum(shares * v_current_nav), 0)
    into v_total_shares, v_total_aum
    from public.user_portfolios
    where fund_id = v_fund_id;

    -- Update fund totals
    update public.funds
    set
        total_shares = v_total_shares,
        total_aum = v_total_aum,
        updated_at = now()
    where id = v_fund_id;

    if TG_OP = 'DELETE' then
        return old;
    else
        return new;
    end if;
end;
$$;

comment on function public.update_fund_totals is 'Trigger function to update fund totals when portfolios change';

-- =======================
-- TRIGGER FUNCTION: notify_kyc_status_change
-- =======================
-- Create notification when KYC status changes
create or replace function public.notify_kyc_status_change()
returns trigger
language plpgsql
security definer
as $$
declare
    v_title varchar(255);
    v_message text;
    v_priority varchar(20);
begin
    -- Only notify if status actually changed
    if old.status = new.status then
        return new;
    end if;

    -- Determine notification content based on status
    case new.status
        when 'approved' then
            v_title := 'KYC Verification Approved';
            v_message := format('Your Tier %s KYC verification has been approved. You can now proceed with investments.', new.tier);
            v_priority := 'high';
        when 'rejected' then
            v_title := 'KYC Verification Rejected';
            v_message := format('Your KYC verification was rejected. Reason: %s', coalesce(new.rejection_reason, 'Please contact support for details'));
            v_priority := 'high';
        when 'needs_review' then
            v_title := 'KYC Verification Needs Review';
            v_message := 'Your KYC verification requires additional review. Our compliance team will contact you shortly.';
            v_priority := 'medium';
        when 'expired' then
            v_title := 'KYC Verification Expired';
            v_message := 'Your KYC verification has expired. Please resubmit your documents to continue investing.';
            v_priority := 'high';
        else
            return new;
    end case;

    -- Insert notification
    insert into public.notifications (
        user_id,
        type,
        category,
        priority,
        title,
        message,
        action_required,
        action_url,
        metadata
    ) values (
        new.user_id,
        'kyc',
        'compliance',
        v_priority,
        v_title,
        v_message,
        new.status in ('rejected', 'expired'),
        case
            when new.status in ('rejected', 'expired') then '/compliance/kyc'
            else null
        end,
        jsonb_build_object(
            'kyc_id', new.id,
            'tier', new.tier,
            'status', new.status
        )
    );

    return new;
end;
$$;

comment on function public.notify_kyc_status_change is 'Trigger function to create notification when KYC status changes';

-- =======================
-- TRIGGER FUNCTION: notify_transaction_status_change
-- =======================
-- Create notification when transaction status changes
create or replace function public.notify_transaction_status_change()
returns trigger
language plpgsql
security definer
as $$
declare
    v_title varchar(255);
    v_message text;
    v_priority varchar(20);
    v_fund_name varchar(255);
begin
    -- Only notify if status actually changed
    if old.status = new.status then
        return new;
    end if;

    -- Get fund name
    select name into v_fund_name
    from public.funds
    where id = new.fund_id;

    -- Determine notification content based on status
    case new.status
        when 'completed', 'settled' then
            v_title := format('Transaction %s', initcap(new.status));
            v_message := format('Your %s transaction of %s shares in %s has been %s.',
                new.type,
                new.shares,
                coalesce(v_fund_name, 'the fund'),
                new.status
            );
            v_priority := 'medium';
        when 'failed' then
            v_title := 'Transaction Failed';
            v_message := format('Your %s transaction of %s shares has failed. Please contact support if you need assistance.',
                new.type,
                new.shares
            );
            v_priority := 'high';
        when 'cancelled' then
            v_title := 'Transaction Cancelled';
            v_message := format('Your %s transaction of %s shares has been cancelled.',
                new.type,
                new.shares
            );
            v_priority := 'low';
        else
            return new;
    end case;

    -- Insert notification
    insert into public.notifications (
        user_id,
        type,
        category,
        priority,
        title,
        message,
        link,
        metadata
    ) values (
        new.user_id,
        'transaction',
        'portfolio',
        v_priority,
        v_title,
        v_message,
        '/transactions',
        jsonb_build_object(
            'transaction_id', new.id,
            'fund_id', new.fund_id,
            'type', new.type,
            'status', new.status,
            'amount', new.amount
        )
    );

    return new;
end;
$$;

comment on function public.notify_transaction_status_change is 'Trigger function to create notification when transaction status changes';

-- =======================
-- APPLY TRIGGERS TO TABLES
-- =======================

-- Triggers for updated_at timestamp
create trigger update_funds_updated_at
    before update on public.funds
    for each row
    execute function public.update_updated_at();

create trigger update_assets_updated_at
    before update on public.assets
    for each row
    execute function public.update_updated_at();

create trigger update_user_portfolios_updated_at
    before update on public.user_portfolios
    for each row
    execute function public.update_updated_at();

create trigger update_kyc_verifications_updated_at
    before update on public.kyc_verifications
    for each row
    execute function public.update_updated_at();

create trigger update_reports_updated_at
    before update on public.reports
    for each row
    execute function public.update_updated_at();

-- Audit logging triggers
create trigger log_transaction_events
    after insert or update or delete on public.transactions
    for each row
    execute function public.log_system_event();

create trigger log_kyc_events
    after insert or update or delete on public.kyc_verifications
    for each row
    execute function public.log_system_event();

create trigger log_nav_events
    after insert or update or delete on public.nav_history
    for each row
    execute function public.log_system_event();

create trigger log_fund_events
    after insert or update or delete on public.funds
    for each row
    execute function public.log_system_event();

create trigger log_asset_events
    after insert or update or delete on public.assets
    for each row
    execute function public.log_system_event();

create trigger log_trader_events
    after insert or update or delete on public.traders
    for each row
    execute function public.log_system_event();

create trigger log_portfolio_events
    after insert or update or delete on public.user_portfolios
    for each row
    execute function public.log_system_event();

-- Portfolio management triggers
create trigger update_portfolio_on_transaction
    after update on public.transactions
    for each row
    execute function public.update_portfolio_after_transaction();

create trigger update_fund_totals_on_portfolio_change
    after insert or update or delete on public.user_portfolios
    for each row
    execute function public.update_fund_totals();

-- Notification triggers
create trigger notify_on_kyc_status_change
    after update on public.kyc_verifications
    for each row
    execute function public.notify_kyc_status_change();

create trigger notify_on_transaction_status_change
    after update on public.transactions
    for each row
    execute function public.notify_transaction_status_change();

-- =======================
-- SUMMARY
-- =======================

-- Trigger functions created:
-- 1. update_updated_at - Auto-update timestamp on modifications
-- 2. log_system_event - Comprehensive audit logging
-- 3. update_portfolio_after_transaction - Auto-update portfolio on transaction completion
-- 4. update_fund_totals - Auto-update fund totals when portfolios change
-- 5. notify_kyc_status_change - Auto-create notifications on KYC status changes
-- 6. notify_transaction_status_change - Auto-create notifications on transaction status changes

-- Triggers applied:
-- - 5 updated_at triggers (funds, assets, user_portfolios, kyc_verifications, reports)
-- - 7 audit logging triggers (all major tables)
-- - 2 portfolio management triggers
-- - 2 notification triggers

comment on schema public is 'Naveo platform - Triggers for audit logging, automatic updates, and notification generation';
