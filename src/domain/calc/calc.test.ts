import { describe, expect, it } from 'vitest'
import { createDefaultState } from '../defaults'
import { computeContributions } from './contributions'
import { computeGrossAnnual, hoursWorkedPerYear } from './income'
import { computeBreakdown } from './pipeline'
import { computeProgressiveTax } from './progressiveTax'
import type { TaxSchedule } from '../types'

const simpleSchedule: TaxSchedule = {
  year: 2026,
  basicPersonalAmount: 10000,
  brackets: [
    { id: 'a', threshold: 0, rate: 0.1 },
    { id: 'b', threshold: 50000, rate: 0.2 },
  ],
}

describe('computeProgressiveTax', () => {
  it('returns 0 for income at or below the basic personal amount', () => {
    expect(computeProgressiveTax(0, simpleSchedule)).toBe(0)
    expect(computeProgressiveTax(10000, simpleSchedule)).toBe(0)
  })

  it('applies marginal rates across brackets correctly', () => {
    // 60 000 imposable : 50 000 * 10% + 10 000 * 20% = 5000 + 2000 = 7000
    // moins crédit MPB = 10 000 * 10% = 1000 -> 6000
    expect(computeProgressiveTax(60000, simpleSchedule)).toBeCloseTo(6000, 5)
  })

  it('is monotonic increasing with income', () => {
    const low = computeProgressiveTax(40000, simpleSchedule)
    const high = computeProgressiveTax(80000, simpleSchedule)
    expect(high).toBeGreaterThan(low)
  })
})

describe('computeContributions', () => {
  const state = createDefaultState()

  it('applies the RRQ exemption', () => {
    const result = computeContributions(3000, state.contributions)
    expect(result.qpp).toBe(0)
  })

  it('caps contributions at the maximum insurable/pensionable earnings', () => {
    const result = computeContributions(500000, state.contributions)
    const { exemption, maxPensionable, baseRate, secondCeiling, secondRate } = state.contributions.qpp
    const expectedQpp =
      (maxPensionable - exemption) * baseRate + (secondCeiling - maxPensionable) * secondRate
    expect(result.qpp).toBeCloseTo(expectedQpp, 5)
    expect(result.qpip).toBeCloseTo(state.contributions.qpip.maxInsurable * state.contributions.qpip.employeeRate, 5)
    expect(result.ei).toBeCloseTo(state.contributions.ei.maxInsurable * state.contributions.ei.employeeRate, 5)
  })
})

describe('income conversions', () => {
  it('round-trips hourly and annual mode for the same effective wage', () => {
    const state = createDefaultState()
    state.income.mode = 'annuel'
    state.income.annualSalary = 62400 // 30$/h * 40h * 52sem
    state.income.hoursPerWeek = 40
    state.income.weeksPerYear = 52
    state.income.unpaidWeeks = 0

    const grossFromAnnual = computeGrossAnnual(state.income)

    state.income.mode = 'horaire'
    state.income.hourlyRate = 30
    const grossFromHourly = computeGrossAnnual(state.income)

    expect(grossFromAnnual).toBeCloseTo(grossFromHourly, 5)
  })

  it('paid vacation weeks reduce hours worked without reducing gross pay', () => {
    const state = createDefaultState()
    state.income.mode = 'annuel'
    state.income.annualSalary = 60000
    state.income.unpaidWeeks = 0

    state.income.paidVacationWeeks = 0
    const hoursNoVacation = hoursWorkedPerYear(state.income)
    const grossNoVacation = computeGrossAnnual(state.income)

    state.income.paidVacationWeeks = 4
    const hoursWithVacation = hoursWorkedPerYear(state.income)
    const grossWithVacation = computeGrossAnnual(state.income)

    expect(hoursWithVacation).toBeLessThan(hoursNoVacation)
    expect(grossWithVacation).toBeCloseTo(grossNoVacation, 5)
  })
})

describe('computeBreakdown end-to-end sanity', () => {
  it('produces a plausible net for a 60k$/year, 40h/week profile', () => {
    const state = createDefaultState()
    state.income = {
      mode: 'annuel',
      annualSalary: 60000,
      hourlyRate: 0,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      paidVacationWeeks: 0,
      unpaidWeeks: 0,
    }
    state.expenses = { mortgageMonthly: 0, items: [] }

    const breakdown = computeBreakdown(state)

    expect(breakdown.grossHourly).toBeCloseTo(60000 / 2080, 2)
    expect(breakdown.afterTaxAndContributions).toBeLessThan(breakdown.grossAnnual)
    expect(breakdown.afterTaxAndContributions).toBeGreaterThan(40000)
    expect(breakdown.afterTaxAndContributions).toBeLessThan(50000)
    expect(breakdown.realHourly).toBeLessThan(breakdown.grossHourly)
    expect(breakdown.realHourly).toBeGreaterThan(breakdown.grossHourly * 0.6)
  })

  it('reduces disposable income and real hourly wage when fixed expenses are added', () => {
    const state = createDefaultState()
    state.income = {
      mode: 'annuel',
      annualSalary: 60000,
      hourlyRate: 0,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      paidVacationWeeks: 0,
      unpaidWeeks: 0,
    }
    state.expenses = { mortgageMonthly: 0, items: [] }
    const withoutExpenses = computeBreakdown(state)

    state.expenses = { mortgageMonthly: 1500, items: [{ id: 'e1', name: 'Divers', amount: 800, frequency: 'mensuel' }] }
    const withExpenses = computeBreakdown(state)

    expect(withExpenses.totalFixedExpensesAnnual).toBeCloseTo((1500 + 800) * 12, 5)
    expect(withExpenses.realHourly).toBeLessThan(withoutExpenses.realHourly)
  })

  it('increases real hourly wage when paid vacation weeks increase', () => {
    const state = createDefaultState()
    state.income = {
      mode: 'annuel',
      annualSalary: 60000,
      hourlyRate: 0,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      paidVacationWeeks: 0,
      unpaidWeeks: 0,
    }
    const noVacation = computeBreakdown(state)

    state.income.paidVacationWeeks = 4
    const withVacation = computeBreakdown(state)

    expect(withVacation.disposableAnnual).toBeCloseTo(noVacation.disposableAnnual, 5)
    expect(withVacation.realHourly).toBeGreaterThan(noVacation.realHourly)
  })

  it('RRSP contribution reduces taxable income and disposable income by less than the full amount', () => {
    const state = createDefaultState()
    state.income = {
      mode: 'annuel',
      annualSalary: 60000,
      hourlyRate: 0,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      paidVacationWeeks: 0,
      unpaidWeeks: 0,
    }
    const withoutRrsp = computeBreakdown(state)

    state.rrsp = { enabled: true, mode: 'montant', annualAmount: 5000, percentage: 0 }
    const withRrsp = computeBreakdown(state)

    expect(withRrsp.taxableIncome).toBeCloseTo(withoutRrsp.taxableIncome - 5000, 5)
    // Les cotisations RRQ/RQAP/AE restent basées sur le brut, pas sur le revenu imposable après REER.
    expect(withRrsp.totalContributions).toBeCloseTo(withoutRrsp.totalContributions, 5)
    // Le disponible baisse, mais de moins de 5000$ grâce à l'économie d'impôt.
    const drop = withoutRrsp.disposableAnnual - withRrsp.disposableAnnual
    expect(drop).toBeLessThan(5000)
    expect(drop).toBeGreaterThan(0)
  })

  it('RRSP contribution is disabled by default and has no effect when disabled', () => {
    const state = createDefaultState()
    expect(state.rrsp.enabled).toBe(false)
    const breakdown = computeBreakdown(state)
    expect(breakdown.rrspContribution).toBe(0)
  })

  it('respects user-edited brackets (zeroing all rates removes income tax)', () => {
    const state = createDefaultState()
    state.federalTax.brackets = state.federalTax.brackets.map((b) => ({ ...b, rate: 0 }))
    state.quebecTax.brackets = state.quebecTax.brackets.map((b) => ({ ...b, rate: 0 }))

    const breakdown = computeBreakdown(state)

    expect(breakdown.federalTaxNet).toBe(0)
    expect(breakdown.quebecTax).toBe(0)
    expect(breakdown.afterTaxAndContributions).toBeCloseTo(
      breakdown.grossAnnual - breakdown.totalContributions,
      5,
    )
  })
})
