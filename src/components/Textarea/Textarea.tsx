import type { TextareaHTMLAttributes } from 'react'
import './Textarea.scss'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className, ...rest }: TextareaProps) {
  const classes = ['textarea', className].filter(Boolean).join(' ')

  return <textarea className={classes} aria-invalid={error || undefined} {...rest} />
}
