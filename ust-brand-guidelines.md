# Ust. Brand Guidelines

**Visual identity system for Ust · ustdoes.tech · Advancing Analytics**

---

## Brand Personality

**Approachable expert** — deep knowledge, easy manner. The brand communicates technical authority without intimidation, combining the rigour of data engineering with the warmth of someone who genuinely wants you to understand.

---

## Colour Palette

### Core Colours

| Colour | Hex | Role | Usage |
|--------|-----|------|-------|
| **Deep Teal** | `#0A6E6E` | Primary / Brand Anchor | Headers, primary buttons, links, key UI elements |
| **Dark Navy** | `#0D1B2A` | Depth / Authority | Dark mode backgrounds, text (light mode), code blocks |
| **Sage Green** | `#4A7C6F` | Secondary / Organic | Secondary elements, supporting graphics, data viz |
| **Honey Amber** | `#F5A623` | Accent / Warmth | CTAs, highlights, tags, the signature amber dot |
| **Electric Coral** | `#FF4F58` | Accent / Punch | Alerts, urgent tags, sparingly for emphasis |

### The 80/20 Rule

Deep Teal, Sage Green, and Dark Navy carry **80% of visual weight**. Honey Amber and Electric Coral are reserved for **emphasis only** — CTAs, tags, data highlights, and moments of surprise. Overusing the accents dilutes their impact.

---

## Typography

All fonts are **natively available in Microsoft Office** — no installation, no substitution issues, identical rendering across PowerPoint, Word, Outlook, and web.

### Font Stack

| Role | Font | Weight | Fallbacks |
|------|------|--------|-----------|
| **Headings** | Georgia | Bold | Times New Roman, serif |
| **Body** | Segoe UI | Regular / Semibold | Tahoma, Geneva, Verdana, sans-serif |
| **Code & Data** | Consolas | Regular | Courier New, monospace |

### Why This Pairing Works

**Georgia** is a classic serif with warmth and authority — it says "I've done the reading *and* the building." The serif/sans contrast against Segoe UI creates visual hierarchy without needing size alone to do the work.

**Segoe UI** is crisp, modern, and slightly techy. It reads beautifully at any size and carries your body content without competing with the headings.

**Consolas** is the strongest monospace in the Office ecosystem. It gives code blocks and data tables a distinct, professional feel.

### Type Scale (Suggested)

| Level | Font | Size | Weight |
|-------|------|------|--------|
| H1 | Georgia | 36px / 28pt | Bold |
| H2 | Georgia | 26px / 20pt | Bold |
| H3 | Georgia | 20px / 15pt | Bold |
| Body | Segoe UI | 15px / 11pt | Regular |
| Body emphasis | Segoe UI | 15px / 11pt | Semibold |
| Code | Consolas | 13px / 10pt | Regular |
| Caption / Label | Segoe UI | 11px / 8pt | Semibold, uppercase, 2px letter-spacing |

---

## Light Mode

A warm, editorial feel — approachable, not clinical.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#F4F1EC` | Page background (warm off-white, not pure white) |
| `bgSubtle` | `#E8E4DD` | Secondary backgrounds, hover states |
| `surface` | `#FFFFFF` | Cards, elevated panels |
| `text` | `#0D1B2A` | Primary text (Dark Navy) |
| `textSecondary` | `#3D4F5F` | Subheadings, descriptions |
| `textMuted` | `#6B7C8A` | Captions, metadata, labels |
| `border` | `#D4CFC7` | Card borders, dividers |
| `borderSubtle` | `#E8E4DD` | Subtle separation |
| `codeBg` | `#0D1B2A` | Code block backgrounds |
| `codeText` | `#E8E4DD` | Code block text |

---

## Dark Mode

Uses brand navy as the base — cohesive and easy on the eyes, not harsh black.

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#0D1B2A` | Page background (Dark Navy) |
| `bgSubtle` | `#162738` | Secondary backgrounds, hover states |
| `surface` | `#162738` | Cards, elevated panels |
| `surfaceElevated` | `#1A3045` | Modals, dropdowns, popovers |
| `text` | `#E8E4DD` | Primary text (warm off-white) |
| `textSecondary` | `#A8B8C8` | Subheadings, descriptions |
| `textMuted` | `#6B7C8A` | Captions, metadata, labels |
| `border` | `#243B50` | Card borders, dividers |
| `borderSubtle` | `#1E3347` | Subtle separation |
| `codeBg` | `#0A1420` | Code block backgrounds |
| `codeText` | `#A8B8C8` | Code block text |

---

## Contrast Pairings (Accessibility)

These combinations pass WCAG AA contrast requirements:

| Combination | Foreground | Background | Use Case |
|-------------|-----------|------------|----------|
| Body text (light) | `#0D1B2A` | `#F4F1EC` | Default reading |
| Body text (dark) | `#E8E4DD` | `#0D1B2A` | Default reading |
| White on Teal | `#FFFFFF` | `#0A6E6E` | Primary buttons, headers |
| Navy on Amber | `#0D1B2A` | `#F5A623` | CTA buttons, highlights |
| Teal on Surface (light) | `#0A6E6E` | `#FFFFFF` | Links, labels |
| Teal on Surface (dark) | `#0A6E6E` | `#162738` | Links, labels |

---

## Wordmark

The wordmark uses Georgia Bold with coloured punctuation:

> **Ust** <span style="color:#F5A623">**.**</span> **does** <span style="color:#0A6E6E">**.**</span> **tech**

- The amber dot after "Ust" is the signature micro-accent
- The teal dot before "tech" reinforces the primary brand colour
- In contexts where colour isn't available, use the wordmark in Dark Navy or white

---

## Slide Deck Guidelines

### Title Slides

- **Teal left-bar** (6px wide, full height) as signature framing device
- Georgia Bold for the title, Segoe UI for subtitle
- Brand attribution in Segoe UI, uppercase, small, teal
- **Amber dot** in bottom-right corner as micro-accent

### Content Slides

- **Gradient top-bar** (4px high): Deep Teal → Sage Green → Honey Amber
- Georgia Bold for slide heading
- Segoe UI for all body content
- Use Consolas for any code, data, or technical values
- Use brand colours for numbered pillars / categories (Teal for first, Sage for second, Amber for third)

### General Rules

- Dark mode slides use `#162738` as slide background, not pure black
- Light mode slides use `#FFFFFF` as slide background
- Never use more than two accent colours on a single slide
- The amber dot or teal bar should appear on every slide for consistency

---

## Data Visualisation

### Colour Sequence

When displaying multiple data series, use this order:

1. Deep Teal `#0A6E6E`
2. Sage Green `#4A7C6F`
3. Honey Amber `#F5A623`
4. Electric Coral `#FF4F58`
5. Dark Navy `#0D1B2A`

### Rules

- Use Consolas for axis labels and data values
- Use Segoe UI for chart titles and legends
- Bar charts and horizontal bars are preferred over pie charts
- Ensure sufficient contrast between adjacent series

---

## Buttons & Actions

| Type | Background | Text | Border | Use |
|------|-----------|------|--------|-----|
| **Primary** | `#0A6E6E` | `#FFFFFF` | None | Main actions |
| **Secondary** | Transparent | `#0A6E6E` | `#0A6E6E` 2px | Supporting actions |
| **CTA / Highlight** | `#F5A623` | `#0D1B2A` | None | Key conversions, attention |
| **Alert / Urgent** | `#FF4F58` | `#FFFFFF` | None | Warnings, destructive actions |

All buttons use Segoe UI Semibold at 14px with 8px border-radius.

---

## Content Tags

| Type | Background | Example |
|------|-----------|---------|
| Open Source | Sage Green `#4A7C6F` | Apiary Framework |
| Conference Talk | Honey Amber `#F5A623` | Headless BI |
| Live Project | Electric Coral `#FF4F58` | Regulatory Ontology |
| General | Deep Teal `#0A6E6E` | Databricks, Governance |

Tags use Segoe UI Semibold, 11px, uppercase, with 0.5px letter-spacing and white text.

---

## Quick Reference

```
PRIMARY:       #0A6E6E  Deep Teal
NAVY:          #0D1B2A  Dark Navy
SECONDARY:     #4A7C6F  Sage Green
ACCENT WARM:   #F5A623  Honey Amber
ACCENT PUNCH:  #FF4F58  Electric Coral

LIGHT BG:      #F4F1EC  (warm off-white)
DARK BG:       #0D1B2A  (brand navy)

HEADINGS:      Georgia Bold
BODY:          Segoe UI Regular/Semibold
CODE:          Consolas Regular
```
