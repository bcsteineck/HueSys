import type { Palette } from '../../theme/color'
import { PaletteSwatch } from './PaletteSwatch'

export interface NeutralPaletteProps {
  neutrals: Palette['neutrals']
  onCopy: (hex: string) => void
}

// The structural roles users are most likely to care about. These come
// straight from the Palette Engine's fixed display steps — Style is free
// to pick different neutral-scale steps when it assembles the actual
// Theme, but what's shown here never changes because of that.
const NEUTRAL_ROLES: { label: string; getHex: (neutrals: Palette['neutrals']) => string }[] = [
  { label: 'Background', getHex: (neutrals) => neutrals.background },
  { label: 'Surface', getHex: (neutrals) => neutrals.surface },
  { label: 'Border', getHex: (neutrals) => neutrals.border },
  { label: 'Muted Text', getHex: (neutrals) => neutrals.textMuted },
  { label: 'Primary Text', getHex: (neutrals) => neutrals.text },
]

export function NeutralPalette({ neutrals, onCopy }: NeutralPaletteProps) {
  return (
    <div className="generated-palette__group">
      <h3 className="generated-palette__label">Neutral Palette</h3>
      <div className="generated-palette__row">
        {NEUTRAL_ROLES.map((role) => (
          <PaletteSwatch key={role.label} hex={role.getHex(neutrals)} label={role.label} onCopy={onCopy} />
        ))}
      </div>
    </div>
  )
}
