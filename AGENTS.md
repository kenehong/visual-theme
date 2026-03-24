# Visual Theme

> A collection of design themes inspired by real-world visual references — storefronts, neon signs, architecture, vintage ads

## Core UX Flow

1. Provide a reference image or URL
2. Analyze across 7 visual axes → map to oklch tokens → generate JSON
3. Preview HTML → confirm → register to gallery

## Philosophy

- Translate real-world visual identity into digital design tokens
- oklch colors only — no hex
- Goal is mood recreation, not exact color matching

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JS (gallery previews) |
| Backend | None |
| Data | JSON theme files (`themes/`) |
| Deploy | GitHub Pages (Actions, `gallery/` folder) |

## Critical Rules

- Adding a theme requires 3 places: `themes/`, `gallery/themes/`, `gallery/index.html`
- Keep both `manifest.json` (themes/, gallery/themes/) in sync
- New themes start with `featured: false` → `true` after user preview approval
- Preview HTML must include a Components showcase section

## Persona

- **Target user**: Designers/developers who want distinctive themes over generic AI defaults
- **Tone**: Creative, inspiration-driven
- **Language**: English
