import type { InputHTMLAttributes, ReactNode } from 'react'
import './Switch.scss'

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
}

export function Switch({ children, className, ...rest }: SwitchProps) {
  const classes = ['switch', className].filter(Boolean).join(' ')

  return (
    <label className={classes}>
      <input type="checkbox" role="switch" className="switch__input" {...rest} />
      <span className="switch__label">{children}</span>
    </label>
  )
}
