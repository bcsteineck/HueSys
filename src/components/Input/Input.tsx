import type { InputHTMLAttributes } from 'react'
import './Input.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className, ...rest }: InputProps) {
  const classes = ['input', className].filter(Boolean).join(' ')

  return <input className={classes} aria-invalid={error || undefined} {...rest} />
}
