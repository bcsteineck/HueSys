import type { SelectHTMLAttributes } from 'react'
import './HueSysSelect.scss'

export type HueSysSelectProps = SelectHTMLAttributes<HTMLSelectElement>

/** HueSys application chrome's own select — fixed styling only. */
export function HueSysSelect({ className, children, ...props }: HueSysSelectProps) {
  return (
    <div className="huesys-select-wrapper">
      <select className={['huesys-select', className].filter(Boolean).join(' ')} {...props}>
        {children}
      </select>
    </div>
  )
}
