# Lindani Farm: website brief and design record

## Brief

```text
Designing a one-page homepage for Lindani Farm, a self-catering farm stay just outside Paarl, Western Cape.
Goal: a guest sees the four studios and the farm, understands where it is, and sends an enquiry or calls/WhatsApps reservations.
Tone: slow, warm, golden-hour; "a farm stay made for slowing down".
Main objection/risk: a small, new place with no reviews online; the site must feel real (own photos, real number, honest facts).
Must remember: "Leave the city at the gate." Tree-lined road in, a mountain at the end of it.
Constraints: South African English, R / km, +27 phone format. Client's own Instagram photos. No invented prices, address or email.
Research needed: one reference site (Grafton Safaris) + Lindani's Instagram.
Path: direct build in the reference's layout, Lindani's brand colours.
```

| Question | Answer |
|---|---|
| Company | Lindani Farm (Instagram [@lindanifarm](https://www.instagram.com/lindanifarm/)) |
| What they do | Four private self-catering units on a farm just outside Paarl, Cape Winelands |
| Signature offer | Your own studio: crisp white linen, fully equipped kitchenette, en-suite bathroom, private patio. Pool, dam, garden braai spots, tree-lined drive |
| Region | Paarl, Western Cape. Reservations 083 291 6790 (from Instagram) |
| Photos | Lindani's own Instagram photos, cropped to text-free areas |
| Scope | Homepage only |
| Comparison examples | Skipped: the user named one reference site |

## Sources

- **Instagram @lindanifarm** (11 posts, read 2026-10-10). All facts on the site come from these captions and photos:
  - "Lindani Farm, just outside Paarl. Four private self-catering units, close to Fairview, Nederburg and Franschhoek."
  - "Spend your days tasting at Fairview and Nederburg, hiking the nature reserve or browsing the weekend markets. Then come home to Lindani. Your own private self-catering unit on a farm near Paarl, with quiet evenings and nothing to rush for."
  - "Golden hours, pool days and braai nights." "Wedding venues, top schools, wine farms and mountain trails, all just down the road. Stay close. Stay at Lindani."
  - Carousel: "Leave the city at the gate. A tree-lined road in, a mountain waiting at the end of it." / "Mountain air. Still water. Cool off in the dam and watch the cliffs turn gold." / "Long, lazy afternoons. A sparkling pool in the shade of the old trees." / "Coffee by day, braai by night. Garden spots with a built-in braai." / "Come home to your own studio. Crisp white linen · Fully equipped kitchenette · En-suite bathroom · Private patio" / "Your farm escape starts here."
  - Taglines: "Taste, explore, and wander nearby." "All the comforts of home, only better." "Plan less, explore more."
- Web search found no other listing, website, address or rates for Lindani Farm (Paarl). The Lindani Game & Lodges in the Waterberg, Limpopo is a different business.

## Research

| Reference | Role | Why |
|---|---|---|
| [Grafton Safaris](https://www.graftonsafaris.com/) | Primary (user's choice) | Look and feel to model. Screenshots in `design-references/grafton-*.jpg` |
| Lindani Instagram | Brand source | Colours, type mood, photos, copy. `design-references/lindani-instagram.jpg` |

## Reference lock

```text
Primary reference: Grafton Safaris (graftonsafaris.com), captured 2026-10-10 at 1440 and 390.
Preserve: warm off-white canvas (#FAF9F8); large light display serif with an italic accent word
  ("The Grafton *Experience*"); small sans body with generous line height;
  floating white rounded nav bar with a filled CTA on the right; full-bleed rounded inset hero
  (12px from the edges) with the headline bottom-left and a circled down-arrow; quick enquiry form
  straight under the hero; intro text in two columns on a pale panel; the big faint serif list
  with tiny "( REGION )" labels and an "All packages ⟶" circled-arrow link; a dark gradient band
  with italic headline; the "Top Destinations (SCROLL)" stacked cards (sage text card + photo card);
  rounded photo panel with a form ("An experience you'll never forget"); charcoal rounded footer
  with phone/email set in the display serif and a circled up-arrow.
Borrow only: the 8px button radius and 16px/24px button padding.
Role rules: the CTA colour is used only for booking actions (nav button, form submit, "Book your stay").
Media strategy: Lindani's own photographs only, never CSS art. Hero uses the tree-lined avenue.
Reject: Grafton's orange (#E77728) and its blog/news section (Lindani has no articles).
Token commitments: canvas #FAF9F8, panel #F0F1EF, sage card #DCDED8, ink #1F241A,
  olive #2C341F (dark band + footer, Lindani's brand colour in place of Grafton's #222),
  gold #E8C27B (CTA fill and italic accents on dark, Lindani's brand gold in place of the orange).
  Display: Playfair Display 400 + italic (stands in for Grafton's proprietary "seasons" and matches
  Lindani's own Instagram headlines). Body/UI: Satoshi, self-hosted (client's choice, 2026-10-10; replaces Grafton's Work Sans).
```

## Decision ledger

| Decision | Source | Rule / role | Why |
|---|---|---|---|
| Layout, spacing, radius, nav, hero, form, stacked cards, footer | Grafton | Preserve | User asked to model its look and feel |
| Orange CTA → Lindani gold with olive text | Lindani Instagram ("Book your stay" button is gold) | Keep the CTA role, swap the colour | Client brand; gold on olive matches their posts |
| Charcoal footer/band → Lindani olive #2C341F | Lindani Instagram slide backgrounds | Same role as Grafton's #222 | Client brand |
| Playfair Display for "seasons" | Grafton type role + Lindani headline style | Display serif with italic accent | "seasons" isn't on Google Fonts |
| Packages list → "Taste, explore and wander nearby" (Fairview, Nederburg, Franschhoek, Paarl Mountain, weekend markets, wedding venues) | Instagram captions | Same faint list + ( TAG ) labels | These are the places Lindani names itself |
| "Top Destinations" stacked cards → "On the farm" (pool, dam, garden braai, studios) | Instagram carousel | Same sticky stack with tilt | Lindani has its own photos of these; none of the nearby places |
| Booking form → enquiry with name, studio count, arrival, nights | Grafton form fields | Same position | No booking engine; enquiries go by phone/WhatsApp until the form is wired up |
| News & tips section dropped | — | Reject | No content to fill it honestly |
| WhatsApp link on the reservations number | Instagram lists a cell number | Craft | Most SA guests book this way. Confirm the number takes WhatsApp |

## Content to confirm with client

- [ ] Email address for enquiries (none shown; site uses `[email address]`).
- [ ] Street address / farm name and exact distance to Paarl, Cape Town and Cape Town International (site says "just outside Paarl" and "about an hour from Cape Town").
- [ ] Is 083 291 6790 also on WhatsApp?
- [ ] Rates, minimum stay, check-in/out times, sleeps how many per studio (site shows none).
- [ ] Are the four units all identical studios, or different? Names for them? (site calls them Studio One to Four).
- [ ] Pool and dam: shared by all guests? Swimming in the dam allowed (Instagram says "cool off in the dam")?
- [ ] Wi-Fi, air-conditioning (a unit is visible in a photo), parking, pets, children, load-shedding backup.
- [ ] Which nature reserve ("hiking the nature reserve"): Paarl Mountain Nature Reserve is assumed.
- [ ] The cliffs in the photos: which mountain? (site doesn't name it).
- [ ] Logo file (site uses a typeset wordmark "LINDANI / FARM" copied from the Instagram posts).
- [ ] Permission to use the Instagram photos on the website (they are the client's own).

## Photo shot list

Current images are cropped from Instagram (1080 px wide, so slightly soft at full width). Originals at full size would fix that.

| Slot | Now | Ideal |
|---|---|---|
| Hero | `avenue.jpg` tree-lined drive, mountain | Same shot, original file, landscape, ≥2400 px |
| Olive band | `golden.jpg` | Original |
| Studios | `studio-bed.jpg`, `studio-kitchen.jpg`, `studio-patio.jpg` | One photo per studio + bathroom |
| Farm cards | `pool.jpg`, `dam.jpg`, `braai.jpg`, `cottages.jpg` | Originals, landscape |
| Intro panel (2) | `sunset.jpg` | Wider sunset over the vineyards |
| Final form | `avenue.jpg` again as a bookend | A different evening shot of the farm |

## UI/UX audit (2026-10-10, ui-ux-pro-max skill)

Automated checks at 375, 768, 1024, 1440 and phone landscape (scripts in the session scratchpad; rules from
`.claude/skills/ui-ux-pro-max/references/quick-reference.md`). The skill's `--design-system` suggestion
("Liquid Glass", navy/blue) was rejected: it doesn't fit the locked Grafton reference.

| Area | Found | Fixed |
|---|---|---|
| Contrast | Faint "Nearby" list 1.65:1; tags on sage 4.49:1; gold text over photo in the olive band; final-form overlay too light | Faint #868b7e (3.3:1, large text); muted #575c4f; band photo moved right with an olive fade; darker overlay. All text now passes AA |
| Text size | Labels 8–10px; body 14px on phones | Labels/tags 12px; body 16px; supporting text 14–16px (logo "FARM" lettering excepted) |
| Keyboard | No skip link; form fields had no focus ring; Esc didn't close menu | Skip link; 3px focus ring on fields; Esc and outside-click close the menu and return focus |
| Tap targets | Nav, footer, social links and logo under 44px | All 44px+ (inline links inside sentences excepted) |
| Forms | One shared error line; no aria-describedby; departure could equal arrival; phone/email not checked | Error under each field, linked with aria-describedby; validates on blur, clears on input; departure min = arrival + 1; phone/email check; "Sending…" state |
| Navigation | No current-section state | Current section underlined in the nav (aria-current) |
| Performance | JPEGs with no dimensions; scroll handler mixed reads/writes and animated `filter` | WebP (~30% smaller) with width/height; reads batched before writes, transform only |
| Layout | — | No horizontal scroll at any width; no console errors |

Known and left as is: the tiny "FARM" wordmark (a logo, exempt) and the smooth-scroll page behaviour (it switches off under reduced motion).
