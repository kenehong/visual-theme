---
name: extract-theme
description: Extract a design system theme from a reference image/URL and generate a personality JSON preset
argument-hint: "[image path or URL]"
---

# Extract Theme Skill

Analyze visual characteristics from reference images (photos, screenshots, ads, etc.)
and generate a JSON preset compatible with the `/design` personality theme format.

## Core Rules

- **Faithful extraction** — Reflect the reference's mood and visual language as closely as possible. No arbitrary interpretation
- **oklch only** — All color values must be expressed in oklch() (no hex)
- **Format compatible** — Output must match `themes/personalities/*.json` structure exactly
- **Preview required** — Generate a preview HTML with theme-applied components → user confirms → save
- **Cite sources** — Record extraction rationale in mood/suggestions fields

## Input

Two input methods:

1. **Image file path** — `~/some-image.png` → Analyze directly via Read tool
2. **URL** — Capture screenshot via Playwright → Analyze

## Protocol

### Phase 1: Visual Analysis — Read and analyze the image

Read the image via Read tool and analyze across 7 axes:

```
## Visual Analysis

### 1. Color Palette
- **Dominant**: [Largest area color] → oklch(L% C H)
- **Primary accent**: [Eye-catching highlight color] → oklch(L% C H)
- **Secondary accent**: [Supporting highlight, if present] → oklch(L% C H)
- **Background tone**: [warm/cool/neutral]
- **Saturation level**: [vivid/muted/desaturated]
- **Contrast ratio**: [high/medium/low]

### 2. Typography Feel
- **Heading style**: [serif/sans-serif/slab/display/script]
- **Weight impression**: [thin/regular/bold/black]
- **Letter spacing**: [tight/normal/wide/very wide]
- **Case**: [normal/uppercase/mixed]
- **Era feel**: [modern/retro/classic/futuristic]

### 3. Shape Language
- **Corners**: [sharp/slightly rounded/rounded/pill]
- **Border usage**: [none/thin subtle/thick decorative/outline heavy]
- **Geometric vs organic**: [geometric/organic/mixed]

### 4. Depth & Texture
- **Shadow style**: [none/subtle/hard drop/long cast/neon glow]
- **Texture**: [flat/grain/noise/paper/glossy]
- **Layering**: [flat/slight elevation/deep stacking]

### 5. Spacing & Density
- **Layout density**: [airy/default/compact/dense]
- **Whitespace**: [generous/balanced/tight]

### 6. Motion Feel
- **Energy**: [calm/moderate/dynamic/intense]
- **Implied speed**: [slow ease/snappy/bouncy/sharp]

### 7. Overall Mood
- **3-word mood**: [word1, word2, word3]
- **Era/style reference**: [e.g., "90s retro advertising", "Y2K tech", "Bauhaus minimal"]
- **Closest existing personality**: [clean/bold/playful/dense] + differences
```

### Phase 2: Theme Mapping — Convert analysis to JSON tokens

Map analysis results to the existing personality JSON structure:

**Color → oklch conversion guide:**
- Express the **tone/mood** of perceived colors in oklch
- Lightness(L): brightness — pastel(75-85%), vivid(55-65%), deep(35-50%)
- Chroma(C): saturation — achromatic(0-0.05), muted(0.05-0.12), vivid(0.15-0.25), neon(0.25+)
- Hue(H): hue angle — Red(25), Orange(60), Yellow(90), Green(150), Teal(180), Blue(250), Purple(300), Pink(350)

**Typography mapping:**
- Match the image's typographic feel → closest Google Fonts
- Serif retro → Playfair Display, Lora, DM Serif Display
- Slab retro → Roboto Slab, Zilla Slab, Alfa Slab One
- Sans geometric → Inter, Outfit, Space Grotesk
- Sans humanist → Nunito, Quicksand, DM Sans
- Display/decorative → Fredoka, Bungee, Righteous, Press Start 2P
- Condensed → Barlow Condensed, Oswald, Anton

**Shadow mapping:**
- Hard drop shadow → `Xpx Ypx 0 color` (blur 0)
- Neon glow → `0 0 Npx color`
- Soft elevation → Keep existing patterns

### Phase 3: Preview — Generate preview HTML

Generate a sample HTML with theme-applied components to show the user.

**Components to include in preview:**
- Headings (h1, h2, h3)
- Buttons (primary, secondary, ghost)
- Cards (text + image placeholder)
- Input fields
- Badges/tags
- Simple layout (header + card grid)

**Preview file**: `/tmp/theme-preview-[name].html`
→ Capture screenshot via Playwright to show user
→ Enable side-by-side comparison with original reference

### Phase 4: Confirm & Save — Save after user confirmation

After user confirms:

1. **Save JSON preset**: `~/agent-skills/skills/workflow/design/themes/personalities/[name].json`
2. **Output summary**:
```
## Theme Extracted: [name]

- **Based on**: [Reference description]
- **Mood**: [3-word mood]
- **Primary**: oklch(...)
- **Font**: [font name]
- **Key traits**: [3-4 key visual characteristics]

Saved to: themes/personalities/[name].json
```

## Output JSON Structure

100% compatible with existing personality format:

```json
{
  "name": "Theme Name",
  "description": "Extraction source and mood description",
  "source": "Reference image/URL path",
  "mood": ["word1", "word2", "word3"],
  "shape": {
    "radiusSm": "...",
    "radiusMd": "...",
    "radiusLg": "...",
    "radiusFull": "9999px",
    "borderWidth": "..."
  },
  "typography": {
    "fontSans": "...",
    "fontMono": "...",
    "fontDisplay": "...",
    "weightNormal": 400,
    "weightMedium": 500,
    "weightBold": 700,
    "letterSpacingHeading": "...",
    "letterSpacingBody": "...",
    "lineHeight": 1.5,
    "lineHeightHeading": 1.2,
    "textTransformHeading": "none|uppercase"
  },
  "spacing": {
    "density": "airy|default|dense",
    "scale": 1.0
  },
  "depth": {
    "shadowSm": "...",
    "shadowMd": "...",
    "shadowLg": "...",
    "shadowStyle": "neutral|strong|hard|glow|none"
  },
  "motion": {
    "durationFast": "...",
    "durationNormal": "...",
    "easing": "..."
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
    "icons": "...",
    "components": "...",
    "avoid": "...",
    "googleFonts": "Font+Name:wght@400;700",
    "texture": "grain/noise CSS if applicable"
  }
}
```

## Texture Recipes (Optional)

If the reference has visible texture, recreate it in CSS:

```css
/* Film grain */
background-image: url("data:image/svg+xml,...noise...");

/* Paper texture */
background: oklch(95% 0.02 80);
filter: contrast(1.02) brightness(1.01);

/* Halftone dot */
background-image: radial-gradient(circle, oklch(30% 0 0) 1px, transparent 1px);
background-size: 4px 4px;
```

## Notes

- Color extraction is vision-based, so the goal is **mood recreation, not exact hex matching**
- If it overlaps with existing 4 personalities (clean/bold/playful/dense), note "closest match + differences"
- This theme can be referenced in `brand.md`: `personality: retro-90s` format
