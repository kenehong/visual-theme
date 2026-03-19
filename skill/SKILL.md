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

## Theme Feedback Protocol

테마에 대한 피드백을 받으면:

1. **기록**: `~/visual-theme/FEEDBACK.md`에 해당 테마 섹션에 `- [ ]` 항목 추가
2. **수정**: 피드백 반영 후 `- [x]` + 날짜로 업데이트
3. **일반화**: 패턴이 다른 테마에도 적용 가능하면 → 아래 Learnings 섹션에 추가
4. **읽기**: 테마 수정 작업 시작 전 반드시 `FEEDBACK.md` 확인 → 미해결 피드백 먼저 처리

**피드백 트리거 예시:**
- "dot이 잘 안 보여" → FEEDBACK.md에 기록 + 해당 프리뷰 수정
- "색깔이 좀 약해" → 컬러 조정 + FEEDBACK.md 업데이트
- "폰트가 안 맞아" → 타이포그래피 변경 + Learnings에 패턴 추가

---

## Learnings — Patterns from Theme Creation

> **Auto-update rule**: After creating or significantly modifying a theme, append any new pattern to this section. Check for duplicates first.

### Color
- **Photo-sourced themes need a clear "pop" color** — The single most eye-catching element in the photo (Powell's red sign, taxi yellow, SoHo pink truck) should become `primary` or `accent`. Without it the theme feels flat.
- **Dark-first themes**: If the source image is a night/dusk scene, make `colorDefaults` dark — don't force light mode as default. Dark `bg` + warm `surface` creates the right atmosphere.
- **Avoid duplicate color values** — `primary` and a named extra (e.g. `red`, `green`) should never be the same oklch value. If they are, one is redundant.
- **`colorDefaultsDark` must differ from `colorDefaults`** — If the theme is already dark-first, bump lightness ±5-8% on bg/surface/text so dark mode still has a distinct feel.

### Typography
- **Condensed display fonts** (Barlow Condensed, Antonio, Dela Gothic One) pair well with bold/street/urban themes. Always add `text-transform: uppercase` and `letter-spacing: 0.04em+`.
- **Serif display** (Lora, Playfair Display, DM Serif Display) for literary/heritage themes — use `font-style: italic` sparingly, only on subtitles.
- **Body font warmth matters** — DM Sans / Source Serif 4 feel warmer than Inter. Match body font warmth to theme warmth.

### Structure
- **Always update all 3 places in index.html** when adding a theme: sidebar HTML, `previewUrls` object, `themeNames` object. Missing any one = theme is invisible or broken.
- **Source/docs sync** — Every theme JSON in `docs/themes/` must also exist in `themes/` (source). Update both `manifest.json` files.
- **Cache-busting** — When iterating on a preview HTML, add `?v=N` to the previewUrl to bypass iframe cache.

### Enum Values (THEME_FORMAT.md compliance)
- `spacing.density`: only `compact`, `dense`, `default`, `airy`, `spacious`
- `depth.shadowStyle`: only `none`, `flat`, `neutral`, `strong`, `hard`, `glow`
- `demo.type`: only `shop`, `bar`, `saas`, `fitness`, `edu`, `dashboard`
- `radiusFull`: always `"9999px"` (not `"999px"`)

### Preview HTML
- **Preview must have Components showcase** — Typography, Colors, Buttons, Badges, Card, Form, Table sections at the bottom. This is what the gallery's "Components" tab shows.
- **Hardcoded oklch values in CSS** — When primary/accent colors are used inline (borders, shadows, gradients), they must be updated if the JSON color changes. Using `var(--primary)` where possible avoids this.
- **Film grain / texture overlays** — Use `position: fixed; inset: 0; pointer-events: none; z-index: 9999` with low opacity (0.02-0.05) for paper/grain effects. Higher z-index so it covers everything.
