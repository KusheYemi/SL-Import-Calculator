"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { CET_BANDS } from "@/lib/constants";
import type { CategoryData } from "@/lib/types";

interface CategoryPickerProps {
  categories: CategoryData[] | undefined;
  selectedId: string | null;
  onSelect: (category: CategoryData) => void;
}

function CategorySkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function CategoryPicker({
  categories,
  selectedId,
  onSelect,
}: CategoryPickerProps) {
  const [search, setSearch] = useState("");

  const filtered = categories?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!categories
          ? Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          : filtered?.map((category) => {
              const Icon = getIcon(category.icon);
              const isSelected = selectedId === category._id;
              const bandInfo =
                CET_BANDS[category.cetBand as keyof typeof CET_BANDS];

              return (
                <button
                  key={category._id}
                  onClick={() => onSelect(category)}
                  className={cn(
                    "rounded-xl border-2 bg-card p-4 text-left transition-all hover:shadow-md",
                    isSelected
                      ? "border-forest shadow-md ring-2 ring-forest/20"
                      : "border-border hover:border-forest/30"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isSelected
                          ? "bg-forest text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: bandInfo?.color,
                            color: bandInfo?.color,
                          }}
                        >
                          {category.cetBand}% duty
                        </Badge>
                        {category.gstExempt && (
                          <Badge variant="secondary" className="text-xs">
                            GST Exempt
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
      </div>

      {filtered?.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No categories match your search.
        </p>
      )}
    </div>
  );
}
