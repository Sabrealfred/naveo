import { supabaseClient } from './supabaseClient';
import type { Transaction, CreateTransactionInput } from './types';

/**
 * Transactions Service
 * Handles all transaction-related operations including buy, sell, deposits, and withdrawals
 */

/**
 * Get all transactions
 */
export async function getAllTransactions() {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(transactionId: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (error) throw error;
  return data as Transaction;
}

/**
 * Get transactions by user
 */
export async function getTransactionsByUser(userId: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get transactions by fund
 */
export async function getTransactionsByFund(fundId: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('fund_id', fundId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get transactions by user and fund
 */
export async function getTransactionsByUserAndFund(userId: string, fundId: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('fund_id', fundId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get transactions by status
 */
export async function getTransactionsByStatus(status: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get transactions by type
 */
export async function getTransactionsByType(type: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get pending transactions for a user
 */
export async function getPendingTransactionsByUser(userId: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Get recent transactions (last N days)
 */
export async function getRecentTransactions(days: number = 30, userId?: string) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  let query = supabaseClient
    .from('transactions')
    .select('*')
    .gte('created_at', fromDate.toISOString())
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Transaction[];
}

/**
 * Create a new transaction
 */
export async function createTransaction(transaction: CreateTransactionInput) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .insert({
      ...transaction,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

/**
 * Update transaction
 */
export async function updateTransaction(transactionId: string, updates: Partial<Transaction>) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .update(updates)
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'settled'
) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .update({ status })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

/**
 * Cancel transaction
 */
export async function cancelTransaction(transactionId: string) {
  return updateTransactionStatus(transactionId, 'cancelled');
}

/**
 * Complete transaction
 */
export async function completeTransaction(transactionId: string) {
  return updateTransactionStatus(transactionId, 'completed');
}

/**
 * Delete transaction
 */
export async function deleteTransaction(transactionId: string) {
  const { error } = await supabaseClient
    .from('transactions')
    .delete()
    .eq('id', transactionId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get transaction statistics for a user
 */
export async function getUserTransactionStats(userId: string) {
  const { data, error } = await supabaseClient
    .from('transactions')
    .select('type, status, amount, shares')
    .eq('user_id', userId);

  if (error) throw error;

  const stats = {
    total_transactions: data.length,
    total_buys: data.filter(t => t.type === 'buy').length,
    total_sells: data.filter(t => t.type === 'sell').length,
    total_deposits: data.filter(t => t.type === 'deposit').length,
    total_withdrawals: data.filter(t => t.type === 'withdraw').length,
    total_amount_invested: data
      .filter(t => (t.type === 'buy' || t.type === 'deposit') && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    total_amount_withdrawn: data
      .filter(t => (t.type === 'sell' || t.type === 'withdraw') && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    pending_count: data.filter(t => t.status === 'pending').length,
    completed_count: data.filter(t => t.status === 'completed').length,
    failed_count: data.filter(t => t.status === 'failed').length
  };

  return stats;
}

/**
 * Get transaction volume by period
 */
export async function getTransactionVolume(fundId?: string, days: number = 30) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  let query = supabaseClient
    .from('transactions')
    .select('type, amount, created_at')
    .gte('created_at', fromDate.toISOString())
    .in('status', ['completed', 'settled']);

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const volume = {
    total_inflows: data
      .filter(t => t.type === 'buy' || t.type === 'deposit')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    total_outflows: data
      .filter(t => t.type === 'sell' || t.type === 'withdraw')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    net_flow: 0,
    transaction_count: data.length
  };

  volume.net_flow = volume.total_inflows - volume.total_outflows;

  return volume;
}
