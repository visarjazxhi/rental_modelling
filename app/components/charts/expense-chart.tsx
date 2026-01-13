'use client';

/**
 * Expense Chart Component
 * 
 * Pie chart showing breakdown of operating expenses.
 */

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { OperatingExpensesInputs } from '@/app/lib/types';

interface ExpenseChartProps {
  expenses: OperatingExpensesInputs;
  ownershipPct: number;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export function ExpenseChart({ expenses, ownershipPct }: ExpenseChartProps) {
  const ownership = ownershipPct / 100;
  
  const data = [
    { name: 'Property Mgmt', value: expenses.propertyManagement * ownership },
    { name: 'Council Rates', value: expenses.councilRates * ownership },
    { name: 'Water Rates', value: expenses.waterRates * ownership },
    { name: 'Insurance', value: expenses.insurance * ownership },
    { name: 'Repairs', value: expenses.repairsMaintenance * ownership },
    { name: 'Body Corp', value: expenses.bodyCorporate * ownership },
    { name: 'Other', value: expenses.otherExpenses * ownership },
  ].filter(item => item.value > 0);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
        No expenses to display
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={COLORS[index % COLORS.length]}
                className="transition-opacity hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => formatCurrency(Number(value) || 0)}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-slate-600 -mt-2">
        Total: {formatCurrency(total)}
      </div>
    </div>
  );
}

export default ExpenseChart;
