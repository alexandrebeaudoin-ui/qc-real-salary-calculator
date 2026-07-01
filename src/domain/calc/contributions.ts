import type { ContributionRates } from '../types'

export function computeQppContribution(grossAnnual: number, qpp: ContributionRates['qpp']): number {
  const baseEarnings = Math.max(0, Math.min(grossAnnual, qpp.maxPensionable) - qpp.exemption)
  const baseContribution = baseEarnings * qpp.baseRate

  const secondEarnings = Math.max(
    0,
    Math.min(grossAnnual, qpp.secondCeiling) - qpp.maxPensionable,
  )
  const secondContribution = secondEarnings * qpp.secondRate

  return baseContribution + secondContribution
}

export function computeQpipContribution(grossAnnual: number, qpip: ContributionRates['qpip']): number {
  return Math.min(grossAnnual, qpip.maxInsurable) * qpip.employeeRate
}

export function computeEiContribution(grossAnnual: number, ei: ContributionRates['ei']): number {
  return Math.min(grossAnnual, ei.maxInsurable) * ei.employeeRate
}

export interface ContributionsResult {
  qpp: number
  qpip: number
  ei: number
  total: number
}

export function computeContributions(grossAnnual: number, rates: ContributionRates): ContributionsResult {
  const qpp = computeQppContribution(grossAnnual, rates.qpp)
  const qpip = computeQpipContribution(grossAnnual, rates.qpip)
  const ei = computeEiContribution(grossAnnual, rates.ei)
  return { qpp, qpip, ei, total: qpp + qpip + ei }
}
