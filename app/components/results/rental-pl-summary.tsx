'use client';

/**
 * Rental P&L Summary Component
 * 
 * Displays rental profit/loss calculation:
 * - Net cashflow (pre-tax)
 * - Less: Depreciation
 * - Net rental result (taxable income/loss)
 * - Gearing status indicator
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, TOOLTIPS } from '@/app/lib/constants';
import type { RentalPLResults } from '@/app/lib/types';
import { BarChart3 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface RentalPLSummaryProps {
  results: RentalPLResults;
}

export function RentalPLSummary({ results }: RentalPLSummaryProps) {
  const gearingStatus = results.isNegativelyGeared ? 'Negative' : 'Positive';
  const gearingTooltip = results.isNegativelyGeared 
    ? TOOLTIPS.negativeGearing 
    : TOOLTIPS.positiveGearing;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Rental Profit & Loss
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Net Cashflow (Pre-Tax)</span>
          <span className={`font-mono font-medium ${
            results.netCashflowPreTax >= 0 ? 'text-emerald-700' : 'text-red-600'
          }`}>
            {formatCurrency(results.netCashflowPreTax)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600">Less: Depreciation</span>
          <span className="font-mono text-amber-700">
            ({formatCurrency(results.totalDepreciation)})
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
          <span className="font-semibold text-slate-800">Net Rental Result</span>
          <span className={`font-mono text-lg font-bold ${
            results.netRentalResult >= 0 ? 'text-emerald-700' : 'text-red-600'
          }`}>
            {formatCurrency(results.netRentalResult)}
          </span>
        </div>

        {/* Gearing status badge */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Gearing Status</span>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="max-w-xs text-sm bg-slate-900 text-white"
                >
                  <p>{gearingTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            results.isNegativelyGeared 
              ? 'bg-red-100 text-red-700' 
              : 'bg-emerald-100 text-emerald-700'
          }`}>
            {gearingStatus}ly Geared
          </span>
        </div>

        <p className="text-xs text-slate-500 pt-2">
          {results.isNegativelyGeared 
            ? 'This loss can offset your other taxable income, reducing your overall tax.'
            : 'This profit adds to your taxable income and increases your tax liability.'
          }
        </p>
      </CardContent>
    </Card>
  );
}

export default RentalPLSummary;
