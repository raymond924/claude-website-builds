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
- [ ] Estimator rates (R/m² excl. VAT, supply and fit incl. battens, underlay, ridges, flashings): concrete R550–850,
      clay R650–1 000, IBR/metal R450–750, slate R1 100–1 700; strip R50–100; site costs R6k–18k; insulation R45–120;
      timber repairs R240–450 on 25% of roof; steep pitch ×1.2; VAT 15%. Sources: 2025–26 Gauteng guides
      (buildingcostpersquaremeterpretoria.co.za, rswarehouse.co.za, roofing-guarantee.co.za). Floor→roof area ×1.15/1.3/1.55 by pitch.
- [ ] Guarantee length (15 years), response times (24 h / 48 h), Roof Care Plan price (R1 950)
- [ ] Project captions and suburbs (illustrative only)
- [ ] Accreditations / memberships to show (none claimed in the demo)

## Performance

All photos are WebP; the hero ships 900/1600/2400 px via `srcset` and is preloaded; material thumbnails are 200 px.
Audit (Playwright, local): LCP 0.24–0.48 s, CLS ≤0.002, about 1 MB on first load, no console errors, no horizontal scroll at 390/768/1280/1440.

## Photos

All CC0 (public domain) via [Openverse](https://openverse.org), from rawpixel and StockSnap; sources in
`assets/credits.json`. Rawpixel's 1300px renditions carry a watermark, so only the clean 1024px renditions are used
(the hero is upscaled to 1920 px). Two slots are AI-generated with Higgsfield Seedream 5.0 Flash (2K, 0.5 credits each, free plan): `hero-*.webp` and `hail-repair-*.webp`. The rest stay CC0 stock until more credits are available.

| Slot | File | Shot |
|---|---|---|
| Hero (AI) | hero-*.webp | Face-brick Joburg home, charcoal tile roof, storm and lightning at blue hour |
| Re-roofing, project | crew-tiles.webp | Two roofers re-tiling beside a chimney |
| Storm repairs | storm.webp | Tiled roof torn open |
| Waterproofing | gutter-rain.webp | Gutter in a downpour |
| Solar-ready | solar.webp | Panels on a dark tiled roof |
| Materials | tile-colours.webp, metal.webp, slate.webp, project-gable.webp | Material close-ups |
| Storm band (AI) | hail-repair-*.webp | Roofer in harness replacing a hail-cracked tile, hailstones in gutter, skyline |
| Projects / CTA | project-gable.webp, project-edge.webp | Modern roofs |
| Care plan | tools.webp | Tool belt on a roof |

Best upgrade for a real client: their own drone shots of finished roofs and crew portraits.

## UI/UX Pro Max review (2026-10-07)

Ran [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) v2.13 (`--design-system` for "roofing contractor
home services trust", plus `landing` and `ux` domain searches). Its pattern, "Trust & Authority + Conversion", matched the
page (proof, transparent pricing, low-friction form, visible contact). Its generic palette (blue/orange, Poppins) was not
adopted because the user's Autarq reference wins. Applied from its rules:
- Auto-rotating hero word: pause/play button, pauses on hover and when the tab is hidden, off under reduced motion.
- Forms: inline error under each field (aria-describedby), validation on blur, error count message.
- Reviews section: aggregate rating + breakdown, featured review, card slider with prev/next (no autoplay), CTA after proof.
  Reviews are labelled sample content; on a client site they should come from the client's real Google reviews.
