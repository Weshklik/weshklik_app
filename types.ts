
export interface DynamicField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'date' | 'checkbox';
  options?: string[];
  required?: boolean;
  suffix?: string;
  placeholder?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  fields: DynamicField[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subCategories?: SubCategory[];
}

// Pro Structure Phase 1.5
export interface ProCategory {
  id: string;
  label: string;
}

export interface ProSector {
  id: string;
  label: string;
  icon: string;
  categories: ProCategory[];
  tags?: ('premium' | 'restricted')[];
  capabilities?: string[]; // e.g. 'IMPORT_AUTO'
}

// Phase 2: Rules per Sector
export interface SectorRule {
  freeLimit: number; // Max listings allowed on Free pack
  importAutoAllowed: boolean; // Can use Import Auto module
  csvImportMinPack: 'none' | 'silver' | 'gold'; // Min pack required for CSV
  manualValidation: boolean; // Requires admin validation before publishing
  allowedCategories: string[]; // Strict list of allowed Marketplace Category IDs
  allowedSubCategories?: string[]; // NEW: Strict list of allowed SubCategory IDs (if undefined, all allowed)
}

// Phase 2.5: Pack Capabilities (Strict Feature Gating)
export interface PackCapabilities {
  maxActiveListings: number; // -1 for unlimited
  importCsvAllowed: boolean;
  importAutoAccess: boolean; // Depends on sector AND pack
  boostsPerMonth: number;
  prioritySupport: boolean;
  apiAccess: boolean;
  canManageTeam: boolean;
}

// Phase 3: Feature Logic Response
export interface FeatureAccessResult {
  allowed: boolean;
  reason?: 'NOT_PRO' | 'SECTOR_RESTRICTED' | 'PACK_REQUIRED' | 'PACK_EXPIRED' | 'OK';
  message?: string;
  title?: string;
  redirect?: string;
}

// Phase 6: Pro Pack State
export type ProPackStatus = 'active' | 'expiring' | 'expired' | 'free';

export interface ProPackState {
  packCode: 'free' | 'silver' | 'gold' | 'premium';
  packName: string;
  startedAt: string | null;
  expiresAt: string | null;
  formattedDate: string;
  daysRemaining: number | null;
  status: ProPackStatus;
}

export interface User {
  id: string;
  name: string;
  type: 'individual' | 'pro';
  avatar?: string;
  verified?: boolean;
  // Module Partenaire
  isPartner?: boolean;
  partnerStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
}

// --- MODULE PARTENAIRE D'ACHAT (DATA MODEL V1) ---

// 1. Table: partner_profiles
// Supabase: public.partner_profiles
export interface PartnerProfile extends User {
  // SQL Fields Mapping
  // id: uuid (inherited from User)
  // status: pending | approved | rejected | suspended (inherited)
  wilayasCovered: string[]; // sql: wilayas text[]
  paymentMethods: ('Espèces (Main propre)' | 'CCP / BaridiMob' | 'Paysera / Wise')[]; // sql: payment_methods text[]
  maxBudget: number; // sql: max_transaction_limit numeric
  rating: number; // sql: rating numeric
  reviewCount: number; // sql: rating_count integer
  
  // View Model Extras
  phone: string;
  bio: string;
  commissionRate: string; // Display only
  completedTransactions: number;
  responseTime: string; // Display only (e.g. "30 min")
  
  // Subscription Link (View Model)
  subscriptionStatus: 'active' | 'inactive' | 'pending_payment'; 
  partnerPlan?: PartnerPlanId; 
  planExpiresAt?: string;
  
  // Protection
  isProbation?: boolean;
  joinDate?: string;
}

export type PartnerPlanId = 'partner_free' | 'partner_active';

// 2. Table: partner_subscriptions
export interface PartnerSubscription {
  id: string;
  partnerId: string; // FK -> partner_profiles.id
  plan: PartnerPlanId;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
}

// 3. Table: partner_transactions (Declarative)
// STEP 8: REMOVED listingAmount to comply with legal constraints (Platform does not track value)
export interface PartnerTransaction {
  id: string;
  buyerId: string; // FK -> auth.users.id
  partnerId: string; // FK -> partner_profiles.id
  listingId: string;
  paymentMethod: string;
  status: 'initiated' | 'completed' | 'cancelled';
  date: string; // created_at
  
  // UI Helpers (Not strictly in DB, joined from Listing)
  listingTitle: string; 
  
  // Joined from partner_ratings
  rating?: number; 
  review?: string;
}

// 4. Table: partner_ratings
export interface PartnerRating {
  id: string;
  transactionId: string; // FK -> partner_transactions.id
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string; // Partner or User ID
  transactionId?: string;
  reason: string;
  description: string;
  date: string;
  status: 'pending' | 'investigating' | 'resolved';
}

export interface StoreProfile extends User {
  cover: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  responseRate: string;
  responseTime: string;
  memberSince: string;
  badges: string[];
  phone: string;
  openingHours?: string;
  // Phase 1: SaaS Fields
  package_slug?: 'free' | 'silver' | 'gold' | 'premium';
  package_updated_at?: string;
  package_expires_at?: string;
  // Phase 1.5: Sector Data
  sectors?: string[]; // CHANGED: Multiple sectors support (e.g. Auto Vente + Auto Location)
  categories?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

// --- RENTAL CONFIGURATION ---
export interface RentalOption {
  id: string;
  label: string;
  priceDZD: number;
  type: 'per_day' | 'fixed'; // per_day adds up with duration, fixed is one-time
}

export interface Listing {
  id: string;
  title: string;
  price: number; // Always in DZD
  currency: 'DZD' | 'EUR'; // Base currency (usually DZD)
  category: string;
  subCategory?: string; // Added for easier detection
  location: string; // Wilaya
  commune?: string; // Commune
  image: string;
  date: string;
  isPromoted?: boolean;
  seller: User;
  description?: string;
  specs?: Record<string, string>;
  
  // --- NEW: Rental Logic ---
  rentalConfig?: {
    pricePer: 'night' | 'day';
    depositDZD: number;
    cleaningFeeDZD?: number;
    minDuration: number;
    options: RentalOption[];
    checkInTime?: string;
    checkOutTime?: string;
    cancellationPolicy?: 'flexible' | 'moderate' | 'strict';
  };
}

export interface Wilaya {
  code: string;
  name: string;
  communes?: string[];
}

export interface ImportRequest {
  id: string;
  clientName: string; // Masked in UI until accepted
  vehicleType: string;
  brand: string;
  model: string;
  yearMin: string;
  budgetMax: number;
  originPreference: string;
  description: string;
  status: 'new' | 'replied' | 'discussion' | 'converted' | 'closed';
  date: string;
  wilaya: string;
}

// --- FINANCIAL & PAYMENT SYSTEM TYPES (HARDENED) ---

export type CurrencyCode = 'DZD' | 'EUR' | 'USD';

export interface ExchangeRate {
  code: CurrencyCode;
  rate: number; // 1 UNIT (EUR/USD) = X DZD. Example: 1 EUR = 146.5 DZD
  source: 'Bank Of Algeria'; // Official source
  lastUpdated: string;
}

export interface BookingBreakdown {
  currency: CurrencyCode; // Display/Payment currency
  exchangeRate: number; // The official rate applied
  duration: number; 
  basePriceDZD: number;
  optionsPriceDZD: number;
  totalDZD: number; // Reference Price
  totalInCurrency: number; // What customer pays
  weshKlikCommissionDZD: number; // Fees
  sellerNetDZD: number; // What seller gets
}

// Strict State Machine
export type PaymentStatus = 'INITIATED' | 'PROCESSING' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export interface Transaction {
  id: string;
  bookingId: string;
  
  // Anti-Fraud Hardening
  idempotencyKey: string; // UNIQUE INDEX
  
  // Money Flow
  amountTotalDZD: number;
  amountCommissionDZD: number;
  amountNetSellerDZD: number;
  
  // Currency Context
  paymentCurrency: CurrencyCode;
  paymentAmount: number;
  appliedRate: number;
  
  // Meta
  sellerId: string;
  buyerId: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  
  // Audit
  metadata?: {
    anomaly?: string;
    pspReference?: string;
    riskScore?: number;
  };
}

export interface Booking {
  id: string;
  listingId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled';
  financials: BookingBreakdown;
  transactionId?: string; // Link to the transaction
  createdAt: string;
}

export interface Payout {
  id: string;
  sellerId: string;
  amountDZD: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  periodStart: string;
  periodEnd: string;
  transactionCount: number;
  generatedAt: string;
}
