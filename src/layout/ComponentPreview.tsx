import { Button } from '../components/Button/Button'
import './ComponentPreview.scss'

export function ComponentPreview() {
  return (
    <main className="component-preview" aria-label="Component preview">
      <h2 className="component-preview__title">Preview</h2>
      <div className="component-preview__stage">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </main>
  )
}
