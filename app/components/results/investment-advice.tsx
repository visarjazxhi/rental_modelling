'use client';

/**
 * Investment Advice Component
 * 
 * Provides personalized advice based on the rental property calculation results.
 * This is for educational purposes only and should not be considered financial advice.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator
} from 'lucide-react';
import type { TaxImpactResults, RentalPLResults, CashflowResults } from '@/app/lib/types';
import { formatCurrency } from '@/app/lib/constants';

interface InvestmentAdviceProps {
  taxImpact: TaxImpactResults;
  rentalPL: RentalPLResults;
  cashflow: CashflowResults;
  marginalTaxRate: number;
  loanAmount: number;
  purchasePrice: number;
  isInterestOnly: boolean;
}

export function InvestmentAdvice({
  taxImpact,
  rentalPL,
  cashflow,
  marginalTaxRate,
  loanAmount,
  purchasePrice,
  isInterestOnly,
}: InvestmentAdviceProps) {
  const isNegativelyGeared = rentalPL.isNegativelyGeared;
  const taxBenefit = taxImpact.taxBenefit;
  const afterTaxCashflow = taxImpact.afterTaxCashflow;
  const lvr = (loanAmount / purchasePrice) * 100;

  // Generate advice points based on the results
  const advicePoints: Array<{
    icon: typeof Lightbulb;
    iconColor: string;
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral' | 'warning';
  }> = [];

  // Gearing status advice
  if (isNegativelyGeared) {
    if (taxBenefit > 0) {
      advicePoints.push({
        icon: TrendingDown,
        iconColor: 'text-blue-600 dark:text-blue-400',
        title: 'Negatively Geared Property',
        description: `Your property is negatively geared, meaning expenses exceed rental income by ${formatCurrency(Math.abs(rentalPL.netRentalResult))} annually. This creates a tax deduction that reduces your taxable income, resulting in a tax saving of ${formatCurrency(taxBenefit)}.`,
        type: 'neutral',
      });
    }
  } else {
    advicePoints.push({
      icon: TrendingUp,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'Positively Geared Property',
      description: `Your property is positively geared with a net rental profit of ${formatCurrency(rentalPL.netRentalResult)}. While this means additional taxable income, you're generating positive cashflow which is great for long-term wealth building.`,
      type: 'positive',
    });
  }

  // After-tax cashflow advice
  if (afterTaxCashflow < 0) {
    advicePoints.push({
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      title: 'Out-of-Pocket Contribution Required',
      description: `After accounting for the tax benefit, you'll need to contribute approximately ${formatCurrency(Math.abs(afterTaxCashflow))} per year (${formatCurrency(Math.abs(afterTaxCashflow) / 12)} per month) from your own funds to hold this property.`,
      type: 'warning',
    });
  } else {
    advicePoints.push({
      icon: CheckCircle,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'Positive After-Tax Cashflow',
      description: `After accounting for the tax benefit, this property generates positive cashflow of ${formatCurrency(afterTaxCashflow)} per year (${formatCurrency(afterTaxCashflow / 12)} per month), meaning it's self-sustaining.`,
      type: 'positive',
    });
  }

  // LVR advice
  if (lvr > 80) {
    advicePoints.push({
      icon: Info,
      iconColor: 'text-blue-600 dark:text-blue-400',
      title: 'High Loan-to-Value Ratio',
      description: `Your LVR of ${lvr.toFixed(0)}% exceeds 80%, which typically requires Lenders Mortgage Insurance (LMI). Consider saving a larger deposit to reduce borrowing costs and improve cashflow.`,
      type: 'neutral',
    });
  }

  // Interest-only advice
  if (isInterestOnly) {
    advicePoints.push({
      icon: Calculator,
      iconColor: 'text-violet-600 dark:text-violet-400',
      title: 'Interest-Only Loan Structure',
      description: 'You\'re using an interest-only loan which maximizes tax deductions in the short term. Remember that after the interest-only period ends, your repayments will increase significantly when principal repayments begin.',
      type: 'neutral',
    });
  }

  // High marginal tax rate advice
  if (marginalTaxRate >= 37 && isNegativelyGeared) {
    advicePoints.push({
      icon: Lightbulb,
      iconColor: 'text-amber-500 dark:text-amber-400',
      title: 'Tax Bracket Advantage',
      description: `At your ${marginalTaxRate}% marginal tax rate, negative gearing provides significant tax benefits. Each dollar of deductible expense reduces your tax by ${(marginalTaxRate / 100).toFixed(2)} cents.`,
      type: 'positive',
    });
  }

  return (
    <Card className="border-border bg-gradient-to-br from-card to-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <div className="p-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          Investment Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {advicePoints.map((advice, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl border transition-all hover:shadow-sm ${
              advice.type === 'positive' 
                ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' 
                : advice.type === 'warning'
                ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50'
                : advice.type === 'negative'
                ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
                : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${
                advice.type === 'positive' 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                  : advice.type === 'warning'
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : advice.type === 'negative'
                  ? 'bg-red-100 dark:bg-red-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <advice.icon className={`h-4 w-4 ${advice.iconColor}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">{advice.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {advice.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic">
            <strong>Disclaimer:</strong> This analysis is for educational and planning purposes only. 
            It does not constitute financial, tax, or investment advice. Tax laws are complex and subject 
            to change. Always consult with a qualified tax accountant or financial adviser before making 
            investment decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvestmentAdvice;
