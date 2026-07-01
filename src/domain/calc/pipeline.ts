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

export function computeBreakdown(state: AppState): Breakdown {
  const grossAnnual = computeGrossAnnual(state.income)

  // Simplification v1 : revenu imposable = revenu brut (on ignore la
  // déductibilité mineure de la part RRQ supplémentaire et du RQAP).
  const taxableIncome = grossAnnual

  const federalTaxBeforeAbatement = computeProgressiveTax(taxableIncome, state.federalTax)
  const federalAbatement = federalTaxBeforeAbatement * state.quebecAbatement
  const federalTaxNet = federalTaxBeforeAbatement - federalAbatement

  const quebecTax = computeProgressiveTax(taxableIncome, state.quebecTax)

  const contributions = computeContributions(grossAnnual, state.contributions)

  const afterTaxAndContributions =
    grossAnnual - federalTaxNet - quebecTax - contributions.total

  const totalFixedExpensesAnnual = computeTotalFixedExpensesAnnual(state)
  const disposableAnnual = afterTaxAndContributions - totalFixedExpensesAnnual

  const hoursPerYear = hoursWorkedPerYear(state.income)
  const grossHourly = computeGrossHourly(grossAnnual, hoursPerYear)
  const realHourly = computeGrossHourly(disposableAnnual, hoursPerYear)

  return {
    grossAnnual,
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
