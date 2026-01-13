'use client';

/**
 * View Toggle Component
 * 
 * Toggle between monthly and annual view modes.
 */

import { Calendar, CalendarDays } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'annual' | 'monthly';
  onChange: (mode: 'annual' | 'monthly') => void;
}

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => onChange('monthly')}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${viewMode === 'monthly' 
            ? 'bg-white text-slate-900 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
          }
        `}
      >
        <Calendar className="h-4 w-4" />
        Monthly
      </button>
      <button
        onClick={() => onChange('annual')}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
          ${viewMode === 'annual' 
            ? 'bg-white text-slate-900 shadow-sm' 
            : 'text-slate-500 hover:text-slate-700'
          }
        `}
      >
        <CalendarDays className="h-4 w-4" />
        Annual
      </button>
    </div>
  );
}

export default ViewToggle;
