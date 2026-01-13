/**
 * Calculation Engine Index
 * Re-exports all calculation functions for convenient importing
 */

// Rental/Cashflow calculations
export {
  calculateGrossRent,
  calculateInterestExpense,
  calculateTotalOperatingExpenses,
  calculateNetCashflowPreTax,
  calculateCashflowResults,
} from './rental-calculations';

// Depreciation calculations
export {
  calculateCapitalWorksDeduction,
  calculatePlantEquipmentDeduction,
  calculateTotalDepreciation,
  calculateDepreciationResults,
} from './depreciation-calculations';

// Tax calculations
export {
  calculateIncomeTax,
  calculateMedicareLevy,
  calculateTotalTax,
  calculateNetRentalResult,
  calculateTaxBenefit,
  calculateTaxScenario,
  calculateRentalPLResults,
  calculateTaxImpactResults,
} from './tax-calculations';

// Re-export types for convenience
export type {
  PropertyModelInputs,
  PropertyModelResults,
  CashflowResults,
  DepreciationResults,
  RentalPLResults,
  TaxScenarioResults,
  TaxImpactResults,
} from '../types';
