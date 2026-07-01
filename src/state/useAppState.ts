import { useEffect, useReducer } from 'react'
import type { Dispatch } from 'react'
import type { AppState } from '../domain/types'
import { appReducer } from './AppState'
import type { Action } from './AppState'
import { loadState, saveState } from './storage'

export function useAppState(): [AppState, Dispatch<Action>] {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  return [state, dispatch]
}
