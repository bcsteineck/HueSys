import type { ActiveSection } from '../state/appState'
import { NAV_SECTIONS } from './navSections'
import './TopNav.scss'

export interface TopNavProps {
  activeSection: ActiveSection
  onNavigate: (section: ActiveSection) => void
}

/**
 * Fixed HueSys application chrome — the primary Colors/Typography/Style
 * navigation at medium/small widths, replacing the wide Sidebar. Calls the
 * same `onNavigate` as Sidebar, so there is only one navigation state
 * regardless of which presentation is visible.
 */
export function TopNav({ activeSection, onNavigate }: TopNavProps) {
  return (
    <nav className="top-nav" aria-label="Primary">
      {NAV_SECTIONS.map((section) => (
        <button
          key={section.value}
          type="button"
          className={['top-nav__item', activeSection === section.value && 'top-nav__item--active'].filter(Boolean).join(' ')}
          aria-current={activeSection === section.value ? 'page' : undefined}
          onClick={() => onNavigate(section.value)}
        >
          <span className="top-nav__icon" aria-hidden="true">
            {section.icon}
          </span>
          {section.label}
        </button>
      ))}
    </nav>
  )
}
