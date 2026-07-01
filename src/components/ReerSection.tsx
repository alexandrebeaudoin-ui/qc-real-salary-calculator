import type { Dispatch } from 'react'
import type { RrspContribution } from '../domain/types'
import type { Action } from '../state/AppState'
import { formatCurrency } from '../utils/format'
import { NumberField } from './ui/NumberField'

interface ReerSectionProps {
  rrsp: RrspContribution
  grossAnnual: number
  dispatch: Dispatch<Action>
}

export function ReerSection({ rrsp, grossAnnual, dispatch }: ReerSectionProps) {
  function update(patch: Partial<RrspContribution>) {
    dispatch({ type: 'UPDATE_RRSP', patch })
  }

  const estimatedAnnual =
    rrsp.mode === 'pourcentage' ? grossAnnual * (rrsp.percentage / 100) : rrsp.annualAmount

  return (
    <section className="card">
      <h2>Cotisation REER (optionnelle)</h2>

      <label className="checkbox-field">
        <input type="checkbox" checked={rrsp.enabled} onChange={(e) => update({ enabled: e.target.checked })} />
        Déduire automatiquement une cotisation REER de mon revenu imposable
      </label>

      {rrsp.enabled && (
        <>
          <div className="mode-toggle">
            <label>
              <input
                type="radio"
                name="rrsp-mode"
                checked={rrsp.mode === 'pourcentage'}
                onChange={() => update({ mode: 'pourcentage' })}
              />
              % du salaire brut
            </label>
            <label>
              <input
                type="radio"
                name="rrsp-mode"
                checked={rrsp.mode === 'montant'}
                onChange={() => update({ mode: 'montant' })}
              />
              Montant fixe par année
            </label>
          </div>

          <div className="field-grid">
            {rrsp.mode === 'pourcentage' ? (
              <NumberField
                label="Pourcentage du salaire brut"
                value={rrsp.percentage}
                suffix="%"
                step={0.5}
                onChange={(v) => update({ percentage: v })}
              />
            ) : (
              <NumberField
                label="Montant annuel"
                value={rrsp.annualAmount}
                suffix="$"
                step={100}
                onChange={(v) => update({ annualAmount: v })}
              />
            )}
          </div>

          <p className="hint">
            ≈ {formatCurrency(estimatedAnnual)} / an. La cotisation REER réduit votre revenu imposable (impôt
            fédéral et québécois) mais n'est pas disponible pour vos dépenses courantes — elle est donc aussi
            retirée du revenu disponible.
          </p>
        </>
      )}
    </section>
  )
}
