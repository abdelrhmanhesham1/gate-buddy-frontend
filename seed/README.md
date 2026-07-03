# Gate Buddy — Database Seed (content gap-fill)

This folder contains **database content only** — it is completely separate from the React
app and from the frontend↔backend integration work described in `PLAN.md`. Its single job is
to fill the data gaps found in `DATA_AUDIT.md` so that, once the service pages are wired to the
API, every card renders with a description, an amenities list and an image.

## What it does (and does not do)

- **Patches existing `services`** with the missing `description`, `amenities` and `images`
  fields — matched by `_id`, and **only where the field is currently empty**.
- **Upserts FAQ documents** into the `faqs` collection (currently **empty** in the DB),
  keyed by `question`.
- ❌ No inserts of duplicate services, no deletes, no drops, **no overwriting of fields that
  already have a value**. Running it twice changes nothing the second time (idempotent).

All fill content was **derived from each record's own real fields** (name, terminal, zone,
gates, services, amenities, opening hours) or from the existing frontend mock data — nothing was
invented. See `CONTENT_FILL.md` for the sourcing rules and the one reconciled item (the
"which airports" FAQ, corrected from the mock's "85+ airports" to the real single-airport
deployment).

## Files

| File | Purpose |
|---|---|
| `services.patch.json` | 175 `$set` patches (58 descriptions, 145 amenities lists, 65 image sets). |
| `faqs.seed.json` | 9 FAQ documents to load into the empty `faqs` collection. |
| `seed.mjs` | Idempotent, non-destructive runner (mongo or admin-API mode). |

## Prerequisites

```bash
npm i mongodb        # only needed for SEED_MODE=mongo (Node 18+ has global fetch for API mode)
```

## Running

> **Do a dry run first, and take a DB backup before writing to any shared/production database.**
> Seeding a shared DB is an outward-facing change — get sign-off before running for real.

**Preview (no writes):**
```powershell
$env:DRY_RUN="1"; $env:MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.xejbahc.mongodb.net/test"; node seed/seed.mjs
```

**Mongo mode (default — required for FAQs):**
```powershell
$env:MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0.xejbahc.mongodb.net/test"; node seed/seed.mjs
```

**Admin-API mode (service patches only; FAQs skipped — there is no create-FAQ endpoint):**
```powershell
$env:SEED_MODE="api"; $env:ADMIN_TOKEN="<admin_jwt>"; node seed/seed.mjs
```

## Environment variables

| Var | Mode | Meaning |
|---|---|---|
| `MONGODB_URI` | mongo | Connection string (db name taken from the URI, e.g. `…/test`). |
| `ADMIN_TOKEN` | api | JWT for a user with `role: "admin"`. |
| `API_BASE` | api | Override the API base URL (defaults to the Railway deployment). |
| `DRY_RUN` | both | `1` = log intended changes, write nothing. |
| `SEED_MODE` | both | `mongo` (default) or `api`. |

## Regenerating the service patches

`services.patch.json` was generated from a live read-only pull of `GET /services?limit=200`.
If the underlying data changes, re-pull and re-run the generator described in `CONTENT_FILL.md §5`.
