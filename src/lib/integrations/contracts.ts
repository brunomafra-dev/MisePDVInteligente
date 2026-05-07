import { z } from "zod";
import {
  emailField,
  optionalTextField,
  positiveMoneyField,
  quantityField,
  textField,
} from "@/lib/security/sanitize";

export const fiscalItemSchema = z.object({
  sku: textField(80),
  name: textField(160),
  quantity: quantityField(500),
  unitPrice: positiveMoneyField(),
  ncm: optionalTextField(12),
  cfop: optionalTextField(8),
});

export const fiscalCustomerSchema = z.object({
  name: optionalTextField(160),
  cpf: optionalTextField(20),
  phone: optionalTextField(30),
});

export const issueNfceSchema = z.object({
  unitId: textField(80),
  orderId: textField(80),
  reference: textField(80),
  customer: fiscalCustomerSchema.optional(),
  items: z.array(fiscalItemSchema).min(1).max(100),
  payments: z.array(
    z.object({
      method: textField(40),
      amount: positiveMoneyField(),
    }),
  ).min(1).max(20),
  delivery: z.boolean().default(false),
  total: positiveMoneyField(),
});

export const createPaymentSchema = z.object({
  unitId: textField(80),
  orderId: textField(80),
  amount: positiveMoneyField(),
  method: z.enum(["pix", "card"]),
  customerEmail: emailField().optional(),
});

export const whatsappTemplateSchema = z.object({
  unitId: textField(80),
  to: textField(30, 8),
  templateName: textField(80),
  parameters: z.record(textField(80), textField(500)).default({}),
});

export type IssueNfceInput = z.infer<typeof issueNfceSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type WhatsAppTemplateInput = z.infer<typeof whatsappTemplateSchema>;

export interface FiscalResult {
  provider: "focus-nfe" | "mock";
  status: "authorized" | "rejected" | "queued";
  reference: string;
  accessKey?: string;
  pdfUrl?: string;
  xmlUrl?: string;
  rejectionReason?: string;
}

export interface PaymentResult {
  provider: "mercado-pago" | "mock";
  status: "pending" | "approved" | "rejected";
  externalId: string;
  qrCode?: string;
  checkoutUrl?: string;
}

export interface WhatsAppResult {
  provider: "whatsapp-cloud" | "mock";
  status: "queued" | "sent" | "failed";
  messageId?: string;
}

export interface FiscalProvider {
  issueNfce(input: IssueNfceInput): Promise<FiscalResult>;
}

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
}

export interface WhatsAppProvider {
  sendTemplate(input: WhatsAppTemplateInput): Promise<WhatsAppResult>;
}
