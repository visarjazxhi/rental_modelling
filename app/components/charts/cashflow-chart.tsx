'use client';

/**
 * Cashflow Chart Component
 * 
 * Stacked bar chart showing cashflow components.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import type { CashflowResults, DepreciationResults, TaxImpactResults } from '@/app/lib/types';

interface CashflowChartProps {
  cashflow: CashflowResults;
  depreciation: DepreciationResults;
  taxImpact: TaxImpactResults;
  viewMode: 'annual' | 'monthly';
}

export function CashflowChart({ 
  cashflow, 
  depreciation, 
  taxImpact,
  viewMode 
}: CashflowChartProps) {
  const divisor = viewMode === 'monthly' ? 12 : 1;
  
  const data = [
    {
      name: 'Rent',
      value: cashflow.grossRentalIncome / divisor,
      fill: '#10b981',
    },
    {
      name: 'Expenses',
      value: -(cashflow.totalOperatingExpenses / divisor),
      fill: '#ef4444',
    },
    {
      name: 'Interest',
      value: -(cashflow.interestExpense / divisor),
      fill: '#f59e0b',
    },
    {
      name: 'Tax Effect',
      value: taxImpact.taxBenefit / divisor,
      fill: taxImpact.taxBenefit >= 0 ? '#3b82f6' : '#ef4444',
    },
  ];

  const netCashflow = (cashflow.netCashflowPreTax + taxImpact.taxBenefit) / divisor;

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}$${(absValue / 1000).toFixed(1)}k`;
    }
    return `${value < 0 ? '-' : ''}$${absValue.toFixed(0)}`;
  };

  const formatFullCurrency = (value: number) => {
    return `$${value.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-4">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip 
              formatter={(value) => formatFullCurrency(Number(value) || 0)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Net position */}
      <div 
        className="text-center p-3 rounded-lg"
        style={{ backgroundColor: netCashflow >= 0 ? '#ecfdf5' : '#fef2f2' }}
      >
        <p className="text-xs text-slate-600 uppercase tracking-wide">
          After-Tax Cashflow ({viewMode === 'monthly' ? 'Monthly' : 'Annual'})
        </p>
        <p 
          className="text-xl font-bold font-mono mt-1"
          style={{ color: netCashflow >= 0 ? '#10b981' : '#ef4444' }}
        >
          {formatFullCurrency(netCashflow)}
        </p>
      </div>
    </div>
  );
}

export default CashflowChart;
