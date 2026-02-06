"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getIcon } from "@/lib/icons";
import { CET_BANDS } from "@/lib/constants";
import { formatPercentage } from "@/lib/currencies";
import { Search, ArrowRight, Grid3X3 } from "lucide-react";
import Link from "next/link";
import type { CategoryData } from "@/lib/types";

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list) as CategoryData[] | undefined;
  const [search, setSearch] = useState("");

  const filtered = categories?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase()) ||
      cat.hsCodeRange.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
          <Grid3X3 className="h-8 w-8 text-forest" />
          Product Categories
        </h1>
        <p className="mt-2 text-muted-foreground">
          All product categories and their tariff rates under the ECOWAS Common
          External Tariff system.
        </p>
      </div>

      {/* CET Band Explanation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            ECOWAS CET 5-Band System
          </CardTitle>
          <CardDescription>
            Products are classified into five tariff bands based on their
            economic sensitivity and development importance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(CET_BANDS).map(([rate, info]) => (
              <div
                key={rate}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-sm font-medium">{rate}%</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  — {info.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories, HS codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories Grid */}
      {!categories ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((category) => {
            const Icon = getIcon(category.icon);
            const bandInfo =
              CET_BANDS[category.cetBand as keyof typeof CET_BANDS];

            return (
              <Card
                key={category._id}
                className="group transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest/10 text-forest">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading font-semibold text-foreground text-sm">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: bandInfo?.color,
                        color: bandInfo?.color,
                      }}
                    >
                      {category.cetBand}% Import Duty
                    </Badge>
                    {category.exciseApplicable && (
                      <Badge variant="destructive" className="text-xs">
                        +{formatPercentage(category.exciseRate ?? 0)} Excise
                      </Badge>
                    )}
                    {category.gstExempt && (
                      <Badge variant="secondary" className="text-xs">
                        GST Exempt
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    HS Codes: {category.hsCodeRange}
                  </p>

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 text-forest group-hover:bg-forest/5"
                  >
                    <Link href={`/calculator?category=${category._id}`}>
                      Calculate with this
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filtered?.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No categories match your search.
        </div>
      )}
    </div>
  );
}
