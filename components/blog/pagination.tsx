"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex items-center gap-1 mx-4">
        <span className="text-sm font-medium text-neutral-500">
          Page <span className="text-neutral-900 font-bold">{currentPage}</span>{" "}
          sur <span className="text-neutral-900 font-bold">{totalPages}</span>
        </span>
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = cn(
    "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
    isDisabled
      ? "pointer-events-none border-neutral-100 text-neutral-300"
      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white hover:scale-110"
  );

  const icon =
    direction === "left" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />;

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}
