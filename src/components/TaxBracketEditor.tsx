import type { TaxBracket, TaxSchedule } from '../domain/types'
import { formatCurrency } from '../utils/format'
import type { Action, TaxScheduleKind } from '../state/AppState'
import type { Dispatch } from 'react'

interface TaxBracketEditorProps {
  title: string
  which: TaxScheduleKind
  schedule: TaxSchedule
  dispatch: Dispatch<Action>
}

export function TaxBracketEditor({ title, which, schedule, dispatch }: TaxBracketEditorProps) {
  const sorted = [...schedule.brackets].sort((a, b) => a.threshold - b.threshold)

  function updateBracket(id: string, patch: Partial<TaxBracket>) {
    dispatch({ type: 'UPDATE_BRACKET', which, id, patch })
  }

  return (
    <fieldset className="bracket-editor">
      <legend>
        {title} ({schedule.year})
      </legend>

      <label className="bracket-editor__mpb">
        Montant personnel de base
        <input
          type="number"
          value={schedule.basicPersonalAmount}
          min={0}
          onChange={(e) =>
            dispatch({
              type: 'UPDATE_BASIC_PERSONAL_AMOUNT',
              which,
              value: e.target.valueAsNumber || 0,
            })
          }
        />
        <span className="hint">{formatCurrency(schedule.basicPersonalAmount)}</span>
      </label>

      <table className="bracket-table">
        <thead>
          <tr>
            <th>Seuil ($ dès)</th>
            <th>Taux (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((bracket) => (
            <tr key={bracket.id}>
              <td>
                <input
                  type="number"
                  value={bracket.threshold}
                  min={0}
                  onChange={(e) => updateBracket(bracket.id, { threshold: e.target.valueAsNumber || 0 })}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={Math.round(bracket.rate * 10000) / 100}
                  step={0.05}
                  min={0}
                  onChange={(e) => updateBracket(bracket.id, { rate: (e.target.valueAsNumber || 0) / 100 })}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Retirer ce palier"
                  onClick={() => dispatch({ type: 'REMOVE_BRACKET', which, id: bracket.id })}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className="secondary" onClick={() => dispatch({ type: 'ADD_BRACKET', which })}>
        + Ajouter un palier
      </button>
    </fieldset>
  )
}
