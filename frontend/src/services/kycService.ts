import { supabaseClient } from './supabaseClient';
import type { KYCVerification, CreateKYCInput, UpdateKYCInput, KYCStatistics } from './types';

/**
 * KYC Service
 * Handles KYC verification operations including submissions, reviews, and compliance checks
 */

/**
 * Get all KYC verifications
 */
export async function getAllKYCVerifications() {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as KYCVerification[];
}

/**
 * Get KYC verification by ID
 */
export async function getKYCById(kycId: string) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('id', kycId)
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Get KYC verifications by user
 */
export async function getKYCByUser(userId: string) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as KYCVerification[];
}

/**
 * Get latest KYC verification for a user
 */
export async function getLatestKYCByUser(userId: string) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Get KYC verifications by status
 */
export async function getKYCByStatus(status: string) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('status', status)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as KYCVerification[];
}

/**
 * Get pending KYC verifications
 */
export async function getPendingKYCVerifications() {
  return getKYCByStatus('pending');
}

/**
 * Get KYC verifications that need review
 */
export async function getKYCNeedingReview() {
  return getKYCByStatus('needs_review');
}

/**
 * Get KYC verifications by tier
 */
export async function getKYCByTier(tier: 1 | 2 | 3) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('tier', tier)
    .order('submitted_at', { ascending: false });

  if (error) throw error;
  return data as KYCVerification[];
}

/**
 * Get high-risk KYC verifications (risk_score >= 70)
 */
export async function getHighRiskKYCVerifications() {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .gte('risk_score', 70)
    .order('risk_score', { ascending: false });

  if (error) throw error;
  return data as KYCVerification[];
}

/**
 * Create a new KYC verification
 */
export async function createKYCVerification(kyc: CreateKYCInput) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .insert({
      ...kyc,
      status: 'pending',
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Update KYC verification
 */
export async function updateKYCVerification(kycId: string, updates: UpdateKYCInput) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .update(updates)
    .eq('id', kycId)
    .select()
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Approve KYC verification
 */
export async function approveKYCVerification(
  kycId: string,
  reviewedBy: string,
  options?: {
    risk_score?: number;
    verification_level?: string;
    expiry_date?: string;
  }
) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .update({
      status: 'approved',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      ...options
    })
    .eq('id', kycId)
    .select()
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Reject KYC verification
 */
export async function rejectKYCVerification(
  kycId: string,
  reviewedBy: string,
  rejectionReason: string
) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .update({
      status: 'rejected',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      rejection_reason: rejectionReason
    })
    .eq('id', kycId)
    .select()
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Mark KYC as needs review
 */
export async function markKYCForReview(kycId: string, reason?: string) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .update({
      status: 'needs_review',
      metadata: reason ? { review_reason: reason } : undefined
    })
    .eq('id', kycId)
    .select()
    .single();

  if (error) throw error;
  return data as KYCVerification;
}

/**
 * Delete KYC verification
 */
export async function deleteKYCVerification(kycId: string) {
  const { error } = await supabaseClient
    .from('kyc_verifications')
    .delete()
    .eq('id', kycId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get KYC statistics (using function)
 */
export async function getKYCStatistics() {
  const { data, error } = await supabaseClient
    .rpc('get_kyc_statistics');

  if (error) throw error;
  return data[0] as KYCStatistics;
}

/**
 * Check if user has valid KYC
 */
export async function hasValidKYC(userId: string, requiredTier: 1 | 2 | 3 = 1) {
  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .gte('tier', requiredTier)
    .or('expiry_date.is.null,expiry_date.gte.' + new Date().toISOString().split('T')[0])
    .order('submitted_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data.length > 0;
}

/**
 * Get KYC compliance status for user
 */
export async function getKYCComplianceStatus(userId: string) {
  try {
    const kyc = await getLatestKYCByUser(userId);

    const isExpired = kyc.expiry_date
      ? new Date(kyc.expiry_date) < new Date()
      : false;

    const isValid = kyc.status === 'approved' && !isExpired;

    return {
      has_kyc: true,
      is_valid: isValid,
      is_expired: isExpired,
      status: kyc.status,
      tier: kyc.tier,
      risk_score: kyc.risk_score,
      expiry_date: kyc.expiry_date,
      needs_action: kyc.status === 'pending' || kyc.status === 'needs_review' || isExpired,
      kyc_data: kyc
    };
  } catch (error) {
    return {
      has_kyc: false,
      is_valid: false,
      is_expired: false,
      status: null,
      tier: null,
      risk_score: null,
      expiry_date: null,
      needs_action: true,
      kyc_data: null
    };
  }
}

/**
 * Get expiring KYC verifications (expiring in next N days)
 */
export async function getExpiringKYCVerifications(days: number = 30) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const { data, error } = await supabaseClient
    .from('kyc_verifications')
    .select('*')
    .eq('status', 'approved')
    .gte('expiry_date', today.toISOString().split('T')[0])
    .lte('expiry_date', futureDate.toISOString().split('T')[0])
    .order('expiry_date', { ascending: true });

  if (error) throw error;
  return data as KYCVerification[];
}
