import { supabaseClient } from './supabaseClient';
import type { Notification, CreateNotificationInput } from './types';

/**
 * Notifications Service
 * Handles user notifications including creation, retrieval, and management
 */

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabaseClient
    .rpc('get_user_notifications', {
      p_user_id: userId,
      p_read_status: null,
      p_type: null,
      p_priority: null,
      p_limit: 100
    });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabaseClient
    .rpc('get_user_notifications', {
      p_user_id: userId,
      p_read_status: false,
      p_type: null,
      p_priority: null,
      p_limit: 100
    });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get notifications by type
 */
export async function getNotificationsByType(userId: string, type: string) {
  const { data, error } = await supabaseClient
    .rpc('get_user_notifications', {
      p_user_id: userId,
      p_read_status: null,
      p_type: type,
      p_priority: null,
      p_limit: 50
    });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get notifications by priority
 */
export async function getNotificationsByPriority(userId: string, priority: string) {
  const { data, error } = await supabaseClient
    .rpc('get_user_notifications', {
      p_user_id: userId,
      p_read_status: null,
      p_type: null,
      p_priority: priority,
      p_limit: 50
    });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get critical notifications (unread only)
 */
export async function getCriticalNotifications(userId: string) {
  const { data, error } = await supabaseClient
    .rpc('get_user_notifications', {
      p_user_id: userId,
      p_read_status: false,
      p_type: null,
      p_priority: 'critical',
      p_limit: 50
    });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get notifications requiring action
 */
export async function getActionRequiredNotifications(userId: string) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('action_required', true)
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Notification[];
}

/**
 * Get notification by ID
 */
export async function getNotificationById(notificationId: string) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .select('*')
    .eq('id', notificationId)
    .single();

  if (error) throw error;
  return data as Notification;
}

/**
 * Create a new notification
 */
export async function createNotification(notification: CreateNotificationInput) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

/**
 * Create bulk notifications
 */
export async function createBulkNotifications(notifications: CreateNotificationInput[]) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .insert(notifications)
    .select();

  if (error) throw error;
  return data as Notification[];
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

/**
 * Mark multiple notifications as read (using function)
 */
export async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  const { data, error } = await supabaseClient
    .rpc('mark_notifications_as_read', {
      p_user_id: userId,
      p_notification_ids: notificationIds
    });

  if (error) throw error;
  return { updated_count: data };
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
    .select();

  if (error) throw error;
  return data as Notification[];
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string) {
  const { error } = await supabaseClient
    .from('notifications')
    .delete()
    .eq('id', notificationId);

  if (error) throw error;
  return { success: true };
}

/**
 * Delete multiple notifications
 */
export async function deleteNotifications(notificationIds: string[]) {
  const { error } = await supabaseClient
    .from('notifications')
    .delete()
    .in('id', notificationIds);

  if (error) throw error;
  return { success: true };
}

/**
 * Delete all read notifications for a user
 */
export async function deleteReadNotifications(userId: string) {
  const { error } = await supabaseClient
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .eq('read', true);

  if (error) throw error;
  return { success: true };
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string) {
  const { count, error } = await supabaseClient
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count || 0;
}

/**
 * Get notification counts by priority
 */
export async function getNotificationCountsByPriority(userId: string) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .select('priority')
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;

  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: data.length
  };

  data.forEach(notification => {
    counts[notification.priority as keyof typeof counts]++;
  });

  return counts;
}

/**
 * Get notification counts by type
 */
export async function getNotificationCountsByType(userId: string) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .select('type')
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;

  const counts = data.reduce((acc, notification) => {
    acc[notification.type] = (acc[notification.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return counts;
}

/**
 * Delete expired notifications
 */
export async function deleteExpiredNotifications(userId?: string) {
  let query = supabaseClient
    .from('notifications')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .not('expires_at', 'is', null);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { error } = await query;

  if (error) throw error;
  return { success: true };
}

/**
 * Subscribe to real-time notifications
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: Notification) => void
) {
  const subscription = supabaseClient
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
