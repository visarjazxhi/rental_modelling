'use client';

/**
 * Expenses Section Form
 * 
 * Captures annual operating expenses:
 * - Property management
 * - Council rates
 * - Water rates
 * - Insurance
 * - Repairs & maintenance
 * - Body corporate
 * - Other expenses
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '../number-input';
import type { OperatingExpensesInputs } from '@/app/lib/types';
import { Receipt } from 'lucide-react';

interface ExpensesSectionProps {
  values: OperatingExpensesInputs;
  onChange: (values: Partial<OperatingExpensesInputs>) => void;
}

export function ExpensesSection({ values, onChange }: ExpensesSectionProps) {
  // Calculate total expenses for display
  const totalExpenses = 
    values.propertyManagement +
    values.councilRates +
    values.waterRates +
    values.insurance +
    values.repairsMaintenance +
    values.bodyCorporate +
    values.otherExpenses;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Receipt className="h-5 w-5 text-blue-600" />
          Operating Expenses (Annual)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          id="propertyManagement"
          label="Property Management"
          value={values.propertyManagement}
          onChange={(v) => onChange({ propertyManagement: v })}
          prefix="$"
          min={0}
          step={100}
          placeholder="1500"
        />

        <NumberInput
          id="councilRates"
          label="Council Rates"
          value={values.councilRates}
          onChange={(v) => onChange({ councilRates: v })}
          prefix="$"
          min={0}
          step={100}
          placeholder="2000"
        />

        <NumberInput
          id="waterRates"
          label="Water Rates"
          value={values.waterRates}
          onChange={(v) => onChange({ waterRates: v })}
          prefix="$"
          min={0}
          step={100}
          placeholder="1000"
        />

        <NumberInput
          id="insurance"
          label="Landlord Insurance"
          value={values.insurance}
          onChange={(v) => onChange({ insurance: v })}
          prefix="$"
          min={0}
          step={100}
          placeholder="1500"
        />

        <NumberInput
          id="repairsMaintenance"
          label="Repairs & Maintenance"
          value={values.repairsMaintenance}
          onChange={(v) => onChange({ repairsMaintenance: v })}
          prefix="$"
          min={0}
          step={100}
          placeholder="1000"
        />

        <NumberInput
          id="bodyCorporate"
          label="Body Corporate / Strata"
          value={values.bodyCorporate}
          onChange={(v) => onChange({ bodyCorporate: v })}
          prefix="$"
          min={0}
          step={100}
          placeholder="0"
        />

        <div className="space-y-2">
          <NumberInput
            id="otherExpenses"
            label="Other Expenses"
            value={values.otherExpenses}
            onChange={(v) => onChange({ otherExpenses: v })}
            prefix="$"
            min={0}
            step={100}
            placeholder="0"
          />
          <div className="pl-1">
            <Label htmlFor="otherExpensesDescription" className="text-xs text-slate-500">
              Description (optional)
            </Label>
            <Input
              id="otherExpensesDescription"
              value={values.otherExpensesDescription}
              onChange={(e) => onChange({ otherExpensesDescription: e.target.value })}
              placeholder="e.g., Pest control, gardening"
              className="text-sm mt-1"
            />
          </div>
        </div>

        {/* Calculated total expenses display */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Total Operating Expenses</span>
            <span className="font-mono font-semibold text-slate-800">
              ${totalExpenses.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            (before ownership % adjustment)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExpensesSection;
