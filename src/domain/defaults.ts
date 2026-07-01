import type { AppState, ContributionRates, IncomeProfile, TaxSchedule } from './types'

export const STORAGE_VERSION = 1

// Barèmes 2026, indexés par l'ARC et Revenu Québec (janvier 2026).
// Modifiables par l'utilisateur dans l'UI — ce ne sont que des valeurs de départ.
export const DEFAULT_FEDERAL_TAX: TaxSchedule = {
  year: 2026,
  basicPersonalAmount: 16452,
  brackets: [
    { id: 'fed-1', threshold: 0, rate: 0.14 },
    { id: 'fed-2', threshold: 58523, rate: 0.205 },
    { id: 'fed-3', threshold: 117045, rate: 0.26 },
    { id: 'fed-4', threshold: 181440, rate: 0.29 },
    { id: 'fed-5', threshold: 258482, rate: 0.33 },
  ],
}

export const DEFAULT_QUEBEC_TAX: TaxSchedule = {
  year: 2026,
  basicPersonalAmount: 18952,
  brackets: [
    { id: 'qc-1', threshold: 0, rate: 0.14 },
    { id: 'qc-2', threshold: 54345, rate: 0.19 },
    { id: 'qc-3', threshold: 108680, rate: 0.24 },
    { id: 'qc-4', threshold: 132245, rate: 0.2575 },
  ],
}

// Abattement du Québec : réduction de l'impôt fédéral de base pour les résidents du Québec.
export const DEFAULT_QUEBEC_ABATEMENT = 0.165

export const DEFAULT_CONTRIBUTIONS: ContributionRates = {
  qpp: {
    exemption: 3500,
    maxPensionable: 74600,
    baseRate: 0.053,
    secondCeiling: 85000,
    secondRate: 0.04,
  },
  qpip: {
    maxInsurable: 99500,
    employeeRate: 0.00494,
  },
  ei: {
    maxInsurable: 68900,
    employeeRate: 0.013,
  },
}

export const DEFAULT_INCOME: IncomeProfile = {
  mode: 'annuel',
  hourlyRate: 25,
  annualSalary: 60000,
  hoursPerWeek: 40,
  weeksPerYear: 52,
  paidVacationWeeks: 2,
  unpaidWeeks: 0,
}

export function createDefaultState(): AppState {
  return {
    version: STORAGE_VERSION,
    income: { ...DEFAULT_INCOME },
    federalTax: {
      ...DEFAULT_FEDERAL_TAX,
      brackets: DEFAULT_FEDERAL_TAX.brackets.map((b) => ({ ...b })),
    },
    quebecTax: {
      ...DEFAULT_QUEBEC_TAX,
      brackets: DEFAULT_QUEBEC_TAX.brackets.map((b) => ({ ...b })),
    },
    quebecAbatement: DEFAULT_QUEBEC_ABATEMENT,
    contributions: {
      qpp: { ...DEFAULT_CONTRIBUTIONS.qpp },
      qpip: { ...DEFAULT_CONTRIBUTIONS.qpip },
      ei: { ...DEFAULT_CONTRIBUTIONS.ei },
    },
    expenses: {
      mortgageMonthly: 0,
      items: [],
    },
  }
}
