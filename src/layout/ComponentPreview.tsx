import { Alert } from '../components/Alert/Alert'
import { Badge } from '../components/Badge/Badge'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Checkbox } from '../components/Checkbox/Checkbox'
import { Input } from '../components/Input/Input'
import { Radio } from '../components/Radio/Radio'
import { Select } from '../components/Select/Select'
import { Switch } from '../components/Switch/Switch'
import { Textarea } from '../components/Textarea/Textarea'
import './ComponentPreview.scss'

/**
 * A validation gallery, not the final playground UI — it exists to prove
 * every component and variant renders correctly against the live Theme.
 * Phase 4 replaces this with the real interactive preview.
 */
export function ComponentPreview() {
  return (
    <main className="component-preview" aria-label="Component preview">
      <h2 className="component-preview__title">Preview</h2>

      <section className="component-preview__section" aria-labelledby="gallery-buttons">
        <h3 id="gallery-buttons" className="component-preview__heading">
          Buttons
        </h3>
        <div className="component-preview__stage component-preview__row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="component-preview__section" aria-labelledby="gallery-inputs">
        <h3 id="gallery-inputs" className="component-preview__heading">
          Inputs
        </h3>
        <div className="component-preview__stage component-preview__column">
          <Input placeholder="Default input" />
          <Input placeholder="Disabled input" disabled />
          <Input placeholder="Invalid input" error defaultValue="not-an-email" />
          <Textarea placeholder="Write something…" />
          <Select defaultValue="">
            <option value="" disabled>
              Choose an option
            </option>
            <option value="one">Option one</option>
            <option value="two">Option two</option>
            <option value="three">Option three</option>
          </Select>
        </div>
      </section>

      <section className="component-preview__section" aria-labelledby="gallery-selection">
        <h3 id="gallery-selection" className="component-preview__heading">
          Selection Controls
        </h3>
        <div className="component-preview__stage component-preview__column">
          <Checkbox defaultChecked>Checked checkbox</Checkbox>
          <Checkbox>Unchecked checkbox</Checkbox>
          <Checkbox disabled>Disabled checkbox</Checkbox>

          <fieldset className="component-preview__fieldset">
            <legend>Plan</legend>
            <Radio name="preview-plan" value="free" defaultChecked>
              Free
            </Radio>
            <Radio name="preview-plan" value="pro">
              Pro
            </Radio>
            <Radio name="preview-plan" value="disabled" disabled>
              Unavailable
            </Radio>
          </fieldset>

          <Switch defaultChecked>Enabled switch</Switch>
          <Switch>Disabled-off switch</Switch>
          <Switch disabled>Disabled switch</Switch>
        </div>
      </section>

      <section className="component-preview__section" aria-labelledby="gallery-feedback">
        <h3 id="gallery-feedback" className="component-preview__heading">
          Feedback
        </h3>
        <div className="component-preview__stage component-preview__column">
          <div className="component-preview__row">
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
          <Alert variant="info">Informational message for context that doesn't require action.</Alert>
          <Alert variant="success">Your changes were saved successfully.</Alert>
          <Alert variant="warning">This action may have unintended side effects.</Alert>
          <Alert variant="danger">Something went wrong — please try again.</Alert>
        </div>
      </section>

      <section className="component-preview__section" aria-labelledby="gallery-layout">
        <h3 id="gallery-layout" className="component-preview__heading">
          Layout
        </h3>
        <div className="component-preview__stage">
          <Card>
            <h2>Account</h2>
            <p>Welcome back.</p>
            <Button>Continue</Button>
          </Card>
        </div>
      </section>
    </main>
  )
}
