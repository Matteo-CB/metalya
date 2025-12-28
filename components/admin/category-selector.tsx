"use client";

import { Category } from "@prisma/client";
import { cn, formatCategory } from "@/lib/utils";

interface CategorySelectorProps {
  selected: Category[];
  onChange: (category: Category) => void;
}

export function CategorySelector({
  selected = [], // Valeur par défaut pour éviter le crash
  onChange,
}: CategorySelectorProps) {
  const categories = Object.values(Category);

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-widest text-neutral-400">
        Catégories
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          // Sécurisation supplémentaire
          const safeSelected = selected || [];
          const isSelected = safeSelected.includes(cat);

          return (
            <label
              key={cat}
              className={cn(
                "cursor-pointer select-none rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
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
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {formatCategory(cat)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
