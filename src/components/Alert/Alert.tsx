import { useState, type HTMLAttributes, type ReactNode } from 'react'
import './Alert.scss'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant
  /** Bold heading — every Alert has one; the semantic icon and title share the same row. */
  title: string
  /** Supporting copy shown below the title. */
  children?: ReactNode
  /** Called after the alert dismisses itself via the close button. */
  onClose?: () => void
}

// Urgent variants interrupt screen readers immediately (role="alert");
// informational ones announce politely (role="status") without stealing
// focus from whatever the user was doing.
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
