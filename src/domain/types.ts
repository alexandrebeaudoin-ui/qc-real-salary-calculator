export type SalaryInputMode = 'horaire' | 'annuel'

export interface IncomeProfile {
  mode: SalaryInputMode
  hourlyRate: number
  annualSalary: number
  hoursPerWeek: number
  weeksPerYear: number
  paidVacationWeeks: number
  unpaidWeeks: number
}

export interface TaxBracket {
  id: string
  threshold: number
  rate: number
}

export interface TaxSchedule {
  year: number
  brackets: TaxBracket[]
  basicPersonalAmount: number
}

export interface QppRates {
  exemption: number
  maxPensionable: number
  baseRate: number
  secondCeiling: number
  secondRate: number
}

export interface QpipRates {
  maxInsurable: number
  employeeRate: number
}

export interface EiRates {
  maxInsurable: number
  employeeRate: number
}

export interface ContributionRates {
  qpp: QppRates
  qpip: QpipRates
  ei: EiRates
}

export type ExpenseFrequency = 'hebdomadaire' | 'mensuel' | 'annuel'

export interface Expense {
  id: string
  name: string
  amount: number
  frequency: ExpenseFrequency
}

export interface Expenses {
  mortgageMonthly: number
  items: Expense[]
}

export interface AppState {
  version: number
  income: IncomeProfile
  federalTax: TaxSchedule
  quebecTax: TaxSchedule
  quebecAbatement: number
  contributions: ContributionRates
  expenses: Expenses
}

export interface Breakdown {
  grossAnnual: number
  federalTaxBeforeAbatement: number
  federalAbatement: number
  federalTaxNet: number
  quebecTax: number
  qppContribution: number
  qpipContribution: number
  eiContribution: number
  totalContributions: number
  afterTaxAndContributions: number
  totalFixedExpensesAnnual: number
  disposableAnnual: number
  hoursWorkedPerYear: number
  grossHourly: number
  realHourly: number
}
