'use client';

/**
 * Tax Comparison Chart Component
 * 
 * Bar chart comparing tax with and without property.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { TaxImpactResults } from '@/app/lib/types';

interface TaxChartProps {
  results: TaxImpactResults;
}

export function TaxChart({ results }: TaxChartProps) {
  const data = [
    {
      name: 'Without Property',
      incomeTax: results.withoutProperty.incomeTax,
      medicareLevy: results.withoutProperty.medicareLevy,
      total: results.withoutProperty.totalTax,
    },
    {
      name: 'With Property',
      incomeTax: results.withProperty.incomeTax,
      medicareLevy: results.withProperty.medicareLevy,
      total: results.withProperty.totalTax,
    },
  ];

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const formatFullCurrency = (value: number) => {
    return `$${value.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const taxBenefit = results.taxBenefit;
  const benefitColor = taxBenefit >= 0 ? '#10b981' : '#ef4444';

  return (
    <div className="space-y-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip 
              formatter={(value, name) => [
                formatFullCurrency(Number(value) || 0),
                String(name) === 'incomeTax' ? 'Income Tax' : 'Medicare Levy'
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="incomeTax" stackId="a" fill="#3b82f6" name="Income Tax" radius={[0, 0, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-income-${entry.name}`} />
              ))}
            </Bar>
            <Bar dataKey="medicareLevy" stackId="a" fill="#8b5cf6" name="Medicare Levy" radius={[0, 4, 4, 0]}>
              <LabelList 
                dataKey="total" 
                position="right" 
                formatter={(value) => formatCurrency(Number(value) || 0)}
                style={{ fontSize: 11, fill: '#64748b' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Tax benefit indicator */}
      <div 
        className="text-center p-3 rounded-lg"
        style={{ backgroundColor: taxBenefit >= 0 ? '#ecfdf5' : '#fef2f2' }}
      >
        <p className="text-xs text-slate-600 uppercase tracking-wide">
          {taxBenefit >= 0 ? 'Tax Saving' : 'Additional Tax'}
        </p>
        <p 
          className="text-xl font-bold font-mono mt-1"
          style={{ color: benefitColor }}
        >
          {taxBenefit >= 0 ? '+' : ''}{formatFullCurrency(taxBenefit)}
        </p>
      </div>
    </div>
  );
}

export default TaxChart;
