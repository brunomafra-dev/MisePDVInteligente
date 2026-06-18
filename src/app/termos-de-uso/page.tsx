import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { termsOfUse } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Termos de Uso | Mise",
  description: "Termos de uso, licenca SaaS e avisos operacionais do Mise.",
};

export default function TermsOfUsePage() {
  return <LegalDocumentPage document={termsOfUse} />;
}
