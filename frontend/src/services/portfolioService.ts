import { supabaseClient } from './supabaseClient';
import type { UserPortfolio, PortfolioHolding, PortfolioValue } from './types';

/**
 * Portfolio Service
 * Handles user portfolio operations including holdings, calculations, and analytics
 */

/**
 * Get all portfolios
 */
export async function getAllPortfolios() {
  const { data, error } = await supabaseClient
    .from('user_portfolios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserPortfolio[];
}

/**
 * Get portfolio by ID
 */
export async function getPortfolioById(portfolioId: string) {
  const { data, error } = await supabaseClient
    .from('user_portfolios')
    .select('*')
    .eq('id', portfolioId)
    .single();

  if (error) throw error;
  return data as UserPortfolio;
}

/**
 * Get portfolios by user
 */
export async function getPortfoliosByUser(userId: string) {
  const { data, error } = await supabaseClient
    .from('user_portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as UserPortfolio[];
}

/**
 * Get portfolio by user and fund
 */
export async function getPortfolioByUserAndFund(userId: string, fundId: string) {
  const { data, error } = await supabaseClient
    .from('user_portfolios')
    .select('*')
    .eq('user_id', userId)
    .eq('fund_id', fundId)
    .single();

  if (error) throw error;
  return data as UserPortfolio;
}

/**
 * Get portfolio holdings with detailed information (using view)
 */
export async function getPortfolioHoldings(userId: string) {
  const { data, error } = await supabaseClient
    .from('portfolio_holdings_view')
    .select('*')
    .eq('user_id', userId)
    .order('investment_date', { ascending: false });

  if (error) throw error;
  return data as PortfolioHolding[];
}

/**
 * Get portfolio holdings for a specific fund
 */
export async function getPortfolioHoldingsByFund(userId: string, fundId: string) {
  const { data, error } = await supabaseClient
    .from('portfolio_holdings_view')
    .select('*')
    .eq('user_id', userId)
    .eq('fund_id', fundId)
    .single();

  if (error) throw error;
  return data as PortfolioHolding;
}

/**
 * Calculate portfolio value for a user (using function)
 */
export async function calculatePortfolioValue(userId: string) {
  const { data, error } = await supabaseClient
    .rpc('calculate_portfolio_value', {
      p_user_id: userId
    });

  if (error) throw error;
  return data[0] as PortfolioValue;
}

/**
 * Create portfolio entry
 */
export async function createPortfolio(portfolio: Partial<UserPortfolio>) {
  const { data, error } = await supabaseClient
    .from('user_portfolios')
    .insert(portfolio)
    .select()
    .single();

  if (error) throw error;
  return data as UserPortfolio;
}

/**
 * Update portfolio
 */
export async function updatePortfolio(portfolioId: string, updates: Partial<UserPortfolio>) {
  const { data, error } = await supabaseClient
    .from('user_portfolios')
    .update(updates)
    .eq('id', portfolioId)
    .select()
    .single();

  if (error) throw error;
  return data as UserPortfolio;
}

/**
 * Delete portfolio
 */
export async function deletePortfolio(portfolioId: string) {
  const { error } = await supabaseClient
    .from('user_portfolios')
    .delete()
    .eq('id', portfolioId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get portfolio performance summary
 */
export async function getPortfolioPerformanceSummary(userId: string) {
  const holdings = await getPortfolioHoldings(userId);

  const summary = {
    total_current_value: 0,
    total_invested_amount: 0,
    total_unrealized_pnl: 0,
    total_return_percentage: 0,
    total_funds: holdings.length,
    best_performing_fund: null as PortfolioHolding | null,
    worst_performing_fund: null as PortfolioHolding | null,
    holdings: holdings
  };

  holdings.forEach(holding => {
    summary.total_current_value += holding.current_value || 0;
    summary.total_invested_amount += holding.invested_amount || 0;
    summary.total_unrealized_pnl += holding.unrealized_pnl || 0;

    if (!summary.best_performing_fund ||
        (holding.return_percentage || 0) > (summary.best_performing_fund.return_percentage || 0)) {
      summary.best_performing_fund = holding;
    }

    if (!summary.worst_performing_fund ||
        (holding.return_percentage || 0) < (summary.worst_performing_fund.return_percentage || 0)) {
      summary.worst_performing_fund = holding;
    }
  });

  if (summary.total_invested_amount > 0) {
    summary.total_return_percentage =
      (summary.total_unrealized_pnl / summary.total_invested_amount) * 100;
  }

  return summary;
}

/**
 * Get portfolio allocation by fund
 */
export async function getPortfolioAllocation(userId: string) {
  const holdings = await getPortfolioHoldings(userId);

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.current_value || 0), 0);

  return holdings.map(holding => ({
    fund_id: holding.fund_id,
    fund_name: holding.fund_name,
    current_value: holding.current_value,
    allocation_percentage: totalValue > 0
      ? ((holding.current_value || 0) / totalValue) * 100
      : 0,
    return_percentage: holding.return_percentage
  }));
}

/**
 * Get portfolio diversification metrics
 */
export async function getPortfolioDiversification(userId: string) {
  const holdings = await getPortfolioHoldings(userId);

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.current_value || 0), 0);

  // Calculate concentration (Herfindahl Index)
  const concentrationIndex = holdings.reduce((sum, holding) => {
    const weight = totalValue > 0 ? (holding.current_value || 0) / totalValue : 0;
    return sum + (weight * weight);
  }, 0);

  // Diversification score (inverse of concentration, normalized to 0-100)
  const diversificationScore = holdings.length > 0
    ? (1 - concentrationIndex) * 100
    : 0;

  return {
    total_funds: holdings.length,
    concentration_index: concentrationIndex,
    diversification_score: diversificationScore,
    largest_position_percentage: holdings.length > 0
      ? Math.max(...holdings.map(h => ((h.current_value || 0) / totalValue) * 100))
      : 0,
    smallest_position_percentage: holdings.length > 0
      ? Math.min(...holdings.map(h => ((h.current_value || 0) / totalValue) * 100))
      : 0
  };
}

/**
 * Get top performing holdings
 */
export async function getTopPerformingHoldings(userId: string, limit: number = 5) {
  const holdings = await getPortfolioHoldings(userId);

  return holdings
    .sort((a, b) => (b.return_percentage || 0) - (a.return_percentage || 0))
    .slice(0, limit);
}

/**
 * Get worst performing holdings
 */
export async function getWorstPerformingHoldings(userId: string, limit: number = 5) {
  const holdings = await getPortfolioHoldings(userId);

  return holdings
    .sort((a, b) => (a.return_percentage || 0) - (b.return_percentage || 0))
    .slice(0, limit);
}
