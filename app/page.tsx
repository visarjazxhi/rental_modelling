'use client';

/**
 * Rental Property Tax Modeling App
 * 
 * Main page that assembles all components for the Australian
 * rental property tax modeling tool.
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { usePropertyModel } from './lib/hooks/use-property-model';
import { useScenarios } from './lib/hooks/use-scenarios';
import { DisclaimerBanner } from './components/disclaimer-banner';
import { AccordionForms } from './components/forms/accordion-forms';
import {
  CashflowSummary,
  DepreciationSummary,
  RentalPLSummary,
  TaxComparisonTable,
  InvestmentAdvice,
} from './components/results';
import { ExpenseChart, TaxChart, CashflowChart } from './components/charts';
import { ScenarioManager } from './components/scenario-manager';
import { ExportButton } from './components/export-button';
import { PrintReport } from './components/print-report';
import { ComparisonView } from './components/comparison-view';
import { LoanComparison } from './components/loan-comparison';
import { ViewToggle } from './components/view-toggle';
import { formatCurrency } from './lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Printer,
  ArrowLeftRight,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './components/theme-toggle';

export default function Home() {
  const { 
    inputs, 
    results, 
    validation, 
    warnings, 
    updateInputs, 
    resetInputs,
    setInputs,
  } = usePropertyModel();

  const {
    scenarios,
    saveScenario,
    deleteScenario,
    duplicateScenario,
    renameScenario,
    saveLastSession,
    loadLastSession,
  } = useScenarios();

  const [isAssumptionsExpanded, setIsAssumptionsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');
  const [showPrintReport, setShowPrintReport] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState('summary');

  // Auto-save session on changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveLastSession(inputs);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [inputs, saveLastSession]);

  // Load last session on mount
  useEffect(() => {
    const lastSession = loadLastSession();
    if (lastSession) {
      setInputs(lastSession);
    }
  }, [loadLastSession, setInputs]);

  // Calculate divisor for monthly/annual display
  const divisor = viewMode === 'monthly' ? 12 : 1;

  // Handle scenario save
  const handleSaveScenario = useCallback((name: string) => {
    saveScenario(name, inputs);
  }, [saveScenario, inputs]);

  // Handle scenario load
  const handleLoadScenario = useCallback((scenario: { inputs: typeof inputs }) => {
    setInputs(scenario.inputs);
  }, [setInputs]);

  if (showPrintReport) {
    return (
      <PrintReport 
        inputs={inputs} 
        results={results} 
        onClose={() => setShowPrintReport(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <DisclaimerBanner />
      
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-40 no-print header-gradient">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* TaxTalk Logo */}
              <div className="logo-container h-10">
                <Image
                  src="/taxtalk-logo.svg"
                  alt="TaxTalk Logo"
                  width={140}
                  height={40}
                  className="h-10 w-auto dark:brightness-110"
                  priority
                />
              </div>
              <div className="hidden sm:block border-l border-border pl-4">
                <h1 className="text-lg font-bold text-foreground">
                  Rental Property Tax Modeler
                </h1>
                <p className="text-xs text-muted-foreground">
                  Australian What-If Scenario Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(true)}
                className="h-9 hidden sm:flex border-border hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Compare
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrintReport(true)}
                className="h-9 border-border hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
              >
                <Printer className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <ExportButton inputs={inputs} results={results} viewMode={viewMode} />
              <Button
                variant="ghost"
                size="sm"
                onClick={resetInputs}
                className="h-9 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Comparison Modal */}
      {showComparison && (
        <ComparisonView 
          scenarios={scenarios} 
          onClose={() => setShowComparison(false)} 
        />
      )}

      {/* Validation warnings */}
      {(validation.errors.length > 0 || warnings.length > 0) && (
        <div className="max-w-7xl mx-auto px-4 py-3 no-print">
          {validation.errors.map((error) => (
            <div 
              key={`${error.field}-${error.message}`}
              className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2.5 rounded-lg mb-2 animate-fade-in"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span><strong>{error.field}:</strong> {error.message}</span>
            </div>
          ))}
          {warnings.map((warning) => (
            <div 
              key={`${warning.field}-${warning.message}`}
              className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-lg mb-2 animate-fade-in"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{warning.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 no-print">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left column - Assumptions/Inputs */}
          <div className="lg:col-span-5 space-y-4">
            {/* Scenario Manager */}
            <ScenarioManager
              scenarios={scenarios}
              currentInputs={inputs}
              onSave={handleSaveScenario}
              onLoad={handleLoadScenario}
              onDelete={deleteScenario}
              onDuplicate={duplicateScenario}
              onRename={renameScenario}
            />

            {/* Collapsible header for mobile */}
            <button
              onClick={() => setIsAssumptionsExpanded(!isAssumptionsExpanded)}
              className="w-full flex items-center justify-between p-3 bg-card rounded-lg border border-border lg:hidden hover:bg-muted/50 transition-colors"
            >
              <span className="font-semibold text-foreground">Assumptions</span>
              {isAssumptionsExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Assumptions sections with Accordion */}
            <div className={`${isAssumptionsExpanded ? '' : 'hidden lg:block'}`}>
              <div className="hidden lg:flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  Assumptions
                </h2>
              </div>

              <AccordionForms
                inputs={inputs}
                onUpdate={updateInputs}
                defaultExpanded={['personal', 'property', 'rental']}
              />
            </div>
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-7 space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard
                label={`Net Cashflow${viewMode === 'monthly' ? ' (Monthly)' : ''}`}
                value={results.cashflow.netCashflowPreTax / divisor}
                subtitle={viewMode === 'monthly' ? 'Pre-tax monthly' : 'Annual pre-tax'}
              />
              <SummaryCard
                label={`Net Rental Result${viewMode === 'monthly' ? ' (Monthly)' : ''}`}
                value={results.rentalPL.netRentalResult / divisor}
                subtitle={results.rentalPL.isNegativelyGeared ? 'Negatively geared' : 'Positively geared'}
              />
              <SummaryCard
                label={results.taxImpact.taxBenefit >= 0 ? "Tax Saved" : "Additional Tax"}
                value={results.taxImpact.taxBenefit / divisor}
                subtitle={viewMode === 'monthly' ? 'Monthly tax impact' : 'Annual tax impact'}
                isHighlight
              />
            </div>

            {/* Results Tabs */}
            <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="space-y-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span className="hidden sm:inline">Charts</span>
                </TabsTrigger>
                <TabsTrigger value="loan" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Loan</span>
                  <span className="sm:hidden">Loan</span>
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4 animate-fade-in">
                <CashflowSummary
                  results={results.cashflow}
                  expenses={inputs.operatingExpenses}
                  ownershipPct={inputs.personal.ownershipPercentage}
                />

                <DepreciationSummary results={results.depreciation} />

                <RentalPLSummary results={results.rentalPL} />

                <TaxComparisonTable 
                  results={results.taxImpact} 
                  rentalPL={results.rentalPL}
                />

                {/* Investment Advice based on results */}
                <InvestmentAdvice
                  taxImpact={results.taxImpact}
                  rentalPL={results.rentalPL}
                  cashflow={results.cashflow}
                  marginalTaxRate={inputs.personal.marginalTaxRate}
                  loanAmount={inputs.propertyPurchase.loanAmount}
                  purchasePrice={inputs.propertyPurchase.purchasePrice}
                  isInterestOnly={inputs.propertyPurchase.isInterestOnly}
                />
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts" className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-slate-800">
                        Expense Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ExpenseChart 
                        expenses={inputs.operatingExpenses}
                        ownershipPct={inputs.personal.ownershipPercentage}
                      />
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold text-slate-800">
                        Tax Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TaxChart results={results.taxImpact} />
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-slate-800">
                      Cashflow Components
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CashflowChart 
                      cashflow={results.cashflow}
                      depreciation={results.depreciation}
                      taxImpact={results.taxImpact}
                      viewMode={viewMode}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Loan Tab */}
              <TabsContent value="loan" className="space-y-4 animate-fade-in">
                <LoanComparison
                  loanAmount={inputs.propertyPurchase.loanAmount}
                  interestRate={inputs.propertyPurchase.interestRate}
                  loanTermYears={inputs.propertyPurchase.loanTermYears}
                  isInterestOnly={inputs.propertyPurchase.isInterestOnly}
                  viewMode={viewMode}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/taxtalk-logo.svg"
                alt="TaxTalk Logo"
                width={100}
                height={28}
                className="h-7 w-auto opacity-70 dark:brightness-110"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This tool is for educational and planning purposes only. 
              Consult a registered tax agent for personalised advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Summary Card Component
 * Displays a key metric in a compact card format with animations
 */
interface SummaryCardProps {
  label: string;
  value: number;
  subtitle: string;
  isHighlight?: boolean;
  icon?: 'dollar' | 'up' | 'down';
}

function SummaryCard({ label, value, subtitle, isHighlight = false, icon }: SummaryCardProps) {
  const isPositive = value >= 0;
  
  const getIcon = () => {
    if (icon === 'up' || (isHighlight && isPositive)) {
      return <TrendingUp className="h-4 w-4" />;
    }
    if (icon === 'down' || (isHighlight && !isPositive)) {
      return <TrendingDown className="h-4 w-4" />;
    }
    return <DollarSign className="h-4 w-4" />;
  };
  
  return (
    <div className={`rounded-xl p-4 transition-all duration-300 relative overflow-hidden group ${
      isHighlight 
        ? isPositive 
          ? 'summary-card-positive glow-positive' 
          : 'summary-card-negative glow-negative'
        : 'summary-card'
    }`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <div className={`p-1.5 rounded-lg ${
            isHighlight
              ? isPositive 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-primary/10 text-primary'
          }`}>
            {getIcon()}
          </div>
        </div>
        <p className={`text-2xl font-bold font-mono animate-number tracking-tight ${
          isHighlight
            ? isPositive 
              ? 'text-emerald-700 dark:text-emerald-400' 
              : 'text-red-700 dark:text-red-400'
            : isPositive 
              ? 'text-foreground' 
              : 'text-red-600 dark:text-red-400'
        }`}>
          {formatCurrency(value)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            isHighlight
              ? isPositive
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
              : 'bg-muted text-muted-foreground'
          }`}>
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
