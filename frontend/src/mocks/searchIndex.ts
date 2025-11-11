export type SearchCategory =
  | 'asset'
  | 'portfolio'
  | 'client'
  | 'partner'
  | 'report'
  | 'distribution';

export interface SearchItem {
  id: string;
  label: string;
  description: string;
  route: string;
  category: SearchCategory;
  tags?: string[];
}

export const SEARCH_INDEX: SearchItem[] = [
  {
    id: 'asset-andes',
    label: 'Andes Renewable Fund',
    description: 'Real-estate infrastructure | Pipeline deal',
    route: '/admin-owner/asset-pipeline',
    category: 'asset',
    tags: ['solar', 'latam', 'due-diligence'],
  },
  {
    id: 'asset-meridian',
    label: 'Meridian Stable Yield',
    description: 'Stablecoin lending program',
    route: '/admin-client/assets',
    category: 'asset',
    tags: ['stablecoin', 'yield'],
  },
  {
    id: 'portfolio-alpha',
    label: 'Alpha Growth Investor Portfolio',
    description: 'Investor holdings & NAV',
    route: '/investor/portfolio',
    category: 'portfolio',
    tags: ['investor', 'nav'],
  },
  {
    id: 'partner-anchorage',
    label: 'Anchorage Lending Desk',
    description: 'Capital partner · LTV up to 70%',
    route: '/admin-owner/capital-partners',
    category: 'partner',
    tags: ['lender', 'ltv', 'loan'],
  },
  {
    id: 'partner-navfund',
    label: 'NavFund Distribution',
    description: 'Fund admin & investor servicing integration',
    route: '/admin-owner/distribution-network',
    category: 'distribution',
    tags: ['distribution', 'nav services'],
  },
  {
    id: 'report-nav',
    label: 'Daily NAV Report',
    description: 'NAV breakdown by token + PnL',
    route: '/admin-client/nav',
    category: 'report',
    tags: ['nav', 'report'],
  },
  {
    id: 'report-risk',
    label: 'Risk & Compliance Dashboard',
    description: 'VaR, AML status, alerts',
    route: '/admin-owner/compliance',
    category: 'report',
    tags: ['risk', 'compliance'],
  },
  {
    id: 'client-lenders',
    label: 'Liquidity Providers Directory',
    description: 'Summit Stable Credit, Atlas Liquidity, Omega MM',
    route: '/admin-owner/capital-partners',
    category: 'partner',
    tags: ['liquidity', 'providers'],
  },
  {
    id: 'report-tax',
    label: 'Tax Center',
    description: 'FATCA/CRS and cost basis reports',
    route: '/admin-client/compliance',
    category: 'report',
    tags: ['tax', 'compliance'],
  },
];
