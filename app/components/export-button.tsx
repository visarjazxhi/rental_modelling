'use client';

/**
 * Export Button Component
 * 
 * Exports all inputs and results to CSV format.
 */

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { PropertyModelInputs, PropertyModelResults } from '@/app/lib/types';

interface ExportButtonProps {
  inputs: PropertyModelInputs;
  results: PropertyModelResults;
  viewMode: 'annual' | 'monthly';
}

/**
 * Format number for CSV (no currency symbol, proper decimals)
 */
function formatForCSV(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format currency for CSV with AUD symbol
 */
function formatCurrencyCSV(value: number): string {
  return `$${value.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Escape CSV value
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function ExportButton({ inputs, results, viewMode }: ExportButtonProps) {
  const handleExport = () => {
    const divisor = viewMode === 'monthly' ? 12 : 1;
    const periodLabel = viewMode === 'monthly' ? 'Monthly' : 'Annual';
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Build CSV content
    const rows: string[][] = [
      ['Rental Property Tax Model Export'],
      [`Generated: ${new Date().toLocaleString('en-AU')}`],
      [`View Mode: ${periodLabel}`],
      [],
      ['=== ASSUMPTIONS ==='],
      [],
      ['Personal Details'],
      ['Base Taxable Income', formatCurrencyCSV(inputs.personal.baseTaxableIncome)],
      ['Ownership Percentage', `${inputs.personal.ownershipPercentage}%`],
      ['Marginal Tax Rate', `${(inputs.personal.marginalTaxRate * 100).toFixed(0)}%`],
      ['Medicare Levy Rate', `${(inputs.personal.medicareLevyRate * 100).toFixed(1)}%`],
      [],
      ['Property Purchase'],
      ['Purchase Price', formatCurrencyCSV(inputs.propertyPurchase.purchasePrice)],
      ['Loan Amount', formatCurrencyCSV(inputs.propertyPurchase.loanAmount)],
      ['Interest Rate', `${(inputs.propertyPurchase.interestRate * 100).toFixed(2)}%`],
      ['Loan Term', `${inputs.propertyPurchase.loanTermYears} years`],
      ['Interest Only', inputs.propertyPurchase.isInterestOnly ? 'Yes' : 'No'],
      [],
      ['Rental Income'],
      ['Weekly Rent', formatCurrencyCSV(inputs.rentalIncome.weeklyRent)],
      ['Vacancy Weeks/Year', inputs.rentalIncome.vacancyWeeksPerYear.toString()],
      [],
      ['Operating Expenses (Annual)'],
      ['Property Management', formatCurrencyCSV(inputs.operatingExpenses.propertyManagement)],
      ['Council Rates', formatCurrencyCSV(inputs.operatingExpenses.councilRates)],
      ['Water Rates', formatCurrencyCSV(inputs.operatingExpenses.waterRates)],
      ['Insurance', formatCurrencyCSV(inputs.operatingExpenses.insurance)],
      ['Repairs & Maintenance', formatCurrencyCSV(inputs.operatingExpenses.repairsMaintenance)],
      ['Body Corporate', formatCurrencyCSV(inputs.operatingExpenses.bodyCorporate)],
      ['Other Expenses', formatCurrencyCSV(inputs.operatingExpenses.otherExpenses)],
      [],
      ['Depreciation'],
      ['Construction Value (Div 43)', formatCurrencyCSV(inputs.depreciation.constructionValue)],
      ['Plant & Equipment (Div 40)', formatCurrencyCSV(inputs.depreciation.plantEquipmentAnnual)],
      [],
      ['=== RESULTS ==='],
      [],
      [`Rental Cashflow (${periodLabel})`],
      ['Gross Rental Income', formatCurrencyCSV(results.cashflow.grossRentalIncome / divisor)],
      ['Total Operating Expenses', formatCurrencyCSV(results.cashflow.totalOperatingExpenses / divisor)],
      ['Interest Expense', formatCurrencyCSV(results.cashflow.interestExpense / divisor)],
      ['Net Cashflow (Pre-Tax)', formatCurrencyCSV(results.cashflow.netCashflowPreTax / divisor)],
      [],
      [`Depreciation (${periodLabel})`],
      ['Capital Works (Div 43)', formatCurrencyCSV(results.depreciation.capitalWorksDeduction / divisor)],
      ['Plant & Equipment (Div 40)', formatCurrencyCSV(results.depreciation.plantEquipmentDeduction / divisor)],
      ['Total Depreciation', formatCurrencyCSV(results.depreciation.totalDepreciation / divisor)],
      [],
      [`Rental P&L (${periodLabel})`],
      ['Net Cashflow (Pre-Tax)', formatCurrencyCSV(results.rentalPL.netCashflowPreTax / divisor)],
      ['Less: Depreciation', formatCurrencyCSV(results.rentalPL.totalDepreciation / divisor)],
      ['Net Rental Result', formatCurrencyCSV(results.rentalPL.netRentalResult / divisor)],
      ['Gearing Status', results.rentalPL.isNegativelyGeared ? 'Negatively Geared' : 'Positively Geared'],
      [],
      ['Tax Impact (Annual)'],
      ['', 'Without Property', 'With Property'],
      ['Taxable Income', formatCurrencyCSV(results.taxImpact.withoutProperty.taxableIncome), formatCurrencyCSV(results.taxImpact.withProperty.taxableIncome)],
      ['Income Tax', formatCurrencyCSV(results.taxImpact.withoutProperty.incomeTax), formatCurrencyCSV(results.taxImpact.withProperty.incomeTax)],
      ['Medicare Levy', formatCurrencyCSV(results.taxImpact.withoutProperty.medicareLevy), formatCurrencyCSV(results.taxImpact.withProperty.medicareLevy)],
      ['Total Tax', formatCurrencyCSV(results.taxImpact.withoutProperty.totalTax), formatCurrencyCSV(results.taxImpact.withProperty.totalTax)],
      [],
      ['Summary'],
      ['Tax Benefit/Cost', formatCurrencyCSV(results.taxImpact.taxBenefit)],
      ['After-Tax Cashflow', formatCurrencyCSV(results.taxImpact.afterTaxCashflow)],
    ];

    // Convert to CSV string
    const csvContent = rows
      .map(row => row.map(cell => escapeCSV(cell)).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rental-tax-model-${timestamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </TooltipTrigger>
        <TooltipContent>Export all data to CSV/Excel</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ExportButton;
