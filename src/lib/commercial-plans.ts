export type CommercialPlan = {
  code: PlanCode;
  name: string;
  price: string;
  monthlyPrice: number;
  subtitle: string;
  includes: string[];
  note?: string;
  highlighted?: boolean;
  features: PlanFeature[];
};

export type PlanCode = "essential" | "operation";

export type PlanFeature =
  | "pdv"
  | "tables"
  | "cash"
  | "catalog"
  | "manualStock"
  | "nonFiscalReceipt"
  | "basicReports"
  | "kds"
  | "recipes"
  | "autoStock"
  | "realCmv"
  | "lots"
  | "internalDelivery";

export type CommercialAddon = {
  name: string;
  price: string;
  setup?: string;
  description: string;
  includes: string[];
  note?: string;
};

export const corePlans: CommercialPlan[] = [
  {
    code: "essential",
    name: "Essencial",
    price: "R$59,90/mes",
    monthlyPrice: 59.9,
    subtitle: "Para organizar a operacao basica do dia a dia.",
    includes: [
      "PDV para lancar vendas",
      "Balcao, mesas e comandas",
      "Abertura e fechamento de caixa",
      "Cadastro de cardapio, mesas e itens do menu",
      "Estoque manual com entrada e saida",
      "Conta/recibo nao fiscal",
      "Relatorios basicos de venda e caixa",
    ],
    note: "Nao emite nota fiscal. Gera apenas conta/recibo nao fiscal.",
    features: [
      "pdv",
      "tables",
      "cash",
      "catalog",
      "manualStock",
      "nonFiscalReceipt",
      "basicReports",
    ],
  },
  {
    code: "operation",
    name: "Operacao",
    price: "R$89,90/mes",
    monthlyPrice: 89.9,
    subtitle: "Para controlar cozinha, estoque e desperdicio.",
    includes: [
      "Tudo do Essencial",
      "KDS, painel de cozinha",
      "Ficha tecnica dos produtos",
      "Baixa automatica de estoque por venda",
      "CMV real por produto",
      "Controle de lotes e validade",
      "Delivery proprio dentro do Sabore",
      "Pedidos feitos no Sabore baixam estoque automaticamente",
    ],
    highlighted: true,
    features: [
      "pdv",
      "tables",
      "cash",
      "catalog",
      "manualStock",
      "nonFiscalReceipt",
      "basicReports",
      "kds",
      "recipes",
      "autoStock",
      "realCmv",
      "lots",
      "internalDelivery",
    ],
  },
];

export const addonPlans: CommercialAddon[] = [
  {
    name: "Site Delivery Proprio",
    setup: "R$300 setup",
    price: "R$39,90/mes",
    description: "Cardapio online para pedido proprio cair direto no Sabore.",
    includes: [
      "Cardapio publico do estabelecimento",
      "Link para Instagram e WhatsApp",
      "Pedido direto pelo site",
      "Pedido cai na tela Delivery do Sabore",
      "Taxa de entrega configuravel",
      "Pagamento na entrega ou Pix manual",
    ],
  },
  {
    name: "Fiscal NFC-e",
    setup: "R$399 a R$699 setup",
    price: "Sem mensalidade Sabore",
    description: "Integracao fiscal assistida sem encarecer o plano base.",
    includes: [
      "Configuracao com provedor fiscal parceiro",
      "Custo da API fiscal repassado ou pago direto pelo restaurante",
      "Certificado digital, contador e SEFAZ por conta do restaurante",
      "Uso liberado somente apos checklist fiscal",
    ],
    note: "O Sabore nao substitui contador nem assume dados fiscais do restaurante.",
  },
  {
    name: "iFood",
    setup: "R$299 setup",
    price: "R$99,90/mes",
    description: "Pedidos automaticos do iFood quando houver integracao disponivel.",
    includes: [
      "Pedido aparece no Delivery do Sabore",
      "Origem do pedido identificada",
      "Mapeamento de itens externos",
      "Baixa de estoque quando o item estiver vinculado",
    ],
    note: "Depende de API, parceiro ou homologacao do marketplace.",
  },
  {
    name: "99Food",
    setup: "R$299 setup",
    price: "R$99,90/mes",
    description: "Pedidos automaticos do 99Food quando houver integracao disponivel.",
    includes: [
      "Pedido aparece no Delivery do Sabore",
      "Origem do pedido identificada",
      "Mapeamento de itens externos",
      "Baixa de estoque quando o item estiver vinculado",
    ],
    note: "Depende de API, parceiro ou homologacao do marketplace.",
  },
  {
    name: "WhatsApp Status",
    price: "R$29,90/mes",
    description: "Mensagens simples de acompanhamento do pedido.",
    includes: [
      "Status do pedido",
      "Link do cardapio",
      "Aviso de pedido pronto",
      "Aviso de saiu para entrega",
    ],
    note: "Custos Meta/WhatsApp podem ser repassados conforme volume.",
  },
  {
    name: "Agente IA WhatsApp",
    setup: "R$399 setup",
    price: "R$99,90/mes",
    description: "Atendimento inicial com IA sem prometer humano automatico infinito.",
    includes: [
      "Respostas para duvidas simples",
      "Envio de cardapio e link do delivery",
      "Direcionamento para pedido proprio",
      "Encaminhamento para humano quando necessario",
    ],
    note: "Custos Meta/WhatsApp e excedentes podem ser cobrados a parte.",
  },
];

export function getPlanByCode(planCode: string | null | undefined) {
  return corePlans.find((plan) => plan.code === planCode) ?? corePlans[0];
}

export function hasPlanFeature(
  planCode: string | null | undefined,
  feature: PlanFeature,
) {
  return getPlanByCode(planCode).features.includes(feature);
}
