# COOK Engineering: website brief and design record

## Brief

```text
Designing a marketing homepage for COOK Engineering, for owners and plant managers of
citrus and fish factories in South Africa and neighbouring countries, on web (desktop + phone).
Goal: get a qualified enquiry (evaporator, plant project, audit).
Tone: precise, calm, industrial, trustworthy. Engineers, not salespeople.
Main objection/risk: "Will this firm understand my plant and my season?"
Must remember: COOK builds its own citrus juice evaporators.
Constraints: South African English, metric units; no real photos yet (placeholders).
Research needed: styles (visual direction). Screens/flows not needed for a one-page site.
Path: direct build from a user-selected reference.
```

| Question | Answer (from the client) |
|---|---|
| Company | COOK Engineering |
| What they do | Engineering consultancy for fruit (mainly citrus) and fish factories; they sell evaporators |
| Evaporator type | Juice concentrators |
| Region | South Africa and neighbouring countries |
| Photos | Placeholders for now |
| Scope | Homepage only |
| Other examples | Comparison page only |

## Research

Source: [Refero Styles](https://styles.refero.design). Full DESIGN.md files are saved in `design-references/`.

| Style | Role | Why |
|---|---|---|
| [T1 Energy](https://styles.refero.design/style/e79b761d-f476-4c5d-8943-e31a58664e4d) | **Primary (chosen by client)** | Industrial manufacturing brand, monochrome, photography-led, calm authority |
| [ON.energy](https://styles.refero.design/style/31e00a99-6946-4f07-829a-b0904a39a20d) | Alternative | Same light-weight type idea, but bold yellow/black signage blocks |
| [teenage engineering](https://styles.refero.design/style/aecf9dda-5cba-4dc7-9e73-59b65d895cdf) | Alternative | Product-catalogue approach; fits if evaporators become the hero product |

## Reference lock

```text
Primary reference: T1 Energy
Preserve: vellum #f0efe9 canvas; carbon #322d2a text/buttons/nav; weight-300 display at ~52px,
          line-height 1.0; 80px-radius image portholes; 4px square before every section label;
          dark floating nav pill; onyx #0f0e12 footer only.
Borrow only: nothing. Single-source direction, kept intact on purpose.
Role rules: carbon = text, borders, filled buttons, nav pill. White = elevated surfaces, never CTA.
            Onyx = footer only. Mercury = muted text. No accent colour at all.
Media strategy: full-bleed industrial documentary photography (placeholders with shot notes for now);
                one isolated product render of the evaporator on the vellum canvas.
Reject: accent colours, gradients, shadows, bold headlines, icons/emoji in labels, radius < 8px.
Token commitments: see :root in index.html.
```

## Decision ledger

| Decision | Source | Rule / role | Why |
|---|---|---|---|
| Vellum canvas, carbon text, no accent | T1 DESIGN.md | "absence of color is the design" | Lets future plant photos carry all the colour |
| Inter 300/400 | T1 DESIGN.md | Substitute for T1 Sans: "Inter or Söhne" | Closest freely available match |
| Hero: full-bleed photo, headline bottom-left, case-study card bottom-right | T1 Hero Overlay + Case Study Card | Card = carbon, 12px radius, map thumbnail | Puts a real result (evaporator upgrade) in the first view |
| Floating dark nav pill, logo outside it | T1 Pill Navigation | 16px radius, white 14px links | Signature move; collapses to a Menu pill on phones |
| Two-up image pair after mission | T1 Image Card + Layout | 80px radius, no frame | T1's section rhythm |
| Evaporator section: render left, accordion right | T1 technology section (render + accordion) | 40px circle +/− buttons, carbon hairlines | Same pattern T1 uses for its TOPCon cell, applied to COOK's own product |
| Evaporator stages as numbered accordion | Client brief + process reality | Numbers = real process order | Feed → pasteurise → effects → aroma recovery → cooling is a true sequence |
| Spec tiles (°Brix, t/h, effects, 316L) | Craft: subject-specific detail | White surface, 12px radius | Real units buyers compare evaporators on |
| Placeholder slots keep radius + aspect ratio + shot note | Refero rule: preserve media role | Never fake photos with CSS art | Swapping in photos later changes no layout |
| Single light theme | T1 is light-only | Deliberate, not omission | Matches reference |

## Content to confirm with COOK

Everything below is a believable placeholder. Replace before launch.

- [ ] Street address, phone number, email (`info@cookengineering.co.za` is a guess)
- [ ] Evaporator figures: 65 °Brix, 2–25 t/h water evaporation, 4–7 effects, TVR option, 316L
- [ ] The three projects (Sundays River Valley evaporator, Western Cape fishmeal, Limpopo lemon plant), results and years
- [ ] Services list (plant design, evaporators, project engineering, audits, training)
- [ ] Fish services: fishmeal/fish oil scope is assumed
- [ ] Countries and regions served
- [ ] Logo (currently a typed "COOK" wordmark)
- [ ] Contact form destination (form currently does not send)
- [ ] Homepage statistics: 40+ plants and evaporators commissioned, 180 t/h water evaporation installed, 7 countries
- [ ] Location tiles: Sundays River Valley (citrus) and Walvis Bay (fish) as representative sites
- [ ] Hero case study line: concentrate output doubled on the existing boiler, Sundays River Valley
- [ ] Stage Brix values in the technology accordion (12, 12, 45, 58, 65 °Brix)
- [ ] Insights articles (four titles and dates are placeholders, no article pages exist)

## Photo shot list

| Slot | Shot |
|---|---|
| Hero (full-bleed, landscape) | Stainless-steel evaporator or citrus extraction line inside a working plant, natural light |
| Mission pair, left (square) | Citrus fruit on an inspection conveyor, overhead |
| Mission pair, right (square) | Fishmeal cooker and twin-screw press, wide interior |
| Evaporator render (square) | COOK falling-film evaporator, isolated 3/4 view, no background |
| Industries, citrus (16:11) | Juice extractors in a row |
| Industries, fish (16:11) | Fishmeal dryer and conveyors |
| Projects ×3 (square) | One photo per project |
| Where we work (square) | Aerial of citrus orchards, or a line map of southern Africa |

To add a photo, replace the `<figcaption>` inside a `.ph` figure with an `<img>` using
`object-fit: cover; width: 100%; height: 100%`. For the hero, set the photo as the `.hero` background.
