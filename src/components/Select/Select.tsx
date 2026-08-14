import type { SelectHTMLAttributes } from 'react'
import './Select.scss'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function Select({ error, className, children, ...rest }: SelectProps) {
  const classes = ['select', className].filter(Boolean).join(' ')

  return (
    <div className="select-wrapper">
      <select className={classes} aria-invalid={error || undefined} {...rest}>
        {children}
      </select>
    </div>
  )
}
