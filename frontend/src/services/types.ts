// Database types for Naveo platform

export interface Fund {
  id: string;
  name: string;
  description: string | null;
  manager_id: string | null;
  current_nav: number | null;
  total_aum: number | null;
  total_shares: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  fund_id: string;
  symbol: string;
  name: string;
  type: string | null;
  quantity: number | null;
  purchase_price: number | null;
  current_price: number | null;
  purchase_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  fund_id: string | null;
  type: string | null;
  shares: number | null;
  nav_at_time: number | null;
  amount: number | null;
  status: string;
  created_at: string;
}

export interface UserPortfolio {
  id: string;
  user_id: string | null;
  fund_id: string | null;
  shares: number | null;
  avg_purchase_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Trader {
  id: string;
  fund_id: string | null;
  user_id: string | null;
  role: string | null;
  total_trades: number | null;
  total_volume: number | null;
  total_pnl: number | null;
  win_rate: number | null;
  status: string;
  created_at: string;
}

export interface KYCVerification {
  id: string;
  user_id: string;
  tier: number;
  status: 'pending' | 'approved' | 'rejected' | 'needs_review' | 'expired';
  verification_type: 'individual' | 'entity';
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  documents: any;
  persona_inquiry_id: string | null;
  risk_score: number | null;
  pep_check: boolean | null;
  sanctions_check: boolean | null;
  adverse_media_check: boolean | null;
  verification_level: string | null;
  expiry_date: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'transaction' | 'kyc' | 'compliance' | 'nav' | 'report' | 'system' | 'trade' | 'performance';
  category: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  action_required: boolean | null;
  action_url: string | null;
  metadata: any;
  expires_at: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  fund_id: string | null;
  report_type: 'monthly' | 'quarterly' | 'annual' | 'custom' | 'tax' | 'performance' | 'compliance';
  report_name: string;
  period_start: string;
  period_end: string;
  generated_by: string | null;
  generated_at: string;
  file_url: string | null;
  file_size: number | null;
  file_format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'ready' | 'sent' | 'failed' | 'archived';
  sent_to: string[] | null;
  sent_at: string | null;
  download_count: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface NavHistory {
  id: string;
  fund_id: string;
  nav: number;
  total_shares: number;
  total_aum: number;
  calculation_date: string;
  calculation_method: string | null;
  calculated_by: string | null;
  verified: boolean | null;
  verified_by: string | null;
  verified_at: string | null;
  assets_snapshot: any;
  notes: string | null;
  metadata: any;
  created_at: string;
}

export interface SystemEvent {
  id: string;
  event_type: string;
  event_category: string | null;
  user_id: string | null;
  fund_id: string | null;
  resource_type: string | null;
  resource_id: string | null;
  action: string | null;
  status: 'success' | 'failure' | 'pending';
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  description: string | null;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// View types
export interface PortfolioHolding {
  portfolio_id: string;
  user_id: string | null;
  fund_id: string | null;
  fund_name: string | null;
  fund_manager_id: string | null;
  shares: number | null;
  avg_purchase_price: number | null;
  current_nav: number | null;
  current_value: number | null;
  invested_amount: number | null;
  unrealized_pnl: number | null;
  return_percentage: number | null;
  fund_total_aum: number | null;
  fund_total_shares: number | null;
  ownership_percentage: number | null;
  fund_status: string | null;
  investment_date: string | null;
  last_updated: string | null;
}

export interface FundPerformance {
  fund_id: string;
  fund_name: string | null;
  manager_id: string | null;
  current_nav: number | null;
  total_aum: number | null;
  total_shares: number | null;
  status: string | null;
  total_investors: number | null;
  total_invested_shares: number | null;
  transactions_30d: number | null;
  inflow_30d: number | null;
  outflow_30d: number | null;
  latest_nav: number | null;
  nav_30d_ago: number | null;
  nav_90d_ago: number | null;
  nav_1y_ago: number | null;
  total_assets: number | null;
  total_asset_value: number | null;
  active_traders: number | null;
  total_trades: number | null;
  total_trade_volume: number | null;
  avg_trader_win_rate: number | null;
  fund_created_at: string | null;
  last_updated: string | null;
}

// Function return types
export interface PortfolioValue {
  total_current_value: number;
  total_invested_amount: number;
  total_unrealized_pnl: number;
  total_return_percentage: number;
  fund_count: number;
  last_updated: string;
}

export interface FundAnalytics {
  fund_id: string;
  fund_name: string;
  current_nav: number;
  total_aum: number;
  total_shares: number;
  total_investors: number;
  nav_change_percentage: number;
  aum_change_percentage: number;
  total_transactions: number;
  total_inflows: number;
  total_outflows: number;
  net_flow: number;
  new_investors: number;
  active_investors: number;
  total_assets: number;
  total_asset_value: number;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  street_address: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country: string | null;
  investor_type: 'individual' | 'corporate' | 'institutional' | 'trust' | 'other' | null;
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | 'very_aggressive' | null;
  investment_experience: 'none' | 'limited' | 'intermediate' | 'advanced' | 'expert' | null;
  accredited_investor: boolean | null;
  annual_income_range: string | null;
  net_worth_range: string | null;
  job_title: string | null;
  department: string | null;
  company_name: string | null;
  professional_bio: string | null;
  linkedin_url: string | null;
  language: string | null;
  timezone: string | null;
  currency: string | null;
  notification_preferences: any;
  tax_id: string | null;
  passport_number: string | null;
  id_document_type: string | null;
  id_document_number: string | null;
  id_document_expiry: string | null;
  citizenship: string | null;
  tax_residency: string | null;
  onboarding_completed: boolean | null;
  profile_completed_at: string | null;
  last_login_at: string | null;
  login_count: number | null;
  terms_accepted_at: string | null;
  privacy_policy_accepted_at: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface KYCStatistics {
  total_verifications: number;
  pending_count: number;
  approved_count: number;
  rejected_count: number;
  needs_review_count: number;
  expired_count: number;
  tier1_count: number;
  tier2_count: number;
  tier3_count: number;
  avg_processing_time_hours: number;
  high_risk_count: number;
}

// Input types for creating/updating records
export interface CreateTransactionInput {
  user_id: string;
  fund_id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  shares: number;
  nav_at_time: number;
  amount: number;
}

export interface CreateKYCInput {
  user_id: string;
  tier: 1 | 2 | 3;
  verification_type: 'individual' | 'entity';
  documents?: any;
  metadata?: any;
}

export interface UpdateKYCInput {
  status?: 'pending' | 'approved' | 'rejected' | 'needs_review' | 'expired';
  reviewed_by?: string;
  rejection_reason?: string;
  risk_score?: number;
  pep_check?: boolean;
  sanctions_check?: boolean;
  adverse_media_check?: boolean;
  verification_level?: string;
  expiry_date?: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: 'transaction' | 'kyc' | 'compliance' | 'nav' | 'report' | 'system' | 'trade' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  category?: string;
  link?: string;
  action_required?: boolean;
  action_url?: string;
  metadata?: any;
  expires_at?: string;
}

export interface CreateReportInput {
  fund_id: string;
  report_type: 'monthly' | 'quarterly' | 'annual' | 'custom' | 'tax' | 'performance' | 'compliance';
  report_name: string;
  period_start: string;
  period_end: string;
  generated_by: string;
  file_format?: 'pdf' | 'excel' | 'csv';
  metadata?: any;
}

// Capital Partners & Distribution Network
export interface StrategicPartner {
  id: string;
  name: string;
  type: 'lender' | 'liquidity' | 'leverage';
  region: string;
  ticket_size: string | null;
  ltv_range: string | null;
  focus_assets: string[] | null;
  status: 'Active' | 'Negotiation' | 'Prospect';
  notes: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  website_url: string | null;
  api_endpoint: string | null;
  api_key_encrypted: string | null;
  webhook_url: string | null;
  integration_status: 'Live' | 'Testing' | 'Pending' | 'Inactive' | null;
  last_sync_at: string | null;
  hubspot_deal_id: string | null;
  notion_page_id: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface DistributionPlatform {
  id: string;
  platform: string;
  region: string;
  coverage: string;
  integration_status: 'Live' | 'Sandbox' | 'Planned';
  channels: string[] | null;
  api_type: 'REST' | 'GraphQL' | 'WebSocket' | 'FTP' | 'Manual' | null;
  api_endpoint: string | null;
  api_key_encrypted: string | null;
  webhook_url: string | null;
  supported_formats: string[] | null;
  technical_contact_name: string | null;
  technical_contact_email: string | null;
  business_contact_name: string | null;
  business_contact_email: string | null;
  total_assets_under_distribution: number | null;
  total_investors: number | null;
  last_sync_at: string | null;
  sync_frequency: string | null;
  documentation_url: string | null;
  onboarding_requirements: string[] | null;
  compliance_notes: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}
