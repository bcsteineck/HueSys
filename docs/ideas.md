# HueSys Ideas

This document contains unfinished ideas, experiments, and possible future directions.

Nothing in this file is committed product scope.

Ideas should not influence the current architecture unless they are promoted into the technical specification, architecture, roadmap, or development plan.

---

# Color Generation

Possible future improvements:

- Additional palette-generation strategies
- Improved perceptual gamut mapping
- More sophisticated palette harmony scoring
- Palette quality evaluation
- Additional semantic-color derivation strategies
- Alternative neutral-generation strategies
- Palette comparison
- Multiple generated palette suggestions shown simultaneously
- Locking individual colors while regenerating the rest of a palette
- Manual neutral-palette customization
- Additional palette accessibility analysis

Questions:

- Should users eventually be able to regenerate individual supporting colors?
- Should HueSys score generated palettes for contrast or harmony?
- Should users be able to lock multiple colors and regenerate around them?
- Should Custom mode eventually allow users to customize neutrals?
- Would side-by-side palette comparison improve the workflow or add unnecessary complexity?

Keep the MVP simpler unless testing demonstrates a real need for these features.

---

# Typography

Possible future improvements:

- Additional curated fonts
- Font category filtering
- Font pairing
- Separate heading and body fonts
- More typography scale options
- Additional weight controls
- Line-height controls
- Letter-spacing controls
- Custom font definitions
- Webfont loading options
- Typography accessibility guidance

Questions:

- Is one font family enough for most HueSys users?
- Would heading/body font pairing meaningfully improve generated systems?
- At what point do additional typography controls make HueSys feel like a token editor?

The MVP should continue to prioritize a small number of high-impact typography decisions.

---

# Style

Possible future improvements:

- Additional spacing presets
- Additional radius presets
- Optional shadow controls
- Optional border controls
- Surface-depth controls
- Motion or transition personality
- Component-density presets beyond the current spacing model

Questions:

- Are Border Radius and Spacing enough for most users?
- Which additional Style control would provide the most visual impact without adding unnecessary complexity?
- Should structural controls remain independent, or would carefully designed Style presets become useful later?

Do not reintroduce the previous Recipe architecture by default.

Any future Style expansion should preserve the independence of:

```text
Colors
Typography
Style