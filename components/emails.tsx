import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Hr,
  Markdown,
} from "@react-email/components";

interface MetalyaNewsletterProps {
  subject: string;
  content: string;
  unsubscribeUrl: string; // <--- NOUVELLE PROP
}

export const MetalyaNewsletter = ({
  subject,
  content,
  unsubscribeUrl,
}: MetalyaNewsletterProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Metalya.</Text>
            <Text style={tagline}>
              L'essentiel de la culture, tech et actualité.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={contentSection}>
            <Heading style={h1}>{subject}</Heading>
            <Markdown
              markdownCustomStyles={{
                h1: h2,
                h2: h2,
                p: paragraph,
                li: paragraph,
                link: link,
              }}
            >
              {content}
            </Markdown>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Envoyé par Metalya
              <br />
              Vous recevez cet email car vous êtes abonné à notre newsletter.
            </Text>
            {/* Utilisation du lien dynamique */}
            <Link href={unsubscribeUrl} style={link}>
              Se désabonner
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// STYLES (Inline CSS pour compatibilité Email)
const main = {
  backgroundColor: "#fafafa",
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  fontFamily: '"Times New Roman", serif', // Style Metalya
  color: "#0a0a0a",
  margin: "0",
};

const tagline = {
  fontSize: "14px",
  color: "#666666",
  marginTop: "8px",
};

const contentSection = {
  padding: "20px 0",
};

const h1 = {
  fontSize: "28px",
  fontWeight: "bold",
  fontFamily: '"Times New Roman", serif',
  color: "#0a0a0a",
  margin: "0 0 20px",
};

const h2 = {
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "24px",
  marginBottom: "12px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
  marginBottom: "16px",
};

const link = {
  color: "#0a0a0a",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "20px 0",
};

const footer = {
  textAlign: "center" as const,
  marginTop: "30px",
};

const footerText = {
  fontSize: "12px",
  color: "#8898aa",
  lineHeight: "20px",
  marginBottom: "10px",
};
