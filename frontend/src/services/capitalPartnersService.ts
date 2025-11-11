import { supabaseClient } from './supabaseClient';
import type { StrategicPartner, DistributionPlatform } from './types';

// ============================================
// STRATEGIC PARTNERS (Capital Partners) CRUD
// ============================================

/**
 * Get all strategic partners with optional filtering
 */
export async function getAllStrategicPartners(filters?: {
  type?: 'lender' | 'liquidity' | 'leverage';
  status?: 'Active' | 'Negotiation' | 'Prospect';
  region?: string;
}) {
  let query = supabaseClient
    .from('strategic_partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.region) {
    query = query.eq('region', filters.region);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as StrategicPartner[];
}

/**
 * Get a single strategic partner by ID
 */
export async function getStrategicPartner(id: string) {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as StrategicPartner;
}

/**
 * Create a new strategic partner
 */
export async function createStrategicPartner(partner: Omit<StrategicPartner, 'id' | 'created_at' | 'updated_at' | 'created_by'>) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .insert({
      ...partner,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StrategicPartner;
}

/**
 * Update an existing strategic partner
 */
export async function updateStrategicPartner(id: string, updates: Partial<StrategicPartner>) {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as StrategicPartner;
}

/**
 * Delete a strategic partner
 */
export async function deleteStrategicPartner(id: string) {
  const { error } = await supabaseClient
    .from('strategic_partners')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Search strategic partners by name, focus assets, or notes
 */
export async function searchStrategicPartners(query: string) {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .select('*')
    .or(`name.ilike.%${query}%,notes.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as StrategicPartner[];
}

/**
 * Get strategic partners statistics
 */
export async function getStrategicPartnersStatistics() {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .select('status, type');

  if (error) throw error;

  const stats = {
    total: data.length,
    byStatus: {
      Active: data.filter(p => p.status === 'Active').length,
      Negotiation: data.filter(p => p.status === 'Negotiation').length,
      Prospect: data.filter(p => p.status === 'Prospect').length,
    },
    byType: {
      lender: data.filter(p => p.type === 'lender').length,
      liquidity: data.filter(p => p.type === 'liquidity').length,
      leverage: data.filter(p => p.type === 'leverage').length,
    },
  };

  return stats;
}

/**
 * Update last sync timestamp for a partner
 */
export async function updatePartnerSyncStatus(id: string) {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as StrategicPartner;
}

/**
 * Sync partner with HubSpot
 */
export async function syncWithHubSpot(partnerId: string, dealId: string) {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .update({
      hubspot_deal_id: dealId,
      last_sync_at: new Date().toISOString(),
    })
    .eq('id', partnerId)
    .select()
    .single();

  if (error) throw error;
  return data as StrategicPartner;
}

/**
 * Sync partner with Notion
 */
export async function syncWithNotion(partnerId: string, pageId: string) {
  const { data, error } = await supabaseClient
    .from('strategic_partners')
    .update({
      notion_page_id: pageId,
      last_sync_at: new Date().toISOString(),
    })
    .eq('id', partnerId)
    .select()
    .single();

  if (error) throw error;
  return data as StrategicPartner;
}

// ============================================
// DISTRIBUTION PLATFORMS CRUD
// ============================================

/**
 * Get all distribution platforms with optional filtering
 */
export async function getAllDistributionPlatforms(filters?: {
  integration_status?: 'Live' | 'Sandbox' | 'Planned';
  region?: string;
}) {
  let query = supabaseClient
    .from('distribution_platforms')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.integration_status) {
    query = query.eq('integration_status', filters.integration_status);
  }
  if (filters?.region) {
    query = query.eq('region', filters.region);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as DistributionPlatform[];
}

/**
 * Get a single distribution platform by ID
 */
export async function getDistributionPlatform(id: string) {
  const { data, error } = await supabaseClient
    .from('distribution_platforms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as DistributionPlatform;
}

/**
 * Create a new distribution platform
 */
export async function createDistributionPlatform(platform: Omit<DistributionPlatform, 'id' | 'created_at' | 'updated_at' | 'created_by'>) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) throw new Error('No authenticated user');

  const { data, error } = await supabaseClient
    .from('distribution_platforms')
    .insert({
      ...platform,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DistributionPlatform;
}

/**
 * Update an existing distribution platform
 */
export async function updateDistributionPlatform(id: string, updates: Partial<DistributionPlatform>) {
  const { data, error } = await supabaseClient
    .from('distribution_platforms')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DistributionPlatform;
}

/**
 * Delete a distribution platform
 */
export async function deleteDistributionPlatform(id: string) {
  const { error } = await supabaseClient
    .from('distribution_platforms')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Get distribution platforms statistics
 */
export async function getDistributionPlatformsStatistics() {
  const { data, error } = await supabaseClient
    .from('distribution_platforms')
    .select('integration_status, channels, total_assets_under_distribution, total_investors');

  if (error) throw error;

  const uniqueChannels = new Set<string>();
  data.forEach((platform) => {
    platform.channels?.forEach((channel: string) => uniqueChannels.add(channel));
  });

  const stats = {
    total: data.length,
    byStatus: {
      Live: data.filter(p => p.integration_status === 'Live').length,
      Sandbox: data.filter(p => p.integration_status === 'Sandbox').length,
      Planned: data.filter(p => p.integration_status === 'Planned').length,
    },
    totalChannels: uniqueChannels.size,
    totalAssetsUnderDistribution: data.reduce((sum, p) => sum + (Number(p.total_assets_under_distribution) || 0), 0),
    totalInvestors: data.reduce((sum, p) => sum + (p.total_investors || 0), 0),
  };

  return stats;
}

/**
 * Update platform sync status
 */
export async function updatePlatformSyncStatus(id: string) {
  const { data, error } = await supabaseClient
    .from('distribution_platforms')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DistributionPlatform;
}

/**
 * Update platform performance metrics
 */
export async function updatePlatformMetrics(
  id: string,
  metrics: {
    total_assets_under_distribution?: number;
    total_investors?: number;
  }
) {
  const { data, error } = await supabaseClient
    .from('distribution_platforms')
    .update(metrics)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DistributionPlatform;
}
