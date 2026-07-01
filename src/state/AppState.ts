import { createDefaultState } from '../domain/defaults'
import type {
  AppState,
  ContributionRates,
  EiRates,
  Expense,
  ExpenseFrequency,
  IncomeProfile,
  QpipRates,
  QppRates,
  TaxBracket,
} from '../domain/types'

export type TaxScheduleKind = 'federal' | 'quebec'

export type Action =
  | { type: 'UPDATE_INCOME'; patch: Partial<IncomeProfile> }
  | { type: 'ADD_BRACKET'; which: TaxScheduleKind }
  | { type: 'UPDATE_BRACKET'; which: TaxScheduleKind; id: string; patch: Partial<TaxBracket> }
  | { type: 'REMOVE_BRACKET'; which: TaxScheduleKind; id: string }
  | { type: 'UPDATE_BASIC_PERSONAL_AMOUNT'; which: TaxScheduleKind; value: number }
  | { type: 'UPDATE_ABATEMENT'; value: number }
  | { type: 'UPDATE_QPP'; patch: Partial<QppRates> }
  | { type: 'UPDATE_QPIP'; patch: Partial<QpipRates> }
  | { type: 'UPDATE_EI'; patch: Partial<EiRates> }
  | { type: 'UPDATE_MORTGAGE'; value: number }
  | { type: 'ADD_EXPENSE' }
  | { type: 'UPDATE_EXPENSE'; id: string; patch: Partial<Expense> }
  | { type: 'REMOVE_EXPENSE'; id: string }
  | { type: 'RESET_DEFAULTS' }

function newId(): string {
  return crypto.randomUUID()
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_INCOME':
      return { ...state, income: { ...state.income, ...action.patch } }

    case 'ADD_BRACKET': {
      const key = action.which === 'federal' ? 'federalTax' : 'quebecTax'
      const schedule = state[key]
      const newBracket: TaxBracket = { id: newId(), threshold: 0, rate: 0 }
      return { ...state, [key]: { ...schedule, brackets: [...schedule.brackets, newBracket] } }
    }

    case 'UPDATE_BRACKET': {
      const key = action.which === 'federal' ? 'federalTax' : 'quebecTax'
      const schedule = state[key]
      return {
        ...state,
        [key]: {
          ...schedule,
          brackets: schedule.brackets.map((b) => (b.id === action.id ? { ...b, ...action.patch } : b)),
        },
      }
    }

    case 'REMOVE_BRACKET': {
      const key = action.which === 'federal' ? 'federalTax' : 'quebecTax'
      const schedule = state[key]
      return {
        ...state,
        [key]: { ...schedule, brackets: schedule.brackets.filter((b) => b.id !== action.id) },
      }
    }

    case 'UPDATE_BASIC_PERSONAL_AMOUNT': {
      const key = action.which === 'federal' ? 'federalTax' : 'quebecTax'
      return { ...state, [key]: { ...state[key], basicPersonalAmount: action.value } }
    }

    case 'UPDATE_ABATEMENT':
      return { ...state, quebecAbatement: action.value }

    case 'UPDATE_QPP':
      return {
        ...state,
        contributions: { ...state.contributions, qpp: { ...state.contributions.qpp, ...action.patch } },
      }

    case 'UPDATE_QPIP':
      return {
        ...state,
        contributions: { ...state.contributions, qpip: { ...state.contributions.qpip, ...action.patch } },
      }

    case 'UPDATE_EI':
      return {
        ...state,
        contributions: { ...state.contributions, ei: { ...state.contributions.ei, ...action.patch } },
      }

    case 'UPDATE_MORTGAGE':
      return { ...state, expenses: { ...state.expenses, mortgageMonthly: action.value } }

    case 'ADD_EXPENSE': {
      const newExpense: Expense = { id: newId(), name: '', amount: 0, frequency: 'mensuel' as ExpenseFrequency }
      return { ...state, expenses: { ...state.expenses, items: [...state.expenses.items, newExpense] } }
    }

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: {
          ...state.expenses,
          items: state.expenses.items.map((e) => (e.id === action.id ? { ...e, ...action.patch } : e)),
        },
      }

    case 'REMOVE_EXPENSE':
      return {
        ...state,
        expenses: { ...state.expenses, items: state.expenses.items.filter((e) => e.id !== action.id) },
      }

    case 'RESET_DEFAULTS':
      return createDefaultState()

    default:
      return state
  }
}

export type { AppState, ContributionRates }
