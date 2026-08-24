import { HueSysButton } from '../huesys-ui/HueSysButton'
import { ExportIcon, RedoIcon, UndoIcon } from '../huesys-ui/icons'
import './Header.scss'

export interface HeaderProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

/**
 * Fixed HueSys application chrome. Export is visually present in its
 * Figma position but stays disabled — the Export Engine is a later phase.
 */
export function Header({ canUndo, canRedo, onUndo, onRedo }: HeaderProps) {
  return (
    <header className="app-header">
      <p className="app-header__tagline">Build and export a React design system from a color palette.</p>
      <div className="app-header__actions">
        <HueSysButton variant="outline" onClick={onUndo} disabled={!canUndo} title="Undo">
          <UndoIcon />
          Undo
        </HueSysButton>
        <HueSysButton variant="outline" onClick={onRedo} disabled={!canRedo} title="Redo">
          <RedoIcon />
          Redo
        </HueSysButton>
        <HueSysButton
          variant="primary"
          disabled
          aria-label="Export (not yet available)"
          title="Export (not yet available)"
        >
          <ExportIcon />
          Export
        </HueSysButton>
      </div>
    </header>
  )
}
