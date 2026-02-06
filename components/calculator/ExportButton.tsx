"use client";

import { Download, FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatUSD, formatPercentage } from "@/lib/currencies";
import { getBreakdownItems } from "@/lib/calculator";
import { generatePDF } from "@/lib/pdf-generator";
import type { CalculationResult, CalculationInput, CategoryData } from "@/lib/types";

interface ExportButtonProps {
  result: CalculationResult;
  input: CalculationInput;
  category: CategoryData;
}

function buildCSV(
  result: CalculationResult,
  input: CalculationInput,
  category: CategoryData
): string {
  const items = getBreakdownItems(result, category, result.isEcowasOrigin);
  let csv = "Component,Rate,Amount (USD),Estimated\n";
  csv += `CIF Value,,${result.cifValue.toFixed(2)},No\n`;
  csv += `  FOB Value,,${result.fobValueUSD.toFixed(2)},No\n`;
  csv += `  Shipping,,${result.shippingCostUSD.toFixed(2)},No\n`;
  csv += `  Insurance,,${result.insuranceCostUSD.toFixed(2)},No\n`;
  for (const item of items) {
    const rate = item.rate !== null ? `${(item.rate * 100).toFixed(1)}%` : "";
    csv += `${item.label},${rate},${item.amount.toFixed(2)},${item.isEstimated ? "Yes" : "No"}\n`;
  }
  csv += `Total Duties & Taxes,,${result.totalDutiesAndTaxes.toFixed(2)},\n`;
  csv += `Total Landed Cost,,${result.totalLandedCost.toFixed(2)},\n`;
  if (input.quantity > 1) {
    csv += `Unit Landed Cost,,${result.unitLandedCost.toFixed(2)},\n`;
  }
  return csv;
}

function buildTextSummary(
  result: CalculationResult,
  input: CalculationInput,
  category: CategoryData
): string {
  const items = getBreakdownItems(result, category, result.isEcowasOrigin);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let text = `SL IMPORT COST ESTIMATE\n`;
  text += `Generated: ${date}\n`;
  text += `${"=".repeat(50)}\n\n`;
  text += `PRODUCT DETAILS\n`;
  text += `${"-".repeat(30)}\n`;
  text += `Category:       ${category.name}\n`;
  text += `Description:    ${input.productDescription || "N/A"}\n`;
  text += `Origin Country: ${input.originCountry}${result.isEcowasOrigin ? " (ECOWAS)" : ""}\n`;
  text += `Quantity:       ${input.quantity}\n`;
  text += `Currency:       ${input.currency}\n\n`;
  text += `CIF BREAKDOWN\n`;
  text += `${"-".repeat(30)}\n`;
  text += `FOB Value:      ${formatUSD(result.fobValueUSD)}\n`;
  text += `Shipping:       ${formatUSD(result.shippingCostUSD)}\n`;
  text += `Insurance:      ${formatUSD(result.insuranceCostUSD)}\n`;
  text += `CIF Value:      ${formatUSD(result.cifValue)}\n\n`;
  text += `DUTIES & TAXES\n`;
  text += `${"-".repeat(30)}\n`;
  for (const item of items) {
    const rate = item.rate !== null ? ` (${formatPercentage(item.rate)})` : "";
    const est = item.isEstimated ? " [est.]" : "";
    text += `${(item.label + ":").padEnd(24)} ${formatUSD(item.amount)}${rate}${est}\n`;
  }
  text += `${"-".repeat(30)}\n`;
  text += `Total Duties & Taxes:   ${formatUSD(result.totalDutiesAndTaxes)}\n\n`;
  text += `${"=".repeat(50)}\n`;
  text += `TOTAL LANDED COST:      ${formatUSD(result.totalLandedCost)}\n`;
  if (input.quantity > 1) {
    text += `Per Unit:               ${formatUSD(result.unitLandedCost)}\n`;
  }
  text += `Effective Duty Rate:    ${formatPercentage(result.effectiveDutyRate)}\n`;
  text += `${"=".repeat(50)}\n\n`;
  text += `DISCLAIMER: This is an estimate only. Actual duties may vary\n`;
  text += `based on NRA classification, valuation, and current regulations.\n`;
  text += `Consult the National Revenue Authority (NRA) for official rates.\n`;
  return text;
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getSafeFilename(input: CalculationInput, category: CategoryData): string {
  const desc = input.productDescription || category.name;
  return desc.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-").toLowerCase();
}

export function ExportButton({ result, input, category }: ExportButtonProps) {
  const handleDownloadPDF = () => {
    try {
      const doc = generatePDF(result, input, category);
      const safeName = getSafeFilename(input, category);
      doc.save(`sl-import-estimate-${safeName}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  const handleDownloadText = () => {
    const text = buildTextSummary(result, input, category);
    const safeName = getSafeFilename(input, category);
    downloadFile(text, `sl-import-estimate-${safeName}.txt`, "text/plain");
  };

  const handleDownloadCSV = () => {
    const csv = buildCSV(result, input, category);
    const safeName = getSafeFilename(input, category);
    downloadFile(csv, `sl-import-estimate-${safeName}.csv`, "text/csv");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2">
          <FileDown className="h-4 w-4" />
          Download PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownloadText} className="gap-2">
          <FileText className="h-4 w-4" />
          Download as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadCSV} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Download as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
