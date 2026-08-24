import type { InputHTMLAttributes } from 'react'
import './HueSysInput.scss'

export type HueSysInputProps = InputHTMLAttributes<HTMLInputElement>

/** HueSys application chrome's own text input — fixed styling only. */
export function HueSysInput({ className, type = 'text', ...props }: HueSysInputProps) {
  const classes = ['huesys-input', className].filter(Boolean).join(' ')
  return <input type={type} className={classes} {...props} />
}
