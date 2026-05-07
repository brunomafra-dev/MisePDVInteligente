function optionalEnv(name: string) {
  const value = process.env[name]?.trim();

  return value || undefined;
}

export function getServerEnv() {
  return {
    supabaseUrl: optionalEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: optionalEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceRoleKey: optionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
    focusNfeToken: optionalEnv("FOCUS_NFE_TOKEN"),
    focusNfeBaseUrl: optionalEnv("FOCUS_NFE_BASE_URL") ?? "https://api.focusnfe.com.br/v2",
    mercadoPagoAccessToken: optionalEnv("MERCADO_PAGO_ACCESS_TOKEN"),
    mercadoPagoBaseUrl: optionalEnv("MERCADO_PAGO_BASE_URL") ?? "https://api.mercadopago.com",
    whatsappAccessToken: optionalEnv("WHATSAPP_ACCESS_TOKEN"),
    whatsappPhoneNumberId: optionalEnv("WHATSAPP_PHONE_NUMBER_ID"),
    whatsappGraphBaseUrl:
      optionalEnv("WHATSAPP_GRAPH_BASE_URL") ?? "https://graph.facebook.com",
    whatsappGraphVersion: optionalEnv("WHATSAPP_GRAPH_VERSION") ?? "v22.0",
  };
}
