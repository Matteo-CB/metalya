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
  Button,
  Hr,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetLink: string;
}

export const ResetPasswordEmail = ({ resetLink }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisation de votre mot de passe Metalya</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Heading style={h1}>Réinitialisation</Heading>
            <Text style={text}>
              Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur
              le lien ci-dessous pour en créer un nouveau.
            </Text>
            <Button style={button} href={resetLink}>
              Réinitialiser mon mot de passe
            </Button>
            <Text style={subText}>
              Si vous n'êtes pas à l'origine de cette demande, ignorez cet
              email. Ce lien expirera dans 1 heure.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = { backgroundColor: "#ffffff", fontFamily: "sans-serif" };
const container = {
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  margin: "40px auto",
  padding: "20px",
  maxWidth: "600px",
};
const h1 = { color: "#000", fontSize: "24px", fontWeight: "bold" };
const text = { color: "#333", fontSize: "16px", margin: "20px 0" };
const subText = { color: "#666", fontSize: "12px", marginTop: "20px" };
const button = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "5px",
  textDecoration: "none",
  fontWeight: "bold",
  display: "inline-block",
};
