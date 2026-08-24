import type { CSSProperties } from 'react'
import { ComponentPreview } from './ComponentPreview'
import './LivePreview.scss'

export interface LivePreviewProps {
  /** Generated Theme CSS variables — scoped to just the scroll region so only the specimen inside consumes them, never this shell's own title/chrome. */
  previewStyle: CSSProperties
}

/**
 * The HueSys-owned Live Preview shell. Everything here (title, subtitle,
 * card chrome, scroll container) is fixed HueSys UI; only the generated
 * specimen inside — ComponentPreview and the components it renders —
 * consumes the generated Theme. Stage E owns the full curated
 * presentation; this stage only fits the existing specimen into the new
 * shell.
 */
export function LivePreview({ previewStyle }: LivePreviewProps) {
  return (
    <main className="live-preview" aria-label="Live preview">
      <div className="live-preview__header">
        <h2 className="live-preview__title">Live Preview</h2>
        <p className="live-preview__description">See how your theme looks across components.</p>
      </div>
      <div className="live-preview__scroll" style={previewStyle}>
        <ComponentPreview />
      </div>
    </main>
  )
}
