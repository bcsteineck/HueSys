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
 * The generated specimen itself — a curated look at what a UI built with
 * this generated system feels like, not exhaustive component
 * documentation. Rendered inside the LivePreview shell's neutral white
 * canvas so the generated neutral colors (borders, surfaces, shadows) can
 * be evaluated within the components themselves, not against a themed
 * backdrop. All components here are the real generated implementations —
 * every control stays interactive.
 */
export function ComponentPreview() {
  return (
    <div className="component-preview">
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

      <div className="component-preview__grid">
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
      </div>

      <div className="component-preview__grid">
        <section className="component-preview__section" aria-labelledby="gallery-alerts">
          <h3 id="gallery-alerts" className="component-preview__heading">
            Alerts
          </h3>
          <div className="component-preview__stage component-preview__column">
            <Alert variant="info">Informational message for context that doesn't require action.</Alert>
            <Alert variant="success">Your changes were saved successfully.</Alert>
            <Alert variant="warning">This action may have unintended side effects.</Alert>
            <Alert variant="danger">Something went wrong — please try again.</Alert>
          </div>
        </section>

        <section className="component-preview__section" aria-labelledby="gallery-badges">
          <h3 id="gallery-badges" className="component-preview__heading">
            Badges
          </h3>
          <div className="component-preview__stage component-preview__row">
            <Badge>Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </section>
      </div>

      <section className="component-preview__section" aria-labelledby="gallery-cards">
        <h3 id="gallery-cards" className="component-preview__heading">
          Cards
        </h3>
        <div className="component-preview__stage">
          <Card className="component-preview__card">
            <h4>Upgrade to Pro</h4>
            <p>Unlock advanced features and priority support for your team.</p>
            <Button variant="primary">Upgrade</Button>
          </Card>
        </div>
      </section>
    </div>
  )
}
