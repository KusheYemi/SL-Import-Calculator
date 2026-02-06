// ECOWAS Common External Tariff (CET) 5-Band System
export const CET_BANDS = {
  0: { rate: 0, label: "Band 0 – Essential Social Goods", color: "#22c55e" },
  5: { rate: 0.05, label: "Band 1 – Essential Goods / Raw Materials", color: "#3b82f6" },
  10: { rate: 0.1, label: "Band 2 – Intermediate Goods", color: "#f59e0b" },
  20: { rate: 0.2, label: "Band 3 – Final Consumer Goods", color: "#f97316" },
  35: { rate: 0.35, label: "Band 4 – Specific Goods for Economic Development", color: "#ef4444" },
} as const;

export type CETBandRate = keyof typeof CET_BANDS;

// Fixed rates applied by Sierra Leone Customs
export const FIXED_RATES = {
  ECOWAS_LEVY: 0.005, // 0.5% ECOWAS Community Levy
  CUSTOMS_PROCESSING: 0.015, // 1.5% Customs Processing Fee
  CISS: 0.01, // 1% Comprehensive Import Supervision Scheme
  GST: 0.15, // 15% Goods and Services Tax
} as const;

// ECOWAS Member States
export const ECOWAS_COUNTRIES = [
  "Benin",
  "Burkina Faso",
  "Cabo Verde",
  "Côte d'Ivoire",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Liberia",
  "Mali",
  "Niger",
  "Nigeria",
  "Senegal",
  "Sierra Leone",
  "Togo",
] as const;

// Common origin countries for imports
export const ORIGIN_COUNTRIES = [
  // ECOWAS Members
  ...ECOWAS_COUNTRIES,
  // Major trading partners
  "China",
  "India",
  "United States",
  "United Kingdom",
  "Turkey",
  "United Arab Emirates",
  "South Africa",
  "Brazil",
  "Germany",
  "Japan",
  "South Korea",
  "Indonesia",
  "Thailand",
  "Vietnam",
  "Malaysia",
  "Italy",
  "France",
  "Netherlands",
  "Spain",
  "Belgium",
] as const;

// Supported currencies
export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// Default exchange rates (fallback when live rates unavailable)
// Rates are per 1 USD
export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  SLL: 22500,
  NGN: 1550,
  GHS: 14.5,
  CNY: 7.25,
  INR: 83.5,
};

// Breakdown item colors for visualization
export const BREAKDOWN_COLORS = {
  cifValue: "#1B4332",
  importDuty: "#D4A017",
  ecowasLevy: "#3b82f6",
  exciseDuty: "#ef4444",
  processingFee: "#8b5cf6",
  cissFee: "#06b6d4",
  gst: "#f97316",
} as const;

// Educational tooltips for cost components
export const COMPONENT_TOOLTIPS: Record<string, string> = {
  cifValue:
    "Cost, Insurance, and Freight – the total value of goods including shipping and insurance costs at the port of entry.",
  importDuty:
    "Calculated based on the ECOWAS Common External Tariff (CET) band assigned to the product category.",
  ecowasLevy:
    "A 0.5% levy on imports from non-ECOWAS countries to fund the ECOWAS Commission. Waived for goods originating from ECOWAS member states.",
  exciseDuty:
    "Additional tax on specific goods like alcohol, tobacco, and petroleum products. Rates vary by product.",
  processingFee:
    "A 1.5% fee charged by Sierra Leone Customs for processing the import declaration. This is an estimated rate.",
  cissFee:
    "Comprehensive Import Supervision Scheme – a 1% fee for pre-shipment inspection and verification of imports.",
  gst: "Goods and Services Tax at 15%, calculated on the CIF value plus import duty and excise duty. Some essential goods are exempt.",
};
