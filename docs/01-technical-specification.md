# HueSys Technical Specification v1.1

## Vision

HueSys is a web application that generates production-ready React design systems through a small set of intentional design decisions.

Rather than asking developers to manually configure dozens of design tokens, HueSys organizes design-system generation around three independent areas:

```text
Colors
+
Typography
+
Style
↓
Generated Design System
```

Users can generate a cohesive color palette, optionally anchor that palette to an existing brand color, or directly provide their own five-color palette.

Typography and Style are configured independently from Colors.

The resulting design system is previewed in real time through a production-ready React component library and can ultimately be exported as clean source code that developers completely own.

HueSys is not a website builder, visual editor, or AI code generator.

It is a focused design-system generator intended to provide developers with a polished frontend foundation without requiring them to configure every individual design token manually.

---

# Product Principles

HueSys should always prioritize:

- Simplicity over flexibility
- Quality over quantity
- Readability over cleverness
- Composition over configuration
- Accessibility by default
- Responsive design by default
- Deterministic derived behavior where appropriate
- Ownership over lock-in

Whenever implementation decisions are unclear, these principles should guide the solution.

HueSys should make sensible design-system decisions for the user rather than exposing every possible token as a control.

---

# Core Product Model

HueSys organizes design-system generation into three independent categories:

```text
Colors
Typography
Style
```

These combine to produce the final Theme.

Conceptually:

```text
Colors
+
Typography
+
Style
=
Theme
```

Each category should remain independent.

Changing Typography must not regenerate Colors.

Changing Style must not regenerate Colors or alter Typography.

Generating or editing Colors must not change Typography or Style.

The Theme is then converted into CSS variables consumed by the generated component library.

---

# Colors

HueSys provides two color workflows:

```text
Palette
Custom
```

## Palette

Palette mode allows HueSys to generate a cohesive five-color Brand Palette.

Users may:

- Randomize an entirely new Base Color and palette
- Enter an existing Base Color
- Generate another palette while preserving the same Base Color

When a Base Color is supplied, it must remain unchanged and appear as the first color in the generated Brand Palette.

HueSys also derives:

- A Neutral Palette
- Semantic colors
- Supporting color tokens

from the active Brand Palette.

## Custom

Custom mode allows users to directly control all five Brand Palette colors.

HueSys continues deriving the Neutral Palette, semantic colors, and supporting tokens from the custom palette.

Custom mode is not intended to expose every individual color token.

The user controls the core Brand Palette while HueSys continues performing the design-system work around it.

---

# Typography

Typography is controlled independently from Colors and Style.

HueSys provides:

- Font
- Font Size
- Font Weight

The MVP should include a curated collection of at least 10 versatile fonts.

Font Size should adjust a proportional typography scale rather than assigning one font size globally.

Font Weight should adjust the overall typography hierarchy rather than assigning one font weight globally.

Typography should remain straightforward to replace after export so developers can substitute their own fonts and typography tokens when needed.

---

# Style

Style controls structural characteristics of the generated component system.

The MVP exposes only:

## Border Radius

Options:

- Sharp
- Subtle
- Soft
- Rounded

Each option defines an appropriate radius scale rather than applying one identical radius to every component.

## Spacing

Options:

- Compact
- Medium
- Spacious

Spacing adjusts the generated component density and spacing scale.

HueSys should use sensible fixed defaults for structural properties that are not explicitly exposed as controls, including properties such as:

- shadows
- border strength
- transitions
- surface treatment

Do not expose additional Style controls without a concrete product requirement.

---

# Generated Theme

The final Theme is the single source of truth for the generated design system.

Conceptually:

```text
Theme
├── Colors
├── Typography
├── Radius
├── Spacing
├── Shadows
├── Borders
├── Transitions
└── Metadata
```

The exact internal structure may evolve as implementation requirements become clearer, but the product model must remain:

```text
Colors + Typography + Style → Theme
```

The Theme is converted into fixed semantic CSS custom properties consumed by the generated components.

Token names remain stable.

Values change based on the generated design system.

---

# HueSys UI vs. Generated UI

HueSys contains two separate visual systems:

1. The HueSys application interface
2. The generated design system

The HueSys application interface uses its own fixed branding and internal design tokens.

It must never consume generated Theme styling.

Changing Colors, Typography, or Style must not visually alter:

- Navigation
- Header
- Options controls
- Undo / Redo
- Export
- HueSys buttons
- HueSys inputs
- HueSys selects
- Other application controls

Only the generated design system shown inside Live Preview should respond to the generated Theme.

HueSys may therefore contain internal application UI primitives that are separate from the generated/exportable component library.

These internal components are never exported.

---

# Live Preview

HueSys provides a live interactive preview of the generated design system.

The Live Preview should:

- Use the actual generated component library
- Update immediately when design settings change
- Demonstrate the Brand Palette logically
- Demonstrate generated neutrals and semantic colors
- Reflect Typography changes
- Reflect Style changes
- Remain interactive
- Preserve its scroll position while settings change
- Be responsive

The preview is a curated design-system specimen, not exhaustive component documentation.

---

# Accessibility

Accessibility is a first-class product requirement.

Every generated component should:

- Use semantic HTML whenever possible
- Support keyboard interaction where appropriate
- Include visible focus states
- Strive to meet WCAG AA color contrast standards
- Be responsive by default

HueSys application controls should follow the same accessibility principles.

Color-generation logic should account for foreground/background contrast where appropriate.

Accessibility should never be treated as an optional enhancement.

---

# Goals

HueSys should:

- Generate cohesive five-color Brand Palettes
- Generate palettes from an existing Base Color
- Generate entirely new color directions through Randomize
- Allow users to provide their own five-color Brand Palette
- Generate supporting neutral and semantic colors
- Provide curated Typography controls
- Provide simple structural Style controls
- Provide a live interactive component gallery
- Produce production-ready React + TypeScript + SCSS source code
- Export either a complete Vite starter project or reusable components
- Generate responsive and accessible components
- Produce clean code that developers completely own
- Maintain one generated component library shared between Live Preview and exported output
- Keep HueSys application styling separate from generated Theme styling
- Keep the overall user experience simple

---

# Non-Goals

HueSys v1 intentionally excludes:

- Tailwind CSS
- CSS-in-JS
- Runtime theming frameworks
- Proprietary component packages
- AI-generated React components
- Figma integration
- Dark mode
- Storybook
- Website generation
- Page builders
- Visual layout editors
- Drag-and-drop editing
- User-generated components
- External UI component libraries
- Full design-token editing
- Arbitrary shadow controls
- Arbitrary border controls
- Arbitrary typography-scale editors
- Excessive customization panels

HueSys is not intended to replace designers.

Its purpose is to generate a polished frontend foundation that developers can immediately build upon.

---

# MVP Component Library

The initial generated component library includes:

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

Components should be:

- Production ready
- Accessible
- Responsive
- Composable
- Minimal
- Portable
- Timeless

Generated components should expose minimal APIs and use semantic HTML whenever possible.

They should consume generated design tokens through CSS variables rather than receiving Theme objects through component props.

---

# Component Ownership

There must be one implementation of each generated/exportable component.

The same generated component implementation is used by:

```text
Live Preview
+
Starter Project Export
+
Component Package Export
```

Improving a generated component therefore improves both the HueSys preview and future exported code.

HueSys's own application controls are a separate internal UI layer and are not subject to this rule.

---

# State and Persistence

The current design state should be represented in the URL.

The URL should contain enough information to reconstruct the current design, including:

- Active dashboard section
- Palette or Custom mode
- Exact five active Brand Palette colors
- Base Color when applicable
- Font
- Font Size
- Font Weight
- Border Radius
- Spacing

Derived values such as neutral colors, semantic colors, and final Theme tokens should not need to be serialized when they can be deterministically reconstructed from the stored design state.

Refreshing or sharing a valid HueSys URL should reproduce the same visible design.

---

# Undo / Redo

HueSys provides design-state Undo and Redo.

History should include meaningful changes to:

- Colors
- Typography
- Style

Application interactions such as:

- Navigation
- Scrolling
- Copying colors
- Preview component interaction
- Export

should not enter design-state history.

Browser Back/Forward remains separate from HueSys Undo/Redo and is used for dashboard navigation.

---

# Export Options

HueSys supports two planned export modes.

## Starter Project

A complete Vite application including:

- React
- TypeScript
- SCSS
- Generated Theme
- Generated component library

## Component Package

Reusable generated components, tokens, and styles intended for integration into an existing React application.

Both export modes consume the final generated design system regardless of whether its Brand Palette originated from:

- Randomize
- Base Color generation
- Custom editing

The Export Engine is implemented separately from the dashboard generation experience.

---

# Responsive Application Behavior

HueSys should be responsive by default.

At wide viewport sizes, HueSys behaves like a fixed design-tool workspace with:

```text
Sidebar | Options | Live Preview
```

At medium widths:

```text
Top Navigation

Options | Live Preview
```

At small/mobile widths:

```text
Top Navigation

Options

Live Preview
```

Desktop Live Preview and Options regions may scroll independently when needed.

Mobile should prefer normal document scrolling and avoid unnecessary nested scroll regions.

Responsive layouts should reflow before controls are compressed below comfortable usable dimensions.

---

# Engineering Principles

When implementation choices are unclear:

- Prefer simplicity.
- Prefer composition.
- Prefer semantic HTML.
- Prefer native browser behavior.
- Prefer readable code.
- Prefer deterministic derived systems.
- Prefer fewer files.
- Prefer fewer dependencies.
- Avoid premature abstraction.
- Keep generated UI separate from HueSys application UI.
- Avoid duplicated sources of truth.
- Derive state where practical.
- Build only what solves today's problem.

Do not introduce complexity solely to support hypothetical future customization.

---

# MVP Success

HueSys succeeds when a developer can:

1. Open HueSys and immediately see a complete generated design system.
2. Generate a new color direction or begin with an existing brand color.
3. Explore multiple palettes around that Base Color.
4. Provide their own Brand Palette when needed.
5. Adjust Typography.
6. Adjust Border Radius and Spacing.
7. Preview those decisions across a production-ready component library.
8. Export clean React source code.
9. Use that source code as the foundation of a real application with minimal modification.

The intended experience should remain understandable as:

```text
Choose your colors.
Choose your typography.
Choose your style.
Preview the system.
Export it.
```