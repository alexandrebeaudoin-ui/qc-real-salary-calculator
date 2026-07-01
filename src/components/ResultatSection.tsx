import type { Breakdown } from '../domain/types'
import { BreakdownView } from './ui/Breakdown'

interface ResultatSectionProps {
  breakdown: Breakdown
}

export function ResultatSection({ breakdown }: ResultatSectionProps) {
  return (
    <section className="card card--result">
      <h2>Résultat</h2>
      <BreakdownView breakdown={breakdown} />
    </section>
  )
}
