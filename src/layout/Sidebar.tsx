import { NavItem } from '../huesys-ui/NavItem'
import type { ActiveSection } from '../state/appState'
import { NAV_SECTIONS } from './navSections'
import './Sidebar.scss'

export interface SidebarProps {
  activeSection: ActiveSection
  onNavigate: (section: ActiveSection) => void
}

/**
 * Fixed HueSys application chrome — the primary Colors/Typography/Style
 * navigation at wide desktop sizes. Hidden below $breakpoint-wide in favor
 * of TopNav; both call the same `onNavigate`, so there is only ever one
 * source of navigation state regardless of which is visible.
 */
export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Primary">
      <h1 className="sidebar__brand">
        <span className="sidebar__bracket" aria-hidden="true">
          {'<'}
        </span>
        HueSys
        <span className="sidebar__bracket" aria-hidden="true">
          {'/>'}
        </span>
      </h1>

      <span className="sidebar__section-label">Theme</span>
      <div className="sidebar__nav">
        {NAV_SECTIONS.map((section) => (
          <NavItem
            key={section.value}
            icon={section.icon}
            label={section.label}
            active={activeSection === section.value}
            onClick={() => onNavigate(section.value)}
          />
        ))}
      </div>

      <p className="sidebar__footer">HueSys © copyright {new Date().getFullYear()}</p>
    </nav>
  )
}
