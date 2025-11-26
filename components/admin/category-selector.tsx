"use client";

import { Category } from "@prisma/client";
import { Check } from "lucide-react";
import { cn, formatCategory } from "@/lib/utils";

interface CategorySelectorProps {
  selected: Category[];
  onChange: (category: Category) => void;
}

export function CategorySelector({
  selected,
  onChange,
}: CategorySelectorProps) {
  // Liste des catégories disponibles depuis l'Enum Prisma
  const categories = Object.values(Category);

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Catégories
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = selected.includes(cat);
          return (
            <label
              key={cat}
              className={cn(
                "cursor-pointer select-none rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-md"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
              )}
            >
              <input
                type="checkbox"
                name="categories"
                value={cat}
                checked={isSelected}
                onChange={() => onChange(cat)}
                className="hidden"
              />
              <span className="flex items-center gap-2">
                {isSelected && <Check size={14} />}
                {formatCategory(cat)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
