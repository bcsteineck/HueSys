import type { Palette } from '../../theme/color'
import { PaletteSwatch } from './PaletteSwatch'

export interface SemanticPaletteProps {
  semantic: Palette['semantic']
  onCopy: (hex: string) => void
}

// The canonical semantic source colors — not the Tinted/Strong/Solid
// surface treatments generated components build from them (see Badge/
// Alert for those). Accent is deliberately excluded: it already appears
// in Brand Palette above, and showing it again here would duplicate it
// rather than reveal a distinct derived role.
const SEMANTIC_ROLES: { label: string; getHex: (semantic: Palette['semantic']) => string }[] = [
  { label: 'Info', getHex: (semantic) => semantic.info },
  { label: 'Success', getHex: (semantic) => semantic.success },
  { label: 'Warning', getHex: (semantic) => semantic.warning },
  { label: 'Danger', getHex: (semantic) => semantic.danger },
]

export function SemanticPalette({ semantic, onCopy }: SemanticPaletteProps) {
  return (
    <div className="generated-palette__group">
      <h3 className="generated-palette__label">Semantic Palette</h3>
      <div className="generated-palette__row">
        {SEMANTIC_ROLES.map((role) => (
          <PaletteSwatch key={role.label} hex={role.getHex(semantic)} label={role.label} showLabel onCopy={onCopy} />
        ))}
      </div>
    </div>
  )
}
