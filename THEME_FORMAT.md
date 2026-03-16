# Theme Format Specification

A visual-theme JSON file defines a complete design system personality extracted from a reference image.

All colors use **oklch()** format. No hex, no hsl.

## Required Fields

```json
{
  "name": "Theme Name",
  "description": "One-line description of the visual source and mood",
  "mood": ["word1", "word2", "word3"],

  "shape": {
    "radiusSm": "0px",
    "radiusMd": "2px",
    "radiusLg": "4px",
    "radiusFull": "9999px",
    "borderWidth": "3px"
  },

  "typography": {
    "fontSans": "'Font Name', fallback, sans-serif",
    "fontMono": "'JetBrains Mono', monospace",
    "fontDisplay": "'Display Font', fallback, sans-serif",
    "weightNormal": 400,
    "weightMedium": 500,
    "weightBold": 700,
    "letterSpacingHeading": "0.02em",
    "letterSpacingBody": "0em",
    "lineHeight": 1.6,
    "lineHeightHeading": 1.2,
    "textTransformHeading": "none"
  },

  "spacing": {
    "density": "airy",
    "scale": 1.0
  },

  "depth": {
    "shadowSm": "...",
    "shadowMd": "...",
    "shadowLg": "...",
    "shadowStyle": "neutral"
  },

  "motion": {
    "durationFast": "100ms",
    "durationNormal": "150ms",
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
  },

  "colorDefaults": {
    "bg": "oklch(...)",
    "surface": "oklch(...)",
    "text": "oklch(...)",
    "primary": "oklch(...)",
    "accent": "oklch(...)"
  },

  "colorDefaultsDark": {
    "bg": "oklch(...)",
    "surface": "oklch(...)",
    "text": "oklch(...)"
  },

  "suggestions": {
    "googleFonts": "Font+Name:wght@400;700"
  }
}
```

## Optional Fields

```json
{
  "source": "Description of the reference image or URL",

  "colorDefaults": {
    "yellow": "oklch(...)",
    "green": "oklch(...)",
    "red": "oklch(...)",
    "blue": "oklch(...)",
    "warm": "oklch(...)"
  },

  "suggestions": {
    "icons": "Lucide (stroke width, style notes)",
    "components": "recommended component patterns",
    "avoid": "things that conflict with this theme",
    "texture": "CSS texture recipes (grain, noise, etc.)"
  },

  "demo": {
    "type": "shop | bar | saas | fitness | edu | dashboard",
    "title": "Demo Site Title",
    "subtitle": "Tagline",
    "items": [...]
  }
}
```

## Field Reference

### mood
Array of exactly 3 English words describing the visual feeling. Examples:
- `["urban", "gritty", "authentic"]`
- `["nocturnal", "luminous", "nostalgic"]`
- `["efficient", "minimal", "focused"]`

### shape
| Field | Description | Examples |
|-------|-------------|---------|
| `radiusSm` | Small elements (badges, tags) | `0px`, `4px`, `12px` |
| `radiusMd` | Medium elements (buttons, inputs) | `2px`, `6px`, `16px` |
| `radiusLg` | Large elements (cards, panels) | `4px`, `8px`, `24px` |
| `radiusFull` | Pill shape | `9999px` or `0px` (for fully square) |
| `borderWidth` | Default border thickness | `0px` to `3px` |

### typography
| Field | Description |
|-------|-------------|
| `fontSans` | Primary body font stack |
| `fontDisplay` | Heading/display font. `null` = use fontSans |
| `fontMono` | Code/data font |
| `weightNormal` | Body text weight (400-500) |
| `weightMedium` | Emphasis weight (500-700) |
| `weightBold` | Strong emphasis (600-800) |
| `textTransformHeading` | `"none"` or `"uppercase"` |

### spacing.density
| Value | Usage |
|-------|-------|
| `"compact"` | Data-heavy UIs, scale 0.75 |
| `"dense"` | Utility, action-heavy, scale 0.85-0.9 |
| `"default"` | General purpose, scale 1.0 |
| `"airy"` | Content-focused, breathing room, scale 1.1 |
| `"spacious"` | Playful, educational, scale 1.25 |

### depth.shadowStyle
| Value | Description |
|-------|-------------|
| `"none"` | No shadows |
| `"flat"` | Minimal, almost invisible |
| `"neutral"` | Standard subtle shadows |
| `"strong"` | Heavy, dramatic shadows |
| `"hard"` | No blur, offset only (e.g., `4px 4px 0`) |
| `"glow"` | Neon/light glow (e.g., `0 0 16px color`) |

### demo.type
| Type | Demo content | Best for |
|------|-------------|----------|
| `shop` | Product grid, sale banner, brands | Retail, streetwear, vintage |
| `bar` | Menu, neon signs, reservation | Nightlife, food, neon |
| `saas` | Hero, features, pricing table | SaaS, tools, minimal |
| `fitness` | Stats, workout plan, timer | Sports, health, energy |
| `edu` | Quiz, answers, score, streak | Education, kids, games |
| `dashboard` | Tickers, table, portfolio | Finance, data, analytics |

## oklch Color Guide

```
oklch(Lightness% Chroma Hue)

Lightness: 0% (black) → 100% (white)
Chroma:    0 (gray) → 0.4 (max saturation)
Hue:       0-360 degrees

Common hues:
  Red: 25      Orange: 60     Yellow: 90
  Green: 150   Teal: 180      Blue: 250
  Purple: 300  Pink: 330

Typical ranges:
  Pastel:     L 75-85%  C 0.08-0.15
  Vivid:      L 55-65%  C 0.15-0.25
  Neon:       L 65-80%  C 0.20-0.30
  Deep:       L 35-50%  C 0.10-0.20
  Muted:      L 50-70%  C 0.05-0.12
```
