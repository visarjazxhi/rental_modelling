'use client';

/**
 * Tax Comparison Table Component
 * 
 * Displays side-by-side comparison:
 * - Without property scenario
 * - With property scenario
 * - Tax benefit/cost calculation
 * - After-tax cashflow position
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, TOOLTIPS } from '@/app/lib/constants';
import type { TaxImpactResults, RentalPLResults } from '@/app/lib/types';
import { Scale, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TaxComparisonTableProps {
  results: TaxImpactResults;
  rentalPL: RentalPLResults;
}

export function TaxComparisonTable({ results, rentalPL }: TaxComparisonTableProps) {
  const isTaxSaving = results.taxBenefit > 0;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <div className="p-1.5 rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
            <Scale className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Tax Impact Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comparison Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold text-foreground">Scenario</TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Without Property
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  With Property
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground">Taxable Income</TableCell>
                <TableCell className="text-right font-mono text-foreground">
                  {formatCurrency(results.withoutProperty.taxableIncome)}
                </TableCell>
                <TableCell className="text-right font-mono text-foreground">
                  {formatCurrency(results.withProperty.taxableIncome)}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground">Income Tax</TableCell>
                <TableCell className="text-right font-mono text-red-600 dark:text-red-400">
                  {formatCurrency(results.withoutProperty.incomeTax)}
                </TableCell>
                <TableCell className="text-right font-mono text-red-600 dark:text-red-400">
                  {formatCurrency(results.withProperty.incomeTax)}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-muted/30">
                <TableCell className="text-muted-foreground">Medicare Levy</TableCell>
                <TableCell className="text-right font-mono text-red-600 dark:text-red-400">
                  {formatCurrency(results.withoutProperty.medicareLevy)}
                </TableCell>
                <TableCell className="text-right font-mono text-red-600 dark:text-red-400">
                  {formatCurrency(results.withProperty.medicareLevy)}
                </TableCell>
              </TableRow>
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell className="text-foreground">Total Tax</TableCell>
                <TableCell className="text-right font-mono text-red-700 dark:text-red-400">
                  {formatCurrency(results.withoutProperty.totalTax)}
                </TableCell>
                <TableCell className="text-right font-mono text-red-700 dark:text-red-400">
                  {formatCurrency(results.withProperty.totalTax)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Tax Benefit/Cost */}
        <div className={`rounded-xl p-4 ${
          isTaxSaving 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isTaxSaving 
                  ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                  : 'bg-red-100 dark:bg-red-900/50'
              }`}>
                {isTaxSaving ? (
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-foreground">
                    {isTaxSaving ? 'Tax Saving' : 'Additional Tax'}
                  </span>
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="max-w-xs text-sm bg-popover text-popover-foreground border-border"
                      >
                        <p>{TOOLTIPS.taxBenefit}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isTaxSaving 
                    ? 'Rental property reduces your overall tax'
                    : 'Rental property increases your overall tax'
                  }
                </p>
              </div>
            </div>
            <span className={`font-mono text-2xl font-bold ${
              isTaxSaving ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {isTaxSaving ? '+' : ''}{formatCurrency(Math.abs(results.taxBenefit))}
            </span>
          </div>
        </div>

        {/* After-tax Position */}
        <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-foreground">After-Tax Cashflow Position</span>
            <span className={`font-mono text-xl font-bold ${
              results.afterTaxCashflow >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {formatCurrency(results.afterTaxCashflow)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span className="font-mono text-foreground">{formatCurrency(rentalPL.netCashflowPreTax)}</span>
            <span>(pre-tax cashflow)</span>
            <ArrowRight className="h-4 w-4" />
            <span className={`font-mono ${isTaxSaving ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {isTaxSaving ? '+' : ''}{formatCurrency(results.taxBenefit)}
            </span>
            <span>(tax effect)</span>
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            This is your net annual cash position after accounting for the tax 
            {isTaxSaving ? ' refund' : ' payable'} from the property.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaxComparisonTable;
