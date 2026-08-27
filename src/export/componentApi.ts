/** Each generated component's actual named exports — used to generate the Components-Only barrel index.ts. Kept in sync with each component's .tsx file by hand, the same way the rest of its public API is authored. */
export interface ComponentApiEntry {
  values: string[]
  types: string[]
}

export const COMPONENT_API: Record<string, ComponentApiEntry> = {
  Button: { values: ['Button'], types: ['ButtonProps', 'ButtonVariant'] },
  Input: { values: ['Input'], types: ['InputProps'] },
  Textarea: { values: ['Textarea'], types: ['TextareaProps'] },
  Select: { values: ['Select'], types: ['SelectProps'] },
  Checkbox: { values: ['Checkbox'], types: ['CheckboxProps'] },
  Radio: { values: ['Radio'], types: ['RadioProps'] },
  Switch: { values: ['Switch'], types: ['SwitchProps'] },
  Badge: { values: ['Badge'], types: ['BadgeProps', 'BadgeVariant'] },
  Card: { values: ['Card'], types: ['CardProps'] },
  Alert: { values: ['Alert'], types: ['AlertProps', 'AlertVariant'] },
}
