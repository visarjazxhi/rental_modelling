'use client';

/**
 * Disclaimer Banner Component
 * 
 * Displays a prominent disclaimer that this tool is for planning only
 * and does not constitute tax advice.
 */

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg hover:bg-amber-200 dark:hover:bg-amber-900/70 transition-colors z-50 border border-amber-200 dark:border-amber-800"
      >
        <AlertTriangle className="h-4 w-4" />
        Show Disclaimer
      </button>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          </div>
          <div className="flex-1 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold">Planning Tool Only — Not Tax Advice</p>
            <p className="mt-1 text-amber-700 dark:text-amber-300/80">
              This calculator provides estimates for planning purposes only and uses simplified 
              marginal tax rate calculations. Results are indicative only and should not be relied 
              upon for tax reporting. Always consult a registered tax agent for personalised tax advice.
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisclaimerBanner;
