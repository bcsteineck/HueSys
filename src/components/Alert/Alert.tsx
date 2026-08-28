import { useState, type HTMLAttributes, type ReactNode } from 'react'
import './Alert.scss'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  title: string
  children?: ReactNode
  /** Fires after the alert has already dismissed itself. */
  onClose?: () => void
}

// Urgent variants use role="alert" (interrupts screen readers); others use role="status" (announces politely).
const URGENT_VARIANTS: AlertVariant[] = ['warning', 'danger']

export function Alert({ variant = 'info', title, children, onClose, className, ...rest }: AlertProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  function handleClose() {
    setDismissed(true)
    onClose?.()
  }

  const classes = ['alert', `alert--${variant}`, className].filter(Boolean).join(' ')
  const role = URGENT_VARIANTS.includes(variant) ? 'alert' : 'status'

  return (
    <div className={classes} role={role} {...rest}>
      <div className="alert__header">
        <div className="alert__title-group">
          <span className={`alert__icon alert__icon--${variant}`} aria-hidden="true" />
          <p className="alert__title">{title}</p>
        </div>
        <button type="button" className="alert__close" onClick={handleClose} aria-label="Dismiss alert" />
      </div>
      {children && <div className="alert__description">{children}</div>}
    </div>
  )
}
