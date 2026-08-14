import type { InputHTMLAttributes, ReactNode } from 'react'
import './Radio.scss'

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
}

export function Radio({ children, className, ...rest }: RadioProps) {
  const classes = ['radio', className].filter(Boolean).join(' ')

  return (
    <label className={classes}>
      <input type="radio" className="radio__input" {...rest} />
      <span className="radio__label">{children}</span>
    </label>
  )
}
