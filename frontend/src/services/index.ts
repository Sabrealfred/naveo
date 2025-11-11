/**
 * Naveo Services
 * Central export point for all API services
 */

// Supabase Client
export { supabaseClient } from './supabaseClient';

// Types
export * from './types';

// Funds Service
export * as fundsService from './fundsService';

// Assets Service
export * as assetsService from './assetsService';

// Transactions Service
export * as transactionsService from './transactionsService';

// Portfolio Service
export * as portfolioService from './portfolioService';

// Traders Service
export * as tradersService from './tradersService';

// KYC Service
export * as kycService from './kycService';

// Notifications Service
export * as notificationsService from './notificationsService';

// Reports Service
export * as reportsService from './reportsService';

// Profile Service
export * as profileService from './profileService';

// Capital Partners & Distribution Service
export * as capitalPartnersService from './capitalPartnersService';
