import type { IncomeProfile } from '../types'

export function hoursWorkedPerYear(income: IncomeProfile): number {
  const weeksWorked = Math.max(
    0,
    income.weeksPerYear - income.paidVacationWeeks - income.unpaidWeeks,
  )
  return income.hoursPerWeek * weeksWorked
}

/**
 * Salaire brut annuel réellement versé, en tenant compte des semaines non
 * payées (les vacances payées n'affectent pas le montant versé, seulement
 * les heures travaillées).
 */
export function computeGrossAnnual(income: IncomeProfile): number {
  const paidWeeks = Math.max(0, income.weeksPerYear - income.unpaidWeeks)

  if (income.mode === 'annuel') {
    return income.annualSalary * (paidWeeks / income.weeksPerYear)
  }

  return income.hourlyRate * income.hoursPerWeek * paidWeeks
}

export function computeGrossHourly(grossAnnual: number, hoursPerYear: number): number {
  if (hoursPerYear <= 0) return 0
  return grossAnnual / hoursPerYear
}
