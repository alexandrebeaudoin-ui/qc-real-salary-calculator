import type { Dispatch } from 'react'
import type { Expenses } from '../domain/types'
import type { Action } from '../state/AppState'
import { ExpenseList } from './ExpenseList'
import { NumberField } from './ui/NumberField'

interface DepensesSectionProps {
  expenses: Expenses
  dispatch: Dispatch<Action>
}

export function DepensesSection({ expenses, dispatch }: DepensesSectionProps) {
  return (
    <section className="card">
      <h2>Dépenses</h2>

      <NumberField
        label="Hypothèque (paiement mensuel)"
        value={expenses.mortgageMonthly}
        suffix="$/mois"
        step={50}
        onChange={(v) => dispatch({ type: 'UPDATE_MORTGAGE', value: v })}
      />

      <h3>Autres dépenses récurrentes</h3>
      <ExpenseList items={expenses.items} dispatch={dispatch} />
    </section>
  )
}
