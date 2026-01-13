'use client';

/**
 * Accordion Forms Component
 * 
 * Wraps all form sections in collapsible accordions.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { User, Building2, Home, Receipt, Calculator } from 'lucide-react';
import { PersonalSection } from './personal-section';
import { PropertySection } from './property-section';
import { RentalSection } from './rental-section';
import { ExpensesSection } from './expenses-section';
import { DepreciationSection } from './depreciation-section';
import type { PropertyModelInputs } from '@/app/lib/types';

interface AccordionFormsProps {
  inputs: PropertyModelInputs;
  onUpdate: <K extends keyof PropertyModelInputs>(
    section: K,
    values: Partial<PropertyModelInputs[K]>
  ) => void;
  defaultExpanded?: string[];
}

export function AccordionForms({ 
  inputs, 
  onUpdate,
  defaultExpanded = ['personal', 'property', 'rental']
}: AccordionFormsProps) {
  return (
    <Accordion 
      type="multiple" 
      defaultValue={defaultExpanded}
      className="space-y-3"
    >
      {/* Personal Details */}
      <AccordionItem value="personal" className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
        <AccordionTrigger className="px-4 py-3.5 hover:bg-muted/50 hover:no-underline [&[data-state=open]>div>svg]:text-primary data-[state=open]:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary transition-colors" />
            </div>
            <span className="font-semibold text-foreground">Personal Details</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 border-t border-border/50">
          <PersonalSectionInner
            values={inputs.personal}
            onChange={(values) => onUpdate('personal', values)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Property Purchase */}
      <AccordionItem value="property" className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
        <AccordionTrigger className="px-4 py-3.5 hover:bg-muted/50 hover:no-underline [&[data-state=open]>div>svg]:text-primary data-[state=open]:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-accent/20">
              <Building2 className="h-4 w-4 text-accent transition-colors" />
            </div>
            <span className="font-semibold text-foreground">Property Purchase</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 border-t border-border/50">
          <PropertySectionInner
            values={inputs.propertyPurchase}
            onChange={(values) => onUpdate('propertyPurchase', values)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Rental Income */}
      <AccordionItem value="rental" className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
        <AccordionTrigger className="px-4 py-3.5 hover:bg-muted/50 hover:no-underline [&[data-state=open]>div>svg]:text-primary data-[state=open]:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
              <Home className="h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-colors" />
            </div>
            <span className="font-semibold text-foreground">Rental Income</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 border-t border-border/50">
          <RentalSectionInner
            values={inputs.rentalIncome}
            onChange={(values) => onUpdate('rentalIncome', values)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Operating Expenses */}
      <AccordionItem value="expenses" className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
        <AccordionTrigger className="px-4 py-3.5 hover:bg-muted/50 hover:no-underline [&[data-state=open]>div>svg]:text-primary data-[state=open]:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-rose-500/10 dark:bg-rose-500/20">
              <Receipt className="h-4 w-4 text-rose-600 dark:text-rose-400 transition-colors" />
            </div>
            <span className="font-semibold text-foreground">Operating Expenses</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 border-t border-border/50">
          <ExpensesSectionInner
            values={inputs.operatingExpenses}
            onChange={(values) => onUpdate('operatingExpenses', values)}
          />
        </AccordionContent>
      </AccordionItem>

      {/* Depreciation */}
      <AccordionItem value="depreciation" className="border border-border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
        <AccordionTrigger className="px-4 py-3.5 hover:bg-muted/50 hover:no-underline [&[data-state=open]>div>svg]:text-primary data-[state=open]:bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-violet-500/10 dark:bg-violet-500/20">
              <Calculator className="h-4 w-4 text-violet-600 dark:text-violet-400 transition-colors" />
            </div>
            <span className="font-semibold text-foreground">Depreciation</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2 border-t border-border/50">
          <DepreciationSectionInner
            values={inputs.depreciation}
            onChange={(values) => onUpdate('depreciation', values)}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// Inner components that just show the fields without the Card wrapper
import { NumberInput } from '../number-input';
import { TOOLTIPS, MARGINAL_TAX_RATES, CAPITAL_WORKS_RATE } from '@/app/lib/constants';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import type { 
  PersonalInputs, 
  PropertyPurchaseInputs, 
  RentalIncomeInputs,
  OperatingExpensesInputs,
  DepreciationInputs,
} from '@/app/lib/types';

function PersonalSectionInner({ 
  values, 
  onChange 
}: { 
  values: PersonalInputs; 
  onChange: (v: Partial<PersonalInputs>) => void;
}) {
  return (
    <div className="space-y-4">
      <NumberInput
        id="baseTaxableIncome"
        label="Base Taxable Income"
        value={values.baseTaxableIncome}
        onChange={(v) => onChange({ baseTaxableIncome: v })}
        tooltip={TOOLTIPS.baseTaxableIncome}
        prefix="$"
        min={0}
        step={1000}
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
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-slate-700">Marginal Tax Rate</Label>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs text-sm bg-slate-900 text-white">
                <p>{TOOLTIPS.marginalTaxRate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select
          value={values.marginalTaxRate.toString()}
          onValueChange={(v) => onChange({ marginalTaxRate: parseFloat(v) })}
        >
          <SelectTrigger className="font-mono h-11">
            <SelectValue />
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
      />
    </div>
  );
}

function PropertySectionInner({ 
  values, 
  onChange 
}: { 
  values: PropertyPurchaseInputs; 
  onChange: (v: Partial<PropertyPurchaseInputs>) => void;
}) {
  return (
    <div className="space-y-4">
      <NumberInput
        id="purchasePrice"
        label="Purchase Price"
        value={values.purchasePrice}
        onChange={(v) => onChange({ purchasePrice: v })}
        prefix="$"
        min={0}
        step={10000}
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
      />

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-slate-700">Interest Only Loan</Label>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs text-sm bg-slate-900 text-white">
                <p>{TOOLTIPS.isInterestOnly}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch
          checked={values.isInterestOnly}
          onCheckedChange={(checked) => onChange({ isInterestOnly: checked })}
        />
      </div>
    </div>
  );
}

function RentalSectionInner({ 
  values, 
  onChange 
}: { 
  values: RentalIncomeInputs; 
  onChange: (v: Partial<RentalIncomeInputs>) => void;
}) {
  const annualRent = (52 - values.vacancyWeeksPerYear) * values.weeklyRent;
  
  return (
    <div className="space-y-4">
      <NumberInput
        id="weeklyRent"
        label="Weekly Rent"
        value={values.weeklyRent}
        onChange={(v) => onChange({ weeklyRent: v })}
        tooltip={TOOLTIPS.weeklyRent}
        prefix="$"
        min={0}
        step={10}
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
      />

      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">Annual Rent</span>
          <span className="font-mono font-semibold text-slate-800">
            ${annualRent.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          ({52 - values.vacancyWeeksPerYear} weeks × ${values.weeklyRent.toLocaleString('en-AU')}/week)
        </p>
      </div>
    </div>
  );
}

function ExpensesSectionInner({ 
  values, 
  onChange 
}: { 
  values: OperatingExpensesInputs; 
  onChange: (v: Partial<OperatingExpensesInputs>) => void;
}) {
  const total = 
    values.propertyManagement +
    values.councilRates +
    values.waterRates +
    values.insurance +
    values.repairsMaintenance +
    values.bodyCorporate +
    values.otherExpenses;

  return (
    <div className="space-y-4">
      <NumberInput
        id="propertyManagement"
        label="Property Management"
        value={values.propertyManagement}
        onChange={(v) => onChange({ propertyManagement: v })}
        prefix="$"
        min={0}
        step={100}
      />
      <NumberInput
        id="councilRates"
        label="Council Rates"
        value={values.councilRates}
        onChange={(v) => onChange({ councilRates: v })}
        prefix="$"
        min={0}
        step={100}
      />
      <NumberInput
        id="waterRates"
        label="Water Rates"
        value={values.waterRates}
        onChange={(v) => onChange({ waterRates: v })}
        prefix="$"
        min={0}
        step={100}
      />
      <NumberInput
        id="insurance"
        label="Landlord Insurance"
        value={values.insurance}
        onChange={(v) => onChange({ insurance: v })}
        prefix="$"
        min={0}
        step={100}
      />
      <NumberInput
        id="repairsMaintenance"
        label="Repairs & Maintenance"
        value={values.repairsMaintenance}
        onChange={(v) => onChange({ repairsMaintenance: v })}
        prefix="$"
        min={0}
        step={100}
      />
      <NumberInput
        id="bodyCorporate"
        label="Body Corporate / Strata"
        value={values.bodyCorporate}
        onChange={(v) => onChange({ bodyCorporate: v })}
        prefix="$"
        min={0}
        step={100}
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
        />
        <Input
          value={values.otherExpensesDescription}
          onChange={(e) => onChange({ otherExpensesDescription: e.target.value })}
          placeholder="Description (optional)"
          className="text-sm h-9"
        />
      </div>

      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">Total</span>
          <span className="font-mono font-semibold text-slate-800">
            ${total.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}

function DepreciationSectionInner({ 
  values, 
  onChange 
}: { 
  values: DepreciationInputs; 
  onChange: (v: Partial<DepreciationInputs>) => void;
}) {
  const capitalWorksDeduction = values.constructionValue * CAPITAL_WORKS_RATE;
  const total = capitalWorksDeduction + values.plantEquipmentAnnual;

  return (
    <div className="space-y-4">
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
        />
        <p className="text-xs text-slate-500 pl-1">
          Annual deduction: ${capitalWorksDeduction.toLocaleString('en-AU', { minimumFractionDigits: 2 })} (2.5%)
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
      />

      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">Total Depreciation</span>
          <span className="font-mono font-semibold text-slate-800">
            ${total.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccordionForms;
