# Contributing a Theme

We welcome theme contributions! Every theme tells a visual story inspired by the real world.

## What you need

1. A **reference image** — photo, screenshot, moodboard, advertisement, anything with a strong visual identity
2. A **theme.json** file following the [theme format spec](THEME_FORMAT.md)
3. A **demo type** — pick which demo template fits your theme best

## Path A: Using Claude Code (recommended)

If you have [Claude Code](https://claude.ai/code), you can use the theme creation skill:

```bash
# Copy the skill to your Claude Code skills directory
cp skill/SKILL.md ~/.claude/skills/extract-theme.md

# Run it with your reference image
# In Claude Code, provide the image and ask to extract a theme
```

The skill will:
1. Analyze your image across 7 visual axes (color, typography, shape, depth, texture, motion, mood)
2. Generate a theme JSON with oklch colors
3. Create a preview for you to review

## Path B: Manual creation

1. Read [THEME_FORMAT.md](THEME_FORMAT.md) for the JSON schema
2. Create your theme JSON with all required fields
3. Use oklch colors only (no hex, no hsl)
4. Pick a Google Fonts combination that matches the visual feel

## Submitting your theme

### 1. Fork this repo

### 2. Add your theme file

```
themes/your-theme-name.json
```

File name should be kebab-case, descriptive of the visual source. Examples:
- `tokyo-subway.json`
- `70s-disco.json`
- `scandinavian-cabin.json`

### 3. Add demo content

In your theme JSON, include a `demo` field. Pick the closest type:

| Type | For themes inspired by... |
|------|--------------------------|
| `shop` | Retail, streetwear, vintage stores, markets |
| `bar` | Restaurants, nightlife, food, cafes |
| `saas` | Tech, tools, software, minimal design |
| `fitness` | Sports, health, outdoors, energy |
| `edu` | Schools, games, kids, learning |
| `dashboard` | Finance, data, analytics, news |

Provide the text content — the demo template handles layout and styling:

```json
"demo": {
  "type": "shop",
  "title": "Your Shop Name",
  "subtitle": "A tagline that fits the mood",
  "items": [
    { "name": "Item Name", "price": "$XX", "tag": "Label" }
  ]
}
```

### 4. Update manifest

Add your theme to `themes/manifest.json`:

```json
{
  "id": "your-theme-name",
  "file": "your-theme-name.json",
  "featured": false
}
```

### 5. Submit a Pull Request

PR title: `feat: add [theme-name] theme`

In the PR description, include:
- What image/visual inspired this theme
- Why you chose the demo type
- Any special notes about the visual language

## Checklist

- [ ] All required fields present (see [THEME_FORMAT.md](THEME_FORMAT.md))
- [ ] All colors in oklch() format
- [ ] `mood` has exactly 3 words
- [ ] `suggestions.googleFonts` URL provided
- [ ] `demo` field with type and content
- [ ] File added to `manifest.json`
- [ ] File name is kebab-case

## Local Preview

```bash
python3 -m http.server 8080
# Open http://localhost:8080/docs/
```

## Tips for good themes

- **Be specific** — "90s West Philly sneaker stores" is better than "retro"
- **Capture the mood, not exact pixels** — oklch colors should feel right, not be precise hex matches
- **Pick contrasting fonts** — display font for personality, body font for readability
- **Test your theme** — open the gallery locally and check if the demo looks cohesive
- **Include a source description** — helps others understand the visual inspiration
