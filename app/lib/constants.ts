/**
 * Constants for Australian Rental Property Tax Modeling
 * Contains tax rates, limits, and configuration values
 */

// ============================================================================
// AUSTRALIAN TAX RATES & LIMITS
// ============================================================================

/**
 * Standard Medicare Levy rate (2% as of 2024-25)
 */
export const DEFAULT_MEDICARE_LEVY_RATE = 0.02;

/**
 * Division 43 Capital Works depreciation rate
 * Applies to construction costs for buildings built after certain dates
 */
export const CAPITAL_WORKS_RATE = 0.025; // 2.5% per annum

/**
 * Weeks per year for rental income calculation
 */
export const WEEKS_PER_YEAR = 52;

/**
 * Common marginal tax rates for selection (2024-25 brackets)
 * Note: This is a simplified planning model using flat marginal rates
 */
export const MARGINAL_TAX_RATES = [
  { rate: 0, label: '0% (Up to $18,200)' },
  { rate: 0.16, label: '16% ($18,201 - $45,000)' },
  { rate: 0.30, label: '30% ($45,001 - $135,000)' },
  { rate: 0.37, label: '37% ($135,001 - $190,000)' },
  { rate: 0.45, label: '45% (Over $190,000)' },
] as const;

// ============================================================================
// VALIDATION LIMITS
// ============================================================================

/**
 * Minimum and maximum values for validation
 */
export const VALIDATION_LIMITS = {
  /** Minimum weekly rent */
  MIN_WEEKLY_RENT: 0,
  /** Maximum weekly rent (sanity check) */
  MAX_WEEKLY_RENT: 10000,
  
  /** Minimum vacancy weeks */
  MIN_VACANCY_WEEKS: 0,
  /** Maximum vacancy weeks */
  MAX_VACANCY_WEEKS: 52,
  
  /** Minimum ownership percentage */
  MIN_OWNERSHIP_PCT: 0,
  /** Maximum ownership percentage */
  MAX_OWNERSHIP_PCT: 100,
  
  /** Minimum interest rate (can be 0 for offset accounts) */
  MIN_INTEREST_RATE: 0,
  /** Maximum interest rate (sanity check) */
  MAX_INTEREST_RATE: 0.25,
  
  /** Minimum loan term */
  MIN_LOAN_TERM: 1,
  /** Maximum loan term */
  MAX_LOAN_TERM: 40,
  
  /** Minimum marginal tax rate */
  MIN_MARGINAL_RATE: 0,
  /** Maximum marginal tax rate */
  MAX_MARGINAL_RATE: 0.47,
  
  /** Minimum Medicare levy rate */
  MIN_MEDICARE_RATE: 0,
  /** Maximum Medicare levy rate (including surcharge) */
  MAX_MEDICARE_RATE: 0.035,
} as const;

// ============================================================================
// FORMATTING OPTIONS
// ============================================================================

/**
 * Currency formatting options for Australian dollars
 */
export const CURRENCY_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

/**
 * Percentage formatting options
 */
export const PERCENTAGE_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

/**
 * Format a number as Australian currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', CURRENCY_FORMAT_OPTIONS).format(value);
}

/**
 * Format a decimal as percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-AU', PERCENTAGE_FORMAT_OPTIONS).format(value);
}

/**
 * Format a number with thousand separators (no currency symbol)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// ============================================================================
// TOOLTIP CONTENT
// ============================================================================

export const TOOLTIPS = {
  baseTaxableIncome: 
    'Your taxable income from all sources excluding this rental property. This is used to calculate your current tax position before considering the property.',
  
  ownershipPercentage: 
    'Your percentage ownership of the property. For joint ownership, enter your share only. All income, expenses, and deductions will be proportionally adjusted.',
  
  marginalTaxRate: 
    'Your highest marginal tax rate. This is the rate at which additional income (or deductions) will be taxed. For planning purposes, select the rate that applies to your income bracket.',
  
  medicareLevyRate: 
    'The Medicare Levy is typically 2% of taxable income. Some taxpayers may have exemptions or pay the Medicare Levy Surcharge.',
  
  loanAmount: 
    'The amount borrowed to purchase the property. Only interest on money borrowed to produce assessable income is deductible.',
  
  interestRate: 
    'The annual interest rate on your investment loan. Interest expenses are tax-deductible when borrowed to produce rental income.',
  
  isInterestOnly: 
    'Interest-only loans have lower cash outflows but do not reduce the principal. This model only considers interest expense (not principal repayments) as they are the only deductible component.',
  
  weeklyRent: 
    'The expected weekly rental income from the property. Annual rent is calculated as (52 - vacancy weeks) × weekly rent.',
  
  vacancyWeeks: 
    'Expected number of weeks per year the property will be vacant. Industry average is typically 2-4 weeks.',
  
  negativeGearing: 
    'Negative gearing occurs when the property expenses (including interest and depreciation) exceed rental income. This loss can offset other taxable income, reducing your overall tax.',
  
  positiveGearing: 
    'Positive gearing occurs when rental income exceeds all property expenses. This adds to your taxable income.',
  
  capitalWorks: 
    'Division 43 allows you to claim 2.5% per year of the construction cost of the building (not land). This applies to buildings constructed after specific dates.',
  
  plantEquipment: 
    'Division 40 covers depreciation of items within the property such as appliances, carpets, blinds, and fixtures. A quantity surveyor can provide a detailed schedule.',
  
  taxBenefit: 
    'Positive value indicates a tax saving (your tax liability is reduced). Negative value indicates additional tax payable (property has increased your tax liability).',
} as const;
