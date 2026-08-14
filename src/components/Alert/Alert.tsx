import type { HTMLAttributes } from 'react'
import './Alert.scss'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
}

// Urgent variants interrupt screen readers immediately (role="alert");
// informational ones announce politely (role="status") without stealing
// focus from whatever the user was doing.
const URGENT_VARIANTS: AlertVariant[] = ['warning', 'danger']

export function Alert({ variant = 'info', className, children, ...rest }: AlertProps) {
  const classes = ['alert', `alert--${variant}`, className].filter(Boolean).join(' ')
  const role = URGENT_VARIANTS.includes(variant) ? 'alert' : 'status'

  return (
    <div className={classes} role={role} {...rest}>
      {children}
    </div>
  )
}
