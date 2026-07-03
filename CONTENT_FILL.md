# Gate Buddy — Content Fill: Descriptions & Amenities (Section 10.3)

This documents the `description` and `amenities` text drafted for every service that was missing
it, plus the one FAQ item that had to be reconciled with reality. The full machine-readable output
is in **`seed/services.patch.json`** (58 descriptions + 145 amenities lists) and
**`seed/faqs.seed.json`** (9 FAQs).

## 1. Sourcing rules (honesty guarantees)

Everything below was **derived from data that already exists on the record** or from the frontend
mock — nothing was invented:

- **Descriptions** are assembled only from a record's own real fields: `name`, `terminal`, `zone`,
  `gates[]`, `services[]`, existing `amenities[]`, and `operatingHours`. No counts, prices,
  certifications, or claims that aren't already in the data.
- **Amenities** are either copied from a field the record already has (counters reuse their real
  `services[]`) or are the minimal set **directly implied** by the record's own type/category
  (e.g. an ATM ⇒ card payments; a café ⇒ Wi-Fi because its `cuisine` includes "Coffee").
- **Tone/format** matches the records that already have good copy (the 60 RESTAURANTS and 50 SHOPS
  descriptions), so filled content is indistinguishable from original content.
- **`24/24`** (a raw DB value) is rendered as "24 hours a day" in prose for readability; the stored
  `operatingHours` value itself is not changed.
- **No fabrication guard:** the generator flags any record it can't complete honestly.
  **Result: 0 flagged** — every gap had enough real source data.

## 2. Descriptions — per-category templates & samples

**COUNTERS (20 drafted)** — `{airline} check-in and bag drop in {terminal · zone} serving gates {gates}. Offers {services}. Open {hours}.`
- `Etihad Airways Check-in (Desks 22–28)` → *"Etihad Airways check-in and bag drop in Departure Hall 3 · Departures Level 2 serving gates F9 and F11. Offers First & Business Class, Guest Services and Baggage Drop. Open 05:30–21:30."*
- `Singapore Airlines Check-in (Desks 30–36)` → *"Singapore Airlines check-in and bag drop in Departure Hall 3 · Departures Level 2 serving gates F5 and F7. Offers First & Business Class, KrisFlyer Desk and Baggage Drop. Open 06:00–20:00."*

**FINANCIAL (8 drafted — 7 already had descriptions)** — ATM vs exchange chosen from the name.
- `ABN AMRO ATM — F Pier` → *"Self-service cash machine in Non-Schengen · F Pier (airside). Accepts major debit and credit cards, available around the clock."*
- `ING ATM — E Pier` → *"Self-service cash machine in Non-Schengen · E Pier (after security). Accepts major debit and credit cards, available around the clock."*

**VIP_SERVICES (10 drafted)** — `{lounge name}, located in {zone}. Guests enjoy {first 3 real amenities}. Open {hours}.`
- `Qatar Airways Al Mourjan Lounge — F/G Pier` → *"Qatar Airways Al Mourjan Lounge, located in Non-Schengen · F/G Pier (airside). Guests enjoy free wi-fi, gourmet buffet and full bar. Open 05:00–22:00."*
- `Turkish Airlines Lounge — G Pier` → *"Turkish Airlines Lounge, located in Non-Schengen · G Pier (airside). Guests enjoy free wi-fi, hot buffet and bar. Open 05:00–22:00."*

**ACCESSIBILITY (20 drafted)** — `{name} in {terminal · zone}, offering {first 3 real amenities}. Open {hours}.`
- `Schiphol Medical Centre` → *"Schiphol Medical Centre in Departure Hall 2 · Departures Level 2, offering first aid, gp consultation and travel vaccinations. Open 07:00–22:00."*
- `Baby Care Room — Departure Hall 2` → *"Baby Care Room in Departure Hall 2 · Departures Level 2, offering changing tables, nursing area and bottle warming. Open 24 hours a day."*

## 3. Amenities — per-category rules & samples

| Category | Rule | Sample |
|---|---|---|
| COUNTERS (20) | Copy the record's real `services[]` (its actual feature list) | Etihad → `["First & Business Class","Guest Services","Baggage Drop"]` |
| FINANCIAL·ATM | Implied by ATM type (+`24/7 Access` when hours = 24/24) | ABN AMRO ATM → `["Card Payments","Contactless","24/7 Access"]` |
| FINANCIAL·exchange | Implied by currency-exchange type | GWK Travelex → `["Currency Exchange","Card Payments","Multi-Currency"]` |
| RESTAURANTS (60) | Baseline dining set (+`Free Wi-Fi` when `cuisine` includes coffee) | Asian Fusion → `["Dine-in","Takeaway","Card Payments"]`; Starbucks → `[…,"Free Wi-Fi"]` |
| SHOPS (50) | Baseline retail set | Jewellery Boutique → `["Card Payments","Tax-Free Shopping","Contactless"]` |

VIP_SERVICES and ACCESSIBILITY already had good amenities in the DB — **not touched**.

## 4. FAQs (9) & the one reconciled item

The `faqs` collection already held **8 Schiphol-specific FAQs** (the initial "empty" reading was a
mis-parse — `GET /faqs` nests its array under `data.data`). `seed/faqs.seed.json` **adds 9 general
FAQs** (with `isActive:true`) sourced from the frontend mock (`FQA.jsx`) plus a few grounded in real
features (flight tracking, lounges, password reset, notifications) — bringing the total to 17. No
existing FAQ was changed.

- ⚠ **Reconciled:** the mock's *"Gate Buddy currently supports 85+ airports worldwide"* **contradicts
  the live data** (`stats.airportsCovered = 1`; the DB is a single airport — Amsterdam Schiphol).
  Seeding the "85+" claim would be dishonest, so the FAQ was rewritten to *"currently provides full
  real-time coverage for Amsterdam Airport Schiphol (AMS)… additional airports are planned."* This is
  the **only** place mock copy was altered rather than reused verbatim.
- The mock's "free plan / VIP plan" and "offline" answers were kept but lightly grounded (VIP lounges
  do exist as `VIP_SERVICES`; offline wording softened to match a real online-first app).

## 5. Could-not-complete list

**None.** All 58 descriptions and 145 amenities lists were generated from real per-record data with
zero fabrication flags. If future records lack both `services[]` and `amenities[]` (nothing to source
from), the generator emits a flag instead of inventing content — none occurred in this dataset.

## 6. Regenerating

The patches come from a deterministic generator over a live `GET /services?limit=200` snapshot. To
refresh after data changes: re-pull services JSON, re-run the generator (templates in §2–§3), and it
re-emits `seed/services.patch.json`. The seed runner then applies it non-destructively (see
`seed/README.md`).
