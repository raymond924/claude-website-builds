# Clarus Operations: launch plan (drafted 2026-10-08)

Starting point: no clients, R5,000, 60 hours a week, and a working Claude Code build process
(`.claude/skills/website-builder`, `.claude/skills/design-loop`).

## 1. The decisions

| Question | Decision | Why |
|---|---|---|
| Market | **South Africa first**, USA from month 4 | You can walk into a shop and shake hands, rand costs fit the budget, no time-zone or payment friction. The USA pays 5 to 10 times more, but selling there cold with no case studies is hard. Win SA case studies first, then use them to sell in the USA. |
| Niche | **Home-service trades in one metro**: plumbers, electricians, builders/contractors. Dog groomers and salons second. | A plumbing job is worth R1,500 to R50,000, so one extra call a month pays for the site. Customers find trades on Google in an emergency, and many trades have no site or a broken one. Groomers pay less but are easy wins and good for referrals. |
| Area | Your home city, start with 5 to 10 suburbs | Walk-ins, local references, "I'm in Durbanville too" trust. |
| Offer | Website + Google Business Profile, built before they pay | See section 2. |
| Name | Keep "Clarus Operations" as the company; trade as **Clarus** on the site and cards | "Operations" sounds like consulting. "Clarus — websites for local trades" is clearer to a plumber. |

## 2. The offer

**The hook: build their site before you call.** With the website-builder skill a demo takes 1 to 2 hours.
You show the owner their own business, with their name, services, suburbs and Google reviews, live on
their phone. That beats any pitch.

| Package | Price (SA) | What they get |
|---|---|---|
| **Starter** (lead offer) | R0 upfront, **R999/month**, 12-month minimum | 1-page site, hosting, domain, contact/WhatsApp button, Google Business Profile clean-up, 1 change a month |
| **Pro** | R4,500 once-off + R799/month | Up to 5 pages (one per service and suburb), quote form, review widget, monthly GBP post |
| **Build only** | R7,500 once-off | Site handed over; hosting R250/month if they want it |

Why monthly: 10 Starter clients = R10,000 a month, every month. Once-off builds mean starting from zero each month.
Hosting on Cloudflare Pages or Netlify is free, so the monthly fee is almost all margin.

Guarantee to remove the risk: *"If you don't like the site, you don't pay. Cancel the first month for free."*

## 3. Where the R5,000 goes

| Item | Cost | Notes |
|---|---|---|
| CIPC company registration (if not done) | ~R175 | Online at bizportal.gov.za |
| Domain `clarus.co.za` or similar | ~R100/year | Pick an available .co.za |
| Google Workspace, 1 user | ~R130/month | `you@clarus.co.za`: trades trust it more than Gmail |
| Higgsfield / image credits | ~R500 | For demo sites with no client photos yet |
| 250 business cards + 100 A5 leave-behinds | ~R600 | Leave one at every walk-in |
| Fuel for walk-ins, first month | ~R1,000 | |
| Business bank account | R0 to R100/month | |
| **Reserve** | **~R2,300** | Don't spend on ads until the offer converts |

Hosting: free tier. CRM: a Google Sheet (columns in section 6). No paid tools until there is revenue.

## 4. The 60-hour week

| Block | Hours | What |
|---|---|---|
| Prospecting and outreach | 25 | Calls, walk-ins, follow-ups |
| Demo builds | 15 | 6 to 10 demo sites a week |
| Client delivery | 10 | Grows as clients sign, take hours from demo builds |
| Systems | 5 | Templates, scripts, the trades site template |
| Admin and review | 5 | Invoices, the tracker, Friday review of the numbers |

## 5. The first 90 days

### Week 1: set up
- Register the company, open the bank account, buy the domain, set up email.
- Build the Clarus site (one page: offer, 3 demos, price, WhatsApp button). Use your own process on it.
- Build a **trades template** in this repo (`sites/_template-trades/`) so each demo is mostly
  name, colours, services, suburbs, reviews.
- Build 3 portfolio demos: a plumber, an electrician, a dog groomer. Real local businesses, from Google Maps.
- Build the lead list: 200 businesses (section 6).

### Weeks 2 to 4: first clients
- **Daily**: 2 demo sites, 30 calls or 10 walk-ins, follow-ups from the day before.
- Target: **first paying client by day 30.** Treat the first 3 as case studies: charge them, but go above and beyond,
  and ask for a Google review and a referral.

### Weeks 5 to 8: repeat what worked
- Look at the tracker. Which niche, which suburb, calls or walk-ins? Double down on the best one.
- Ask every client: "Who else do you know who needs this?" Trades know other trades (plumber → electrician → tiler).
- Target: **5 clients, ~R5,000 MRR.**

### Weeks 9 to 13: tighten
- Write up 2 case studies with numbers (calls/enquiries before and after, from GBP insights).
- Raise the Starter price to R1,299 for new clients if close rates hold.
- Target: **10 clients, ~R10,000 to R12,000 MRR.**
- Only now consider R1,000 to R2,000 on Facebook/Google ads, aimed at "website for plumbers [city]".

### Month 4+: USA
- Same offer in dollars: $0 upfront + $149/month, or $1,500 + $99/month.
- Channel: cold email with a link to their pre-built demo (legal under CAN-SPAM with your address and an unsubscribe line).
- Niches the same: US plumbers, HVAC, roofers, groomers. Work in US hours in the afternoon/evening SA time.

## 6. Finding and contacting prospects

**Where to find them:** Google Maps, search "plumber Bellville" etc. Good prospects have:
- No website, or a site that is broken, not mobile friendly, or a Facebook page only.
- 10+ Google reviews (they're a real, busy business that can pay).
- A phone number listed.

**Tracker columns:** business, niche, suburb, phone, current site (none/poor/ok), Google rating and review count,
demo URL, date contacted, channel, status (new / contacted / demo shown / follow-up / won / lost), next action, notes.

**Phone script (60 seconds):**
> "Hi, is that Johan? My name is ___ from Clarus. I build websites for plumbers here in the northern suburbs.
> I noticed you've got 47 great reviews on Google but no website, so I built you one as an example.
> Can I WhatsApp you the link? Take a look, and if you like it, it's R999 a month with nothing upfront.
> If not, no problem at all."

Then WhatsApp the link (they agreed, so it's not unsolicited), and follow up 2 days later.

**Walk-ins:** best for groomers, salons, hardware-adjacent trades with a shopfront. Show the demo on your phone,
leave the A5 sheet with the demo QR code.

**POPIA note:** in South Africa, unsolicited direct marketing by email or SMS needs consent, and you may only
approach someone once to ask for it. Phone calls and walk-ins are the safe primary channels; send links on WhatsApp or
email only after they say yes. Check this with an advisor if you plan any bulk messaging.

## 7. The numbers to watch (every Friday)

| Metric | Healthy target |
|---|---|
| Contacts per week (calls + walk-ins) | 150+ |
| Contacted → agreed to see demo | 30%+ |
| Saw demo → signed | 10 to 20% |
| Demo build time | under 90 minutes |
| Clients signed / MRR | see the 90-day targets |
| Churn | 0 in the first 90 days |

Rough funnel: 150 contacts → 45 see a demo → 5 to 9 sign per week at best. Even at half that rate,
10 clients by day 90 is reachable.

## 8. What to build in this repo next

1. `sites/clarus/`: the Clarus Operations site.
2. `sites/_template-trades/`: the reusable trades template, plus a short skill or checklist that turns a
   Google Maps listing into a demo site in under 90 minutes.
3. `business/leads.csv` or a Google Sheet: the tracker.
4. One-page proposal/contract template: monthly fee, 12-month term, what's included, who owns the domain.

## Open questions
- Which city are you in? That sets the suburbs and the lead list.
- Is the company already registered with CIPC?
- Is COOK Engineering a client we can use as a portfolio piece, or a test project?
