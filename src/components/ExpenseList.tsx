import type { Dispatch } from 'react'
import type { Expense, ExpenseFrequency } from '../domain/types'
import type { Action } from '../state/AppState'

interface ExpenseListProps {
  items: Expense[]
  dispatch: Dispatch<Action>
}

const FREQUENCIES: ExpenseFrequency[] = ['hebdomadaire', 'mensuel', 'annuel']

export function ExpenseList({ items, dispatch }: ExpenseListProps) {
  return (
    <div className="expense-list">
      {items.map((item) => (
        <div key={item.id} className="expense-row">
          <input
            type="text"
            placeholder="Nom (ex. électricité)"
            value={item.name}
            onChange={(e) => dispatch({ type: 'UPDATE_EXPENSE', id: item.id, patch: { name: e.target.value } })}
          />
          <input
            type="number"
            min={0}
            value={item.amount}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_EXPENSE', id: item.id, patch: { amount: e.target.valueAsNumber || 0 } })
            }
          />
          <select
            value={item.frequency}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_EXPENSE',
                id: item.id,
                patch: { frequency: e.target.value as ExpenseFrequency },
              })
            }
          >
            {FREQUENCIES.map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-button"
            aria-label="Retirer cette dépense"
            onClick={() => dispatch({ type: 'REMOVE_EXPENSE', id: item.id })}
          >
            ✕
          </button>
        </div>
      ))}

      <button type="button" className="secondary" onClick={() => dispatch({ type: 'ADD_EXPENSE' })}>
        + Ajouter une dépense
      </button>
    </div>
  )
}
