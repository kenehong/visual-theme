---
name: extract-theme
description: 레퍼런스 이미지/URL에서 디자인 시스템 테마를 추출하여 personality JSON 프리셋으로 생성
argument-hint: "[image path or URL]"
---

# Extract Theme Skill

레퍼런스 이미지(사진, 스크린샷, 광고 등)에서 시각적 특성을 분석하여
기존 `/design` personality 테마 포맷에 맞는 JSON 프리셋을 생성한다.

## Core Rules

- **충실한 추출** — 레퍼런스의 무드와 시각 언어를 최대한 반영. 임의 해석 금지
- **oklch 전용** — 모든 색상값은 oklch()로 표현 (hex 금지)
- **기존 포맷 호환** — `themes/personalities/*.json` 동일 구조로 출력
- **프리뷰 필수** — 테마 적용된 컴포넌트 프리뷰 HTML 생성 → 유저 컨펌 → 저장
- **출처 명시** — 추출 근거를 mood/suggestions에 기록

## Input

두 가지 입력 방식:

1. **이미지 파일 경로** — `~/some-image.png` → Read 툴로 직접 분석
2. **URL** — Playwright로 스크린샷 캡처 → 분석

## Protocol

### Phase 1: Visual Analysis — 이미지 읽기 및 분석

이미지를 Read 툴로 읽고 다음 7가지 축을 분석:

```
## Visual Analysis

### 1. Color Palette (색상)
- **Dominant**: [가장 넓은 면적 색상] → oklch(L% C H)
- **Primary accent**: [시선을 끄는 강조색] → oklch(L% C H)
- **Secondary accent**: [보조 강조색, 있으면] → oklch(L% C H)
- **Background tone**: [배경 톤 — warm/cool/neutral]
- **Saturation level**: [전체 채도 — vivid/muted/desaturated]
- **Contrast ratio**: [명암 대비 — high/medium/low]

### 2. Typography Feel (타이포그래피 느낌)
- **Heading style**: [serif/sans-serif/slab/display/script]
- **Weight impression**: [thin/regular/bold/black]
- **Letter spacing**: [tight/normal/wide/very wide]
- **Case**: [normal/uppercase/mixed]
- **Era feel**: [modern/retro/classic/futuristic]

### 3. Shape Language (형태 언어)
- **Corners**: [sharp/slightly rounded/rounded/pill]
- **Border usage**: [none/thin subtle/thick decorative/outline heavy]
- **Geometric vs organic**: [geometric/organic/mixed]

### 4. Depth & Texture (깊이와 질감)
- **Shadow style**: [none/subtle/hard drop/long cast/neon glow]
- **Texture**: [flat/grain/noise/paper/glossy]
- **Layering**: [flat/slight elevation/deep stacking]

### 5. Spacing & Density (간격과 밀도)
- **Layout density**: [airy/default/compact/dense]
- **Whitespace**: [generous/balanced/tight]

### 6. Motion Feel (움직임 느낌)
- **Energy**: [calm/moderate/dynamic/intense]
- **Implied speed**: [slow ease/snappy/bouncy/sharp]

### 7. Overall Mood (전체 무드)
- **3-word mood**: [word1, word2, word3]
- **Era/style reference**: [e.g., "90s retro advertising", "Y2K tech", "Bauhaus minimal"]
- **Closest existing personality**: [clean/bold/playful/dense] + 차이점
```

### Phase 2: Theme Mapping — 분석 결과를 JSON 토큰으로 변환

분석 결과를 기존 personality JSON 구조에 매핑:

**Color → oklch 변환 가이드:**
- 이미지에서 인지한 색상의 **톤/분위기**를 oklch로 표현
- Lightness(L): 밝기 — 파스텔(75-85%), 비비드(55-65%), 딥(35-50%)
- Chroma(C): 채도 — 무채색(0-0.05), 뮤트(0.05-0.12), 비비드(0.15-0.25), 네온(0.25+)
- Hue(H): 색상각 — Red(25), Orange(60), Yellow(90), Green(150), Teal(180), Blue(250), Purple(300), Pink(350)

**Typography 매핑:**
- 이미지의 타이포 느낌 → 가장 가까운 Google Fonts 매칭
- Serif retro → Playfair Display, Lora, DM Serif Display
- Slab retro → Roboto Slab, Zilla Slab, Alfa Slab One
- Sans geometric → Inter, Outfit, Space Grotesk
- Sans humanist → Nunito, Quicksand, DM Sans
- Display/decorative → Fredoka, Bungee, Righteous, Press Start 2P
- Condensed → Barlow Condensed, Oswald, Anton

**Shadow 매핑:**
- Hard drop shadow → `Xpx Ypx 0 color` (blur 0)
- Neon glow → `0 0 Npx color`
- Soft elevation → 기존 패턴 유지

### Phase 3: Preview — 프리뷰 HTML 생성

테마가 적용된 컴포넌트 샘플 HTML을 생성하여 유저에게 보여준다.

**프리뷰에 포함할 컴포넌트:**
- 헤딩 (h1, h2, h3)
- 버튼 (primary, secondary, ghost)
- 카드 (텍스트 + 이미지 placeholder)
- 입력 필드
- 배지/태그
- 간단한 레이아웃 (헤더 + 카드 그리드)

**프리뷰 파일**: `/tmp/theme-preview-[name].html`
→ Playwright로 스크린샷 캡처하여 유저에게 표시
→ 원본 레퍼런스와 나란히 비교할 수 있도록

### Phase 4: Confirm & Save — 컨펌 후 저장

유저 컨펌 후:

1. **JSON 프리셋 저장**: `~/agent-skills/skills/workflow/design/themes/personalities/[name].json`
2. **출력 요약**:
```
## Theme Extracted: [name]

- **Based on**: [레퍼런스 설명]
- **Mood**: [3-word mood]
- **Primary**: oklch(...)
- **Font**: [font name]
- **Key traits**: [핵심 시각 특성 3-4개]

Saved to: themes/personalities/[name].json
```

## Output JSON Structure

기존 personality 포맷과 100% 호환:

```json
{
  "name": "Theme Name",
  "description": "추출 소스와 무드 설명",
  "source": "레퍼런스 이미지/URL 경로",
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

## Texture Recipes (선택적)

레퍼런스에 질감이 있으면 CSS로 재현:

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

- 색상 추출은 비전 기반이므로 **정확한 hex 매칭이 아닌 분위기 재현**이 목표
- 기존 4개 personality(clean/bold/playful/dense)와 겹치면 "가장 가까운 것 + 차이점" 안내
- `brand.md`에서 이 테마를 참조할 수 있음: `personality: retro-90s` 형태
