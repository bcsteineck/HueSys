import type { ReactNode } from 'react'
import { ColorsIcon, StyleIcon, TypographyIcon } from '../huesys-ui/icons'
import { NavItem } from '../huesys-ui/NavItem'
import type { ActiveSection } from '../state/appState'
import './Sidebar.scss'

export interface SidebarProps {
  activeSection: ActiveSection
  onNavigate: (section: ActiveSection) => void
}

const SECTIONS: { value: ActiveSection; label: string; icon: ReactNode }[] = [
  { value: 'colors', label: 'Colors', icon: <ColorsIcon /> },
  { value: 'typography', label: 'Typography', icon: <TypographyIcon /> },
  { value: 'style', label: 'Style', icon: <StyleIcon /> },
]

/** Fixed HueSys application chrome — the primary Colors/Typography/Style navigation. */
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
        {SECTIONS.map((section) => (
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
