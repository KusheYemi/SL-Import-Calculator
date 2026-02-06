"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatUSD, formatPercentage } from "@/lib/currencies";
import type { CalculationBreakdownItem } from "@/lib/types";

interface CostBarProps {
  cifValue: number;
  items: CalculationBreakdownItem[];
  totalLandedCost: number;
}

export function CostBar({ cifValue, items, totalLandedCost }: CostBarProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // Build segments: CIF + all breakdown items
  const segments = [
    {
      key: "cifValue",
      label: "CIF Value",
      amount: cifValue,
      color: "#1B4332",
    },
    ...items.map((item) => ({
      key: item.key,
      label: item.label,
      amount: item.amount,
      color: item.color,
    })),
  ].filter((s) => s.amount > 0);

  const total = segments.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-3">
      <TooltipProvider>
        {/* Stacked horizontal bar */}
        <div className="flex h-10 w-full overflow-hidden rounded-lg">
          {segments.map((segment) => {
            const percentage = total > 0 ? (segment.amount / total) * 100 : 0;
            const isHovered = hoveredKey === segment.key;
            return (
              <Tooltip key={segment.key}>
                <TooltipTrigger asChild>
                  <div
                    className="relative transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: segment.color,
                      opacity: hoveredKey && !isHovered ? 0.5 : 1,
                      transform: isHovered ? "scaleY(1.15)" : "scaleY(1)",
                    }}
                    onMouseEnter={() => setHoveredKey(segment.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{segment.label}</p>
                  <p>
                    {formatUSD(segment.amount)} ({formatPercentage(segment.amount / totalLandedCost)})
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((segment) => (
          <div
            key={segment.key}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span>{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
