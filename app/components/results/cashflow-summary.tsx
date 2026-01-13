'use client';

/**
 * Cashflow Summary Component
 * 
 * Displays rental cashflow breakdown:
 * - Gross rental income
 * - Operating expenses
 * - Interest expense
 * - Net cashflow before tax
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/app/lib/constants';
import type { CashflowResults, OperatingExpensesInputs } from '@/app/lib/types';
import { Wallet } from 'lucide-react';

interface CashflowSummaryProps {
  results: CashflowResults;
  expenses: OperatingExpensesInputs;
  ownershipPct: number;
}

export function CashflowSummary({ 
  results, 
  expenses, 
  ownershipPct 
}: CashflowSummaryProps) {
  const ownership = ownershipPct / 100;
  
  // Individual expense items adjusted for ownership
  const expenseItems = [
    { label: 'Property Management', value: expenses.propertyManagement * ownership },
    { label: 'Council Rates', value: expenses.councilRates * ownership },
    { label: 'Water Rates', value: expenses.waterRates * ownership },
    { label: 'Insurance', value: expenses.insurance * ownership },
    { label: 'Repairs & Maintenance', value: expenses.repairsMaintenance * ownership },
    { label: 'Body Corporate', value: expenses.bodyCorporate * ownership },
    { label: 'Other Expenses', value: expenses.otherExpenses * ownership },
  ].filter(item => item.value > 0);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
            <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          Rental Cashflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Income */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Gross Rental Income</span>
            <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
              {formatCurrency(results.grossRentalIncome)}
            </span>
          </div>
        </div>

        {/* Expenses breakdown */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Cash Expenses
          </p>
          {expenseItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-mono text-red-600 dark:text-red-400">
                ({formatCurrency(item.value)})
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center text-sm font-medium pt-1">
            <span className="text-muted-foreground">Total Operating Expenses</span>
            <span className="font-mono text-red-600 dark:text-red-400">
              ({formatCurrency(results.totalOperatingExpenses)})
            </span>
          </div>
        </div>

        {/* Interest */}
        <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
          <span className="text-muted-foreground">Interest Expense</span>
          <span className="font-mono text-red-600 dark:text-red-400">
            ({formatCurrency(results.interestExpense)})
          </span>
        </div>

        {/* Net cashflow */}
        <div className="flex justify-between items-center pt-3 border-t-2 border-border">
          <span className="font-semibold text-foreground">Net Cashflow (Pre-Tax)</span>
          <span className={`font-mono text-lg font-bold ${
            results.netCashflowPreTax >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(results.netCashflowPreTax)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default CashflowSummary;
