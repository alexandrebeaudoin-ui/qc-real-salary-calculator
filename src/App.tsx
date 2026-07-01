import { useMemo } from 'react'
import { computeBreakdown } from './domain/calc/pipeline'
import { DepensesSection } from './components/DepensesSection'
import { ParametresFiscauxSection } from './components/ParametresFiscauxSection'
import { ResultatSection } from './components/ResultatSection'
import { RevenuSection } from './components/RevenuSection'
import { useAppState } from './state/useAppState'

function App() {
  const [state, dispatch] = useAppState()
  const breakdown = useMemo(() => computeBreakdown(state), [state])

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Salaire horaire réel</h1>
        <p>Calculez votre salaire horaire une fois l'impôt, les cotisations et vos dépenses fixes déduits.</p>
      </header>

      <main className="app-layout">
        <div className="app-layout__inputs">
          <RevenuSection income={state.income} dispatch={dispatch} />
          <ParametresFiscauxSection state={state} dispatch={dispatch} />
          <DepensesSection expenses={state.expenses} dispatch={dispatch} />
        </div>

        <div className="app-layout__result">
          <ResultatSection breakdown={breakdown} />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Les barèmes et taux par défaut sont des valeurs indicatives pour 2026 — vérifiez-les auprès de l'ARC et
          de Revenu Québec. Cet outil ne constitue pas un avis fiscal.
        </p>
      </footer>
    </div>
  )
}

export default App
