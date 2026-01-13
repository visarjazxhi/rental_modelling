'use client';

/**
 * Depreciation Summary Component
 * 
 * Displays depreciation breakdown:
 * - Capital Works (Division 43) - 2.5%
 * - Plant & Equipment (Division 40)
 * - Total depreciation
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/constants';
import type { DepreciationResults } from '@/app/lib/types';
import { TrendingDown } from 'lucide-react';

interface DepreciationSummaryProps {
  results: DepreciationResults;
}

export function DepreciationSummary({ results }: DepreciationSummaryProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <TrendingDown className="h-5 w-5 text-amber-600" />
          Depreciation Deductions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-slate-600">Capital Works</span>
            <span className="text-xs text-slate-400 ml-1">(Div 43 @ 2.5%)</span>
          </div>
          <span className="font-mono font-medium text-amber-700">
            {formatCurrency(results.capitalWorksDeduction)}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-slate-600">Plant & Equipment</span>
            <span className="text-xs text-slate-400 ml-1">(Div 40)</span>
          </div>
          <span className="font-mono font-medium text-amber-700">
            {formatCurrency(results.plantEquipmentDeduction)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
          <span className="font-semibold text-slate-800">Total Depreciation</span>
          <span className="font-mono text-lg font-bold text-amber-700">
            {formatCurrency(results.totalDepreciation)}
          </span>
        </div>

        <p className="text-xs text-slate-500 pt-2">
          Depreciation is a non-cash deduction that reduces taxable income 
          without affecting actual cashflow.
        </p>
      </CardContent>
    </Card>
  );
}

export default DepreciationSummary;
