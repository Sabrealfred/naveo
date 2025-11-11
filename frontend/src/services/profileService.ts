import { supabaseClient } from './supabaseClient';
import type { UserProfile } from './types';

/**
 * Profile Service
 * Handles user profile management including CRUD operations
 */

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as UserProfile;
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  return getUserProfile(user.id);
}

/**
 * Create user profile
 */
export async function createUserProfile(profile: Partial<UserProfile>) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

/**
 * Update current user's profile
 */
export async function updateCurrentUserProfile(updates: Partial<UserProfile>) {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  return updateUserProfile(user.id, updates);
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from('user-assets')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabaseClient.storage
    .from('user-assets')
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  await updateUserProfile(userId, { avatar_url: publicUrl });

  return publicUrl;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  preferences: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    marketing?: boolean;
  }
) {
  const profile = await getUserProfile(userId);
  const currentPrefs = profile.notification_preferences || {};

  const updatedPrefs = {
    ...currentPrefs,
    ...preferences
  };

  return updateUserProfile(userId, {
    notification_preferences: updatedPrefs
  });
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: string) {
  return updateUserProfile(userId, {
    onboarding_completed: true,
    profile_completed_at: new Date().toISOString()
  });
}

/**
 * Get all profiles (admin only)
 */
export async function getAllProfiles() {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserProfile[];
}

/**
 * Get profiles by investor type
 */
export async function getProfilesByInvestorType(investorType: string) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .eq('investor_type', investorType)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserProfile[];
}

/**
 * Get profiles by country
 */
export async function getProfilesByCountry(country: string) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .eq('country', country)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as UserProfile[];
}

/**
 * Search profiles by name or email
 */
export async function searchProfiles(searchTerm: string) {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('*')
    .or(`full_name.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data as UserProfile[];
}

/**
 * Get profile statistics
 */
export async function getProfileStatistics() {
  const { data, error } = await supabaseClient
    .from('user_profiles')
    .select('investor_type, country, risk_tolerance, onboarding_completed');

  if (error) throw error;

  const stats = {
    total_profiles: data.length,
    by_investor_type: {} as Record<string, number>,
    by_country: {} as Record<string, number>,
    by_risk_tolerance: {} as Record<string, number>,
    onboarding_completed: data.filter(p => p.onboarding_completed).length,
    onboarding_pending: data.filter(p => !p.onboarding_completed).length
  };

  data.forEach(profile => {
    // Count by investor type
    if (profile.investor_type) {
      stats.by_investor_type[profile.investor_type] =
        (stats.by_investor_type[profile.investor_type] || 0) + 1;
    }

    // Count by country
    if (profile.country) {
      stats.by_country[profile.country] =
        (stats.by_country[profile.country] || 0) + 1;
    }

    // Count by risk tolerance
    if (profile.risk_tolerance) {
      stats.by_risk_tolerance[profile.risk_tolerance] =
        (stats.by_risk_tolerance[profile.risk_tolerance] || 0) + 1;
    }
  });

  return stats;
}

/**
 * Delete user profile (soft delete by marking as inactive)
 */
export async function deleteUserProfile(userId: string) {
  // In production, consider soft delete instead of hard delete
  const { error } = await supabaseClient
    .from('user_profiles')
    .delete()
    .eq('id', userId);

  if (error) throw error;
  return { success: true };
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: string) {
  const profile = await getUserProfile(userId);

  return updateUserProfile(userId, {
    last_login_at: new Date().toISOString(),
    login_count: (profile.login_count || 0) + 1
  });
}
