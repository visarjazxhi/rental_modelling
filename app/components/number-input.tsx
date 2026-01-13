'use client';

/**
 * CurrencyInput Component
 * 
 * A validated number input with live AUD currency formatting.
 * Formats numbers with thousand separators as user types.
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { useCallback, useState, useEffect, useRef } from 'react';

export interface NumberInputProps {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Current numeric value */
  value: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Optional tooltip text */
  tooltip?: string;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "%", "weeks") */
  suffix?: string;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Whether to treat as percentage (multiply display by 100) */
  isPercentage?: boolean;
  /** Whether to format with thousand separators (for currency) */
  isCurrency?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Format a number with thousand separators for AUD
 */
function formatWithSeparators(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';
  
  // Split into integer and decimal parts
  const parts = num.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Add thousand separators to integer part
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return decimalPart !== undefined ? `${formatted}.${decimalPart}` : formatted;
}

/**
 * Remove formatting to get raw number
 */
function parseFormattedValue(value: string): number {
  const cleaned = value.replace(/,/g, '');
  return parseFloat(cleaned) || 0;
}

export function NumberInput({
  id,
  label,
  value,
  onChange,
  tooltip,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  isPercentage = false,
  isCurrency = false,
  disabled = false,
  error,
  placeholder,
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // For percentage fields, we display as 0-100 but store as 0-1
  const displayValue = isPercentage ? value * 100 : value;
  
  // Format for display with separators if currency
  const getFormattedDisplay = useCallback((val: number): string => {
    if (isCurrency || prefix === '$') {
      return formatWithSeparators(val);
    }
    return val.toString();
  }, [isCurrency, prefix]);
  
  // Local state for the input to allow intermediate invalid states while typing
  const [localValue, setLocalValue] = useState(getFormattedDisplay(displayValue));
  const [isFocused, setIsFocused] = useState(false);
  
  // Sync local value when prop changes (e.g., reset)
  useEffect(() => {
    if (!isFocused) {
      const newDisplayValue = isPercentage ? value * 100 : value;
      setLocalValue(getFormattedDisplay(newDisplayValue));
    }
  }, [value, isPercentage, isFocused, getFormattedDisplay]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    // Remove existing formatting
    const cleanValue = rawValue.replace(/,/g, '');
    
    // Allow empty, just digits, decimal point, and negative
    if (cleanValue === '' || cleanValue === '-' || /^-?\d*\.?\d*$/.test(cleanValue)) {
      // Format with separators for currency
      if ((isCurrency || prefix === '$') && cleanValue !== '' && cleanValue !== '-') {
        const formatted = formatWithSeparators(cleanValue);
        
        // Calculate new cursor position accounting for added commas
        const commasBefore = (rawValue.slice(0, cursorPosition).match(/,/g) || []).length;
        const commasAfter = (formatted.slice(0, cursorPosition).match(/,/g) || []).length;
        const newPosition = cursorPosition + (commasAfter - commasBefore);
        
        setLocalValue(formatted);
        
        // Restore cursor position after React re-render
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(newPosition, newPosition);
          }
        });
      } else {
        setLocalValue(rawValue);
      }
      
      // Parse and update
      const parsed = parseFormattedValue(cleanValue);
      if (!isNaN(parsed) && cleanValue !== '' && cleanValue !== '-') {
        const storageValue = isPercentage ? parsed / 100 : parsed;
        onChange(storageValue);
      }
    }
  }, [onChange, isPercentage, isCurrency, prefix]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    
    // On blur, format the value properly
    const parsed = parseFormattedValue(localValue);
    if (isNaN(parsed) || localValue === '' || localValue === '-') {
      // Reset to current value if invalid
      const newDisplayValue = isPercentage ? value * 100 : value;
      setLocalValue(getFormattedDisplay(newDisplayValue));
    } else {
      // Clamp to min/max if specified
      let clamped = parsed;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);
      
      const storageValue = isPercentage ? clamped / 100 : clamped;
      onChange(storageValue);
      setLocalValue(getFormattedDisplay(clamped));
    }
  }, [localValue, value, isPercentage, min, max, onChange, getFormattedDisplay]);

  // Determine if we should use text input for formatted currency
  const inputType = (isCurrency || prefix === '$') ? 'text' : 'number';

  return (
    <div className="space-y-2 input-field-group">
      <div className="flex items-center gap-2">
        <Label 
          htmlFor={id} 
          className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
        >
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-slate-400 dark:text-slate-500 cursor-help hover:text-primary transition-colors" />
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="max-w-xs text-sm bg-slate-900 dark:bg-slate-800 text-white border-slate-700"
              >
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative input-highlight group">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm font-semibold transition-colors group-focus-within:text-primary">
            {prefix}
          </span>
        )}
        <Input
          ref={inputRef}
          id={id}
          type={inputType}
          inputMode="decimal"
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={inputType === 'number' ? min : undefined}
          max={inputType === 'number' ? max : undefined}
          step={inputType === 'number' ? step : undefined}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            font-mono tabular-nums text-right h-11
            bg-white dark:bg-slate-800/50
            border-slate-200 dark:border-slate-700
            focus:border-primary dark:focus:border-primary
            focus-visible:ring-primary/20
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-16' : ''}
            ${error ? 'border-red-500 dark:border-red-400 focus-visible:ring-red-500/20' : ''}
            transition-all duration-200
            hover:border-slate-300 dark:hover:border-slate-600
          `}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors group-focus-within:text-primary">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1">{error}</p>
      )}
    </div>
  );
}

export default NumberInput;
