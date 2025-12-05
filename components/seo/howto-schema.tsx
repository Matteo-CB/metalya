import { WithContext, HowTo } from "schema-dts";

interface Step {
  title: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  image: string;
  steps: Step[];
}

export function HowToSchema({
  name,
  description,
  image,
  steps,
}: HowToSchemaProps) {
  const jsonLd: WithContext<HowTo> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: name,
    description: description,
    image: image,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.text,
      image: step.image || image,
      url: `${process.env.NEXT_PUBLIC_URL}/#step-${index + 1}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
