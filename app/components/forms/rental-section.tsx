'use client';

/**
 * Rental Section Form
 * 
 * Captures rental income details:
 * - Weekly rent
 * - Vacancy weeks per year
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '../number-input';
import { TOOLTIPS } from '@/app/lib/constants';
import type { RentalIncomeInputs } from '@/app/lib/types';
import { Home } from 'lucide-react';

interface RentalSectionProps {
  values: RentalIncomeInputs;
  onChange: (values: Partial<RentalIncomeInputs>) => void;
}

export function RentalSection({ values, onChange }: RentalSectionProps) {
  // Calculate annual rent for display
  const annualRent = (52 - values.vacancyWeeksPerYear) * values.weeklyRent;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Home className="h-5 w-5 text-blue-600" />
          Rental Income
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          id="weeklyRent"
          label="Weekly Rent"
          value={values.weeklyRent}
          onChange={(v) => onChange({ weeklyRent: v })}
          tooltip={TOOLTIPS.weeklyRent}
          prefix="$"
          min={0}
          step={10}
          placeholder="550"
        />

        <NumberInput
          id="vacancyWeeksPerYear"
          label="Vacancy Weeks / Year"
          value={values.vacancyWeeksPerYear}
          onChange={(v) => onChange({ vacancyWeeksPerYear: v })}
          tooltip={TOOLTIPS.vacancyWeeks}
          suffix="weeks"
          min={0}
          max={52}
          step={1}
          placeholder="2"
        />

        {/* Calculated annual rent display */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Annual Rent (before ownership %)</span>
            <span className="font-mono font-semibold text-slate-800">
              ${annualRent.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ({52 - values.vacancyWeeksPerYear} weeks × ${values.weeklyRent.toLocaleString('en-AU')}/week)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RentalSection;
