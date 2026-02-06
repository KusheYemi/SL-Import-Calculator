# SL Import Calculator

Estimate import duties, taxes, and total landed costs for goods entering Sierra Leone. Built on the ECOWAS Common External Tariff (CET) 5-band system.

## Features

- **20 Product Categories** — Electronics, vehicles, building materials, food, pharmaceuticals, and more, each mapped to the correct CET duty band (0%–35%)
- **Real-Time Calculation** — Instant cost breakdown as you type: import duty, GST, ECOWAS levy, excise, processing fee, and CISS
- **ECOWAS Origin Detection** — Automatically waives the 0.5% Community Levy for goods from ECOWAS member states
- **Export Results** — Download your estimate as a branded PDF, CSV, or plain text file
- **Visual Cost Breakdown** — Color-coded stacked bar chart showing where your money goes
- **No Sign-Up Required** — No accounts, no login, no data stored on the server

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [Convex](https://www.convex.dev/) (reactive backend for categories and exchange rates)
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [jsPDF](https://github.com/parallax/jsPDF) (client-side PDF generation)
- [Lucide React](https://lucide.dev/) (icons)

## Getting Started

### Prerequisites

- Node.js 20+
- A [Convex](https://www.convex.dev/) account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/KusheYemi/SL-Import-Calculator.git
cd SL-Import-Calculator

# Install dependencies
npm install
```

### Set Up Convex

```bash
# Initialize Convex (opens browser for auth, creates .env.local)
npx convex dev
```

In a separate terminal, seed the database:

```bash
npx convex run seed:seedCategories
npx convex run exchangeRates:seedRates
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the calculator.

## Project Structure

```
app/
  page.tsx              # Landing page
  calculator/page.tsx   # Calculator page
  categories/page.tsx   # Browse all product categories
  about/page.tsx        # Methodology and documentation
components/
  calculator/           # CategoryPicker, CalculatorForm, CostBreakdown, CostBar, ExportButton
  layout/               # Header, Footer, ConvexClientProvider, DisclaimerBanner
  ui/                   # shadcn/ui primitives
convex/
  schema.ts             # Database schema (categories, exchangeRates)
  seed.ts               # Category seed data (20 categories)
  categories.ts         # Category queries
  exchangeRates.ts      # Exchange rate queries
lib/
  calculator.ts         # Core calculation engine (pure functions)
  constants.ts          # CET bands, tax rates, ECOWAS countries, currencies
  types.ts              # TypeScript interfaces
  currencies.ts         # Currency formatting utilities
  pdf-generator.ts      # Branded PDF generation with jsPDF
  icons.ts              # Lucide icon mapping
```

## How Import Costs Are Calculated

```
CIF = FOB Value + Shipping + Insurance

Import Duty     = CIF x duty rate (0%, 5%, 10%, 20%, or 35%)
ECOWAS Levy     = CIF x 0.5% (non-ECOWAS origin only)
Excise Duty     = CIF x excise rate (if applicable)
Processing Fee  = CIF x 1.5% (estimated)
CISS Fee        = CIF x 1% (estimated)
GST             = (CIF + Import Duty + Excise) x 15% (unless exempt)

Total Landed Cost = CIF + all duties and fees
```

## Deployment

Configured for Netlify with Convex:

```bash
# Set environment variables in Netlify:
# - CONVEX_DEPLOY_KEY (from Convex dashboard)

# Deploy
netlify deploy --prod
```

See `netlify.toml` for build configuration.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your Convex credentials:

| Variable | Description |
|----------|-------------|
| `CONVEX_DEPLOYMENT` | Your Convex deployment name |
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex project URL |
| `CONVEX_DEPLOY_KEY` | Deploy key (production only) |

## Disclaimer

This tool provides estimates only. Actual duties may vary based on NRA classification, product valuation, and current regulations. Consult the National Revenue Authority (NRA) of Sierra Leone for official assessments. This project is not affiliated with the Government of Sierra Leone.

## License

Private project.
