import { supabaseClient } from './supabaseClient';
import type { Trader } from './types';

/**
 * Traders Service
 * Handles trader management including performance tracking and fund associations
 */

/**
 * Get all traders
 */
export async function getAllTraders() {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Trader[];
}

/**
 * Get active traders only
 */
export async function getActiveTraders() {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Trader[];
}

/**
 * Get trader by ID
 */
export async function getTraderById(traderId: string) {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('*')
    .eq('id', traderId)
    .single();

  if (error) throw error;
  return data as Trader;
}

/**
 * Get traders by fund
 */
export async function getTradersByFund(fundId: string) {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('*')
    .eq('fund_id', fundId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Trader[];
}

/**
 * Get traders by user
 */
export async function getTradersByUser(userId: string) {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Trader[];
}

/**
 * Get traders by role
 */
export async function getTradersByRole(role: string) {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Trader[];
}

/**
 * Create a new trader
 */
export async function createTrader(trader: Partial<Trader>) {
  const { data, error } = await supabaseClient
    .from('traders')
    .insert({
      ...trader,
      total_trades: 0,
      total_volume: 0,
      total_pnl: 0,
      win_rate: 0,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Trader;
}

/**
 * Update trader
 */
export async function updateTrader(traderId: string, updates: Partial<Trader>) {
  const { data, error } = await supabaseClient
    .from('traders')
    .update(updates)
    .eq('id', traderId)
    .select()
    .single();

  if (error) throw error;
  return data as Trader;
}

/**
 * Update trader performance metrics
 */
export async function updateTraderPerformance(
  traderId: string,
  metrics: {
    total_trades?: number;
    total_volume?: number;
    total_pnl?: number;
    win_rate?: number;
  }
) {
  return updateTrader(traderId, metrics);
}

/**
 * Deactivate trader
 */
export async function deactivateTrader(traderId: string) {
  const { data, error } = await supabaseClient
    .from('traders')
    .update({ status: 'inactive' })
    .eq('id', traderId)
    .select()
    .single();

  if (error) throw error;
  return data as Trader;
}

/**
 * Delete trader
 */
export async function deleteTrader(traderId: string) {
  const { error } = await supabaseClient
    .from('traders')
    .delete()
    .eq('id', traderId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get trader statistics for a fund
 */
export async function getFundTraderStats(fundId: string) {
  const { data, error } = await supabaseClient
    .from('traders')
    .select('role, total_trades, total_volume, total_pnl, win_rate, status')
    .eq('fund_id', fundId);

  if (error) throw error;

  const stats = {
    total_traders: data.length,
    active_traders: data.filter(t => t.status === 'active').length,
    lead_traders: data.filter(t => t.role === 'lead').length,
    senior_traders: data.filter(t => t.role === 'senior').length,
    junior_traders: data.filter(t => t.role === 'junior').length,
    total_trades: data.reduce((sum, t) => sum + (t.total_trades || 0), 0),
    total_volume: data.reduce((sum, t) => sum + (t.total_volume || 0), 0),
    total_pnl: data.reduce((sum, t) => sum + (t.total_pnl || 0), 0),
    avg_win_rate: data.length > 0
      ? data.reduce((sum, t) => sum + (t.win_rate || 0), 0) / data.length
      : 0
  };

  return stats;
}

/**
 * Get top performing traders
 */
export async function getTopPerformingTraders(limit: number = 10, fundId?: string) {
  let query = supabaseClient
    .from('traders')
    .select('*')
    .eq('status', 'active')
    .order('total_pnl', { ascending: false })
    .limit(limit);

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Trader[];
}

/**
 * Get trader leaderboard by win rate
 */
export async function getTraderLeaderboardByWinRate(limit: number = 10, fundId?: string) {
  let query = supabaseClient
    .from('traders')
    .select('*')
    .eq('status', 'active')
    .not('win_rate', 'is', null)
    .order('win_rate', { ascending: false })
    .limit(limit);

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Trader[];
}

/**
 * Get trader performance over time
 */
export async function getTraderPerformance(traderId: string) {
  const trader = await getTraderById(traderId);

  // Calculate additional metrics
  const avgTradeSize = trader.total_trades && trader.total_trades > 0
    ? (trader.total_volume || 0) / trader.total_trades
    : 0;

  const profitPerTrade = trader.total_trades && trader.total_trades > 0
    ? (trader.total_pnl || 0) / trader.total_trades
    : 0;

  return {
    ...trader,
    avg_trade_size: avgTradeSize,
    profit_per_trade: profitPerTrade,
    loss_rate: trader.win_rate ? 100 - trader.win_rate : 0
  };
}
