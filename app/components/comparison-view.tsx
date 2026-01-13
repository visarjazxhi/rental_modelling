'use client';

/**
 * Comparison View Component
 * 
 * Side-by-side comparison of two saved scenarios.
 */

import { useState } from 'react';
import { X, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/app/lib/constants';
import type { SavedScenario } from '@/app/lib/hooks/use-scenarios';
import { usePropertyModel } from '@/app/lib/hooks/use-property-model';

interface ComparisonViewProps {
  scenarios: SavedScenario[];
  onClose: () => void;
}

interface ScenarioWithResults extends SavedScenario {
  results: ReturnType<typeof usePropertyModel>['results'];
}

/**
 * Calculate results for a scenario's inputs
 */
function useScenarioResults(inputs: SavedScenario['inputs']) {
  const model = usePropertyModel(inputs);
  return model.results;
}

function ComparisonColumn({ 
  scenario, 
  label 
}: { 
  scenario: ScenarioWithResults | null; 
  label: string;
}) {
  if (!scenario) {
    return (
      <div className="flex-1 p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <p className="text-center text-slate-400">
          Select {label}
        </p>
      </div>
    );
  }

  const { inputs, results } = scenario;

  return (
    <div className="flex-1 p-4 bg-white rounded-lg border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-4 truncate">{scenario.name}</h3>
      
      {/* Key metrics */}
      <div className="space-y-4">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 uppercase">Net Cashflow</p>
          <p className={`text-lg font-bold font-mono ${
            results.cashflow.netCashflowPreTax >= 0 ? 'text-emerald-700' : 'text-red-600'
          }`}>
            {formatCurrency(results.cashflow.netCashflowPreTax)}
          </p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 uppercase">Net Rental Result</p>
          <p className={`text-lg font-bold font-mono ${
            results.rentalPL.netRentalResult >= 0 ? 'text-emerald-700' : 'text-red-600'
          }`}>
            {formatCurrency(results.rentalPL.netRentalResult)}
          </p>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 uppercase">Tax Impact</p>
          <p className={`text-lg font-bold font-mono ${
            results.taxImpact.taxBenefit >= 0 ? 'text-emerald-700' : 'text-red-600'
          }`}>
            {results.taxImpact.taxBenefit >= 0 ? '+' : ''}{formatCurrency(results.taxImpact.taxBenefit)}
          </p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500 uppercase">After-Tax Position</p>
          <p className={`text-lg font-bold font-mono ${
            results.taxImpact.afterTaxCashflow >= 0 ? 'text-blue-700' : 'text-red-600'
          }`}>
            {formatCurrency(results.taxImpact.afterTaxCashflow)}
          </p>
        </div>

        {/* Key inputs */}
        <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Weekly Rent</span>
            <span className="font-mono">{formatCurrency(inputs.rentalIncome.weeklyRent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Loan Amount</span>
            <span className="font-mono">{formatCurrency(inputs.propertyPurchase.loanAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Interest Rate</span>
            <span className="font-mono">{(inputs.propertyPurchase.interestRate * 100).toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tax Rate</span>
            <span className="font-mono">{(inputs.personal.marginalTaxRate * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DifferenceColumn({ 
  scenarioA, 
  scenarioB 
}: { 
  scenarioA: ScenarioWithResults | null; 
  scenarioB: ScenarioWithResults | null;
}) {
  if (!scenarioA || !scenarioB) {
    return null;
  }

  const diff = {
    cashflow: scenarioB.results.cashflow.netCashflowPreTax - scenarioA.results.cashflow.netCashflowPreTax,
    rentalResult: scenarioB.results.rentalPL.netRentalResult - scenarioA.results.rentalPL.netRentalResult,
    taxBenefit: scenarioB.results.taxImpact.taxBenefit - scenarioA.results.taxImpact.taxBenefit,
    afterTax: scenarioB.results.taxImpact.afterTaxCashflow - scenarioA.results.taxImpact.afterTaxCashflow,
  };

  const formatDiff = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatCurrency(value)}`;
  };

  return (
    <div className="w-32 flex flex-col items-center justify-center gap-4 text-center">
      <div className="text-xs text-slate-500 uppercase">Difference</div>
      
      <div className={`font-mono text-sm ${diff.cashflow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {formatDiff(diff.cashflow)}
      </div>
      
      <div className={`font-mono text-sm ${diff.rentalResult >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {formatDiff(diff.rentalResult)}
      </div>
      
      <div className={`font-mono text-sm ${diff.taxBenefit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {formatDiff(diff.taxBenefit)}
      </div>
      
      <div className={`font-mono text-sm ${diff.afterTax >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
        {formatDiff(diff.afterTax)}
      </div>
    </div>
  );
}

export function ComparisonView({ scenarios, onClose }: ComparisonViewProps) {
  const [scenarioAId, setScenarioAId] = useState<string>('');
  const [scenarioBId, setScenarioBId] = useState<string>('');

  const scenarioA = scenarios.find(s => s.id === scenarioAId);
  const scenarioB = scenarios.find(s => s.id === scenarioBId);

  // Get results for selected scenarios
  const resultsA = useScenarioResults(scenarioA?.inputs ?? scenarios[0]?.inputs ?? {} as SavedScenario['inputs']);
  const resultsB = useScenarioResults(scenarioB?.inputs ?? scenarios[0]?.inputs ?? {} as SavedScenario['inputs']);

  const scenarioAWithResults = scenarioA ? { ...scenarioA, results: resultsA } : null;
  const scenarioBWithResults = scenarioB ? { ...scenarioB, results: resultsB } : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Compare Scenarios</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scenario selectors */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase mb-1 block">Scenario A</label>
              <Select value={scenarioAId} onValueChange={setScenarioAId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first scenario..." />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map(s => (
                    <SelectItem key={s.id} value={s.id} disabled={s.id === scenarioBId}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-5">
              <ArrowLeftRight className="h-5 w-5 text-slate-400" />
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-slate-500 uppercase mb-1 block">Scenario B</label>
              <Select value={scenarioBId} onValueChange={setScenarioBId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second scenario..." />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map(s => (
                    <SelectItem key={s.id} value={s.id} disabled={s.id === scenarioAId}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Comparison content */}
        <div className="p-4">
          {scenarios.length < 2 ? (
            <div className="text-center py-12 text-slate-500">
              <p>You need at least 2 saved scenarios to compare.</p>
              <p className="text-sm mt-2">Save some scenarios first, then come back here.</p>
            </div>
          ) : (
            <div className="flex gap-4">
              <ComparisonColumn scenario={scenarioAWithResults} label="Scenario A" />
              <DifferenceColumn scenarioA={scenarioAWithResults} scenarioB={scenarioBWithResults} />
              <ComparisonColumn scenario={scenarioBWithResults} label="Scenario B" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComparisonView;
