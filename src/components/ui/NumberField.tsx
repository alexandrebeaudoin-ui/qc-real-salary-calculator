interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: string
  step?: number
  min?: number
}

export function NumberField({ label, value, onChange, suffix, step = 1, min = 0 }: NumberFieldProps) {
  return (
    <label className="number-field">
      <span className="number-field__label">{label}</span>
      <span className="number-field__input-wrap">
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={min}
          onChange={(e) => onChange(e.target.valueAsNumber || 0)}
        />
        {suffix && <span className="number-field__suffix">{suffix}</span>}
      </span>
    </label>
  )
}
