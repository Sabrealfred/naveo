import { supabaseClient } from './supabaseClient';
import type { Fund, FundPerformance, FundAnalytics } from './types';

/**
 * Funds Service
 * Handles all fund-related operations including CRUD, performance metrics, and analytics
 */

/**
 * Get all funds
 */
export async function getAllFunds() {
  const { data, error } = await supabaseClient
    .from('funds')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Fund[];
}

/**
 * Get active funds only
 */
export async function getActiveFunds() {
  const { data, error } = await supabaseClient
    .from('funds')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Fund[];
}

/**
 * Get fund by ID
 */
export async function getFundById(fundId: string) {
  const { data, error } = await supabaseClient
    .from('funds')
    .select('*')
    .eq('id', fundId)
    .single();

  if (error) throw error;
  return data as Fund;
}

/**
 * Get funds managed by a specific user
 */
export async function getFundsByManager(managerId: string) {
  const { data, error } = await supabaseClient
    .from('funds')
    .select('*')
    .eq('manager_id', managerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Fund[];
}

/**
 * Create a new fund
 */
export async function createFund(fund: Partial<Fund>) {
  const { data, error } = await supabaseClient
    .from('funds')
    .insert(fund)
    .select()
    .single();

  if (error) throw error;
  return data as Fund;
}

/**
 * Update fund
 */
export async function updateFund(fundId: string, updates: Partial<Fund>) {
  const { data, error } = await supabaseClient
    .from('funds')
    .update(updates)
    .eq('id', fundId)
    .select()
    .single();

  if (error) throw error;
  return data as Fund;
}

/**
 * Update fund NAV
 */
export async function updateFundNav(fundId: string, newNav: number) {
  const { data, error } = await supabaseClient
    .from('funds')
    .update({ current_nav: newNav })
    .eq('id', fundId)
    .select()
    .single();

  if (error) throw error;
  return data as Fund;
}

/**
 * Delete fund (soft delete by setting status to 'inactive')
 */
export async function deleteFund(fundId: string) {
  const { data, error } = await supabaseClient
    .from('funds')
    .update({ status: 'inactive' })
    .eq('id', fundId)
    .select()
    .single();

  if (error) throw error;
  return data as Fund;
}

/**
 * Get fund performance metrics
 */
export async function getFundPerformance(fundId?: string) {
  let query = supabaseClient
    .from('fund_performance_view')
    .select('*');

  if (fundId) {
    query = query.eq('fund_id', fundId).single();
  }

  const { data, error } = await query;

  if (error) throw error;
  return fundId ? (data as FundPerformance) : (data as FundPerformance[]);
}

/**
 * Get fund analytics for a specific period
 */
export async function getFundAnalytics(fundId: string, periodDays: number = 30) {
  const { data, error } = await supabaseClient
    .rpc('get_fund_analytics', {
      p_fund_id: fundId,
      p_period_days: periodDays
    });

  if (error) throw error;
  return data as FundAnalytics[];
}

/**
 * Get total AUM across all active funds
 */
export async function getTotalAUM() {
  const { data, error } = await supabaseClient
    .from('funds')
    .select('total_aum')
    .eq('status', 'active');

  if (error) throw error;

  const totalAUM = data.reduce((sum, fund) => sum + (fund.total_aum || 0), 0);
  return totalAUM;
}

/**
 * Get fund statistics
 */
export async function getFundStatistics() {
  const { data: funds, error } = await supabaseClient
    .from('funds')
    .select('*')
    .eq('status', 'active');

  if (error) throw error;

  const totalFunds = funds.length;
  const totalAUM = funds.reduce((sum, fund) => sum + (fund.total_aum || 0), 0);
  const avgNav = funds.reduce((sum, fund) => sum + (fund.current_nav || 0), 0) / totalFunds;

  return {
    total_funds: totalFunds,
    total_aum: totalAUM,
    average_nav: avgNav,
    funds
  };
}
