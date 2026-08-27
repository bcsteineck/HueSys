import { HueSysLogo } from '../huesys-ui/HueSysLogo'
import './MobileHeader.scss'

/**
 * Fixed HueSys application chrome, visible only once the Sidebar hides
 * (see $breakpoint-wide) — the Sidebar's wordmark is otherwise the only
 * HueSys branding in the app, so narrower widths would show none at all
 * without this. Reuses the exact same logo artwork and dark background
 * Sidebar already uses, just full-width and shorter.
 */
export function MobileHeader() {
  return (
    <header className="mobile-header">
      <HueSysLogo />
    </header>
  )
}
