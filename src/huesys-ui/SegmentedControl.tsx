import './SegmentedControl.scss'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
}

/** A connected two-or-more-way toggle (e.g. Palette/Custom) — fixed HueSys chrome, not a generated control. */
export function SegmentedControl<T extends string>({ options, value, onChange, ...props }: SegmentedControlProps<T>) {
  return (
    <div className="segmented-control" role="radiogroup" aria-label={props['aria-label']}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={['segmented-control__option', option.value === value && 'segmented-control__option--active']
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
