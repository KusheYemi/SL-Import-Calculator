"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CURRENCIES, ORIGIN_COUNTRIES } from "@/lib/constants";
import { getDefaultRate } from "@/lib/currencies";
import { calculateImportCosts, isEcowasCountry } from "@/lib/calculator";
import type { CurrencyCode } from "@/lib/constants";
import type { CategoryData, CalculationInput, CalculationResult } from "@/lib/types";

interface CalculatorFormProps {
  category: CategoryData;
  onCalculation: (input: CalculationInput, result: CalculationResult) => void;
}

export function CalculatorForm({
  category,
  onCalculation,
}: CalculatorFormProps) {
  const [fobPrice, setFobPrice] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [insuranceCost, setInsuranceCost] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [originCountry, setOriginCountry] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const exchangeRate = getDefaultRate(currency);
  const isEcowas = originCountry ? isEcowasCountry(originCountry) : false;

  const buildInput = useCallback((): CalculationInput | null => {
    const fob = parseFloat(fobPrice);
    const shipping = parseFloat(shippingCost) || 0;
    const insurance = parseFloat(insuranceCost) || 0;
    const qty = parseInt(quantity) || 1;

    if (!fob || fob <= 0) return null;

    return {
      fobPrice: fob,
      shippingCost: shipping,
      insuranceCost: insurance,
      quantity: qty,
      currency,
      exchangeRate,
      originCountry,
      productDescription,
    };
  }, [fobPrice, shippingCost, insuranceCost, quantity, currency, exchangeRate, originCountry, productDescription]);

  // Real-time calculation with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const input = buildInput();
      if (input && originCountry) {
        const calcResult = calculateImportCosts(input, category);
        onCalculation(input, calcResult);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fobPrice, shippingCost, insuranceCost, quantity, currency, originCountry, category, buildInput, onCalculation]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg">
          Enter Import Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Currency & Origin Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => setCurrency(v as CurrencyCode)}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} — {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {currency !== "USD" && (
              <p className="text-xs text-muted-foreground">
                Rate: 1 USD = {exchangeRate} {currency}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="origin">Origin Country</Label>
            <Select value={originCountry} onValueChange={setOriginCountry}>
              <SelectTrigger id="origin">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {ORIGIN_COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {originCountry && (
              <Badge variant={isEcowas ? "default" : "secondary"} className="text-xs">
                {isEcowas ? "ECOWAS Member — Levy Waived" : "Non-ECOWAS — 0.5% Levy Applies"}
              </Badge>
            )}
          </div>
        </div>

        {/* Cost Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="fob">
              FOB Price <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fob"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={fobPrice}
              onChange={(e) => setFobPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping">Shipping Cost</Label>
            <Input
              id="shipping"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="insurance">
              Insurance Cost
            </Label>
            <Input
              id="insurance"
              type="number"
              min="0"
              step="0.01"
              placeholder="~2% of FOB"
              value={insuranceCost}
              onChange={(e) => setInsuranceCost(e.target.value)}
            />
          </div>
        </div>

        {/* Quantity & Description Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Product Description</Label>
            <Input
              id="description"
              placeholder="e.g., Samsung Galaxy S24 Ultra smartphones"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
