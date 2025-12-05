import { WithContext, SpeakableSpecification } from "schema-dts";

export function SpeakableSchema() {
  const jsonLd: WithContext<SpeakableSpecification> = {
    "@context": "https://schema.org",
    "@type": "SpeakableSpecification",
    cssSelector: ["#speakable-title", "#speakable-summary"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
