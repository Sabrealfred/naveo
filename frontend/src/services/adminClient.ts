import { supabaseClient } from './supabaseClient';

export interface AssetRecord {
  id: string;
  fund_id: string | null;
  symbol: string;
  name: string;
  type: string | null;
  quantity: number | null;
  purchase_price: number | null;
  current_price: number | null;
  purchase_date: string | null;
}

export interface TraderRecord {
  id: string;
  fund_id: string | null;
  user_id: string | null;
  role: string | null;
  total_trades: number | null;
  total_volume: number | null;
  total_pnl: number | null;
  win_rate: number | null;
  status: string | null;
  created_at: string;
}

export interface PortfolioRecord {
  id: string;
  fund_id: string;
  user_id: string;
  shares: number | null;
  avg_purchase_price: number | null;
  created_at: string;
}

export const fetchAssets = async (fundId?: string) => {
  let query = supabaseClient.from('assets').select('*').order('updated_at', { ascending: false });
  if (fundId) {
    query = query.eq('fund_id', fundId);
  }
  return query;
};

export const fetchTraders = async (fundId?: string) => {
  let query = supabaseClient.from('traders').select('*').order('created_at', { ascending: false });
  if (fundId) {
    query = query.eq('fund_id', fundId);
  }
  return query;
};

export const fetchUserPortfolios = async (userId?: string) => {
  let query = supabaseClient.from('user_portfolios').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }
  return query;
};
