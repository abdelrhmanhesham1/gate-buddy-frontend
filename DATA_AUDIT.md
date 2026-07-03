# Gate Buddy — Data & Photo Audit (Section 10.1 + 10.2)

**Method:** read-only pull of the live API on 2026-07-03 — `GET /services?limit=200` (175 records),
`GET /flights?limit=200` (200), `GET /faqs` (0), `GET /stats`, `GET /home` — compared field-by-field
against the frontend mock arrays. Image URLs were probed with `curl` (HTTP status shown).
The fixes are implemented in `seed/` (content only). Fields that the schema cannot hold are routed
to `PLAN.md §10` (schema recommendations), **not** the seed.

> **Context that reframes "missing records":** the mock data is **Cairo/Nile-themed**; the DB is
> **Amsterdam Schiphol**. So mock *records* (EgyptAir counter D01, "Thomas Cook Exchange", etc.) are
> not "missing from the DB" in a meaningful sense — the DB simply describes a **different airport**
> with **more** records (175 services vs ~34 in the mock). Therefore the audit does **not** insert
> mock records (that would corrupt a coherent dataset); it fills **missing fields** on the real
> records and adds a set of general FAQs. See `PLAN.md §0`.
>
> **Correction (post-seed):** the `faqs` collection was **not empty** — it held **8** Schiphol-specific
> FAQs. The initial "0" reading was a false alarm: `GET /faqs` nests its array under `data.data`
> (not `data.faqs`), so the first audit probe mis-parsed it. The seed added **9** general FAQs
> (`isActive:true`), bringing the total to **17**. No FAQs were deleted or overwritten.

---

## 10.1 Missing-data table

### A. Aggregate field gaps on existing `services` (175 records)

| Entity | Category (count) | Field | Mock value available? | Currently in DB? | Action needed |
|---|---|---|---|---|---|
| Service | COUNTERS (20) | `description` | Style analog (mock counters) | ❌ 20/20 empty | **Seed** — derived from name+terminal+zone+gates+services+hours |
| Service | COUNTERS (20) | `amenities` | Yes (`services[]` on record) | ❌ 20/20 empty | **Seed** — from each record's real `services[]` |
| Service | COUNTERS (20) | `images` | Style analog | ❌ 20/20 empty | **Seed** — check-in hall image |
| Service | FINANCIAL (15) | `description` | Style analog (mock ATMs/banks) | ❌ 8/15 empty (7 present) | **Seed** — 8 records; ATM/exchange copy from name+zone+hours |
| Service | FINANCIAL (15) | `amenities` | Partial | ❌ 15/15 empty | **Seed** — ATM/exchange feature list |
| Service | FINANCIAL (15) | `images` | Style analog | ❌ 15/15 empty | **Seed** — ATM/finance image |
| Service | VIP_SERVICES (10) | `description` | Style analog (mock VIP) | ❌ 10/10 empty | **Seed** — from name+zone+existing amenities+hours |
| Service | VIP_SERVICES (10) | `images` | Yes (mock Unsplash lounges) | ❌ 10/10 empty | **Seed** — lounge image |
| Service | VIP_SERVICES (10) | `amenities` | — | ✅ present | none |
| Service | ACCESSIBILITY (20) | `description` | Style analog (mock a11y) | ❌ 20/20 empty | **Seed** — from name+zone+existing amenities+hours |
| Service | ACCESSIBILITY (20) | `images` | Yes (mock Unsplash) | ❌ 20/20 empty | **Seed** — assistance image |
| Service | ACCESSIBILITY (20) | `amenities` | — | ✅ present | none |
| Service | RESTAURANTS (60) | `amenities` | Partial | ❌ 60/60 empty | **Seed** — dine-in/takeaway/cards (+wifi for cafés) |
| Service | RESTAURANTS (60) | `description`,`images`,`cuisine` | — | ✅ present | none |
| Service | SHOPS (50) | `amenities` | Partial | ❌ 50/50 empty | **Seed** — cards/tax-free/contactless |
| Service | SHOPS (50) | `description`,`images` | — | ✅ present | none |
| FAQ | — | new general FAQs | Yes (mock `faqData` ×5) | ⚠ **8 pre-existing** (Schiphol-specific) | **Seed** — added 9 general FAQs (`seed/faqs.seed.json`), `isActive:true` |

**Seed totals:** 58 descriptions + 145 amenities lists + 65 image sets across 175 service patches, plus 9 FAQs. All non-destructive (`$set` only where empty).

### B. Representative records (real IDs, so the seed is verifiable)

| Category | Record / `_id` | Missing → seeded |
|---|---|---|
| COUNTERS | `Etihad Airways Check-in (Desks 22–28)` `6a3f05d3d8e8c4f555bd7b5f` | description, amenities, image |
| COUNTERS | `KLM Check-in (Desks 1–99)` `6a3f05d3d8e8c4f555bd7b55` | description, amenities, image |
| FINANCIAL | `ABN AMRO ATM — F Pier` `6a3f05d3d8e8c4f555bd7b73` | description, amenities, image |
| FINANCIAL | `GWK Travelex — E Pier` `6a3f05d3d8e8c4f555bd7b71` | amenities, image (desc already present) |
| VIP_SERVICES | `Qatar Airways Al Mourjan Lounge — F/G Pier` `6a3f05d3d8e8c4f555bd7b7c` | description, image (amenities present) |
| ACCESSIBILITY | `Baby Care Room — Departure Hall 2` `6a3f05d3d8e8c4f555bd7b83` | description, image (amenities present) |
| RESTAURANTS | `Asian Fusion — G Pier` `6a3f05d4d8e8c4f555bd7bff` | amenities (desc+images+cuisine present) |

### C. Fields the schema **cannot** hold → schema change, NOT seed (see `PLAN.md §10`)

| Frontend field (page) | Reason not seeded |
|---|---|
| `logo`, `bookingUrl` (Counter_S) | No such columns on `services`; derive client-side or add to model |
| `fee`, `accepts` (Financial ATMs) | No column; drop in v1 or add `financial` sub-doc |
| `rate`, `commission` (Financial exchange) | No column; volatile FX data — better from a live source than seeded |
| `phone`,`email`,`website`,`staff`,`reviews`,`facilities`,`floor`,`estimatedWaitTime` (doc) | Not in live schema; doc drift — fix the doc |
| `phone` (Signup form) | Not on `user` model |

---

## 10.2 Photo / media audit

Every image/photo field referenced by the frontend or stored on a record. Status from live HTTP probes.

### A. DB-stored images

| Entity | Record / scope | Photo field | Current status | Replacement source |
|---|---|---|---|---|
| Service · RESTAURANTS | 60 records | `images[]` | ✅ **OK** — Unsplash, `HTTP 200` (spot-checked `photo-1579584425555…`) | n/a |
| Service · SHOPS | 50 records | `images[]` | ✅ **OK** — Unsplash, `HTTP 200` (`photo-1515562141207…`) | n/a |
| Service · COUNTERS | 20 records | `images[]` | ❌ **Missing** (empty array) | `seed` → check-in hall `photo-1540339832862…` (200) |
| Service · FINANCIAL | 15 records | `images[]` | ❌ **Missing** (empty array) | `seed` → ATM/finance `photo-1580519542036…`, `photo-1554672723…` (200) |
| Service · VIP_SERVICES | 10 records | `images[]` | ❌ **Missing** (empty array) | `seed` → lounge `photo-1436491865332…`, `photo-1556742049…` (200) |
| Service · ACCESSIBILITY | 20 records | `images[]` | ❌ **Missing** (empty array) | `seed` → assistance `photo-1559386484…`, `photo-1521737711867…` (200) |
| Flight | 200 records | `airline.logo` | ✅ **OK** — `pics.avs.io/200/200/LO.png` etc. `HTTP 200` | n/a |

### B. Frontend static / referenced images (not DB-backed)

| Where | Photo field | Current status | Replacement source |
|---|---|---|---|
| `Airline.jsx` (~35 cards) | `logo.clearbit.com/*` | ❌ **Broken** — host does not resolve (Clearbit Logo API discontinued; `curl` DNS error) | Wikimedia SVGs (first 4 already used, `HTTP 200`) or local `public/images/*` logos; Phase 7 |
| `Aboutus.jsx` (About img) | `src="../../../public/images/img2.jpeg"` | ❌ **Broken** — relative path won't resolve in Vite build | `/images/img2.jpeg` (file exists) |
| `Aboutus.jsx` (Mission img) | `src="../../../public/images/mission1.jpeg"` | ❌ **Broken** — same | `/images/mission1.jpeg` (file exists) |
| `index.html` | `<link rel="shortcut icon" href="./images/">` | ⚠ **Broken** — empty/dir href (no favicon) | point to `/images/logo.png` |
| `Hotel.jsx` (6 cards) | `src="/images/142.jpg"` (shared) | ⚠ **OK but generic** — one image for all hotels | per-hotel images or accept generic (no hotel API) |
| `explore.jsx` / `A_Scan.jsx` | EgyptAir logo (`/images/egyair%20logo.png`, Wikimedia) | ✅ **OK** — file exists / `HTTP 200`; has `onError` fallback | n/a (will be replaced by real `my-flight` data in Phase 5) |
| `Vip_S.jsx`, `Accessabillity_S.jsx`, `explore.jsx` | mock Unsplash hero/cards | ✅ **OK** — `HTTP 200` | n/a (replaced by DB `images[]` when wired) |
| `Navbar.jsx`, `Profile.jsx` | default `i.pravatar.cc` avatar | ✅ **OK** — placeholder until real `user.photo` | real photo via `getMe`/`updateMe` (Phase 2) |
| local `public/images/*` (home, counters, scan, img66, etc.) | Home/hero/service card images | ✅ **OK** — all files present | n/a |

### C. Photo audit summary
- **DB image fields fixed by seed:** 65 records (COUNTERS 20, FINANCIAL 15, VIP 10, ACCESSIBILITY 20) go from empty → working Unsplash images consistent with the RESTAURANT/SHOP style already in the DB.
- **Frontend broken images (code fixes, Phase 7 — not seed):** Airline Clearbit logos (dead host), 2 Aboutus relative paths, empty favicon.
- **Verified healthy:** all restaurant/shop `images[]`, all flight `airline.logo`, all local `public/images/*`, mock Unsplash used by VIP/Accessibility/explore.
