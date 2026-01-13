/**
 * Rental Income and Cashflow Calculations
 * Pure functions for calculating rental property cashflow
 * 
 * All calculations preserve full precision internally.
 * Rounding should only be applied at display layer.
 */

import { WEEKS_PER_YEAR } from '../constants';
import type { 
  RentalIncomeInputs, 
  OperatingExpensesInputs, 
  CashflowResults 
} from '../types';

/**
 * Calculate annual gross rental income
 * 
 * Formula: (52 - vacancyWeeks) × weeklyRent × ownershipPercentage
 * 
 * @param weeklyRent - Weekly rent amount in AUD
 * @param vacancyWeeks - Expected vacancy weeks per year
 * @param ownershipPct - Ownership percentage as decimal (e.g., 1.0 = 100%)
 * @returns Annual gross rental income in AUD
 * 
 * @example
 * // $550/week, 2 weeks vacancy, 100% ownership
 * calculateGrossRent(550, 2, 1.0) // Returns 27,500
 */
export function calculateGrossRent(
  weeklyRent: number,
  vacancyWeeks: number,
  ownershipPct: number
): number {
  const rentableWeeks = WEEKS_PER_YEAR - vacancyWeeks;
  return rentableWeeks * weeklyRent * ownershipPct;
}

/**
 * Calculate annual interest expense on investment loan
 * 
 * Formula: loanAmount × interestRate × ownershipPercentage
 * 
 * Note: This is a simplified annual calculation. For more precise
 * calculations, monthly compounding could be considered.
 * 
 * @param loanAmount - Total loan amount in AUD
 * @param interestRate - Annual interest rate as decimal (e.g., 0.06 = 6%)
 * @param ownershipPct - Ownership percentage as decimal (e.g., 1.0 = 100%)
 * @returns Annual interest expense in AUD
 * 
 * @example
 * // $480,000 loan at 6%, 100% ownership
 * calculateInterestExpense(480000, 0.06, 1.0) // Returns 28,800
 */
export function calculateInterestExpense(
  loanAmount: number,
  interestRate: number,
  ownershipPct: number
): number {
  return loanAmount * interestRate * ownershipPct;
}

/**
 * Calculate total annual operating expenses
 * 
 * All operating expenses are summed and adjusted for ownership percentage.
 * These are cash expenses (excludes non-cash items like depreciation).
 * 
 * @param expenses - Operating expenses inputs
 * @param ownershipPct - Ownership percentage as decimal
 * @returns Total annual operating expenses in AUD
 */
export function calculateTotalOperatingExpenses(
  expenses: OperatingExpensesInputs,
  ownershipPct: number
): number {
  const total = 
    expenses.propertyManagement +
    expenses.councilRates +
    expenses.waterRates +
    expenses.insurance +
    expenses.repairsMaintenance +
    expenses.bodyCorporate +
    expenses.otherExpenses;
  
  return total * ownershipPct;
}

/**
 * Calculate net cashflow before tax
 * 
 * Formula: grossRent - totalCashExpenses - interestExpense
 * 
 * This represents the actual cash position before considering:
 * - Non-cash deductions (depreciation)
 * - Tax implications
 * 
 * @param grossRent - Annual gross rental income
 * @param totalExpenses - Total annual operating expenses
 * @param interestExpense - Annual interest expense
 * @returns Net cashflow before tax (can be negative)
 * 
 * @example
 * // $27,500 rent - $7,000 expenses - $28,800 interest
 * calculateNetCashflowPreTax(27500, 7000, 28800) // Returns -8,300
 */
export function calculateNetCashflowPreTax(
  grossRent: number,
  totalExpenses: number,
  interestExpense: number
): number {
  return grossRent - totalExpenses - interestExpense;
}

/**
 * Calculate complete cashflow results
 * 
 * Aggregates all cashflow calculations into a single result object.
 * 
 * @param rentalIncome - Rental income inputs
 * @param operatingExpenses - Operating expense inputs
 * @param loanAmount - Total loan amount
 * @param interestRate - Annual interest rate as decimal
 * @param ownershipPct - Ownership percentage as decimal
 * @returns Complete cashflow results
 */
export function calculateCashflowResults(
  rentalIncome: RentalIncomeInputs,
  operatingExpenses: OperatingExpensesInputs,
  loanAmount: number,
  interestRate: number,
  ownershipPct: number
): CashflowResults {
  const grossRentalIncome = calculateGrossRent(
    rentalIncome.weeklyRent,
    rentalIncome.vacancyWeeksPerYear,
    ownershipPct
  );

  const totalOperatingExpenses = calculateTotalOperatingExpenses(
    operatingExpenses,
    ownershipPct
  );

  const interestExpense = calculateInterestExpense(
    loanAmount,
    interestRate,
    ownershipPct
  );

  const netCashflowPreTax = calculateNetCashflowPreTax(
    grossRentalIncome,
    totalOperatingExpenses,
    interestExpense
  );

  return {
    grossRentalIncome,
    totalOperatingExpenses,
    interestExpense,
    netCashflowPreTax,
  };
}
