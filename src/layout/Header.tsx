import { HueSysButton } from '../huesys-ui/HueSysButton'
import { ExportIcon, RedoIcon, UndoIcon } from '../huesys-ui/icons'
import './Header.scss'

export interface HeaderProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  /** Opens the Export dialog. Header only knows it has an Export action — the current Theme/typography data the dialog needs lives in App.tsx, not here. */
  onOpenExport: () => void
}

/** Fixed HueSys application chrome. */
export function Header({ canUndo, canRedo, onUndo, onRedo, onOpenExport }: HeaderProps) {
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
        <HueSysButton variant="special" onClick={onOpenExport}>
          <ExportIcon />
          Export
        </HueSysButton>
      </div>
    </header>
  )
}
