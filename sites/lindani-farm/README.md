# Lindani Farm website

A single-page site for Lindani Farm (Paarl). Open `index.html` in a browser; there's nothing to install.

| File | What it is |
|---|---|
| `index.html` | The page itself |
| `lodge-data.js` | **All editable details**: contact, studios, rates, seasons, availability, activities, policies, concierge answers, translations |
| `features.js` | The booking concierge, date checker, booking request, trip planner, book-direct note and language switcher |
| `features.css` | Styles for those features |
| `assets/` | Photos (AVIF + WebP in several sizes) |
| `BRIEF.md` | Design record, sources, content still to confirm |

## Demo features

Everything runs in the visitor's browser. There's no server, no API keys and no paid service.

1. **Booking concierge** (chat button, bottom right). Answers from the knowledge base in `lodge-data.js` using keyword matching that tolerates typos. When it isn't sure, it offers quick replies and a WhatsApp link. It also:
   - checks dates against the sample calendar and shows free studios with a total price, or the next free dates if the stay is full;
   - collects a **booking request** (not a confirmed booking) and hands it to the farm through WhatsApp, email or copy-paste;
   - remembers the conversation until the browser tab is closed (`sessionStorage`).
2. **Trip planner** (the "Plan your farm days" section). Builds a day-by-day plan from the dates, guests, interests and budget, with an estimated total, and sends it to the farm through WhatsApp or email.
3. **Book-direct note**. Shows the saving compared with Booking.com in the rates block, the concierge, the planner and the enquiry form, worked out from `otaCommissionPercent`.
4. **Language switcher**. English, German, Dutch and Afrikaans for headings, buttons and the concierge greeting. The visitor's choice is remembered on their device. The concierge's detailed answers stay in English.

## Editing `lodge-data.js`

Open the file in any text editor. Everything is labelled.

- **Find the placeholders.** Search for `PLACEHOLDER`. Each one marks sample content: rates, the calendar, activity prices, policies, the email address and directions. Replace the value, then delete the comment.
- **Rates.** Each studio has a `rate` per night in rand. `seasons` raise or lower that rate for date ranges written as `MM-DD`; the festive season wraps over New Year.
- **Availability.** `booked` lists blocked dates per studio. `from` is the check-in date and `to` is the check-out date (that night isn't blocked).
- **Activities.** Each has a time of day (`when`), the interests it suits, prices per adult and child, and `kids: false` if it isn't for children. `days: [6]` limits it to Saturdays (0 = Sunday).
- **Concierge answers.** Edit `concierge.intents`. Add words guests might type to `keywords`. In answers you can use `{phone}`, `{checkIn}`, `{checkOut}`, `{minNights}` and the policy names (`{kids}`, `{pets}`, `{payment}` …).
- **Translations.** Edit `i18n`. Keep the `<em>` and `<br>` tags in headings. The German, Dutch and Afrikaans text should be checked by a native speaker before going live.
- **Email.** Set `contact.email`. Until then, "Send by email" opens with an empty address line.
- **Turn off the demo labels.** Set `showDemoNotice: false` once all sample data is replaced. Also remove the "Sample rates" badge and the "Demo planner" note from `index.html`.

If the page stops working after an edit, check for a missing comma or quote mark in `lodge-data.js`. Opening the browser's developer console shows the line.

## Connecting real services later

| Feature | Now | Later |
|---|---|---|
| Concierge answers | Keyword matching over `lodge-data.js` | Send the guest's question and the same knowledge base to an AI model (for example Claude) through a small server function, so the API key never sits in the page. Keep the keyword answers as a fallback. |
| Availability | `booked` list in the data file | Read the farm's real calendar: an iCal feed exported from Booking.com, Airbnb or Google Calendar, or a channel manager or booking engine (NightsBridge is common in South Africa). A small server function can turn the feed into the same `booked` format. |
| Booking requests | Pre-filled WhatsApp message, email or copy-paste | Use the WhatsApp Business Platform (Cloud API) to receive requests automatically, send auto-replies and confirmations, and post to the owner's phone. Or post to a form service or the booking engine. |
| Deposits | Explained in text only | A payment link from PayFast, Yoco or Peach Payments in the confirmation message. |
| Translations | Fixed text in `i18n` | Machine-translate the concierge's answers or keep human-checked text per language. |
