import type { TaxSchedule } from '../types'

/**
 * Impôt progressif par paliers marginaux, moins le crédit non remboursable
 * du montant personnel de base (calculé au taux de la première tranche,
 * comme le fait réellement l'ARC / Revenu Québec).
 */
export function computeProgressiveTax(taxableIncome: number, schedule: TaxSchedule): number {
  if (taxableIncome <= 0 || schedule.brackets.length === 0) return 0

  const brackets = [...schedule.brackets].sort((a, b) => a.threshold - b.threshold)

  let tax = 0
  for (let i = 0; i < brackets.length; i++) {
    const lower = brackets[i].threshold
    if (taxableIncome <= lower) break
    const upper = brackets[i + 1]?.threshold ?? Infinity
    const taxedInBracket = Math.min(taxableIncome, upper) - lower
    tax += taxedInBracket * brackets[i].rate
  }

  const credit = schedule.basicPersonalAmount * brackets[0].rate
  return Math.max(0, tax - credit)
}
