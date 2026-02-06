import { jsPDF } from "jspdf";
import { getBreakdownItems } from "./calculator";
import { formatPercentage } from "./currencies";
import type { CalculationResult, CalculationInput, CategoryData } from "./types";

// Embedded logo (logo-64.png as base64 — only ~3KB)
const LOGO_BASE64 =
  "data:image/png;base64,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";

// Hex color to RGB tuple
function rgb(hex: string): [number, number, number] {
  const map: Record<string, [number, number, number]> = {
    "#1B4332": [27, 67, 50],
    "#D4A017": [212, 160, 23],
    "#1C1917": [28, 25, 23],
    "#78716C": [120, 113, 108],
    "#FAF8F5": [250, 248, 245],
    "#3b82f6": [59, 130, 246],
    "#ef4444": [239, 68, 68],
    "#8b5cf6": [139, 92, 246],
    "#06b6d4": [6, 182, 212],
    "#f97316": [249, 115, 22],
  };
  return map[hex] ?? [120, 113, 108];
}

function fmtUSD(amount: number): string {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generatePDF(
  result: CalculationResult,
  input: CalculationInput,
  category: CategoryData
): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 18; // margin
  const cw = pw - m * 2; // content width
  let y = 0;

  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Top: SL Flag stripe ──
  doc.setFillColor(30, 181, 58);
  doc.rect(0, 0, pw / 3, 3, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(pw / 3, 0, pw / 3, 3, "F");
  doc.setFillColor(0, 114, 198);
  doc.rect((pw / 3) * 2, 0, pw / 3 + 1, 3, "F");
  y = 11;

  // ── Header: logo + title ──
  try {
    doc.addImage(LOGO_BASE64, "PNG", m, y - 2, 14, 14);
  } catch {
    // skip logo on failure
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(27, 67, 50);
  doc.text("SL Import Calculator", m + 18, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 113, 108);
  doc.text("Sierra Leone Import Cost Estimate", m + 18, y + 11);
  doc.setFontSize(8);
  doc.text(dateStr, pw - m, y + 5, { align: "right" });
  y += 20;

  // ── Divider ──
  doc.setDrawColor(27, 67, 50);
  doc.setLineWidth(0.5);
  doc.line(m, y, pw - m, y);
  y += 8;

  // ── Product Details ──
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(m, y, cw, 26, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text("Product Details", m + 4, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(120, 113, 108);

  const col2 = m + cw / 2;
  doc.text("Category:  " + category.name, m + 4, y + 13);
  doc.text("CET Band:  " + category.cetBand + "% duty rate", m + 4, y + 18.5);
  const desc = input.productDescription || "N/A";
  doc.text("Description:  " + (desc.length > 40 ? desc.slice(0, 40) + "..." : desc), m + 4, y + 24);
  doc.text("Origin:  " + input.originCountry + (result.isEcowasOrigin ? " (ECOWAS)" : ""), col2, y + 13);
  doc.text("Currency:  " + input.currency, col2, y + 18.5);
  doc.text("Quantity:  " + input.quantity, col2, y + 24);
  y += 33;

  // ── Total Landed Cost banner ──
  doc.setFillColor(27, 67, 50);
  doc.roundedRect(m, y, cw, 20, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL LANDED COST", m + 5, y + 8);
  doc.setFontSize(9);
  doc.text("Effective rate: " + formatPercentage(result.effectiveDutyRate), pw - m - 5, y + 8, { align: "right" });
  doc.setFontSize(20);
  doc.setTextColor(212, 160, 23);
  doc.text(fmtUSD(result.totalLandedCost), pw - m - 5, y + 17, { align: "right" });
  if (input.quantity > 1) {
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(fmtUSD(result.unitLandedCost) + " per unit", m + 5, y + 16);
  }
  y += 27;

  // ── CIF Breakdown ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text("CIF Breakdown", m, y);
  y += 5;

  // Table header
  doc.setFillColor(240, 237, 232);
  doc.rect(m, y, cw, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 113, 108);
  doc.text("Component", m + 3, y + 4);
  doc.text("Amount (USD)", pw - m - 3, y + 4, { align: "right" });
  y += 6;

  // CIF rows
  const cifRows = [
    ["FOB Value", result.fobValueUSD],
    ["Shipping", result.shippingCostUSD],
    ["Insurance", result.insuranceCostUSD],
  ] as const;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  for (const [label, amount] of cifRows) {
    doc.setTextColor(28, 25, 23);
    doc.text("   " + label, m + 3, y + 4.5);
    doc.text(fmtUSD(amount), pw - m - 3, y + 4.5, { align: "right" });
    y += 6;
  }
  // CIF total line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(m, y, pw - m, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 67, 50);
  doc.text("CIF Value", m + 3, y + 5);
  doc.text(fmtUSD(result.cifValue), pw - m - 3, y + 5, { align: "right" });
  y += 10;

  // ── Duties & Taxes ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text("Duties & Taxes", m, y);
  y += 5;

  // Table header
  doc.setFillColor(240, 237, 232);
  doc.rect(m, y, cw, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 113, 108);
  doc.text("Component", m + 3, y + 4);
  doc.text("Rate", m + cw * 0.55, y + 4);
  doc.text("Amount (USD)", pw - m - 3, y + 4, { align: "right" });
  y += 6;

  const items = getBreakdownItems(result, category, result.isEcowasOrigin);
  doc.setFontSize(8.5);

  for (const item of items) {
    // Color dot
    const c = rgb(item.color);
    doc.setFillColor(c[0], c[1], c[2]);
    doc.circle(m + 5, y + 3, 1.5, "F");

    // Label
    doc.setFont("helvetica", "normal");
    doc.setTextColor(28, 25, 23);
    const lbl = item.isEstimated ? item.label + " (est.)" : item.label;
    doc.text(lbl, m + 10, y + 4.5);

    // Rate
    if (item.rate !== null) {
      doc.setTextColor(120, 113, 108);
      doc.text(formatPercentage(item.rate), m + cw * 0.55, y + 4.5);
    }

    // Amount
    doc.setTextColor(28, 25, 23);
    doc.text(fmtUSD(item.amount), pw - m - 3, y + 4.5, { align: "right" });
    y += 6.5;
  }

  // Duties total line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(m, y, pw - m, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 67, 50);
  doc.text("Total Duties & Taxes", m + 3, y + 5);
  doc.text(fmtUSD(result.totalDutiesAndTaxes), pw - m - 3, y + 5, { align: "right" });
  y += 12;

  // ── Cost Distribution Bar ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(28, 25, 23);
  doc.text("Cost Distribution", m, y);
  y += 5;

  const segments = [
    { label: "CIF Value", amount: result.cifValue, color: "#1B4332" },
    ...items.map((i) => ({ label: i.label, amount: i.amount, color: i.color })),
  ].filter((s) => s.amount > 0);

  const barTotal = segments.reduce((s, seg) => s + seg.amount, 0);

  // Draw stacked bar
  const barH = 9;
  let barX = m;
  for (const seg of segments) {
    const w = barTotal > 0 ? (seg.amount / barTotal) * cw : 0;
    if (w > 0.1) {
      const c = rgb(seg.color);
      doc.setFillColor(c[0], c[1], c[2]);
      doc.rect(barX, y, w, barH, "F");
      barX += w;
    }
  }
  y += barH + 3;

  // Legend (2 columns)
  doc.setFontSize(7);
  const colW = cw / 2;
  segments.forEach((seg, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const lx = m + col * colW;
    const ly = y + row * 5;
    const c = rgb(seg.color);
    doc.setFillColor(c[0], c[1], c[2]);
    doc.circle(lx + 2, ly + 1.5, 1.2, "F");
    doc.setTextColor(120, 113, 108);
    const pct = barTotal > 0 ? ((seg.amount / barTotal) * 100).toFixed(1) : "0.0";
    doc.text(seg.label + " \u2014 " + fmtUSD(seg.amount) + " (" + pct + "%)", lx + 5, ly + 2.5);
  });
  y += Math.ceil(segments.length / 2) * 5 + 8;

  // ── Disclaimer ──
  doc.setFillColor(255, 250, 235);
  doc.roundedRect(m, y, cw, 22, 2, 2, "F");
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.3);
  doc.roundedRect(m, y, cw, 22, 2, 2, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(28, 25, 23);
  doc.text("Disclaimer \u2014 Estimates Only", m + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(120, 113, 108);
  const discText =
    "These calculations are estimates based on standard rates and may not reflect actual import costs. " +
    "Actual duties depend on NRA classification, product valuation, and current regulations. " +
    "Processing fees and CISS rates are estimates. Always consult the National Revenue Authority (NRA) " +
    "of Sierra Leone for official assessments before making import decisions.";
  const discLines = doc.splitTextToSize(discText, cw - 8);
  doc.text(discLines, m + 4, y + 10);
  y += 28;

  // ── Footer ──
  doc.setDrawColor(27, 67, 50);
  doc.setLineWidth(0.2);
  doc.line(m, y, pw - m, y);
  doc.setFontSize(6.5);
  doc.setTextColor(120, 113, 108);
  doc.text(
    "Generated by SL Import Calculator on " + dateStr + ". Not affiliated with the Government of Sierra Leone.",
    pw / 2,
    y + 4,
    { align: "center" }
  );

  // ── Bottom: SL Flag stripe ──
  doc.setFillColor(30, 181, 58);
  doc.rect(0, ph - 3, pw / 3, 3, "F");
  doc.setFillColor(255, 255, 255);
  doc.rect(pw / 3, ph - 3, pw / 3, 3, "F");
  doc.setFillColor(0, 114, 198);
  doc.rect((pw / 3) * 2, ph - 3, pw / 3 + 1, 3, "F");

  return doc;
}
