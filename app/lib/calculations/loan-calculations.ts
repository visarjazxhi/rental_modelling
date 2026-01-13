/**
 * Loan Calculations
 * Pure functions for calculating loan repayments and amortization
 * 
 * Implements standard mortgage calculation formulas for:
 * - Principal & Interest (P&I) repayments
 * - Interest-only repayments
 * - Total interest over loan term
 */

/**
 * Calculate monthly P&I repayment using standard amortization formula
 * 
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 *   M = Monthly payment
 *   P = Principal (loan amount)
 *   r = Monthly interest rate (annual rate / 12)
 *   n = Total number of payments (years * 12)
 * 
 * @param loanAmount - Principal loan amount
 * @param annualInterestRate - Annual interest rate as decimal (e.g., 0.06 = 6%)
 * @param loanTermYears - Loan term in years
 * @returns Monthly P&I repayment amount
 * 
 * @example
 * // $480,000 loan at 6% for 30 years
 * calculateMonthlyPIRepayment(480000, 0.06, 30) // Returns ~$2,878.05
 */
export function calculateMonthlyPIRepayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (loanAmount <= 0 || loanTermYears <= 0) return 0;
  if (annualInterestRate <= 0) return loanAmount / (loanTermYears * 12);
  
  const monthlyRate = annualInterestRate / 12;
  const numberOfPayments = loanTermYears * 12;
  
  const factor = Math.pow(1 + monthlyRate, numberOfPayments);
  const monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
  
  return monthlyPayment;
}

/**
 * Calculate monthly interest-only repayment
 * 
 * Formula: M = P * r / 12
 * 
 * @param loanAmount - Principal loan amount
 * @param annualInterestRate - Annual interest rate as decimal
 * @returns Monthly interest-only repayment amount
 * 
 * @example
 * // $480,000 loan at 6%
 * calculateMonthlyIORepayment(480000, 0.06) // Returns $2,400
 */
export function calculateMonthlyIORepayment(
  loanAmount: number,
  annualInterestRate: number
): number {
  if (loanAmount <= 0 || annualInterestRate <= 0) return 0;
  return (loanAmount * annualInterestRate) / 12;
}

/**
 * Calculate total interest paid over loan term for P&I loan
 * 
 * @param loanAmount - Principal loan amount
 * @param annualInterestRate - Annual interest rate as decimal
 * @param loanTermYears - Loan term in years
 * @returns Total interest paid over the full term
 * 
 * @example
 * // $480,000 loan at 6% for 30 years
 * calculateTotalInterestPI(480000, 0.06, 30) // Returns ~$556,099
 */
export function calculateTotalInterestPI(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  const monthlyPayment = calculateMonthlyPIRepayment(loanAmount, annualInterestRate, loanTermYears);
  const totalPayments = monthlyPayment * loanTermYears * 12;
  return totalPayments - loanAmount;
}

/**
 * Calculate total interest paid for interest-only loan (over specified period)
 * 
 * @param loanAmount - Principal loan amount
 * @param annualInterestRate - Annual interest rate as decimal
 * @param years - Number of years
 * @returns Total interest paid over the period
 */
export function calculateTotalInterestIO(
  loanAmount: number,
  annualInterestRate: number,
  years: number
): number {
  return loanAmount * annualInterestRate * years;
}

/**
 * Loan comparison results
 */
export interface LoanComparisonResults {
  /** Monthly P&I repayment */
  monthlyPI: number;
  /** Annual P&I repayments */
  annualPI: number;
  /** Monthly I/O repayment */
  monthlyIO: number;
  /** Annual I/O repayments */
  annualIO: number;
  /** Monthly savings with I/O (vs P&I) */
  monthlySavingsIO: number;
  /** Total interest over term with P&I */
  totalInterestPI: number;
  /** Total interest over term with I/O */
  totalInterestIO: number;
  /** Additional interest cost with I/O */
  extraInterestIO: number;
  /** Principal remaining after term with I/O */
  principalRemainingIO: number;
}

/**
 * Calculate comprehensive loan comparison between P&I and I/O
 * 
 * @param loanAmount - Principal loan amount
 * @param annualInterestRate - Annual interest rate as decimal
 * @param loanTermYears - Loan term in years
 * @returns Comprehensive comparison results
 */
export function calculateLoanComparison(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): LoanComparisonResults {
  const monthlyPI = calculateMonthlyPIRepayment(loanAmount, annualInterestRate, loanTermYears);
  const monthlyIO = calculateMonthlyIORepayment(loanAmount, annualInterestRate);
  const totalInterestPI = calculateTotalInterestPI(loanAmount, annualInterestRate, loanTermYears);
  const totalInterestIO = calculateTotalInterestIO(loanAmount, annualInterestRate, loanTermYears);
  
  return {
    monthlyPI,
    annualPI: monthlyPI * 12,
    monthlyIO,
    annualIO: monthlyIO * 12,
    monthlySavingsIO: monthlyPI - monthlyIO,
    totalInterestPI,
    totalInterestIO,
    extraInterestIO: totalInterestIO - totalInterestPI,
    principalRemainingIO: loanAmount, // I/O never reduces principal
  };
}

/**
 * Generate amortization schedule summary (first year, 5 year, 10 year milestones)
 */
export interface AmortizationMilestone {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

/**
 * Calculate amortization milestones for key years
 * 
 * @param loanAmount - Principal loan amount
 * @param annualInterestRate - Annual interest rate as decimal
 * @param loanTermYears - Loan term in years
 * @returns Array of milestone summaries
 */
export function calculateAmortizationMilestones(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number
): AmortizationMilestone[] {
  if (loanAmount <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
    return [];
  }
  
  const monthlyRate = annualInterestRate / 12;
  const monthlyPayment = calculateMonthlyPIRepayment(loanAmount, annualInterestRate, loanTermYears);
  
  const milestoneYears = [1, 5, 10, 15, 20, 25, 30].filter(y => y <= loanTermYears);
  const milestones: AmortizationMilestone[] = [];
  
  let balance = loanAmount;
  let totalPrincipalPaid = 0;
  let totalInterestPaid = 0;
  let currentMilestoneIndex = 0;
  
  for (let month = 1; month <= loanTermYears * 12 && currentMilestoneIndex < milestoneYears.length; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    balance -= principalPayment;
    totalPrincipalPaid += principalPayment;
    totalInterestPaid += interestPayment;
    
    // Check if we've hit a milestone year
    if (month === milestoneYears[currentMilestoneIndex] * 12) {
      milestones.push({
        year: milestoneYears[currentMilestoneIndex],
        principalPaid: totalPrincipalPaid,
        interestPaid: totalInterestPaid,
        remainingBalance: Math.max(0, balance),
      });
      currentMilestoneIndex++;
    }
  }
  
  return milestones;
}
