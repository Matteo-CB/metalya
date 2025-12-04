"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [headings, setHeadings] = useState<
    { id: string; text: string; level: number }[]
  >([]);

  useEffect(() => {
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const extracted = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      extracted.push({ id, text, level });
    }
    setHeadings(extracted);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    extracted.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block sticky top-32 self-start w-64 shrink-0 order-2 lg:ml-12">
      <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-widest text-neutral-400">
        <List size={16} />
        Sommaire
      </div>
      <ul className="space-y-3 border-l border-neutral-200 pl-4">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              "text-sm transition-colors duration-200",
              heading.level === 3 && "pl-4",
              activeId === heading.id
                ? "font-bold text-indigo-600"
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
