/**
 * Gate Buddy — DB content seeder (gap-fill only, non-destructive)
 * -----------------------------------------------------------------
 * This script ONLY fills gaps in existing data. It:
 *   1. Applies $set patches to existing `services` (description / amenities / images)
 *      identified in DATA_AUDIT.md — matched by _id, never overwriting a non-empty field.
 *   2. Upserts FAQ documents into the (currently empty) `faqs` collection, keyed by question.
 *
 * It performs NO deletes, NO drops, and NO overwrites of already-populated fields.
 * It is idempotent: running it twice produces the same result.
 *
 * Two run modes (choose with SEED_MODE):
 *   - SEED_MODE=mongo  (default) : connects with the `mongodb` driver using MONGODB_URI.
 *                                  Required for FAQs (there is no create-FAQ REST endpoint).
 *   - SEED_MODE=api             : applies ONLY the service patches via the admin REST API
 *                                  (PATCH /services/:id) using ADMIN_TOKEN. FAQs are skipped
 *                                  in this mode (endpoint does not exist).
 *
 * Usage (PowerShell):
 *   $env:MONGODB_URI="mongodb+srv://.../test"; node seed/seed.mjs
 *   $env:DRY_RUN="1"; $env:MONGODB_URI="..."; node seed/seed.mjs      # preview, no writes
 *   $env:SEED_MODE="api"; $env:ADMIN_TOKEN="<jwt>"; node seed/seed.mjs
 *
 * See seed/README.md for details. NEVER run against production without a backup/confirmation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, f), "utf8"));

const servicePatches = read("services.patch.json");
const faqs = read("faqs.seed.json");

const DRY_RUN = process.env.DRY_RUN === "1";
const MODE = process.env.SEED_MODE || "mongo";
const API_BASE =
  process.env.API_BASE ||
  "https://gate-buddy-backend-production-f6df.up.railway.app/api/v1";

const log = (...a) => console.log(...a);

// Only these fields may be written by the seeder.
const ALLOWED_FIELDS = ["description", "amenities", "images"];

function buildSet(patchSet, existing) {
  // Never overwrite a field that already has a value in the DB.
  const out = {};
  for (const k of ALLOWED_FIELDS) {
    if (!(k in patchSet)) continue;
    const cur = existing?.[k];
    const empty =
      cur === undefined ||
      cur === null ||
      cur === "" ||
      (Array.isArray(cur) && cur.length === 0);
    if (empty) out[k] = patchSet[k];
  }
  return out;
}

async function runMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required for SEED_MODE=mongo");
  const { MongoClient, ObjectId } = await import("mongodb");
  const client = new MongoClient(uri);
  await client.connect();
  try {
    const db = client.db(); // db name comes from the URI (…/test)
    const services = db.collection("services");
    const faqCol = db.collection("faqs");

    // --- services ---
    let sChanged = 0,
      sSkipped = 0;
    for (const p of servicePatches) {
      let existing = null;
      try {
        existing = await services.findOne({ _id: new ObjectId(p._id) });
      } catch {
        existing = await services.findOne({ _id: p._id });
      }
      if (!existing) {
        log(`  ! service not found, skipping: ${p._id} (${p.name})`);
        sSkipped++;
        continue;
      }
      const set = buildSet(p.set, existing);
      if (Object.keys(set).length === 0) {
        sSkipped++;
        continue;
      }
      log(`  ~ ${p.category} ${p.name} -> ${Object.keys(set).join(", ")}`);
      if (!DRY_RUN) await services.updateOne({ _id: existing._id }, { $set: set });
      sChanged++;
    }
    log(`services: ${sChanged} patched, ${sSkipped} already complete/skipped`);

    // --- faqs (upsert by question) ---
    let fUp = 0;
    for (const f of faqs) {
      log(`  + FAQ [${f.category}] ${f.question}`);
      if (!DRY_RUN)
        await faqCol.updateOne(
          { question: f.question },
          { $setOnInsert: { isActive: true, ...f, createdAt: new Date() } },
          { upsert: true }
        );
      fUp++;
    }
    log(`faqs: ${fUp} upserted`);
  } finally {
    await client.close();
  }
}

async function runApi() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) throw new Error("ADMIN_TOKEN is required for SEED_MODE=api");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  let ok = 0,
    fail = 0;
  for (const p of servicePatches) {
    // Fetch current record so we never overwrite a populated field.
    const cur = await fetch(`${API_BASE}/services/${p._id}`).then((r) =>
      r.ok ? r.json() : null
    );
    const existing = cur?.data?.service ?? {};
    const set = buildSet(p.set, existing);
    if (Object.keys(set).length === 0) continue;
    log(`  ~ ${p.category} ${p.name} -> ${Object.keys(set).join(", ")}`);
    if (DRY_RUN) {
      ok++;
      continue;
    }
    const res = await fetch(`${API_BASE}/services/${p._id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(set),
    });
    if (res.ok) ok++;
    else {
      fail++;
      log(`    ! PATCH failed ${res.status} for ${p._id}`);
    }
  }
  log(`services via API: ${ok} ok, ${fail} failed`);
  log("faqs: SKIPPED (no create-FAQ REST endpoint — use SEED_MODE=mongo for FAQs)");
}

(async () => {
  log(
    `Gate Buddy seeder — mode=${MODE}${DRY_RUN ? " (DRY RUN)" : ""}  ` +
      `${servicePatches.length} service patches, ${faqs.length} faqs`
  );
  if (MODE === "api") await runApi();
  else await runMongo();
  log("Done.");
})().catch((e) => {
  console.error("SEED FAILED:", e.message);
  process.exit(1);
});
