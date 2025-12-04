import { WithContext, BreadcrumbList } from "schema-dts";

interface BreadcrumbsProps {
  items: { name: string; item: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
