# Mise PDV Inteligente

Operacao inteligente para restaurantes.

SaaS/PDV para restaurantes locais, com pedidos, caixa, estoque, ficha tecnica, CMV, validade, recibo nao fiscal e modulos opcionais.

## Por que esse projeto existe

Restaurantes pequenos normalmente precisam operar pedidos, estoque, caixa, delivery e custos com ferramentas separadas ou planilhas. O Mise foi criado como um MVP de operacao comercial para centralizar esse fluxo de forma simples.

O projeto conecta experiencia real em cozinha e operacao com desenvolvimento de software: regras de negocio, rotina de equipe, controle de estoque, margem e fluxo de atendimento.

## Funcionalidades

- Pedidos de balcao, mesa e delivery proprio.
- Cozinha e fluxo operacional de preparo.
- Caixa manual e recibo nao fiscal.
- Gestao de produtos, estoque e validade.
- Ficha tecnica e calculo de CMV.
- Site publico de delivery.
- Paginas publicas de suporte, termos, privacidade, cookies e LGPD.
- Integracoes mockadas para WhatsApp, Mercado Pago e NFC-e.
- Testes de dominio para pedidos, estoque, caixa e seguranca de payload.

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
      mise/
      delivery/
      payments/
      fiscal/
      whatsapp/
  components/
    mise-app.tsx
    mise-auth-shell.tsx
  features/
    delivery-proprio/
  lib/
    operations.ts
    mise-mutations.ts
    demo-data.ts
    integrations/
supabase/
  schema.sql
  seed.sql
tests/
```

## Rotas

- `/`: Mise app and authentication flow.
- `/site`: public landing page.
- `/suporte`: public support and contact guidance.
- `/termos-de-uso`: terms of use draft.
- `/politica-de-privacidade`: privacy policy draft.
- `/politica-de-cookies`: cookie policy draft.
- `/acordo-de-tratamento-de-dados`: LGPD data processing agreement draft.
- `/app`: legacy redirect to `/`.

## Modelo comercial simulado

- Essencial: R$59,90/mes.
- Operacao: R$89,90/mes.
- Site Delivery Proprio: R$300 setup + R$39,90/mes.
- Fiscal NFC-e: setup separado, com custos de API/certificado/contabilidade.
- iFood/99Food: modulos assistidos conforme disponibilidade de API/parceiros.
- WhatsApp Status e Agente IA WhatsApp como modulos opcionais.

## Env Vars

Copie `.env.example` para `.env.local` e preencha apenas o que for usar:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FOCUS_NFE_TOKEN`
- `FOCUS_NFE_BASE_URL`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_BASE_URL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_GRAPH_BASE_URL`
- `WHATSAPP_GRAPH_VERSION`

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

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

- Sistemas de operacao exigem regras de negocio claras antes da interface.
- Estoque, pedidos e caixa precisam de consistencia, validacao e testes.
- Experiencia real em operacao ajuda a pensar casos que nao aparecem em CRUD simples.
- Mesmo um MVP precisa comunicar limites: fiscal, pagamentos e integracoes externas.

## Proximos passos

- Configurar dominio definitivo da marca Mise.
- Melhorar README com prints reais da demo.
- Evoluir autenticacao e multiempresa.
- Trocar mocks por integracoes reais conforme credenciais/API.
- Criar mais testes de fluxo operacional.
- Refinar dashboard de indicadores para margem, estoque e vendas.

## Documentacao

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/product-plan-alignment.md`](docs/product-plan-alignment.md)
- [`docs/legal/lgpd-launch-checklist.md`](docs/legal/lgpd-launch-checklist.md)
