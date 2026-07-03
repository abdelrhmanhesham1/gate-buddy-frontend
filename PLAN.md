# Gate Buddy — Frontend ↔ Backend Integration Plan

**Goal:** replace the frontend's static/mock data with real backend data from the deployed
GateBuddy API **while preserving the existing UI, layout, styling and routes**. This document is
analysis + roadmap only — **no application code is changed by this plan** (the only files
produced are this doc, `DATA_AUDIT.md`, `CONTENT_FILL.md`, and the `seed/` content, which is
database-only).

- **Frontend repo:** `gate (8)/gate` — React 19 + Vite 7 SPA.
- **Backend:** deployed only. Base URL `https://gate-buddy-backend-production-f6df.up.railway.app/api/v1`. Contract in `API_DOCUMENTATION.md`. **No backend source is in this repo.**
- **Audit basis:** every page under `src/components/pages/` was read; the live API was probed read-only (`/health`, `/services`, `/flights`, `/faqs`, `/stats`, `/home`, `/navigation/nodes`).

---

## 0. Executive summary — key findings (read this first)

1. **The live API works and is already reachable.** `GET /health` → `200`, `GET /services` → 175 records, `GET /flights` → 200 records, `GET /stats` and `GET /home` → `200`.
2. **The API layer already exists** in `utils/Api.js` (axios instance + `authAPI`, `userAPI`, `flightAPI`, `homeAPI`, `chatAPI`, `notificationsAPI`, `servicesAPI`, `faqAPI`, `statsAPI`). **Most of it is never imported.** Only `homeAPI` (Home) and `chatAPI` (Chatbot) are used. Auth pages bypass it and call `axios`/`fetch` directly.
3. **Domain mismatch (biggest content risk).** The frontend mock is themed around **Cairo / "Nile International Airport"** (EgyptAir, Nile Air, Terminals 1–3, USD→EGP, Cairo hotels). The **live DB is Amsterdam Schiphol (AMS)** — "Non-Schengen", "F/G Pier", KLM/LOT, coordinates ≈ `[4.76, 52.30]`. Wiring pages to the API will **replace the Egyptian content with Dutch/Schiphol content.** This is expected (DB is source of truth) but must be communicated; do **not** seed Egyptian mock over the coherent Schiphol dataset.
4. **The API doc and the live API disagree on several shapes** — trust the **live API**, not the doc, when they differ. Notably:
   - Flight `airline` is an **object** `{ name, logo }` (doc says string); `route.from` is an **IATA code** `"WAW"` (doc says city `"New York"`); the gate lives at `departure.gate` (doc shows a top-level `flight.gate`).
   - Service `operatingHours` is a **string** `"05:00–22:00"` (doc shows `{ open, close }`); the real service schema has `zone / gates / services / cuisine / waitTime / images` and **lacks** the doc's `floor / reviews / facilities / phone / email / website / staff / estimatedWaitTime`.
5. **`faqs` shape gotcha:** `GET /faqs` nests its list under `data.data` (not `data.faqs`). The collection already held 8 Schiphol FAQs; the seed added 9 general ones (17 total). Wire the FAQ page against `res.data.data.data`.
6. **Auth is half-wired and inconsistent.** Login/Signup/OAuth/Password-reset hit the API directly and store a JWT in `localStorage`. But Profile/EditProfile/Settings are **localStorage-only mocks** (no `getMe`, `updateMe`, `updateMyPassword`, `deleteMe`, `logout`), route guards are applied on only 2 of ~10 protected pages, and there is **no 401/refresh handling**.
7. **Two pages have no backing endpoint** (Airline directory, Hotels) → keep them static/external-booking. **Map** is intentionally an "App-Only" placeholder → keep static.

---

## 1. Current architecture

### 1.1 Stack
React 19, Vite 7, React Router DOM v7 (client-side routing), Bootstrap 5 + per-page CSS/inline
styles, Framer Motion, Lucide/React-Icons/Bootstrap-Icons, **Axios**, SweetAlert2, EmailJS,
`@react-oauth/google`, Moment. `json-server` is a dev dependency but **unused** (no `db.json`).

### 1.2 Layout
```
index.html → src/main.jsx → <GoogleOAuthProvider><BrowserRouter><App/> …
src/App.jsx                     # all routes (flat, no layout/guard wrappers)
src/components/pages/*.jsx       # one component per screen (21 files)
src/components/shared/           # Navbar.jsx, Footer.jsx, useAuthGuard.js
src/components/style/*.css        # per-page styles
utils/Api.js                     # axios instance + typed API helpers (mostly unused)
public/images/*                  # local static images
```

### 1.3 Data & auth today
- **Auth token:** `localStorage.auth_token` (JWT). Axios instance also sends `withCredentials:true` (cookies). Mixed cookie+bearer model.
- **User cache:** `localStorage.user_profile` = `{ name, email, photo, id }` written at login/signup; read by Navbar, Profile, EditProfile.
- **Preferences:** `localStorage.app_language`, in-memory `darkMode` — never synced to the server's `user.preferences`.
- **Routing guard:** none at the router level. `useAuthGuard().requireAuth(cb, feature)` gates *click actions* (VIP/Accessibility/hero) with a SweetAlert modal. Home and Vip do their own `useEffect` redirect. All other "protected" pages render regardless of auth.

---

## 2. Frontend pages / components inventory

Legend — **Data source today:** 🟥 fully static · 🟨 partially wired · 🟩 wired.

| # | Route | File | Data source today | Backend needed |
|---|---|---|---|---|
| 1 | `/`, `/main1` | `pages/main1.jsx` | 🟥 static hero, **static metrics** (12,450 / 3,256/112 / 85 / 4.8) | `GET /stats` (metrics) |
| 2 | `/home` | `pages/Home.jsx` | 🟨 `homeAPI.getDashboard()` → flight-update cards only; weather, tracked-flight, services, airport-info all static | `GET /home`, `GET /flights/my-flight` |
| 3 | `/login` | `pages/Login.jsx` | 🟩 direct `axios` login + Google/GitHub/Facebook | `POST /users/login`, `/users/google|github|facebook` |
| 4 | `/signup` | `pages/Signup.jsx` | 🟩 direct `axios` signup (**collects `phone` but never sends it**) | `POST /users/signup` |
| 5 | `/PasswordReset` | `pages/PasswordReset.jsx` | 🟩 direct `fetch` OTP flow (**discards `resetToken`**) | `/users/forgotPassword`, `/verifyResetCode`, `/resetPassword` |
| 6 | `/oauth/github` | `pages/OAuthCallback.jsx` | 🟩 direct `axios` GitHub code exchange | `POST /users/github` |
| 7 | `/profile` | `pages/Profile.jsx` | 🟥 localStorage user; password/delete/logout are **mocked** | `GET /users/me`, `updateMyPassword`, `deleteMe`, `logout`, `updateMe` (prefs) |
| 8 | `/edit-profile` | `pages/EditProfile.jsx` | 🟥 name/email/photo saved to **localStorage only** | `PATCH /users/updateMe` (name + photo; **email not editable via API**) |
| 9 | `/chatbot` | `pages/Chatbot.jsx` | 🟩 `chatAPI.sendMessage()` (**not auth-guarded → 401 fallback when logged out**) | `POST /chat/query` (auth required) |
| 10 | `/scan` | `pages/A_Scan.jsx` | 🟥 hardcoded flight cards + fake QR scan (button inert) | `POST /flights/scan`, `GET /flights/updated`, `GET /flights/my-flight` |
| 11 | `/explore` | `pages/explore.jsx` | 🟥 static tracked-flight card + 3 static UAE destinations | `GET /flights/my-flight` (`recommendations[]`) |
| 12 | `/counters` | `pages/Counter_S.jsx` | 🟥 `DOMESTIC_COUNTERS` / `INTERNATIONAL_COUNTERS` arrays | `GET /services?category=COUNTERS`, `GET /services/counters/stats` |
| 13 | `/vip` | `pages/Vip_S.jsx` | 🟥 `vipFeatures` array (auth-redirect present) | `GET /services?category=VIP_SERVICES` |
| 14 | `/financial` | `pages/Financial_S.jsx` | 🟥 `ATMS` / `BANKS` / `CURRENCY` arrays | `GET /services?category=FINANCIAL` |
| 15 | `/accessibility` | `pages/Accessabillity_S.jsx` | 🟥 `services` array | `GET /services?category=ACCESSIBILITY` |
| 16 | `/Airline` | `pages/Airline.jsx` | 🟥 ~35 airlines, **Clearbit logos (host dead)** | **No endpoint** — keep static / derive from flights |
| 17 | `/Hotels` | `pages/Hotel.jsx` | 🟥 6 hotels, external booking links | **No endpoint** — keep static |
| 18 | `/Map` | `pages/Map.jsx` | 🟥 "App-Only" placeholder (fake SVG map) | Optional `GET /navigation/nodes` — keep static by design |
| 19 | `/contact` | `pages/Contact.jsx` | 🟥 form `alert()` only (EmailJS installed, unused) | **No endpoint** — wire EmailJS |
| 20 | `/faq` | `pages/FQA.jsx` | 🟥 `faqData` array + `alert()` submit | `GET /faqs` (**needs seeding**) |
| 21 | `/about` | `pages/Aboutus.jsx` | 🟥 static marketing; **2 broken `../../../public/...` image paths** | none (static) |
| — | shared | `shared/Navbar.jsx` | 🟥 photo from localStorage; **Search + Bell inert** | `GET /notifications/unread-count`, search |
| — | shared | `shared/Footer.jsx` | 🟥 dead `#` links | none |

---

## 3. Backend review (from `API_DOCUMENTATION.md` + live probes)

Grouped by controller. ✔ = confirmed live; ⚠ = doc/live mismatch; ✱ = admin-only.

### 3.1 Auth (`/users`)
`POST /signup` ✔ · `POST /login` ✔ (sets `jwt` + `refreshToken` cookies; lockout after 5) ·
`POST /logout` · `POST /forgotPassword` (`x-client-type: mobile` → 6-digit code) ·
`POST /verifyResetCode` → `resetToken` · `PATCH /resetPassword` (or `/resetPassword/:token`) ·
`POST /google|github|facebook` · `POST /link-provider` · `POST /refresh`.

### 3.2 User profile (`/users`)
`GET /me` (includes `preferences {darkMode, language, pushNotificationsEnabled}`) ·
`PATCH /updateMe` (**name, photo, preferences only — NOT email**; multipart for photo) ·
`PATCH /updateMyPassword` · `DELETE /deleteMe` (soft delete).

### 3.3 Flights (`/flights`)
`GET /flights` ✔ (200 records) · `GET /flights/updated` · `POST /flights/scan` (IATA BCBP) ·
`GET /flights/:id/updates` · `GET /flights/:id` · `POST /flights/:id/track` ·
`GET /flights/my-flight` (flight + airport + weather + `recommendations[]` + local times) ·
`PATCH /flights/:id/cancel-track` · ✱ `POST|PATCH|DELETE /flights`.
⚠ **Live flight shape:** `{ airline:{name,logo}, route:{from:"WAW",fromCode,to,toCode}, departure:{gate,scheduledTime,estimatedTime,actualTime,...}, arrival:{…}, flightNumber, status, type, direction }`.

### 3.4 Services (`/services`)
`GET /services` ✔ (175) · `GET /services/search?q=` · `GET /services/nearby?lng&lat` ·
`GET /services/counters/stats` · `GET /services/:id` · ✱ `POST|PATCH|DELETE /services`.
⚠ **Live service shape:** `{ _id, name, category, description, status, terminal, zone, gates[], services[], cuisine[], waitTime, rating, amenities[], images[], operatingHours:"HH:MM–HH:MM", location:{type:"Point",coordinates:[lng,lat]} }`. Categories present: `RESTAURANTS(60) SHOPS(50) COUNTERS(20) ACCESSIBILITY(20) FINANCIAL(15) VIP_SERVICES(10)`.

### 3.5 Navigation (`/navigation`)
`GET /nodes` ✔ (≈38 KB) · `POST /find-path` (Dijkstra).

### 3.6 Home (`/home`) ✔
Returns `{ userTrack, updatedFlights[], featuredServices[], metrics{activeUsers,flightsTracked,delays,airportsCovered,userRating}, categories[] }` (cached 5 min).

### 3.7 Chat (`/chat/query`)
Auth required. Gemini-backed; accepts `message` + optional `history[]`.

### 3.8 Notifications (`/notifications`) & Devices (`/devices`)
List / `unread-count` / `:id/read` / `read-all` / `subscribe` / delete; device `register`/`unregister`. (Web push out of scope; unread-count is usable for the Navbar bell.)

### 3.9 FAQ (`/faqs`)
`GET /faqs` ✔ but **0 records** · `GET /faqs/:id`. **No create endpoint** (seed via DB).

### 3.10 Stats (`/stats`) ✔ & Admin (`/admin`, `/users` ✱)
`GET /stats` (metrics) · `POST /stats/rate` (one rating/user). Admin dashboard + user CRUD (out of scope for this consumer app).

**No endpoints exist for:** airline directory, hotels, weather-standalone, contact form, FAQ submission. Pages depending on these stay static/external or use EmailJS.

---

## 4. Endpoint → screen mapping

| Endpoint | Screen(s) | Sufficient? | Action |
|---|---|---|---|
| `POST /users/login` | Login | ✅ | Route through `authAPI.login`; store token+user |
| `POST /users/signup` | Signup | ⚠ no `phone` | Drop phone (or make optional/no-op); send name/email/password/confirm |
| `POST /users/google\|github\|facebook` | Login, OAuthCallback | ✅ | Keep; centralize in `authAPI` |
| `/forgotPassword`,`/verifyResetCode`,`/resetPassword` | PasswordReset | ⚠ token unused | Pass `resetToken` into step 3 (`/resetPassword/:token`) |
| `GET /users/me` | Profile, EditProfile, Navbar | ✅ | Fetch on load; hydrate from server not localStorage |
| `PATCH /users/updateMe` | EditProfile, Profile(prefs) | ⚠ no email | Send name+photo(multipart)+preferences; make email read-only |
| `PATCH /users/updateMyPassword` | Profile (modal) | ✅ | Wire the currently-mocked modal |
| `DELETE /users/deleteMe` | Profile (danger zone) | ✅ | Call before clearing localStorage |
| `POST /users/logout` | Profile/EditProfile logout | ✅ | Call to clear server cookies |
| `GET /home` | Home, main1(metrics) | ✅ | Already used for flights; also drive metrics/featured |
| `GET /stats` | main1, Home | ✅ | Replace hardcoded metrics |
| `GET /flights/updated` | A_Scan (updated flights) | ✅ | Replace hardcoded cards |
| `GET /flights/my-flight` | Home, A_Scan, explore | ✅ | Tracked-flight card + explore recommendations |
| `POST /flights/scan` | A_Scan, Home (scan CTA) | ✅ | Needs real QR/BCBP capture (`html5-qrcode`) |
| `PATCH /flights/:id/cancel-track` | A_Scan (cancel) | ✅ | Wire "Cancel Tracking" |
| `GET /services?category=COUNTERS` | Counter_S | ⚠ field gaps | Map name→airline, use gates/services/status/waitTime |
| `GET /services/counters/stats` | Counter_S (stat bar) | ✅ | Replace computed counts |
| `GET /services?category=VIP_SERVICES` | Vip_S | ⚠ no per-feature image originally | Now seeded (images added) |
| `GET /services?category=FINANCIAL` | Financial_S | ⚠ no fee/rate/accepts | Show name/zone/status/hours; drop fee/rate/commission or schema-change |
| `GET /services?category=ACCESSIBILITY` | Accessabillity_S | ⚠ desc/img missing | Now seeded |
| `GET /services/search?q=` | Counter/Financial/Navbar search | ✅ | Optional server-side search |
| `POST /chat/query` | Chatbot | ✅ | Already wired; add auth guard |
| `GET /faqs` | FQA | ⚠ empty | Seed then wire |
| `GET /notifications/unread-count` | Navbar bell | ✅ | Show badge |
| (none) | Airline, Hotels, Contact, Map | — | Keep static / EmailJS / by-design placeholder |

---

## 5. Data-model differences (frontend expectation → API reality)

### 5.1 Flight (Home `mapFlight`, explore, A_Scan)
| Frontend expects | API returns | Fix |
|---|---|---|
| `airline` = string | `airline = { name, logo }` | Use `airline.name`, `airline.logo` |
| `route.from` = city ("Cairo") | IATA code ("WAW") | Display code, or map codes→cities client-side |
| `f.gate` (top level) | `departure.gate` (often `null`) | Read `departure.gate`; fallback "—" |
| `f.previousGate`, status `"GATE_CHANGE"` | not present (GATE_CHANGE is an *update field*, not a status) | Drop the gate-change branch or drive it from `/flights/:id/updates` |
| status Title-case | `ON_TIME / DELAYED / CANCELLED / BOARDING` | Existing `STATUS_COLOR`/formatter already handle enum |

### 5.2 Service (all four service pages)
| Frontend field | API field | Note |
|---|---|---|
| `airline`, `logo`, `bookingUrl` (Counter) | — | Derive airline from `name`; **no logo/bookingUrl in schema** (schema-change or client map) |
| `terminal`, `zone` | `terminal`, `zone` | ✅ direct |
| `gates`, `services` | `gates[]`, `services[]` | ✅ direct |
| `status "Open"/"Closed"` | `"Open"/"Busy"` (no "Closed" seen) | Handle "Busy"; treat non-Open as closed styling |
| `waitTime "~8 min"` | `waitTime` number (mostly `0`) | Format number→string; hide when 0 |
| `fee/accepts/rate/commission/hours` (Financial) | — (only `amenities/services/operatingHours`) | **Schema cannot hold these** → §10 schema rec or drop |
| card `image` (VIP/Accessibility) | `images[]` (was empty) | **Seeded** in `seed/` |
| `description`, `amenities` | same (were empty for some) | **Seeded** in `seed/` |

### 5.3 User (Profile/EditProfile/Signup)
| Frontend | API | Fix |
|---|---|---|
| edits `email` | `updateMe` ignores email | Make email read-only |
| `phone` (Signup) | not in model | Drop / make optional |
| `darkMode`, `language` in localStorage | `user.preferences.{darkMode,language,pushNotificationsEnabled}` | Sync via `updateMe` |
| `photo` = base64 in localStorage | `photo` = uploaded file → URL/filename | Upload multipart; use returned URL |

### 5.4 Envelope conventions
Success: `{ status:"success", token?, data:{ … } }`. Lists use `results` + `data:{ <plural>: [] }`. Errors: `{ status:"fail"|"error", message }` with codes in §Error table of the doc (400/401/403/404/409/423/500/503). All new service methods must read `res.data.data.<x>` and surface `res.data.message` on error.

---

## 6. Authentication flow

### 6.1 Current
Login/Signup/OAuth/Reset → API → store `auth_token` + `user_profile` in localStorage → redirect `/home`. Axios interceptor attaches `Bearer`. `withCredentials` also sends cookies. `useAuthGuard` gates a few clicks; Home/Vip self-redirect.

### 6.2 Issues to fix
1. **No 401 handling / no refresh.** Add an axios **response** interceptor: on `401`, attempt `POST /users/refresh` once, retry; on failure clear session → `/login`.
2. **Inconsistent route protection.** Introduce a `<ProtectedRoute>` (or a single `useRequireAuth` hook) and apply it uniformly (`/home /scan /vip /accessibility /profile /edit-profile /chatbot`, etc.). Public: `/ /login /signup /faq /about /contact /Airline /Hotels /Map`.
3. **Chatbot 401.** Guard `/chatbot` (chat requires auth) or show a "sign in to chat" state instead of the generic error.
4. **Profile is a mock.** Wire `getMe`, `updateMyPassword`, `deleteMe`, `logout`.
5. **Reset token discarded.** Thread `resetToken` from step 2 into step 3.
6. **Token storage.** Keep bearer-in-localStorage for simplicity (matches current interceptor); rely on cookies as secondary. Document the choice; don't mix half-and-half per page.

### 6.3 Target flow
`main.jsx` unchanged (keeps `GoogleOAuthProvider`). Add `AuthContext` providing `{ user, token, login(), logout(), refresh() }`, hydrated once via `GET /users/me` when a token exists; Navbar/Profile/EditProfile consume the context instead of reading localStorage directly.

---

## 7. State-management changes

Keep it lightweight (no Redux). Introduce:

- **`src/context/AuthContext.jsx`** — token + user + `login/logout/refresh`; hydrate from `GET /users/me`. Replaces scattered `localStorage.getItem("user_profile")` reads (Navbar, Profile, EditProfile).
- **Per-page async state** — each newly-wired page gets `{ data, loading, error }` via `useEffect`. Optionally a tiny `useFetch(fn, deps)` hook in `src/hooks/useFetch.js` to standardize loading/error/empty handling.
- **Preferences** — language/darkMode move from localStorage-only to `user.preferences` (write-through via `updateMe`, read from context). localStorage may remain a cache for first paint.
- **No global cache library required.** `/home` is already server-cached (5 min); client refetch on mount is fine.

---

## 8. API service layer (`utils/Api.js`)

`utils/Api.js` is a good base but must be (a) adopted everywhere and (b) extended. Required additions:

```
authAPI:      + logout (used), refresh, linkProvider           # some already present
userAPI:      + deleteMe, updatePreferences (updateMe wrapper), uploadPhoto (multipart)
flightAPI:    + getAll(params), getById(id), track(id,mins), cancelTrack(id), getUpdates(id)
servicesAPI:  + getById(id), nearby(lng,lat,distance), countersStats()   # search/getAll exist
faqAPI:       (getAll exists) + getById(id)
notificationsAPI: + getUnreadCount, (getAll/markRead/markAllRead exist)
statsAPI:     + rate(rating, review)                           # getStats exists
homeAPI:      (getDashboard exists)
```

Also in `utils/Api.js`:
- **Move `BASE_URL` to `import.meta.env.VITE_API_BASE_URL`** (see §10) instead of the hardcoded string.
- **Add the 401→refresh response interceptor** here (single source of truth).
- **Refactor Login/Signup/OAuthCallback/PasswordReset** to import `authAPI` instead of raw `axios`/`fetch` (they currently duplicate the base URL — 4 hardcoded copies).
- **`updateMe` must support multipart** when a `photo` File is present (set `Content-Type: multipart/form-data`).

---

## 9. Error / loading / empty-state handling

Adopt one consistent pattern for every wired page:

- **Loading:** skeleton cards / spinner in the grid area (never a blank screen). Service/flight grids already have card layouts to skeleton.
- **Error:** inline retry banner ("Couldn't load … Retry") — reuse the app's navy/gold styling. Surface `res.data.message` where present.
- **Empty:** each service page already has an empty state (e.g. `cs-empty`, `fs-empty`); reuse them for real "no results".
- **Auth errors (401/403):** funnel through the interceptor (refresh then redirect); don't render a generic failure.
- **Rate-limit (429/423) & lockout:** show the specific message (login lockout after 5 attempts → 423).
- **Chatbot:** already has a graceful fallback bubble; keep, but distinguish "not signed in" from "server error".
- **Images:** keep the existing `onError` fallbacks (Counter logo → SVG, explore/scan logos → hidden). Add for service `images[]` once wired.

---

## 10. Database review & schema-change recommendations

Confirmed from live data (see `DATA_AUDIT.md` for the full tables):

1. **Service schema is richer than the doc but missing consumer fields.** It has `zone/gates/services/cuisine/waitTime/images` and lacks `floor/reviews/facilities/phone/email/website/staff/estimatedWaitTime` from the doc.
   - **Recommendation:** align `API_DOCUMENTATION.md` to the real schema, OR (if the Financial page must show `fee/accepts/rate/commission`) add `financial` sub-fields to the service model. **These cannot be seeded into the current schema** — they're a backend model change, not content. For v1, render only fields that exist and drop fee/rate.
2. **`faqs` is empty** → seed it (done in `seed/faqs.seed.json`). No create-FAQ endpoint exists; recommend adding one if FAQ submission from the UI is desired (currently EmailJS/none).
3. **Content gaps on existing services** (missing `description`/`amenities`/`images`) → filled by `seed/services.patch.json` (content only, non-destructive). See §Data Audit.
4. **Counter services have no `logo`/`bookingUrl`.** Frontend Counter cards want an airline logo + booking link. **Schema change** (add `logo`, `bookingUrl`) *or* client-side derivation from `airline name` (recommended for v1 — no backend change).
5. **`operatingHours` type** differs from doc (string vs object) — align the doc.
6. **Flight `route.from` is an IATA code**, not a city — if the UI must show city names, either the backend joins an airport lookup or the client keeps a code→city map.

---

## 11. Environment variables

Create `.env` (and `.env.example`) at repo root; Vite exposes only `VITE_`-prefixed vars.

```
VITE_API_BASE_URL=https://gate-buddy-backend-production-f6df.up.railway.app/api/v1
VITE_GOOGLE_CLIENT_ID=1061190441173-9drkg312m1ar2c96iupalk85ckpcdljm.apps.googleusercontent.com
VITE_GITHUB_CLIENT_ID=Ov23li88HESnZEKNc5I5
VITE_FACEBOOK_APP_ID=1186697809728981
# Optional (Contact/FAQ email):
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```
Replace hardcoded copies of the base URL and client IDs in `utils/Api.js`, `main.jsx`,
`Login.jsx`, `Signup.jsx`, `OAuthCallback.jsx`, `PasswordReset.jsx`. **Note:** these IDs are
already committed in source (public client IDs, low risk) — still move them to env for hygiene.
Add `.env` to `.gitignore` (currently only `node_modules`).

---

## 12. Implementation roadmap (phased, ordered to minimize breakage)

Complexity: S ≈ ½ day, M ≈ 1–2 days, L ≈ 3+ days.

### Phase 0 — Foundation (no visible change) · **M**
- **Goal:** de-risk everything downstream.
- **Files:** `utils/Api.js`, new `.env`/`.env.example`, `.gitignore`, new `src/context/AuthContext.jsx`, new `src/hooks/useFetch.js`, `src/main.jsx` (wrap `<AuthProvider>`).
- **Deps:** none.
- **Do:** env vars; 401→refresh interceptor; complete the API helper methods (§8); AuthContext hydrated from `GET /users/me`.
- **Acceptance:** app builds; existing behavior unchanged; `getMe` populates context on refresh; a forced 401 triggers one refresh attempt.

### Phase 1 — Auth consolidation · **M**  *(depends on P0)*
- **Goal:** consistent, real auth.
- **Files:** `Login.jsx`, `Signup.jsx`, `OAuthCallback.jsx`, `PasswordReset.jsx` (use `authAPI`); new `ProtectedRoute` + `App.jsx` (wrap protected routes); `Navbar.jsx` (consume context).
- **Do:** route through `authAPI`; fix Signup phone; thread reset token; apply `<ProtectedRoute>`.
- **Acceptance:** login/signup/OAuth/reset all work via `authAPI`; protected routes redirect when logged out; logged-in refresh keeps session.

### Phase 2 — Profile & settings (real user data) · **M**  *(P1)*
- **Files:** `Profile.jsx`, `EditProfile.jsx`.
- **Do:** `getMe` hydrate; `updateMe` (name + photo multipart); email read-only; wire password modal → `updateMyPassword`; delete → `deleteMe`; logout → `POST /users/logout`; language/darkMode → `preferences`.
- **Acceptance:** profile reflects server; edits persist server-side and survive re-login on another device; password change enforces API rules; delete soft-deletes.

### Phase 3 — Home & landing metrics · **S–M**  *(P0)*
- **Files:** `Home.jsx`, `main1.jsx`.
- **Do:** fix `mapFlight` to live flight shape (§5.1); drive tracked-flight card from `GET /flights/my-flight`; replace static metrics with `GET /stats` (or `/home` metrics); featured services from `/home`.
- **Acceptance:** flight-update cards show real flights (correct gates/times); metrics match `/stats`; no console errors on `airline`/`route`.

### Phase 4 — Service directories · **L**  *(P0; independent of P1–P3)*
- **Files:** `Counter_S.jsx`, `Vip_S.jsx`, `Financial_S.jsx`, `Accessabillity_S.jsx`.
- **Do:** replace static arrays with `servicesAPI.getAll(category)`; map fields per §5.2; Counter stat bar from `/services/counters/stats`; keep tabs/search/empty states; loading skeletons.
- **Prereq:** run `seed/` first so descriptions/amenities/images are populated.
- **Acceptance:** each page lists real services with description, amenities and image; search/filter still work; open/closed styling correct.

### Phase 5 — Scan, tracked flight & explore · **L**  *(P3)*
- **Files:** `A_Scan.jsx`, `explore.jsx`; add `html5-qrcode` (per README roadmap).
- **Do:** real QR/BCBP capture → `POST /flights/scan`; updated-flights from `GET /flights/updated`; tracked card + cancel from `my-flight`/`cancel-track`; explore recommendations from `my-flight.recommendations`.
- **Acceptance:** scanning a boarding pass creates a track and renders the returned flight/weather/recommendations; cancel works; explore shows real recommendations.

### Phase 6 — FAQ, Chatbot guard, Navbar bell, Contact · **M**  *(P0/P1; needs seed for FAQ)*
- **Files:** `FQA.jsx` (`faqAPI.getAll`), `Chatbot.jsx` (auth guard), `Navbar.jsx` (`unread-count` badge + wire Search to `/services/search`), `Contact.jsx` (EmailJS).
- **Acceptance:** FAQ renders seeded items; chatbot guarded; bell shows unread count; contact sends email.

### Phase 7 — Cleanup & static pages · **S**
- **Files:** `Airline.jsx` (replace dead Clearbit logos), `Aboutus.jsx` (fix `../../../public/...` → `/images/...`), `Map.jsx` (leave by design), Footer dead links.
- **Acceptance:** no broken images; lint clean.

**Ordering rationale:** P0 unblocks all; P1/P2 are auth-critical; P4 (services) is the biggest UI win and is independent, so it can run in parallel with P1–P3; P5 depends on flight mapping from P3; seed runs before P4/P6.

---

## 13. Testing plan

For **every** wired feature run: functional · API · validation · auth · error · loading · empty · regression.

- **Auth:** signup (valid/dup email/weak pw/mismatch), login (ok/wrong/lockout-after-5/423), Google/GitHub/Facebook, reset (bad email/wrong code/expired/mismatch), refresh on expiry, logout clears cookies, protected-route redirect.
- **Profile:** getMe hydrate, update name/photo, email read-only, password change (wrong current/mismatch/same-as-old), delete (soft), preferences persist.
- **Home/landing:** flight cards map correctly (missing gate/estimated → "—"), metrics from `/stats`, `/home` cache behavior, unauth vs auth `userTrack`.
- **Services (×4):** list by category, tabs/search/filter, open/busy/closed styling, description/amenities/images present (post-seed), counters stats, empty query, 500 → retry banner.
- **Scan/explore:** valid BCBP, invalid format (400), flight-not-found (404), cancel track, recommendations render, no-active-track (404) empty state.
- **FAQ/Chatbot/Navbar/Contact:** FAQ list (post-seed), chatbot signed-in vs signed-out, multi-turn history, unread-count badge, contact email success/failure.
- **Cross-cutting regression:** every route still renders, ScrollToTop works, mobile nav, no layout shift vs current UI (screenshot diff), no new console errors, `npm run build` + `npm run lint` clean.
- **Network states:** offline, slow-3G (loading states), API down (error states), 401 mid-session (refresh).

---

## 14. Risks & mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **Cairo→Schiphol content swap** surprises stakeholders | High | Communicate before Phase 4; UI unchanged, only content; don't seed Egyptian data |
| **Doc vs live API shape drift** (flight/service) | High | Code against live shapes (§5); add a thin adapter layer; update the doc |
| Financial page needs `fee/rate/accepts` not in schema | Med | v1 drop them; propose schema change (§10.1) |
| Empty `faqs` | Med | Seed before Phase 6 |
| Clearbit logo host dead (Airline) | Low | Replace with Wikimedia/local logos (Phase 7) |
| No web-push infra | Low | Use `unread-count` only; defer push |
| Mixed cookie+bearer auth edge cases | Med | Single interceptor; pick bearer-primary; test refresh |
| Photo upload (multipart) regressions | Med | Test JPG/PNG ≤2MB; fall back to URL |
| Rate limits during test | Low | Respect limits; stagger automated tests |
| Seeding a shared/production DB | High | Dry-run + backup + sign-off; non-destructive gap-fill only (`seed/`) |

---

## Appendix A — File-by-file change list

| File | Phase | Change |
|---|---|---|
| `utils/Api.js` | 0 | env base URL; 401/refresh interceptor; add missing methods; multipart updateMe |
| `.env`, `.env.example`, `.gitignore` | 0 | new env config |
| `src/context/AuthContext.jsx` | 0 | new — token+user+login/logout/refresh |
| `src/hooks/useFetch.js` | 0 | new — loading/error/empty helper |
| `src/main.jsx` | 0 | wrap `<AuthProvider>` |
| `src/components/routing/ProtectedRoute.jsx` | 1 | new guard |
| `src/App.jsx` | 1 | wrap protected routes |
| `Login/Signup/OAuthCallback/PasswordReset.jsx` | 1 | use `authAPI`; fix phone + reset token |
| `shared/Navbar.jsx` | 1/6 | context user; bell unread-count; wire search |
| `Profile.jsx`, `EditProfile.jsx` | 2 | getMe/updateMe/password/delete/logout/prefs |
| `Home.jsx`, `main1.jsx` | 3 | fix mapFlight; my-flight; stats metrics |
| `Counter_S/Vip_S/Financial_S/Accessabillity_S.jsx` | 4 | servicesAPI by category; field mapping |
| `A_Scan.jsx`, `explore.jsx` | 5 | scan/updated/my-flight/cancel/recommendations |
| `FQA.jsx`, `Chatbot.jsx`, `Contact.jsx` | 6 | faqAPI; auth guard; EmailJS |
| `Airline.jsx`, `Aboutus.jsx`, `Footer.jsx` | 7 | logos; fix image paths; links |

## Appendix B — Deliverables produced by this task
- `PLAN.md` (this file) — Sections 1–14 (analysis + roadmap; **no app code changed**).
- `DATA_AUDIT.md` — §10.1 missing-data table + §10.2 photo audit.
- `CONTENT_FILL.md` — §10.3 drafted descriptions/amenities + sourcing rules.
- `seed/` — §10.4 DB content: `services.patch.json`, `faqs.seed.json`, `seed.mjs`, `README.md` (database-only, non-destructive, **not executed**).
