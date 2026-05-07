import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { dataProcessingAgreement } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "Acordo de Tratamento de Dados | Sabore",
  description: "Anexo LGPD para controlador, operador e suboperadores do Sabore.",
};

export default function DataProcessingAgreementPage() {
  return <LegalDocumentPage document={dataProcessingAgreement} />;
}
