'use client';

/**
 * Print Report Component
 * 
 * Print-friendly report view optimized for A4 paper.
 */

import { Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/app/lib/constants';
import type { PropertyModelInputs, PropertyModelResults } from '@/app/lib/types';

interface PrintReportProps {
  inputs: PropertyModelInputs;
  results: PropertyModelResults;
  onClose: () => void;
}

export function PrintReport({ inputs, results, onClose }: PrintReportProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto print:static print:overflow-visible">
      {/* Print controls - hidden when printing */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between no-print">
        <h2 className="text-lg font-semibold text-slate-800">Print Preview</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Report content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        {/* Header */}
        <div className="mb-8 pb-4 border-b-2 border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Rental Property Tax Analysis
              </h1>
              <p className="text-slate-600 mt-1">What-If Scenario Report</p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Generated: {new Date().toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}</p>
              <p>Time: {new Date().toLocaleTimeString('en-AU')}</p>
            </div>
          </div>
        </div>

        {/* Key Results Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Summary</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs text-slate-500 uppercase">Net Cashflow</p>
              <p className={`text-xl font-bold font-mono ${
                results.cashflow.netCashflowPreTax >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {formatCurrency(results.cashflow.netCashflowPreTax)}
              </p>
              <p className="text-xs text-slate-400">Annual pre-tax</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs text-slate-500 uppercase">Net Rental Result</p>
              <p className={`text-xl font-bold font-mono ${
                results.rentalPL.netRentalResult >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {formatCurrency(results.rentalPL.netRentalResult)}
              </p>
              <p className="text-xs text-slate-400">
                {results.rentalPL.isNegativelyGeared ? 'Negatively geared' : 'Positively geared'}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs text-slate-500 uppercase">Tax Impact</p>
              <p className={`text-xl font-bold font-mono ${
                results.taxImpact.taxBenefit >= 0 ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {results.taxImpact.taxBenefit >= 0 ? '+' : ''}{formatCurrency(results.taxImpact.taxBenefit)}
              </p>
              <p className="text-xs text-slate-400">
                {results.taxImpact.taxBenefit >= 0 ? 'Tax saving' : 'Additional tax'}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-slate-500 uppercase">After-Tax Position</p>
              <p className={`text-xl font-bold font-mono ${
                results.taxImpact.afterTaxCashflow >= 0 ? 'text-blue-700' : 'text-red-600'
              }`}>
                {formatCurrency(results.taxImpact.afterTaxCashflow)}
              </p>
              <p className="text-xs text-slate-400">Annual cash position</p>
            </div>
          </div>
        </div>

        {/* Assumptions */}
        <div className="mb-8 print-break-before">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Assumptions</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Personal */}
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Personal Details</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Base Taxable Income</td>
                    <td className="py-1 text-right font-mono">{formatCurrency(inputs.personal.baseTaxableIncome)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Ownership</td>
                    <td className="py-1 text-right font-mono">{inputs.personal.ownershipPercentage}%</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Marginal Tax Rate</td>
                    <td className="py-1 text-right font-mono">{(inputs.personal.marginalTaxRate * 100).toFixed(0)}%</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-600">Medicare Levy</td>
                    <td className="py-1 text-right font-mono">{(inputs.personal.medicareLevyRate * 100).toFixed(1)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Property */}
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Property & Loan</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Purchase Price</td>
                    <td className="py-1 text-right font-mono">{formatCurrency(inputs.propertyPurchase.purchasePrice)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Loan Amount</td>
                    <td className="py-1 text-right font-mono">{formatCurrency(inputs.propertyPurchase.loanAmount)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Interest Rate</td>
                    <td className="py-1 text-right font-mono">{(inputs.propertyPurchase.interestRate * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-600">Loan Type</td>
                    <td className="py-1 text-right font-mono">{inputs.propertyPurchase.isInterestOnly ? 'Interest Only' : 'P&I'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Rental */}
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Rental Income</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Weekly Rent</td>
                    <td className="py-1 text-right font-mono">{formatCurrency(inputs.rentalIncome.weeklyRent)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Vacancy Weeks</td>
                    <td className="py-1 text-right font-mono">{inputs.rentalIncome.vacancyWeeksPerYear} weeks</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-600">Annual Rent</td>
                    <td className="py-1 text-right font-mono font-medium">{formatCurrency(results.cashflow.grossRentalIncome)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Depreciation */}
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Depreciation</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Capital Works (Div 43)</td>
                    <td className="py-1 text-right font-mono">{formatCurrency(results.depreciation.capitalWorksDeduction)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1 text-slate-600">Plant & Equipment (Div 40)</td>
                    <td className="py-1 text-right font-mono">{formatCurrency(results.depreciation.plantEquipmentDeduction)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-600 font-medium">Total Depreciation</td>
                    <td className="py-1 text-right font-mono font-medium">{formatCurrency(results.depreciation.totalDepreciation)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tax Comparison */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tax Impact Comparison</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-2 px-4 text-left font-medium text-slate-700">Item</th>
                <th className="py-2 px-4 text-right font-medium text-slate-700">Without Property</th>
                <th className="py-2 px-4 text-right font-medium text-slate-700">With Property</th>
                <th className="py-2 px-4 text-right font-medium text-slate-700">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 text-slate-600">Taxable Income</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withoutProperty.taxableIncome)}</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withProperty.taxableIncome)}</td>
                <td className="py-2 px-4 text-right font-mono text-slate-500">
                  {formatCurrency(results.taxImpact.withProperty.taxableIncome - results.taxImpact.withoutProperty.taxableIncome)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 text-slate-600">Income Tax</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withoutProperty.incomeTax)}</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withProperty.incomeTax)}</td>
                <td className="py-2 px-4 text-right font-mono text-emerald-600">
                  {formatCurrency(results.taxImpact.withProperty.incomeTax - results.taxImpact.withoutProperty.incomeTax)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 px-4 text-slate-600">Medicare Levy</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withoutProperty.medicareLevy)}</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withProperty.medicareLevy)}</td>
                <td className="py-2 px-4 text-right font-mono text-emerald-600">
                  {formatCurrency(results.taxImpact.withProperty.medicareLevy - results.taxImpact.withoutProperty.medicareLevy)}
                </td>
              </tr>
              <tr className="bg-slate-50 font-medium">
                <td className="py-2 px-4 text-slate-800">Total Tax</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withoutProperty.totalTax)}</td>
                <td className="py-2 px-4 text-right font-mono">{formatCurrency(results.taxImpact.withProperty.totalTax)}</td>
                <td className={`py-2 px-4 text-right font-mono ${results.taxImpact.taxBenefit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {results.taxImpact.taxBenefit >= 0 ? '+' : ''}{formatCurrency(results.taxImpact.taxBenefit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-xs text-slate-500">
          <p className="font-medium mb-2">Disclaimer</p>
          <p>
            This report is for educational and planning purposes only. It uses simplified marginal tax rate 
            calculations and should not be relied upon for tax reporting or financial decisions. Results are 
            indicative only and may not reflect actual tax outcomes. Always consult a registered tax agent 
            or financial advisor for personalised advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrintReport;
