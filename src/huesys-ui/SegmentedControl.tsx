import type { KeyboardEvent } from 'react'
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

/**
 * A connected two-or-more-way toggle (e.g. Palette/Custom) — fixed HueSys
 * chrome, not a generated control. Follows the ARIA radiogroup keyboard
 * pattern: only the active option is a Tab stop, and Left/Right (or
 * Up/Down) arrow keys move and select among the others — matching how a
 * native radio group behaves, since `role="radio"` alone doesn't give
 * that behavior for free.
 */
export function SegmentedControl<T extends string>({ options, value, onChange, ...props }: SegmentedControlProps<T>) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const isNext = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const isPrevious = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!isNext && !isPrevious) return

    event.preventDefault()
    const nextIndex = isNext ? (index + 1) % options.length : (index - 1 + options.length) % options.length
    onChange(options[nextIndex].value)
    ;(event.currentTarget.parentElement?.children[nextIndex] as HTMLButtonElement | undefined)?.focus()
  }

  return (
    <div className="segmented-control" role="radiogroup" aria-label={props['aria-label']}>
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          tabIndex={option.value === value ? 0 : -1}
          className={['segmented-control__option', option.value === value && 'segmented-control__option--active']
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
