# HueSys Dashboard — Design & Behavior Specification

## Status

MVP Dashboard Specification

This document defines the intended product behavior, application structure, interaction model, and responsive behavior for the redesigned HueSys dashboard.

The Figma designs in `/design` are the visual source of truth for the dashboard.

This document is the behavioral and architectural source of truth for interactions and behavior that cannot be communicated through static designs alone.

If implementation details conflict with this specification, prefer this specification unless there is a clear technical reason not to.

---

# 1. Product Model

HueSys is a web application for generating a production-ready React design system.

The core user model is:

```text
Colors
+
Typography
+
Style
↓
Generated Design System
↓
Live Preview
↓
Export
```

These three design categories should remain conceptually independent.

Changing Typography should not alter Colors.

Changing Style should not alter Colors or Typography.

Generating or editing Colors should not alter Typography or Style.

The final Theme is the combination of these independent design decisions.

Conceptually:

```text
Palette
+
Typography
+
Style
=
Theme
```

The Theme then produces the CSS variables consumed by the generated component library.

---

# 2. Application Architecture

The dashboard consists of two fundamentally different visual systems:

1. HueSys application UI
2. Generated design-system UI

These must remain architecturally and visually separate.

---

## 2.1 HueSys Application UI

The HueSys application includes:

- Sidebar/navigation
- Header
- Colors options
- Typography options
- Style options
- Palette/Custom control
- Base Color control
- Refresh control
- Randomize control
- Undo
- Redo
- Export
- Tooltips
- Copy feedback
- Application containers
- Application scrollbars
- Any future HueSys dialogs or menus

These elements use fixed HueSys branding.

They must not consume generated Theme styling.

Changing:

- Colors
- Font
- Font Size
- Font Weight
- Border Radius
- Spacing

must never visually restyle the HueSys application itself.

---

## 2.2 Generated Design-System UI

The generated component library currently contains:

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

These components consume the generated Theme.

They are displayed inside Live Preview and will eventually be included in exports.

The generated component system responds to:

```text
Colors
+
Typography
+
Style
```

---

## 2.3 Component Separation

It is acceptable for HueSys to have internal UI primitives that overlap conceptually with generated components.

For example:

```text
HueSys Button
Generated Button

HueSys Input
Generated Input

HueSys Select
Generated Select
```

These are not considered duplicate implementations because they belong to different systems.

The important architectural rule is:

> There must be only one implementation of each generated/exportable component.

HueSys internal UI components are separate and are never exported.

The previous architectural rule that effectively implied "there is only one Button" should be updated accordingly.

---

## 2.4 HueSys Internal Tokens

HueSys should use a small fixed internal token system derived from the Figma design.

This may include:

- colors
- typography
- spacing
- radius
- shadows where needed

Do not create another Theme Engine for HueSys itself.

Simple fixed CSS custom properties or SCSS variables are sufficient.

HueSys internal tokens:

- are not generated
- do not respond to user design choices
- are not part of the generated Theme
- are never exported

---

# 3. Primary Navigation

The primary design categories are:

```text
THEME

Colors
Typography
Style
```

These are views into the same generated design system.

They are not separate projects or separate design states.

---

## 3.1 Navigation Behavior

Selecting Colors, Typography, or Style changes only the Options Panel.

The Live Preview:

- remains mounted
- remains visible
- preserves its current state
- preserves its scroll position

Example:

```text
Colors
↓
User scrolls Live Preview to Alerts
↓
User selects Typography
↓
Typography options appear
↓
Live Preview remains positioned at Alerts
```

Navigation does not count as a design-state change.

Therefore, navigation does not enter HueSys Undo/Redo history.

---

## 3.2 Navigation and URL

The active section should be represented in the URL.

Conceptually:

```text
/colors
/typography
/style
```

Exact routing implementation may follow the existing application architecture.

Browser Back/Forward controls application navigation.

HueSys Undo/Redo controls design-state history.

These are separate systems.

---

# 4. Desktop Workspace Layout

At large desktop sizes, HueSys should behave like a design application rather than a conventional scrolling webpage.

The application occupies the available viewport.

Conceptually:

```text
┌──────────────────────────────────────────────────────────────┐
│ Header / Toolbar                                             │
│                                                              │
│ ┌─────────┐ ┌──────────────┐ ┌────────────────────────────┐ │
│ │ Sidebar │ │ Options      │ │ Live Preview               │ │
│ │         │ │              │ │                            │ │
│ │         │ │              │ │        ↕ scroll            │ │
│ │         │ │              │ │                            │ │
│ └─────────┘ └──────────────┘ └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 4.1 Desktop Scrolling

At large desktop sizes:

- Header remains stationary.
- Sidebar remains stationary.
- Options Panel remains stationary.
- Live Preview scrolls independently.
- Options Panel may scroll internally if its content exceeds available height.
- The document/body should not normally scroll.

This allows the user to modify settings while remaining at the same location within the component preview.

---

# 5. Colors

Colors has two modes:

```text
Palette
Custom
```

These represent two different levels of user control.

---

# 6. Palette Mode

Palette mode is for users who want HueSys to generate colors.

There are three primary workflows:

1. Randomize everything.
2. Generate alternatives around a Base Color.
3. Enter an existing brand color and generate around it.

---

## 6.1 Base Color

Palette mode contains a Base Color control.

The Base Color consists of:

- circular color swatch
- hex input
- Refresh action

The Base Color is the anchor for palette generation.

When a Base Color exists, it must appear exactly as entered in the generated Brand Palette.

Do not approximate or replace it.

The Base Color should always be the first color in the five-color Brand Palette.

The matching circular swatch beside the Base Color input reinforces this relationship.

A subtle additional marker on the first Brand Palette swatch may be used if it improves clarity and looks visually appropriate, but it is not required.

Do not add visual clutter solely to label the Base Color.

---

## 6.2 Entering a Base Color

The Base Color input accepts a valid six-digit hex color.

Do not generate intermediate palettes for incomplete values such as:

```text
#6
#6E
#6E5C
```

Once the input becomes a valid color, HueSys generates an initial palette around it.

The entered Base Color remains unchanged.

---

## 6.3 Refresh

The Refresh control appears directly beside the Base Color input.

Refresh means:

> Generate another palette using this same Base Color.

Example:

```text
Base: #6E5CF4

Palette A
↓
Refresh
↓
Palette B
↓
Refresh
↓
Palette C
```

Every generated palette must contain the exact same Base Color.

Refresh is intentionally different from Randomize.

---

## 6.4 Randomize

The primary action in Palette mode is:

**Randomize**

Randomize means:

> Give me an entirely new color direction.

Randomize:

1. generates a new Base Color
2. generates a new five-color Brand Palette around that Base Color

Conceptually:

```text
Current:

Base: #6E5CF4
Purple-oriented palette

↓ Randomize

Base: #18A875
Green-oriented palette
```

Randomize therefore changes both the Base Color and Brand Palette.

---

## 6.5 Palette Generation Quality

Generated palettes should be harmonious and intentional.

Do not generate five unrelated random hex values.

Reuse and evolve the existing color-science infrastructure, including:

- OKLCH conversion
- harmony logic
- contrast utilities
- palette generation
- neutral generation

Palette generation should produce multiple valid design directions around the same Base Color when Refresh is used.

---

# 7. Custom Mode

Custom mode is for users who want direct control over all five Brand Palette colors.

Conceptually:

> Palette = HueSys chooses the colors.

> Custom = The user chooses the colors.

---

## 7.1 Entering Custom Mode

There is one current Brand Palette. Switching from Palette to Custom simply reveals editable controls for that same palette — it does not generate, copy, or seed a separate dataset.

The Live Preview therefore never visually changes merely because the user entered Custom mode.

The user can then edit individual colors.

This supports the workflow:

```text
HueSys generates something close
↓
User switches to Custom
↓
User adjusts one or more colors
```

---

## 7.2 Custom Controls

In Custom mode:

- all five Brand Palette colors are editable
- each color supports a color picker
- each color supports valid hex entry
- valid changes update the Live Preview immediately

Custom mode does not display:

- Base Color
- Refresh
- Randomize

Those concepts belong to generated Palette mode and do not apply when the user controls all five colors.

---

## 7.3 One Current Brand Palette

Palette and Custom are two ways of operating on the same current Brand Palette, not two independently persisted ones. `mode` selects which controls are visible; it never changes the colors.

Example:

```text
Palette generates:
A B C D E

↓ switch to Custom

Custom shows:
A B C D E

↓ edit color 3

Current palette is now:
A B X D E

↓ switch to Palette

Palette shows:
A B X D E

↓ switch back to Custom

Custom shows:
A B X D E
```

The edit in the example above is never lost or reverted by switching modes — there is no hidden second palette for either mode to fall back to. Only an actual generation action (Base Color entry, Refresh, Randomize) or a Custom edit changes the current palette; switching modes alone never does.

---

# 8. Brand Palette Presentation

The Brand Palette contains five prominent adjacent swatches.

In Palette mode these are generated output.

The swatches should support:

- hover to reveal hex
- keyboard focus to reveal hex
- click to copy
- keyboard activation
- temporary "Copied!" feedback
- visible focus styling

Do not permanently display five large hex labels if doing so makes the interface cramped.

The Figma layout should remain the visual reference.

---

## 8.1 Brand Palette in Custom Mode

The Brand Palette should retain roughly the same visual location and footprint when switching between Palette and Custom.

In Custom mode the five colors become editable.

Avoid a large layout shift between the two modes.

The exact editing presentation should follow the Figma direction and preserve usability.

---

# 9. Neutral Palette

HueSys generates a neutral scale in both Palette and Custom modes.

The Neutral Palette is:

- generated by HueSys
- read-only
- derived from the active Brand Palette
- independent of Style

Display the actual generated neutral scale rather than exposing every semantic token.

Conceptually:

```text
NEUTRAL PALETTE

■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■
```

Neutral swatches should support:

- hover/focus to reveal hex
- click to copy
- keyboard activation
- copied feedback

The neutral system remains generated even when the user manually controls the five Brand Palette colors.

---

# 10. Semantic Colors

HueSys should continue deriving semantic colors such as:

- success
- warning
- danger
- informational/accent roles

Semantic colors should remain recognizable for their intended purpose while harmonizing with the generated/custom palette where appropriate.

Do not revert to unrelated fixed generic green/orange/red values.

Semantic colors are derived output.

Users do not manually configure them in the MVP.

---

# 11. Typography

Typography contains three controls:

```text
Font
Font Size
Font Weight
```

Typography affects only the generated design system.

It must never restyle HueSys application UI.

---

## 11.1 Font

HueSys should provide a curated collection of at least 10 versatile fonts.

The collection should provide meaningful visual variety without turning HueSys into a font-browsing application.

Aim for a useful mix such as:

- modern sans-serif
- geometric sans-serif
- humanist sans-serif
- serif
- display-oriented but UI-usable fonts
- monospace

Prefer quality and versatility over quantity.

The exported system should make the font definition/token straightforward for a developer to replace with their own font later.

---

## 11.2 Font Size

Font Size options:

```text
Small
Medium
Large
```

Font Size controls the generated typography scale.

It does not apply one literal font size to every element.

Changing the scale should proportionally affect appropriate typography roles such as:

- body text
- labels
- small text
- component text
- headings

Exact token values may be tuned during implementation.

The important behavior is proportional system-level scaling.

---

## 11.3 Font Weight

Font Weight options:

```text
Regular
Medium
Semibold
```

This represents the overall weight personality/hierarchy of the generated system.

It must not simply apply one global font weight to every element.

For example, a Semibold system may use stronger:

- labels
- buttons
- headings

while still maintaining appropriate body-text weight.

Font definitions should account for supported font weights and resolve sensibly if a selected font does not contain an exact requested weight.

---

## 11.4 Typography Independence

Changing:

- Font
- Font Size
- Font Weight

must not:

- regenerate colors
- alter Style
- modify HueSys UI

---

# 12. Style

Style contains only two controls for the MVP:

```text
Border Radius
Spacing
```

Do not expand this section without a concrete product requirement.

HueSys is a generator, not a full token editor.

---

## 12.1 Border Radius

Border Radius options:

```text
Sharp
Subtle
Soft
Rounded
```

Each option defines a radius scale.

Conceptually:

```text
Sharp
sm / md / lg → very little or no radius

Subtle
sm / md / lg → restrained radius

Soft
sm / md / lg → clearly rounded

Rounded
sm / md / lg → generous radius
```

Do not apply one identical radius to every component.

Components should consume the appropriate radius token.

Semantic exceptions remain valid.

For example:

- Radio remains circular.
- Controls whose shape communicates meaning should preserve that meaning.

---

## 12.2 Spacing

Spacing options:

```text
Compact
Medium
Spacious
```

Spacing changes the generated spacing scale and component density.

It may affect:

- button padding/height
- field padding/height
- card padding
- alert padding
- internal component gaps

Spacing should not arbitrarily increase the overall HueSys application layout or add excessive margins between preview sections.

It is primarily a generated component-density control.

---

## 12.3 Fixed Style Decisions

Properties previously controlled by the old Recipe system but no longer exposed should use carefully chosen fixed defaults.

Examples include:

- shadows
- border strength
- surface treatment
- transitions

Do not keep hidden Recipe behavior that unexpectedly changes these properties.

If a property is not exposed as a Style control, HueSys should make a sensible consistent decision for the MVP.

---

## 12.4 Style Independence

Changing Border Radius or Spacing must not:

- alter Brand Palette
- alter Neutral Palette
- alter Typography
- restyle HueSys UI

---

# 13. Remove the Old Recipe Model

The previous Recipe model mixed:

- color generation
- neutral changes
- radius
- shadows
- borders
- other visual characteristics

That model is no longer the intended product architecture.

The current product model is:

```text
Colors
+
Typography
+
Style
=
Theme
```

Remove or refactor obsolete Recipe concepts where they conflict with this model.

Do not keep two competing systems alive.

Useful structural code may be reused where appropriate, but user-facing Recipe behavior should not remain.

---

# 14. Undo / Redo

Undo and Redo operate on design-state history.

They do not operate on general HueSys application interactions.

---

## 14.1 Changes Included in History

History includes meaningful design changes such as:

- Randomize
- Refresh
- valid Base Color change and resulting palette
- switching Palette/Custom when it changes active generated colors
- Custom color edits
- Font changes
- Font Size changes
- Font Weight changes
- Border Radius changes
- Spacing changes

---

## 14.2 Changes Excluded from History

Do not add history entries for:

- Colors/Typography/Style navigation
- scrolling
- copying a color
- preview component interaction
- opening Export
- other non-design application interactions

---

## 14.3 State Snapshots

Undo/Redo should conceptually restore complete design states rather than trying to reverse isolated implementation operations.

Example:

```text
State A
↓
Generate Palette
↓
State B
↓
Change Font
↓
State C
↓
Change Radius
↓
State D
```

Undo from D restores C exactly.

Undo again restores B exactly.

Redo restores C.

---

## 14.4 Redo Branching

Use standard history behavior.

Example:

```text
A → B → C → D
          ↑
        Undo
```

After undoing to B and making a new change E:

```text
A → B → E
```

The old C/D redo branch is discarded.

---

## 14.5 Undo / Redo UI

When Undo is unavailable, Undo is disabled.

When Redo is unavailable, Redo is disabled.

Controls should have:

- accessible names
- visible focus states
- appropriate disabled states
- tooltips where useful

---

# 15. Live Preview

Live Preview is a curated, interactive specimen of the generated design system.

It is not exhaustive component documentation.

Its purpose is:

> Show what a UI built with this generated system actually feels like.

---

## 15.1 Component Coverage

Preserve all 10 MVP generated components:

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

Show representative variants and states rather than every possible permutation.

---

## 15.2 Preview Grouping

Use the Figma design as the primary layout reference.

Conceptually, groups include:

```text
Buttons

Inputs
Selection Controls

Alerts
Badges

Cards
```

Exact responsive positioning may adapt based on available width.

---

## 15.3 Generated Boundary

The outer Live Preview heading/container belongs to HueSys.

The actual specimen content inside the preview canvas belongs to the generated design system.

Conceptually:

```text
HueSys UI

Live Preview
┌─────────────────────────────┐
│ GENERATED UI                │
│                             │
│ Buttons                     │
│ [Primary] [Secondary]       │
│                             │
│ Inputs                      │
│ ...                         │
└─────────────────────────────┘
```

Section labels inside the specimen may use generated typography/colors because they are part of the generated presentation.

---

## 15.4 White Evaluation Canvas

The Live Preview canvas should use a clean white evaluation background.

Do not tint the entire preview using generated neutral colors.

Generated neutrals should instead appear naturally through:

- fields
- borders
- cards
- muted text
- disabled states
- secondary surfaces
- other component treatments

The stable white canvas makes subtle component decisions easier to evaluate.

---

## 15.5 Live Updates

There is no Apply button.

Changes to:

- Colors
- Typography
- Style

should update the generated system immediately.

Palette generation itself remains intentional through:

- valid Base Color entry
- Refresh
- Randomize
- Custom edits

---

## 15.6 Preserve Scroll Position

Design changes must not reset Live Preview scroll position.

Navigation between Colors/Typography/Style must also preserve preview scroll position.

This allows users to inspect a particular component while experimenting with its design.

---

## 15.7 Palette Usage

The generated five-color Brand Palette should be demonstrated logically throughout the component system.

Do not generate a five-color palette and then use only the Base Color everywhere.

Use the palette with restraint.

Examples may include:

- primary emphasis
- secondary/accent emphasis
- informational states
- badges
- semantic treatments
- supporting component roles

Avoid turning the component system into arbitrary rainbow UI.

Neutrals should support:

- borders
- inputs
- muted text
- disabled states
- cards
- structural surfaces

---

## 15.8 Preview Interactivity

Generated components remain real interactive components.

Users should be able to:

- type into Input
- type into Textarea
- open Select
- toggle Checkbox
- select Radio
- toggle Switch
- interact with enabled Buttons

These interactions are preview-only.

They do not enter HueSys Undo/Redo history.

---

## 15.9 Preview Overflow

Do not compress the component system solely to fit all content into the visible viewport.

If necessary, allow the Live Preview to scroll.

Do not unnecessarily:

- shrink typography
- reduce component size
- remove components
- reduce spacing
- cram groups together

to avoid overflow.

The independent desktop preview scrollbar exists specifically to support a complete specimen.

---

# 16. Responsive Behavior

Responsiveness should preserve the HueSys mental model while adapting the application structure appropriately.

Use content-driven breakpoints.

Do not select arbitrary breakpoints solely because they are common device widths.

---

## 16.1 Wide Layout

At wide desktop sizes:

```text
Sidebar | Options | Live Preview
```

Use the fixed workspace behavior described earlier.

The Live Preview receives the majority of available width.

---

## 16.2 Medium Layout

At medium widths, remove the wide Sidebar.

Replace it with text-based top navigation:

```text
Colors | Typography | Style
─────────────────────────────
Options | Live Preview
```

Options and Live Preview remain side-by-side while there is genuinely enough room for both.

Do not introduce an icon-only navigation rail.

There are only three navigation destinations, and their text labels are clearer than abstract icons.

---

## 16.3 Small / Mobile Layout

At small widths:

```text
Header

Colors | Typography | Style

Options

Live Preview
```

Return to normal document scrolling.

Do not use nested scrolling regions on mobile unless absolutely necessary.

The mobile experience should feel like a natural vertical application page rather than a miniature desktop workspace.

---

## 16.4 Responsive Preview

Preview groups should rearrange before components themselves are unnecessarily compressed.

Example:

Wide:

```text
Inputs                Selection Controls

Alerts                Badges
```

Narrow:

```text
Inputs

Selection Controls

Alerts

Badges
```

Prefer reflowing and stacking over shrinking controls below comfortable dimensions.

---

## 16.5 Responsive Options

Options controls may also reflow.

For example:

Wide:

```text
[swatch] [ #6E5CF4                 ] [↻]
```

Narrow:

```text
[swatch] [ #6E5CF4          ] [↻]

[           Randomize           ]
```

Do not preserve desktop rows at the expense of usable controls.

---

## 16.6 Mobile Toolbar

Undo, Redo, and Export remain available on smaller screens.

They may use more compact presentation where necessary.

Do not remove the functionality solely because the viewport is narrow.

---

# 17. Default State

When there is no valid state to restore, HueSys should open with a complete, useful generated design system.

Do not present an empty application.

Default section:

```text
Colors
```

Default color mode:

```text
Palette
```

A curated default Base Color should already be populated.

A complete Brand Palette and Neutral Palette should already be generated.

Live Preview should be fully rendered immediately.

---

## 17.1 Default Typography

Default:

```text
Font: Inter
Font Size: Medium
Font Weight: Medium
```

These provide a neutral baseline for experimentation.

---

## 17.2 Default Style

Default:

```text
Border Radius: Subtle
Spacing: Medium
```

Again, prefer a neutral baseline rather than a strongly opinionated initial system.

---

## 17.3 Initial History

The initial configuration is State 0.

On initial load:

```text
Undo: disabled
Redo: disabled
```

After the first design change, Undo becomes available.

Undo may restore the initial default state.

---

# 18. URL State and Persistence

The URL is the canonical persistence/share mechanism for the current HueSys design.

HueSys does not require an account or persistent server-side storage for the MVP.

---

## 18.1 Serialized State

The URL should contain enough information to recreate the exact current design.

Persist:

- active section
- Palette/Custom mode
- exact five active Brand Palette colors
- optional Base Color when applicable
- Font
- Font Size
- Font Weight
- Border Radius
- Spacing

---

## 18.2 Derived State

Do not serialize every generated token.

The following should remain deterministic derived state:

- Neutral Palette
- semantic colors
- typography tokens derived from size/weight selections
- radius scale
- spacing scale
- final Theme
- CSS variables

Conceptually:

```text
URL state
↓
Brand Palette + configuration
↓
Derived design-system tokens
↓
Theme
↓
Live Preview
```

---

## 18.3 Refresh / Bookmark / Share

Refreshing the page should restore the exact visible design.

A bookmarked/shared URL should restore:

- active section
- active color mode
- exact Brand Palette
- Base Color if applicable
- Typography
- Style

The resulting Live Preview should visually match the saved/shared state.

---

## 18.4 URL History Behavior

Design-state changes should generally update the current URL using `replaceState`.

Do not create a browser-history entry for every:

- palette refresh
- color edit
- typography change
- style change

Section navigation should create normal browser-history entries.

Conceptually:

```text
/colors
↓
/typography
↓
/style
```

Browser Back/Forward therefore navigates between application sections.

HueSys Undo/Redo separately restores design changes.

---

## 18.5 Invalid URL State

URL parsing must be defensive.

If URL state is:

- incomplete
- malformed
- out of range
- invalid

HueSys should:

1. preserve valid values where practical
2. replace invalid values with safe defaults
3. never crash
4. never render an impossible state

---

# 19. Export

The redesigned dashboard includes one Export action in the Header.

Export is a HueSys application action.

It is not part of the generated design system.

---

## 19.1 Current Redesign Scope

Do not build the Export Engine as part of this dashboard redesign.

Until Phase 5, Export should have a clear disabled or intentionally non-functional state.

Do not create fake export behavior merely to make the button clickable.

---

## 19.2 Future Export Behavior

Phase 5 will eventually use the single Export action to expose the planned outputs:

- Starter Project
- Components Only

The exact export UI will be designed later.

Do not add multiple permanent Export buttons to the Header.

---

## 19.3 Export Input

Export will eventually consume the final generated system:

```text
Colors
+
Typography
+
Style
+
Generated Components
```

It does not matter whether the Brand Palette originated from:

- Randomize
- Base Color generation
- Custom editing

Export consumes the resulting design system.

---

## 19.4 Export and History

Export interactions do not modify design state.

They must not enter Undo/Redo history.

---

# 20. Accessibility

Accessibility remains a core HueSys requirement.

Preserve the accessibility principles established in the existing component library.

HueSys UI and generated UI should both support:

- semantic HTML
- keyboard interaction
- visible focus states
- appropriate labels
- native controls where practical
- disabled states
- sufficient contrast

Color swatches must remain keyboard accessible.

Icon-only actions such as Refresh, Undo, and Redo require accessible names.

Do not rely exclusively on hover to expose essential functionality.

---

# 21. Figma Relationship

The dashboard Figma designs in `/design` are the visual source of truth.

They define:

- visual hierarchy
- proportions
- spacing direction
- typography direction
- HueSys branding
- sidebar appearance
- control appearance
- preview composition
- general component positioning

This specification defines behavior the screenshots cannot communicate.

When implementing:

> Figma controls appearance.

> This specification controls behavior.

Do not infer new product functionality solely from a static screenshot when this document defines the intended behavior.

---

# 22. Scope Discipline

This redesign should not expand into unrelated feature development.

Do not add:

- dark mode
- accounts
- cloud saving
- full design-token editing
- arbitrary typography-scale editors
- arbitrary shadow editors
- arbitrary border editors
- animation editors
- additional Style controls without a requirement
- Export Engine implementation
- new component categories
- unnecessary dependencies

The goal is to produce a clear, polished MVP around:

```text
Colors
Typography
Style
Live Preview
Export
```

HueSys should make sensible design-system decisions rather than exposing every possible token.

---

# 23. Engineering Principles

Preserve the existing HueSys engineering philosophy.

Prefer:

- simplicity over flexibility
- readability over cleverness
- deterministic behavior where appropriate
- accessibility by default
- responsive behavior by default
- minimal dependencies
- clear architectural boundaries
- one generated/exportable implementation per component
- derived state instead of duplicated state where possible

Do not rewrite working color-science or component code without a concrete reason.

Reuse existing:

- OKLCH utilities
- palette-generation logic
- neutral-generation logic
- contrast utilities
- generated component library
- Theme/CSS-variable pipeline

Refactor where the existing Recipe-era architecture conflicts with this specification.

---

# 24. Core Mental Model

A first-time user should be able to understand HueSys without learning HueSys-specific terminology.

The experience should communicate:

```text
1. Choose or generate your colors.

2. Choose your typography.

3. Choose your style.

4. See the complete design system update live.

5. Export it.
```

Palette generation has three clear levels of user control:

```text
Randomize
"I don't know what I want."

Refresh
"I like this Base Color. Show me another direction."

Custom
"I know exactly what colors I want."
```

HueSys should remain simple enough that these concepts are understandable through the interface itself.

---

# 25. Implementation Sequence

Do not attempt to implement the entire redesign as one large change.

Use this specification as the source of truth while implementing the redesign in controlled phases.

Recommended sequence:

```text
A. Product and state architecture refactor

B. HueSys application shell and layout

C. Colors UI and Palette/Custom workflows

D. Typography and Style UI

E. Live Preview redesign and generated-component presentation

F. Responsive behavior, accessibility verification, and polish
```

Each stage should preserve a working application before moving to the next.

The Export Engine remains a separate future phase after the redesigned dashboard and generated Theme model are stable.