# CLAUDE.md

# HueSys

HueSys is a web application that generates production-ready React design systems through three independent design areas:

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

Before making architectural or product decisions, read the relevant project documentation.

The documentation is the source of truth.

---

# Source of Truth

Use the following hierarchy when working on HueSys:

## Product and Technical Direction

Read:

```text
/docs/01-technical-specification.md
```

for the overall product definition and technical goals.

## Architecture

Read:

```text
/docs/02-architecture.md
```

for application state, Theme generation, component boundaries, CSS-variable architecture, and other structural decisions.

## Current Development Sequence

Read:

```text
/docs/04-development-plan.md
```

for the current implementation stage and what should or should not be built next.

Do not implement future stages unless explicitly requested.

## Dashboard Behavior

Read:

```text
/design/dashboard-spec.md
```

for detailed dashboard interactions, responsive behavior, Palette/Custom behavior, Undo/Redo, Live Preview behavior, and other product decisions that cannot be communicated through static designs alone.

## Visual Design

The current Figma dashboard design is the authoritative visual source of truth when it is provided or linked for implementation.

Files in:

```text
/design
```

may contain supporting visual references and snapshots.

Use this hierarchy:

```text
Figma
→ visual appearance

dashboard-spec.md
→ dashboard behavior

/docs
→ product and architecture

CLAUDE.md
→ implementation rules
```

Do not infer new product functionality from a visual design when behavior is already defined in the documentation.

---

# Engineering Philosophy

Always prioritize:

- Simplicity over flexibility
- Readability over cleverness
- Composition over configuration
- Accessibility by default
- Responsive design by default
- Clear architectural boundaries
- Deterministic derived behavior where appropriate
- Clean, maintainable source code

Do not introduce complexity unless it solves an existing problem.

Build only what is required for the current implementation stage.

---

# Core Product Architecture

HueSys uses three independent design concerns:

```text
Colors
Typography
Style
```

These combine to produce the generated Theme.

```text
Colors
+
Typography
+
Style
=
Theme
```

These concerns must remain independent.

Changing Colors must not change Typography or Style.

Changing Typography must not change Colors or Style.

Changing Style must not change Colors or Typography.

Do not reintroduce the previous Recipe architecture unless explicitly instructed by updated documentation.

---

# HueSys UI vs. Generated UI

HueSys contains two separate visual systems:

```text
HueSys Application UI
Generated Design System
```

Do not blur this boundary.

## HueSys Application UI

HueSys application UI includes:

- Header
- Navigation
- Options panels
- HueSys buttons
- HueSys inputs
- HueSys selects
- Segmented controls
- Undo / Redo
- Export
- Tooltips
- Application containers
- Other controls used to operate HueSys

These use fixed HueSys branding and internal tokens.

They must never consume generated Theme styling.

Changing Colors, Typography, or Style must not visually restyle the HueSys application.

HueSys internal UI is never exported.

## Generated Design System

Generated components include:

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

These consume the generated Theme.

They appear in Live Preview and will eventually be included in exports.

---

# Component Architecture

There must be one implementation of each generated/exportable component.

The same generated component implementation is used by:

```text
Live Preview
+
Starter Project Export
+
Component Package Export
```

Do not create separate preview versions of generated components.

HueSys application controls are explicitly allowed to have separate internal UI primitives.

For example:

```text
HueSys Button
Generated Button
```

is valid because these belong to different visual systems.

This does not violate the no-duplication rule.

Do not reuse generated components inside the HueSys application if doing so causes generated Theme settings to affect HueSys branding.

---

# Theme Architecture

Generated components should never receive Theme props.

Generated components consume semantic CSS custom properties.

The intended pipeline is:

```text
Application Design State
        │
        ├── Colors
        ├── Typography
        └── Style
                │
                ▼
              Theme
                │
                ▼
      themeToCssVariables()
                │
                ▼
       CSS Custom Properties
                │
                ▼
      Generated Components
```

The Theme is derived state.

Avoid independently storing values that can safely be derived from the application's design state.

---

# Color Architecture

HueSys supports:

```text
Palette
Custom
```

Palette mode generates a five-color Brand Palette.

Custom mode allows the user to directly control all five Brand Palette colors.

Both modes feed the same downstream Color Foundation.

The Color Foundation derives:

- Neutral Palette
- Semantic colors
- Contrast-safe supporting values

The Base Color in Palette mode must remain exact and must be the first Brand Palette color.

Refresh preserves the Base Color while generating another compatible palette.

Randomize generates a new Base Color and a new palette.

Do not allow Style or Typography to modify palette generation.

Reuse existing color-science infrastructure unless there is a concrete reason to change it.

---

# Typography Architecture

Typography consists of:

```text
Font
Font Size
Font Weight
```

Typography should generate a coherent typography system rather than applying one literal value globally.

Do not allow Typography changes to regenerate Colors or modify Style.

---

# Style Architecture

Style consists of:

```text
Border Radius
Spacing
```

Do not expand Style without an explicit requirement.

Border Radius should generate an appropriate radius scale.

Spacing should generate an appropriate spacing/density scale.

Properties not exposed as controls should use sensible fixed defaults.

Do not preserve hidden Recipe behavior for:

- color
- shadows
- border strength
- surface contrast
- other visual characteristics

unless the current documentation explicitly requires it.

---

# State

Application state should represent user design decisions.

Prefer storing:

- Color mode
- Palette state
- Custom color state
- Typography selections
- Style selections

Prefer deriving:

- Active Brand Palette
- Neutral Palette
- Semantic colors
- Typography tokens
- Radius scale
- Spacing scale
- Theme
- CSS-variable map

Avoid duplicated sources of truth.

---

# URL State

The URL is the canonical persistence/share representation of the current design.

It should contain enough information to restore the exact active design.

Do not serialize every derived Theme token when it can be reconstructed safely.

Design changes should generally update the current URL without creating excessive browser-history entries.

Browser navigation and HueSys design Undo/Redo are separate systems.

---

# Undo / Redo

Undo/Redo tracks meaningful design-state changes.

It may include changes to:

- Colors
- Typography
- Style

It should not include:

- dashboard navigation
- scrolling
- copying colors
- preview interactions
- Export interactions

Restore complete design-state snapshots rather than attempting to reverse isolated implementation operations.

---

# Accessibility

Accessibility is required for both HueSys application UI and generated components.

Prefer:

- Semantic HTML
- Native browser behavior
- Keyboard accessibility
- Visible focus states
- Proper labels
- Appropriate disabled states
- WCAG AA contrast where applicable

Do not replace native behavior with custom interaction logic without a clear reason.

Icon-only controls require accessible names.

---

# Responsive Design

Responsive behavior is required by default.

Do not treat responsiveness as a final optional polish step.

Follow the dashboard specification for:

- Wide workspace behavior
- Medium navigation/layout
- Small/mobile stacking
- Scrolling behavior
- Component reflow

Use content-driven breakpoints.

Prefer reflowing layouts over compressing controls below comfortable usable dimensions.

---

# Project Structure

Follow the architecture described in:

```text
/docs/02-architecture.md
```

Do not reorganize the project solely to match conceptual folder diagrams in the documentation.

Move or introduce folders only when the current implementation genuinely benefits from the architectural separation.

Keep generated/exportable components separate from HueSys internal application UI.

---

# Dependencies

Before introducing a dependency, determine whether it solves a concrete current problem.

Prefer existing platform capabilities and existing project utilities where practical.

Do not add dependencies for functionality already handled cleanly by the codebase.

If a new dependency is genuinely needed, explain why.

---

# Code Style

Favor code that a senior frontend engineer can understand immediately.

Prefer:

- Explicit code
- Focused files
- Small clear functions
- Semantic naming
- Pure derivation functions where practical
- Straightforward React patterns

Avoid:

- Clever abstractions
- Premature optimization
- Generic utilities with one consumer
- Deep configuration systems
- Speculative extensibility
- Duplicate state
- Unnecessary wrappers

Refactor when existing architecture conflicts with current requirements or when duplication becomes meaningful.

Do not refactor unrelated working code while implementing a focused task.

---

# Before Implementing New Features

Before introducing:

- new dependencies
- new folders
- new abstractions
- new utilities
- new state
- new configuration
- new user-facing controls

ask whether they genuinely solve the current requirement.

Prefer the simplest implementation that satisfies the current specification.

Do not expand scope beyond the requested development stage.

---

# Existing Code

HueSys already contains working infrastructure.

Preserve and reuse it where appropriate.

This includes existing work such as:

- OKLCH color conversion
- Palette generation
- Neutral generation
- Contrast utilities
- Semantic color generation
- Theme → CSS-variable conversion
- Generated components
- URL-state infrastructure

Do not rewrite working systems simply because the surrounding product architecture has changed.

Refactor only the portions that conflict with the current specification.

---

# Documentation

Documentation should remain synchronized with implementation.

If implementation changes:

- product architecture
- Theme architecture
- state architecture
- component boundaries
- documented behavior

update the relevant documentation.

Do not update documentation merely to justify an implementation that contradicts the current specification.

If implementation reveals a genuine conflict or missing decision, surface it rather than silently inventing new product behavior.

---

# Verification

Before considering a development stage complete, verify the requirements defined for that stage in:

```text
/docs/04-development-plan.md
```

At minimum, when applicable:

- Type-check
- Lint
- Production build
- Live application render
- Browser console
- Keyboard behavior
- Responsive behavior
- Relevant state behavior

Do not claim behavior was visually verified if the environment did not allow it to be tested.

Clearly distinguish between:

- implemented
- programmatically verified
- visually verified
- not verified

---

# Scope Discipline

Do not implement future roadmap ideas unless explicitly requested.

In particular, do not introduce features from:

```text
/docs/ideas.md
```

unless the user specifically promotes one into current scope.

Do not expand the MVP into:

- dark mode
- accounts
- cloud storage
- full token editing
- page building
- drag-and-drop design
- arbitrary Style controls
- additional generated components
- Export Engine work before its planned phase

unless explicitly instructed.

---

# When Unsure

When multiple reasonable implementations exist:

1. Follow the current task.
2. Follow `/design/dashboard-spec.md` for dashboard behavior.
3. Follow `/docs/02-architecture.md` for architecture.
4. Follow `/docs/01-technical-specification.md` for product direction.
5. Follow `/docs/04-development-plan.md` for scope and implementation sequence.
6. Choose the simplest implementation consistent with those documents.
7. Preserve working code where possible.
8. Do not expand scope.

If the documentation genuinely conflicts, identify the conflict before making a major architectural decision.