# Huntington Select — Row Level Security (RLS) Policy Plan

This document defines **who may read, insert, update, and delete** rows in the MVP Supabase tables, using three actor types:

| Actor | Meaning in Supabase |
|-------|---------------------|
| **Anonymous visitor** | Not signed in (`anon` role; no `auth.uid()`) |
| **Authenticated member** | Signed in with `profiles.role = 'member'` |
| **Admin** | Signed in with `profiles.role = 'admin'` |

It is a planning document only. It does **not** include SQL policies, migrations, or application code.

Related docs: [project-architecture.md](./project-architecture.md), [mvp-database-plan.md](./mvp-database-plan.md), [supabase-schema-draft.sql](./supabase-schema-draft.sql).

---

## Goals and assumptions

1. **RLS is enabled on every MVP table.** With no matching policy, access is denied (default deny).
2. **MVP pages** treat the offers catalog and member data as **member-only**; marketing and pricing do not require direct client reads of `offers` or credit tables for anonymous users.
3. **Credit mutations** (Stripe grants, redemptions, balance updates, ledger append) must run in **trusted server code** (Next.js API routes / Server Actions) using the **Supabase service role**, which bypasses RLS. Client-side inserts/updates to balances, ledger, and redemptions should be **denied** even for members, so bugs or tampering cannot move credits from the browser.
4. **Admin detection** in policies will eventually use the caller’s own `profiles` row (e.g. `role = 'admin'`). Admins are still authenticated users; they are not a separate Supabase Auth role unless you add one later.
5. **Profile creation** on sign-up is expected via a **database trigger** or **server-only** path using the service role, not arbitrary client inserts with a chosen `role`.

---

## Summary matrix

Legend: **Yes** = allowed by RLS for that actor (subject to row conditions). **No** = not allowed. **Own** = only rows where `id` or `user_id` equals `auth.uid()`. **Active** = `offers.status = 'active'`. **Server** = not via member/anon client; use service role on the server.

| Table | Operation | Anonymous | Member | Admin |
|-------|-----------|-----------|--------|-------|
| `profiles` | Read | No | Own row only | All rows |
| `profiles` | Insert | No | No (use sign-up flow / trigger) | No (same; service role for bootstrap) |
| `profiles` | Update | No | Own row; **cannot** change `role` | All rows (including `role`) |
| `profiles` | Delete | No | No | No (MVP: rely on `auth.users` cascade) |
| `offers` | Read | No | **Active** offers only | All offers |
| `offers` | Insert | No | No | Yes |
| `offers` | Update | No | No | Yes |
| `offers` | Delete | No | No | Yes (or soft-delete via `status`; product choice) |
| `credit_balances` | Read | No | Own row only | All rows |
| `credit_balances` | Insert | No | No | No (**Server**) |
| `credit_balances` | Update | No | No | No (**Server**; admin adjustments included) |
| `credit_balances` | Delete | No | No | No |
| `credit_ledger` | Read | No | Own rows only | All rows |
| `credit_ledger` | Insert | No | No | No (**Server**) |
| `credit_ledger` | Update | No | No | No (append-only) |
| `credit_ledger` | Delete | No | No | No |
| `redemptions` | Read | No | Own rows only | All rows |
| `redemptions` | Insert | No | No | No (**Server**) |
| `redemptions` | Update | No | No | No (MVP: no cancel flow in schema; **Server** if added later) |
| `redemptions` | Delete | No | No | No |

---

## 1. `profiles`

Extends `auth.users` with `email`, `role` (`member` | `admin`), and `created_at`.

### Read

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** No profile data for unsigned users. |
| Authenticated member | **Yes, own row only** (`id = auth.uid()`). Used for dashboard, account settings, and displaying email. Members must **not** read other members’ profiles. |
| Admin | **Yes, all rows.** Needed for admin overview, support, and reporting (e.g. member counts). |

### Insert

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No** for arbitrary inserts. On first sign-up, a row should be created by a **trigger on `auth.users`** or **server-side** logic with the service role, defaulting `role` to `member`. |
| Admin | **No** via normal client policies for creating profiles with elevated roles. New users still come through Auth + trigger/server. |

### Update

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **Yes, own row only**, with restrictions: may update fields such as `email` if the product allows; **must not** be allowed to set `role` to `admin` (policy should forbid changing `role` or only allow updates when `role` stays `member`). |
| Admin | **Yes, all rows**, including changing another user’s `role` for staff promotion (use carefully; consider audit logging in app later). |

### Delete

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No** (account deletion, if offered, should be a controlled server flow). |
| Admin | **No** in MVP via RLS; deleting auth users is handled through Supabase Auth and `on delete cascade` on `profiles.id`. |

---

## 2. `offers`

Global catalog: `title`, `description`, `category`, `credits_required`, `status` (`draft` | `active` | `archived`).

### Read

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** Offers are shown on member routes (`/offers`); visitors see marketing copy on static pages, not the live catalog via the anon key. |
| Authenticated member | **Yes, active offers only** (`status = 'active'`). Draft and archived offers are hidden from the member catalog and offer detail flows. |
| Admin | **Yes, all rows** (draft, active, archived) for `/admin/offers` and editing. |

### Insert

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** |
| Admin | **Yes.** Admins create new offers (typically starting as `draft`). |

### Update

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** |
| Admin | **Yes** on any offer (publish/unpublish via `status`, edit copy, `credits_required`, etc.). |

### Delete

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** |
| Admin | **Yes** if hard delete is desired, **or** **No** on delete with updates only to `status = 'archived'` (recommended for history integrity because `redemptions.offer_id` uses `on delete restrict`). Prefer **archive via update** in MVP. |

---

## 3. `credit_balances`

One row per member: `user_id` (PK), `balance` (≥ 0).

### Read

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **Yes, own row only** (`user_id = auth.uid()`). Powers dashboard balance display. |
| Admin | **Yes, all rows** for support and admin overview. |

### Insert

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** Initial row created when the profile is created (**Server** / trigger). |
| Admin | **No** via client RLS; balance changes go through **Server** with ledger entries. |

### Update

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** Prevents clients from inflating balance. Redemptions and purchases update balance on the **Server** only. |
| Admin | **No** via client RLS for the same reason; `admin_adjustment` flows use **Server** (service role) inside a transaction with `credit_ledger`. |

### Delete

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** |
| Admin | **No.** Row removed only if profile is deleted (cascade). |

---

## 4. `credit_ledger`

Append-only audit trail: `user_id`, `amount`, `type` (`purchase` | `redemption` | `admin_adjustment`), `description`, `created_at`.

### Read

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **Yes, own rows only** (`user_id = auth.uid()`). Powers `/account/history` and activity on the dashboard. |
| Admin | **Yes, all rows** for support and reporting. |

### Insert

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** Every insert is tied to Stripe webhook, redemption, or admin adjustment on the **Server**. |
| Admin | **No** via client RLS; admin adjustments use **Server** so `type` and `amount` stay consistent with balance updates. |

### Update

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** Ledger is append-only. |
| Admin | **No.** Corrections, if ever needed, should be new ledger rows (or service-role maintenance), not member-visible edits. |

### Delete

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** |
| Admin | **No** in MVP (preserve audit trail). |

---

## 5. `redemptions`

Records spend events: `user_id`, `offer_id`, `credits_used`, `created_at`.

### Read

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **Yes, own rows only** (`user_id = auth.uid()`). Redemption history and confirmation details. |
| Admin | **Yes, all rows** for “who redeemed what” reporting on `/admin`. |

### Insert

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** Redeem action runs on the **Server**: validate offer active, sufficient balance, then insert redemption, ledger row, and balance update in one transaction. |
| Admin | **No** via client RLS for normal flows; optional future “admin on behalf of member” would still be **Server** only. |

### Update

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** MVP schema has no `status` column; rows are immutable once created. |
| Admin | **No** via client in MVP. If cancellation is added later, handle via **Server** only. |

### Delete

| Actor | Access |
|-------|--------|
| Anonymous visitor | **No.** |
| Authenticated member | **No.** |
| Admin | **No** in MVP (keep redemption history). |

---

## Implementation notes (for when SQL is written)

- Enable RLS on all five tables before attaching policies.
- Use separate policies per operation (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) and per role (`authenticated`; typically **no policies for `anon`** on these tables).
- Implement an **`is_admin()`** helper (security definer, stable) that reads `profiles.role` for `auth.uid()`, to avoid duplicating admin checks.
- **Service role** (`SUPABASE_SERVICE_ROLE_KEY`) on Vercel: Stripe webhooks, redemption endpoint, profile/balance bootstrap, and admin credit adjustments. Never expose this key to the browser.
- **Anon key** in the browser is safe only because RLS denies sensitive operations; member reads still require a valid session (`authenticated`).
- Admins inherit **member** read rules where stricter row filters apply (e.g. members see only active offers; admin policies add broader `SELECT`). Admin does not need member-only insert rights on credits if all writes are server-side.
- Test matrix: sign in as member A and confirm no read/write on member B’s balance, ledger, or redemptions; confirm member cannot `SELECT` draft offers; confirm admin can manage offers and read all redemptions.

---

## Out of scope

- RLS for `stripe_customers`, `purchases`, or other tables mentioned in [project-architecture.md](./project-architecture.md) but not in the MVP schema draft.
- Actual `CREATE POLICY` statements, triggers, and migration files.
- Application route guards (middleware / server checks for `/admin`); those complement RLS but do not replace it.
