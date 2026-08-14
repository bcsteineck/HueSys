import type { InputHTMLAttributes, ReactNode } from 'react'
import './Checkbox.scss'

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
}

export function Checkbox({ children, className, ...rest }: CheckboxProps) {
  const classes = ['checkbox', className].filter(Boolean).join(' ')

  return (
    <label className={classes}>
      <input type="checkbox" className="checkbox__input" {...rest} />
      <span className="checkbox__label">{children}</span>
    </label>
  )
}
