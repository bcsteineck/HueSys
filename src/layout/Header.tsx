import { Button } from '../components/Button/Button'
import './Header.scss'

export interface HeaderProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

/**
 * Undo/Redo live here as plain temporary controls for Stage A verification
 * — the real placement, styling, and Export button belong to the Stage B
 * dashboard shell.
 */
export function Header({ canUndo, canRedo, onUndo, onRedo }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">HueSys</h1>
      <div className="header__history">
        <Button variant="ghost" onClick={onUndo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="ghost" onClick={onRedo} disabled={!canRedo}>
          Redo
        </Button>
      </div>
    </header>
  )
}
