# 🇸🇱 SL Import Cost Calculator — Project Plan

## Overview

A modern, real-time web application that estimates the total landed cost of importing goods into Sierra Leone. Built with **Next.js 16 + Convex + Tailwind CSS**, designed to be genuinely useful for businesses, NGOs, and individuals importing goods into SL.

---

## What Makes This Unique

Most import calculators are boring form → result pages. This one stands out by being:

1. **SL-Specific** — Built around Sierra Leone's actual tariff structure (ECOWAS CET 5-band system), GST, excise duties, ECOWAS levy, and customs processing fees. Not a generic "global calculator."
2. **Real-Time & Collaborative** — Powered by Convex's reactive backend, calculations are saved and synced in real-time. Share a calculation link with a colleague and they see updates live.
3. **Smart Category System** — Users pick from a curated list of common import categories (electronics, vehicles, building materials, food, medical equipment, etc.) rather than looking up HS codes manually.
4. **Calculation History** — Every estimate is saved and searchable. Compare past imports, track cost trends over time.
5. **Multi-Currency Support** — Enter values in USD, EUR, GBP, or SLL (Leones) with live exchange rate conversion.
6. **PDF Export** — Generate a professional cost breakdown sheet to attach to procurement documents or share with suppliers.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16 (App Router) | Turbopack default, async params, React 19.2, SSR |
| **Backend** | Convex | Real-time sync, serverless, TypeScript-native |
| **Styling** | Tailwind CSS + shadcn/ui | Fast, consistent, beautiful components |
| **Auth** | Convex Auth (`@convex-dev/auth`) | Built-in auth, no external service needed |
| **Deployment** | Netlify + Convex Cloud | Git-based deploys, preview environments |
| **Exchange Rates** | ExchangeRate-API (free tier) | Or a Convex cron job to cache rates |

---

## Next.js 16 — Key Notes

Next.js 16 brings several important changes from v15 that must be accounted for during development:

| Change | Impact | Action Required |
|--------|--------|----------------|
| **Turbopack stable default** | 10x faster Fast Refresh, 2-5x faster builds | Remove any `--turbopack` flags; it's now default |
| **Async params & searchParams** | Breaking change — all dynamic route params are now async | Use `const params = await props.params` in pages/layouts |
| **middleware.ts → proxy.ts** | Network boundary clarification | Rename middleware file if used |
| **Cache Components** | New `"use cache"` directive for opt-in caching | Replace old caching strategies where appropriate |
| **React 19.2** | Latest React with improved server components | Ensure all deps are React 19.2 compatible |
| **Minimum Node.js 20.9.0** | Older Node versions no longer supported | Verify Node version before development |
| **File system caching stable** | Persistent cache between builds | Better build performance out of the box |

**Migration command (if upgrading an existing project):**
```bash
npx @next/codemod@canary upgrade latest
```

---

## Authentication — Convex Auth

Using **Convex Auth** (`@convex-dev/auth`), a built-in authentication library that runs directly in the Convex backend. No external auth service required.

### Why Convex Auth
- Zero external dependencies — auth lives alongside your data
- Supports: Magic Links, OTPs, OAuth (80+ providers via Auth.js), Passwords
- Users table automatically integrated into Convex schema
- Beta status is acceptable for an MVP

### Auth Setup Steps

```bash
# Install
npm install @convex-dev/auth @auth/core
```

**1. Configure `convex/auth.ts`:**
```typescript
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password, GitHub],
});
```

**2. Update `convex/schema.ts`** — add auth tables:
```typescript
import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  // ... your other tables
});
```

**3. Wrap app in `ConvexAuthProvider`:**
```typescript
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// In your layout or providers file
<ConvexAuthProvider client={convex}>
  {children}
</ConvexAuthProvider>
```

### SSR Note
Convex Auth's Next.js SSR support is under active development. For the MVP, client-side auth is fully functional. If SSR auth becomes critical, **Better Auth + Convex** (`@convex-dev/better-auth`) is the fallback — it has documented Next.js 16 support and requires Convex 1.25.0+.

### MVP Auth Strategy
- Phase 1: Session-based (anonymous) — no auth required
- Phase 2: Add Convex Auth for persistent user accounts
- Fallback: Migrate to Better Auth if SSR issues arise

---

## Deployment — Netlify + Convex Cloud

Fully supported deployment path. Convex has first-class Netlify integration.

### Netlify Configuration

**`netlify.toml`:**
```toml
[build]
  command = "npx convex deploy --cmd 'npm run build'"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
```

### Environment Variables (Netlify Dashboard)

| Variable | Source | Purpose |
|----------|--------|---------|
| `CONVEX_DEPLOY_KEY` | Convex Dashboard → Settings → Deploy Keys | Authenticates Convex deploys |
| `NEXT_PUBLIC_CONVEX_URL` | Auto-set by Convex during build | Frontend connects to Convex |

### Deploy Keys Setup
1. Go to your Convex dashboard → Settings → Deploy Keys
2. Generate a **Production** deploy key → set in Netlify env vars
3. (Optional) Generate a **Preview** deploy key → for branch preview deploys

### How It Works
- Push to git → Netlify auto-builds
- Build command runs `npx convex deploy` which deploys Convex functions first, then builds Next.js
- Convex automatically sets `NEXT_PUBLIC_CONVEX_URL` during the build
- Preview deployments get separate Convex backends per branch (if preview deploy key is configured)

---

## Sierra Leone Import Cost Structure

Based on current regulations (verified against NRA, ECOWAS, and Trade.gov sources — updated for Finance Acts 2025/2026), imports into SL are subject to the following charges calculated on **CIF value** (Cost + Insurance + Freight):

### Tax/Duty Components

| Component | Rate | Applies To | Source / Status |
|-----------|------|-----------|----------------|
| **Import Duty** | 0%, 5%, 10%, 20%, 35% | All imports (based on ECOWAS CET band) | ✅ Verified — ECOWAS CET 5-band system |
| **Goods & Services Tax (GST)** | 15% | All imports | ✅ Verified — GST Act 2009, unchanged |
| **ECOWAS Community Levy** | 0.5% | Non-ECOWAS origin goods | ✅ Verified — ECOWAS official documents |
| **Excise Duty** | 5% – 35% (varies) | Select goods only | ✅ Verified — Excise Act 1982 + Finance Acts |
| **Customs Processing Fee** | ~1.5% | All imports | ⚠️ Estimated — exact rate not publicly published |
| **CISS Fee (Destination Inspection)** | ~1% | Most imports | ⚠️ Estimated — confirmed operational, rate not published |

### ECOWAS CET Five-Band Tariff Structure

| Band | Rate | Category | Examples |
|------|------|----------|----------|
| Band 0 | 0% | Essential social goods | Medical equipment, some pharmaceuticals |
| Band 1 | 5% | Essential goods, raw materials, capital goods | Basic foodstuffs, machinery, industrial inputs |
| Band 2 | 10% | Inputs & intermediate goods | Semi-finished products, parts |
| Band 3 | 20% | Final consumer goods | Electronics, clothing, vehicles, household goods |
| Band 4 | 35% | Specific goods for economic development | Goods where local production exists |

### Recent Changes (Finance Acts 2025/2026)

| Item | Previous Rate | New Rate | Effective |
|------|-------------|----------|-----------|
| Rice import duty | 0% → 5% (2025) | 10% | January 2026 |
| Cooking gas (LPG) | Standard | 5% → 0% | 2026 (clean cooking initiative) |
| Cement | Standard | Additional 10 Leones/bag levy | 2025 |
| Corporate Income Tax | 25% | 30% (restored) | 2026 |

*Note: Core GST (15%), ECOWAS levy (0.5%), and CET band structure remain unchanged.*

### GST Exemptions

The following are exempt from 15% GST:
- Rice, piped water, fuel
- Books and educational materials
- Medical and educational services
- Pharmaceuticals

### Exemptions to Note

- **ECOWAS Origin Goods**: Duty-free if wholly produced, sufficiently transformed, or with 35% value addition in ECOWAS member states
- **Diplomatic/UN Imports**: Tariff exemptions extended
- **AfCFTA**: Duty-free preference for products originating from African Continental Free Trade Area member states
- **Duty-Free Items**: Textbooks, medical equipment, agricultural inputs & machinery

### Calculation Formula

```
CIF Value = FOB Price + Shipping Cost + Insurance

Import Duty = CIF × Duty Rate (based on CET band)
ECOWAS Levy = CIF × 0.5% (if non-ECOWAS origin)
Excise Duty = CIF × Excise Rate (if applicable)
Customs Processing Fee = CIF × 1.5% (estimated)
CISS Fee = CIF × 1% (estimated)

GST = (CIF + Import Duty + Excise Duty) × 15%

Total Landed Cost = CIF + Import Duty + GST + ECOWAS Levy + Excise + Processing Fee + CISS
```

---

## Convex Data Model

### Schema (`convex/schema.ts`)

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Auth tables (users, sessions, accounts, etc.)
  ...authTables,

  // Predefined product categories with their tariff info
  categories: defineTable({
    name: v.string(),               // "Electronics - Consumer"
    description: v.string(),         // "Phones, laptops, TVs, etc."
    hsCodeRange: v.string(),         // "8471-8528"
    cetBand: v.number(),             // 0-4
    dutyRate: v.number(),            // 0, 5, 10, 20, or 35
    exciseApplicable: v.boolean(),
    exciseRate: v.optional(v.number()),
    gstExempt: v.optional(v.boolean()),  // For GST-exempt items
    icon: v.string(),                // Emoji or icon name
  }).index("by_name", ["name"]),

  // Individual calculations
  calculations: defineTable({
    // Input data
    productDescription: v.string(),
    categoryId: v.id("categories"),
    fobPrice: v.number(),            // in USD
    shippingCost: v.number(),
    insuranceCost: v.number(),
    quantity: v.number(),
    currency: v.string(),            // USD, EUR, GBP, SLL
    exchangeRate: v.number(),        // Rate to USD at time of calc
    originCountry: v.string(),
    isEcowasOrigin: v.boolean(),

    // Computed results (stored for history)
    cifValue: v.number(),
    importDuty: v.number(),
    gst: v.number(),
    ecowasLevy: v.number(),
    exciseDuty: v.number(),
    processingFee: v.number(),
    cissFee: v.number(),
    totalLandedCost: v.number(),

    // Metadata
    createdAt: v.number(),
    notes: v.optional(v.string()),
    // sessionId for anonymous users, userId for authenticated users
    sessionId: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  // Cached exchange rates (updated by cron)
  exchangeRates: defineTable({
    baseCurrency: v.string(),
    rates: v.object({
      USD: v.number(),
      EUR: v.number(),
      GBP: v.number(),
      SLL: v.number(),
    }),
    updatedAt: v.number(),
  }),
});
```

### Key Convex Functions

| Function | Type | Purpose |
|----------|------|---------|
| `categories.list` | Query | Get all product categories |
| `categories.getById` | Query | Get single category details |
| `calculations.create` | Mutation | Run calculation & save result |
| `calculations.listBySession` | Query | Get anonymous user's history (real-time) |
| `calculations.listByUser` | Query | Get authenticated user's history |
| `calculations.getById` | Query | Get single calculation (for sharing) |
| `calculations.delete` | Mutation | Remove a saved calculation |
| `exchangeRates.getCurrent` | Query | Get latest cached exchange rates |
| `exchangeRates.refresh` | Action | Fetch fresh rates from API (cron-triggered) |

---

## App Pages & Routes

```
/                         → Landing page with calculator hero
/calculator               → Main calculator page
/calculator/[id]          → Shareable calculation result
/history                  → Saved calculations list
/categories               → Browse all import categories & rates
/about                    → How SL import duties work (educational)
/auth/signin              → Sign in page (Phase 2)
```

---

## UI/UX Design Direction

### Aesthetic: "West African Fintech"
A clean, modern fintech feel infused with warm, earthy tones inspired by Sierra Leone — think amber/gold accents (from the SL flag), deep greens, warm sand tones on a clean white/off-white canvas. Not generic corporate blue.

### Key Design Elements:
- **Color Palette**: Deep forest green (#1B4332), warm gold/amber (#D4A017), off-white (#FAF8F5), charcoal (#1C1917), muted terracotta (#C4644A)
- **Typography**: A distinctive display font (e.g., Bricolage Grotesque, Outfit, or DM Sans) paired with a clean body font
- **Cards with subtle depth**: Soft shadows, rounded corners, micro-animations on hover
- **Progress visualization**: Animated stacked bar showing cost breakdown proportions
- **Flag accent**: Subtle green-white-blue gradient line or element inspired by the SL flag

### Calculator UX Flow:
1. **Select Category** → Visual grid of category cards with icons
2. **Enter Details** → Clean form: FOB price, shipping, insurance, origin, quantity
3. **See Breakdown** → Animated cost breakdown with each component visualized
4. **Actions** → Save, Share link, Export PDF, Start new calculation

---

## Feature Roadmap

### MVP (Phase 1) — Build This First
- [ ] Product category selection (pre-seeded data)
- [ ] Calculator form with all inputs
- [ ] Real-time cost breakdown display
- [ ] Convex backend with calculation storage
- [ ] Session-based calculation history (no auth needed)
- [ ] Responsive design (mobile-first)
- [ ] Shareable calculation links
- [ ] Disclaimers on estimated fees (processing fee, CISS)

### Phase 2 — Enhancements
- [ ] Convex Auth integration (user accounts, persistent history)
- [ ] Multi-currency input with live exchange rates (Convex cron job)
- [ ] PDF export of cost breakdown
- [ ] "Compare" mode — side-by-side two calculations
- [ ] Educational tooltips explaining each duty/tax component
- [ ] Dark mode

### Phase 3 — Advanced
- [ ] HS code search/lookup (searchable database)
- [ ] Bulk import calculator (CSV upload → batch results)
- [ ] Admin panel to update duty rates when regulations change
- [ ] WhatsApp share integration (huge in SL)
- [ ] Rate change notifications (alert users when Finance Act changes affect their saved categories)

---

## Project Structure

```
sl-import-calculator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   ├── calculator/
│   │   ├── page.tsx                # Main calculator
│   │   └── [id]/page.tsx           # Shared calculation view
│   ├── history/
│   │   └── page.tsx                # Calculation history
│   ├── categories/
│   │   └── page.tsx                # Browse categories & rates
│   ├── about/
│   │   └── page.tsx                # Educational page
│   └── auth/
│       └── signin/page.tsx         # Sign in (Phase 2)
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── calculator/
│   │   ├── CategoryPicker.tsx
│   │   ├── CalculatorForm.tsx
│   │   ├── CostBreakdown.tsx
│   │   ├── CostBar.tsx             # Visual stacked bar
│   │   └── ShareButton.tsx
│   ├── history/
│   │   ├── HistoryList.tsx
│   │   └── HistoryCard.tsx
│   ├── auth/
│   │   └── SignInForm.tsx           # Convex Auth sign-in (Phase 2)
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ConvexClientProvider.tsx  # Wraps ConvexAuthProvider
├── convex/
│   ├── schema.ts                   # Data model (includes authTables)
│   ├── auth.ts                     # Convex Auth config (Phase 2)
│   ├── categories.ts               # Category queries
│   ├── calculations.ts             # Calculation mutations & queries
│   ├── exchangeRates.ts            # Exchange rate actions
│   ├── seed.ts                     # Seed categories data
│   └── crons.ts                    # Scheduled exchange rate refresh
├── lib/
│   ├── calculator.ts               # Pure calculation logic
│   ├── constants.ts                # Tax rates, fee percentages
│   ├── currencies.ts               # Currency config
│   └── utils.ts
├── public/
│   └── ...
├── tailwind.config.ts
├── next.config.ts
├── netlify.toml                    # Netlify deployment config
├── convex.json
└── package.json
```

---

## Getting Started (Commands for Claude Code)

```bash
# 0. Verify Node.js version (must be >= 20.9.0 for Next.js 16)
node -v

# 1. Create Next.js 16 project
npx create-next-app@latest sl-import-calculator --typescript --tailwind --eslint --app --src-dir=false

# 2. Navigate into project
cd sl-import-calculator

# 3. Install Convex
npm install convex

# 4. Install Convex Auth (Phase 2, but set up schema now)
npm install @convex-dev/auth @auth/core

# 5. Install shadcn/ui
npx shadcn@latest init

# 6. Install useful shadcn components
npx shadcn@latest add button card input select label badge tabs separator tooltip sheet dialog

# 7. Initialize Convex (will open browser for auth)
npx convex dev

# 8. Additional dependencies
npm install lucide-react             # Icons
npm install @tanstack/react-table    # For history table (optional)
npm install html2canvas jspdf        # PDF export (Phase 2)

# 9. Create netlify.toml for deployment config
# (see Deployment section above for contents)
```

---

## Seed Data — Common SL Import Categories

These should be pre-seeded into the Convex `categories` table:

| Category | CET Band | Duty Rate | Excise | GST Exempt | Icon |
|----------|----------|-----------|--------|-----------|------|
| Electronics - Consumer | 3 | 20% | No | No | 📱 |
| Electronics - Industrial/IT | 1 | 5% | No | No | 💻 |
| Vehicles - Passenger | 3 | 20% | Yes (varies) | No | 🚗 |
| Vehicles - Commercial | 2 | 10% | No | No | 🚛 |
| Building Materials | 2 | 10% | No | No | 🧱 |
| Food & Beverages - Basic (Rice) | 2 | 10% | No | Yes (rice) | 🍚 |
| Food & Beverages - Processed | 3 | 20% | No | No | 🥫 |
| Alcoholic Beverages | 3 | 20% | Yes (30%) | No | 🍷 |
| Tobacco Products | 3 | 20% | Yes (35%) | No | 🚬 |
| Clothing & Textiles | 3 | 20% | No | No | 👕 |
| Machinery & Equipment | 1 | 5% | No | No | ⚙️ |
| Medical Equipment | 0 | 0% | No | No | 🏥 |
| Pharmaceuticals | 0 | 0% | No | Yes | 💊 |
| Furniture | 3 | 20% | No | No | 🛋️ |
| Agricultural Inputs | 0 | 0% | No | No | 🌾 |
| Petroleum Products | Special | Specific | Yes | No | ⛽ |
| Cosmetics & Personal Care | 3 | 20% | No | No | 🧴 |
| Paper & Stationery | 2 | 10% | No | No | 📄 |
| Solar/Renewable Energy Equipment | 0 | 0% | No | No | ☀️ |
| Generators & Power Equipment | 2 | 10% | No | No | 🔌 |

*Note: Rice duty updated to 10% per Finance Act 2026 (previously 0%, then 5% in 2025).*

---

## Important Disclaimers (Must Display in App)

The app should clearly state:

1. This tool provides **estimates only** — actual duties may vary based on NRA assessment
2. **Customs Processing Fee (~1.5%) and CISS Fee (~1%) are estimates** — exact rates are not publicly published and may vary by transaction
3. Rates are based on the **ECOWAS CET** and current SL regulations (Finance Acts 2025/2026) but may change with future legislation
4. Users should consult with a **licensed customs broker** for official assessments
5. The tool does not replace the **ASYCUDA World** system used by NRA for official declarations
6. Exchange rates are approximate and may differ from the rate used by customs at time of clearance
7. **Duty rates may change** — the Sierra Leone government updates tariffs through annual Finance Acts

---

## Data Sources & References

| Source | URL | Data Used |
|--------|-----|-----------|
| US Trade.gov — Sierra Leone Import Tariffs | trade.gov/country-commercial-guides/sierra-leone-import-tariffs | CET bands, CISS confirmation |
| NRA Sierra Leone | nra.gov.sl | GST rate, tax laws, Finance Acts |
| ECOWAS Official Documents | ecowas.int | Community Levy (0.5%), CET structure |
| Orbitax — Finance Act 2026 | orbitax.com | Corporate tax changes, recent amendments |
| BudgIT Sierra Leone | sierraleone.budgit.org | Finance Act 2024 impact analysis |

---

## Notes for Claude Code Development

When building with Claude Code, follow this approach:

1. **Start with the pure calculation logic** (`lib/calculator.ts`) — get the math right first
2. **Set up Convex schema and seed data** — get the backend structure in place
3. **Build the calculator form UI** — the core interactive component
4. **Add the cost breakdown visualization** — the satisfying result display
5. **Wire up Convex** — connect form submissions to mutations, history to queries
6. **Polish the design** — animations, responsive tweaks, theming
7. **Add sharing & export** — shareable links, PDF generation
8. **Add Convex Auth** (Phase 2) — user accounts for persistent history

### Next.js 16 Specific Reminders for Claude Code:
- All `params` and `searchParams` in pages/layouts must be `await`ed (they're async now)
- Turbopack is the default bundler — no need for `--turbopack` flag
- Use `"use cache"` directive for opt-in caching where needed
- Ensure `proxy.ts` is used instead of `middleware.ts` if proxying requests
- Minimum Node.js 20.9.0 — verify before starting

This order ensures you always have something working and visible at each step.
