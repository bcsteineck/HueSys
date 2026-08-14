# HueSys Architecture v1.0

## Architecture Overview

HueSys is composed of five major systems.

```
User Input
      │
      ▼
 Theme Engine
      │
      ▼
 Theme Object
      │
      ▼
 CSS Variable Generator
      │
      ▼
 Component Library
      │
      ▼
 Export Engine
```

---

# Theme Engine

Inputs:

- Primary Color
- Theme Recipe
- Font

Outputs:

- Theme Object

The Theme Engine is deterministic.

The same primary color combined with the same recipe always produces the same Theme.

---

# Theme Recipes

Theme recipes are declarative data.

They describe characteristics rather than implementing algorithms.

Examples include:

- Minimal
- Soft
- Crisp
- Elevated
- Editorial

Each recipe defines:

- Neutral temperature
- Surface contrast
- Border strength
- Radius style
- Shadow style
- Primary color usage

---

# Theme Object

The Theme Object is the single source of truth.

Conceptually:

```
Theme
├── Metadata
├── Colors
├── Typography
├── Radius
├── Shadows
├── Borders
├── Transitions
└── Tokens
```

Everything visual derives from this object.

---

# Design Tokens

HueSys uses fixed semantic token names.

Examples:

- --color-primary
- --color-primary-hover
- --color-background
- --color-surface
- --color-text
- --color-border
- --radius-md
- --shadow-sm
- --font-family

Token names never change.

Only values change.

---

# CSS Variables

Generated projects contain a single variables.scss file.

All design tokens live in this file.

Sections should be clearly organized and documented.

---

# Component Library

The preview application and exported project share the exact same component implementation.

There is only one Button.

One Input.

One Card.

Improving the component library automatically improves:

- Preview
- Starter Project export
- Component Package export

---

# Component Philosophy

Components should:

- Use semantic HTML
- Be composable
- Expose minimal props
- Support variants
- Remain portable
- Use CSS variables exclusively

Components never receive Theme props.

---

# Folder Philosophy

Components should remain as small as possible.

Example:

Button/

- Button.tsx
- Button.scss

Additional files should only be introduced when they solve a real problem.

---

# State

Application state consists of:

- Primary Color
- Theme Index
- Font

This state is reflected in the URL.

Example:

?color=4F46E5&theme=7&font=inter