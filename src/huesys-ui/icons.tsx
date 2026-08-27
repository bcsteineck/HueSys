// HueSys application chrome's icon set. Wraps the exact icons specified
// in Figma's Icon Components frame (lucide/undo-2, lucide/redo-2, lucide/
// code-xml, lucide/sparkles, lucide/refresh-ccw, lucide/palette, lucide/
// type, lucide/square-round-corner) with the fixed size these icons have
// always rendered at throughout HueSys chrome. Using the real Lucide set
// (rather than hand-drawn approximations) guarantees pixel fidelity to
// the source icons Figma references.
import {
  Undo2,
  Redo2,
  CodeXml,
  Sparkles,
  RefreshCcw,
  Palette,
  Type,
  SquareRoundCorner,
  X,
  type LucideProps,
} from 'lucide-react'

const ICON_SIZE = 16

export function UndoIcon(props: LucideProps) {
  return <Undo2 size={ICON_SIZE} {...props} />
}

export function RedoIcon(props: LucideProps) {
  return <Redo2 size={ICON_SIZE} {...props} />
}

export function ExportIcon(props: LucideProps) {
  return <CodeXml size={ICON_SIZE} {...props} />
}

export function RandomizeIcon(props: LucideProps) {
  return <Sparkles size={ICON_SIZE} {...props} />
}

export function RefreshIcon(props: LucideProps) {
  return <RefreshCcw size={ICON_SIZE} {...props} />
}

export function ColorsIcon(props: LucideProps) {
  return <Palette size={ICON_SIZE} {...props} />
}

export function TypographyIcon(props: LucideProps) {
  return <Type size={ICON_SIZE} {...props} />
}

export function StyleIcon(props: LucideProps) {
  return <SquareRoundCorner size={ICON_SIZE} {...props} />
}

export function CloseIcon(props: LucideProps) {
  return <X size={ICON_SIZE} {...props} />
}
