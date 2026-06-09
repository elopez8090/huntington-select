# Huntington Select — Offers Table Schema (v2)

This document proposes an **improved `offers` table** for a production-ready MVP: everything in the current database, plus fields that support richer catalog cards, partner details, legal copy, and admin workflows.

It is **design documentation only**. It does not change [supabase/migrations/001_initial_schema.sql](../supabase/migrations/001_initial_schema.sql) or application code. When you implement v2, add a **new migration** (do not edit the initial migration).

For context, see:

- [project-architecture.md](./project-architecture.md) — roles, credits, redemption flow
- [mvp-database-plan.md](./mvp-database-plan.md) — MVP tables and relationships
- [mvp-pages.md](./mvp-pages.md) — **Offers**, **Offer Details**, and **Manage Offers** data needs

---

## Purpose of the `offers` table

The `offers` table is the **member-facing catalog** of benefits (dining, events, services, partner perks). Admins create and maintain rows; members browse **active** offers and spend credits at redemption time. Each redemption links to an offer via `redemptions.offer_id`.

**Production-ready MVP goals for v2:**

- Show compelling **list cards** (title, short blurb, image, category, credit cost) on `/offers`
- Show **full detail** on `/offers/[id]` (description, how to redeem, terms, merchant contact, location)
- Let admins **publish, feature, and expire** offers without hard deletes (keep history via `redemptions`)
- Support **emails** (redemption confirmation) with merchant name and clear instructions

---

## Relationship to other tables

| Related table | Relationship |
|---------------|--------------|
| `redemptions` | Many redemptions per offer (`redemptions.offer_id` → `offers.id`). Prefer `status = 'archived'` over delete when redemptions exist. |
| `profiles` | No direct FK. Admins edit offers through elevated access (RLS / server routes). |

**Visibility rule (unchanged from v1):** Authenticated members typically read offers where `status = 'active'`; admins read and write all statuses (`draft`, `active`, `archived`).

---

## Field reference

Each column below lists **purpose**, **PostgreSQL-style data type**, and **required vs optional** for a new or migrated schema. “Required” means **NOT NULL** with no sensible default at insert time (admins must supply a value). “Optional” means nullable or has a default so the row can be created with minimal data (e.g. draft offers).

### Identity and catalog (existing)

| Field | Purpose | Data type | Required / optional |
|-------|---------|-----------|---------------------|
| `id` | Stable primary key for URLs (`/offers/[id]`), redemptions, and admin edits. | `uuid` (PK, default `gen_random_uuid()`) | **Required** (auto-generated) |
| `title` | Short name on offer cards, admin table, redemption history, and confirmation emails. | `text` | **Required** |
| `description` | Full offer copy on the offer detail page; can include markdown or plain text (implementation choice). | `text` | **Required** (empty string allowed for drafts if you use a default, as in v1) |
| `category` | Groups offers in the catalog (tabs/filters on `/offers`), e.g. dining, events, wellness. | `text` | **Required** (default `'general'` is acceptable) |
| `credits_required` | Credits debited for one redemption; must match what is stored on `redemptions.credits_used` at redeem time. | `integer` (check: `> 0`) | **Required** |
| `status` | Lifecycle: `draft` (admin only), `active` (members see and can redeem), `archived` (hidden; history preserved). | `text` (check: `draft`, `active`, `archived`) | **Required** (default `'draft'`) |
| `created_at` | When the offer row was first created; useful for admin sorting and audit. | `timestamptz` (default `now()`) | **Required** (auto-set) |

### Presentation and discovery (recommended additions)

| Field | Purpose | Data type | Required / optional |
|-------|---------|-----------|---------------------|
| `short_description` | One or two lines for **offer cards** on `/offers` without truncating `description`. Keeps list UI fast and readable on mobile. | `text` | **Optional** (fallback: truncate `description` in the app until populated) |
| `image_url` | Hero/card image (partner logo or photo). Can point to **Supabase Storage** public URL or a vetted external HTTPS URL. | `text` | **Optional** (show placeholder when null) |
| `featured` | When `true`, surface the offer on dashboard highlights or a “Featured” section (still must be `status = 'active'` to redeem). | `boolean` | **Optional** (default `false`) |

### Partner / merchant (recommended additions)

| Field | Purpose | Data type | Required / optional |
|-------|---------|-----------|---------------------|
| `merchant_name` | Display name of the partner business (emails, detail page, support). May differ from `title` (e.g. title = “20% off dinner”, merchant = “Harbor Bistro”). | `text` | **Optional** (recommended for partner offers) |
| `merchant_website` | Link for “Visit website” on offer detail; validate as HTTPS in admin UI. | `text` | **Optional** |
| `merchant_phone` | Click-to-call or support reference on offer detail and optional email footer. | `text` | **Optional** |
| `location` | Human-readable place: address, neighborhood, or “Valid at all locations.” For MVP, a single text field is enough; geocoding can come later. | `text` | **Optional** |

### Validity and compliance (recommended additions)

| Field | Purpose | Data type | Required / optional |
|-------|---------|-----------|---------------------|
| `expiration_date` | Last calendar day (or instant) the offer is valid for members; hide or block redemption after this time even if `status = 'active'`. Complements `status` and supports “limited time” offers. | `date` or `timestamptz` | **Optional** (null = no fixed end date; align app logic with product rules) |
| `redemption_instructions` | Step-by-step text after redeem: show code, mention booking, present member ID, etc. Shown on offer detail and in **redemption confirmation** email. | `text` | **Optional** (strongly recommended before setting `active`) |
| `terms_and_conditions` | Legal/limitation text (exclusions, max party size, blackout dates). Shown on offer detail; members acknowledge implicitly by redeeming (exact UX is an app choice). | `text` | **Optional** (recommended for partner compliance) |

### Audit (recommended addition)

| Field | Purpose | Data type | Required / optional |
|-------|---------|-----------|---------------------|
| `updated_at` | Last time an admin (or system) changed the offer; supports admin “last edited” and debugging. Set via trigger or application on every update. | `timestamptz` (default `now()`, updated on change) | **Required** in v2 (auto-maintained; not null) |

---

## Notes on naming and overlap

- **`credits_required`** — Keep this name to match the live migration and [mvp-database-plan.md](./mvp-database-plan.md). [project-architecture.md](./project-architecture.md) uses `credit_cost` in places; treat that as the same concept.
- **`expiration_date` vs `starts_at` / `ends_at`** — Architecture mentions optional `starts_at` and `ends_at`. For MVP v2, **`expiration_date`** is enough for “valid until.” Add `starts_at` later if you need scheduled publish windows without flipping `status` manually.
- **`created_at`** — Already present in v1; keep it. **`updated_at`** is new and should be added when you migrate.

---

## Suggested constraints and indexes (when you migrate)

Document-only recommendations for the future migration:

| Recommendation | Why |
|----------------|-----|
| Check `status` in (`draft`, `active`, `archived`) | Same as v1; keeps RLS and member queries simple. |
| Check `credits_required > 0` | Prevents invalid redemptions. |
| Index on `(status)` | Member catalog: `where status = 'active'`. |
| Index on `(category)` | Category filters on `/offers`. |
| Index on `(featured)` where `featured = true` and `status = 'active'` | Optional partial index for featured queries. |
| Index on `(expiration_date)` | Optional: find expiring offers for admin reminders. |

Do not expose secret Storage keys in the browser; serve public images via public bucket URLs or signed URLs from server code if buckets are private.

---

## How pages use v2 fields

| Page | Fields used |
|------|-------------|
| **Offers** (`/offers`) | `title`, `short_description`, `image_url`, `category`, `credits_required`, `featured`, `status` (active only), optional `expiration_date` for badges (“Ends soon”) |
| **Offer Details** (`/offers/[id]`) | All display fields above plus `description`, `merchant_*`, `location`, `redemption_instructions`, `terms_and_conditions`, `expiration_date`; redeem uses `credits_required` and `status` |
| **Manage Offers** (`/admin/offers`) | Full row including `status`, `featured`, `updated_at`, `created_at` |
| **Redemption email** | `title`, `merchant_name`, `redemption_instructions`, `credits_required` (from redemption snapshot where possible) |

Redemption logic should still validate: **`status = 'active'`**, **`expiration_date`** not passed (if set), and member **balance ≥ `credits_required`**, in a **server-only** transaction (ledger + balance + `redemptions`).

---

## v1 → v2 summary

| Category | v1 (current migration) | v2 (this document) |
|----------|------------------------|---------------------|
| Core | `id`, `title`, `description`, `category`, `credits_required`, `status`, `created_at` | **Unchanged** (keep all) |
| UX | — | `short_description`, `image_url`, `featured` |
| Partner | — | `merchant_name`, `merchant_website`, `merchant_phone`, `location` |
| Compliance / validity | — | `expiration_date`, `redemption_instructions`, `terms_and_conditions` |
| Audit | `created_at` only | Add **`updated_at`** |

---

## Next step (implementation)

When ready:

1. Create a **new** Supabase migration that `ALTER TABLE public.offers ADD COLUMN ...` for each new field (with defaults where noted).
2. Add a trigger or app rule to set **`updated_at`** on update.
3. Extend admin forms and member pages per [mvp-pages.md](./mvp-pages.md).
4. Keep RLS aligned: members select active offers; admins full CRUD.

This file alone does not run migrations or change the app; it is the agreed target shape for the offers catalog before implementation.
