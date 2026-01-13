'use client';

/**
 * Personal Section Form
 * 
 * Captures owner's personal financial details:
 * - Base taxable income (excluding property)
 * - Ownership percentage
 * - Marginal tax rate
 * - Medicare levy rate
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NumberInput } from '../number-input';
import { TOOLTIPS, MARGINAL_TAX_RATES } from '@/app/lib/constants';
import type { PersonalInputs } from '@/app/lib/types';
import { User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface PersonalSectionProps {
  values: PersonalInputs;
  onChange: (values: Partial<PersonalInputs>) => void;
}

export function PersonalSection({ values, onChange }: PersonalSectionProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <User className="h-5 w-5 text-blue-600" />
          Personal Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          id="baseTaxableIncome"
          label="Base Taxable Income"
          value={values.baseTaxableIncome}
          onChange={(v) => onChange({ baseTaxableIncome: v })}
          tooltip={TOOLTIPS.baseTaxableIncome}
          prefix="$"
          min={0}
          step={1000}
          placeholder="100000"
        />

        <NumberInput
          id="ownershipPercentage"
          label="Ownership Percentage"
          value={values.ownershipPercentage}
          onChange={(v) => onChange({ ownershipPercentage: v })}
          tooltip={TOOLTIPS.ownershipPercentage}
          suffix="%"
          min={0}
          max={100}
          step={1}
          placeholder="100"
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="marginalTaxRate" className="text-sm font-medium text-slate-700">
              Marginal Tax Rate
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
                  <p>{TOOLTIPS.marginalTaxRate}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={values.marginalTaxRate.toString()}
            onValueChange={(v) => onChange({ marginalTaxRate: parseFloat(v) })}
          >
            <SelectTrigger className="font-mono">
              <SelectValue placeholder="Select rate" />
            </SelectTrigger>
            <SelectContent>
              {MARGINAL_TAX_RATES.map((rate) => (
                <SelectItem key={rate.rate} value={rate.rate.toString()}>
                  {rate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <NumberInput
          id="medicareLevyRate"
          label="Medicare Levy Rate"
          value={values.medicareLevyRate}
          onChange={(v) => onChange({ medicareLevyRate: v })}
          tooltip={TOOLTIPS.medicareLevyRate}
          suffix="%"
          min={0}
          max={3.5}
          step={0.1}
          isPercentage={true}
          placeholder="2"
        />
      </CardContent>
    </Card>
  );
}

export default PersonalSection;
