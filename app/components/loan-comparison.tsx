'use client';

/**
 * Loan Comparison Component
 * 
 * Displays P&I vs Interest-Only loan comparison.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/constants';
import { calculateLoanComparison, calculateAmortizationMilestones } from '@/app/lib/calculations/loan-calculations';
import { CreditCard, TrendingDown, TrendingUp, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LoanComparisonProps {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  isInterestOnly: boolean;
  viewMode: 'annual' | 'monthly';
}

export function LoanComparison({ 
  loanAmount, 
  interestRate, 
  loanTermYears,
  isInterestOnly,
  viewMode,
}: LoanComparisonProps) {
  const comparison = calculateLoanComparison(loanAmount, interestRate, loanTermYears);
  const milestones = calculateAmortizationMilestones(loanAmount, interestRate, loanTermYears);
  
  const divisor = viewMode === 'monthly' ? 1 : 12;
  const periodLabel = viewMode === 'monthly' ? 'month' : 'year';

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <CreditCard className="h-5 w-5 text-purple-600" />
          Loan Repayment Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* P&I vs I/O comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* P&I Column */}
          <div className={`p-4 rounded-lg ${!isInterestOnly ? 'bg-purple-50 border-2 border-purple-200' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Principal & Interest</span>
              {!isInterestOnly && (
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">
              {formatCurrency(comparison.monthlyPI / divisor)}
            </p>
            <p className="text-xs text-slate-500">per {periodLabel}</p>
          </div>

          {/* I/O Column */}
          <div className={`p-4 rounded-lg ${isInterestOnly ? 'bg-purple-50 border-2 border-purple-200' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Interest Only</span>
              {isInterestOnly && (
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <p className="text-2xl font-bold font-mono text-slate-900">
              {formatCurrency(comparison.monthlyIO / divisor)}
            </p>
            <p className="text-xs text-slate-500">per {periodLabel}</p>
          </div>
        </div>

        {/* Savings/Cost with I/O */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Cash Savings with Interest Only</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Interest-only loans have lower repayments but you don&apos;t reduce the principal. 
                  Total interest paid over the term will be higher.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xl font-bold font-mono text-amber-700">
            {formatCurrency(comparison.monthlySavingsIO / divisor)}
          </p>
          <p className="text-xs text-amber-600">lower repayment per {periodLabel}</p>
        </div>

        {/* Total interest comparison */}
        <div className="border-t border-slate-200 pt-4 space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Interest Over {loanTermYears} Years
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">P&I Loan Total Interest</span>
            <span className="font-mono text-slate-700">{formatCurrency(comparison.totalInterestPI)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">I/O Loan Total Interest</span>
            <span className="font-mono text-slate-700">{formatCurrency(comparison.totalInterestIO)}</span>
          </div>
          
          <div className="flex justify-between items-center bg-red-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">Extra Interest (I/O)</span>
            </div>
            <span className="font-mono font-bold text-red-700">
              +{formatCurrency(comparison.extraInterestIO)}
            </span>
          </div>
        </div>

        {/* P&I Amortization milestones */}
        {milestones.length > 0 && (
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              P&I Loan Progress (Principal Paid)
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {milestones.slice(0, 4).map((milestone) => (
                <div 
                  key={milestone.year}
                  className="flex-shrink-0 bg-slate-50 rounded-lg p-3 min-w-[100px]"
                >
                  <p className="text-xs text-slate-500">Year {milestone.year}</p>
                  <p className="font-mono text-sm font-medium text-emerald-600">
                    {formatCurrency(milestone.principalPaid)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {((milestone.principalPaid / loanAmount) * 100).toFixed(0)}% equity
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LoanComparison;
