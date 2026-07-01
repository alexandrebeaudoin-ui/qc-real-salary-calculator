import type { AppState, Breakdown, Expense } from '../types'
import { computeContributions } from './contributions'
import { computeGrossAnnual, computeGrossHourly, hoursWorkedPerYear } from './income'
import { computeProgressiveTax } from './progressiveTax'

function expenseToAnnual(expense: Expense): number {
  switch (expense.frequency) {
    case 'hebdomadaire':
      return expense.amount * 52
    case 'mensuel':
      return expense.amount * 12
    case 'annuel':
      return expense.amount
  }
}

export function computeTotalFixedExpensesAnnual(state: AppState): number {
  const mortgageAnnual = state.expenses.mortgageMonthly * 12
  const itemsAnnual = state.expenses.items.reduce((sum, item) => sum + expenseToAnnual(item), 0)
  return mortgageAnnual + itemsAnnual
}

export function computeRrspContribution(grossAnnual: number, rrsp: AppState['rrsp']): number {
  if (!rrsp.enabled) return 0
  const amount = rrsp.mode === 'pourcentage' ? grossAnnual * (rrsp.percentage / 100) : rrsp.annualAmount
  return Math.max(0, Math.min(amount, grossAnnual))
}

export function computeBreakdown(state: AppState): Breakdown {
  const grossAnnual = computeGrossAnnual(state.income)

  const rrspContribution = computeRrspContribution(grossAnnual, state.rrsp)

  // Simplification v1 : le revenu imposable = revenu brut moins la cotisation
  // REER (pleinement déductible). On ignore la déductibilité mineure de la
  // part RRQ supplémentaire et du RQAP.
  const taxableIncome = grossAnnual - rrspContribution

  const federalTaxBeforeAbatement = computeProgressiveTax(taxableIncome, state.federalTax)
  const federalAbatement = federalTaxBeforeAbatement * state.quebecAbatement
  const federalTaxNet = federalTaxBeforeAbatement - federalAbatement

  const quebecTax = computeProgressiveTax(taxableIncome, state.quebecTax)

  // Les cotisations RRQ/RQAP/AE sont basées sur le salaire brut, pas sur le
  // revenu imposable après REER.
  const contributions = computeContributions(grossAnnual, state.contributions)

  const afterTaxAndContributions =
    grossAnnual - rrspContribution - federalTaxNet - quebecTax - contributions.total

  const totalFixedExpensesAnnual = computeTotalFixedExpensesAnnual(state)
  const disposableAnnual = afterTaxAndContributions - totalFixedExpensesAnnual

  const hoursPerYear = hoursWorkedPerYear(state.income)
  const grossHourly = computeGrossHourly(grossAnnual, hoursPerYear)
  const realHourly = computeGrossHourly(disposableAnnual, hoursPerYear)

  return {
    grossAnnual,
    rrspContribution,
    taxableIncome,
    federalTaxBeforeAbatement,
    federalAbatement,
    federalTaxNet,
    quebecTax,
    qppContribution: contributions.qpp,
    qpipContribution: contributions.qpip,
    eiContribution: contributions.ei,
    totalContributions: contributions.total,
    afterTaxAndContributions,
    totalFixedExpensesAnnual,
    disposableAnnual,
    hoursWorkedPerYear: hoursPerYear,
    grossHourly,
    realHourly,
  }
}
