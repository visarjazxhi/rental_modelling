/**
 * Depreciation Calculations
 * Pure functions for calculating Division 43 and Division 40 depreciation
 * 
 * Division 43 - Capital Works Deductions:
 *   Buildings constructed after 15 September 1987 can claim 2.5% per year
 *   of the original construction cost (excluding land value).
 * 
 * Division 40 - Plant and Equipment:
 *   Depreciating assets within the property (appliances, carpets, blinds, etc.)
 *   can be depreciated over their effective life.
 * 
 * Note: This is a planning model using annual estimates. A quantity surveyor
 * can provide detailed depreciation schedules for actual tax returns.
 */

import { CAPITAL_WORKS_RATE } from '../constants';
import type { DepreciationInputs, DepreciationResults } from '../types';

/**
 * Calculate Division 43 Capital Works deduction
 * 
 * Formula: constructionValue × 2.5% × ownershipPercentage
 * 
 * This deduction applies to the original construction cost of the building,
 * not the land value or purchase price.
 * 
 * @param constructionValue - Original construction cost in AUD
 * @param ownershipPct - Ownership percentage as decimal (e.g., 1.0 = 100%)
 * @returns Annual capital works deduction in AUD
 * 
 * @example
 * // $300,000 construction value, 100% ownership
 * calculateCapitalWorksDeduction(300000, 1.0) // Returns 7,500
 */
export function calculateCapitalWorksDeduction(
  constructionValue: number,
  ownershipPct: number
): number {
  return constructionValue * CAPITAL_WORKS_RATE * ownershipPct;
}

/**
 * Calculate Division 40 Plant & Equipment deduction
 * 
 * This model uses a user-provided annual estimate. In practice, each asset
 * has its own depreciation schedule based on:
 * - Diminishing value method, OR
 * - Prime cost method
 * 
 * A quantity surveyor's report will provide detailed calculations.
 * 
 * @param annualEstimate - User's estimated annual P&E depreciation in AUD
 * @param ownershipPct - Ownership percentage as decimal
 * @returns Annual plant & equipment deduction in AUD
 * 
 * @example
 * // $5,000 annual estimate, 100% ownership
 * calculatePlantEquipmentDeduction(5000, 1.0) // Returns 5,000
 */
export function calculatePlantEquipmentDeduction(
  annualEstimate: number,
  ownershipPct: number
): number {
  return annualEstimate * ownershipPct;
}

/**
 * Calculate total annual depreciation
 * 
 * Formula: capitalWorksDeduction + plantEquipmentDeduction
 * 
 * Both components should already be adjusted for ownership percentage.
 * 
 * @param capitalWorks - Capital works deduction (Division 43)
 * @param plantEquipment - Plant & equipment deduction (Division 40)
 * @returns Total annual depreciation in AUD
 */
export function calculateTotalDepreciation(
  capitalWorks: number,
  plantEquipment: number
): number {
  return capitalWorks + plantEquipment;
}

/**
 * Calculate complete depreciation results
 * 
 * Aggregates all depreciation calculations into a single result object.
 * 
 * @param depreciation - Depreciation input values
 * @param ownershipPct - Ownership percentage as decimal
 * @returns Complete depreciation results
 */
export function calculateDepreciationResults(
  depreciation: DepreciationInputs,
  ownershipPct: number
): DepreciationResults {
  const capitalWorksDeduction = calculateCapitalWorksDeduction(
    depreciation.constructionValue,
    ownershipPct
  );

  const plantEquipmentDeduction = calculatePlantEquipmentDeduction(
    depreciation.plantEquipmentAnnual,
    ownershipPct
  );

  const totalDepreciation = calculateTotalDepreciation(
    capitalWorksDeduction,
    plantEquipmentDeduction
  );

  return {
    capitalWorksDeduction,
    plantEquipmentDeduction,
    totalDepreciation,
  };
}
