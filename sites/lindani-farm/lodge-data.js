/* ==========================================================================
   LINDANI FARM: SITE DATA
   This is the only file the owner needs to edit. Everything the booking
   concierge, trip planner, rates table, book-direct note and language
   switcher show comes from here.

   - Anything marked  PLACEHOLDER  is sample content. Replace it with the
     real detail, then delete the comment.
   - Dates are written YYYY-MM-DD. Money is in rand, whole numbers, no "R".
   - Keep the commas and quote marks as they are. If the page stops working
     after an edit, a missing comma or quote is the usual cause.
   ========================================================================== */
window.LODGE = {

  name: "Lindani Farm",
  // Shown as a small notice in the concierge and planner while sample data is in use.
  // Set to false once every PLACEHOLDER below has been replaced.
  showDemoNotice: true,

  contact: {
    phoneDisplay: "083 291 6790",          // from the farm's Instagram
    phoneInternational: "+27832916790",
    whatsapp: "27832916790",               // country code + number, no + or spaces
    email: "",                             // PLACEHOLDER: e.g. "stay@lindanifarm.co.za". Leave "" until real.
    area: "Just outside Paarl, Western Cape",
    address: "[Street address], Paarl",    // PLACEHOLDER
    mapsLink: ""                           // PLACEHOLDER: paste a Google Maps link to the gate
  },

  currency: { code: "ZAR", locale: "en-ZA" },

  booking: {
    minNights: 2,                          // PLACEHOLDER
    maxNights: 30,
    checkIn: "14:00",                      // PLACEHOLDER
    checkOut: "10:00",                     // PLACEHOLDER
    depositPercent: 50,                    // PLACEHOLDER
    // Book-direct note: online travel agents charge the lodge a commission,
    // so their price for the same stay is usually set higher. The saving shown
    // = direct price ÷ (1 − commission) − direct price.
    otaName: "Booking.com",
    otaCommissionPercent: 15               // PLACEHOLDER: use your real commission rate
  },

  // Nightly rates are multiplied by the season that night falls in.
  // "from"/"to" are MM-DD and may wrap over New Year.
  seasons: [
    { name: "Festive season", from: "12-15", to: "01-10", multiplier: 1.3 },  // PLACEHOLDER
    { name: "Winter",         from: "06-01", to: "08-31", multiplier: 0.85 }  // PLACEHOLDER
  ],

  // The four self-catering studios. Names, beds, sizes and rates are PLACEHOLDERS:
  // Instagram confirms four private units with linen, kitchenette, en-suite and patio.
  rooms: [
    { id: "studio-1", name: "Studio One",   maxAdults: 2, sleeps: 2, rate: 1250, bed: "Queen bed",
      blurb: "Garden-facing studio with a private patio.", placeholder: true },
    { id: "studio-2", name: "Studio Two",   maxAdults: 2, sleeps: 2, rate: 1250, bed: "Queen bed",
      blurb: "Quiet corner studio, close to the pool.", placeholder: true },
    { id: "studio-3", name: "Studio Three", maxAdults: 2, sleeps: 2, rate: 1350, bed: "King or twin beds",
      blurb: "Upstairs studio with mountain views.", placeholder: true },
    { id: "studio-4", name: "Studio Four",  maxAdults: 2, sleeps: 4, rate: 1450, bed: "Queen bed + sleeper couch for two children",
      blurb: "Family studio with room for two children.", placeholder: true }
  ],
  amenities: ["Crisp white linen and towels", "Fully equipped kitchenette", "En-suite bathroom", "Private patio",
              "Shared pool and garden braai spots"],

  // Mock availability calendar. Each entry blocks a studio from "from" (check-in)
  // up to but not including "to" (check-out). PLACEHOLDER: replace with real bookings,
  // or later connect a live calendar (see README).
  booked: [
    { room: "studio-1", from: "2026-10-16", to: "2026-10-19" },
    { room: "studio-2", from: "2026-10-16", to: "2026-10-18" },
    { room: "studio-3", from: "2026-10-23", to: "2026-10-26" },
    { room: "studio-4", from: "2026-10-30", to: "2026-11-02" },
    { room: "studio-1", from: "2026-11-13", to: "2026-11-16" },
    { room: "studio-2", from: "2026-11-13", to: "2026-11-16" },
    { room: "studio-3", from: "2026-11-13", to: "2026-11-16" },
    { room: "studio-4", from: "2026-11-27", to: "2026-11-30" },
    { room: "studio-1", from: "2026-12-18", to: "2027-01-03" },
    { room: "studio-2", from: "2026-12-20", to: "2027-01-02" },
    { room: "studio-3", from: "2026-12-24", to: "2026-12-28" },
    { room: "studio-4", from: "2026-12-26", to: "2027-01-05" },
    { room: "studio-3", from: "2027-02-12", to: "2027-02-15" }
  ],

  // Interests the trip planner offers. Keys are used in activities below.
  interests: [
    { id: "game",    label: "Game drives" },
    { id: "birding", label: "Birding" },
    { id: "farm",    label: "Farm life" },
    { id: "relax",   label: "Relaxing" },
    { id: "romance", label: "Romance" }
  ],

  // Activity budget per person per day for the planner (activities only, not the room).
  budgets: [
    { id: "easy",    label: "Easy on the wallet", perPersonPerDay: 300 },
    { id: "comfort", label: "Comfortable",        perPersonPerDay: 1000 },
    { id: "treat",   label: "Treat ourselves",    perPersonPerDay: 999999 }
  ],

  // Activities for the planner and concierge.
  // when: "morning" | "afternoon" | "evening" | "fullday"
  // where: "farm" (on Lindani) or "nearby" (drive needed)
  // ALL PRICES ARE PLACEHOLDERS. Places named are real, but confirm details before publishing.
  activities: [
    { id: "farm-walk", name: "Morning farm walk with the geese", interests: ["farm", "birding"], when: "morning", where: "farm",
      priceAdult: 0, priceChild: 0, kids: true, note: "Free. Wear closed shoes.", placeholder: true },
    { id: "dawn-birding", name: "Dawn birding at the farm dam", interests: ["birding"], when: "morning", where: "farm",
      priceAdult: 0, priceChild: 0, kids: true, note: "Bring binoculars.", placeholder: true },
    { id: "pool", name: "Pool afternoon under the old trees", interests: ["relax"], when: "afternoon", where: "farm",
      priceAdult: 0, priceChild: 0, kids: true, note: "Shared pool.", filler: true },
    { id: "dam-sundowners", name: "Sundowners at the dam", interests: ["relax", "romance", "birding"], when: "evening", where: "farm",
      priceAdult: 0, priceChild: 0, kids: true, note: "Bring your own drinks and watch the cliffs turn gold." },
    { id: "braai", name: "Braai night on your patio", interests: ["farm", "romance"], when: "evening", where: "farm",
      priceAdult: 0, priceChild: 0, kids: true, note: "Built-in braai. Bring wood and food, or ask about a braai pack.", filler: true },
    { id: "stargazing", name: "Stargazing on the lawn", interests: ["romance", "relax"], when: "evening", where: "farm",
      priceAdult: 0, priceChild: 0, kids: true, note: "Best on a moonless night." },
    { id: "picnic", name: "Private picnic for two at the dam", interests: ["romance"], when: "afternoon", where: "farm",
      priceAdult: 325, priceChild: 0, kids: false, note: "Basket prepared on request. Book a day ahead.", placeholder: true },
    { id: "massage", name: "In-studio massage", interests: ["romance", "relax"], when: "afternoon", where: "farm",
      priceAdult: 700, priceChild: 0, kids: false, note: "Mobile therapist, booked through the lodge.", placeholder: true },
    { id: "market", name: "Paarl weekend market", interests: ["farm", "relax"], when: "morning", where: "nearby",
      priceAdult: 0, priceChild: 0, kids: true, note: "Saturday mornings.", days: [6], placeholder: true },
    { id: "bird-sanctuary", name: "Paarl Bird Sanctuary", interests: ["birding"], when: "morning", where: "nearby",
      priceAdult: 0, priceChild: 0, kids: true, note: "Wetland hides on the edge of Paarl.", placeholder: true },
    { id: "paarl-mountain", name: "Hike in Paarl Mountain Nature Reserve", interests: ["birding", "relax"], when: "morning", where: "nearby",
      priceAdult: 60, priceChild: 30, kids: true, note: "Trails up to the granite domes. Entry fee applies.", placeholder: true },
    { id: "fairview", name: "Wine and cheese tasting at Fairview", interests: ["romance", "relax"], when: "afternoon", where: "nearby",
      priceAdult: 250, priceChild: 0, kids: true, note: "Cheese tasting suits children too.", placeholder: true },
    { id: "nederburg", name: "Tasting at Nederburg", interests: ["romance"], when: "afternoon", where: "nearby",
      priceAdult: 200, priceChild: 0, kids: false, note: "Book ahead on weekends.", placeholder: true },
    { id: "lion-park", name: "Drakenstein Lion Park", interests: ["game"], when: "afternoon", where: "nearby",
      priceAdult: 250, priceChild: 150, kids: true, note: "Sanctuary for rescued lions, a short drive away.", placeholder: true },
    { id: "game-drive", name: "Half-day game drive at a nearby reserve", interests: ["game"], when: "morning", where: "nearby",
      priceAdult: 1200, priceChild: 600, kids: true, note: "Reserve to be confirmed by the lodge.", placeholder: true },
    { id: "aquila", name: "Full-day safari at Aquila Private Game Reserve", interests: ["game"], when: "fullday", where: "nearby",
      priceAdult: 2500, priceChild: 1250, kids: true, note: "About two hours' drive. Includes game drive and lunch.", placeholder: true },
    { id: "franschhoek", name: "Franschhoek Wine Tram day", interests: ["romance", "relax"], when: "fullday", where: "nearby",
      priceAdult: 800, priceChild: 300, kids: true, note: "Hop-on, hop-off between wine farms.", placeholder: true }
  ],

  meals: "Lindani is self-catering: every studio has a fully equipped kitchenette, and there are garden braai spots. " +
         "Paarl's shops and restaurants are a short drive away. Breakfast baskets or braai packs may be available on request.", // PLACEHOLDER (second sentence)

  directions: "Lindani is just outside Paarl in the Cape Winelands, roughly an hour's drive from Cape Town and about 45 minutes " +
              "from Cape Town International Airport via the N1 or R300/N1. We'll send exact directions and the gate code with your booking.", // PLACEHOLDER: confirm times and route

  policies: {
    kids:   "Children are welcome. Studio Four sleeps two children on a sleeper couch. Please watch little ones at the pool and dam.", // PLACEHOLDER
    pets:   "Sorry, we can't take pets: the farm has geese and other animals roaming freely.",                                    // PLACEHOLDER
    smoking:"All studios are non-smoking. You're welcome to smoke outside on your patio.",                                         // PLACEHOLDER
    cancellation: "Free cancellation up to 14 days before arrival. After that the deposit is non-refundable.",                     // PLACEHOLDER
    payment: "A 50% deposit secures your booking, with the balance due on arrival. EFT and card accepted."                           // PLACEHOLDER
  },

  // Concierge knowledge base. The concierge picks the entry whose keywords best
  // match the guest's message (it also tolerates small typos). "answer" text can
  // use {phone}, {checkIn}, {checkOut}, {minNights}, {area}. Entries with "action"
  // run a built-in feature instead of (or after) the text.
  concierge: {
    hostName: "Lindani",
    intents: [
      { id: "greet", keywords: ["hi", "hello", "hey", "howzit", "good morning", "good afternoon", "hallo", "goeie"],
        answer: "Hello! Lovely to hear from you. What can I help you with: rooms, dates, things to do, or getting here?" },
      { id: "rooms", keywords: ["room", "rooms", "studio", "studios", "rate", "rates", "price", "prices", "cost", "how much", "accommodation", "unit", "sleep", "bed"],
        action: "rooms",
        answer: "We have four private self-catering studios, each with crisp white linen, a full kitchenette, an en-suite bathroom and its own patio. Here are the studios and sample nightly rates:" },
      { id: "dates", keywords: ["available", "availability", "dates", "date", "free", "vacancy", "check dates", "weekend", "night", "nights"],
        action: "dates",
        answer: "Let's check. Pick your dates and how many of you are coming:" },
      { id: "book", keywords: ["book", "booking", "reserve", "reservation", "stay", "request"],
        action: "book",
        answer: "Wonderful! Fill this in and I'll put together a booking request for the farm. It's a request, not a confirmed booking: the lodge will reply to confirm." },
      { id: "activities", keywords: ["activities", "activity", "things to do", "game drive", "safari", "birding", "birds", "bird", "birdwatching", "wildlife", "animals", "lions", "wine", "tasting", "hike", "hiking", "market", "pool", "dam", "swim", "kids activities"],
        action: "activities",
        answer: "There's plenty to fill (or not fill) your days. On the farm: the pool under the old trees, the dam for sundowners and birding, farm walks and braai nights. Nearby: Fairview, Nederburg, Franschhoek, Paarl Mountain, the weekend markets, and lion and game experiences a short drive away." },
      { id: "directions", keywords: ["where", "directions", "location", "address", "get there", "getting here", "airport", "drive", "map", "how far", "distance", "cape town", "paarl"],
        action: "directions" },
      { id: "kids", keywords: ["kids", "children", "child", "baby", "family", "toddler"],
        answer: "{kids}" },
      { id: "pets", keywords: ["pet", "pets", "dog", "dogs", "cat"],
        answer: "{pets}" },
      { id: "kidspets", keywords: ["kids and pets", "kids & pets"],
        answer: "{kids}\n\n{pets}" },
      { id: "meals", keywords: ["food", "meal", "meals", "breakfast", "dinner", "restaurant", "kitchen", "cook", "self catering", "braai"],
        answer: "{meals}" },
      { id: "times", keywords: ["check in", "check-in", "checkin", "check out", "check-out", "checkout", "arrive", "arrival", "late", "early"],
        answer: "Check-in is from {checkIn} and check-out is by {checkOut}. Arriving late? Just let us know and we'll arrange the gate for you. The minimum stay is {minNights} nights." },
      { id: "policies", keywords: ["cancel", "cancellation", "refund", "deposit", "pay", "payment", "smoking", "smoke", "policy", "rules"],
        answer: "{cancellation}\n\n{payment}\n\n{smoking}" },
      { id: "wifi", keywords: ["wifi", "wi-fi", "internet", "signal", "loadshedding", "load shedding", "power", "aircon", "air conditioning", "parking"],
        answer: "Good question. We still need to confirm Wi-Fi, air-conditioning, parking and backup power details for this site. Please ask us directly on WhatsApp ({phone}) and we'll answer right away." }, // PLACEHOLDER
      { id: "wedding", keywords: ["wedding", "venue", "event", "celebration", "anniversary", "honeymoon", "birthday"],
        answer: "Lovely! Many Winelands wedding venues are close by, so Lindani is an easy, quiet base for guests. Celebrating something? Mention it in your booking request and we'll help make it special." },
      { id: "planner", keywords: ["plan", "itinerary", "planner", "schedule", "trip"],
        action: "planner",
        answer: "Our trip planner builds a day-by-day plan from your dates and interests." },
      { id: "contact", keywords: ["contact", "phone", "call", "whatsapp", "email", "talk", "human", "person", "owner"],
        action: "contact",
        answer: "You can reach the farm directly on {phone} (call or WhatsApp)." },
      { id: "thanks", keywords: ["thanks", "thank you", "dankie", "danke", "bedankt", "cheers", "great", "perfect"],
        answer: "Pleasure! Anything else I can help with?" }
    ],
    fallback: "I'm not quite sure about that one. Could you try one of these, or ask the farm directly on WhatsApp?"
  },

  /* ------------------------------------------------------------------------
     TRANSLATIONS for the language switcher. Covers headings, buttons and the
     concierge greeting. The concierge's detailed answers stay in English.
     German, Dutch and Afrikaans text should be checked by a native speaker.
     Text with <em> or <br> keeps the site's italic accent and line breaks.
     ------------------------------------------------------------------------ */
  i18n: {
    en: {
      language: "Language", nav_farm: "The farm", nav_studios: "Studios", nav_nearby: "Nearby", nav_planner: "Plan your trip", nav_contact: "Contact",
      book: "Book your stay", hero_label: "Paarl · Cape Winelands", hero_title: "Leave the city <em>at the gate.</em>",
      quick_title: "Plan your stay here", check_dates: "Check dates", exp_title: "A farm stay <br><em>made for slowing down</em>",
      meet_studios: "Meet the studios", studios_title: "Come home to <br><em>your own studio</em>", rates_title: "Studios & rates",
      nearby_title: "Taste, explore <br>and <em>wander nearby</em>", plan_days: "Plan your days",
      band_title: "Golden hours, pool days <em>and braai nights</em>", see_farm: "See the farm", farm_title: "On the farm",
      planner_title: "Plan your <em>farm days</em>", planner_build: "Build my plan", planner_send: "Send this plan to the lodge",
      enq_title: "Your farm escape <em>starts here</em>", send_enquiry: "Send enquiry",
      chat_open: "Ask Lindani", chat_title: "Lindani concierge",
      chat_greeting: "Hello and welcome to Lindani Farm! I'm the farm's booking helper. Ask me about the studios, rates, things to do or getting here, or tap an option below.",
      chat_placeholder: "Type your question…", chat_send: "Send", chat_close: "Close chat",
      qr_rooms: "Rooms & rates", qr_activities: "Activities", qr_dates: "Check dates", qr_directions: "Getting here", qr_kids: "Kids & pets", qr_book: "Book a stay",
      nudge: "Book direct and save about {amount} compared with {ota}.",
      nudge_generic: "Book direct: no {ota} commission, so the same stay costs you about {pct}% less."
    },
    de: {
      language: "Sprache", nav_farm: "Die Farm", nav_studios: "Studios", nav_nearby: "Umgebung", nav_planner: "Reise planen", nav_contact: "Kontakt",
      book: "Aufenthalt buchen", hero_label: "Paarl · Cape Winelands", hero_title: "Lassen Sie die Stadt <em>am Tor zurück.</em>",
      quick_title: "Planen Sie hier Ihren Aufenthalt", check_dates: "Termine prüfen", exp_title: "Ein Farmaufenthalt, <br><em>um zur Ruhe zu kommen</em>",
      meet_studios: "Die Studios ansehen", studios_title: "Willkommen in <br><em>Ihrem eigenen Studio</em>", rates_title: "Studios & Preise",
      nearby_title: "Genießen, entdecken <br>und <em>die Umgebung erkunden</em>", plan_days: "Tage planen",
      band_title: "Goldene Stunden, Pooltage <em>und Braai-Abende</em>", see_farm: "Die Farm ansehen", farm_title: "Auf der Farm",
      planner_title: "Planen Sie Ihre <em>Tage auf der Farm</em>", planner_build: "Plan erstellen", planner_send: "Plan an die Farm senden",
      enq_title: "Ihre Auszeit auf der Farm <em>beginnt hier</em>", send_enquiry: "Anfrage senden",
      chat_open: "Fragen Sie Lindani", chat_title: "Lindani-Concierge",
      chat_greeting: "Hallo und willkommen auf der Lindani Farm! Ich helfe Ihnen bei der Buchung. Fragen Sie mich nach Studios, Preisen, Ausflügen oder der Anreise, oder wählen Sie unten eine Option. (Ausführliche Antworten vorerst auf Englisch.)",
      chat_placeholder: "Ihre Frage …", chat_send: "Senden", chat_close: "Chat schließen",
      qr_rooms: "Zimmer & Preise", qr_activities: "Aktivitäten", qr_dates: "Termine prüfen", qr_directions: "Anreise", qr_kids: "Kinder & Haustiere", qr_book: "Aufenthalt buchen",
      nudge: "Direkt buchen und gegenüber {ota} etwa {amount} sparen.",
      nudge_generic: "Direkt buchen: keine {ota}-Provision, derselbe Aufenthalt kostet Sie etwa {pct} % weniger."
    },
    nl: {
      language: "Taal", nav_farm: "De boerderij", nav_studios: "Studio's", nav_nearby: "In de buurt", nav_planner: "Plan je reis", nav_contact: "Contact",
      book: "Boek je verblijf", hero_label: "Paarl · Cape Winelands", hero_title: "Laat de stad <em>achter bij het hek.</em>",
      quick_title: "Plan hier je verblijf", check_dates: "Data bekijken", exp_title: "Een boerderijverblijf <br><em>om tot rust te komen</em>",
      meet_studios: "Bekijk de studio's", studios_title: "Thuiskomen in <br><em>je eigen studio</em>", rates_title: "Studio's & prijzen",
      nearby_title: "Proeven, ontdekken <br>en <em>de omgeving verkennen</em>", plan_days: "Plan je dagen",
      band_title: "Gouden uren, zwembaddagen <em>en braai-avonden</em>", see_farm: "Bekijk de boerderij", farm_title: "Op de boerderij",
      planner_title: "Plan je <em>dagen op de boerderij</em>", planner_build: "Maak mijn plan", planner_send: "Stuur dit plan naar de boerderij",
      enq_title: "Je ontsnapping naar de boerderij <em>begint hier</em>", send_enquiry: "Aanvraag versturen",
      chat_open: "Vraag het Lindani", chat_title: "Lindani-concierge",
      chat_greeting: "Hallo en welkom op Lindani Farm! Ik help je met boeken. Vraag me naar de studio's, prijzen, activiteiten of de route, of kies hieronder een optie. (Uitgebreide antwoorden voorlopig in het Engels.)",
      chat_placeholder: "Typ je vraag…", chat_send: "Verstuur", chat_close: "Chat sluiten",
      qr_rooms: "Kamers & prijzen", qr_activities: "Activiteiten", qr_dates: "Data bekijken", qr_directions: "Route", qr_kids: "Kinderen & huisdieren", qr_book: "Verblijf boeken",
      nudge: "Boek direct en bespaar ongeveer {amount} ten opzichte van {ota}.",
      nudge_generic: "Direct boeken: geen {ota}-commissie, dus hetzelfde verblijf kost je ongeveer {pct}% minder."
    },
    af: {
      language: "Taal", nav_farm: "Die plaas", nav_studios: "Studio's", nav_nearby: "In die omgewing", nav_planner: "Beplan jou reis", nav_contact: "Kontak",
      book: "Bespreek jou verblyf", hero_label: "Paarl · Kaapse Wynland", hero_title: "Los die stad <em>by die hek.</em>",
      quick_title: "Beplan jou verblyf hier", check_dates: "Kyk na datums", exp_title: "'n Plaasverblyf <br><em>om stadiger te leef</em>",
      meet_studios: "Sien die studio's", studios_title: "Kom tuis in <br><em>jou eie studio</em>", rates_title: "Studio's & tariewe",
      nearby_title: "Proe, verken <br>en <em>dwaal in die omgewing</em>", plan_days: "Beplan jou dae",
      band_title: "Goue ure, swembaddae <em>en braai-aande</em>", see_farm: "Sien die plaas", farm_title: "Op die plaas",
      planner_title: "Beplan jou <em>dae op die plaas</em>", planner_build: "Stel my plan saam", planner_send: "Stuur hierdie plan na die plaas",
      enq_title: "Jou plaasontvlugting <em>begin hier</em>", send_enquiry: "Stuur navraag",
      chat_open: "Vra vir Lindani", chat_title: "Lindani-gasheer",
      chat_greeting: "Hallo en welkom by Lindani Farm! Ek help jou om te bespreek. Vra my oor die studio's, tariewe, aktiwiteite of die roete hierheen, of kies 'n opsie hieronder. (Volledige antwoorde voorlopig in Engels.)",
      chat_placeholder: "Tik jou vraag…", chat_send: "Stuur", chat_close: "Maak klets toe",
      qr_rooms: "Kamers & tariewe", qr_activities: "Aktiwiteite", qr_dates: "Kyk na datums", qr_directions: "Roete hierheen", qr_kids: "Kinders & troeteldiere", qr_book: "Bespreek 'n verblyf",
      nudge: "Bespreek direk en spaar sowat {amount} teenoor {ota}.",
      nudge_generic: "Bespreek direk: geen {ota}-kommissie nie, so dieselfde verblyf kos jou sowat {pct}% minder."
    }
  }
};
