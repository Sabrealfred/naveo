import { supabaseClient } from './supabaseClient';
import type { Report, CreateReportInput, NavHistory } from './types';

/**
 * Reports Service
 * Handles report generation, retrieval, and distribution
 */

/**
 * Get all reports
 */
export async function getAllReports() {
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .order('generated_at', { ascending: false });

  if (error) throw error;
  return data as Report[];
}

/**
 * Get report by ID
 */
export async function getReportById(reportId: string) {
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Get reports by fund
 */
export async function getReportsByFund(fundId: string) {
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('fund_id', fundId)
    .order('generated_at', { ascending: false });

  if (error) throw error;
  return data as Report[];
}

/**
 * Get reports by type
 */
export async function getReportsByType(reportType: string) {
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('report_type', reportType)
    .order('generated_at', { ascending: false });

  if (error) throw error;
  return data as Report[];
}

/**
 * Get reports by status
 */
export async function getReportsByStatus(status: string) {
  const { data, error } = await supabaseClient
    .from('reports')
    .select('*')
    .eq('status', status)
    .order('generated_at', { ascending: false });

  if (error) throw error;
  return data as Report[];
}

/**
 * Get ready reports
 */
export async function getReadyReports(fundId?: string) {
  let query = supabaseClient
    .from('reports')
    .select('*')
    .eq('status', 'ready')
    .order('generated_at', { ascending: false });

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Report[];
}

/**
 * Get reports for a specific period
 */
export async function getReportsByPeriod(
  startDate: string,
  endDate: string,
  fundId?: string
) {
  let query = supabaseClient
    .from('reports')
    .select('*')
    .gte('period_start', startDate)
    .lte('period_end', endDate)
    .order('generated_at', { ascending: false });

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Report[];
}

/**
 * Get recent reports (last N days)
 */
export async function getRecentReports(days: number = 30, fundId?: string) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  let query = supabaseClient
    .from('reports')
    .select('*')
    .gte('generated_at', fromDate.toISOString())
    .order('generated_at', { ascending: false });

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Report[];
}

/**
 * Create a new report
 */
export async function createReport(report: CreateReportInput) {
  const { data, error } = await supabaseClient
    .from('reports')
    .insert({
      ...report,
      status: 'generating',
      download_count: 0
    })
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Update report
 */
export async function updateReport(reportId: string, updates: Partial<Report>) {
  const { data, error } = await supabaseClient
    .from('reports')
    .update(updates)
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Mark report as ready
 */
export async function markReportAsReady(
  reportId: string,
  fileUrl: string,
  fileSize: number
) {
  const { data, error } = await supabaseClient
    .from('reports')
    .update({
      status: 'ready',
      file_url: fileUrl,
      file_size: fileSize
    })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Mark report as sent
 */
export async function markReportAsSent(reportId: string, sentTo: string[]) {
  const { data, error } = await supabaseClient
    .from('reports')
    .update({
      status: 'sent',
      sent_to: sentTo,
      sent_at: new Date().toISOString()
    })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Increment report download count
 */
export async function incrementReportDownloadCount(reportId: string) {
  const report = await getReportById(reportId);

  const { data, error } = await supabaseClient
    .from('reports')
    .update({
      download_count: (report.download_count || 0) + 1
    })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Archive report
 */
export async function archiveReport(reportId: string) {
  const { data, error } = await supabaseClient
    .from('reports')
    .update({ status: 'archived' })
    .eq('id', reportId)
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

/**
 * Delete report
 */
export async function deleteReport(reportId: string) {
  const { error } = await supabaseClient
    .from('reports')
    .delete()
    .eq('id', reportId);

  if (error) throw error;
  return { success: true };
}

/**
 * Get report statistics
 */
export async function getReportStatistics(fundId?: string) {
  let query = supabaseClient
    .from('reports')
    .select('report_type, status, file_size, download_count');

  if (fundId) {
    query = query.eq('fund_id', fundId);
  }

  const { data, error } = await query;

  if (error) throw error;

  const stats = {
    total_reports: data.length,
    by_type: {} as Record<string, number>,
    by_status: {} as Record<string, number>,
    total_file_size: 0,
    total_downloads: 0,
    avg_downloads_per_report: 0
  };

  data.forEach(report => {
    stats.by_type[report.report_type] = (stats.by_type[report.report_type] || 0) + 1;
    stats.by_status[report.status] = (stats.by_status[report.status] || 0) + 1;
    stats.total_file_size += report.file_size || 0;
    stats.total_downloads += report.download_count || 0;
  });

  stats.avg_downloads_per_report = data.length > 0
    ? stats.total_downloads / data.length
    : 0;

  return stats;
}

/**
 * Get NAV history for a fund
 */
export async function getNavHistory(
  fundId: string,
  startDate?: string,
  endDate?: string,
  limit?: number
) {
  const { data, error } = await supabaseClient
    .rpc('get_nav_history', {
      p_fund_id: fundId,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
      p_limit: limit || 365
    });

  if (error) throw error;
  return data as NavHistory[];
}

/**
 * Get latest NAV for a fund
 */
export async function getLatestNav(fundId: string) {
  const { data, error } = await supabaseClient
    .from('nav_history')
    .select('*')
    .eq('fund_id', fundId)
    .order('calculation_date', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data as NavHistory;
}

/**
 * Create NAV history entry
 */
export async function createNavHistory(navEntry: Partial<NavHistory>) {
  const { data, error } = await supabaseClient
    .from('nav_history')
    .insert(navEntry)
    .select()
    .single();

  if (error) throw error;
  return data as NavHistory;
}

/**
 * Get NAV performance over period
 */
export async function getNavPerformance(fundId: string, days: number = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const history = await getNavHistory(
    fundId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  if (history.length < 2) {
    return {
      start_nav: null,
      end_nav: null,
      change: 0,
      change_percentage: 0,
      data_points: history.length
    };
  }

  const startNav = history[history.length - 1].nav;
  const endNav = history[0].nav;
  const change = endNav - startNav;
  const changePercentage = (change / startNav) * 100;

  return {
    start_nav: startNav,
    end_nav: endNav,
    change,
    change_percentage: changePercentage,
    data_points: history.length
  };
}

/**
 * Get monthly reports for a fund
 */
export async function getMonthlyReports(fundId: string, year?: number) {
  let query = supabaseClient
    .from('reports')
    .select('*')
    .eq('fund_id', fundId)
    .eq('report_type', 'monthly')
    .order('period_start', { ascending: false });

  if (year) {
    query = query
      .gte('period_start', `${year}-01-01`)
      .lt('period_start', `${year + 1}-01-01`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Report[];
}

/**
 * Get quarterly reports for a fund
 */
export async function getQuarterlyReports(fundId: string, year?: number) {
  let query = supabaseClient
    .from('reports')
    .select('*')
    .eq('fund_id', fundId)
    .eq('report_type', 'quarterly')
    .order('period_start', { ascending: false });

  if (year) {
    query = query
      .gte('period_start', `${year}-01-01`)
      .lt('period_start', `${year + 1}-01-01`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Report[];
}
