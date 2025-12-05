"use client";

import { usePathname } from "next/navigation";

export function SpeculationRules() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          prerender: [
            {
              source: "document",
              where: {
                and: [
                  { href_matches: "/*" },
                  { not: { href_matches: "/admin/*" } },
                  { not: { href_matches: "/logout" } },
                  { not: { href_matches: "/api/*" } },
                ],
              },
              eagerness: "moderate",
            },
          ],
        }),
      }}
    />
  );
}
