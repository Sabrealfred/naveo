export interface CapitalPartner {
  name: string;
  type: 'lender' | 'liquidity' | 'leverage';
  region: string;
  ticketSize: string;
  ltvRange?: string;
  focusAssets: string[];
  status: 'Active' | 'Negotiation' | 'Prospect';
  notes: string;
}

export interface DistributionPartner {
  platform: string;
  region: string;
  coverage: string;
  integrationStatus: 'Live' | 'Sandbox' | 'Planned';
  channels: string[];
}

export const capitalPartners: CapitalPartner[] = [
  {
    name: 'Anchorage Lending Desk',
    type: 'lender',
    region: 'USA',
    ticketSize: '$10M - $75M',
    ltvRange: '50% - 70%',
    focusAssets: ['Tokenized credit', 'Stablecoin mandates'],
    status: 'Active',
    notes: 'Provides segregated accounts, programmable LTV rules.',
  },
  {
    name: 'Atlas Liquidity Network',
    type: 'liquidity',
    region: 'Europe & APAC',
    ticketSize: '$5M - $40M',
    focusAssets: ['RWA tokens', 'Yield vaults'],
    status: 'Negotiation',
    notes: 'Requires daily NAV feed + proof-of-liquidity.',
  },
  {
    name: 'Helios Prime Brokerage',
    type: 'leverage',
    region: 'LatAm / USA',
    ticketSize: '$15M - $100M',
    ltvRange: '40% - 65%',
    focusAssets: ['Lidya HFT', 'Quant portfolios'],
    status: 'Prospect',
    notes: 'Interest in cross-margining vs on-chain collateral.',
  },
  {
    name: 'Summit Stable Credit',
    type: 'lender',
    region: 'Middle East',
    ticketSize: '$20M - $60M',
    ltvRange: '55% - 75%',
    focusAssets: ['Securitized receivables', 'Energy infrastructure'],
    status: 'Active',
    notes: 'Requests monthly audit package + ESG data.',
  },
  {
    name: 'Omega Market Makers',
    type: 'liquidity',
    region: 'Global',
    ticketSize: '$2M - $15M',
    focusAssets: ['Secondary OTC', 'Structured notes'],
    status: 'Active',
    notes: 'Needs API for inventory + settlement instructions.',
  },
];

export const distributionPartners: DistributionPartner[] = [
  {
    platform: 'NavFund Services',
    region: 'Global',
    coverage: 'Fund administration, transfer agency, investor services',
    integrationStatus: 'Live',
    channels: ['RIA', 'Private banks'],
  },
  {
    platform: 'Apex Digital Marketplace',
    region: 'EMEA / APAC',
    coverage: 'Secondary trading, SMA onboarding, custodial settlement',
    integrationStatus: 'Sandbox',
    channels: ['Family Offices', 'Institutional desks'],
  },
  {
    platform: 'Carta Liquidity',
    region: 'USA',
    coverage: 'Cap table sync, investor comms, subscription flows',
    integrationStatus: 'Planned',
    channels: ['VC/PE funds', 'Accredited investors'],
  },
  {
    platform: 'Copper Connect',
    region: 'EMEA',
    coverage: 'MPC custody, OTC settlement, ref data',
    integrationStatus: 'Live',
    channels: ['Prime brokers', 'Market makers'],
  },
  {
    platform: 'Securitize Markets',
    region: 'Americas',
    coverage: 'Primary launchpad + investor registry',
    integrationStatus: 'Live',
    channels: ['BD networks', 'Broker-dealers'],
  },
];
