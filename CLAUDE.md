# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A client-only React + TypeScript + Vite app that calculates a person's "real" hourly wage in Quebec: gross salary minus federal tax, Quebec provincial tax, mandatory social contributions (QPP/RRQ, QPIP/RQAP, EI), an optional RRSP deduction, and fixed recurring expenses (mortgage + user-defined items). No backend — state persists to `localStorage` only.

## Commands

```bash
npm run dev      # start Vite dev server (HMR)
npm run build    # tsc -b && vite build — typecheck then production build to dist/
npm run test     # vitest run — all unit tests
npm run lint     # oxlint src
npm run preview  # preview the production build
```

Run a single test file: `npx vitest run src/domain/calc/calc.test.ts`
Watch mode: `npx vitest` (no `run` flag)
Typecheck only: `npx tsc -b`

There is exactly one test file: `src/domain/calc/calc.test.ts`, covering the calculation engine in `src/domain/calc/`.

## Architecture

The codebase is split into a pure **domain layer** (calculation logic, no React) and a **UI layer** (React components + state). Keep that boundary: calculation logic belongs in `src/domain/calc/`, not inside components.

### Domain layer (`src/domain/`)

- `types.ts` — all domain types: `IncomeProfile`, `TaxSchedule`/`TaxBracket`, `ContributionRates` (QPP/QPIP/EI), `RrspContribution`, `Expenses`/`Expense`, `AppState` (the full persisted state shape), `Breakdown` (the full computed result shape).
- `defaults.ts` — default `AppState` values, including the 2026-indexed federal/Quebec tax brackets and contribution rates (`createDefaultState()`). These are *defaults only* — every value is user-editable in the UI, since tax parameters change yearly.
- `calc/progressiveTax.ts` — generic marginal-bracket tax calculator, reused for both federal and Quebec schedules. Applies the basic-personal-amount credit at the first bracket's rate (mirrors how ARC/Revenu Québec actually compute it).
- `calc/contributions.ts` — QPP (base + second-tier supplemental), QPIP, EI, each with their own exemption/ceiling logic.
- `calc/income.ts` — converts between hourly and annual income modes, and computes hours actually worked per year (paid vacation and unpaid weeks reduce hours worked but not necessarily gross pay — vacation increases the real hourly wage by design).
- `calc/pipeline.ts` — `computeBreakdown(state)` is the single entry point that orchestrates the whole calculation (gross → RRSP deduction → taxable income → federal tax with Quebec abatement (16.5%) → Quebec tax → contributions → net → fixed expenses → disposable → real hourly wage). This is what `App.tsx` calls; UI components never call the lower-level calc functions directly except for live previews (e.g. `RevenuSection` uses `income.ts` for the "≈ $/year" hint).

Known v1 simplification (documented in `pipeline.ts`): taxable income = gross minus RRSP only; the minor deductibility of the QPP second-tier and QPIP portions is ignored.

### State layer (`src/state/`)

- `AppState.ts` — the `Action` union type and `appReducer`. All mutations go through typed actions (e.g. `UPDATE_INCOME`, `ADD_BRACKET`, `UPDATE_BRACKET`, `REMOVE_BRACKET`, `UPDATE_RRSP`, `ADD_EXPENSE`, `RESET_DEFAULTS`). Bracket/expense IDs are generated with `crypto.randomUUID()`.
- `useAppState.ts` — `useReducer(appReducer, ...)` seeded from `storage.loadState()`, with a `useEffect` that persists on every change via `storage.saveState()`.
- `storage.ts` — localStorage key `taxo:v1`. **Important**: `loadState()` deep-merges the saved JSON against `createDefaultState()` field-by-field rather than trusting the saved shape as-is. This is deliberate: any `AppState` field added later (e.g. `rrsp` was added after ship) must also be merged here, or existing users' saved state will be missing that field and the app crashes at runtime on load. When adding a new top-level or nested field to `AppState`, always add the corresponding merge line in `loadState()`.

### Components (`src/components/`)

One component per UI section, composed in `App.tsx`: `RevenuSection`, `ReerSection` (RRSP), `ParametresFiscauxSection` (wraps two `TaxBracketEditor` instances — federal and Quebec — plus contribution rate fields), `DepensesSection` (mortgage + `ExpenseList`), `ResultatSection` (renders `ui/Breakdown`, the cascading waterfall + the headline real-hourly-wage number). `ui/NumberField` is the shared numeric input primitive. Dynamic lists (tax brackets, expenses) are rendered by mapping over `AppState` arrays and dispatching add/update/remove actions — there is no local component state for these lists.

### Styling

Dark theme only, following the **Catppuccin Macchiato** palette. All colors are CSS custom properties defined once in `src/index.css` (`--ctp-*` raw palette values, remapped to semantic `--bg`, `--card-bg`, `--field-bg`, `--border`, `--text`, `--text-h`, `--accent`, `--danger`). Don't hardcode colors in components or new CSS rules — use the semantic variables so the theme stays consistent.
