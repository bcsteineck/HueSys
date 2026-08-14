import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import { Input } from '../../components/Input/Input'
import { isValidHexColor, normalizeColor } from '../../theme/color'
import type { UpdateStateOptions } from '../../state/useAppState'

export interface ColorControlProps {
  color: string
  onChange: (color: string, options?: UpdateStateOptions) => void
}

function randomHexColor(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(3))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function ColorControl({ color, onChange }: ColorControlProps) {
  const [text, setText] = useState(`#${color}`)

  // Keep the text field's draft in sync whenever the committed color
  // changes from elsewhere (picker, random, URL navigation). Adjusted
  // during render rather than an effect, per React's own guidance for
  // resetting local state when a prop changes.
  const [syncedColor, setSyncedColor] = useState(color)
  if (color !== syncedColor) {
    setSyncedColor(color)
    setText(`#${color}`)
  }

  function handleTextChange(value: string) {
    setText(value)
    if (isValidHexColor(value)) {
      onChange(normalizeColor(value).replace('#', ''), { replace: true })
    }
  }

  return (
    <div className="color-control">
      <input
        type="color"
        className="color-control__swatch"
        value={`#${color}`}
        onChange={(event) => onChange(event.target.value.replace('#', ''))}
        aria-label="Primary color picker"
      />
      <Input
        className="color-control__hex"
        value={text}
        onChange={(event) => handleTextChange(event.target.value)}
        onBlur={() => setText(`#${color}`)}
        spellCheck={false}
        aria-label="Primary color hex value"
      />
      <Button variant="secondary" onClick={() => onChange(randomHexColor())}>
        Random
      </Button>
    </div>
  )
}
