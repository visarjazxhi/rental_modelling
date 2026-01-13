/**
 * Tax Calculations
 * Pure functions for calculating Australian income tax impact
 * 
 * IMPORTANT: This is a planning model using flat marginal tax rates.
 * It does NOT implement full progressive tax brackets.
 * 
 * The purpose is to estimate the tax impact of rental property ownership
 * by applying the user's marginal rate to income changes.
 * 
 * For actual tax returns, consult a registered tax agent.
 */

import type { 
  TaxScenarioResults, 
  TaxImpactResults,
  RentalPLResults,
  CashflowResults,
  DepreciationResults,
} from '../types';

/**
 * Calculate income tax using marginal rate
 * 
 * Formula: taxableIncome × marginalTaxRate
 * 
 * This is a simplified calculation that applies a flat marginal rate.
 * It's suitable for estimating the tax impact of CHANGES in income
 * (such as rental income/loss) at the margin.
 * 
 * @param taxableIncome - Taxable income in AUD
 * @param marginalTaxRate - Marginal tax rate as decimal (e.g., 0.37 = 37%)
 * @returns Income tax in AUD
 * 
 * @example
 * // $100,000 income at 37% marginal rate
 * calculateIncomeTax(100000, 0.37) // Returns 37,000
 */
export function calculateIncomeTax(
  taxableIncome: number,
  marginalTaxRate: number
): number {
  // Taxable income cannot be negative for this calculation
  // (tax losses carried forward are not modeled)
  const effectiveIncome = Math.max(0, taxableIncome);
  return effectiveIncome * marginalTaxRate;
}

/**
 * Calculate Medicare Levy
 * 
 * Formula: taxableIncome × medicareLevyRate
 * 
 * Standard Medicare Levy is 2% of taxable income.
 * Some taxpayers may have exemptions or pay additional surcharge.
 * 
 * @param taxableIncome - Taxable income in AUD
 * @param medicareLevyRate - Medicare levy rate as decimal (default 0.02 = 2%)
 * @returns Medicare levy in AUD
 * 
 * @example
 * // $100,000 income at 2% levy
 * calculateMedicareLevy(100000, 0.02) // Returns 2,000
 */
export function calculateMedicareLevy(
  taxableIncome: number,
  medicareLevyRate: number
): number {
  const effectiveIncome = Math.max(0, taxableIncome);
  return effectiveIncome * medicareLevyRate;
}

/**
 * Calculate total tax (income tax + Medicare levy)
 * 
 * @param incomeTax - Calculated income tax
 * @param medicareLevy - Calculated Medicare levy
 * @returns Total tax payable
 */
export function calculateTotalTax(
  incomeTax: number,
  medicareLevy: number
): number {
  return incomeTax + medicareLevy;
}

/**
 * Calculate net rental result (Profit & Loss)
 * 
 * Formula: netCashflowPreTax − totalDepreciation
 * 
 * This is the taxable rental income/loss that affects overall taxable income.
 * - Positive result = taxable profit (positive gearing)
 * - Negative result = tax-deductible loss (negative gearing)
 * 
 * @param netCashflowPreTax - Net cashflow before tax
 * @param totalDepreciation - Total depreciation deductions
 * @returns Net rental result (can be negative)
 * 
 * @example
 * // -$8,300 cashflow - $12,500 depreciation
 * calculateNetRentalResult(-8300, 12500) // Returns -20,800
 */
export function calculateNetRentalResult(
  netCashflowPreTax: number,
  totalDepreciation: number
): number {
  return netCashflowPreTax - totalDepreciation;
}

/**
 * Calculate tax benefit or cost from property ownership
 * 
 * Formula: taxWithoutProperty − taxWithProperty
 * 
 * - Positive result = tax saving (property reduces overall tax)
 * - Negative result = additional tax (property increases overall tax)
 * 
 * @param taxWithoutProperty - Total tax if property not owned
 * @param taxWithProperty - Total tax with property ownership
 * @returns Tax benefit (positive) or cost (negative)
 * 
 * @example
 * // Without property: $39,000 tax; With property: $31,088 tax
 * calculateTaxBenefit(39000, 31088) // Returns 7,912 (saving)
 */
export function calculateTaxBenefit(
  taxWithoutProperty: number,
  taxWithProperty: number
): number {
  return taxWithoutProperty - taxWithProperty;
}

/**
 * Calculate tax scenario results for a given taxable income
 * 
 * @param taxableIncome - Taxable income for the scenario
 * @param marginalTaxRate - Marginal tax rate as decimal
 * @param medicareLevyRate - Medicare levy rate as decimal
 * @returns Complete tax scenario results
 */
export function calculateTaxScenario(
  taxableIncome: number,
  marginalTaxRate: number,
  medicareLevyRate: number
): TaxScenarioResults {
  const incomeTax = calculateIncomeTax(taxableIncome, marginalTaxRate);
  const medicareLevy = calculateMedicareLevy(taxableIncome, medicareLevyRate);
  const totalTax = calculateTotalTax(incomeTax, medicareLevy);

  return {
    taxableIncome,
    incomeTax,
    medicareLevy,
    totalTax,
  };
}

/**
 * Calculate rental P&L results
 * 
 * @param cashflow - Cashflow calculation results
 * @param depreciation - Depreciation calculation results
 * @returns Rental P&L results including gearing status
 */
export function calculateRentalPLResults(
  cashflow: CashflowResults,
  depreciation: DepreciationResults
): RentalPLResults {
  const netRentalResult = calculateNetRentalResult(
    cashflow.netCashflowPreTax,
    depreciation.totalDepreciation
  );

  return {
    netCashflowPreTax: cashflow.netCashflowPreTax,
    totalDepreciation: depreciation.totalDepreciation,
    netRentalResult,
    isNegativelyGeared: netRentalResult < 0,
  };
}

/**
 * Calculate complete tax impact comparison
 * 
 * Compares two scenarios:
 * 1. WITHOUT property - base taxable income only
 * 2. WITH property - base income + net rental result
 * 
 * @param baseTaxableIncome - Taxable income without property
 * @param netRentalResult - Net rental result from property
 * @param netCashflowPreTax - Pre-tax cashflow (for after-tax calculation)
 * @param marginalTaxRate - Marginal tax rate as decimal
 * @param medicareLevyRate - Medicare levy rate as decimal
 * @returns Complete tax impact comparison
 */
export function calculateTaxImpactResults(
  baseTaxableIncome: number,
  netRentalResult: number,
  netCashflowPreTax: number,
  marginalTaxRate: number,
  medicareLevyRate: number
): TaxImpactResults {
  // Scenario A: Without property
  const withoutProperty = calculateTaxScenario(
    baseTaxableIncome,
    marginalTaxRate,
    medicareLevyRate
  );

  // Scenario B: With property
  const taxableIncomeWithProperty = baseTaxableIncome + netRentalResult;
  const withProperty = calculateTaxScenario(
    taxableIncomeWithProperty,
    marginalTaxRate,
    medicareLevyRate
  );

  // Tax benefit/cost calculation
  const taxBenefit = calculateTaxBenefit(
    withoutProperty.totalTax,
    withProperty.totalTax
  );

  // After-tax cashflow = actual cash position + tax effect
  // If tax benefit is positive, it improves our cash position
  const afterTaxCashflow = netCashflowPreTax + taxBenefit;

  return {
    withoutProperty,
    withProperty,
    taxBenefit,
    afterTaxCashflow,
  };
}
