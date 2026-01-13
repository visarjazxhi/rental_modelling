'use client';

/**
 * Depreciation Section Form
 * 
 * Captures depreciation inputs:
 * - Division 43 Capital Works (2.5% of construction value)
 * - Division 40 Plant & Equipment (annual estimate)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '../number-input';
import { TOOLTIPS, CAPITAL_WORKS_RATE } from '@/app/lib/constants';
import type { DepreciationInputs } from '@/app/lib/types';
import { Calculator } from 'lucide-react';

interface DepreciationSectionProps {
  values: DepreciationInputs;
  onChange: (values: Partial<DepreciationInputs>) => void;
}

export function DepreciationSection({ values, onChange }: DepreciationSectionProps) {
  // Calculate capital works deduction for display
  const capitalWorksDeduction = values.constructionValue * CAPITAL_WORKS_RATE;
  const totalDepreciation = capitalWorksDeduction + values.plantEquipmentAnnual;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Calculator className="h-5 w-5 text-blue-600" />
          Depreciation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <NumberInput
            id="constructionValue"
            label="Construction Value (Div 43)"
            value={values.constructionValue}
            onChange={(v) => onChange({ constructionValue: v })}
            tooltip={TOOLTIPS.capitalWorks}
            prefix="$"
            min={0}
            step={10000}
            placeholder="300000"
          />
          <p className="text-xs text-slate-500 pl-1">
            Annual deduction: ${capitalWorksDeduction.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (2.5%)
          </p>
        </div>

        <NumberInput
          id="plantEquipmentAnnual"
          label="Plant & Equipment (Div 40)"
          value={values.plantEquipmentAnnual}
          onChange={(v) => onChange({ plantEquipmentAnnual: v })}
          tooltip={TOOLTIPS.plantEquipment}
          prefix="$"
          suffix="/year"
          min={0}
          step={500}
          placeholder="5000"
        />

        {/* Calculated total depreciation display */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Total Annual Depreciation</span>
            <span className="font-mono font-semibold text-slate-800">
              ${totalDepreciation.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

export default DepreciationSection;
