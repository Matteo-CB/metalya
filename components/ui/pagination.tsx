import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-16 border-t border-neutral-200 pt-8">
      {prevPage ? (
        <Link
          href={createPageUrl(prevPage)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 hover:bg-neutral-100 rounded-full"
        >
          <ArrowLeft size={16} />
          Précédent
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-300 cursor-not-allowed">
          <ArrowLeft size={16} />
          Précédent
        </div>
      )}

      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="flex items-center justify-center w-8 h-8 bg-neutral-900 text-white rounded-full">
          {currentPage}
        </span>
        <span className="text-neutral-400">/</span>
        <span className="text-neutral-500">{totalPages}</span>
      </div>

      {nextPage ? (
        <Link
          href={createPageUrl(nextPage)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 hover:bg-neutral-100 rounded-full"
        >
          Suivant
          <ArrowRight size={16} />
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-300 cursor-not-allowed">
          Suivant
          <ArrowRight size={16} />
        </div>
      )}
    </div>
  );
}
