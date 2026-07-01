import { createDefaultState, STORAGE_VERSION } from '../domain/defaults'
import type { AppState } from '../domain/types'

const STORAGE_KEY = 'taxo:v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()

    const parsed = JSON.parse(raw) as AppState
    if (!parsed || parsed.version !== STORAGE_VERSION) {
      return createDefaultState()
    }
    return parsed
  } catch {
    return createDefaultState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Stockage indisponible (mode privé, quota) : on ignore silencieusement.
  }
}
