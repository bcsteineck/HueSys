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
      {/* Referenced by NavItem.scss (`stroke: url(#nav-icon-gradient)`) to
          color the active nav item's icon — Figma renders it as a gradient
          rather than a flat currentColor swap like the label text gets. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          {/* userSpaceOnUse + explicit viewBox-sized coordinates, not the
              default objectBoundingBox: bounding-box-relative gradients
              degenerate (paint nothing) on zero-width/zero-height shapes,
              which several Lucide icons use for straight strokes (e.g. the
              Type icon's vertical stem). */}
          <linearGradient id="nav-icon-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0" stopColor="#6f5ff5" />
            <stop offset="1" stopColor="#f66676" />
          </linearGradient>
        </defs>
      </svg>
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
