import type { Dispatch } from 'react'
import type { AppState } from '../domain/types'
import type { Action } from '../state/AppState'
import { TaxBracketEditor } from './TaxBracketEditor'
import { NumberField } from './ui/NumberField'

interface ParametresFiscauxSectionProps {
  state: AppState
  dispatch: Dispatch<Action>
}

export function ParametresFiscauxSection({ state, dispatch }: ParametresFiscauxSectionProps) {
  const { qpp, qpip, ei } = state.contributions

  return (
    <section className="card">
      <h2>Paramètres fiscaux</h2>

      <TaxBracketEditor title="Impôt fédéral" which="federal" schedule={state.federalTax} dispatch={dispatch} />
      <TaxBracketEditor title="Impôt du Québec" which="quebec" schedule={state.quebecTax} dispatch={dispatch} />

      <fieldset>
        <legend>Abattement du Québec</legend>
        <NumberField
          label="Réduction de l'impôt fédéral pour résidents du Québec"
          value={Math.round(state.quebecAbatement * 10000) / 100}
          suffix="%"
          step={0.1}
          onChange={(v) => dispatch({ type: 'UPDATE_ABATEMENT', value: v / 100 })}
        />
      </fieldset>

      <fieldset>
        <legend>Cotisations sociales</legend>

        <h3>RRQ (Régime de rentes du Québec)</h3>
        <div className="field-grid">
          <NumberField
            label="Exemption générale"
            value={qpp.exemption}
            suffix="$"
            step={100}
            onChange={(v) => dispatch({ type: 'UPDATE_QPP', patch: { exemption: v } })}
          />
          <NumberField
            label="Maximum des gains admissibles (MGA)"
            value={qpp.maxPensionable}
            suffix="$"
            step={100}
            onChange={(v) => dispatch({ type: 'UPDATE_QPP', patch: { maxPensionable: v } })}
          />
          <NumberField
            label="Taux de base (employé)"
            value={Math.round(qpp.baseRate * 10000) / 100}
            suffix="%"
            step={0.05}
            onChange={(v) => dispatch({ type: 'UPDATE_QPP', patch: { baseRate: v / 100 } })}
          />
          <NumberField
            label="2e plafond (MSGA)"
            value={qpp.secondCeiling}
            suffix="$"
            step={100}
            onChange={(v) => dispatch({ type: 'UPDATE_QPP', patch: { secondCeiling: v } })}
          />
          <NumberField
            label="Taux régime supplémentaire"
            value={Math.round(qpp.secondRate * 10000) / 100}
            suffix="%"
            step={0.05}
            onChange={(v) => dispatch({ type: 'UPDATE_QPP', patch: { secondRate: v / 100 } })}
          />
        </div>

        <h3>RQAP (Régime québécois d'assurance parentale)</h3>
        <div className="field-grid">
          <NumberField
            label="Maximum assurable"
            value={qpip.maxInsurable}
            suffix="$"
            step={100}
            onChange={(v) => dispatch({ type: 'UPDATE_QPIP', patch: { maxInsurable: v } })}
          />
          <NumberField
            label="Taux (employé)"
            value={Math.round(qpip.employeeRate * 100000) / 1000}
            suffix="%"
            step={0.01}
            onChange={(v) => dispatch({ type: 'UPDATE_QPIP', patch: { employeeRate: v / 100 } })}
          />
        </div>

        <h3>Assurance-emploi (taux réduit Québec)</h3>
        <div className="field-grid">
          <NumberField
            label="Maximum assurable"
            value={ei.maxInsurable}
            suffix="$"
            step={100}
            onChange={(v) => dispatch({ type: 'UPDATE_EI', patch: { maxInsurable: v } })}
          />
          <NumberField
            label="Taux (employé)"
            value={Math.round(ei.employeeRate * 100000) / 1000}
            suffix="%"
            step={0.01}
            onChange={(v) => dispatch({ type: 'UPDATE_EI', patch: { employeeRate: v / 100 } })}
          />
        </div>
      </fieldset>

      <button type="button" className="secondary" onClick={() => dispatch({ type: 'RESET_DEFAULTS' })}>
        Réinitialiser aux valeurs par défaut (2026)
      </button>
    </section>
  )
}
