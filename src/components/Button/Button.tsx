import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ type = 'button', variant = 'primary', className, children, ...rest }: ButtonProps) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  )
}
