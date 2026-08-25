import type { ButtonHTMLAttributes } from 'react'
import './HueSysButton.scss'

export interface HueSysButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'outline' | 'ghost' | 'special'
  /** A square, label-less button (e.g. an icon-only Refresh) — still requires an accessible name via aria-label. */
  iconOnly?: boolean
}

/**
 * HueSys application chrome's own button — fixed styling only, never the
 * generated Theme. Used for Undo/Redo/Export and all Options Panel
 * actions (Randomize/Refresh/mode switching/etc). Not exported and not
 * related to the generated, exportable Button component.
 */
export function HueSysButton({ variant = 'outline', iconOnly = false, className, type = 'button', ...props }: HueSysButtonProps) {
  const classes = ['huesys-button', `huesys-button--${variant}`, iconOnly && 'huesys-button--icon-only', className]
    .filter(Boolean)
    .join(' ')
  return <button type={type} className={classes} {...props} />
}
