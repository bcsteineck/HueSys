import type { HTMLAttributes } from 'react'
import './Card.scss'

export type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, children, ...rest }: CardProps) {
  const classes = ['card', className].filter(Boolean).join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
