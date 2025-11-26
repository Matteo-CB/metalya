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
  Hr,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmail = ({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nouveau message de {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={h1}>Nouveau Contact</Heading>
            <Text style={text}>
              <strong>De :</strong> {name} ({email})
            </Text>
            <Text style={text}>
              <strong>Sujet :</strong> {subject}
            </Text>
            <Hr style={hr} />
            <Text style={paragraph}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles simplifiés pour la lisibilité interne
const main = { backgroundColor: "#ffffff", fontFamily: "sans-serif" };
const container = {
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  margin: "40px auto",
  padding: "20px",
  maxWidth: "600px",
};
const h1 = {
  color: "#000",
  fontSize: "24px",
  fontWeight: "bold",
  paddingBottom: "20px",
};
const text = { color: "#333", fontSize: "14px", margin: "10px 0" };
const paragraph = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  whiteSpace: "pre-wrap" as const,
};
const hr = { borderColor: "#cccccc", margin: "20px 0" };
