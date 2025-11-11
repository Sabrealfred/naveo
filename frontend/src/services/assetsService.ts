import { supabaseClient } from './supabaseClient';
import type { Asset } from './types';

/**
 * Assets Service
 * Handles all asset-related operations including CRUD and fund assets management
 */

/**
 * Get all assets
 */
export async function getAllAssets() {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

/**
 * Get asset by ID
 */
export async function getAssetById(assetId: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (error) throw error;
  return data as Asset;
}

/**
 * Get all assets for a specific fund
 */
export async function getAssetsByFund(fundId: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .eq('fund_id', fundId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

/**
 * Get assets by type
 */
export async function getAssetsByType(type: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

/**
 * Get assets by fund and type
 */
export async function getAssetsByFundAndType(fundId: string, type: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .eq('fund_id', fundId)
    .eq('type', type)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

/**
 * Search assets by symbol or name
 */
export async function searchAssets(searchTerm: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .or(`symbol.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Asset[];
}

/**
 * Create a new asset
 */
export async function createAsset(asset: Partial<Asset>) {
  const { data, error } = await supabaseClient
    .from('assets')
    .insert(asset)
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

/**
 * Update asset
 */
export async function updateAsset(assetId: string, updates: Partial<Asset>) {
  const { data, error } = await supabaseClient
    .from('assets')
    .update(updates)
    .eq('id', assetId)
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

/**
 * Update asset price
 */
export async function updateAssetPrice(assetId: string, newPrice: number) {
  const { data, error } = await supabaseClient
    .from('assets')
    .update({ current_price: newPrice })
    .eq('id', assetId)
    .select()
    .single();

  if (error) throw error;
  return data as Asset;
}

/**
 * Bulk update asset prices
 */
export async function bulkUpdateAssetPrices(updates: Array<{ id: string; current_price: number }>) {
  const promises = updates.map(({ id, current_price }) =>
    updateAssetPrice(id, current_price)
  );

  return await Promise.all(promises);
}

/**
 * Delete asset
 */
export async function deleteAsset(assetId: string) {
  const { error } = await supabaseClient
    .from('assets')
    .delete()
    .eq('id', assetId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get fund asset allocation (by type)
 */
export async function getFundAssetAllocation(fundId: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('type, quantity, current_price')
    .eq('fund_id', fundId);

  if (error) throw error;

  // Calculate allocation by type
  const allocation = data.reduce((acc, asset) => {
    const type = asset.type || 'unknown';
    const value = (asset.quantity || 0) * (asset.current_price || 0);

    if (!acc[type]) {
      acc[type] = { type, value: 0, count: 0 };
    }

    acc[type].value += value;
    acc[type].count += 1;

    return acc;
  }, {} as Record<string, { type: string; value: number; count: number }>);

  const totalValue = Object.values(allocation).reduce((sum, item) => sum + item.value, 0);

  return Object.values(allocation).map(item => ({
    type: item.type,
    value: item.value,
    count: item.count,
    percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0
  }));
}

/**
 * Get total value of assets for a fund
 */
export async function getFundAssetValue(fundId: string) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('quantity, current_price')
    .eq('fund_id', fundId);

  if (error) throw error;

  const totalValue = data.reduce((sum, asset) => {
    return sum + ((asset.quantity || 0) * (asset.current_price || 0));
  }, 0);

  return totalValue;
}

/**
 * Get top performing assets by fund
 */
export async function getTopPerformingAssets(fundId: string, limit: number = 10) {
  const { data, error } = await supabaseClient
    .from('assets')
    .select('*')
    .eq('fund_id', fundId);

  if (error) throw error;

  // Calculate performance for each asset
  const assetsWithPerformance = data.map(asset => {
    const purchaseValue = (asset.quantity || 0) * (asset.purchase_price || 0);
    const currentValue = (asset.quantity || 0) * (asset.current_price || 0);
    const pnl = currentValue - purchaseValue;
    const pnlPercentage = purchaseValue > 0 ? (pnl / purchaseValue) * 100 : 0;

    return {
      ...asset,
      pnl,
      pnl_percentage: pnlPercentage,
      current_value: currentValue
    };
  });

  // Sort by PnL percentage descending
  return assetsWithPerformance
    .sort((a, b) => b.pnl_percentage - a.pnl_percentage)
    .slice(0, limit);
}
