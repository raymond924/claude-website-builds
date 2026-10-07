# COOK Engineering design system: "Concentrate"  (DRAFT, awaiting approval)

COOK's own style. It keeps T1's discipline (light type, rounded media, colourless interface) and adds two
things only COOK has: the **Brix scale** and **falling-film line drawings**. The idea in one line:
*the interface is stainless steel; the only colour is the fruit, and the product of the business is concentration.*

## Colour

| Token | Value | Role |
|---|---|---|
| `--steel` | `#ffffff` | Page canvas (like T1's white) |
| `--pulp` | `#f2f1ec` | One full-width band per page (evaporator section) and panel backgrounds |
| `--ink` | `#2b2a28` | Text, outlined buttons, hairlines |
| `--muted` | `#86847f` | Secondary text, mono captions |
| `--onyx` | `#0f0f10` | Footer only |
| `--glass` | `rgba(24,24,24,.5)` | Pills over media (nav, location pills, toggle) |
| `--peel` | `#e8731a` | **Brix marker only.** Max two uses per screen. Never text, never a button, never a background. |

Saturated colour otherwise comes only from photography (fruit, sea, orchards).

## Type

| Role | Face | Size / weight | Notes |
|---|---|---|---|
| Label | Geist Mono | 12px / 400, uppercase, +0.08em | Preceded by a 4px square |
| UI | Geist | 14px / 400 | Nav, buttons, captions |
| Statement | Geist | 24px and 32px / 300 | Section text in the right half |
| Display | Geist | 56px hero, 96px statistics / 300 | Line-height 1.0 |

No weight above 400. Geist and Geist Mono replace T1 Sans and T1 Sans Mono, so COOK gets its own voice.

## Layout

- 1440 reference width. Content sections: label at the left edge (48px gutter), text column starts at 50%.
- Media tiles: 8px from the viewport edge, 8px gap, **64px radius** (COOK's own radius, softer than T1's 80px).
- Hero: full-bleed video, bottom corners 64px.
- Section padding 72–120px. At least 40% empty canvas per screen outside the hero.

## Signature graphics

1. **Brix scale.** A thin horizontal rule with tick marks every 5 units from 0 to 65 °Brix, numbered in
   Geist Mono at 0, 10, 20 … 65. One `--peel` marker shows a value. It is used as the hero's progress
   indicator, as the divider above the statistics, and as the evaporator section's stage indicator
   (12 °Brix feed → 65 °Brix concentrate). Drawn in SVG, 1px `--ink` lines.
2. **Falling-film line drawings.** Vertical tube bundles drawn as 1px lines with a thin film running down
   them. Used in the evaporator accordion and as the footer's oversized mark (the word COOK built from
   tubes). Monochrome only.

## Photography and video (Higgsfield)

- Documentary industrial: stainless steel, daylight, cool neutral grade, no posed people, no text in frame.
- Fruit, sea and orchards are the only saturated subjects. No orange cast on steel.
- Product imagery: the COOK evaporator as an isolated object on a plain light background.
- Hero video: slow, steady camera move; loops cleanly; nothing happens faster than about 1 second.

## Components

- Nav: logo left (white), dark glass pill right, links 14px. The logo is never inside or clipped by the pill.
- Case-study card (hero only): `--glass` card, 12px radius, 16px padding, mono "CASE STUDY" label, one-line
  14px result, small thumbnail with 8px radius on the right. The one place a glass surface is a card, not a pill.
- Buttons: outlined pill (1px `--ink`), 14px; filled pill only for the main hero action.
- Location pill over media: glass pill with the place name plus a 32px circular arrow button.
- Toggle: two-option glass segmented control (Evaporator / Concentrate).
- Accordion: 22px rows, 1px hairlines, 40px circular +/− button, mono subtitle on the open row.
- Statistics: 96px light numerals, mono caption underneath.
- News/insights cards: square-cornered images, mono date, 24px light title.
- Footer: onyx, numbered mono link index (1.1, 1.2 …), oversized tube-drawn COOK mark.
