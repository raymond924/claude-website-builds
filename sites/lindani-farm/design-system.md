# Lindani Farm design system

Grafton Safaris layout grammar, in Lindani's own colours and type. Source: reference lock in `BRIEF.md`.

## Colour (roles are rules)

| Token | Value | Role |
|---|---|---|
| canvas | #FAF9F8 | Page background. Always. |
| panel | #F0F1EF | Form fields, quiet panels, rates block |
| sage | #DCDED8 | Text cards beside photos (the "On the farm" stack) |
| line | #D3D5CF | Hairlines, input borders in the concierge |
| ink | #1F241A | Text |
| muted | #575C4F | Secondary text (≥4.5:1 on canvas, panel and sage) |
| faint | #868B7E | Only the inactive names in the "Nearby" list |
| olive | #2C341F | Dark band, footer, concierge header and launcher, selected calendar dates |
| gold | #E8C27B | **Booking actions only**: nav "Book your stay", form submit buttons, "Request …" buttons, the concierge send button. Text on gold is olive. Also the italic accent in headings on dark/photo backgrounds. |

- No other saturated colour. No blues, no orange.
- Error text #A5462B (on light) / #FFC2AD (on dark).
- Gold buttons: at most two per screen. Savings notes are plain muted text, never gold.

## Type

- **Display:** Cormorant 400 (500 for small serif titles), with one italic phrase per major heading as the accent. h1 50–112px, h2 44–84px (clamp). Line-height 1. Never bold. (Changed from Playfair in design-loop round 1: Grafton's display face is thin and high-contrast.)
- **Body/UI:** Satoshi (self-hosted, 400/500/700). Body 16px, line-height 1.7.
- **Labels:** Satoshi 12px, 600–700, uppercase, letter-spacing 0.12–0.14em. Tags use "( TEXT )" in brackets.
- Minimum text size 12px (the logo's small "FARM" lettering excepted).

## Shape and space

- Large panels (hero, olive band, closing form, footer) are inset 12px from the viewport (8px on phones) with a 16px radius.
- Photos and cards: 12px radius. Buttons and fields: 8px radius. Chips and the concierge launcher: fully round.
- The nav is a floating white bar inset from the edges, 12px radius, links centred, one gold CTA on the right.
- Section padding 96–120px desktop, 64–80px phone. Content max-width 1200px with 48px gutters (20px on phones).
- No drop shadows except: the nav once scrolled, the concierge panel and launcher, and the calendar pop-up.

## Components

- **Secondary link:** "Label" + a 44px circle outline with an arrow. Never a bare underlined link, except phone numbers inside sentences.
- **Forms:** borderless panel-grey fields, 52px tall, with uppercase labels above. Errors sit directly under the field. On a dark photo panel (the closing form) fields are borderless white at 14% opacity with white text, as on Grafton.
- **Date checker:** a white card (16px radius) that overlaps the bottom edge of the hero by about 140px (64px on phones), showing free studios for the next weekend on load.
- **Date fields:** a button showing the date, opening the range calendar (never a typed date).
- **Nearby list:** large serif names; the active one is ink, the others faint; "( TAG )" on the right.
- **On the farm stack:** a sage text card (tag at the top, title and body at the bottom) beside a photo of equal height. Cards stick and tilt slightly as the next one arrives.
- **Footer:** an olive rounded panel, phone and email in the display serif, a circled up-arrow (72px, 56px on phones).

## Photography

Only Lindani's own photographs. No illustrations or CSS art in place of photos. No text baked into images.
