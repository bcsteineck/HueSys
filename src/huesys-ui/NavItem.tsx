import type { ReactNode } from 'react'
import './NavItem.scss'

export interface NavItemProps {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}

/** A single Sidebar navigation entry (Colors/Typography/Style) — fixed HueSys chrome. */
export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      className={['nav-item', active && 'nav-item--active'].filter(Boolean).join(' ')}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="nav-item__icon" aria-hidden="true">
        {icon}
      </span>
      {label}
    </button>
  )
}
