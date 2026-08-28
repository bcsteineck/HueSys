# HueSys Roadmap

## Now — MVP

The current focus is completing the core HueSys design-system generation experience.

### Dashboard

- Colors / Typography / Style workflow
- Fixed HueSys application UI separate from generated Theme styling
- Responsive design-tool workspace
- Live interactive component preview
- Design-state Undo / Redo
- URL-based state persistence and sharing

### Colors

- Palette and Custom modes
- Five-color Brand Palette
- Randomize an entirely new color direction
- Generate palettes from an existing Base Color
- Refresh to explore additional palettes around the same Base Color
- Direct editing of all five Brand Palette colors in Custom mode
- Generated Neutral Palette
- Generated semantic colors
- Accessible foreground/background contrast

### Typography

- Curated collection of at least 10 fonts
- Small / Medium / Large typography scale options
- Regular / Medium / Semibold weight options
- Generated typography tokens
- Typography independent from Colors and Style

### Style

- Sharp / Subtle / Soft / Rounded Border Radius options
- Compact / Medium / Spacious Spacing options
- Generated radius and spacing scales
- Sensible fixed defaults for structural properties not exposed as controls
- Style independent from Colors and Typography

### Generated Component Library

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Card
- Alert

Components should remain:

- Accessible
- Responsive
- Composable
- Production-ready
- Portable
- Shared between Live Preview and future exports

### Export

After the redesigned dashboard and Theme architecture are stable:

- Starter Project export
- Component Package export

Exported code should use:

- React
- TypeScript
- SCSS
- CSS custom properties
- Clean semantic design tokens
- The same generated component implementations used by Live Preview

---

## Next — Product Depth

After the MVP is stable:

- Dark mode generation
- Additional generated components
- Improved palette-generation strategies
- Additional curated font options where useful
- Additional export targets
- Theme comparison
- Saved themes
- Shareable theme workflows beyond URL state
- Accessibility reporting
- Design-token documentation
- Improved generated code documentation
- Optional Storybook export

Features should only be added when they strengthen HueSys as a focused design-system generator.

Avoid turning HueSys into a general-purpose visual design editor.

---

## Later — Ecosystem

Potential longer-term directions include:

- Community theme sharing
- Public theme gallery
- Theme templates
- Framework integrations
- Design-tool integrations
- Plugin ecosystem
- Team workflows
- Theme versioning
- Design-system documentation generation

These ideas should not influence MVP architecture unless a current requirement genuinely needs them.

---

## Product Direction

HueSys should continue to center on a simple workflow:

```text
Choose your colors.
Choose your typography.
Choose your style.
Preview the system.
Export it.