// Small fixed icon set for HueSys application chrome. Plain inline SVGs
// (no icon-library dependency) — currentColor so each one inherits
// whatever text color its button/nav item already has.

import type { SVGProps } from 'react'

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  )
}

export function UndoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 4.5v3.5h3.5" />
      <path d="M4.5 8A5 5 0 1 1 6 11.5" />
    </Icon>
  )
}

export function RedoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 4.5v3.5H8.5" />
      <path d="M11.5 8A5 5 0 1 0 10 11.5" />
    </Icon>
  )
}

export function ExportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 3.5 3 8l3 4.5" />
      <path d="M10 3.5 13 8l-3 4.5" />
    </Icon>
  )
}

export function RandomizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 2v2.5M8 11.5V14M2 8h2.5M11.5 8H14M4 4l1.5 1.5M10.5 10.5 12 12M12 4l-1.5 1.5M5.5 10.5 4 12" />
    </Icon>
  )
}

export function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M13 8A5 5 0 1 1 11.5 4.5" />
      <path d="M13 2.5v3h-3" />
    </Icon>
  )
}

export function ColorsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="6" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="10" r="0.75" fill="currentColor" stroke="none" />
    </Icon>
  )
}

export function TypographyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 4h8M8 4v8" />
      <path d="M5.5 4 4 4l.5-1.5M10.5 4 12 4l-.5-1.5" />
    </Icon>
  )
}

export function StyleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="10" height="10" rx="2.5" />
      <path d="M3 9.5h10" />
    </Icon>
  )
}
