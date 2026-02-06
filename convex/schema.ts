import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    description: v.string(),
    hsCodeRange: v.string(),
    cetBand: v.number(),
    dutyRate: v.number(),
    exciseApplicable: v.boolean(),
    exciseRate: v.optional(v.number()),
    gstExempt: v.optional(v.boolean()),
    icon: v.string(),
  }).index("by_name", ["name"]),

  exchangeRates: defineTable({
    baseCurrency: v.string(),
    rates: v.object({
      USD: v.number(),
      EUR: v.number(),
      GBP: v.number(),
      SLL: v.number(),
      NGN: v.number(),
      GHS: v.number(),
      CNY: v.number(),
      INR: v.number(),
    }),
    updatedAt: v.number(),
  }),
});
