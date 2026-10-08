# Derek's Roofing: spec website (pitch)

New homepage for **Derek's Roofing** (https://dereksroofing.co.za/), built from the Ridgeback Roofing demo
(`sites/ridgeback-roofing`). Made as a pitch for the owner; not published publicly.

## Source of content
Everything factual comes from their current site (home, gallery, FAQ pages, fetched 2026-10-08):
- Name, tagline "Roofing done right, the first time.", Patrys St, Welgemoed, Cape Town 7530
- 071 250 0125 (call + WhatsApp), Djlou57@gmail.com, Mon–Fri 08:00–17:00, Sat 08:00–13:00
- 6 services, call-out fee outside the Northern Suburbs, Western Cape service area
- 4.8★ from 14 Google reviews, "100% owner on site", reply within 1 business day, inspection usually within a week
- 3 Google reviews quoted verbatim (Reinard Breed, Werner Kohne, Deidre Prout)
- FAQ answers (reworded lightly), materials: tiled, IBR, shingle, flat-roof waterproofing, decking, pergolas
- All photos and the logo are theirs (`/images/*`), converted to WebP. Logo mark cut from logo.jpg.

## Design
- Ridgeback/Autarq system kept (glass nav, pills, rotating hero word, estimator, reviews, dark footer).
- Yellow replaced by their logo blue `#01477a`; ink is their site theme colour `#0f2540`; light blue `#9cc5f0`
  for accents on dark surfaces.
- Gauteng/hail copy rewritten for Cape Town (winter fronts, south-easter, salt air).

## AEO / technical
- JSON-LD: `RoofingContractor` (address, geo, hours, areas, services, rating) + `FAQPage`.
- Form keeps their Netlify Forms setup (`name="contact"`, honeypot, `form-name`), adds a Suburb field.
  On Netlify it posts via fetch and shows the confirmation; opened locally it shows the confirmation only.

## Confirm with Derek before going live
- [ ] Estimator rates (R/m² excl. VAT): tile 550–900, IBR 450–750, shingle 500–800, flat 250–450; strip, site
      costs R5k–15k, options. These are typical market figures, not his prices.
- [ ] "Inspections before you buy or sell", "shops & small commercial", "Cape winter May–August" wording
- [ ] Project captions (types inferred from photos)
- [ ] Hero photo: current is 1280px from their gallery; a sharper wide roof photo would help
