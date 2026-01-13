'use client';

/**
 * Property Model State Management Hook
 * 
 * Manages all form state and computed values for the rental property tax model.
 * Uses React state with useMemo for derived calculations.
 */

import { useState, useMemo, useCallback } from 'react';
import { z } from 'zod';
import { 
  calculateCashflowResults,
  calculateDepreciationResults,
  calculateRentalPLResults,
  calculateTaxImpactResults,
} from '../calculations';
import { 
  DEFAULT_INPUTS,
  type PropertyModelInputs,
  type PropertyModelResults,
  type ValidationState,
  type ValidationError,
  type ValidationWarning,
} from '../types';
import { VALIDATION_LIMITS } from '../constants';

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

const personalSchema = z.object({
  baseTaxableIncome: z.number().min(0, 'Income cannot be negative'),
  ownershipPercentage: z.number()
    .min(VALIDATION_LIMITS.MIN_OWNERSHIP_PCT, 'Ownership must be at least 0%')
    .max(VALIDATION_LIMITS.MAX_OWNERSHIP_PCT, 'Ownership cannot exceed 100%'),
  marginalTaxRate: z.number()
    .min(VALIDATION_LIMITS.MIN_MARGINAL_RATE, 'Tax rate cannot be negative')
    .max(VALIDATION_LIMITS.MAX_MARGINAL_RATE, 'Tax rate cannot exceed 47%'),
  medicareLevyRate: z.number()
    .min(VALIDATION_LIMITS.MIN_MEDICARE_RATE, 'Medicare rate cannot be negative')
    .max(VALIDATION_LIMITS.MAX_MEDICARE_RATE, 'Medicare rate cannot exceed 3.5%'),
});

const propertyPurchaseSchema = z.object({
  purchasePrice: z.number().min(0, 'Purchase price cannot be negative'),
  loanAmount: z.number().min(0, 'Loan amount cannot be negative'),
  interestRate: z.number()
    .min(VALIDATION_LIMITS.MIN_INTEREST_RATE, 'Interest rate cannot be negative')
    .max(VALIDATION_LIMITS.MAX_INTEREST_RATE, 'Interest rate seems too high'),
  loanTermYears: z.number()
    .min(VALIDATION_LIMITS.MIN_LOAN_TERM, 'Loan term must be at least 1 year')
    .max(VALIDATION_LIMITS.MAX_LOAN_TERM, 'Loan term cannot exceed 40 years'),
  isInterestOnly: z.boolean(),
  settlementDate: z.string(),
});

const rentalIncomeSchema = z.object({
  weeklyRent: z.number()
    .min(VALIDATION_LIMITS.MIN_WEEKLY_RENT, 'Weekly rent cannot be negative')
    .max(VALIDATION_LIMITS.MAX_WEEKLY_RENT, 'Weekly rent seems too high'),
  vacancyWeeksPerYear: z.number()
    .min(VALIDATION_LIMITS.MIN_VACANCY_WEEKS, 'Vacancy weeks cannot be negative')
    .max(VALIDATION_LIMITS.MAX_VACANCY_WEEKS, 'Vacancy weeks cannot exceed 52'),
});

const operatingExpensesSchema = z.object({
  propertyManagement: z.number().min(0, 'Cannot be negative'),
  councilRates: z.number().min(0, 'Cannot be negative'),
  waterRates: z.number().min(0, 'Cannot be negative'),
  insurance: z.number().min(0, 'Cannot be negative'),
  repairsMaintenance: z.number().min(0, 'Cannot be negative'),
  bodyCorporate: z.number().min(0, 'Cannot be negative'),
  otherExpenses: z.number().min(0, 'Cannot be negative'),
  otherExpensesDescription: z.string(),
});

const depreciationSchema = z.object({
  constructionValue: z.number().min(0, 'Cannot be negative'),
  plantEquipmentAnnual: z.number().min(0, 'Cannot be negative'),
});

const propertyModelSchema = z.object({
  personal: personalSchema,
  propertyPurchase: propertyPurchaseSchema,
  rentalIncome: rentalIncomeSchema,
  operatingExpenses: operatingExpensesSchema,
  depreciation: depreciationSchema,
});

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateInputs(inputs: PropertyModelInputs): ValidationState {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Run Zod validation
  const result = propertyModelSchema.safeParse(inputs);
  
  if (!result.success) {
    result.error.issues.forEach((err) => {
      errors.push({
        field: err.path.join('.'),
        message: err.message,
      });
    });
  }

  // Additional business logic validations
  
  // Warn if loan exceeds purchase price
  if (inputs.propertyPurchase.loanAmount > inputs.propertyPurchase.purchasePrice) {
    warnings.push({
      field: 'propertyPurchase.loanAmount',
      message: 'Loan amount exceeds purchase price',
    });
  }

  // Warn if construction value exceeds purchase price
  if (inputs.depreciation.constructionValue > inputs.propertyPurchase.purchasePrice) {
    warnings.push({
      field: 'depreciation.constructionValue',
      message: 'Construction value exceeds purchase price (check land value)',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function generateWarnings(
  inputs: PropertyModelInputs, 
  results: PropertyModelResults
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Warn if rental loss exceeds base income (very high negative gearing)
  if (results.rentalPL.netRentalResult < 0) {
    const lossAmount = Math.abs(results.rentalPL.netRentalResult);
    if (lossAmount > inputs.personal.baseTaxableIncome * 0.5) {
      warnings.push({
        field: 'rentalPL.netRentalResult',
        message: 'Rental loss exceeds 50% of your base income - high negative gearing',
      });
    }
  }

  // Warn if no depreciation claimed
  if (results.depreciation.totalDepreciation === 0) {
    warnings.push({
      field: 'depreciation',
      message: 'No depreciation claimed - consider getting a quantity surveyor report',
    });
  }

  return warnings;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export interface UsePropertyModelReturn {
  /** Current input values */
  inputs: PropertyModelInputs;
  /** Calculated results */
  results: PropertyModelResults;
  /** Validation state */
  validation: ValidationState;
  /** Result-based warnings */
  warnings: ValidationWarning[];
  /** Update a specific input section */
  updateInputs: <K extends keyof PropertyModelInputs>(
    section: K,
    values: Partial<PropertyModelInputs[K]>
  ) => void;
  /** Reset all inputs to defaults */
  resetInputs: () => void;
  /** Set complete input state (for loading scenarios) */
  setInputs: (inputs: PropertyModelInputs) => void;
}

export function usePropertyModel(
  initialInputs: PropertyModelInputs = DEFAULT_INPUTS
): UsePropertyModelReturn {
  const [inputs, setInputsState] = useState<PropertyModelInputs>(initialInputs);

  // Memoized validation
  const validation = useMemo(() => validateInputs(inputs), [inputs]);

  // Convert ownership percentage to decimal for calculations
  const ownershipDecimal = inputs.personal.ownershipPercentage / 100;

  // Memoized calculation results
  const results = useMemo((): PropertyModelResults => {
    // Calculate cashflow
    const cashflow = calculateCashflowResults(
      inputs.rentalIncome,
      inputs.operatingExpenses,
      inputs.propertyPurchase.loanAmount,
      inputs.propertyPurchase.interestRate,
      ownershipDecimal
    );

    // Calculate depreciation
    const depreciation = calculateDepreciationResults(
      inputs.depreciation,
      ownershipDecimal
    );

    // Calculate rental P&L
    const rentalPL = calculateRentalPLResults(cashflow, depreciation);

    // Calculate tax impact
    const taxImpact = calculateTaxImpactResults(
      inputs.personal.baseTaxableIncome,
      rentalPL.netRentalResult,
      cashflow.netCashflowPreTax,
      inputs.personal.marginalTaxRate,
      inputs.personal.medicareLevyRate
    );

    return {
      cashflow,
      depreciation,
      rentalPL,
      taxImpact,
    };
  }, [inputs, ownershipDecimal]);

  // Generate result-based warnings
  const warnings = useMemo(
    () => generateWarnings(inputs, results),
    [inputs, results]
  );

  // Update handler for partial updates to a section
  const updateInputs = useCallback(<K extends keyof PropertyModelInputs>(
    section: K,
    values: Partial<PropertyModelInputs[K]>
  ) => {
    setInputsState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...values,
      },
    }));
  }, []);

  // Reset to defaults
  const resetInputs = useCallback(() => {
    setInputsState(DEFAULT_INPUTS);
  }, []);

  // Set complete inputs (for loading saved scenarios)
  const setInputs = useCallback((newInputs: PropertyModelInputs) => {
    setInputsState(newInputs);
  }, []);

  return {
    inputs,
    results,
    validation,
    warnings,
    updateInputs,
    resetInputs,
    setInputs,
  };
}

export default usePropertyModel;
