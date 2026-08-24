# HueSys Development Plan

## Purpose

This document defines the implementation sequence for HueSys.

The project has completed its initial technical foundation and component-library work. The current focus is restructuring the application around the finalized dashboard model:

```text
Colors
+
Typography
+
Style
↓
Generated Theme
↓
Live Preview
↓
Export
```

The immediate priority is completing the redesigned HueSys dashboard and stabilizing the Theme-generation architecture before implementing the Export Engine.

For detailed product behavior, refer to:

```text
/design/dashboard-spec.md
```

For architectural rules, refer to:

```text
/docs/02-architecture.md
```

The Figma dashboard design is the visual source of truth.

---

# Current Project Status

The initial HueSys foundation has already established:

- React + TypeScript + Vite application
- SCSS styling
- Generated Theme object
- CSS-variable pipeline
- OKLCH color utilities
- Tonal color generation
- Neutral color generation
- Contrast utilities
- Five-color palette generation
- Semantic color generation
- URL-state infrastructure
- Generated component library
- Live component preview
- Initial Theme controls
- Responsive application foundation

The generated MVP component library currently includes:

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

The project previously used a Recipe-based Theme architecture.

That architecture is now being replaced by the simpler product model:

```text
Colors + Typography + Style → Theme
```

The dashboard redesign should reuse working foundation code where possible rather than rebuilding HueSys from scratch.

---

# Completed Foundation

The following work corresponds broadly to the original Phases 1–4.

These phases are considered complete as foundation work, although some of their implementation will be refactored during the dashboard redesign.

---

## Foundation 1 — Application and Theme Infrastructure

Completed:

- Vite + React + TypeScript application
- SCSS setup
- HueSys application shell
- Theme types
- Theme → CSS variable conversion
- URL-based application state
- Initial generated Button component
- Separation between application layout and generated components

---

## Foundation 2 — Color Engine

Completed:

- Hex normalization
- OKLCH conversion
- Primary tonal scale generation
- Neutral scale generation
- WCAG contrast utilities
- Foreground color selection
- Color Foundation
- Five-color Brand Palette generation
- Palette harmony strategies
- Semantic color derivation

Existing color-science infrastructure should be preserved unless the redesigned product behavior requires a targeted change.

Do not rewrite working color math solely as part of the dashboard redesign.

---

## Foundation 3 — Generated Component Library

Completed MVP components:

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

Established principles include:

- Semantic HTML
- Native browser behavior where practical
- Keyboard accessibility
- Visible focus states
- CSS-variable-driven styling
- Minimal component APIs
- Shared generated components between Live Preview and future exports

These components remain the generated/exportable component library.

---

## Foundation 4 — Initial Controls and Preview

Completed:

- Primary color control
- Initial palette generation controls
- Font selection
- Live Theme updates
- URL synchronization
- Browser Back/Forward support
- Component gallery
- Palette display
- Neutral palette display
- Copyable color swatches

Some of this work reflects the previous Recipe-era product model and will be refactored during the dashboard redesign.

---

# Current Development Phase — Dashboard Redesign

The dashboard redesign should be implemented in six controlled stages:

```text
A. Product and State Architecture

B. HueSys Application Shell

C. Colors

D. Typography + Style

E. Live Preview

F. Responsive Behavior + Accessibility + Polish
```

Do not implement all six stages in one large change.

Each stage should leave the application working before moving to the next.

---

# Stage A — Product and State Architecture

## Goal

Refactor HueSys's underlying application state and Theme-generation pipeline to support the finalized product model before implementing the new visual design.

This stage is primarily architectural.

Do not attempt to reproduce the Figma dashboard styling during Stage A.

The existing UI may remain visually unchanged where practical.

---

## A1. Remove the Recipe-Era Product Model

The previous Recipe system combined characteristics such as:

- color behavior
- neutral behavior
- radius
- shadows
- borders
- surface treatment

That model is no longer the intended architecture.

Refactor or remove obsolete Recipe concepts where they conflict with:

```text
Colors
+
Typography
+
Style
=
Theme
```

Do not maintain two competing Theme-generation systems.

Useful implementation code may remain when it still has a clear purpose.

---

## A2. Establish Color State

Color state must support:

```text
Palette Mode
Custom Mode
```

Palette state should support:

- Base Color
- Exact five-color generated Brand Palette
- Palette variation state needed for Refresh

Custom state should support:

- Exact five-color custom Brand Palette

Palette and Custom should maintain independent state during the session.

The active Brand Palette is derived from the active mode.

---

## A3. Establish Typography State

Typography state should contain:

```text
Font
Font Size
Font Weight
```

Options:

### Font Size

- Small
- Medium
- Large

### Font Weight

- Regular
- Medium
- Semibold

Font selection should support the curated font collection defined later in Stage D.

---

## A4. Establish Style State

Style state should contain only:

```text
Border Radius
Spacing
```

Options:

### Border Radius

- Sharp
- Subtle
- Rounded
- Soft

### Spacing

- Compact
- Medium
- Spacious

Do not preserve hidden Recipe characteristics as Style behavior.

Properties not exposed to users should use sensible fixed defaults.

---

## A5. Establish Theme Assembly

The Theme pipeline should become:

```text
Active Brand Palette
        │
        ▼
Color Foundation
        │
        ├── Neutral Palette
        └── Semantic Colors

Typography State
        │
        ▼
Typography Tokens

Style State
        │
        ▼
Radius + Spacing Tokens

Color Foundation
+
Typography Tokens
+
Style Tokens
+
Fixed Structural Defaults
        │
        ▼
Theme
        │
        ▼
CSS Variables
        │
        ▼
Generated Components
```

Colors, Typography, and Style must remain independent inputs.

---

## A6. Establish URL State

The URL should be capable of restoring:

- active dashboard section
- Palette / Custom mode
- exact active five-color Brand Palette
- Base Color when applicable
- Font
- Font Size
- Font Weight
- Border Radius
- Spacing

Derived values should not be serialized unnecessarily.

These include:

- Neutral Palette
- Semantic Colors
- generated typography scale
- generated radius scale
- generated spacing scale
- Theme
- CSS-variable map

Invalid URL values should safely fall back to valid defaults.

---

## A7. Establish Design History

Introduce or prepare the state architecture for HueSys Undo/Redo.

Design history should track meaningful changes to:

- Colors
- Typography
- Style

It should not track:

- navigation
- scrolling
- copying colors
- preview interaction
- Export interaction

Undo/Redo should restore complete design-state snapshots.

---

## Stage A Completion Criteria

Stage A is complete when:

- Recipe-era product behavior is no longer driving Theme generation
- Colors, Typography, and Style exist as independent state
- Palette and Custom color state are represented correctly
- Theme generation uses the new model
- URL state can represent the new design state
- Existing generated components still render correctly
- Type-check passes
- Lint passes
- Production build passes
- The application runs without console errors

Visual fidelity to Figma is not required yet.

---

# Stage B — HueSys Application Shell

## Goal

Implement the redesigned HueSys application structure and establish the visual boundary between HueSys UI and generated UI.

Use the Figma dashboard design as the visual source of truth for this stage.

---

## B1. Create the Fixed HueSys UI Layer

HueSys application controls should use their own fixed styling.

This includes:

- Header
- Navigation
- Options Panel
- Buttons
- Inputs
- Selects
- Segmented controls
- Undo / Redo
- Export
- Tooltips
- Application containers

HueSys UI must not consume generated Theme variables.

---

## B2. Internal UI Primitives

Create small internal HueSys UI primitives where useful.

Examples may include:

- HueSys Button
- HueSys Input
- HueSys Select
- Icon Button
- Segmented Control

Do not overbuild an internal component library.

Only extract components that have meaningful reuse.

These internal components are never exported.

---

## B3. Desktop Workspace

Implement the wide layout:

```text
Sidebar | Options | Live Preview
```

At wide desktop sizes:

- Header remains stationary
- Sidebar remains stationary
- Options remain available
- Live Preview scrolls independently
- Options may scroll independently if necessary
- Body/document scrolling should normally be avoided

---

## B4. Navigation

Implement:

```text
Colors
Typography
Style
```

Navigation changes the Options content without remounting or resetting Live Preview.

The Live Preview should preserve scroll position when navigation changes.

Navigation should be reflected in the URL.

---

## B5. Header Actions

Implement the visual shell for:

- Undo
- Redo
- Export

Export remains disabled/non-functional until the Export Engine phase.

---

## Stage B Completion Criteria

Stage B is complete when:

- Dashboard shell matches the Figma direction
- HueSys application styling is fixed
- Generated Theme changes do not restyle HueSys controls
- Colors / Typography / Style navigation works
- Live Preview remains mounted during navigation
- Wide workspace scrolling behaves correctly
- Undo / Redo / Export are positioned appropriately
- Type-check, lint, and build pass

---

# Stage C — Colors

## Goal

Implement the finalized Palette and Custom workflows.

---

## C1. Palette / Custom Modes

Colors contains:

```text
Palette | Custom
```

Switching modes should preserve each mode's independent state.

The first time Custom is opened, initialize it from the current Palette colors.

---

## C2. Base Color

Palette mode includes:

- circular color swatch
- valid hex input
- Refresh control

The Base Color:

- must remain exact
- must be the first Brand Palette color
- must not change when Refresh is used

---

## C3. Randomize

Randomize generates:

```text
New Base Color
+
New five-color Brand Palette
```

It represents a completely new color direction.

---

## C4. Refresh

Refresh generates:

```text
Same Base Color
+
Different compatible Brand Palette
```

Refresh should support multiple valid palette generations around one Base Color.

---

## C5. Custom Mode

Custom mode allows direct editing of all five Brand Palette colors.

Custom mode does not display:

- Base Color
- Refresh
- Randomize

Valid Custom changes update Live Preview immediately.

---

## C6. Brand Palette Presentation

Display five prominent adjacent Brand Palette swatches.

Support:

- hover/focus hex display
- click to copy
- keyboard activation
- copied feedback
- visible focus state

In Palette mode, the Base Color is the first swatch.

An additional marker may be used only if it improves clarity without clutter.

---

## C7. Neutral Palette

Display the generated neutral scale.

Neutral colors remain:

- generated
- read-only
- derived from the active Brand Palette
- independent from Typography
- independent from Style

Neutral swatches should support the same copy interaction where practical.

---

## C8. Semantic Colors

Continue deriving semantic colors from the active Brand Palette.

Preserve recognizable:

- success
- warning
- danger
- informational/accent behavior

Do not revert to unrelated generic fixed colors.

---

## Stage C Completion Criteria

Stage C is complete when:

- Palette mode works
- Custom mode works
- Randomize works
- Refresh preserves Base Color
- Multiple Refresh results are possible
- Base Color remains first in the palette
- Custom colors remain editable
- Mode switching preserves state
- Brand Palette is clearly presented
- Neutral Palette is clearly presented
- Copy interactions work accessibly
- Color changes update generated components immediately
- Type-check, lint, and build pass

---

# Stage D — Typography and Style

## Goal

Implement the remaining independent design controls.

---

# D1. Typography

Typography includes:

```text
Font
Font Size
Font Weight
```

---

## Font Collection

Provide a curated collection of at least 10 versatile fonts.

The collection should offer meaningful visual variety without becoming a font marketplace.

Include a balanced mix of appropriate categories such as:

- modern sans-serif
- geometric sans-serif
- humanist sans-serif
- serif
- UI-friendly display options
- monospace

Font definitions should remain easy to replace in exported code.

---

## Font Size

Options:

```text
Small
Medium
Large
```

Each option should generate an appropriate proportional typography scale.

Do not apply one literal size globally.

---

## Font Weight

Options:

```text
Regular
Medium
Semibold
```

Each option should influence typography hierarchy appropriately.

Do not apply one literal font weight globally.

---

# D2. Style

Style includes:

```text
Border Radius
Spacing
```

---

## Border Radius

Options:

```text
Sharp
Subtle
Rounded
Soft
```

Each produces an appropriate radius scale.

Preserve semantic shape exceptions such as circular Radio controls.

---

## Spacing

Options:

```text
Compact
Medium
Spacious
```

Spacing primarily controls generated component density.

It may affect:

- control height
- component padding
- card padding
- alert padding
- internal gaps

It should not restructure the HueSys application.

---

## Stage D Completion Criteria

Stage D is complete when:

- at least 10 curated Font options are available
- Font changes update generated components
- Font Size generates meaningful proportional differences
- Font Weight generates meaningful hierarchy differences
- Radius options visibly affect appropriate components
- Spacing options visibly affect component density
- Typography does not alter Colors or Style
- Style does not alter Colors or Typography
- HueSys application UI remains visually unchanged
- Type-check, lint, and build pass

---

# Stage E — Live Preview

## Goal

Implement the Figma-directed Live Preview as a curated interactive specimen of the generated system.

---

## E1. Preserve Component Coverage

Live Preview should demonstrate all 10 MVP generated components:

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

Do not remove components simply to fit the viewport.

---

## E2. Curated Presentation

Show representative variants and states rather than every possible permutation.

Use the Figma design as the primary visual reference.

Possible groupings include:

```text
Buttons

Inputs
Selection Controls

Alerts
Badges

Cards
```

---

## E3. White Evaluation Canvas

The generated component specimen should sit on a stable white background.

Do not tint the entire preview canvas using generated neutrals.

Demonstrate generated neutrals through:

- fields
- borders
- cards
- muted text
- disabled states
- secondary surfaces

---

## E4. Palette Usage

Use the five-color Brand Palette logically throughout the generated system.

Do not use only the Base Color.

Do not force all five colors into arbitrary component roles simply to demonstrate them.

The result should remain coherent and usable.

---

## E5. Interactivity

Preview components remain real interactive controls.

Users should be able to:

- type into Input
- type into Textarea
- open Select
- toggle Checkbox
- select Radio
- toggle Switch
- interact with enabled Buttons

These interactions do not enter design history.

---

## E6. Preview Persistence

Changing:

- Colors
- Typography
- Style
- dashboard section

must not reset Live Preview scroll position.

---

## Stage E Completion Criteria

Stage E is complete when:

- all 10 generated components are represented
- preview layout follows the Figma direction
- palette usage feels intentional
- generated neutrals are visible in meaningful component roles
- Typography changes are easy to evaluate
- Style changes are easy to evaluate
- interactive controls work
- preview scroll position is preserved
- preview updates immediately from Theme changes
- Type-check, lint, and build pass

---

# Stage F — Responsive Behavior, Accessibility, and Polish

## Goal

Verify the complete dashboard as a cohesive MVP experience.

---

## F1. Wide Layout

Verify:

```text
Sidebar | Options | Live Preview
```

with appropriate independent scrolling.

---

## F2. Medium Layout

Replace the Sidebar with text navigation:

```text
Colors | Typography | Style
```

Keep:

```text
Options | Live Preview
```

side-by-side while sufficient space exists.

Do not introduce an icon-only navigation rail.

---

## F3. Small / Mobile Layout

Use:

```text
Top Navigation

Options

Live Preview
```

Return to normal document scrolling.

Avoid unnecessary nested scrolling.

---

## F4. Component Reflow

Preview groups should stack/reflow before individual generated components are compressed below usable dimensions.

Controls should remain comfortable to:

- read
- click
- tap
- focus

---

## F5. Accessibility Verification

Verify:

- keyboard navigation
- visible focus states
- accessible names
- semantic HTML
- disabled states
- color contrast
- swatch keyboard interaction
- Refresh accessible name
- Undo accessible name
- Redo accessible name
- responsive usability

---

## F6. State Verification

Verify:

- URL restoration
- page refresh restoration
- shareable URL reconstruction
- invalid URL fallback
- browser Back/Forward navigation
- Undo
- Redo
- redo-branch invalidation
- Palette/Custom state preservation

---

## F7. Final Polish

Review:

- spacing
- typography
- control alignment
- overflow
- scrollbar behavior
- copy feedback
- hover states
- focus states
- empty/disabled states
- transition consistency

Do not expand product scope during polish.

---

## Stage F Completion Criteria

The dashboard redesign is complete when:

- Wide, Medium, and Small layouts work
- HueSys UI remains visually independent from generated Theme styling
- Colors, Typography, and Style behave independently
- Palette and Custom workflows are understandable
- Live Preview is complete and interactive
- URL persistence works
- Undo/Redo works
- keyboard navigation works
- contrast remains accessible
- no unexpected overflow exists
- no console errors exist
- type-check passes
- lint passes
- production build passes

---

# Phase 5 — Export Engine

Begin Export Engine implementation only after the redesigned dashboard and Theme architecture are stable.

The dashboard should contain a single Export action.

During dashboard development this action remains disabled or intentionally unavailable.

---

## Export Targets

HueSys will support:

### Starter Project

A complete Vite project containing:

```text
generated-project/
├── src/
│   ├── components/
│   ├── styles/
│   └── App.tsx
├── package.json
└── README.md
```

### Component Package

Reusable generated components and design-system styles for integration into an existing React application.

The exact package structure will be finalized during this phase.

---

## Export Requirements

Export should consume:

```text
Final Theme
+
Generated Component Library
```

It should not care whether colors originated from:

- Randomize
- Base Color generation
- Custom mode

Export must not include:

- HueSys application UI
- HueSys internal UI tokens
- HueSys navigation
- HueSys Options controls
- HueSys Undo/Redo
- HueSys-specific application state

---

## Export Philosophy

Generated code should feel intentionally written rather than machine-generated.

Avoid:

- unnecessary abstractions
- excessive wrappers
- runtime HueSys dependencies
- generated-code frameworks
- complicated configuration systems

Prefer:

- readable React
- TypeScript
- SCSS
- semantic CSS custom properties
- simple component APIs
- clear project structure

---

# Phase 6 — MVP Finalization

After Export is functional, perform final MVP verification.

---

## Final QA

Verify:

- palette generation
- Base Color generation
- Refresh behavior
- Randomize behavior
- Custom color editing
- neutral generation
- semantic colors
- typography
- radius
- spacing
- URL persistence
- Undo/Redo
- generated component behavior
- responsive layouts
- keyboard navigation
- focus states
- contrast
- exports
- clean console
- clean type-check
- clean lint
- clean production build

---

## Documentation Review

Before MVP release, review:

```text
README.md
CLAUDE.md
docs/01-technical-specification.md
docs/02-architecture.md
docs/03-roadmap.md
docs/04-development-plan.md
design/dashboard-spec.md
```

Documentation should reflect the actual implemented architecture.

Remove obsolete Recipe-era terminology where it no longer represents historical context.

---

# Development Rules

Throughout all remaining stages:

- Do not introduce dependencies without a concrete need.
- Do not rewrite working systems unnecessarily.
- Do not expand scope while implementing another feature.
- Do not duplicate generated component implementations.
- Do not allow generated Theme values to style HueSys application controls.
- Do not allow Style to modify Colors.
- Do not allow Typography to modify Colors.
- Do not serialize safely derivable state unnecessarily.
- Keep functions pure where practical.
- Prefer semantic HTML.
- Prefer native browser behavior.
- Maintain accessibility.
- Maintain responsive behavior.
- Keep the application working between stages.

When a stage reveals a genuine architectural issue, fix the architecture rather than layering a workaround over it.

---

# MVP Completion Definition

HueSys reaches MVP when a user can:

```text
Open HueSys
      ↓
Generate or customize Colors
      ↓
Choose Typography
      ↓
Choose Style
      ↓
Evaluate the complete system in Live Preview
      ↓
Undo / Redo design decisions
      ↓
Refresh or share the URL without losing the design
      ↓
Export clean React source code
```

The final experience should remain understandable as:

> Choose your colors. Choose your typography. Choose your style. Preview the system. Export it.