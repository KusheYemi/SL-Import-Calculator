import { ECOWAS_COUNTRIES, FIXED_RATES, BREAKDOWN_COLORS, COMPONENT_TOOLTIPS } from "./constants";
import type { CalculationInput, CategoryData, CalculationResult, CalculationBreakdownItem } from "./types";

/**
 * Check if a country is an ECOWAS member state
 */
export function isEcowasCountry(country: string): boolean {
  return (ECOWAS_COUNTRIES as readonly string[]).includes(country);
}

/**
 * Convert an amount from a given currency to USD
 */
export function convertToUSD(amount: number, exchangeRate: number): number {
  if (exchangeRate <= 0) return 0;
  return amount / exchangeRate;
}

/**
 * Core calculation engine for Sierra Leone import costs
 *
 * Formula:
 *   CIF = FOB + Shipping + Insurance
 *   Import Duty = CIF × dutyRate (CET band rate)
 *   ECOWAS Levy = CIF × 0.5% (only for non-ECOWAS origins)
 *   Excise Duty = CIF × exciseRate (if applicable)
 *   Processing Fee = CIF × 1.5%
 *   CISS Fee = CIF × 1%
 *   GST = (CIF + Import Duty + Excise Duty) × 15% (unless exempt)
 *   Total = CIF + all duties/fees
 */
export function calculateImportCosts(
  input: CalculationInput,
  category: CategoryData
): CalculationResult {
  const { fobPrice, shippingCost, insuranceCost, quantity, exchangeRate } = input;

  // Convert all values to USD
  const fobValueUSD = convertToUSD(fobPrice, exchangeRate);
  const shippingCostUSD = convertToUSD(shippingCost, exchangeRate);
  const insuranceCostUSD = convertToUSD(insuranceCost, exchangeRate);

  // CIF Value (per unit)
  const cifValue = fobValueUSD + shippingCostUSD + insuranceCostUSD;

  // Determine applicable rates
  const dutyRate = category.dutyRate;
  const ecowasOrigin = isEcowasCountry(input.originCountry);
  const exciseRate = category.exciseApplicable ? (category.exciseRate ?? 0) : 0;
  const gstExempt = category.gstExempt ?? false;

  // Calculate individual components
  const importDuty = cifValue * dutyRate;
  const ecowasLevy = ecowasOrigin ? 0 : cifValue * FIXED_RATES.ECOWAS_LEVY;
  const exciseDuty = cifValue * exciseRate;
  const processingFee = cifValue * FIXED_RATES.CUSTOMS_PROCESSING;
  const cissFee = cifValue * FIXED_RATES.CISS;

  // GST is calculated on CIF + Import Duty + Excise Duty
  const gstBase = cifValue + importDuty + exciseDuty;
  const gst = gstExempt ? 0 : gstBase * FIXED_RATES.GST;

  // Total duties and taxes (excluding CIF)
  const totalDutiesAndTaxes = importDuty + ecowasLevy + exciseDuty + processingFee + cissFee + gst;

  // Total landed cost per unit
  const totalLandedCost = cifValue + totalDutiesAndTaxes;

  // Effective duty rate
  const effectiveDutyRate = cifValue > 0 ? totalDutiesAndTaxes / cifValue : 0;

  // Unit landed cost considering quantity
  const unitLandedCost = quantity > 0 ? totalLandedCost : 0;

  return {
    fobValueUSD,
    shippingCostUSD,
    insuranceCostUSD,
    cifValue,
    importDuty,
    ecowasLevy,
    exciseDuty,
    processingFee,
    cissFee,
    gst,
    totalDutiesAndTaxes,
    totalLandedCost: totalLandedCost * quantity,
    effectiveDutyRate,
    unitLandedCost,
    isEcowasOrigin: ecowasOrigin,
    isGstExempt: gstExempt,
    dutyRate,
    exciseRate,
  };
}

/**
 * Prepare breakdown items for visualization
 */
export function getBreakdownItems(
  result: CalculationResult,
  category: CategoryData,
  isEcowas: boolean
): CalculationBreakdownItem[] {
  const items: CalculationBreakdownItem[] = [
    {
      key: "importDuty",
      label: `Import Duty (CET Band ${category.cetBand}%)`,
      amount: result.importDuty,
      rate: result.dutyRate,
      isEstimated: false,
      color: BREAKDOWN_COLORS.importDuty,
      tooltip: COMPONENT_TOOLTIPS.importDuty,
    },
    {
      key: "processingFee",
      label: "Customs Processing Fee",
      amount: result.processingFee,
      rate: FIXED_RATES.CUSTOMS_PROCESSING,
      isEstimated: true,
      color: BREAKDOWN_COLORS.processingFee,
      tooltip: COMPONENT_TOOLTIPS.processingFee,
    },
    {
      key: "cissFee",
      label: "CISS Fee",
      amount: result.cissFee,
      rate: FIXED_RATES.CISS,
      isEstimated: true,
      color: BREAKDOWN_COLORS.cissFee,
      tooltip: COMPONENT_TOOLTIPS.cissFee,
    },
  ];

  // Only add ECOWAS levy for non-ECOWAS origins
  if (!isEcowas) {
    items.push({
      key: "ecowasLevy",
      label: "ECOWAS Community Levy",
      amount: result.ecowasLevy,
      rate: FIXED_RATES.ECOWAS_LEVY,
      isEstimated: false,
      color: BREAKDOWN_COLORS.ecowasLevy,
      tooltip: COMPONENT_TOOLTIPS.ecowasLevy,
    });
  }

  // Only add excise if applicable
  if (category.exciseApplicable && result.exciseDuty > 0) {
    items.push({
      key: "exciseDuty",
      label: "Excise Duty",
      amount: result.exciseDuty,
      rate: result.exciseRate,
      isEstimated: false,
      color: BREAKDOWN_COLORS.exciseDuty,
      tooltip: COMPONENT_TOOLTIPS.exciseDuty,
    });
  }

  // GST (if not exempt)
  if (!result.isGstExempt) {
    items.push({
      key: "gst",
      label: "GST",
      amount: result.gst,
      rate: FIXED_RATES.GST,
      isEstimated: false,
      color: BREAKDOWN_COLORS.gst,
      tooltip: COMPONENT_TOOLTIPS.gst,
    });
  }

  return items;
}
