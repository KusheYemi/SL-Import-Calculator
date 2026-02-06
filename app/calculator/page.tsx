"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CategoryPicker } from "@/components/calculator/CategoryPicker";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { CostBreakdown } from "@/components/calculator/CostBreakdown";
import { CostBar } from "@/components/calculator/CostBar";
import { ExportButton } from "@/components/calculator/ExportButton";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { getBreakdownItems } from "@/lib/calculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { CategoryData, CalculationInput, CalculationResult } from "@/lib/types";

export default function CalculatorPage() {
  const categories = useQuery(api.categories.list) as CategoryData[] | undefined;

  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [currentInput, setCurrentInput] = useState<CalculationInput | null>(null);

  // Handle pre-selected category from URL params
  useEffect(() => {
    if (typeof window === "undefined" || !categories) return;
    const params = new URLSearchParams(window.location.search);
    const catId = params.get("category");
    if (catId) {
      const found = categories.find((c) => c._id === catId);
      if (found) setSelectedCategory(found);
    }
  }, [categories]);

  const handleCalculation = useCallback(
    (input: CalculationInput, result: CalculationResult) => {
      setCurrentResult(result);
      setCurrentInput(input);
    },
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">
          Import Cost Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Select a product category, enter your costs, and get an instant
          breakdown.
        </p>
      </div>

      {/* Step 1: Category Selection */}
      {!selectedCategory ? (
        <div>
          <h2 className="font-heading text-lg font-semibold mb-4">
            Step 1: Select Product Category
          </h2>
          <CategoryPicker
            categories={categories}
            selectedId={null}
            onSelect={setSelectedCategory}
          />
        </div>
      ) : (
        <div>
          {/* Back to categories */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategory(null);
              setCurrentResult(null);
              setCurrentInput(null);
            }}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Change Category
          </Button>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="space-y-6">
              <CalculatorForm
                category={selectedCategory}
                onCalculation={handleCalculation}
              />
            </div>

            {/* Right: Results */}
            <div className="space-y-6">
              {currentResult && currentInput ? (
                <>
                  {/* Export controls */}
                  <div className="flex justify-end">
                    <ExportButton
                      result={currentResult}
                      input={currentInput}
                      category={selectedCategory}
                    />
                  </div>

                  <CostBreakdown
                    result={currentResult}
                    category={selectedCategory}
                  />

                  <CostBar
                    cifValue={currentResult.cifValue}
                    items={getBreakdownItems(
                      currentResult,
                      selectedCategory,
                      currentResult.isEcowasOrigin
                    )}
                    totalLandedCost={currentResult.totalLandedCost}
                  />

                  <DisclaimerBanner />
                </>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
                  <p className="text-muted-foreground">
                    Enter import details to see the cost breakdown.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
