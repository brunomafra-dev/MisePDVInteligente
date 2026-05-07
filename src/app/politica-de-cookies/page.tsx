import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { cookiePolicy } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Politica de Cookies | Sabore",
  description: "Politica de cookies e tecnologias similares do Sabore.",
};

export default function CookiePolicyPage() {
  return <LegalDocumentPage document={cookiePolicy} />;
}
