/**
 * Theme JSON -> export format converters.
 * ES module, zero dependencies.
 */

// --- Shared maps ---

const RADIUS_KEYS = {
  radiusSm: 'sm', radiusMd: 'md', radiusLg: 'lg', radiusFull: 'full',
  sm: 'sm', md: 'md', lg: 'lg', full: 'full',
};
const SHADOW_KEYS = { shadowSm: 'sm', shadowMd: 'md', shadowLg: 'lg', sm: 'sm', md: 'md', lg: 'lg' };
const TYPO_VARS = {
  fontSans: 'font-sans', fontMono: 'font-mono', fontDisplay: 'font-display',
  weightNormal: 'font-weight-normal', weightMedium: 'font-weight-medium', weightBold: 'font-weight-bold',
  lineHeight: 'line-height', lineHeightHeading: 'line-height-heading',
  letterSpacingHeading: 'letter-spacing-heading', letterSpacingBody: 'letter-spacing-body',
  textTransformHeading: 'text-transform-heading',
};
const SPACING_SKIP = new Set(['density', 'scale']);

// --- Helpers ---

function merge(base, theme) {
  const out = {};
  for (const key of new Set([...Object.keys(base), ...Object.keys(theme)])) {
    const bv = base[key], tv = theme[key];
    if (tv && bv && typeof bv === 'object' && typeof tv === 'object' && !Array.isArray(bv)) {
      out[key] = merge(bv, tv);
    } else {
      out[key] = tv !== undefined ? tv : bv;
    }
  }
  return out;
}

function pick(src, keyMap) {
  const out = [];
  if (!src) return out;
  for (const [k, alias] of Object.entries(keyMap)) {
    if (src[k] !== undefined) out.push([alias, src[k]]);
  }
  return out;
}

function kebab(key) { return key.replace(/([A-Z])/g, '-$1').toLowerCase(); }

function parseFontList(str) {
  return str.split(',').map(s => {
    s = s.trim();
    return (s.startsWith("'") || s.startsWith('"')) ? s : `'${s}'`;
  }).join(', ');
}

// --- CSS block builders ---

function cssLines(entries) { return entries.map(([k, v]) => `  --${k}: ${v};`).join('\n'); }

function cssColors(colors) {
  if (!colors) return '';
  return cssLines(Object.entries(colors).map(([k, v]) => [`color-${kebab(k)}`, v]));
}

function cssTypo(t) {
  if (!t) return '';
  const lines = [];
  for (const [key, varName] of Object.entries(TYPO_VARS)) {
    if (t[key] !== undefined) lines.push([varName, t[key]]);
  }
  if (t.scale) for (const [k, v] of Object.entries(t.scale)) lines.push([`text-${k}`, v]);
  return cssLines(lines);
}

function cssShape(shape, radius) {
  const src = shape || radius;
  const lines = pick(src, RADIUS_KEYS).map(([a, v]) => [`radius-${a}`, v]);
  if (shape?.borderWidth) lines.push(['border-width', shape.borderWidth]);
  return cssLines(lines);
}

function cssDepth(depth, shadow) {
  if (depth) return cssLines(pick(depth, SHADOW_KEYS).map(([a, v]) => [`shadow-${a}`, v]));
  if (shadow) return cssLines(Object.entries(shadow).map(([k, v]) => [`shadow-${k}`, v]));
  return '';
}

function cssMotion(motion, transition) {
  if (motion) {
    const lines = [];
    if (motion.durationFast) lines.push(['duration-fast', motion.durationFast]);
    if (motion.durationNormal) lines.push(['duration-normal', motion.durationNormal]);
    if (motion.easing) lines.push(['easing', motion.easing]);
    return cssLines(lines);
  }
  if (transition) return cssLines(Object.entries(transition).map(([k, v]) => [`transition-${k}`, v]));
  return '';
}

function cssSpacing(sp) {
  if (!sp) return '';
  return cssLines(Object.entries(sp).filter(([k, v]) => typeof v === 'string' && !SPACING_SKIP.has(k)).map(([k, v]) => [`spacing-${k}`, v]));
}

function cssLayout(l) {
  if (!l) return '';
  const lines = [];
  if (l.maxWidth) lines.push(['layout-max-width', l.maxWidth]);
  if (l.padding) lines.push(['layout-padding', l.padding]);
  if (l.touchTarget) lines.push(['layout-touch-target', l.touchTarget]);
  return cssLines(lines);
}

/** Convert theme + base to CSS custom properties. */
export function toCSS(theme, base = {}) {
  const m = merge(base, theme);
  const sections = [
    ['Colors', cssColors(m.colorDefaults || m.colors)],
    ['Typography', cssTypo(m.typography)],
    ['Shape', cssShape(m.shape, m.radius)],
    ['Spacing', cssSpacing(m.spacing)],
    ['Depth', cssDepth(m.depth, m.shadow)],
    ['Layout', cssLayout(m.layout)],
    ['Motion', cssMotion(m.motion, m.transition)],
  ].filter(([, c]) => c);

  const body = sections.map(([label, c]) => `  /* ${label} */\n${c}`).join('\n\n');
  let css = `:root {\n${body}\n}`;

  const dark = m.colorDefaultsDark || m.colorsDark;
  if (dark) {
    const darkVars = cssColors(dark).split('\n').map(l => '    ' + l).join('\n');
    css += `\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkVars}\n  }\n}`;
  }
  return css;
}

/** Convert theme to Tailwind v4 config string. */
export function toTailwind(theme) {
  const parts = [];
  const pad = (n) => ' '.repeat(n);

  if (theme.colorDefaults) {
    const e = Object.entries(theme.colorDefaults).map(([k, v]) => `${pad(8)}${k}: '${v}',`).join('\n');
    parts.push(`${pad(6)}colors: {\n${e}\n${pad(6)}},`);
  }

  if (theme.typography) {
    const t = theme.typography, fonts = [];
    if (t.fontSans) fonts.push(`${pad(8)}sans: [${parseFontList(t.fontSans)}],`);
    if (t.fontDisplay) fonts.push(`${pad(8)}display: [${parseFontList(t.fontDisplay)}],`);
    if (t.fontMono) fonts.push(`${pad(8)}mono: [${parseFontList(t.fontMono)}],`);
    if (fonts.length) parts.push(`${pad(6)}fontFamily: {\n${fonts.join('\n')}\n${pad(6)}},`);
  }

  const shape = theme.shape || theme.radius;
  if (shape) {
    const e = pick(shape, RADIUS_KEYS).map(([a, v]) => `${pad(8)}${a}: '${v}',`);
    if (e.length) parts.push(`${pad(6)}borderRadius: {\n${e.join('\n')}\n${pad(6)}},`);
  }

  const depth = theme.depth || theme.shadow;
  if (depth) {
    const e = pick(depth, SHADOW_KEYS).map(([a, v]) => `${pad(8)}${a}: '${v}',`);
    if (e.length) parts.push(`${pad(6)}boxShadow: {\n${e.join('\n')}\n${pad(6)}},`);
  }

  return `// tailwind.config.js\nexport default {\n  theme: {\n    extend: {\n${parts.join('\n')}\n    }\n  }\n}`;
}

/** Convert theme to Figma Tokens plugin JSON string. */
export function toFigmaTokens(theme) {
  const tokens = {};

  if (theme.colorDefaults) {
    tokens.color = {};
    for (const [k, v] of Object.entries(theme.colorDefaults)) {
      tokens.color[k] = { value: v, type: 'color' };
    }
  }

  const shape = theme.shape || theme.radius;
  if (shape) {
    const entries = pick(shape, RADIUS_KEYS);
    if (entries.length) {
      tokens.borderRadius = {};
      for (const [a, v] of entries) tokens.borderRadius[a] = { value: v, type: 'borderRadius' };
    }
  }

  if (theme.typography) {
    const t = theme.typography;
    tokens.fontFamily = {};
    if (t.fontSans) tokens.fontFamily.sans = { value: t.fontSans, type: 'fontFamilies' };
    if (t.fontDisplay) tokens.fontFamily.display = { value: t.fontDisplay, type: 'fontFamilies' };
    if (t.fontMono) tokens.fontFamily.mono = { value: t.fontMono, type: 'fontFamilies' };

    tokens.fontWeight = {};
    if (t.weightNormal !== undefined) tokens.fontWeight.normal = { value: t.weightNormal, type: 'fontWeights' };
    if (t.weightMedium !== undefined) tokens.fontWeight.medium = { value: t.weightMedium, type: 'fontWeights' };
    if (t.weightBold !== undefined) tokens.fontWeight.bold = { value: t.weightBold, type: 'fontWeights' };
  }

  const depth = theme.depth || theme.shadow;
  if (depth) {
    const entries = pick(depth, SHADOW_KEYS);
    if (entries.length) {
      tokens.boxShadow = {};
      for (const [a, v] of entries) tokens.boxShadow[a] = { value: v, type: 'boxShadow' };
    }
  }

  // Remove empty groups
  for (const key of Object.keys(tokens)) {
    if (!Object.keys(tokens[key]).length) delete tokens[key];
  }

  return JSON.stringify(tokens, null, 2);
}
