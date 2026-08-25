import type { ReactNode } from 'react'
import { ColorsIcon, StyleIcon, TypographyIcon } from '../huesys-ui/icons'
import type { ActiveSection } from '../state/appState'

export interface NavSection {
  value: ActiveSection
  label: string
  icon: ReactNode
}

/** Shared by Sidebar (wide) and TopNav (medium/small) so both navigation presentations stay in sync. */
export const NAV_SECTIONS: NavSection[] = [
  { value: 'colors', label: 'Colors', icon: <ColorsIcon /> },
  { value: 'typography', label: 'Typography', icon: <TypographyIcon /> },
  { value: 'style', label: 'Style', icon: <StyleIcon /> },
]
