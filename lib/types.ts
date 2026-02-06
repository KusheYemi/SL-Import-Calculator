import type { CurrencyCode, CETBandRate } from "./constants";

export interface CalculationInput {
  fobPrice: number;
  shippingCost: number;
  insuranceCost: number;
  quantity: number;
  currency: CurrencyCode;
  exchangeRate: number;
  originCountry: string;
  productDescription: string;
  notes?: string;
}

export interface CategoryData {
  _id: string;
  name: string;
  description: string;
  hsCodeRange: string;
  cetBand: CETBandRate;
  dutyRate: number;
  exciseApplicable: boolean;
  exciseRate?: number;
  gstExempt?: boolean;
  icon: string;
}

export interface CalculationResult {
  // Input values in USD
  fobValueUSD: number;
  shippingCostUSD: number;
  insuranceCostUSD: number;
  cifValue: number;

  // Individual cost components
  importDuty: number;
  ecowasLevy: number;
  exciseDuty: number;
  processingFee: number;
  cissFee: number;
  gst: number;

  // Totals
  totalDutiesAndTaxes: number;
  totalLandedCost: number;
  effectiveDutyRate: number;

  // Unit costs (when quantity > 1)
  unitLandedCost: number;

  // Metadata
  isEcowasOrigin: boolean;
  isGstExempt: boolean;
  dutyRate: number;
  exciseRate: number;
}

export interface CalculationBreakdownItem {
  key: string;
  label: string;
  amount: number;
  rate: number | null;
  isEstimated: boolean;
  color: string;
  tooltip?: string;
}
