'use client';

/**
 * Property Section Form
 * 
 * Captures property purchase and loan details:
 * - Purchase price
 * - Loan amount
 * - Interest rate
 * - Loan term
 * - Interest-only toggle
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '../number-input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TOOLTIPS } from '@/app/lib/constants';
import type { PropertyPurchaseInputs } from '@/app/lib/types';
import { Building2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface PropertySectionProps {
  values: PropertyPurchaseInputs;
  onChange: (values: Partial<PropertyPurchaseInputs>) => void;
}

export function PropertySection({ values, onChange }: PropertySectionProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Building2 className="h-5 w-5 text-blue-600" />
          Property Purchase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          id="purchasePrice"
          label="Purchase Price"
          value={values.purchasePrice}
          onChange={(v) => onChange({ purchasePrice: v })}
          prefix="$"
          min={0}
          step={10000}
          placeholder="600000"
        />

        <NumberInput
          id="loanAmount"
          label="Loan Amount"
          value={values.loanAmount}
          onChange={(v) => onChange({ loanAmount: v })}
          tooltip={TOOLTIPS.loanAmount}
          prefix="$"
          min={0}
          step={10000}
          placeholder="480000"
        />

        <NumberInput
          id="interestRate"
          label="Interest Rate"
          value={values.interestRate}
          onChange={(v) => onChange({ interestRate: v })}
          tooltip={TOOLTIPS.interestRate}
          suffix="%"
          min={0}
          max={25}
          step={0.01}
          isPercentage={true}
          placeholder="6.00"
        />

        <NumberInput
          id="loanTermYears"
          label="Loan Term"
          value={values.loanTermYears}
          onChange={(v) => onChange({ loanTermYears: v })}
          suffix="years"
          min={1}
          max={40}
          step={1}
          placeholder="30"
        />

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="isInterestOnly" className="text-sm font-medium text-slate-700">
              Interest Only Loan
            </Label>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="max-w-xs text-sm bg-slate-900 text-white"
                >
                  <p>{TOOLTIPS.isInterestOnly}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Switch
            id="isInterestOnly"
            checked={values.isInterestOnly}
            onCheckedChange={(checked) => onChange({ isInterestOnly: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertySection;
