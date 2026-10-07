# Ridgeback Roofing: website brief and design record

A **demo concept** homepage for a fictional Gauteng roofer. Its job is to show roofing companies what an
AI-assisted build can look like, so they hire us for their own site.

## Brief

```text
Designing a marketing homepage for a (fictional) residential + commercial roofer on the web.
Goal: visitor books a free roof inspection, or uses the estimator and then books.
Tone: premium, calm, trustworthy; more "design studio" than "bakkie and ladder".
Main objection/risk: roofers are seen as unreliable and opaque on price.
Must remember: the live roof estimator and the "Roofs built for hail / summers / generations" hero.
Constraints: South African English, Rand, metric units, Gauteng weather terms; free stock photos.
Research needed: one real reference site (Autarq), no Refero.
Path: direct build.
```

| Question | Answer |
|---|---|
| Company | Invent one → **Ridgeback Roofing** (a ridge is a roof part; the ridgeback is a southern African dog) |
| What they do | Re-roofing, hail & storm repairs, waterproofing & gutters, solar-ready roofs |
| Region | South Africa, Gauteng (Johannesburg, Pretoria, East Rand) |
| Photos | AI-generated first, free stock if that isn't possible → **free CC0 stock** (see below) |
| Scope | Homepage only |
| Comparison examples | Not asked; one reference supplied by the user |

## Research

| Reference | Role | Why |
|---|---|---|
| [Autarq](https://www.autarq.com/en-de/) | Primary (user's choice) | German solar-roof-tile brand: calm, product-led, premium roof photography |

Captured from the live page's HTML and inline styles (its imagery was reviewed but not copied into the repo):
- Ink `#101920`, white canvas, sun yellow `#fff365` / pale `#f9f399`, shimmer gradient
  `linear-gradient(to right,#f9f399 30%,#fff365 40%,#f9f399 50%)`.
- Pastel card gradients `#fbacb3→#f9f399` and `#b7c7d6→#e5c7c7`.
- Font TT Firs Neue, weight 500 almost everywhere, tracking −0.02 to −0.03em, hero title 76px, line-height 1.
- Radii: 999px pills, 8px media; translucent grey chips `#6666661a`, glass nav `#ffffffcc`.
- Structure: full-bleed hero with rotating word ("Next Level life. / Roofs."), "We are Autarq" intro with three
  value props, four image tiles, "Autarq for: Homeowner / Roofer / Architect" cards, Solar Configurator (phone
  mock-up), product feature, "Next Level Impact", Academy, consultation CTA, footer.

## Reference lock

```text
Primary reference: Autarq.
Preserve: white canvas + #101920 ink; #fff365 as the only accent; 500 weight with negative tracking;
  999px pills and 8px media radius; glass pill nav; rotating hero word; "X for: audience" pastel cards;
  configurator-in-a-phone card; shimmer gradient.
Borrow only: section order and rhythm, not copy or imagery.
Role rules: yellow = CTAs, highlights, the estimator. Pastel gradients only on the three audience cards.
  Dark ink sections used once (storm) plus the estimator output and contact card.
Media strategy: real photography in every media slot; no CSS art.
Reject: solar/climate-tech messaging, German awards strip, crowdinvesting.
Token commitments: see :root in index.html.
```

## Decision ledger

| Decision | Source | Why |
|---|---|---|
| Manrope 500/600 | Font substitute for TT Firs Neue | Closest free geometric grotesk with the same calm, open feel |
| Hero "Roofs built for hail. / summers. / generations." | Autarq rotating hero word | Same device, roofing-specific message |
| Autarq configurator → **Roof estimator** | Autarq Solar Configurator | Interactive, shows web skills, converts to "fixed quote" |
| "Autarq for" → "Ridgeback for: Homeowners / Estates & body corporates / Commercial" | Autarq audience cards | SA buyers: homeowners, sectional-title trustees, facilities |
| "Next Level Impact" dark band → "Insurance claims, handled." | Autarq impact section | Hail claims are the biggest Gauteng roofing driver |
| Academy → Roof Care Plan | Autarq Academy teaser | Recurring revenue offer a roofer can actually sell |
| Numbered steps only in the process | Craft rule | Real sequence |
| Form says it doesn't send | Skill rule | Demo honesty |

## Content to confirm (if a real roofer adopts this)

- [ ] Company name, logo, phone, email, address, hours (all placeholders now)
- [ ] Estimator rates per m² (demo: concrete R650–950, clay R1 100–1 600, metal R550–850, slate R1 800–2 800, incl. VAT)
- [ ] Guarantee length (15 years), response times (24 h / 48 h), Roof Care Plan price (R1 950)
- [ ] Project captions and suburbs (illustrative only)
- [ ] Accreditations / memberships to show (none claimed in the demo)

## Photos

All CC0 (public domain) via [Openverse](https://openverse.org), from rawpixel and StockSnap; sources in
`assets/credits.json`. Rawpixel's 1300px renditions carry a watermark, so only the clean 1024px renditions are used
(the hero is upscaled to 1920 px). Higgsfield AI generation was not possible in this session (CLI install blocked).

| Slot | File | Shot |
|---|---|---|
| Hero | hero.jpg | Steep-pitched house at dusk, lit windows |
| Re-roofing, project | crew-tiles.jpg | Two roofers re-tiling beside a chimney |
| Storm repairs | storm.jpg | Tiled roof torn open |
| Waterproofing | gutter-rain.jpg | Gutter in a downpour |
| Solar-ready | solar.jpg | Panels on a dark tiled roof |
| Materials | tile-colours.jpg, metal.jpg, slate.jpg, project-gable.jpg | Material close-ups |
| Storm band | roofer.jpg | Roofer in hard hat hammering |
| Projects / CTA | project-gable.jpg, project-edge.jpg | Modern roofs |
| Care plan | tools.jpg | Tool belt on a roof |

Best upgrade for a real client: their own drone shots of finished roofs and crew portraits.
