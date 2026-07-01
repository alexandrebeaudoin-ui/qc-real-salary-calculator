const currencyFormatter = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

const currencyFormatter2 = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('fr-CA', {
  style: 'percent',
  maximumFractionDigits: 2,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatCurrencyPrecise(value: number): string {
  return currencyFormatter2.format(value)
}

export function formatPercent(fraction: number): string {
  return percentFormatter.format(fraction)
}

export function formatHours(value: number): string {
  return `${new Intl.NumberFormat('fr-CA', { maximumFractionDigits: 0 }).format(value)} h`
}
