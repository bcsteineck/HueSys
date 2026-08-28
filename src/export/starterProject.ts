import { getGoogleFontsLinkTags } from './fontExport'
import { buildComponentAndStyleFiles } from './manifestHelpers'
import { buildStarterReadme } from './readme'
import type { ExportFile } from './types'
import type { Theme } from '../theme/types'

const PACKAGE_JSON = `{
  "name": "huesys-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "sass": "^1.102.0",
    "typescript": "~6.0.2",
    "vite": "^8.2.0"
  }
}
`

const TSCONFIG_JSON = `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
`

const TSCONFIG_APP_JSON = `{
  "compilerOptions": {
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
`

const TSCONFIG_NODE_JSON = `{
  "compilerOptions": {
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
`

const VITE_CONFIG_TS = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`

const VITE_ENV_D_TS = `/// <reference types="vite/client" />
`

const MAIN_TSX = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import './styles/global.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`

const GLOBAL_SCSS = `*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-body);
  color: var(--color-text);
  background-color: #fff;
}
`

const APP_SCSS = `.demo {
  max-width: 40rem;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background-color: #fff;
}

.demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

// Demo scaffolding only — keeps the Card sections on a plain white canvas
// rather than the Card component's own background, without touching Card.scss.
.demo .card {
  background-color: #fff;
}
`

const APP_TSX = `import { useState } from 'react'
import { Alert } from './components/Alert/Alert'
import { Badge } from './components/Badge/Badge'
import { Button } from './components/Button/Button'
import { Card } from './components/Card/Card'
import { Checkbox } from './components/Checkbox/Checkbox'
import { Input } from './components/Input/Input'
import { Radio } from './components/Radio/Radio'
import { Select } from './components/Select/Select'
import { Switch } from './components/Switch/Switch'
import { Textarea } from './components/Textarea/Textarea'
import './App.scss'

function App() {
  const [notifications, setNotifications] = useState(true)

  return (
    <main className="demo">
      <Card>
        <h1>Your design system</h1>
        <p>Every component below is styled with the Theme you generated in HueSys.</p>
        <div className="demo__row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="demo__row">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Card>

      <Card>
        <h2>Form</h2>
        <Input placeholder="Name" />
        <Textarea placeholder="Message" />
        <Select defaultValue="">
          <option value="" disabled>
            Choose an option
          </option>
          <option value="one">One</option>
          <option value="two">Two</option>
        </Select>
        <Checkbox defaultChecked>Subscribe to updates</Checkbox>
        <Radio name="plan" defaultChecked>
          Free plan
        </Radio>
        <Radio name="plan">Pro plan</Radio>
        <Switch checked={notifications} onChange={(event) => setNotifications(event.target.checked)}>
          Notifications
        </Switch>
      </Card>

      <Alert variant="info" title="Heads up">
        This is a generated Alert component, resolved to your Theme's Info color.
      </Alert>
    </main>
  )
}

export default App
`

function buildIndexHtml(fontId: string, theme: Theme): string {
  const fontLinks = getGoogleFontsLinkTags(fontId, theme)
  const fontLinkHtml = fontLinks ? `\n    ${fontLinks.join('\n    ')}` : ''
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HueSys Starter</title>${fontLinkHtml}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
}

/**
 * huesys-starter/
 * ├── src/
 * │   ├── components/<Name>/<Name>.tsx + .scss   (real source, unmodified)
 * │   ├── styles/_mixins.scss + theme.css + global.scss
 * │   ├── App.tsx + App.scss                      (plain demo, not the HueSys dashboard)
 * │   ├── main.tsx, vite-env.d.ts
 * ├── index.html, package.json, tsconfig*.json, vite.config.ts, README.md
 */
export function buildStarterManifest(theme: Theme, fontId: string): ExportFile[] {
  const files = buildComponentAndStyleFiles(theme, 'src/components', 'src/styles')
  files.push(
    { path: 'src/styles/global.scss', content: GLOBAL_SCSS },
    { path: 'src/App.tsx', content: APP_TSX },
    { path: 'src/App.scss', content: APP_SCSS },
    { path: 'src/main.tsx', content: MAIN_TSX },
    { path: 'src/vite-env.d.ts', content: VITE_ENV_D_TS },
    { path: 'index.html', content: buildIndexHtml(fontId, theme) },
    { path: 'package.json', content: PACKAGE_JSON },
    { path: 'tsconfig.json', content: TSCONFIG_JSON },
    { path: 'tsconfig.app.json', content: TSCONFIG_APP_JSON },
    { path: 'tsconfig.node.json', content: TSCONFIG_NODE_JSON },
    { path: 'vite.config.ts', content: VITE_CONFIG_TS },
    { path: 'README.md', content: buildStarterReadme(theme, fontId) },
  )
  return files
}
