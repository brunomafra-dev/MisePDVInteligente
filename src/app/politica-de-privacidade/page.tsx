import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { privacyPolicy } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Politica de Privacidade | Mise",
  description: "Politica de privacidade e protecao de dados pessoais do Mise.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document={privacyPolicy} />;
}
