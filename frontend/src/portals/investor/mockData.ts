import dayjs from 'dayjs';
import type { PortfolioHolding, PortfolioValue, Transaction, NavHistory } from '../../services/types';

export const MOCK_INVESTOR_FUNDS = [
  { id: 'fund-001', name: 'Digital Credit Opportunities' },
  { id: 'fund-002', name: 'Blockchain Infrastructure Fund' },
  { id: 'fund-003', name: 'Global Real Estate Token Fund' },
];

export const MOCK_PORTFOLIO_VALUE: PortfolioValue = {
  total_current_value: 1_250_000,
  total_invested_amount: 1_000_000,
  total_unrealized_pnl: 250_000,
  total_return_percentage: 25,
  fund_count: MOCK_INVESTOR_FUNDS.length,
  last_updated: new Date().toISOString(),
};

const buildHolding = ({
  id,
  fundId,
  fundName,
  shares,
  avgPrice,
  currentNav,
  invested,
  currentValue,
  pnl,
}: {
  id: string;
  fundId: string;
  fundName: string;
  shares: number;
  avgPrice: number;
  currentNav: number;
  invested: number;
  currentValue: number;
  pnl: number;
}): PortfolioHolding => ({
  portfolio_id: id,
  user_id: 'mock-user',
  fund_id: fundId,
  fund_name: fundName,
  fund_manager_id: 'manager-mock',
  shares,
  avg_purchase_price: avgPrice,
  current_nav: currentNav,
  current_value: currentValue,
  invested_amount: invested,
  unrealized_pnl: pnl,
  return_percentage: (pnl / invested) * 100,
  fund_total_aum: 100_000_000,
  fund_total_shares: 100_000,
  ownership_percentage: (shares / 100_000) * 100,
  fund_status: 'active',
  investment_date: '2024-01-01',
  last_updated: new Date().toISOString(),
});

export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  buildHolding({
    id: 'mock-holding-1',
    fundId: 'fund-001',
    fundName: 'Digital Credit Opportunities',
    shares: 125.4321,
    avgPrice: 950,
    currentNav: 1_250.75,
    invested: 119_160,
    currentValue: 156_790,
    pnl: 37_630,
  }),
  buildHolding({
    id: 'mock-holding-2',
    fundId: 'fund-002',
    fundName: 'Blockchain Infrastructure Fund',
    shares: 42.75,
    avgPrice: 2_750,
    currentNav: 3_250.5,
    invested: 117_562,
    currentValue: 139_855,
    pnl: 22_293,
  }),
  buildHolding({
    id: 'mock-holding-3',
    fundId: 'fund-003',
    fundName: 'Global Real Estate Token Fund',
    shares: 310.12,
    avgPrice: 320,
    currentNav: 405.4,
    invested: 99_238,
    currentValue: 125_681,
    pnl: 26_443,
  }),
];

export const MOCK_INVESTOR_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-mock-001',
    user_id: 'mock-user',
    fund_id: 'fund-001',
    type: 'buy',
    shares: 25.5,
    nav_at_time: 1_210.5,
    amount: 30_880,
    status: 'completed',
    created_at: '2025-02-13T14:20:00Z',
  },
  {
    id: 'tx-mock-002',
    user_id: 'mock-user',
    fund_id: 'fund-003',
    type: 'deposit',
    shares: null,
    nav_at_time: null,
    amount: 75_000,
    status: 'completed',
    created_at: '2025-02-10T09:05:00Z',
  },
  {
    id: 'tx-mock-003',
    user_id: 'mock-user',
    fund_id: 'fund-002',
    type: 'buy',
    shares: 10,
    nav_at_time: 3_200,
    amount: 32_000,
    status: 'pending',
    created_at: '2025-02-18T18:40:00Z',
  },
  {
    id: 'tx-mock-004',
    user_id: 'mock-user',
    fund_id: 'fund-001',
    type: 'sell',
    shares: 8.5,
    nav_at_time: 1_280,
    amount: 10_880,
    status: 'completed',
    created_at: '2025-02-05T11:15:00Z',
  },
  {
    id: 'tx-mock-005',
    user_id: 'mock-user',
    fund_id: 'fund-003',
    type: 'withdrawal',
    shares: null,
    nav_at_time: null,
    amount: 45_000,
    status: 'pending',
    created_at: '2025-02-20T15:00:00Z',
  },
];

export const buildAllocationFromHoldings = (holdings: PortfolioHolding[]) => {
  const total = holdings.reduce((sum, holding) => sum + (holding.current_value || 0), 0) || 1;
  return holdings.map((holding) => ({
    fund_name: holding.fund_name || 'Unknown Fund',
    allocation_percentage: ((holding.current_value || 0) / total) * 100,
    current_value: holding.current_value || 0,
  }));
};

export const generateMockNavHistory = (
  fundId: string,
  baseNav = 1_000,
  volatility = 0.015
): NavHistory[] => {
  const history: NavHistory[] = [];
  for (let i = 24; i >= 0; i--) {
    const date = dayjs().subtract(i, 'month').format('YYYY-MM-DD');
    const growthFactor = Math.pow(1 + volatility, 24 - i);
    const seasonalAdjustment = 1 + Math.sin(i / 3) * 0.03;
    const nav = Number((baseNav * growthFactor * seasonalAdjustment).toFixed(2));

    history.push({
      id: `${fundId}-${date}`,
      fund_id: fundId,
      nav,
      total_shares: 100_000,
      total_aum: nav * 100_000,
      calculation_date: date,
      calculation_method: 'mock',
      calculated_by: null,
      verified: null,
      verified_by: null,
      verified_at: null,
      assets_snapshot: null,
      notes: null,
      metadata: null,
      created_at: date,
    });
  }
  return history;
};

export const MOCK_PORTFOLIO_HISTORY = [
  { label: '2024-03', value: 920_000 },
  { label: '2024-04', value: 945_000 },
  { label: '2024-05', value: 968_000 },
  { label: '2024-06', value: 989_000 },
  { label: '2024-07', value: 1_005_000 },
  { label: '2024-08', value: 1_040_000 },
  { label: '2024-09', value: 1_065_000 },
  { label: '2024-10', value: 1_090_000 },
  { label: '2024-11', value: 1_115_000 },
  { label: '2024-12', value: 1_145_000 },
  { label: '2025-01', value: 1_190_000 },
  { label: '2025-02', value: 1_250_000 },
];

export const MOCK_PERFORMANCE_SERIES = [
  { date: '2024-01', portfolioReturn: 2.5, benchmarkReturn: 1.8, value: 1_015_000 },
  { date: '2024-02', portfolioReturn: 5.2, benchmarkReturn: 3.1, value: 1_032_500 },
  { date: '2024-03', portfolioReturn: 7.8, benchmarkReturn: 4.5, value: 1_047_800 },
  { date: '2024-04', portfolioReturn: 11.3, benchmarkReturn: 6.2, value: 1_063_000 },
  { date: '2024-05', portfolioReturn: 14.5, benchmarkReturn: 8.0, value: 1_085_000 },
  { date: '2024-06', portfolioReturn: 17.2, benchmarkReturn: 9.5, value: 1_104_500 },
  { date: '2024-07', portfolioReturn: 19.8, benchmarkReturn: 11.2, value: 1_130_000 },
  { date: '2024-08', portfolioReturn: 22.5, benchmarkReturn: 12.8, value: 1_158_500 },
  { date: '2024-09', portfolioReturn: 24.3, benchmarkReturn: 13.9, value: 1_176_500 },
  { date: '2024-10', portfolioReturn: 25.0, benchmarkReturn: 14.2, value: 1_200_000 },
  { date: '2024-11', portfolioReturn: 25.6, benchmarkReturn: 14.6, value: 1_218_000 },
  { date: '2024-12', portfolioReturn: 26.1, benchmarkReturn: 15.0, value: 1_235_000 },
];

export const MOCK_ASSET_PERFORMANCE = [
  {
    asset: 'Digital Credit Opportunities',
    allocation: 42,
    return: 28.5,
    ytdReturn: 28.5,
    contribution: 12.8,
    risk: 'Medium',
  },
  {
    asset: 'Blockchain Infrastructure Fund',
    allocation: 33,
    return: 22.3,
    ytdReturn: 22.3,
    contribution: 7.5,
    risk: 'High',
  },
  {
    asset: 'Global Real Estate Token Fund',
    allocation: 18,
    return: 15.2,
    ytdReturn: 15.2,
    contribution: 3.2,
    risk: 'Low',
  },
  {
    asset: 'Stable Yield Treasury',
    allocation: 7,
    return: 6.5,
    ytdReturn: 6.5,
    contribution: 0.5,
    risk: 'Very Low',
  },
];

export const MOCK_MONTHLY_RETURNS = [
  { month: 'Jan', return: 2.5 },
  { month: 'Feb', return: 2.7 },
  { month: 'Mar', return: 2.6 },
  { month: 'Apr', return: 3.5 },
  { month: 'May', return: 3.2 },
  { month: 'Jun', return: 2.7 },
  { month: 'Jul', return: 2.6 },
  { month: 'Aug', return: 2.7 },
  { month: 'Sep', return: 1.3 },
  { month: 'Oct', return: 1.2 },
  { month: 'Nov', return: 1.0 },
  { month: 'Dec', return: 0.9 },
];
