import { CURRENCIES, DEFAULT_EXCHANGE_RATES } from "./constants";
import type { CurrencyCode } from "./constants";

/**
 * Format a number as currency with the appropriate symbol
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency);
  const symbol = currencyInfo?.symbol ?? "$";

  // Special handling for SLL (large numbers)
  if (currency === "SLL") {
    return `${symbol} ${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  }

  return `${symbol}${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

/**
 * Format a number as USD
 */
export function formatUSD(amount: number): string {
  return formatCurrency(amount, "USD");
}

/**
 * Get the default exchange rate for a currency (per 1 USD)
 */
export function getDefaultRate(currency: CurrencyCode): number {
  return DEFAULT_EXCHANGE_RATES[currency] ?? 1;
}

/**
 * Format a percentage for display
 */
export function formatPercentage(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
