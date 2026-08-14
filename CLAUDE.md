# CLAUDE.md

# HueSys

This repository contains HueSys, a web application that generates production-ready React design systems from a single primary color.

Before making architectural decisions, read the documentation in `/docs`.

The documentation is the source of truth.

---

# Engineering Philosophy

Always prioritize:

- Simplicity over flexibility
- Readability over cleverness
- Composition over configuration
- Accessibility by default
- Responsive design by default
- Deterministic behavior over randomness
- Clean, maintainable source code

Do not introduce complexity unless it solves an existing problem.

---

# Architecture Rules

- Do not create duplicate implementations.
- The preview application and exported components must share the same component library.
- Components should never receive Theme props.
- Components should use CSS variables exclusively.
- Theme generation should remain deterministic.
- Theme recipes should remain declarative configuration rather than executable logic.
- Use semantic HTML whenever possible.

---

# Component Philosophy

Components should:

- Be composable.
- Expose minimal props.
- Prefer children over configuration.
- Favor native browser behavior.
- Remain portable outside HueSys.

---

# Project Structure

Follow the architecture described in `/docs/02-architecture.md`.

Do not reorganize the project structure without a clear architectural reason.

---

# Before Implementing New Features

Before introducing:

- new dependencies
- new folders
- new abstractions
- new utilities

consider whether they genuinely solve today's problem.

Prefer the simplest implementation that satisfies the current requirements.

---

# Documentation

If implementation changes architecture or project philosophy, update the relevant documentation inside `/docs`.

Documentation should remain synchronized with the codebase.

# Code Style

Favor code that a senior frontend engineer can understand immediately.

Avoid unnecessary abstractions.

Avoid generic utility functions unless they have multiple consumers.

Prefer explicit code over clever code.

Keep files focused and reasonably small.

Refactor only when duplication becomes meaningful.

# When Unsure

When multiple reasonable implementations exist:

1. Follow the project documentation.
2. Choose the simplest architecture.
3. Preserve consistency with the existing codebase.
4. Do not expand scope beyond the requested task.

# Do Not

Unless explicitly requested:

- Do not introduce additional libraries.
- Do not refactor unrelated code.
- Do not reorganize folders.
- Do not optimize prematurely.
- Do not expand the project scope.
- Do not replace existing architectural decisions.

# Communication

When implementing features:

- Explain architectural decisions before making them.
- Call out tradeoffs when they exist.
- Ask before making significant architectural changes.
- Prefer incremental progress over large rewrites.

# MVP First

HueSys is currently in MVP development.

Favor implementations that satisfy today's requirements.

Future features should not influence today's architecture unless already documented in `/docs`.

Avoid building infrastructure for hypothetical future functionality.

# Testing Philosophy

Write code that is naturally testable.

Prefer pure functions where appropriate.

Keep business logic separate from presentation whenever practical.

Do not introduce testing libraries until requested.