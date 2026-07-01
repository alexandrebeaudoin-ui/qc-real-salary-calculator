import type { Breakdown } from '../../domain/types'
import { formatCurrency, formatCurrencyPrecise, formatHours } from '../../utils/format'

interface BreakdownViewProps {
  breakdown: Breakdown
}

export function BreakdownView({ breakdown }: BreakdownViewProps) {
  const b = breakdown

  return (
    <div className="breakdown">
      <div className="breakdown__hero">
        <div className="breakdown__hero-item">
          <span className="breakdown__hero-label">Salaire horaire réel</span>
          <span className="breakdown__hero-value">{formatCurrencyPrecise(b.realHourly)} / h</span>
        </div>
        <div className="breakdown__hero-item breakdown__hero-item--muted">
          <span className="breakdown__hero-label">Salaire horaire brut</span>
          <span className="breakdown__hero-value">{formatCurrencyPrecise(b.grossHourly)} / h</span>
        </div>
      </div>

      <table className="breakdown-table">
        <tbody>
          <tr className="breakdown-table__base">
            <td>Salaire brut annuel</td>
            <td>{formatCurrency(b.grossAnnual)}</td>
          </tr>
          {b.rrspContribution > 0 && (
            <tr>
              <td>− Cotisation REER (déductible)</td>
              <td>−{formatCurrency(b.rrspContribution)}</td>
            </tr>
          )}
          <tr>
            <td>− Impôt fédéral (après abattement de {formatCurrency(b.federalAbatement)})</td>
            <td>−{formatCurrency(b.federalTaxNet)}</td>
          </tr>
          <tr>
            <td>− Impôt du Québec</td>
            <td>−{formatCurrency(b.quebecTax)}</td>
          </tr>
          <tr>
            <td>− RRQ</td>
            <td>−{formatCurrency(b.qppContribution)}</td>
          </tr>
          <tr>
            <td>− RQAP</td>
            <td>−{formatCurrency(b.qpipContribution)}</td>
          </tr>
          <tr>
            <td>− Assurance-emploi</td>
            <td>−{formatCurrency(b.eiContribution)}</td>
          </tr>
          <tr className="breakdown-table__subtotal">
            <td>= Net après impôts et cotisations</td>
            <td>{formatCurrency(b.afterTaxAndContributions)}</td>
          </tr>
          <tr>
            <td>− Dépenses fixes (hypothèque + autres)</td>
            <td>−{formatCurrency(b.totalFixedExpensesAnnual)}</td>
          </tr>
          <tr className="breakdown-table__total">
            <td>= Revenu disponible</td>
            <td>{formatCurrency(b.disposableAnnual)}</td>
          </tr>
        </tbody>
      </table>

      <p className="hint">
        Basé sur {formatHours(b.hoursWorkedPerYear)} réellement travaillées par année — le revenu disponible
        représente {b.grossAnnual > 0 ? Math.round((b.disposableAnnual / b.grossAnnual) * 100) : 0}% du salaire
        brut.
      </p>
    </div>
  )
}
