import { createDefaultState, STORAGE_VERSION } from '../domain/defaults'
import type { AppState } from '../domain/types'

const STORAGE_KEY = 'taxo:v1'

/**
 * Fusionne l'état sauvegardé avec les valeurs par défaut plutôt que de faire
 * confiance à sa forme telle quelle : un ancien état sauvegardé avant l'ajout
 * d'un champ (ex. `rrsp`) ne doit pas faire planter l'app au chargement.
 */
export function loadState(): AppState {
  const defaults = createDefaultState()

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults

    const parsed = JSON.parse(raw) as Partial<AppState> | null
    if (!parsed || typeof parsed !== 'object') return defaults

    return {
      version: STORAGE_VERSION,
      income: { ...defaults.income, ...parsed.income },
      federalTax: parsed.federalTax ?? defaults.federalTax,
      quebecTax: parsed.quebecTax ?? defaults.quebecTax,
      quebecAbatement: parsed.quebecAbatement ?? defaults.quebecAbatement,
      contributions: {
        qpp: { ...defaults.contributions.qpp, ...parsed.contributions?.qpp },
        qpip: { ...defaults.contributions.qpip, ...parsed.contributions?.qpip },
        ei: { ...defaults.contributions.ei, ...parsed.contributions?.ei },
      },
      rrsp: { ...defaults.rrsp, ...parsed.rrsp },
      expenses: {
        mortgageMonthly: parsed.expenses?.mortgageMonthly ?? defaults.expenses.mortgageMonthly,
        items: parsed.expenses?.items ?? defaults.expenses.items,
      },
    }
  } catch {
    return defaults
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Stockage indisponible (mode privé, quota) : on ignore silencieusement.
  }
}
