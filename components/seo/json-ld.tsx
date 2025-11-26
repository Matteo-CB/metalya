import { WithContext, Article } from "schema-dts";

interface JsonLdProps {
  data: WithContext<Article>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
