import { query, internalMutation } from "./_generated/server";

export const getCurrent = query({
  handler: async (ctx) => {
    const rates = await ctx.db.query("exchangeRates").order("desc").first();
    return rates;
  },
});

export const seedRates = internalMutation({
  handler: async (ctx) => {
    // Check if rates already exist
    const existing = await ctx.db.query("exchangeRates").first();
    if (existing) {
      console.log("Exchange rates already seeded, skipping.");
      return;
    }

    await ctx.db.insert("exchangeRates", {
      baseCurrency: "USD",
      rates: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        SLL: 22500,
        NGN: 1550,
        GHS: 14.5,
        CNY: 7.25,
        INR: 83.5,
      },
      updatedAt: Date.now(),
    });

    console.log("Seeded default exchange rates.");
  },
});
