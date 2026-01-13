/**
 * TypeScript interfaces for Australian Rental Property Tax Modeling
 * All types used throughout the application for type safety and documentation
 */

// ============================================================================
// INPUT TYPES - User-provided values
// ============================================================================

/**
 * Personal financial details of the property owner
 */
export interface PersonalInputs {
  /** Base taxable income excluding rental property (AUD) */
  baseTaxableIncome: number;
  /** Ownership percentage of the property (0-100) */
  ownershipPercentage: number;
  /** Marginal tax rate for planning purposes (0-0.47) */
  marginalTaxRate: number;
  /** Medicare levy rate (default 0.02 = 2%) */
  medicareLevyRate: number;
}

/**
 * Property purchase and loan details
 */
export interface PropertyPurchaseInputs {
  /** Total purchase price of the property (AUD) */
  purchasePrice: number;
  /** Loan amount borrowed (AUD) */
  loanAmount: number;
  /** Annual interest rate as decimal (e.g., 0.06 = 6%) */
  interestRate: number;
  /** Loan term in years */
  loanTermYears: number;
  /** Whether loan is interest-only (true) or principal & interest (false) */
  isInterestOnly: boolean;
  /** Settlement date (for future extension) */
  settlementDate: string;
}

/**
 * Rental income details
 */
export interface RentalIncomeInputs {
  /** Weekly rent amount (AUD) */
  weeklyRent: number;
  /** Expected vacancy weeks per year */
  vacancyWeeksPerYear: number;
}

/**
 * Annual operating expenses (all values in AUD)
 */
export interface OperatingExpensesInputs {
  /** Property management fees */
  propertyManagement: number;
  /** Council rates */
  councilRates: number;
  /** Water rates */
  waterRates: number;
  /** Landlord insurance */
  insurance: number;
  /** Repairs and maintenance */
  repairsMaintenance: number;
  /** Body corporate/strata fees */
  bodyCorporate: number;
  /** Other miscellaneous expenses */
  otherExpenses: number;
  /** Description of other expenses */
  otherExpensesDescription: string;
}

/**
 * Depreciation inputs for tax deductions
 */
export interface DepreciationInputs {
  /** Construction value for Division 43 Capital Works (AUD) */
  constructionValue: number;
  /** Annual plant & equipment depreciation estimate - Division 40 (AUD) */
  plantEquipmentAnnual: number;
}

/**
 * Combined input state for the property model
 */
export interface PropertyModelInputs {
  personal: PersonalInputs;
  propertyPurchase: PropertyPurchaseInputs;
  rentalIncome: RentalIncomeInputs;
  operatingExpenses: OperatingExpensesInputs;
  depreciation: DepreciationInputs;
}

// ============================================================================
// OUTPUT / CALCULATED TYPES
// ============================================================================

/**
 * Rental cashflow calculation results
 */
export interface CashflowResults {
  /** Annual gross rental income after vacancy adjustment (AUD) */
  grossRentalIncome: number;
  /** Total annual cash operating expenses (AUD) */
  totalOperatingExpenses: number;
  /** Annual interest expense on loan (AUD) */
  interestExpense: number;
  /** Net cashflow before tax = grossRent - expenses - interest (AUD) */
  netCashflowPreTax: number;
}

/**
 * Depreciation calculation results
 */
export interface DepreciationResults {
  /** Division 43 Capital Works deduction (2.5% of construction value) */
  capitalWorksDeduction: number;
  /** Division 40 Plant & Equipment deduction */
  plantEquipmentDeduction: number;
  /** Total annual depreciation */
  totalDepreciation: number;
}

/**
 * Rental Profit & Loss results
 */
export interface RentalPLResults {
  /** Net cashflow before tax */
  netCashflowPreTax: number;
  /** Total depreciation deductions */
  totalDepreciation: number;
  /** Net rental result = netCashflow - depreciation */
  netRentalResult: number;
  /** Whether property is negatively geared (net result < 0) */
  isNegativelyGeared: boolean;
}

/**
 * Tax calculation for a single scenario
 */
export interface TaxScenarioResults {
  /** Taxable income for this scenario */
  taxableIncome: number;
  /** Income tax calculated */
  incomeTax: number;
  /** Medicare levy calculated */
  medicareLevy: number;
  /** Total tax (income tax + medicare levy) */
  totalTax: number;
}

/**
 * Tax impact comparison between scenarios
 */
export interface TaxImpactResults {
  /** Tax scenario WITHOUT property */
  withoutProperty: TaxScenarioResults;
  /** Tax scenario WITH property */
  withProperty: TaxScenarioResults;
  /** Tax benefit/cost = tax(without) - tax(with). Positive = saving */
  taxBenefit: number;
  /** After-tax cashflow position = netCashflowPreTax + taxBenefit */
  afterTaxCashflow: number;
}

/**
 * Complete calculated results from the property model
 */
export interface PropertyModelResults {
  cashflow: CashflowResults;
  depreciation: DepreciationResults;
  rentalPL: RentalPLResults;
  taxImpact: TaxImpactResults;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation error for a specific field
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation warning (non-blocking)
 */
export interface ValidationWarning {
  field: string;
  message: string;
}

/**
 * Overall validation state
 */
export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

/**
 * Default values for initializing the property model
 */
export const DEFAULT_INPUTS: PropertyModelInputs = {
  personal: {
    baseTaxableIncome: 100000,
    ownershipPercentage: 100,
    marginalTaxRate: 0.37,
    medicareLevyRate: 0.02,
  },
  propertyPurchase: {
    purchasePrice: 600000,
    loanAmount: 480000,
    interestRate: 0.06,
    loanTermYears: 30,
    isInterestOnly: true,
    settlementDate: new Date().toISOString().split('T')[0],
  },
  rentalIncome: {
    weeklyRent: 550,
    vacancyWeeksPerYear: 2,
  },
  operatingExpenses: {
    propertyManagement: 1500,
    councilRates: 2000,
    waterRates: 1000,
    insurance: 1500,
    repairsMaintenance: 1000,
    bodyCorporate: 0,
    otherExpenses: 0,
    otherExpensesDescription: '',
  },
  depreciation: {
    constructionValue: 300000,
    plantEquipmentAnnual: 5000,
  },
};
