# Sabore PDV Inteligente

SaaS/PDV para restaurantes locais, com pedidos, caixa, estoque, ficha técnica, CMV, validade, recibo não fiscal e módulos opcionais.

[Demo ativa](https://sabore-pdv-inteligente.vercel.app)

## Por que esse projeto existe

Restaurantes pequenos normalmente precisam operar pedidos, estoque, caixa, delivery e custos com ferramentas separadas ou planilhas. O Sabore foi criado como um MVP de operação comercial para centralizar esse fluxo de forma simples.

O projeto conecta minha experiência anterior em cozinha e operação com desenvolvimento de software: regras de negócio, rotina de equipe, controle de estoque, margem e fluxo de atendimento.

## Funcionalidades

- Pedidos de balcão, mesa e delivery próprio.
- Cozinha e fluxo operacional de preparo.
- Caixa manual e recibo não fiscal.
- Gestão de produtos, estoque e validade.
- Ficha técnica e cálculo de CMV.
- Site público de delivery.
- Páginas públicas de suporte, termos, privacidade, cookies e LGPD.
- Integrações mockadas para WhatsApp, Mercado Pago e NFC-e.
- Testes de domínio para pedidos, estoque, caixa e segurança de payload.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase
- Zod
- Lucide React
- Playwright
- TSX test runner

## Arquitetura

```txt
src/
  app/
    app/
    delivery/
    site/
    api/
      sabore/
      delivery/
      payments/
      fiscal/
      whatsapp/
  components/
    sabore-app.tsx
    sabore-auth-shell.tsx
  features/
    delivery-proprio/
  lib/
    operations.ts
    sabore-mutations.ts
    demo-data.ts
    integrations/
supabase/
  schema.sql
  seed.sql
tests/
```

## Modelo comercial simulado

- Essencial: R$59,90/mês.
- Operação: R$89,90/mês.
- Site Delivery Próprio: R$300 setup + R$39,90/mês.
- Fiscal NFC-e: setup separado, com custos de API/certificado/contabilidade.
- iFood/99Food: módulos assistidos conforme disponibilidade de API/parceiros.
- WhatsApp Status e Agente IA WhatsApp como módulos opcionais.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Copie `.env.example` para `.env.local` e preencha apenas o que for usar:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FOCUS_NFE_TOKEN=
MERCADO_PAGO_ACCESS_TOKEN=
WHATSAPP_ACCESS_TOKEN=
```

## Supabase

Para usar o modelo inicial de dados:

```bash
supabase db reset
```

Ou execute manualmente:

```bash
supabase/schema.sql
supabase/seed.sql
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:browser
```

## Aprendizados

- Sistemas de operação exigem regras de negócio claras antes da interface.
- Estoque, pedidos e caixa precisam de consistência, validação e testes.
- Experiência real em operação ajuda a pensar casos que não aparecem em CRUD simples.
- Mesmo um MVP precisa comunicar limites: fiscal, pagamentos e integrações externas.

## Próximos passos

- Melhorar README com prints reais da demo.
- Evoluir autenticação e multiempresa.
- Trocar mocks por integrações reais conforme credenciais/API.
- Criar mais testes de fluxo operacional.
- Refinar dashboard de indicadores para margem, estoque e vendas.

## Documentação

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/product-plan-alignment.md`](docs/product-plan-alignment.md)
- [`docs/legal/lgpd-launch-checklist.md`](docs/legal/lgpd-launch-checklist.md)

