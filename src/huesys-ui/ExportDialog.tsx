import { useEffect, useRef, useState } from 'react'
import { exportComponentsOnly, exportStarterProject } from '../export'
import type { Theme } from '../theme/types'
import { CloseIcon } from './icons'
import './ExportDialog.scss'

export interface ExportDialogProps {
  open: boolean
  onClose: () => void
  /** The current generated design system — HueSys chrome, but it needs this data to build the export. It never renders anything styled *by* the Theme. */
  theme: Theme
  fontId: string
}

type ExportStatus = 'idle' | 'generating' | 'error'

// Lets React commit the "Generating…" state before the (synchronous)
// fflate zipSync call, which can otherwise block the main thread in the
// same event turn before anything has a chance to paint.
function nextFrame(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

export function ExportDialog({ open, onClose, theme, fontId }: ExportDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const [starterStatus, setStarterStatus] = useState<ExportStatus>('idle')
  const [componentsStatus, setComponentsStatus] = useState<ExportStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      openerRef.current = document.activeElement as HTMLElement | null
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Fires on Escape (native 'cancel' then 'close') and whenever we call
  // dialog.close() ourselves — safe to run more than once.
  function handleDialogClose() {
    setStarterStatus('idle')
    setComponentsStatus('idle')
    setError(null)
    onClose()
    openerRef.current?.focus()
  }

  const busy = starterStatus === 'generating' || componentsStatus === 'generating'

  async function runExport(kind: 'starter' | 'components') {
    const setStatus = kind === 'starter' ? setStarterStatus : setComponentsStatus
    setStatus('generating')
    setError(null)
    await nextFrame()
    const result = kind === 'starter' ? exportStarterProject(theme, fontId) : exportComponentsOnly(theme, fontId)
    setStatus(result.success ? 'idle' : 'error')
    if (!result.success) setError(result.error)
  }

  return (
    <dialog
      ref={dialogRef}
      className="export-dialog"
      aria-labelledby="export-dialog-title"
      onClose={handleDialogClose}
      onCancel={handleDialogClose}
    >
      <div className="export-dialog__header">
        <h2 id="export-dialog-title" className="export-dialog__title">
          Export design system
        </h2>
        <button
          type="button"
          className="export-dialog__close"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close export dialog"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="export-dialog__options">
        <div className="export-dialog__option">
          <h3 className="export-dialog__option-title">Starter Project</h3>
          <p className="export-dialog__option-description">Complete Vite + React + TypeScript project ready to run.</p>
          <button type="button" className="export-dialog__action" disabled={busy} onClick={() => runExport('starter')}>
            {starterStatus === 'generating' ? 'Generating…' : 'Download Starter Project'}
          </button>
        </div>
        <div className="export-dialog__option">
          <h3 className="export-dialog__option-title">Components Only</h3>
          <p className="export-dialog__option-description">
            Portable component source, styles, and theme files for an existing project.
          </p>
          <button type="button" className="export-dialog__action" disabled={busy} onClick={() => runExport('components')}>
            {componentsStatus === 'generating' ? 'Generating…' : 'Download Components Only'}
          </button>
        </div>
      </div>

      {error && (
        <p className="export-dialog__error" role="alert">
          {error}{' '}
          <button
            type="button"
            className="export-dialog__retry"
            onClick={() => runExport(starterStatus === 'error' ? 'starter' : 'components')}
          >
            Retry
          </button>
        </p>
      )}
    </dialog>
  )
}
