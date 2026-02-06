"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import { formatUSD, formatPercentage } from "@/lib/currencies";
import { getBreakdownItems } from "@/lib/calculator";
import { COMPONENT_TOOLTIPS } from "@/lib/constants";
import type { CalculationResult, CategoryData } from "@/lib/types";

interface CostBreakdownProps {
  result: CalculationResult;
  category: CategoryData;
}

export function CostBreakdown({ result, category }: CostBreakdownProps) {
  const breakdownItems = getBreakdownItems(
    result,
    category,
    result.isEcowasOrigin
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Landed Cost */}
        <div className="rounded-lg bg-forest/5 p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            Total Landed Cost
          </p>
          <p className="text-3xl font-heading font-bold text-gold">
            {formatUSD(result.totalLandedCost)}
          </p>
          {result.unitLandedCost !== result.totalLandedCost && (
            <p className="text-sm text-muted-foreground mt-1">
              {formatUSD(result.unitLandedCost)} per unit
            </p>
          )}
          <Badge className="mt-2 bg-forest text-white">
            {formatPercentage(result.effectiveDutyRate)} effective duty rate
          </Badge>
        </div>

        <Separator />

        {/* CIF Value */}
        <TooltipProvider>
          <div
            className="animate-slide-in-up flex items-center justify-between py-2"
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "#1B4332" }}
              />
              <span className="text-sm font-medium">CIF Value</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {COMPONENT_TOOLTIPS.cifValue}
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="text-sm font-semibold">
              {formatUSD(result.cifValue)}
            </span>
          </div>

          {/* CIF sub-items */}
          <div className="ml-5 space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>FOB Value</span>
              <span>{formatUSD(result.fobValueUSD)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatUSD(result.shippingCostUSD)}</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance</span>
              <span>{formatUSD(result.insuranceCostUSD)}</span>
            </div>
          </div>

          <Separator />

          {/* Duties and Taxes */}
          {breakdownItems.map((item, index) => (
            <div
              key={item.key}
              className="animate-slide-in-up flex items-center justify-between py-2"
              style={{ animationDelay: `${(index + 1) * 80}ms` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {item.isEstimated && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    est.
                  </Badge>
                )}
                {item.tooltip && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      {item.tooltip}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-2">
                {item.rate !== null && (
                  <span className="text-xs text-muted-foreground">
                    {formatPercentage(item.rate)}
                  </span>
                )}
                <span className="text-sm font-semibold">
                  {formatUSD(item.amount)}
                </span>
              </div>
            </div>
          ))}

          <Separator />

          {/* Subtotal: Duties & Taxes */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-semibold text-muted-foreground">
              Total Duties & Taxes
            </span>
            <span className="text-sm font-bold">
              {formatUSD(result.totalDutiesAndTaxes)}
            </span>
          </div>

          {/* Quantity multiplier */}
          {parseInt(String(result.totalLandedCost / result.unitLandedCost)) >
            1 && (
            <>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  Quantity multiplier
                </span>
                <span className="text-sm font-semibold">
                  &times;{" "}
                  {Math.round(result.totalLandedCost / result.unitLandedCost)}
                </span>
              </div>
            </>
          )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
