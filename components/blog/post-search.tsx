"use client";

import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export function PostSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    params.set("page", "1");

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-xl mx-auto mb-16">
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              className={`h-5 w-5 text-neutral-400 transition-colors ${
                isPending ? "animate-pulse text-indigo-500" : ""
              }`}
            />
          </div>
          <input
            className="block w-full pl-12 pr-4 py-4 bg-white border-0 ring-1 ring-neutral-200 rounded-full text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm transition-shadow font-medium"
            placeholder="Rechercher un article, un sujet..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get("q")?.toString()}
          />
        </div>
      </div>
    </div>
  );
}
