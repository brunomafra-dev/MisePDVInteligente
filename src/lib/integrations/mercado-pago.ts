import { getServerEnv } from "@/lib/env/server";
import type {
  CreatePaymentInput,
  PaymentProvider,
  PaymentResult,
} from "./contracts";

export class MockPaymentProvider implements PaymentProvider {
  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    return {
      provider: "mock",
      status: "pending",
      externalId: `mock-mp-${input.orderId}`,
      qrCode: input.method === "pix" ? "00020101021226880014br.gov.bcb.pix" : undefined,
      checkoutUrl: `/checkout/${input.orderId}`,
    };
  }
}

export class MercadoPagoProvider implements PaymentProvider {
  constructor(
    private readonly accessToken: string,
    private readonly baseUrl = "https://api.mercadopago.com",
  ) {}

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const response = await fetch(`${this.baseUrl}/v1/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": `${input.unitId}-${input.orderId}-${input.method}`,
      },
      body: JSON.stringify({
        transaction_amount: input.amount,
        description: `Pedido Mise ${input.orderId}`,
        payment_method_id: input.method === "pix" ? "pix" : "credit_card",
        payer: { email: input.customerEmail ?? "cliente@mise.local" },
        external_reference: input.orderId,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

    return {
      provider: "mercado-pago",
      status: response.ok ? "pending" : "rejected",
      externalId: String(data.id ?? `${input.orderId}-rejected`),
      qrCode:
        typeof data.point_of_interaction === "object"
          ? JSON.stringify(data.point_of_interaction)
          : undefined,
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  const env = getServerEnv();

  return env.mercadoPagoAccessToken
    ? new MercadoPagoProvider(
        env.mercadoPagoAccessToken,
        env.mercadoPagoBaseUrl,
      )
    : new MockPaymentProvider();
}
