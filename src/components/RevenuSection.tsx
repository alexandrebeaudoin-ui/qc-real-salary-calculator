import type { Dispatch } from 'react'
import type { IncomeProfile } from '../domain/types'
import { computeGrossAnnual, computeGrossHourly, hoursWorkedPerYear } from '../domain/calc/income'
import { formatCurrency, formatCurrencyPrecise } from '../utils/format'
import type { Action } from '../state/AppState'
import { NumberField } from './ui/NumberField'

interface RevenuSectionProps {
  income: IncomeProfile
  dispatch: Dispatch<Action>
}

export function RevenuSection({ income, dispatch }: RevenuSectionProps) {
  const grossAnnual = computeGrossAnnual(income)
  const hours = hoursWorkedPerYear(income)
  const grossHourly = computeGrossHourly(grossAnnual, hours)

  function update(patch: Partial<IncomeProfile>) {
    dispatch({ type: 'UPDATE_INCOME', patch })
  }

  return (
    <section className="card">
      <h2>Revenu</h2>

      <div className="mode-toggle">
        <label>
          <input
            type="radio"
            name="mode"
            checked={income.mode === 'annuel'}
            onChange={() => update({ mode: 'annuel' })}
          />
          Salaire annuel
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            checked={income.mode === 'horaire'}
            onChange={() => update({ mode: 'horaire' })}
          />
          Salaire horaire
        </label>
      </div>

      <div className="field-grid">
        {income.mode === 'annuel' ? (
          <NumberField
            label="Salaire annuel brut"
            value={income.annualSalary}
            suffix="$"
            step={500}
            onChange={(v) => update({ annualSalary: v })}
          />
        ) : (
          <NumberField
            label="Taux horaire brut"
            value={income.hourlyRate}
            suffix="$/h"
            step={0.25}
            onChange={(v) => update({ hourlyRate: v })}
          />
        )}

        <NumberField
          label="Heures travaillées / semaine"
          value={income.hoursPerWeek}
          suffix="h"
          step={1}
          onChange={(v) => update({ hoursPerWeek: v })}
        />
        <NumberField
          label="Semaines / année"
          value={income.weeksPerYear}
          suffix="sem"
          step={1}
          onChange={(v) => update({ weeksPerYear: v })}
        />
        <NumberField
          label="Semaines de vacances payées"
          value={income.paidVacationWeeks}
          suffix="sem"
          step={1}
          onChange={(v) => update({ paidVacationWeeks: v })}
        />
        <NumberField
          label="Semaines non payées"
          value={income.unpaidWeeks}
          suffix="sem"
          step={1}
          onChange={(v) => update({ unpaidWeeks: v })}
        />
      </div>

      <p className="hint">
        ≈ {formatCurrency(grossAnnual)} / an · ≈ {formatCurrencyPrecise(grossHourly)} / h · {Math.round(hours)} h
        réellement travaillées / an
      </p>
    </section>
  )
}
