# HueSys Architecture v1.2

## Architecture Overview

HueSys separates design-system generation into three independent concerns:

```text
Colors
Typography
Style
```

These concerns are combined to produce the final generated Theme.

```text
Color State ──────────────┐
                         │
Typography State ────────┼──→ Theme
                         │       │
Style State ─────────────┘       ▼
                          CSS Variables
                                │
                                ▼
                     Generated Components
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
               Live Preview             Export Engine
```

The central mental model is:

```text
Theme = Colors + Typography + Style
```

These systems remain independent.

- Changing Colors never changes Typography or Style.
- Changing Typography never changes Colors or Style.
- Changing Style never changes Colors or Typography.

The Theme is assembled from these independent decisions and becomes the single source of truth for the generated component system.

---

# Architecture Boundaries

HueSys contains two distinct visual systems:

```text
HueSys Application UI
Generated Design System
```

They must remain architecturally separate.

The HueSys application is the tool used to configure a design system.

The generated design system is the output being configured.

This boundary is fundamental to the architecture.

---

# HueSys Application UI

The HueSys application includes:

- Header
- Navigation
- Options panels
- Palette/Custom controls
- Base Color controls
- Randomize
- Refresh
- Typography controls
- Style controls
- Undo
- Redo
- Export
- Tooltips
- Copy feedback
- Application containers
- Application navigation
- Other internal interface controls

HueSys uses a fixed visual identity.

It does not consume generated Theme variables.

Changing the generated design system must never restyle the HueSys application itself.

Conceptually:

```text
HueSys UI Tokens
        │
        ▼
HueSys Internal UI

Generated Theme
        │
        ▼
Live Preview Components
```

These styling pipelines remain separate.

---

# HueSys Internal UI Tokens

HueSys may use a small fixed set of internal design tokens for its own interface.

These may include:

```text
HueSys UI Tokens
├── Colors
├── Typography
├── Spacing
├── Radius
└── Shadows
```

These tokens:

- are fixed
- are not generated
- do not respond to user Theme settings
- are not part of the generated Theme
- are never exported

Do not build a second Theme Engine for HueSys itself.

Simple CSS custom properties or SCSS variables are sufficient.

---

# Generated Component Library

The generated component library is the production-ready output of HueSys.

The MVP library contains:

```text
components/
├── Button/
├── Input/
├── Textarea/
├── Select/
├── Checkbox/
├── Radio/
├── Switch/
├── Badge/
├── Card/
└── Alert/
```

The same generated component implementation is used by:

```text
Live Preview
+
Starter Project Export
+
Component Package Export
```

There must be one implementation of each generated/exportable component.

Improving a generated component automatically improves both the Live Preview and exported output.

---

# Internal UI Components vs. Generated Components

HueSys application controls do not need to reuse the generated/exportable components.

For example, the application may contain:

```text
HueSys Button
Generated Button

HueSys Input
Generated Input

HueSys Select
Generated Select
```

These are not considered duplicate implementations because they belong to different visual systems and serve different purposes.

The architectural rule is:

> There must be one implementation of each generated/exportable component.

HueSys internal components are separate application infrastructure.

They:

- use HueSys UI tokens
- never consume the generated Theme
- are never exported

The generated components:

- consume generated Theme variables
- appear inside Live Preview
- are included in future exports

---

# Color Architecture

Color generation is independent from Typography and Style.

The active color system consists of:

```text
Color State
├── Mode
├── Brand Palette
├── Base Color (Palette mode)
├── Neutral Palette
└── Semantic Colors
```

There are two user-facing color modes:

```text
Palette
Custom
```

Both ultimately produce an active five-color Brand Palette.

The downstream Theme assembly does not need to care how that Brand Palette was created.

Conceptually:

```text
Randomize ───────────────┐
                         │
Base Color + Refresh ────┼──→ Brand Palette
                         │
Custom Colors ───────────┘
                                │
                                ▼
                         Color Foundation
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              Neutral Palette         Semantic Colors
                    │                       │
                    └───────────┬───────────┘
                                ▼
                           Theme Colors
```

---

# Palette Mode

Palette mode uses the Palette Engine.

The Palette Engine produces a five-color Brand Palette.

Inputs include:

- Base Color
- Palette variation input/seed where required

Output:

- Five-color Brand Palette

The Base Color is always the first Brand Palette color.

When explicitly supplied or currently active, it must be preserved exactly.

Do not alter, approximate, or replace the Base Color during palette generation.

---

## Randomize

Randomize means:

```text
Generate new Base Color
        +
Generate new palette around it
```

Randomness may be used to select the new Base Color and/or palette variation input.

The palette-generation functions themselves should remain reproducible from explicit inputs where practical.

---

## Refresh

Refresh means:

```text
Preserve Base Color
        +
Generate another valid palette around it
```

Refresh must not change:

- Base Color
- Typography
- Style

The implementation may use a variation seed or another explicit deterministic variation input.

The exact internal mechanism is less important than the required behavior:

> The same Base Color can produce multiple intentional palette directions without changing the Base Color itself.

---

## Base Color Entry

When a user enters a valid Base Color:

```text
Base Color
    │
    ▼
Palette Engine
    │
    ▼
Five-color Brand Palette
```

The Base Color appears exactly as entered as the first Brand Palette color.

Incomplete or invalid color input must not produce malformed palette state.

---

# Custom Mode

Custom mode bypasses Brand Palette generation.

The user directly controls all five Brand Palette colors.

Conceptually:

```text
Five Custom Colors
        │
        ▼
Active Brand Palette
        │
        ▼
Color Foundation
```

HueSys still derives:

- Neutral Palette
- Semantic Colors
- Theme color tokens

from the resulting Brand Palette.

Custom mode therefore does not bypass the Color Foundation.

It only bypasses generation of the five Brand Palette colors.

---

# Palette and Custom State

There is one current Brand Palette. Palette mode generates it. Custom mode edits it. They are not two independently persisted color datasets — `mode` describes which controls are visible, not which of two palettes is active.

Conceptually:

```text
ColorState
├── mode
├── colors
└── variation
```

The exact TypeScript structure may differ if a simpler representation is appropriate, but the behavior must remain:

- Switching modes never itself changes `colors`.
- Palette-mode generation (Base Color entry, Refresh, Randomize) replaces `colors` with a newly generated palette, which becomes the current palette regardless of which mode is active when it happens.
- Custom-mode edits replace `colors` directly, one color at a time.
- Color #1 (`colors.master`) is always the Base Color — there is no separate anchor field to fall out of sync with it. A Custom edit to color #1 is immediately reflected as the Base Color shown in Palette mode.
- `variation` seeds Refresh's next generation and is independent of `colors` — it is never used to reconstruct them.

---

# Brand Palette

The Brand Palette always contains five colors.

Conceptually:

```text
BrandPalette = [
  color1,
  color2,
  color3,
  color4,
  color5
]
```

In Palette mode:

```text
color1 = Base Color
```

The other four colors are generated as harmonious supporting colors.

The palette should contain distinct-but-compatible colors rather than simply producing five tints of the same hue.

Existing OKLCH and harmony-generation infrastructure should be reused where appropriate.

---

# Neutral Palette

HueSys derives a neutral scale from the active Brand Palette.

The Neutral Palette is:

- generated
- read-only
- deterministic from its inputs
- independent from Typography
- independent from Style

Style must never regenerate or modify the displayed Neutral Palette.

The neutral scale supports Theme roles such as:

- background
- surface
- borders
- muted text
- disabled states
- structural component treatments

The user-facing dashboard may display the full neutral scale while Theme assembly selects appropriate steps for semantic roles.

---

# Semantic Colors

HueSys derives semantic colors including:

- success
- warning
- danger
- informational/accent roles where needed

Semantic colors should remain recognizable for their intended purpose while harmonizing with the active Brand Palette.

They should not be unrelated fixed generic colors.

Semantic colors are generated output and are not directly editable in the MVP.

---

# Color Foundation

The Color Foundation is the normalized color output used by Theme assembly.

Conceptually:

```text
ColorFoundation
├── Brand Palette
├── Neutral Palette
├── Semantic Colors
└── Contrast-safe supporting values
```

The existing color-science infrastructure should remain responsible for concerns such as:

- hex normalization
- OKLCH conversion
- palette harmony
- neutral generation
- contrast calculation
- foreground selection
- semantic-color derivation

Do not move typography or structural Style responsibilities into the Color Foundation.

---

# Typography Architecture

Typography is independent from Colors and Style.

User-facing Typography state contains:

```text
TypographyState
├── Font
├── Size
└── Weight
```

These selections are converted into generated typography tokens.

Conceptually:

```text
Typography State
        │
        ▼
Typography Generator
        │
        ▼
Typography Tokens
```

Typography changes never regenerate colors or structural Style tokens.

---

# Font

HueSys provides a curated collection of at least 10 fonts.

Font definitions should contain the metadata necessary to resolve usable font-family values and supported weights.

Conceptually:

```text
FontDefinition
├── id
├── label
├── family
└── supportedWeights
```

The exact implementation may remain minimal.

Do not introduce unnecessary font abstraction.

The generated Theme should ultimately expose a stable font-family token.

---

# Typography Scale

Font Size options are:

```text
Small
Medium
Large
```

These options generate a proportional typography scale.

Conceptually:

```text
TypographyScale
├── xs
├── sm
├── base
├── lg
├── xl
└── ...
```

Exact scale depth should be based on actual component needs.

Do not create unused typography tokens solely for theoretical completeness.

Changing Font Size modifies the scale values, not the token names.

---

# Typography Weight

Font Weight options are:

```text
Regular
Medium
Semibold
```

These represent typography hierarchy presets rather than one global CSS font-weight.

The generated system may derive roles such as:

```text
body
label
control
heading
strong
```

from the selected weight personality.

Resolve unsupported exact font weights sensibly based on the selected Font definition.

---

# Style Architecture

Style controls structural component appearance only.

It has no ability to generate or influence color.

It has no ability to change Typography.

The MVP Style state contains:

```text
StyleState
├── Radius
└── Spacing
```

This replaces the previous curated Recipe/Style model.

---

# Radius

Radius options:

```text
Sharp
Subtle
Soft
Rounded
```

Each option maps to a generated radius scale.

Conceptually:

```text
RadiusScale
├── sm
├── md
└── lg
```

Exact values may be tuned during implementation.

Components consume semantic radius tokens rather than receiving Style configuration directly.

Semantic shape exceptions remain valid.

For example, Radio remains circular regardless of the selected radius scale.

---

# Spacing

Spacing options:

```text
Compact
Medium
Spacious
```

Each option maps to a generated spacing scale.

Conceptually:

```text
SpacingScale
├── xs
├── sm
├── md
├── lg
└── xl
```

Only create the scale depth actually needed by the component library.

Generated components use these values for appropriate internal spacing such as:

- padding
- control height
- gaps
- card spacing
- alert spacing

Spacing controls component density.

It should not unexpectedly restructure the HueSys application itself.

---

# Fixed Structural Defaults

Not every visual property needs a user-facing control.

Properties such as:

- shadows
- border strength
- surface treatment
- transitions

should use carefully chosen fixed defaults for the MVP.

These values may still exist as Theme tokens.

They simply do not vary based on a hidden Recipe or Style preset.

Do not preserve obsolete Recipe behavior behind the new interface.

If the user cannot control a property, its behavior should remain predictable.

---

# Theme Object

The Theme Object is the single source of truth for generated component styling.

Conceptually:

```text
Theme
├── Metadata
├── Colors
├── Typography
├── Radius
├── Spacing
├── Shadows
├── Borders
└── Transitions
```

The exact TypeScript structure should remain driven by actual implementation needs.

Avoid adding generic token branches when typed semantic categories already describe the values.

The Theme is generated from:

```text
Color Foundation
+
Typography Tokens
+
Style Tokens
+
Fixed Structural Defaults
```

Conceptually:

```text
generateTheme(
  colors,
  typography,
  style
) → Theme
```

The Theme generation function should remain pure and predictable from its explicit inputs.

---

# Design Tokens

HueSys uses fixed semantic token names.

Examples:

```text
--color-primary
--color-primary-text
--color-accent
--color-background
--color-surface
--color-text
--color-text-muted
--color-border
--color-success
--color-warning
--color-danger

--font-family
--font-size-base
--font-weight-body
--font-weight-control

--radius-sm
--radius-md
--radius-lg

--space-sm
--space-md
--space-lg

--shadow-sm
--shadow-md
```

Exact token inventory should be based on actual component needs.

Token names remain stable.

Only values change.

Do not create multiple names for the same semantic purpose.

---

# CSS Variables

Generated components consume Theme values through CSS custom properties.

The pipeline is:

```text
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

Components never receive Theme props.

Generated components should not import Theme-generation logic.

They consume semantic CSS variables only.

This keeps the component library portable and makes exported code straightforward.

---

# Generated CSS Output

Generated projects should contain a clear source of design-token CSS variables.

The exact file structure may be finalized during Export Engine implementation.

The important requirement is that exported token values are:

- readable
- organized
- easy to modify
- independent from HueSys runtime code

Developers should be able to replace values such as fonts or colors without needing the HueSys application.

---

# Component Philosophy

Generated components should:

- Use semantic HTML
- Be accessible
- Be responsive
- Be composable
- Expose minimal props
- Support variants only where useful
- Remain portable
- Use generated CSS variables
- Prefer native browser behavior

Components never receive Theme props.

Do not add component configuration solely because a theoretical design system might need it.

---

# Folder Philosophy

Keep files and folders focused.

Generated components should remain simple.

Example:

```text
components/
└── Button/
    ├── Button.tsx
    └── Button.scss
```

HueSys internal UI should live outside the generated component library.

A possible conceptual separation is:

```text
src/
├── components/       generated/exportable components
├── ui/               HueSys internal UI primitives
├── layout/           HueSys application layout
├── theme/            generated Theme architecture
├── state/            application/design state
└── styles/           global/internal styling infrastructure
```

This is illustrative rather than a mandatory folder migration.

Do not reorganize working code merely to match this diagram.

Introduce or move folders only when the architectural separation requires it.

---

# Application State

Application state must represent the design decisions necessary to reproduce the current HueSys system.

Conceptually:

```text
AppState
├── activeSection
│   └── colors | typography | style
│
├── color
│   ├── mode
│   │   └── palette | custom
│   │
│   ├── palette
│   │   ├── baseColor
│   │   ├── colors[5]
│   │   └── variation
│   │
│   └── custom
│       └── colors[5]
│
├── typography
│   ├── font
│   ├── size
│   └── weight
│
└── style
    ├── radius
    └── spacing
```

This is a conceptual model.

Choose the simplest TypeScript representation that preserves the required behavior.

Avoid storing values that can be safely derived.

---

# Derived State

The following should generally be derived rather than independently stored:

- active Brand Palette
- Neutral Palette
- Semantic Colors
- Color Foundation
- Typography tokens
- Radius scale
- Spacing scale
- Theme
- CSS variable map

Conceptually:

```text
AppState
   │
   ├──→ Active Brand Palette
   │
   ├──→ Color Foundation
   │
   ├──→ Typography Tokens
   │
   └──→ Style Tokens
              │
              ▼
             Theme
              │
              ▼
        CSS Variable Map
```

Prefer a clear derivation pipeline over synchronizing duplicated representations of the same state.

---

# URL State

The URL is the canonical persistence/share representation of the current design.

It should contain enough information to reconstruct:

- active section
- Palette/Custom mode
- exact five active Brand Palette colors
- Base Color when applicable
- Font
- Font Size
- Font Weight
- Border Radius
- Spacing

The exact query-string format may be chosen during implementation.

Do not serialize every derived token.

Values such as:

- Neutral Palette
- Semantic Colors
- Theme
- CSS variable map

should be regenerated from stored design state.

---

# Browser History

Browser history and design history serve different purposes.

Browser history handles application navigation.

For example:

```text
/colors
/typography
/style
```

Navigating between sections may create browser-history entries.

Design changes should generally update the current URL using `replaceState` rather than creating a browser-history entry for every adjustment.

Browser Back/Forward therefore remains useful for navigating HueSys sections.

---

# Design History

HueSys Undo/Redo maintains a separate design-state history.

History contains meaningful changes to:

```text
Colors
Typography
Style
```

It does not include:

- section navigation
- scrolling
- copying colors
- preview interactions
- Export interactions

Undo/Redo should restore complete design states.

Do not couple HueSys Undo/Redo to browser Back/Forward.

---

# Live Preview Architecture

Live Preview uses the real generated component library.

There is no separate preview implementation of generated components.

Conceptually:

```text
Generated Theme
      │
      ▼
CSS Variables
      │
      ▼
Generated Components
      │
      ▼
Live Preview
```

Live Preview may provide specimen-specific layout and example content around those components.

That specimen layout belongs to HueSys.

The generated components themselves remain the same components intended for export.

---

# Preview Styling Boundary

The outer preview interface belongs to HueSys.

The generated specimen belongs to the generated design system.

Conceptually:

```text
HueSys Live Preview Container
└── Generated Preview Canvas
    ├── Generated typography examples
    ├── Generated Button
    ├── Generated Input
    ├── Generated Select
    ├── Generated Alert
    └── ...
```

The preview canvas uses a stable white evaluation background.

Do not apply the generated background token to the entire HueSys preview environment merely to demonstrate it.

Generated neutral values should be visible through the generated components themselves.

---

# Responsive Architecture

HueSys uses three conceptual responsive states.

## Wide

```text
Sidebar | Options | Live Preview
```

The application behaves as a viewport-height workspace.

Options and Live Preview may scroll independently.

## Medium

```text
Top Navigation

Options | Live Preview
```

The sidebar is removed.

Colors, Typography, and Style become text-based top navigation.

Options and Preview remain side-by-side while space permits.

## Small

```text
Top Navigation

Options

Live Preview
```

The application returns to normal document scrolling.

Avoid unnecessary nested scrolling on mobile.

Breakpoints should be driven by when the layout stops working rather than arbitrary device categories.

---

# Export Architecture

The Export Engine consumes the final generated design system.

Conceptually:

```text
AppState
   │
   ▼
Theme + Generated Components
   │
   ▼
Export Engine
   │
   ├── Starter Project
   └── Component Package
```

Export does not need to know whether the active Brand Palette originated from:

- Randomize
- Base Color generation
- Custom mode

It consumes the resulting generated system.

HueSys internal UI components and HueSys UI tokens are never exported.

The Export Engine remains a separate implementation phase.

---

# Default State

When no valid state exists in the URL, HueSys initializes a complete default design system.

Defaults:

```text
Section: Colors
Color Mode: Palette
Base Color: curated populated default
Font: Inter
Font Size: Medium
Font Weight: Medium
Border Radius: Subtle
Spacing: Medium
```

A complete Brand Palette, Neutral Palette, Theme, and Live Preview should be available immediately.

The user should never need to perform an initial generation step simply to understand the product.

---

# Architecture Invariants

The following rules should remain true as HueSys evolves:

1. Colors, Typography, and Style remain independent user decisions.
2. Style never generates or modifies color.
3. Typography never generates or modifies color.
4. Palette generation never changes Typography or Style.
5. The Base Color remains exact when used as a palette anchor.
6. Custom mode directly controls the five Brand Palette colors.
7. Neutrals and semantic colors remain derived.
8. Generated components consume CSS variables rather than Theme props.
9. There is one implementation of each generated/exportable component.
10. HueSys internal UI is separate from generated/exportable UI.
11. HueSys UI never consumes generated Theme variables.
12. The Theme remains derived from explicit design state.
13. Browser navigation history remains separate from design Undo/Redo.
14. Export consumes the generated system, not HueSys application UI.
15. Do not expose new configuration simply because the underlying Theme supports it.

---

# Architecture Evolution

HueSys previously used a Recipe/curated-Style architecture that combined several visual characteristics into presets.

That model is superseded by the current architecture.

Do not preserve two competing Theme-generation systems.

Useful implementation pieces from the previous architecture may be retained where they still have a clear purpose.

For example:

- color-space utilities
- palette-generation utilities
- contrast utilities
- Theme types
- CSS-variable generation
- generated components

Obsolete concepts should be removed or refactored when they conflict with the current model.

Examples include:

- Recipe indexes
- curated Recipe navigation
- Recipe-controlled color behavior
- Recipe-controlled shadow variation
- Recipe-controlled border variation
- hidden Style characteristics not represented in the current UI

The current architecture is:

```text
Colors
+
Typography
+
Style
↓
Theme
↓
CSS Variables
↓
Generated Components
```

This is the architectural source of truth.